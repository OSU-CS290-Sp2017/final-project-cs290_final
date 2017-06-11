/*******************************************
 *
 *******************************************/
if( document.readyState === 'complete' ){
  console.log( 'Document already loaded.' );
  initListeners();
}
else{
  console.log( 'Added DOM content listener' );
  window.addEventListener( 'DOMContentLoaded', function(){
    console.log( 'DOM content listener fired.' );
    initListeners();
  });
}


/*******************************************
 *
 *******************************************/
function initListeners(){

  var searchPostsButton = document.getElementById( 'search-posts-button' );
  if(searchPostsButton){searchPostsButton.addEventListener( 'click', getSearchResults );}

  var openCreatePostMenuButton = document.getElementById( 'create-post-button' );
  if(openCreatePostMenuButton){openCreatePostMenuButton.addEventListener( 'click', openCreatePostMenu );}

  var createPostCancelButton = document.getElementById( 'post-cancel' );
  if(createPostCancelButton){createPostCancelButton.addEventListener( 'click', closeCreatePostMenu );}

  var createPostSubmitButton = document.getElementById( 'post-submit' );
  if(createPostSubmitButton){createPostSubmitButton.addEventListener( 'click', createNewPost );}

  var openCreateCommentMenuButton = document.getElementById( 'create-comment-button' );
  if(openCreateCommentMenuButton){openCreateCommentMenuButton.addEventListener( 'click', openCreateCommentMenu );}

  var createCommentCancelButton = document.getElementById( 'comment-cancel' );
  if(createCommentCancelButton){createCommentCancelButton.addEventListener( 'click', closeCreateCommentMenu );}

  var createCommentSubmitButton = document.getElementById( 'comment-submit' );
  if(createCommentSubmitButton){createCommentSubmitButton.addEventListener( 'click', createNewComment );}

  var switchThemesButton = document.getElementById( 'theme-toggle' );
  if(switchThemesButton){switchThemesButton.addEventListener( 'click', switchThemes );}

}


/*******************************************
 * Opens the menu to create a post
 *******************************************/
function openCreatePostMenu(){
  var createPostMenu = document.getElementById( 'create-post-body' );
  createPostMenu.classList.remove( 'closed' );
}


/*******************************************
 * Closes the menu to create a post
 *******************************************/
function closeCreatePostMenu(){
  var createPostMenu = document.getElementById( 'create-post-body' );
  createPostMenu.classList.add( 'closed' );
  clearInputs( "post" );
}


/*******************************************
 *
 *******************************************/
function openCreateCommentMenu(){
  var createCommentMenu = document.getElementById( 'create-comment-body' );
  createCommentMenu.classList.remove( 'closed' );
}


/*******************************************
 *
 *******************************************/
function closeCreateCommentMenu(){
  var createCommentMenu = document.getElementById( 'create-comment-body' );
  createCommentMenu.classList.add( 'closed' );
  clearInputs( "comment" );
}


/*******************************************
 * Clears the inputs for the create menus
 *******************************************/
function clearInputs( typeOfInput ){

  if( typeOfInput === "comment" ){
    document.getElementById("comment-input").value = '';
  }
  else if( typeOfInput === "post" ){
    document.getElementById("post-title-input").value = '';
    document.getElementById("post-content-input").value = '';
  }

}


function switchThemes(){
  var entirePage = document.getElementById( 'document-body' );
  entirePage.classList.toggle( 'lightTheme' );
  entirePage.classList.toggle( 'darkTheme' );
}


/*******************************************
 *
 *******************************************/
function getSearchResults(){

  var searchQuery = document.getElementById( 'search-posts' ).value.trim();
  console.log(searchQuery);

  if( searchQuery !== '' ){
    var searchReq = new XMLHttpRequest;
    var searchReqUrl = '/posts/searchresults';

    searchReq.open( 'GET', searchReqUrl );
    searchReq.setRequestHeader( 'Content-Type', 'text/html' );

    postReq.addEventListener( 'load', function(event){
      var error;
      if( event.target.status !== 200 ){
        error = event.target.response;
      }
      callback( error );
    });

    postReq.send( searchQuery );

  }

}


