import React, { useState, useEffect } from 'react'; // ✅ This is okay
import axios from 'axios'; // ✅ axios should be here
import '../styles/history.css';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function History() {  // ✅ useState, useEffect must be called inside this
    const [transactions, setTransactions] = useState([]); // ✅ OK
    const [categories, setCategories] = useState([]);
    const [filters, setFilters] = useState({
        type: 'all',
        category: '',
        fromDate: '',
        toDate: '',
    });

    const [editingTxn, setEditingTxn] = useState(null);
    const [editData, setEditData] = useState({});

    // ✅ useEffect is used inside this component
    useEffect(() => {
        const fetchTransactions = async () => {
            try {
                const token = localStorage.getItem("token");
                const response = await axios.get("http://localhost:5000/api/transactions", {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setTransactions(response.data);
                const uniqueCats = [...new Set(response.data.map(t => t.category))];
                setCategories(uniqueCats);
            } catch (error) {
                toast.error("Failed to fetch transactions", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: "colored",
                });
                console.error("Fetch error:", error);
            }
        };

        fetchTransactions();
    }, []);

    

    const handleDelete = async (id) => {
        try {
            const token = localStorage.getItem("token");
            await axios.delete(`http://localhost:5000/api/transactions/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTransactions(prev => prev.filter(item => item._id !== id));
            toast.success("Transaction deleted successfully", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored",
            });

        } catch (error) {
            toast.error("Failed to delete transaction", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored",
            });
        }
    };
    

    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters({ ...filters, [name]: value });
    };

    const clearFilters = () => {
        setFilters({ type: 'all', category: '', fromDate: '', toDate: '' });
    };

    const filteredData = transactions.filter(txn => {
        const matchType = filters.type === 'all' || txn.type === filters.type;
        const matchCategory = !filters.category || txn.category === filters.category;
        const matchFromDate = !filters.fromDate || new Date(txn.date) >= new Date(filters.fromDate);
        const matchToDate = !filters.toDate || new Date(txn.date) <= new Date(filters.toDate);
        return matchType && matchCategory && matchFromDate && matchToDate;
    });

    const openEditModal = (txn) => {
        setEditingTxn(txn._id); 
        setEditData({ ...txn });
    };
    

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditData(prev => ({ ...prev, [name]: value }));
    };

    const updateTransaction = async () => {
        const { title, type, category, amount, date } = editData;
        if (!title || !type || !category || !amount || !date) {
            toast.error('Please fill all fields', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored",
            });
            return;
        }

        try {
            const token = localStorage.getItem("token");
            await axios.put(`http://localhost:5000/api/transactions/${editingTxn}`, {
                title, type, category, amount, date
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });

            setTransactions(prev =>
                prev.map(txn =>
                    txn._id === editingTxn ? { ...editData, amount: parseFloat(amount) } : txn
                )
            );

            toast.success('Transaction updated successfully', {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored",
            });
            setEditingTxn(null);

        } catch (error) {
            toast.error("Failed to update transaction", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored",
            });
        }
    };
    

    return (
        <div className="history-wrapper">
            <div className="history-card">
                <h2>Transaction History</h2>

                {/* Filters */}
                <div className="filters">
                    <div className="filter-group">
                        <label>Type</label>
                        <select name="type" value={filters.type} onChange={handleFilterChange}>
                            <option value="all">All</option>
                            <option value="income">Income</option>
                            <option value="expense">Expense</option>
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>Category</label>
                        <select name="category" value={filters.category} onChange={handleFilterChange}>
                            <option value="">All</option>
                            {categories.map(cat => (
                                <option key={cat} value={cat}>{cat}</option>
                            ))}
                        </select>
                    </div>

                    <div className="filter-group">
                        <label>From</label>
                        <input type="date" name="fromDate" value={filters.fromDate} onChange={handleFilterChange} />
                    </div>

                    <div className="filter-group">
                        <label>To</label>
                        <input type="date" name="toDate" value={filters.toDate} onChange={handleFilterChange} />
                    </div>

                    <button className="clear-btn" onClick={clearFilters}>Clear Filters</button>
                </div>

                {/* Table */}
                <div className="table-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>Title</th>
                                <th>Type</th>
                                <th>Category</th>
                                <th>Amount</th>
                                <th>Date</th>
                                <th>Edit</th>
                                <th>Delete</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredData.length > 0 ? (
                                filteredData.map((txn, index) => (
                                    <tr key={txn._id}>
                                        <td>{index + 1}</td>
                                        <td>{txn.title}</td>
                                        <td className={txn.type === 'income' ? 'type-income' : 'type-expense'}>{txn.type}</td>
                                        <td>{txn.category}</td>
                                        <td>Rs. {txn.amount}</td>
                                        <td>{new Date(txn.date).toISOString().split('T')[0]}</td>
                                        <td>
                                            <button className="edit-btn" onClick={() => openEditModal(txn)}>
                                                Edit
                                            </button>
                                        </td>

                                        <td><button className="delete-btn" onClick={() => handleDelete(txn._id)}>Delete</button></td>
                                        </tr>
                                ))
                            ) : (
                                <tr>
                                    <td colSpan="8" className="no-data">No transactions found.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Modal Overlay */}
            {editingTxn && (
                <div className="modal-overlay">
                    <div className="modal-content">
                        <h3>Edit Transaction</h3>
                        <div className="modal-form">
                            <label>Title</label>
                            <input name="title" value={editData.title} onChange={handleEditChange} />

                            <label>Type</label>
                            <select name="type" value={editData.type} onChange={handleEditChange}>
                                <option value="income">Income</option>
                                <option value="expense">Expense</option>
                            </select>

                            <label>Category</label>
                            <input name="category" value={editData.category} onChange={handleEditChange} />

                            <label>Amount</label>
                            <input type="number" name="amount" value={editData.amount} onChange={handleEditChange} />

                            <label>Date</label>
                            <input type="date" name="date" value={editData.date} onChange={handleEditChange} />

                            <div className="modal-buttons">
                                <button onClick={updateTransaction} className="edit-btn">Update</button>
                                <button onClick={() => setEditingTxn(null)} className="delete-btn">Exit</button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            <ToastContainer />
        </div>
    );
}

export default History;
