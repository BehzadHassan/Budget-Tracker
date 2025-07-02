// Pages/DashboardLayout.jsx
import React from 'react';
import { Layout } from 'antd';
import Sidebar from '../Components/Sidebar';
import { Outlet } from 'react-router-dom';

const DashboardLayout = () => {
    return (
        <Layout style={{ minHeight: '100vh' }}>
            <Sidebar />
            {/* <Layout.Content style={{ padding: '20px' }}>
                <Outlet />
            </Layout.Content> */}
        </Layout>
    );
};

export default DashboardLayout;
