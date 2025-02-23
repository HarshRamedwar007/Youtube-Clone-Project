const Channels = require('../models/channels');
const Users = require('../models/user');
const jwt = require('jsonwebtoken');
module.exports.createChannel = async (req, res) => {
    try {
        const { name, logo, banner } = req.body;

        const token = req.headers.authorization.split(' ')[1];

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        if (!decode) {
            return res.status(400).json({
                success: false,
                message: "Token expired",
            })
        }
        const user = await Users.findOne({ email: decode.email })

        const newChannel = new Channels({
            name,
            logoUrl: logo,
            bannerUrl: banner
        });
        user.channel = newChannel._id;

        await newChannel.save()
        await user.save()
        res.status(200).json({
            success: true,
            message: "channel created"
        })

    } catch (error) {
        res.status(400).json({
            success: false,
            message: "Failed to create channel"
        })
    }
}

module.exports.findChannel = async (req, res) => {
    try {
        const { id } = req.params;

         const channel = await Channels.findById(id)
            .populate({
                path: 'videos',
                populate: {
                    path: 'channelId', 
                    model: 'Channels' // Replace with the actual model name if different
                }
            });;

        if (!channel) {
            return res.status(404).json({
                success: false,
                message: "Channel not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Fetched channel info",
            channel
        });

    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to fetch channel"
        });
    }
};

module.exports.subscribeController = async (req, res) => {
    try {
        const { cid, uid } = req.params;
        const user = await Users.findById(uid)
        const channel = await Channels.findById(cid);
        // console.log(user, channel);
        channel.subscribers.push(user._id);
        user.subscribedChannels.push(channel._id);
        await channel.save()
        await user.save()
        res.status(200).json({
            success: true,
            message: "Subscribed successfully"
        })
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to subscribe channel"
        });
    }

}
module.exports.unsubscribeController = async (req, res) => {
    try {
        const { cid, uid } = req.params; 
        
        const user = await Users.findById(uid);
        const channel = await Channels.findById(cid);
        
        if (!user || !channel) {
            return res.status(404).json({
                success: false,
                message: "User or channel not found"
            });
        }

        // Remove user from the channel's subscribers list
        channel.subscribers = channel.subscribers.filter(sub => sub.toString() !== user._id.toString());

        // Remove channel from user's subscribed channels list
        user.subscribedChannels = user.subscribedChannels.filter(sub => sub.toString() !== channel._id.toString());

        // Save the updated user and channel
        await channel.save();
        await user.save();

        res.status(200).json({
            success: true,
            message: "Unsubscribed successfully"
        });
    } catch (error) {
        res.status(400).json({
            success: false,
            message: error.message || "Failed to unsubscribe from channel"
        });
    }
};
