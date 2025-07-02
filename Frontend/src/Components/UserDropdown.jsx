import React, { useState, useRef, useEffect } from 'react';
import '../styles/UserDropdown.css';
import { FaUserCircle } from "react-icons/fa";
import { useNavigate } from 'react-router-dom';
import ResetPasswordModal from './ResetPassword.jsx'; // Adjust the path as needed

const UserDropdown = () => {
    const [open, setOpen] = useState(false);
    const [showResetModal, setShowResetModal] = useState(false);
    const dropdownRef = useRef(null);
    const [darkTheme, setDarkTheme] = useState(() => localStorage.getItem('darkTheme') === 'true');
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.setItem('darkTheme', darkTheme);
        document.body.className = darkTheme ? 'dark' : '';
    }, [darkTheme]);

    const handleToggle = () => setOpen(!open);

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setOpen(false);
        }
    };

    useEffect(() => {
        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleMenuClick = (action) => {
        setOpen(false);
        console.log(`${action} clicked`);
        switch (action) {
            case 'View Profile':
                navigate('/dashboard/profile');
                break;
            case 'Change Password':
                setShowResetModal(true); // Open modal instead of navigating
                break;
            case 'Logout':
                // localStorage.setItem('auth', 'false');
                window.location.href = '/';
                break;
            default:
                break;
        }
    };

    return (
        <>
            <div className="user-dropdown" ref={dropdownRef}>
                <div className="avatar" onClick={handleToggle}>
                    <FaUserCircle size={36} />
                </div>
                {open && (
                    <div className="dropdown-menu">
                        <div onClick={() => handleMenuClick('View Profile')}>View Profile</div>
                        <div onClick={() => handleMenuClick('Change Password')}>Change Password</div>
                        <div onClick={() => handleMenuClick('Logout')}>Logout</div>
                    </div>
                )}
            </div>

            {/* Include the Reset Password Modal */}
            <ResetPasswordModal open={showResetModal} onClose={() => setShowResetModal(false)} />
        </>
    );
};

export default UserDropdown;
