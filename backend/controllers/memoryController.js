const Save = require('../models/save');

exports.saveGameData = async (req, res) => {
    const { userID, gameDate, failed, difficulty, completed, timeTaken } = req.body;

    try {
        if (!userID || !gameDate || difficulty === undefined || completed === undefined || timeTaken === undefined) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const newSave = new Save({
            userID,
            gameDate,
            failed,
            difficulty,
            completed,
            timeTaken,
        });

        await newSave.save(); 
        res.status(201).json({ message: 'Game data saved successfully' });
    } catch (error) {
        console.error('Error saving game data:', error);
        res.status(500).json({ message: 'Error saving game data', error });
    }
};
exports.getResults = async (req, res) => {
    try {
        const userId = req.user._id;
        const page = parseInt(req.query.page) || 1;
        const limit = parseInt(req.query.limit) || 10;
        const skip = (page - 1) * limit;

        const totalResults = await Save.countDocuments({ userID: userId });
        const totalPages = Math.ceil(totalResults / limit);

        const results = await Save.find({ userID: userId })
            .sort({gameDate: -1 })
            .skip(skip)
            .limit(limit);

        const formattedResults = results.map(result => ({
            id: result._id,
            difficulty: result.difficulty,
            completed: result.completed,
            failedAttempts: result.failedAttempts,
            timeTaken: result.timeTaken,
            score: result.score,
            gameDate: result.gameDate
        }));

        res.json({
            results: formattedResults,
            pagination: {
                currentPage: page,
                totalPages,
                totalResults,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1
            }
        });
    } catch (error) {
        console.error('Error fetching results:', error);
        res.status(500).json({ message: 'Error fetching player results' });
    }
};
