// backend/models/Holding.js
const mongoose = require('mongoose');

const holdingSchema = mongoose.Schema({
    symbol: {
        type: String,
        required: true,
        unique: true // Assuming each symbol is unique for a user's holdings
    },
    name: {
        type: String,
        required: true
    },
    quantity: {
        type: Number,
        required: true
    },
    avgPrice: {
        type: Number,
        required: true
    },
    currentPrice: {
        type: Number,
        required: true
    },
    sector: {
        type: String,
        required: true
    },
    marketCap: {
        type: String,
        enum: ['Large', 'Mid', 'Small'], // Enforce specific values
        required: true
    },
    // These fields will be pre-calculated in the sample data but can be derived in real apps
    value: {
        type: Number,
        required: true
    },
    gainLoss: {
        type: Number,
        required: true
    },
    gainLossPercent: {
        type: Number,
        required: true
    }
}, {
    timestamps: true // Adds createdAt and updatedAt fields automatically
});

const Holding = mongoose.model('Holding', holdingSchema);

module.exports = Holding;