const express = require('express');

const router = express.Router();;
const { getAllVideosController, updateCommentController, uploadVideosController, getVideoController, likevideoController, addCommentController, deleteCommentController } = require('../Controllers/videocontroler');
router.get('/video', getAllVideosController);
router.post('/video', uploadVideosController);
router.get('/video/:id', getVideoController);
router.put('/like/:vid/:uid', likevideoController);
router.post('/comment/:vid/:uid', addCommentController);
router.delete('/comment/delete/:vid/:comid', deleteCommentController);
router.put('/comment/update/:cid', updateCommentController);

module.exports = router