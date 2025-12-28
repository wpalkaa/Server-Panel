const express = require('express');
const router = express.Router();
const fileController = require('../controllers/fileController');

router.get('/listFiles/{*path}', fileController.listFiles);

module.exports = router;