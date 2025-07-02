import React, { useEffect, useState } from 'react';
import '../styles/Profile.css';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function Profile() {
    const [userInfo, setUserInfo] = useState(null);
    const token = localStorage.getItem('token');

    // Fetch user info on mount
    useEffect(() => {
        const fetchUserProfile = async () => {
            try {
                const res = await axios.get('http://localhost:5000/api/users/profile', {
                    headers: { Authorization: `Bearer ${token}` }
                });
                setUserInfo(res.data);
                formik.setValues({
                    username: res.data.username,
                    email: res.data.email
                });
            } catch (err) {
                console.error('Failed to fetch profile:', err);
                toast.error("Failed to load profile", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: "colored",
                });
            }
        };

        fetchUserProfile();
    }, []);

    const formik = useFormik({
        initialValues: {
            username: '',
            email: ''
        },
        enableReinitialize: true,
        validationSchema: Yup.object({
            username: Yup.string()
                .min(3, 'Username must be at least 3 characters')
                .required('Username is required'),
            email: Yup.string()
                .email('Invalid email address')
                .required('Email is required')
        }),
        onSubmit: async (values) => {
            try {
                const res = await axios.put(
                    'http://localhost:5000/api/users/profile',
                    values,
                    {
                        headers: { Authorization: `Bearer ${token}` }
                    }
                );

                toast.success('Profile updated successfully!', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: "colored",
                });
                setUserInfo(res.data);
            } catch (error) {
                toast.error('Failed to update profile', {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: "colored",
                });
            }
        }
    });

    const formattedDate = userInfo ? new Date(userInfo.createdAt).toLocaleDateString() : '';
    const formattedTime = userInfo ? new Date(userInfo.createdAt).toLocaleTimeString() : '';

    return (
        <div className="profile-container">
            <form className="profile-form" onSubmit={formik.handleSubmit}>
                <h2 className="form-heading">Update Profile</h2>

                <div className="form-group">
                    <label htmlFor="username">Username</label>
                    <input
                        type="text"
                        name="username"
                        value={formik.values.username}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.username && formik.errors.username && (
                        <div className="error">{formik.errors.username}</div>
                    )}
                </div>

                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formik.values.email}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                        <div className="error">{formik.errors.email}</div>
                    )}
                </div>

                {/* {userInfo && (
                    <div className="form-group readonly">
                        <label>Created At</label>
                        <div className="readonly-field">{formattedDate} at {formattedTime}</div>
                    </div>
                )} */}

                <button type="submit" className="submit-btn">Save Changes</button>
            </form>

            <ToastContainer position="top-right" autoClose={3000} />
        </div>
    );
}

export default Profile;
