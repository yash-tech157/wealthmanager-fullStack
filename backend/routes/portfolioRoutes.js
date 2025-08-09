// backend/routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const Holding = require('../models/Holding');
const Allocation = require('../models/Allocation');
const Performance = require('../models/Performance');
const Summary = require('../models/Summary');

/**
 * @desc Get all portfolio holdings
 * @route GET /api/portfolio/holdings
 * @access Public
 */
router.get('/holdings', async (req, res) => {
    try {
        const holdings = await Holding.find({});
        if (holdings.length === 0) {
            return res.status(404).json({ message: 'No holdings found.' });
        }
        res.json(holdings);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching holdings.' });
    }
});

/**
 * @desc Get portfolio allocation by sector and market cap
 * @route GET /api/portfolio/allocation
 * @access Public
 */
router.get('/allocation', async (req, res) => {
    try {
        // Assuming there's only one allocation document to fetch
        const allocation = await Allocation.findOne({});
        if (!allocation) {
            return res.status(404).json({ message: 'Allocation data not found.' });
        }
        res.json(allocation);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching allocation data.' });
    }
});

/**
 * @desc Get historical performance comparison
 * @route GET /api/portfolio/performance
 * @access Public
 */
router.get('/performance', async (req, res) => {
    try {
        // Assuming there's only one performance document to fetch
        const performance = await Performance.findOne({});
        if (!performance) {
            return res.status(404).json({ message: 'Performance data not found.' });
        }
        res.json(performance);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching performance data.' });
    }
});

/**
 * @desc Get key portfolio summary metrics
 * @route GET /api/portfolio/summary
 * @access Public
 */
router.get('/summary', async (req, res) => {
    try {
        // Assuming there's only one summary document to fetch
        const summary = await Summary.findOne({});
        if (!summary) {
            return res.status(404).json({ message: 'Summary data not found.' });
        }
        res.json(summary);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error fetching summary data.' });
    }
});

module.exports = router;