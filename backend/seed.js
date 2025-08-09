// backend/seed.js
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const Holding = require('./models/Holding');
const Allocation = require('./models/Allocation');
const Performance = require('./models/Performance');
const Summary = require('./models/Summary');

dotenv.config();
connectDB(); // Connect to MongoDB

// Helper function to parse numbers that might contain commas
const parseNumber = (str) => {
    if (typeof str === 'string') {
        // Remove commas and then parse as float
        return parseFloat(str.replace(/,/g, ''));
    }
    return str; // Return as is if it's already a number
};

// Data extracted from Holdings.csv 
const sampleHoldings = [
    {
        "symbol": "RELIANCE",
        "name": "Reliance Industries Ltd",
        "quantity": 50,
        "avgPrice": 2450,
        "currentPrice": 2680.5,
        "sector": "Energy",
        "marketCap": "Large",
        "value": 134025,
        "gainLoss": 11525,
        "gainLossPercent": 9.39
    },
    {
        "symbol": "INFY",
        "name": "Infosys Limited",
        "quantity": 100,
        "avgPrice": 1800,
        "currentPrice": 2010.75,
        "sector": "Technology",
        "marketCap": "Large",
        "value": 201075,
        "gainLoss": 21075,
        "gainLossPercent": 11.71
    },
    {
        "symbol": "TCS",
        "name": "Tata Consultan", // Assuming 'Tata Consultancy Services'
        "quantity": 75,
        "avgPrice": 3200,
        "currentPrice": 3450.25,
        "sector": "Technology",
        "marketCap": "Large",
        "value": 258768.8,
        "gainLoss": 18768.75,
        "gainLossPercent": 7.82
    },
    {
        "symbol": "HDFCBANK",
        "name": "HDFC Bank Limited",
        "quantity": 80,
        "avgPrice": 1650,
        "currentPrice": 1580.3,
        "sector": "Banking",
        "marketCap": "Large",
        "value": 126424,
        "gainLoss": -5576,
        "gainLossPercent": -4.22
    },
    {
        "symbol": "ICICIBANK",
        "name": "ICICI Bank Limited",
        "quantity": 60,
        "avgPrice": 1100,
        "currentPrice": 1235.8,
        "sector": "Banking",
        "marketCap": "Large",
        "value": 74148,
        "gainLoss": 8148,
        "gainLossPercent": 12.34
    },
    {
        "symbol": "BHARTIARTL",
        "name": "Bharti Airtel Limited",
        "quantity": 120,
        "avgPrice": 850,
        "currentPrice": 920.45,
        "sector": "Telecommunications",
        "marketCap": "Large",
        "value": 110454,
        "gainLoss": 8454,
        "gainLossPercent": 8.28
    },
    {
        "symbol": "ITC",
        "name": "ITC Limited",
        "quantity": 200,
        "avgPrice": 420,
        "currentPrice": 465.2,
        "sector": "Consumer Goods",
        "marketCap": "Large",
        "value": 93040,
        "gainLoss": 9040,
        "gainLossPercent": 10.76
    },
    {
        "symbol": "BAJFINANCE",
        "name": "Bajaj Finance Limited",
        "quantity": 25,
        "avgPrice": 6800,
        "currentPrice": 7150.6,
        "sector": "Financial Services",
        "marketCap": "Large",
        "value": 178765,
        "gainLoss": 8765,
        "gainLossPercent": 5.15
    },
    {
        "symbol": "ASIANPAINT",
        "name": "Asian Paints Limited",
        "quantity": 40,
        "avgPrice": 3100,
        "currentPrice": 2890.75,
        "sector": "Consumer Discretionary",
        "marketCap": "Large",
        "value": 115630,
        "gainLoss": -8370,
        "gainLossPercent": -6.75
    },
    {
        "symbol": "MARUTI",
        "name": "Maruti Suzuki India Limited",
        "quantity": 30,
        "avgPrice": 9500,
        "currentPrice": 10250.3,
        "sector": "Automotive",
        "marketCap": "Large",
        "value": 307509,
        "gainLoss": 22509,
        "gainLossPercent": 7.90
    },
    {
        "symbol": "WIPRO",
        "name": "Wipro Limited",
        "quantity": 150,
        "avgPrice": 450,
        "currentPrice": 485.6,
        "sector": "Technology",
        "marketCap": "Large",
        "value": 72840,
        "gainLoss": 5340,
        "gainLossPercent": 7.91
    },
    {
        "symbol": "TATAMOTORS",
        "name": "Tata Motors Limited",
        "quantity": 100,
        "avgPrice": 650,
        "currentPrice": 720.85,
        "sector": "Automotive",
        "marketCap": "Large",
        "value": 72085,
        "gainLoss": 7085,
        "gainLossPercent": 10.90
    },
    {
        "symbol": "TECHM",
        "name": "Tech Mahindra Limited",
        "quantity": 80,
        "avgPrice": 1200,
        "currentPrice": 1145.3,
        "sector": "Technology",
        "marketCap": "Large",
        "value": 91624,
        "gainLoss": -4380,
        "gainLossPercent": -4.56
    },
    {
        "symbol": "AXISBANK",
        "name": "Axis Bank Limited",
        "quantity": 90,
        "avgPrice": 980,
        "currentPrice": 1055.4,
        "sector": "Banking",
        "marketCap": "Large",
        "value": 94986,
        "gainLoss": 6786,
        "gainLossPercent": 7.69
    },
    {
        "symbol": "SUNPHARMA",
        "name": "Sun Pharmaceutical Industries",
        "quantity": 80,
        "avgPrice": 1150,
        "currentPrice": 933.975, // Assuming this is 74718 / 80
        "sector": "Healthcare",
        "marketCap": "Large",
        "value": 74718,
        "gainLoss": (933.975 - 1150) * 80, // Calculate gainLoss from average and current price
        "gainLossPercent": ((933.975 - 1150) / 1150) * 100 // Calculate percentage
    }
];

