const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');
const checkJwt = require('../middleware/checkJwt');
const verifyAdmin = require('../middleware/verifyAdmin');

router.use(checkJwt);

router.post('/listFiles', fileController.listFiles);
router.post('/getSize', fileController.getSize);
router.post('/getFileInfo', fileController.getFileInfo);
router.post('/download', fileController.downloadFile);
router.post('/create', verifyAdmin, fileController.createFile);

router.patch('/rename', verifyAdmin, fileController.renameFile);

router.delete('/delete', verifyAdmin, fileController.deleteFile);

module.exports = router;