/*******************************************
 * Checks if the document has loaded. If so,
 * Hooks up the js functionality and checks themes
 *******************************************/
if( document.readyState === 'complete' ){
  console.log( 'Document already loaded.' );
  initListeners();
}
else{
  console.log( 'Added DOM content listener' );
  window.addEventListener( 'DOMContentLoaded', function(){
    console.log( 'DOM content listener fired.' );
    getThemeCookie();
    initListeners();
  });
}


/*******************************************
 * Hooks up js functionality to elements
 *******************************************/
function initListeners(){

  var searchPostsField = document.getElementById( 'search-posts' );
  if(searchPostsField){searchPostsField.addEventListener( 'keypress',function(key){
    if(key.which===13){ getSearchResults(); }
  });}

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
 * Opens the menu to create a comment
 *******************************************/
function openCreateCommentMenu(){
  var createCommentMenu = document.getElementById( 'create-comment-body' );
  createCommentMenu.classList.remove( 'closed' );
}


/*******************************************
 * Closes the menu to create a comment
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


/*******************************************
 * Swaps between the two themes by checking
 * which is currently active, then swapping
 * the classes and assigning the cookie
 *******************************************/
function switchThemes(){
  var entirePage = document.getElementById( 'document-body' );
  if( entirePage.classList.contains( 'lightTheme' ) ){
    entirePage.classList.remove( 'lightTheme' );
    entirePage.classList.add( 'darkTheme' );
    document.cookie = "theme=darkTheme;path=/";
  }
  else if( entirePage.classList.contains( 'darkTheme' ) ){
    entirePage.classList.remove( 'darkTheme' );
    entirePage.classList.add( 'lightTheme' );
    document.cookie = "theme=lightTheme;path=/";
  }
}


/*******************************************
 * Checks if the theme cookie exists, then,
 * if the dark theme cookie exists, swaps
 * themes to dark. If the dark theme cookie
 * doesn't exist, then it just sets the cookie
 * equal to light since that's the default
 *******************************************/
function getThemeCookie(){
  var decodedCookie = decodeURIComponent(document.cookie);
  var cookieArray = decodedCookie.split(';');
  cookieArray = cookieArray[0].split('=');
  if( cookieArray[0] === "theme" && cookieArray[1] === "darkTheme" ){
    console.log("Dark theme cookie found.");
    switchThemes();
  }
  else{
    console.log("Light theme cookie assigned.");
    document.cookie = "theme=lightTheme;path=/";
  }
}


/*******************************************
 * Sends a GET request for the search field
 *******************************************/
function getSearchResults(){

  var query = document.getElementById( 'search-posts' ).value.trim();

  if( query !== '' ){
    query = query.replace(" ","%20");
    var searchReqUrl = '/searchresults?search=' + query;
    console.log( searchReqUrl );
    window.location.href = searchReqUrl;
  }

}


/*******************************************
 * Builds the object for a new post based on
 * data fields, then calls the POST function
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
    addNewPostToDOM( newPostObject );

  }
  else{
    alert("You cannot make a blank post, and all posts must have a title.");
  }

}


/*******************************************
 * Creates the object for a new comment based
 * on text fields, then calls the POST function
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

      closeCreateCommentMenu();
      addNewCommentToDOM( newCommentObject );

    }

  }
  else{
    alert("You cannot leave a blank comment.");
  }

}


/*******************************************
 * Sends a POST request for either a post or
 * comment based on the object and url passed
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

  console.log(newPost);
  console.log(postReq);
  postReq.send( JSON.stringify(newPost) );

}


/*******************************************
 * Creates a (mostly) unique ID by truncating
 * and concatenating the title and date
 *******************************************/
function createPostID( time, title ){
  var trimmedTitle = title.substring(0, 15);
  var trimmedTime = time.substring(15,16) + time.substring(18,19);
  return trimmedTitle + trimmedTime;
}


/*******************************************
 * Checks the postid for the current post to
 * know which post to attach the comment to
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
 *******************************************/
function getTimestamp(){

  var time = new Date();

  var year = time.getFullYear();
  console.log( year );

  var month = time.getMonth()+1;
  month = ( month < 10 ? "0" : "" ) + month;
  console.log( month );

  var day = time.getDate();
  day = ( day < 10 ? "0" : "" ) + day;
  console.log( day );

  var hour = time.getHours();
  hour = ( hour < 10 ? "0" : "" ) + hour;
  console.log( hour );

  var min = time.getMinutes();
  min = ( min < 10 ? "0" : "" ) + min;
  console.log( min );

  var sec = time.getSeconds();
  sec = ( sec < 10 ? "0" : "" ) + sec;
  console.log( sec );

  return year + ":" + month + ":" + day + ":" + hour + ":" + min + ":" + sec;

}


/*******************************************
 *
 *******************************************/
function addNewPostToDOM( postToAdd ){
  var postTemplate = Handlebars.templates['postLink'];
  console.log( postTemplate );
  var newPostObject = {
    postid: postToAdd.postid,
    title: postToAdd.title,
    timestamp: postToAdd.timestamp,
    animalUrl: "#",
    postedBy: "user.",
    postContent: postToAdd.postContent
  }
  var newPost = postTemplate( newPostObject );
  var postContainer = document.getElementById( "main-container" );
  postContainer.insertAdjacentHTML( 'afterbegin', newPost );
}


/*******************************************
 *
 *******************************************/
 function addNewCommentToDOM( commentToAdd ){
   var commentTemplate = Handlebars.templates['comment'];
   var newCommentObject = {
     postid: commentToAdd.postid,
     timestamp: commentToAdd.timestamp,
     animalUrl: "#",
     postedBy: "user.",
     commentContent: commentToAdd.commentContent
   }
   var newComment = commentTemplate( newCommentObject );
   var commentContainer = document.getElementById( "comment-container" );
   commentContainer.insertAdjacentHTML( 'beforeend', newComment );
 }
