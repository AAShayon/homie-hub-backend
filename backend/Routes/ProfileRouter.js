const express = require('express');
const { getProfile } = require('../Controllers/ProfileController');
const ensureAuthenticated = require('../Middlewares/Auth');

const router = express.Router();

router.get('/', ensureAuthenticated, getProfile);

module.exports = router;
