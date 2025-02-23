const Videos = require('../models/video')
const Channels = require('../models/channels');
const Users = require('../models/user');
const Comments = require('../models/comment')
const jwt = require('jsonwebtoken');

module.exports.getAllVideosController = async (req, res) => {
    try {
        const data = await Videos.find().populate({ path: "channelId" });
        return res.status(200).json({
            success: true,
            message: "All videos fetched",
            videos: data
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to fetch videos"
        })
    }

}
module.exports.uploadVideosController = async (req, res) => {
    try {
         

        const { title, videoUrl, thumbnailUrl, description, category } = req.body;
        console.log(title, videoUrl, thumbnailUrl, description, category)
        const token = req.headers.authorization.split(' ')[1];

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(400).json({
                success: false,
                message: "Token expired",
            })
        }
        const user = await Users.findOne({ email: decode.email })
        const chanel = await Channels.findOne({ _id: user.channel });
        console.log(user);
        console.log(chanel);
        const newVideo = new Videos({
            title, videoUrl, thumbnailUrl, description, category, channelId: chanel._id
        });
        chanel.videos.push(newVideo);
        await chanel.save();
        await newVideo.save();

        return res.status(200).json({
            success: true,
            message: 'video uploaded'
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Fail to upload"
        })
    }
}

module.exports.getVideoController = async (req, res) => {
    try {
        const { id } = req.params;
        const video = await Videos.findById(id)
            .populate({ path: 'channelId' })
            .populate({
                path: 'comments',
                populate: {
                    path: 'user',  // Assuming 'user' is the field inside each comment that references a User model
                    populate: {
                        path: 'channel'
                    }
                }
            });

        if (video) {
            let updatedviews = video.views + 1;
            await Videos.findByIdAndUpdate(id, { views: updatedviews })
        }
        return res.status(200).json({
            success: true,
            message: "Video data fetched",
            video
        })
    } catch (error) {
        return res.status(400).json({
            success: false,
            message: "Fail to fetch video"
        })
    }

}

module.exports.likevideoController = async (req, res) => {
    try {
        const { vid, uid } = req.params;
        const video = await Videos.findById(vid);
        const user = await Users.findById(uid);

        if (!video || !user) {
            return res.status(404).json({
                success: false,
                message: "User or Video not found"
            });
        }

        // Check if the user has already liked the video
        if (user.likedVideos.includes(video._id)) {
            // Unlike the video (remove from likedVideos and decrement likes)
            user.likedVideos = user.likedVideos.filter(v => v.toString() !== video._id.toString());
            video.likes = video.likes > 0 ? video.likes - 1 : 0; // Prevent negative likes

            await video.save();
            await user.save();

            return res.status(200).json({
                success: true,
                message: "Video unliked successfully"
            });
        }

         user.likedVideos.push(video._id);
        video.likes = video.likes + 1;

        await video.save();
        await user.save();

 
        res.status(200).json({
            success: true,
            message: "Video liked successfully"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message || "Failed to like/unlike the video"
        });
    }
};

module.exports.addCommentController = async (req, res) => {
    try {
        const { vid, uid } = req.params;
        let { comment } = req.body;
        comment = comment.toString();
        const video = await Videos.findById(vid);
        const user = await Users.findById(uid);

        if (!video || !user) {
            return res.status(404).json({
                success: false,
                message: "User or Video not found"
            });
        }

        // Create new comment
        const newcomment = new Comments({
            text: comment,
            user: uid
        });

        // Push comment ID into the video's comments array
        video.comments.push(newcomment._id);

        // Save the new comment and updated video
        await newcomment.save();
        await video.save();

        return res.status(200).json({
            success: true,
            message: "Comment added successfully",
            comment: newcomment
        });

    } catch (error) {
         console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};


module.exports.deleteCommentController = async (req, res) => {
    try {
        const { vid, comid } = req.params;

        // Find the video by ID
        const video = await Videos.findById(vid);
        if (!video) {
            return res.status(404).json({
                success: false,
                message: "Video not found"
            });
        }

        // Find the comment by ID
        const comment = await Comments.findById(comid);
        if (!comment) {
            return res.status(404).json({
                success: false,
                message: "Comment not found"
            });
        }

        // Remove the comment from the video's comments array
        video.comments = video.comments.filter(commentId => commentId.toString() !== comid);


        // Delete the comment from the database
        await Comments.findByIdAndDelete(comid);

        // Save the updated video
        await video.save();


        return res.status(200).json({
            success: true,
            message: "Comment deleted successfully"
        });
    } catch (error) {
        // Handle errors and respond with a meaningful message
        console.error(error);
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
};


module.exports.updateCommentController = async (req, res) => {
    try {
      
        const { cid } = req.params;
        const { newcomment } = req.body;
        await Comments.findByIdAndUpdate(cid, { text: newcomment });
        return res.status(200).json({
            success: true,
            message: "Changes saved"
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "Server error. Please try again later."
        });
    }
}