const mongoose = require('mongoose');

const videoSchema = new mongoose.Schema({
    title: { type: String, required: true },
    thumbnailUrl: { type: String, required: true },
    description: { type: String },
    channelId: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Channels"
    },
    views: { type: Number, default: 0 },
    likes: { type: Number, default: 0 },
    dislikes: { type: Number, default: 0 },
    uploadDate: { type: Date, default: Date.now },  // Automatically set upload date
    category: { type: String, required: true },
    videoUrl: {
        type: String,
        default: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4"
    }
    ,
    comments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Comments"
    }],
});

const Video = mongoose.model('Videos', videoSchema);

module.exports = Video;
