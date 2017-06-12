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

app.engine( 'handlebars', expressHandlebars({ defaultLayout: 'main' }) );

app.use( bodyParser.json() );
app.use( bodyParser.urlencoded({ extended: true }) );
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
      postSet.reverse();
      var tempArgs = {posts: postSet};
      res.status( 200 ).render( 'boardPage', tempArgs );
    }
  });

});


/*******************************************
 * Serves a set of post links that match the
 * query data passed to the address.
 * FIXME: can only process exact matches.
 *        I couldn't make the regex work
 *******************************************/
app.get( '/searchresults', function( req, res, next ){

  var searchReq = req.query.search;

  if( searchReq !== '' ){

    console.log(searchReq);

    var collection = mongodb.collection('posts');

//  This line works perfectly from the mongo shell, but I can't figure out how to make it work from here.
//  collection.find( {$or:[ {title:{$regex:"/.*"+searchReq+".*/"}}, {postContent:{$regex:"/.*"+searchReq+".*/"}} ]} ).toArray( function( err, postSet ){
//  So instead, I use the version which only finds perfect matches
    collection.find( {$or:[ {title:searchReq},{postContent:searchReq} ]} ).toArray( function( err, postSet ){
      if(err){
        res.status( 500 ).send( "Error getting posts." );
      }
      else{
        postSet.reverse();
        var tempArgs = {posts: postSet};
        console.log( tempArgs );
        res.status( 200 ).render( 'boardPage', tempArgs );
      }
    });

  }
  else{
    console.log("search failed");
    next();
  }

});


/*******************************************
 * Serves a random thread using aggregate
 * and $sample to fetch a random document
 * then redirects using a 302 to that
 * document's page
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
    }
  });

});


/*******************************************
 * Serves the post which matches the passed
 * postid, then serves and attaches the
 * related comments
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
 * POST request which creates a new post,
 * including fetching a random animal from
 * the animal database
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
 * POST request which creates a new comment,
 * including fetching a random animal from
 * the animal database
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
 * Statically serves files from /public
 *******************************************/
app.use( express.static( path.join( __dirname, 'public' ) ) );


/*******************************************
 * Serves 404 page
 *******************************************/
app.get( '*', function( req, res, next ){
  res.status( 404 ).render( '404page' );
});


/*******************************************
 * Connects to the database and starts the
 * server running on the specified port
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
