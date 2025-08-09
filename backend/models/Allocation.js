// backend/models/Allocation.js
const mongoose = require('mongoose');

const allocationSchema = mongoose.Schema({
    bySector: {
        type: Object, // Store as a flexible object
        required: true
        // Example: { "Technology": { "value": 250000, "percentage": 35.7 }, ... }
    },
    byMarketCap: {
        type: Object, // Store as a flexible object
        required: true
        // Example: { "Large": { "value": 455000, "percentage": 65.0 }, ... }
    }
}, {
    timestamps: true
});

const Allocation = mongoose.model('Allocation', allocationSchema);

module.exports = Allocation;