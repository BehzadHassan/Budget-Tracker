import React from 'react';
import '../styles/ResetPassword.css';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from 'yup';
import { toast } from 'react-toastify';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const schema = Yup.object().shape({
    prevPassword: Yup.string().required('Previous password is required'),
    newPassword: Yup.string().min(6, 'New password must be at least 6 characters').required('New password is required'),
    confirmPassword: Yup.string()
        .oneOf([Yup.ref('newPassword'), null], 'Passwords must match')
        .required('Confirm password is required')
});

const ResetPassword = ({ open, onClose }) => {
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm({
        resolver: yupResolver(schema)
    });

    const handleClose = () => {
        reset();
        onClose();
    };

    const onSubmit = async (data) => {
        try {
            const token = localStorage.getItem("token");

            const res = await fetch("http://localhost:5000/api/users/reset-password", {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    prevPassword: data.prevPassword,
                    newPassword: data.newPassword
                })
            });

            const result = await res.json();

            if (!res.ok) {
                toast.error(result.message || "Password reset failed", {
                    position: "top-center",
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeOnClick: true,
                    pauseOnHover: false,
                    theme: "colored",
                });
                return;
            }

            toast.success("Password reset successfully!", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored",
            });

            reset();
            setTimeout(onClose, 3000);
        } catch (error) {
            toast.error("Something went wrong. Try again.", {
                position: "top-center",
                autoClose: 3000,
                hideProgressBar: true,
                closeOnClick: true,
                pauseOnHover: false,
                theme: "colored",
            });
            console.error("Password reset error:", error);
        }
    };
    

    if (!open) return null;

    return (
        <div className="modal-overlay">
            <div className="modal">
                <ToastContainer position="top-right" autoClose={2000} />
                <h2>Reset Password</h2>
                <form onSubmit={handleSubmit(onSubmit)}>
                    <input
                        type="password"
                        placeholder="Previous Password"
                        {...register('prevPassword')}
                    />
                    {errors.prevPassword && <p className="input-error">{errors.prevPassword.message}</p>}

                    <input
                        type="password"
                        placeholder="New Password"
                        {...register('newPassword')}
                    />
                    {errors.newPassword && <p className="input-error">{errors.newPassword.message}</p>}

                    <input
                        type="password"
                        placeholder="Confirm New Password"
                        {...register('confirmPassword')}
                    />
                    {errors.confirmPassword && <p className="input-error">{errors.confirmPassword.message}</p>}

                    <div className="modal-actions">
                        <button type="button" onClick={handleClose} className="cancel-btn">
                            Cancel
                        </button>
                        <button type="submit" className="update-password-btn">
                            Reset Password
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};


export default ResetPassword;
