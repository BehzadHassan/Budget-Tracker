import React from 'react'
import './Login.css'
import Backimg from '../assets/img1.jpeg'
import facebookimg from '../assets/1.png'
import googleimg from '../assets/2.png'
import microsoftimg from '../assets/3.png'
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import * as Yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import axios from "axios";

function Login() {

    const navigate = useNavigate();

    const validationSchema = Yup.object(
        {
            username: Yup.string().required('* Username is required'),
            password: Yup.string().required('* Password is required')
        }
    )

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
            theme: "colored"
        });
    };

    const onSubmit = async (data) => {
        const { username, password } = data; // assuming 'username' is email

        try {
            const response = await axios.post("http://localhost:5000/api/users/login", {
                email: username,
                password
            });

            // Extract user and token from response
            const { user, token } = response.data;

            // Store token and user ID in localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("userId", user._id);

            toast.success("Login successful!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored",
            });

            // Redirect to dashboard after short delay
            setTimeout(() => {
                navigate('/Dashboard/home');
            }, 1000);

        } catch (error) {
            const message = error.response?.data?.message || error.message;

            toast.error(message, {
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
        <div className="body-login">
            <div className='login-container'>
                <ToastContainer />

                <div className="login-left login-inner-container">
                    <h2 className="login-portal-title">Budget Tracker</h2>
                    <div className="login-form">
                        <h2 className="login-form-title">Login</h2>
                        <form onSubmit={handleSubmit(onSubmit)}>

                            <div className="login-input-group">
                                <div className="login-label-row">
                                    <label htmlFor="username">Username or Email</label>
                                    {errors.username && <span className="login-error-message-inline">{errors.username.message}</span>}
                                </div>
                                <input
                                    id="username"
                                    type="text"
                                    placeholder="Enter your username or email"
                                    {...register("username")}
                                    // className={errors.username ? "input-error" : ""}
                                />
                            </div>


                            <div className="login-input-group">
                                <div className="login-label-row">
                                    <label htmlFor="password">Password</label>
                                    {errors.password && <span className="login-error-message-inline">{errors.password.message}</span>}
                                </div>
                                <input
                                    id="password"
                                    type="password"
                                    placeholder="Enter your password"
                                    {...register("password")}
                                    // className={errors.password ? "input-error" : ""}
                                />
                            </div>


                            <div className="login-options">
                                <button className='login-google' onClick={(e) => {
                                    e.preventDefault();
                                    errorFunctionality();
                                }}>
                                    <img src={googleimg} alt="google" />
                                </button>
                                <button className='login-facebook' onClick={(e) => {
                                    e.preventDefault();
                                    errorFunctionality();
                                }}>
                                    <img src={facebookimg} alt="facebook" />
                                </button>
                                <button className='login-microsoft' onClick={(e) => {
                                    e.preventDefault();
                                    errorFunctionality();
                                }}>
                                    <img className='login-microsoft-img' src={microsoftimg} alt="microsoft" />
                                </button>
                            </div>

                            <div className="login-btn-container">
                                <button type="submit" className="login-login-btn">Login</button>
                                <button type="button" onClick={() => navigate('/signup')} className="login-signup-btn">Sign Up</button>
                            </div>
                        </form>
                    </div>
                </div>

                <div className="login-right login-inner-container">
                    <img src={Backimg} alt="Library Background" className="login-background-img" />
                </div>
            </div>

        </div>
    )
}

export default Login