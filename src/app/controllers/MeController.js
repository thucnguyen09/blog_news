const Posts = require('../models/Posts');
const {mutipleMongooseToObject} = require('../../util/mongoose');
class MeController {
    //[GET] /me/stored/posts
    storedPosts(req, res,next) {
        let postsRequest = Posts.find({});
    
        if(req.query.hasOwnProperty('_sort')) {
            postsRequest = postsRequest.sort({
                [req.query.column]: req.query.type,
            })
        }
        
        Promise.all([postsRequest, Posts.countDocumentsDeleted({})])
            .then( ([posts, countPostsDeleted]) => {
                res.render('me/store-posts',
                 { 
                     posts: mutipleMongooseToObject(posts),
                     countPostsDeleted,                
                    });
            })
            .catch(next)
    }
    //[GET] /me/trash/posts
    trashPosts(req, res,next) {
        Posts.findDeleted({})
            .then(posts => {
                res.render('me/trash-posts',
                    { posts: mutipleMongooseToObject(posts) });
            })
            .catch(next)
    }
}
module.exports = new MeController();