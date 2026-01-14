const express = require('express');
const router = express.Router();
const settingsController = require('../controllers/settingsController');

router.get('/users', settingsController.getUsers);

module.exports = router;