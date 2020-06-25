const Post = require('../models/post');
const User = require('../models/user');

/****************METHOD-1 ---> Leading to call-back hell */

/*module.exports.home = function(req, res){
    // without population the user
    
    //Post.find({}, function(err, posts){ // showing all the posts made on the the profile page itself
        //return res.render('home',{
            //title: "Codial | Home",
            //posts : posts
        //});
    //});

    // populating the user

    Post.find({}).populate('user').populate({
        path: 'comments',
        populate: {
            path: 'user'
        }
    }).exec(function(err, posts){ // showing all the posts made on the the profile page itself
        
        User.find({}, function(err,user){
            return res.render('home',{
                title: "Codial | Home",
                posts: posts,
                all_users: user
            });
        });
    });

}*/

/****************METHOD-2 ---> Async Await*****************************************/

module.exports.home = async function(req, res){
    try{
        let posts = await Post.find({})
        .sort('-createdAt')
        .populate('user')
        .populate({
            path: 'comments',
            populate: { // showing all the posts made on the the profile page itself
                path: 'user'
            }
        }).populate('likes'); 
            
        let users = await User.find({});
    
        return res.render('home',{
                title: "Codial | Home",
                posts: posts,
                all_users: users
        });

    }catch(err){
        console.log(`This error has occured in home controller: ${err}`);
        return;
    }
}
