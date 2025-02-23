const express = require('express');

const router = express.Router();;
const { createChannel, findChannel, subscribeController, unsubscribeController } = require('../Controllers/channelController');

router.post('/create', createChannel)
router.post('/find/:id', findChannel)
router.put('/subscribe/:cid/:uid', subscribeController)
router.put('/unsubscribe/:cid/:uid', unsubscribeController)

module.exports = router