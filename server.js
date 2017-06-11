var fs = require( 'fs' );
var path = require( 'path' );
var express = require( 'express' );
var handlebars = require( 'handlebars' );
var expressHandlebars = require( 'express-handlebars' );
var bodyParser = require( 'body-parser' );
var MongoClient = require( 'mongodb' ).MongoClient;

var mongoHost = process.env.MONGO_HOST;
var mongoPort = process.env.MONGO_PORT || 27017;
var mongoUser = process.env.MONGO_USER;
var mongoPassword = process.env.MONGO_PASSWORD;
var mongoDBName = process.env.MONGO_DB;
var url = 'mongodb://localhost:27017/database';
//var url = 'mongodb://' + mongoUser + ':' + mongoPassword + '@' + mongoHost + ':' + mongoPort + '/' + mongoDBName;
var mongodb;

console.log( 'mongo url', url );

var app = express();
var port = process.env.PORT || 3000;

app.engine( 'handlebars', expressHandlebars({ defaultLayout: 'main' }));
app.use( bodyParser.json() );
app.set( 'view engine', 'handlebars' );


/*******************************************
 *
 *******************************************/
app.get( '/', function( req, res, next ){

  var collection = mongodb.collection( 'posts' );

  collection.find({}).toArray(function( err, postSet ){
    if( err ){
      res.status( 500 ).send( "Error getting posts" );
    }
    else{
      var tempArgs = {posts: postSet};
      res.status( 200 ).render( 'boardPage', tempArgs );
    }
  });

});


/*******************************************
 *
 *******************************************/
app.get( '/posts/searchresults', function( res, req, next ){

  if( req.body.searchQuery ){

    var collection = mongodb.collection( 'posts' );

    collection.find( {$or: [{title: /.*req.body.searchQuery.*/}, {postContent: /.*req.body.searchQuery.*/}] } ).toArray( function( err, postSet ){
      if(err){
        res.status( 500 ).send( "Error getting posts." );
      }
      else{
        var tempArgs = {posts: postSet};
        res.status( 200 ).render( 'boardPage', tempArgs );
      }
    });

  }
  else{
    next();
  }

});


/*******************************************
 *
 *******************************************/
app.get( '/posts/random', function( req, res, next ){

  var collection = mongodb.collection( 'posts' );
  var collectionCom = mongodb.collection( 'comments' );

  collection.aggregate( {$sample: {size: 1} } ).toArray( function( err, postSet ){
    if(err){
      res.status( 500 ).send( "Error getting post." );
    }
    else if ( postSet.length < 1 ){
      console.log( "No matching posts found when randoming." );
      next();
    }
    else{

      res.writeHead(302,{location:"/posts/"+postSet[0].postid});
      res.end();

      // var postThis = [postSet[0]];
      // var postid = postSet[0].postid;
      // console.log( postid );
      // console.log( "Matching random post found." );
      // collectionCom.find({postid:postid}).toArray( function( err, commentSet ){
      //   if(err){
      //     res.status( 500 ).send( "Error getting comments." );
      //   }
      //   else{
      //     var tempArgs = {
      //       comments: commentSet,
      //       posts: postThis};
      //     res.status( 200 ).render( 'postPage', tempArgs );
      //   }
      // });
    }
  });

});


/*******************************************
 *
 *******************************************/
app.get( '/posts/:postid', function( req, res, next ){

  var postid = req.params.postid;
  console.log( 'post id:', req.params.postid );
  var collection = mongodb.collection( 'posts' );
  var collectionCom = mongodb.collection( 'comments' );

  collection.find( { postid: postid } ).toArray( function( err, postSet ){
    if( err ){
      res.status( 500 ).send( "Error getting post" );
    }
    else if ( postSet.length < 1 ){
      console.log( "No matching posts found for ID" );
      next();
    }
    else{
      collectionCom.find({postid:postid}).toArray( function( err, commentSet ){
        if(err){
          res.status( 500 ).send( "Error getting comments" );
        }
        else{
          var postThis = [postSet[0]];
          var tempArgs = {
            comments: commentSet,
            posts: postThis};
          res.status( 200 ).render( 'postPage', tempArgs );
        }
      });
    }
  });

});


/*******************************************
 *
 *******************************************/
app.post('/posts/createNewPost', function( req, res, next){

  if( req.body ){

    var collection = mongodb.collection( 'posts' );
    var collectionAnim = mongodb.collection( 'animals' );

    var animalNum = Math.floor( Math.random() * 15 );
    console.log(animalNum);
    if(animalNum===15){animalNum=14;}
    var animalThis;

    collectionAnim.find( {num: animalNum} ).toArray( function(err, animalSet){

      if(err){
        console.log("Error getting animal.");
        res.status( 500 ).send( "Error getting animal" );
      }
      else{
        console.log(animalSet);

        var postData = {
          postid: req.body.postid,
          title: req.body.title,
          timestamp: req.body.timestamp,
          animalUrl: animalSet[0].url,
          postedBy: animalSet[0].name,
          postContent: req.body.postContent
        };

        collection.insertOne( postData, function( err ){
          if( err ){
            res.status( 500 ).send( "Couldn't add to database " + err );
          }
          else{
            res.status( 200 ).send();
          }
        });

      }
    });

  }
  else{
    console.log("Failed to add post to database.");
    res.status( 200 ).send( "Couldn't find data to submit." );
  }

});


/*******************************************
 *
 *******************************************/
app.post( '/posts/:postid/createNewComment', function( req, res, next ){

  if( req.body && req.body.postid ){

    var collectionCom = mongodb.collection( 'comments' );
    var collectionAnim = mongodb.collection( 'animals' );

    var animalNum = Math.floor( Math.random() * 15 );
    if(animalNum===15){animalNum=14;}
    var animalThis;

    collectionAnim.find( {num: animalNum} ).toArray( function(err, animalSet){

      if(err){
        console.log("Error getting animal.");
        res.status( 500 ).send( "Error getting animal" );
      }
      else{

        var commentData = {
          postid: req.body.postid,
          commentid: req.body.commentid,
          timestamp: req.body.timestamp,
          animalUrl: animalSet[0].url,
          postedBy: animalSet[0].name,
          commentContent: req.body.commentContent
        };

        collectionCom.insertOne( commentData, function( err ){
          if( err ){
            res.status( 500 ).send( "Couldn't add to database " + err );
          }
          else{
            res.status( 200 ).send();
          }
        });

      }
    });

  }
  else{
    console.log("Failed to add comment to database.");
    res.status( 500 ).send( "Couldn't find post to leave comment on." );
  }

});


/*******************************************
 *
 *******************************************/
app.use( express.static( path.join( __dirname, 'public' ) ) );


/*******************************************
 *
 *******************************************/
app.get( '*', function( req, res, next ){
  res.status( 404 ).render( '404page' );
});


/*******************************************
 *
 *******************************************/
MongoClient.connect( url, function( err, db ){
  if( err ){
    console.log( "Couldn't connect to database" );
    throw( err );
  }
  mongodb = db;
  console.log(mongodb);
  app.listen( port, function(){
    console.log( "Running on port", port );
  });
});
