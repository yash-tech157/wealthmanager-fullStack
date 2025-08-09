// backend/models/Summary.js
const mongoose = require('mongoose');

const topWorstPerformerSchema = mongoose.Schema({
    symbol: { type: String, required: true },
    name: { type: String, required: true },
    gainPercent: { type: Number, required: true }
}, { _id: false }); // Do not create an _id for this subdocument

const summarySchema = mongoose.Schema({
    totalValue: {
        type: Number,
        required: true
    },
    totalInvested: {
        type: Number,
        required: true
    },
    totalGainLoss: {
        type: Number,
        required: true
    },
    totalGainLossPercent: {
        type: Number,
        required: true
    },
    topPerformer: topWorstPerformerSchema,
    worstPerformer: topWorstPerformerSchema,
    diversificationScore: {
        type: Number,
        required: true
    },
    riskLevel: {
        type: String,
        required: true
    }
}, {
    timestamps: true
});

const Summary = mongoose.model('Summary', summarySchema);

module.exports = Summary;