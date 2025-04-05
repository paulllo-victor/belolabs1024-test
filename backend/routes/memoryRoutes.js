const express = require('express');
const router = express.Router();
const memoryController = require('../controllers/memoryController');
const { protect } = require('../middleware/authMiddleware');

router.post('/save', protect, memoryController.saveGameData);
router.get('/results', protect, memoryController.getResults);

module.exports = router;
