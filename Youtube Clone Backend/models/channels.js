const mongoose = require('mongoose');
const channelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    logoUrl: {
        type: String,
        default: "https://cdn-icons-png.flaticon.com/512/174/174855.png"
    },
    bannerUrl: {
        type: String,
        default: "https://picsum.photos/200/300.jpg?w=700"

    }
    ,
    subscribers: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users"
    }],
    videos: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Videos"
    }],
});

module.exports = mongoose.model('Channels', channelSchema);