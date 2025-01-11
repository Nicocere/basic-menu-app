"use client";

import React from 'react';
import Dashboard from '../../Admin/Dashboard';
import EditMenu from '../../Admin/EditMenu';
import ManageOrders from '../../Admin/ManageOrders';
import Settings from '../../Admin/Settings';
import Header from '../../components/Layout/Header';
import Sidebar from '../../components/Layout/Sidebar';
import styles from './AdminPage.module.css';

const AdminPage: React.FC = () => {
    return (
        <div className={styles.adminPage}>
            {/* <Header /> */}
            <div className={styles.mainContent}>
                {/* <Sidebar /> */}
                <div className={styles.content}>
                    {/* <Dashboard />
                    <EditMenu />
                    <ManageOrders />
                    <Settings /> */}
                </div>
            </div>
        </div>
    );
};

export default AdminPage;