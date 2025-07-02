import React, { useState } from 'react';
import '../styles/addTransaction.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios'; // ✅ ← Add this line
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


function AddTransaction() {
    const previousCategories = ['Food', 'Salary', 'Entertainment', 'Travel', 'Freelance'];
    const [filteredCategories, setFilteredCategories] = useState([]);
    const [showDropdown, setShowDropdown] = useState(false);

    const formik = useFormik({
        initialValues: {
            title: '',
            type: 'income',
            amount: '',
            date: '',
            category: '',
        },
        validationSchema: Yup.object({
            title: Yup.string().required('Title is required'),
            type: Yup.string().oneOf(['income', 'expense']).required('Type is required'),
            amount: Yup.number().positive('Amount must be positive').required('Amount is required'),
            date: Yup.date().required('Date is required'),
            category: Yup.string().required('Category is required'),
        }),
        onSubmit: async (values, { resetForm }) => {
            try {
                const token = localStorage.getItem("token");
                console.log("➡️ Submitting Transaction");
                console.log("Token:", token);
                console.log("Payload:", values);

                const response = await axios.post(
                    "http://localhost:5000/api/transactions",
                    values,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json'
                        }
                    }
                );

                console.log("✅ Backend Response:", response.data);

                toast.success('Transaction added successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: "colored",
                });

                resetForm();
                setShowDropdown(false);
            } catch (error) {
                console.log("❌ Error Response:", error.response?.data);
                console.log("❌ Full Error:", error);

                const message = error.response?.data?.message || "Failed to add transaction.";
                toast.error(message, {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: "colored"
                });
            }
        }
        
        
    });

    const handleCategoryChange = (e) => {
        const input = e.target.value;
        formik.setFieldValue('category', input);
        const matches = previousCategories.filter(cat =>
            cat.toLowerCase().includes(input.toLowerCase())
        );
        setFilteredCategories(matches);
        setShowDropdown(true);
    };

    const handleSelectCategory = (cat) => {
        formik.setFieldValue('category', cat);
        setShowDropdown(false);
    };

    return (
        <div className="add-transaction-wrapper">
            <div className="add-transaction-card">
                <h2>Add New Transaction</h2>
                <form className="transaction-form" onSubmit={formik.handleSubmit}>

                    <label>Title</label>
                    <input
                        type="text"
                        name="title"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.title}
                        placeholder="e.g., Grocery Bill"
                    />
                    {formik.touched.title && formik.errors.title && <div className="form-error">{formik.errors.title}</div>}

                    <label>Type</label>
                    <div className="radio-group">
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="income"
                                checked={formik.values.type === 'income'}
                                onChange={formik.handleChange}
                            /> Income
                        </label>
                        <label>
                            <input
                                type="radio"
                                name="type"
                                value="expense"
                                checked={formik.values.type === 'expense'}
                                onChange={formik.handleChange}
                            /> Expense
                        </label>
                    </div>

                    <label>Category</label>
                    <div className="category-wrapper">
                        <input
                            name="category"
                            value={formik.values.category}
                            onChange={handleCategoryChange}
                            onBlur={formik.handleBlur}
                            onFocus={() => setShowDropdown(true)}
                            placeholder="Search or create new..."
                        />
                        {showDropdown && (
                            <ul className="category-dropdown">
                                {filteredCategories.length > 0 ? (
                                    filteredCategories.map(cat => (
                                        <li key={cat} onClick={() => handleSelectCategory(cat)} className="category-item">
                                            <span className="badge">{cat}</span>
                                        </li>
                                    ))
                                ) : (
                                    formik.values.category && (
                                        <li
                                            className="new-category"
                                            onClick={() => handleSelectCategory(formik.values.category)}
                                        >
                                            + Create new category: "<strong>{formik.values.category}</strong>"
                                        </li>
                                    )
                                )}
                            </ul>
                        )}
                    </div>
                    {formik.touched.category && formik.errors.category && <div className="form-error">{formik.errors.category}</div>}

                    <label>Amount</label>
                    <input
                        type="number"
                        name="amount"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.amount}
                        placeholder="e.g., 2500"
                    />
                    {formik.touched.amount && formik.errors.amount && <div className="form-error">{formik.errors.amount}</div>}

                    <label>Date</label>
                    <input
                        type="date"
                        name="date"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.date}
                    />
                    {formik.touched.date && formik.errors.date && <div className="form-error">{formik.errors.date}</div>}

                    <button type="submit" className="submit-btn">Add Transaction</button>
                </form>
            </div>
            <ToastContainer/>
        </div>
    );
}

export default AddTransaction;