/*******************************************
 *
 *******************************************/
function createNewPost(){

  var newPostTitle = document.getElementById( 'post-title-input' ).value;
  var newPostContent = document.getElementById( 'post-content-input' ).value;

  if( (newPostTitle.trim() !== '') && (newPostContent.trim() !== '') ){

    var newPostTime = getTimestamp();
    var newPostID = createPostID( newPostTime, newPostTitle );

    var newPostObject = {
      postid: newPostID,
      title: newPostTitle,
      timestamp: newPostTime,
      postContent: newPostContent
    };

    uploadPost( newPostObject, "/posts/createNewPost", function(err){
      if(err){
        alert("Error creating post.");
      }
      else{
        console.log("Success adding post.");
      }
    });

    closeCreatePostMenu();
    addNewPostToDOM();

  }
  else{
    alert("You cannot make a blank post, and all posts must have a title.");
  }

}


/*******************************************
 *
 *******************************************/
function createNewComment(){

  var newComment = document.getElementById( 'comment-input' ).value;

  if( newComment.trim() !== '' ){

    var newCommentTime = getTimestamp();
    var onPostID = getPostIDforComment();

    if( onPostID !== '' ){
      var newCommentObject = {
        postid: onPostID,
        timestamp: newCommentTime,
        commentContent: newComment
      };
      uploadPost( newCommentObject, "/posts/" + onPostID + "/createNewComment", function(err){
        if(err){
          alert("Error creating comment.");
        }
        else{
          console.log("Success adding comment.");
        }
      });
    }

    closeCreateCommentMenu();
    addNewCommentToDOM();

  }
  else{
    alert("You cannot leave a blank comment.");
  }

}


/*******************************************
 *
 *******************************************/
function uploadPost( newPost, url, callback ){
  var postReqUrl = url;
  var postReq = new XMLHttpRequest();

  postReq.open( 'POST', postReqUrl );
  postReq.setRequestHeader( 'Content-Type', 'application/json' );

  postReq.addEventListener( 'load', function(event){
    var error;
    if( event.target.status !== 200 ){
      error = event.target.response;
    }
    callback( error );
  });

  postReq.send( JSON.stringify(newPost) );

}


/*******************************************
 * Creates a (mostly) unique ID by truncating
 * and concatenating the title and date
 *******************************************/
function createPostID( time, title ){
  var trimmedTitle = title.substring(0, 15);
  var trimmedTime = time.substring(13,14) + time.substring(15,16);
  return trimmedTitle + trimmedTime;
}


/*******************************************
 *
 *******************************************/
function getPostIDforComment(){
  var postUrlPath = window.location.pathname.split('/');
  if( postUrlPath[0] !== '' && postUrlPath[1] !== 'posts' ){
    return NULL;
  }
  return postUrlPath[2];
}


/*******************************************
 * Creates a string for the current time in
 * the format YYYY:MM:DD:HH:MM:SS
 * FIXME
 *******************************************/
function getTimestamp(){

  var time = new Date();

  var year = time.getFullYear();

  var month = time.getMonth()+1;
  month = ( month < 10 ? "0" : "" );

  var day = time.getDate();
  day = ( day < 10 ? "0" : "" );

  var hour = time.getHours();
  hour = ( hour < 10 ? "0" : "" ) + hour;

  var min = time.getMinutes();
  min = ( min < 10 ? "0" : "" ) + min;

  var sec = time.getSeconds();
  sec = ( sec < 10 ? "0" : "" );

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}


/*******************************************
 *
 *******************************************/
function addNewPostToDOM(){

}


/*******************************************
 *
 *******************************************/
 function addNewCommentToDOM(){

 }
