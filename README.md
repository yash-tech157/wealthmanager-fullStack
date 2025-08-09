# WealthManager.online - Portfolio Analytics Dashboard

## 📊 Project Overview

This project is a comprehensive **Portfolio Analytics Dashboard** designed to give investors a clear and interactive view of their investment portfolio. It features a robust backend API service that provides structured portfolio data and a dynamic frontend dashboard that visualizes this data, offering key insights into holdings, asset allocation, performance, and overall portfolio health.

The assignment tests full-stack development capabilities, from building data services to creating an interactive and responsive user interface.

---

## ✨ Features

The dashboard provides the following key functionalities:

* **Portfolio Overview Cards**: Displays critical metrics like Total Portfolio Value, Total Gain/Loss (color-coded), Portfolio Performance %, and Number of Holdings prominently.
* **Asset Allocation Visualizations**: Presents interactive pie/donut charts for asset distribution by sector and market capitalization, with hover effects for detailed values and percentages.
* **Holdings Table/Grid**: A sortable and searchable table listing all stock investments, with clear color-coding for positive and negative performance.
* **Performance Comparison Chart**: Visualizes historical portfolio performance against key benchmarks like Nifty 50 and Gold using an interactive line chart.
* **Top Performers & Insights Section**: Highlights the best and worst-performing stocks and provides insights on diversification score and risk level.
* **Responsive Design**: Ensures optimal viewing and interaction across various devices (desktop, tablet, mobile).
* **Loading & Error Handling**: Gracefully handles API loading states and displays user-friendly error messages.

---

## 🛠️ Technology Stack

This project is built using a modern full-stack JavaScript (Node.js) ecosystem:

### Backend

* **Node.js**: JavaScript runtime environment.
* **Express.js**: Fast, unopinionated, minimalist web framework for building RESTful APIs.
* **Mongoose**: MongoDB object data modeling (ODM) for Node.js, providing a straightforward, schema-based solution to model your application data.
* **MongoDB**: A NoSQL, document-oriented database for storing portfolio data locally. (`MongoDB Compass` is used for local database management).
* **dotenv**: For loading environment variables from a `.env` file.
* **cors**: Middleware to enable Cross-Origin Resource Sharing.
* **nodemon**: A tool that helps develop Node.js based applications by automatically restarting the node application when file changes in the directory are detected.

### Frontend

* **React**: A JavaScript library for building user interfaces.
* **Vite**: A fast build tool that provides an extremely quick development experience for modern web projects.
* **Tailwind CSS v3**: A utility-first CSS framework for rapidly building custom designs.
* **Recharts**: A composable charting library built with React and D3.
* **Lucide React**: A collection of beautiful and customizable open-source icons for React.

---


The repository is organized into two main parts: `backend` and `frontend`.
