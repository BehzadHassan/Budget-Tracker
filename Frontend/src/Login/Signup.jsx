import React from 'react';
import './Signup.css';
import Backimg from '../assets/img1.jpeg';
import facebookimg from '../assets/1.png';
import googleimg from '../assets/2.png';
import microsoftimg from '../assets/3.png';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";

function Signup() {
    const navigate = useNavigate();

    const validationSchema = Yup.object({
        username: Yup.string().required('* Username is required'),
        email: Yup.string().email('* Invalid email format').required('* Email is required'),
        phone: Yup.string()
            .required('* Phone number is required')
            .matches(/^[0-9]{11}$/, '* Phone number must be exactly 11 digits'),
        password: Yup.string()
            .required('* Password is required')
            .min(6, '* Password must be at least 6 characters'),
    });


    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm({
        resolver: yupResolver(validationSchema),
    });

    const errorFunctionality = () => {
        toast.info("This functionality is unavailable right now", {
            position: "top-center",
            autoClose: 3000,
            hideProgressBar: true,
            closeOnClick: true,
            pauseOnHover: false,
            draggable: false,
            theme: "colored"
        });
    };

    const onSubmit = async (data) => {
        const { username, email, phone, password } = data;

        try {
            const response = await axios.post("http://localhost:5000/api/users/register", {
                username,
                email,
                phone,
                password
            });

            toast.success(response.data.message || "Signup successful!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored"
            });

            // Redirect to login page after short delay
            setTimeout(() => {
                navigate('/');
            }, 1000);

        } catch (error) {
            const message = error.response?.data?.message || "Signup failed. Try again.";

            toast.error(message, {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored"
            });
        }
    };
    


    return (
        <div className="signup-body">

            <div className='signup-container'>
                <ToastContainer />

                <div className="signup-right inner-container">
                    <img src={Backimg} alt="Library Background" className="signup-background-img" />
                </div>

                <div className="signup-left signup-inner-container">
                    <h2 className="signup-portal-title">Budget Tracker</h2>
                    <div className="signup-form">
                        <h2 className="signup-form-title">Sign Up</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            {/* Username Field */}
                            <div className="signup-input-group">
                                <div className="signup-label-row">
                                    <label htmlFor="username">Username</label>
                                    {errors.username && <span className="signup-error-message-inline">{errors.username.message}</span>}
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username"
                                    {...register("username")}
                                />
                            </div>

                            {/* Email Field */}
                            <div className="signup-input-group">
                                <div className="signup-label-row">
                                    <label htmlFor="email">Email</label>
                                    {errors.email && <span className="signup-error-message-inline">{errors.email.message}</span>}
                                </div>
                                <input
                                    id="email"
                                    type="text"
                                    placeholder="Enter your email"
                                    {...register("email")}
                                />
                            </div>

                            {/* Phone Field */}
                            <div className="signup-input-group">
                                <div className="signup-label-row">
                                    <label htmlFor="phone">Phone</label>
                                    {errors.phone && <span className="signup-error-message-inline">{errors.phone.message}</span>}
                                </div>
                                <input
                                    id="phone"
                                    type="text"
                                    placeholder="Enter your phone number"
                                    {...register("phone")}
                                />
                            </div>

                            {/* Password Field */}
                            <div className="signup-input-group">
                                <div className="signup-label-row">
                                    <label htmlFor="password">Password</label>
                                    {errors.password && <span className="signup-error-message-inline">{errors.password.message}</span>}
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                />
                            </div>

                            {/* Social media buttons */}
                            <div className="signup-login-options">
                                <button className='signup-google' onClick={(e) => {
                                    e.preventDefault();
                                    errorFunctionality();
                                }}>
                                    <img src={googleimg} alt="google" />
                                </button>
                                <button className='signup-facebook' onClick={(e) => {
                                    e.preventDefault();
                                    errorFunctionality();
                                }}>
                                    <img src={facebookimg} alt="facebook" />
                                </button>
                                <button className='signup-microsoft' onClick={(e) => {
                                    e.preventDefault();
                                    errorFunctionality();
                                }}>
                                    <img className='signup-microsoft-img' src={microsoftimg} alt="microsoft" />
                                </button>
                            </div>

                            <div className="signup-btn-container">
                                <button type="submit" className="signup-login-btn">Sign Up</button>
                                <button type="button" onClick={() => navigate('/')} className="signup-signup-btn">Login</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Signup;
