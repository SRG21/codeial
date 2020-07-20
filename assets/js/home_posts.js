{
    // method to submit form data for new post using AJAX
    let createPost = function(){
        let newPostForm = $('#new-post-form');

        newPostForm.submit(function(e){
            e.preventDefault();

            $.ajax({
                type: 'post',
                url: '/posts/create',
                data: newPostForm.serialize(),
                success: function(data){
                    let newPost = newPostDom(data.data.post);
                    /*let imgURL = newPostDom(data.data.post.user.avatar);
                    console.log(imgURL);*/
                    $('#posts-list-container>ul').prepend(newPost);

                    // note the space --> it means delete-post-button class inside the newly created object
                    deletePost($(' .delete-post-button', newPost)); 

                    //call the create comment class
                    new PostComments(data.data.post._id);

                    //Enable the functionality of toggle likes button on the new post
                    new ToggleLike($(' .toggle-like-button', newPost));
                    new Noty({
                        theme: 'relax',
                        text: "Post published!",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                }, error: function(error){
                console.log(error.responseText);
                }

            });
        });
    }
    
    // method to create a post in DOM
    let newPostDom = function(post){
        return $(`<li id="post-${post._id}">
                   <div id="new-post-list-container">
                        <div id ="post-user-container">
                            <div id="post-user-info">
                                <img src="${post.user.avatar}" alt="${post.user.name}" width="50" height="50">
                                <h4>${post.user.name}</h4>
                            </div>
            
                            <div id="deletion-button">
                                <a class="delete-post-button"  href="/posts/destroy/${post._id}">X</a>
                            </div>
                        </div>

                        <div id="post-content-container">
                            ${post.content}
                        </div>

                        <div id="likes-container">
                            <a class="toggle-like-button" data-likes="${post.likes.length}" href="/likes/toggle/?id=${post._id}&type=Post">
                                ${post.likes.length} <i class="fas fa-thumbs-up"></i>
                            </a>
                        </div>

                        <div id="post-comments">
                            <form id="post-${post._id}-comments-form" action="/comments/create" method="POST">
                                <div id="comment-input-area">
                                    <img src="${post.user.avatar}" alt="${post.user.name}" width="40" height="40">
                                    <input id="comment-text" type="text" name="content" placeholder="comments here ..." required>
                                    <input type="hidden" name="post" value="${post._id}">
                                    <input type="submit" value="Comment">
                                </div>
                            </form>
            
                            <div class="post-comments-list">
                                <ul id="post-comments-${post._id}">
        
                                </ul>
                            </div>
                        </div>
                    </div>
                </li>`);
            }

    // Method to delete a post from DOM
    let deletePost = function(deleteLink){
        $(deleteLink).click(function(e){
            e.preventDefault();

            $.ajax({
                type: 'get',
                url: $(deleteLink).prop('href'),
                success: function(data){
                    $(`#post-${data.data.post_id}`).remove();
                    new Noty({
                        theme: 'relax',
                        text: "Post Deleted",
                        type: 'success',
                        layout: 'topRight',
                        timeout: 1500
                        
                    }).show();
                },error: function(error){
                    console.log(error.responseText);
                }
            });
        });
    }

    
    // loop over all the existing posts on the page (when the window loads for the first time) and call the delete post method on delete link of each, also add AJAX (using the class we've created) to the delete button of each
    let convertPostsToAjax = function(){
        $('#posts-list-container>ul>li').each(function(){
            let self = $(this);
            let deleteButton = $(' .delete-post-button', self);
            deletePost(deleteButton);

            // get the post's id by splitting the id attribute
            let postId = self.prop('id').split("-")[1]
            new PostComments(postId);
        });
    }
    
    createPost();
    convertPostsToAjax();
}