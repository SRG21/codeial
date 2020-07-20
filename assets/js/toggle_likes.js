class ToggleLike{
    constructor(toggleElement){
        this.toggler = toggleElement;
        this.toggleLike();
    }

    toggleLike(){
        $(this.toggler).click(function(e){
            e.preventDefault();
            let self = this; // storing this in a variable

            //implementing AJAX with promises

            $.ajax({
                type: 'POST',
                url: $(self).attr('href'),
            })
            .done(function(data){
                let likesCount = parseInt($(self).attr('data-likes')); 
                console.log(self,likesCount);
                if (data.data.deleted == true){
                    likesCount -= 1;
                }else{
                    likesCount += 1;
                }

                $(self).attr('data-likes', likesCount); // passing new value of likeCount into data-likes
                $(self).html(`${likesCount} <i class="fas fa-thumbs-up">`); // diplaying likes

            })
            .fail(function(errData){
                console.log("Error in completing the request");
            });
        
        });
    }
}