const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.post('/listFiles', fileController.listFiles);
router.post('/getSize', fileController.getSize);
router.post('/download', fileController.downloadFile);
router.patch('/rename', fileController.renameFile);

module.exports = router;