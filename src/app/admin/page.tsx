"use client";

import React from 'react';
import Dashboard from '../../components/Admin/Dashboard';
import EditMenu from '../../components/Admin/EditMenu';
import ManageOrders from '../../components/Admin/ManageOrders';
import Settings from '../../components/Admin/Settings';
import Header from '../../components/Layout/Header';
import Footer from '../../components/Layout/Footer';
import Sidebar from '../../components/Layout/Sidebar';
import styles from './AdminPage.module.css';

const AdminPage: React.FC = () => {
    return (
        <div className={styles.adminPage}>
            <Header />
            <div className={styles.mainContent}>
                <Sidebar />
                <div className={styles.content}>
                    {/* <Dashboard />
                    <EditMenu />
                    <ManageOrders />
                    <Settings /> */}
                </div>
            </div>
            <Footer />
        </div>
    );
};

export default AdminPage;