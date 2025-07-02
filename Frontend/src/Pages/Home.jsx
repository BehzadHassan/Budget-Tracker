import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Bar, Pie } from 'react-chartjs-2';
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from 'chart.js';
import '../styles/home.css';

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

// Utility to generate HSL-based unique colors
const generateColors = (count) =>
    Array.from({ length: count }, (_, i) =>
        `hsl(${(i * 360) / count}, 70%, 60%)`
    );

function Home() {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch transactions on component mount
    useEffect(() => {
        const fetchData = async () => {
            const token = localStorage.getItem("token");

            try {
                const response = await axios.get("http://localhost:5000/api/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });

                setTransactions(response.data);
            } catch (err) {
                console.error("Error fetching transactions:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // Calculate totals
    const income = transactions
        .filter(t => t.type === "income")
        .reduce((acc, t) => acc + t.amount, 0);

    const expense = transactions
        .filter(t => t.type === "expense")
        .reduce((acc, t) => acc + t.amount, 0);

    const balance = income - expense;

    // Group by category
    const categoryMap = {};
    transactions.forEach(t => {
        if (categoryMap[t.category]) {
            categoryMap[t.category] += t.amount;
        } else {
            categoryMap[t.category] = t.amount;
        }
    });

    const categories = Object.keys(categoryMap);
    const categoryAmounts = Object.values(categoryMap);
    const categoryColors = generateColors(categories.length);

    // Chart data
    const pieData = {
        labels: categories,
        datasets: [{
            label: 'Category Breakdown',
            data: categoryAmounts,
            backgroundColor: categoryColors
        }]
    };

    const barData = {
        labels: ['Income', 'Expense'],
        datasets: [{
            label: 'Monthly Overview',
            data: [income, expense],
            backgroundColor: ['green', 'red']
        }]
    };

    return (
        <div className="home-container">
            <h2>Dashboard</h2>

            {loading ? (
                <p>Loading...</p>
            ) : (
                <>
                    <div className="cards-row">
                        <div className="card">
                            <h3>Total Balance</h3>
                            <p className="balance-amount">PKR {balance}</p>
                        </div>
                        <div className="card">
                            <h3>Total Income</h3>
                            <p className="income-amount">PKR {income}</p>
                        </div>
                        <div className="card">
                            <h3>Total Expenses</h3>
                            <p className="expense-amount">PKR {expense}</p>
                        </div>
                    </div>

                    <div className="charts-row">
                        <div className="chart-card">
                            <h4>Income vs Expense</h4>
                            <Bar data={barData} />
                        </div>
                        <div className="chart-card" style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            justifyContent: 'space-between',
                            gap: '1rem',
                            flexDirection: 'row'
                        }}>
                            {/* Pie Chart */}
                            <div style={{ width: '45%', height: '100%' }}>
                                <h4>Category Breakdown</h4>
                                <Pie
                                    data={pieData}
                                    options={{
                                        maintainAspectRatio: false,
                                        plugins: {
                                            legend: { display: false },
                                        },
                                    }}
                                />
                            </div>

                            {/* Legend */}
                            <div style={{
                                width: '50%',
                                paddingTop: '2rem',
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '10px'
                            }}>
                                {categories.map((category, i) => (
                                    <div key={category} style={{
                                        color: categoryColors[i % categoryColors.length],
                                        fontWeight: 'bold',
                                        fontSize: '0.95rem'
                                    }}>
                                        ⬤ {category}: PKR {categoryAmounts[i]}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}

export default Home;