// Data extracted from Sector_Allocation.csv and Market_Cap.csv 
const sampleAllocation = {
    "bySector": {
        "Technology": { "value": parseNumber("6,24,303.75"), "percentage": 32.25 },
        "Automotive": { "value": parseNumber("3,79,594"), "percentage": 19.61 },
        "Banking": { "value": parseNumber("2,95,558"), "percentage": 15.27 },
        "Financial Services": { "value": parseNumber("1,78,765"), "percentage": 9.24 },
        "Energy": { "value": parseNumber("1,34,025"), "percentage": 6.92 },
        "Consumer Discretionary": { "value": parseNumber("1,15,630"), "percentage": 5.97 },
        "Telecommunications": { "value": parseNumber("1,10,454"), "percentage": 5.71 },
        "Consumer Goods": { "value": parseNumber("93,040"), "percentage": 4.81 },
        "Healthcare": { "value": parseNumber("74,718"), "percentage": 3.86 }
    },
    "byMarketCap": {
        "Large Cap": { "value": parseNumber("19,35,097.75"), "percentage": 100.00 },
        "Mid Cap": { "value": 0, "percentage": 0.00 },
        "Small Cap": { "value": 0, "percentage": 0.00 }
    }
};

// Data extracted from Historical_Performance.csv 
// Note: "returns" section is from assignment prompt as specific 1/3/12 month returns are not directly in CSV
const samplePerformance = {
    "timeline": [
        { "date": "2024-01-01", "portfolio": 1500000, "nifty50": 21000, "gold": 62000 },
        { "date": "2024-02-01", "portfolio": 1520000, "nifty50": 21300, "gold": 61800 },
        { "date": "2024-03-01", "portfolio": 1540000, "nifty50": 22100, "gold": 64500 },
        { "date": "2024-04-01", "portfolio": 1580000, "nifty50": 22800, "gold": 66200 },
        { "date": "2024-05-01", "portfolio": 1620000, "nifty50": 23200, "gold": 68000 },
        { "date": "2024-06-01", "portfolio": 1650000, "nifty50": 23500, "gold": 68500 },
        { "date": "2024-07-01", "portfolio": 1680000, "nifty50": 24100, "gold": 69800 },
        { "date": "2024-08-01", "portfolio": 1720000, "nifty50": 24500, "gold": 70500 },
        { "date": "2024-09-01", "portfolio": 1750000, "nifty50": 25000, "gold": 71500 },
        { "date": "2024-10-01", "portfolio": 1780000, "nifty50": 25600, "gold": 72800 },
        { "date": "2024-11-01", "portfolio": 1820000, "nifty50": 26100, "gold": 74000 },
        { "date": "2024-12-01", "portfolio": 1850000, "nifty50": 26500, "gold": 75200 }
    ],
    "returns": { // These values are from the assignment's example, not directly derivable from the CSV without more logic
        "portfolio": { "1month": 2.3, "3months": 8.1, "1year": 15.7 },
        "nifty50": { "1month": 1.8, "3months": 6.2, "1year": 12.4 },
        "gold": { "1month": -0.5, "3months": 4.1, "1year": 8.9 }
    }
};

// Data extracted from Summary.csv and Top_Performers.csv 
const sampleSummary = {
    "totalValue": parseNumber("19,35,097.75"),
    "totalInvested": parseNumber("17,40,000.00"),
    "totalGainLoss": parseNumber("1,95,097.75"),
    "totalGainLossPercent": 11.21,
    "topPerformer": {
        "symbol": "ICICIBANK",
        "name": "ICICI Bank Limited",
        "gainPercent": 12.34
    },
    "worstPerformer": {
        "symbol": "ASIANPAINT",
        "name": "Asian Paints Limited",
        "gainPercent": -6.75
    },
    "diversificationScore": 8.2,
    "riskLevel": "Moderate"
};


const importData = async () => {
    try {
        // Delete all existing documents from collections to ensure fresh data
        await Holding.deleteMany();
        await Allocation.deleteMany();
        await Performance.deleteMany();
        await Summary.deleteMany();

        // Insert the new sample data
        await Holding.insertMany(sampleHoldings);
        await Allocation.create(sampleAllocation); // Assuming only one allocation document
        await Performance.create(samplePerformance); // Assuming only one performance document
        await Summary.create(sampleSummary); // Assuming only one summary document

        console.log('Data Imported!');
        process.exit();
    } catch (error) {
        console.error(`Error importing data: ${error.message}`);
        process.exit(1);
    }
};

const destroyData = async () => {
    try {
        await Holding.deleteMany();
        await Allocation.deleteMany();
        await Performance.deleteMany();
        await Summary.deleteMany();

        console.log('Data Destroyed!');
        process.exit();
    } catch (error) {
        console.error(`Error destroying data: ${error.message}`);
        process.exit(1);
    }
};

// Check for command line arguments to decide action
if (process.argv[2] === '-d') {
    destroyData();
} else {
    importData();
}
