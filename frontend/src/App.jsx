import React, { useState, useEffect } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, LayoutGrid, BarChart2, Zap, Shield } from 'lucide-react';

// Tailwind CSS is assumed to be available from the environment.
// For a local setup, you'd typically configure it in a postcss.config.js and tailwind.config.js,
// and import your compiled CSS in src/index.css or similar.
// For this canvas, it's globally available.

// Helper function for API calls with exponential backoff
async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
    for (let i = 0; i < retries; i++) {
        try {
            const response = await fetch(url, options);
            if (!response.ok) {
                // Handle HTTP errors
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Attempt ${i + 1} failed: ${error.message}`);
            if (i < retries - 1) {
                await new Promise(res => setTimeout(res, delay * Math.pow(2, i)));
            } else {
                throw error; // Re-throw after all retries
            }
        }
    }
}

// --- Component: PortfolioOverview ---
// Displays key summary metrics of the portfolio.
const PortfolioOverview = ({ summary, holdingsCount }) => {
    if (!summary) {
        return <div className="p-4 text-center text-gray-500">Loading overview...</div>;
    }

    // Determine color for gain/loss based on value
    const gainLossColor = summary.totalGainLoss >= 0 ? 'text-green-500' : 'text-red-500';
    const gainLossBgColor = summary.totalGainLoss >= 0 ? 'bg-green-100' : 'bg-red-100';

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {/* Total Portfolio Value Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div>
                    <h3 className="text-gray-500 text-sm font-semibold">Total Portfolio Value</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">₹{summary.totalValue.toLocaleString('en-IN')}</p>
                </div>
                <Wallet className="w-12 h-12 text-blue-500" />
            </div>

            {/* Total Gain/Loss Card */}
            <div className={`p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl ${gainLossBgColor}`}>
                <div>
                    <h3 className="text-gray-500 text-sm font-semibold">Total Gain/Loss</h3>
                    <p className={`text-3xl font-bold mt-2 ${gainLossColor}`}>
                        {summary.totalGainLoss >= 0 ? '+' : ''}₹{summary.totalGainLoss.toLocaleString('en-IN')}
                    </p>
                </div>
                {summary.totalGainLoss >= 0 ? (
                    <TrendingUp className="w-12 h-12 text-green-600" />
                ) : (
                    <TrendingDown className="w-12 h-12 text-red-600" />
                )}
            </div>

            {/* Portfolio Performance % Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div>
                    <h3 className="text-gray-500 text-sm font-semibold">Performance % (Total)</h3>
                    <p className={`text-3xl font-bold mt-2 ${summary.totalGainLossPercent >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                        {summary.totalGainLossPercent >= 0 ? '+' : ''}{summary.totalGainLossPercent.toFixed(2)}%
                    </p>
                </div>
                <BarChart2 className="w-12 h-12 text-purple-500" />
            </div>

            {/* Number of Holdings Card */}
            <div className="bg-white p-6 rounded-xl shadow-lg flex items-center justify-between transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                <div>
                    <h3 className="text-gray-500 text-sm font-semibold">Number of Holdings</h3>
                    <p className="text-3xl font-bold text-gray-900 mt-2">{holdingsCount}</p>
                </div>
                <LayoutGrid className="w-12 h-12 text-yellow-500" />
            </div>
        </div>
    );
};

// --- Component: HoldingsTable ---
// Displays a sortable and filterable table of stock holdings.
const HoldingsTable = ({ holdings }) => {
    const [searchTerm, setSearchTerm] = useState('');
    const [sortColumn, setSortColumn] = useState(null);
    const [sortDirection, setSortDirection] = useState('asc'); // 'asc' or 'desc'

    if (!holdings || holdings.length === 0) {
        return <div className="p-4 text-center text-gray-500">No holdings data available.</div>;
    }

    const filteredHoldings = holdings.filter(holding =>
        holding.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        holding.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const sortedHoldings = [...filteredHoldings].sort((a, b) => {
        if (sortColumn === null) return 0;

        const aValue = a[sortColumn];
        const bValue = b[sortColumn];

        if (typeof aValue === 'string') {
            return sortDirection === 'asc' ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        } else {
            return sortDirection === 'asc' ? aValue - bValue : bValue - aValue;
        }
    });

    const handleSort = (column) => {
        if (sortColumn === column) {
            setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
        } else {
            setSortColumn(column);
            setSortDirection('asc');
        }
    };

    const getSortIndicator = (column) => {
        if (sortColumn === column) {
            return sortDirection === 'asc' ? ' 🔼' : ' 🔽';
        }
        return '';
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Portfolio Holdings</h2>
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search by symbol or name..."
                    className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                />
            </div>
            <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer rounded-tl-lg" onClick={() => handleSort('symbol')}>
                                Symbol {getSortIndicator('symbol')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('name')}>
                                Name {getSortIndicator('name')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Quantity
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Avg. Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                Current Price
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('value')}>
                                Value {getSortIndicator('value')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer" onClick={() => handleSort('gainLoss')}>
                                Gain/Loss {getSortIndicator('gainLoss')}
                            </th>
                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer rounded-tr-lg" onClick={() => handleSort('gainLossPercent')}>
                                G/L % {getSortIndicator('gainLossPercent')}
                            </th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {sortedHoldings.map((holding) => (
                            <tr key={holding.symbol}>
                                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    {holding.symbol}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {holding.name}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    {holding.quantity}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    ₹{holding.avgPrice.toLocaleString('en-IN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    ₹{holding.currentPrice.toLocaleString('en-IN')}
                                </td>
                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                                    ₹{holding.value.toLocaleString('en-IN')}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${holding.gainLoss >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {holding.gainLoss >= 0 ? '+' : ''}₹{holding.gainLoss.toLocaleString('en-IN')}
                                </td>
                                <td className={`px-6 py-4 whitespace-nowrap text-sm font-semibold ${holding.gainLossPercent >= 0 ? 'text-green-600' : 'text-red-600'}`}>
                                    {holding.gainLossPercent >= 0 ? '+' : ''}{holding.gainLossPercent.toFixed(2)}%
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// --- Component: AssetAllocation ---
// Displays pie charts for sector and market cap distribution.
const AssetAllocation = ({ allocation }) => {
    if (!allocation) {
        return <div className="p-4 text-center text-gray-500">Loading allocation data...</div>;
    }

    const COLORS_SECTOR = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#AF19FF', '#FF0054'];
    const COLORS_MARKETCAP = ['#8884d8', '#82ca9d', '#ffc658'];

    // Convert objects to array for Recharts PieChart
    const bySectorData = Object.keys(allocation.bySector).map(key => ({
        name: key,
        value: allocation.bySector[key].value,
        percentage: allocation.bySector[key].percentage
    }));

    const byMarketCapData = Object.keys(allocation.byMarketCap).map(key => ({
        name: key,
        value: allocation.byMarketCap[key].value,
        percentage: allocation.byMarketCap[key].percentage
    }));

    const renderCustomizedLabel = ({ name, percent }) => {
        return `${name} ${(percent * 100).toFixed(1)}%`;
    };

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Asset Allocation</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* By Sector Pie Chart */}
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">By Sector</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={bySectorData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={renderCustomizedLabel}
                            >
                                {bySectorData.map((entry, index) => (
                                    <Cell key={`cell-sector-${index}`} fill={COLORS_SECTOR[index % COLORS_SECTOR.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name, props) => [`₹${value.toLocaleString('en-IN')}`, `${name} (${props.payload.percentage.toFixed(1)}%)`]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>

                {/* By Market Cap Pie Chart */}
                <div className="flex flex-col items-center">
                    <h3 className="text-lg font-semibold text-gray-700 mb-4">By Market Cap</h3>
                    <ResponsiveContainer width="100%" height={300}>
                        <PieChart>
                            <Pie
                                data={byMarketCapData}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="value"
                                label={renderCustomizedLabel}
                            >
                                {byMarketCapData.map((entry, index) => (
                                    <Cell key={`cell-marketcap-${index}`} fill={COLORS_MARKETCAP[index % COLORS_MARKETCAP.length]} />
                                ))}
                            </Pie>
                            <Tooltip formatter={(value, name, props) => [`₹${value.toLocaleString('en-IN')}`, `${name} (${props.payload.percentage.toFixed(1)}%)`]} />
                            <Legend />
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>
        </div>
    );
};

// --- Component: PerformanceChart ---
// Displays a line chart comparing portfolio performance against benchmarks.
const PerformanceChart = ({ performance }) => {
    if (!performance) {
        return <div className="p-4 text-center text-gray-500">Loading performance data...</div>;
    }

    // Format dates for chart
    const formattedTimeline = performance.timeline.map(item => ({
        ...item,
        date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    }));

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Performance Comparison</h2>
            <div className="h-80"> {/* Fixed height for chart */}
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart
                        data={formattedTimeline}
                        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                    >
                        <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
                        <XAxis dataKey="date" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value.toLocaleString('en-IN')}`} />
                        <Legend />
                        <Line type="monotone" dataKey="portfolio" stroke="#8884d8" activeDot={{ r: 8 }} name="Portfolio Value" />
                        <Line type="monotone" dataKey="nifty50" stroke="#82ca9d" name="Nifty 50" />
                        <Line type="monotone" dataKey="gold" stroke="#ffc658" name="Gold" />
                    </LineChart>
                </ResponsiveContainer>
            </div>

            <h3 className="text-xl font-bold text-gray-800 mt-8 mb-4">Returns Comparison</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                {['1month', '3months', '1year'].map(period => (
                    <div key={period} className="bg-gray-50 p-4 rounded-lg shadow">
                        <p className="text-sm text-gray-500 font-semibold">{period.toUpperCase()} Returns</p>
                        <p className="text-lg font-bold mt-2">
                            <span className={performance.returns.portfolio[period] >= 0 ? 'text-green-600' : 'text-red-600'}>
                                {performance.returns.portfolio[period] >= 0 ? '+' : ''}{performance.returns.portfolio[period].toFixed(1)}% (Portfolio)
                            </span><br />
                            <span className={performance.returns.nifty50[period] >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {performance.returns.nifty50[period] >= 0 ? '+' : ''}{performance.returns.nifty50[period].toFixed(1)}% (Nifty 50)
                            </span><br />
                            <span className={performance.returns.gold[period] >= 0 ? 'text-green-500' : 'text-red-500'}>
                                {performance.returns.gold[period] >= 0 ? '+' : ''}{performance.returns.gold[period].toFixed(1)}% (Gold)
                            </span>
                        </p>
                    </div>
                ))}
            </div>
        </div>
    );
};

// --- Component: TopPerformers ---
// Displays best/worst performing stocks and diversification/risk insights.
const TopPerformers = ({ summary }) => {
    if (!summary) {
        return <div className="p-4 text-center text-gray-500">Loading top performers data...</div>;
    }

    return (
        <div className="bg-white p-6 rounded-xl shadow-lg mb-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Top Performers & Insights</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {/* Top Performer */}
                <div className="bg-green-50 p-4 rounded-lg shadow flex items-center">
                    <Zap className="w-10 h-10 text-green-600 mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Best Performing Stock</h3>
                        <p className="text-xl font-bold text-green-700">
                            {summary.topPerformer.name} ({summary.topPerformer.symbol})
                        </p>
                        <p className="text-md text-green-600 mt-1">Gain: +{summary.topPerformer.gainPercent.toFixed(1)}%</p>
                    </div>
                </div>

                {/* Worst Performer */}
                <div className="bg-red-50 p-4 rounded-lg shadow flex items-center">
                    <TrendingDown className="w-10 h-10 text-red-600 mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Worst Performing Stock</h3>
                        <p className="text-xl font-bold text-red-700">
                            {summary.worstPerformer.name} ({summary.worstPerformer.symbol})
                        </p>
                        <p className="text-md text-red-600 mt-1">Loss: {summary.worstPerformer.gainPercent.toFixed(1)}%</p>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Diversification Score */}
                <div className="bg-blue-50 p-4 rounded-lg shadow flex items-center">
                    <Shield className="w-10 h-10 text-blue-600 mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Diversification Score</h3>
                        <p className="text-xl font-bold text-blue-700">{summary.diversificationScore.toFixed(1)}/10</p>
                        <p className="text-sm text-gray-600 mt-1">A higher score indicates better diversification.</p>
                    </div>
                </div>

                {/* Risk Level */}
                <div className="bg-purple-50 p-4 rounded-lg shadow flex items-center">
                    <Zap className="w-10 h-10 text-purple-600 mr-4" />
                    <div>
                        <h3 className="text-lg font-semibold text-gray-700">Risk Level</h3>
                        <p className="text-xl font-bold text-purple-700">{summary.riskLevel}</p>
                        <p className="text-sm text-gray-600 mt-1">Current portfolio risk assessment.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};


// --- Main App Component ---
export default function App() {
    const API_BASE_URL = 'http://localhost:5000/api/portfolio'; // Your backend API base URL

    const [holdings, setHoldings] = useState(null);
    const [allocation, setAllocation] = useState(null);
    const [performance, setPerformance] = useState(null);
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAllData = async () => {
            try {
                setLoading(true);
                setError(null);

                const [holdingsData, allocationData, performanceData, summaryData] = await Promise.all([
                    fetchWithRetry(`${API_BASE_URL}/holdings`),
                    fetchWithRetry(`${API_BASE_URL}/allocation`),
                    fetchWithRetry(`${API_BASE_URL}/performance`),
                    fetchWithRetry(`${API_BASE_URL}/summary`)
                ]);

                setHoldings(holdingsData);
                setAllocation(allocationData);
                setPerformance(performanceData);
                setSummary(summaryData);

            } catch (err) {
                setError('Failed to fetch data. Please ensure the backend is running and accessible.');
                console.error('Error fetching dashboard data:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAllData();
    }, []); // Empty dependency array means this runs once on mount

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-sans">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500 mb-4"></div>
                    <p className="text-lg text-gray-700">Loading portfolio data...</p>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-red-50 p-6 font-sans">
                <div className="bg-white p-8 rounded-xl shadow-lg text-center border-l-4 border-red-500">
                    <p className="text-xl text-red-700 font-semibold mb-4">Error!</p>
                    <p className="text-gray-700">{error}</p>
                    <p className="text-sm text-gray-500 mt-4">Please check your network connection and ensure the backend server is running.</p>
                </div>
            </div>
        );
    }

    // Ensure all data is loaded before rendering main content
    if (!holdings || !allocation || !performance || !summary) {
        // This case should ideally be caught by error/loading, but as a fallback
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 p-6 font-sans">
                <p className="text-lg text-gray-700">Data not fully loaded. Please try refreshing.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6 font-sans text-gray-900 rounded-lg">
            <header className="bg-white p-6 rounded-xl shadow-lg mb-8 text-center">
                <h1 className="text-4xl font-extrabold text-blue-700">WealthManager Dashboard</h1>
                <p className="text-lg text-gray-600 mt-2">Your comprehensive investment portfolio analytics</p>
            </header>

            <main className="container mx-auto max-w-7xl">
                <PortfolioOverview summary={summary} holdingsCount={holdings ? holdings.length : 0} />
                <AssetAllocation allocation={allocation} />
                <PerformanceChart performance={performance} />
                <HoldingsTable holdings={holdings} />
                <TopPerformers summary={summary} />
            </main>

            <footer className="mt-8 text-center text-gray-600 text-sm">
                <p>&copy; 2025 WealthManager.online. All rights reserved.</p>
            </footer>
        </div>
    );
}

// Below is the content for src/main.jsx
// This part needs to be saved as main.jsx in your frontend's src/ directory.
// Make sure to add the CSS import here.

/*
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import './index.css'; // <--- ADD THIS LINE to import your CSS

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
*/
