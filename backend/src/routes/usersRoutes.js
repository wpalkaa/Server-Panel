const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');

router.get('/', usersController.getUsers);
router.get('/:username', usersController.getUserData);
router.delete('/delete/:id', usersController.deleteUser);

module.exports = router;