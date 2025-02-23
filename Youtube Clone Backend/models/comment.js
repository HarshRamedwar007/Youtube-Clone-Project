const { type } = require('express/lib/response');
const mongoose = require('mongoose');

let commentSchema = mongoose.Schema({
    text: {
        type: String,
        required: true
    },
    user: {
        required: false,
        type: mongoose.Schema.Types.ObjectId,
        ref: "Users",
    }
});

module.exports = mongoose.model('Comments', commentSchema);