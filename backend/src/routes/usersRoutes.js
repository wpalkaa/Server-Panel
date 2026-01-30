const express = require('express');
const router = express.Router();
const usersController = require('../controllers/usersController');
const verifyAdmin = require('../middleware/verifyAdmin');

router.get('/', usersController.getUsers);
router.get('/:login', usersController.getUserData);
router.delete('/delete/:id', verifyAdmin, usersController.deleteUser);
router.delete('/delete/noauth/:id', usersController.deleteUser);

module.exports = router;