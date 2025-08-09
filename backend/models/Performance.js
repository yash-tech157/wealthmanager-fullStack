
const mongoose = require('mongoose');

const timelineItemSchema = mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    portfolio: {
        type: Number,
        required: true
    },
    nifty50: {
        type: Number,
        required: true
    },
    gold: {
        type: Number,
        required: true
    }
});

const returnsSchema = mongoose.Schema({
    '1month': { type: Number, required: true },
    '3months': { type: Number, required: true },
    '1year': { type: Number, required: true }
}, { _id: false }); // Do not create an _id for this subdocument

const performanceSchema = mongoose.Schema({
    timeline: [timelineItemSchema],
    returns: {
        portfolio: returnsSchema,
        nifty50: returnsSchema,
        gold: returnsSchema
    }
}, {
    timestamps: true
});

const Performance = mongoose.model('Performance', performanceSchema);

module.exports = Performance;