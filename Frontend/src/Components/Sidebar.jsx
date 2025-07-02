import React, { useState, useEffect } from 'react';
import './Components.css';
import UserDropdown from './UserDropdown';
import { Layout, Menu, Button } from 'antd';
import { FaMoneyBillWave } from 'react-icons/fa';
import { FaBook, FaHistory, FaSun, FaMoon } from "react-icons/fa";
import { FiPlusCircle } from 'react-icons/fi'
import { FaBookOpen, FaCalendarCheck } from "react-icons/fa6";
import { RiMenuUnfold3Fill, RiMenuFold3Fill } from "react-icons/ri";
import { HomeFilled } from '@ant-design/icons';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';

const Sidebar = () => {
    const { Header, Sider, Content } = Layout;

    const [darkTheme, setDarkTheme] = useState(() => localStorage.getItem('darkTheme') === 'true');
    const [collapsed, setCollapsed] = useState(() => localStorage.getItem('sidebarCollapsed') === 'true');

    const navigate = useNavigate();
    const location = useLocation();

    useEffect(() => {
        localStorage.setItem('darkTheme', darkTheme);
        document.body.className = darkTheme ? 'dark' : '';
    }, [darkTheme]);

    useEffect(() => {
        localStorage.setItem('sidebarCollapsed', collapsed);
    }, [collapsed]);

    const toggleTheme = () => setDarkTheme(prev => !prev);
    const toggleSidebar = () => setCollapsed(prev => !prev);

    const menuItems = [
        { key: '/dashboard/home', icon: <HomeFilled />, label: 'Home' },
        { key: '/dashboard/AddTransaction', icon: <FiPlusCircle />, label: 'Add Transaction' },
        { key: '/dashboard/history', icon: <FaHistory />, label: 'History' }
    ];

    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sider
                theme={darkTheme ? 'dark' : 'light'}
                collapsed={collapsed}
                trigger={null}
                className='sidebar'
            >
                <div className="logo-icon">
                    <div className="logo-img">
                        <FaMoneyBillWave />
                    </div>
                </div>

                <Menu
                    theme={darkTheme ? 'dark' : 'light'}
                    mode='inline'
                    selectedKeys={[location.pathname]}
                    onClick={({ key }) => navigate(key)}
                    className='sidebar-menu'
                    items={menuItems}
                />

                <div className="toggle-btn-container">
                    <Button
                        className='toggle-theme-btn'
                        onClick={toggleTheme}
                        icon={darkTheme ? <FaMoon /> : <FaSun />}
                    />
                </div>
            </Sider>

            <Layout>
                <Header
                    className='sidebar-header'
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
                >
                    <Button
                        style={{
                            color: 'var(--text-color)',
                        }}
                        className='sidebar-toggle'
                        type='text'
                        icon={collapsed ? <RiMenuUnfold3Fill size={20} /> : <RiMenuFold3Fill size={20} />}
                        onClick={toggleSidebar}
                    />

                    <h2 className='main-heading'>Budget Tracker</h2>

                    <UserDropdown />
                </Header>

                <Content className='content-main' style={{ padding: '16px'}}>
                    <Outlet />
                </Content>
            </Layout>
        </Layout>
    );
};

export default Sidebar;
