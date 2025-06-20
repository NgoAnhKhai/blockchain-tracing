import React from "react";
import { Route, Routes } from "react-router-dom";
import MainLayout from "../layout/MainLayout";
import HomePage from "../pages/HomePage";
import TraceWalletPage from "../pages/TraceWalletPage";
import WalletGraphPage from "../pages/WalletGraphPage";
import TransactionsPage from "../pages/TransactionsPage";
import AlertsPage from "../pages/AlertsPage";
import SettingPage from "../pages/SettingPage";
import TraceAllWalletFollowPage from "../pages/TraceAllWalletFollowPage";

const Router = () => {
  return (
    <Routes>
      <Route path="/" element={<MainLayout />}>
        <Route index element={<HomePage />} />
        <Route path="/trace-wallets/:id" element={<TraceWalletPage />} />
        <Route path="/trace-wallets" element={<TraceAllWalletFollowPage />} />
        <Route path="/wallet-graph" element={<WalletGraphPage />} />
        <Route path="/transactions" element={<TransactionsPage />} />
        <Route path="/Alerts" element={<AlertsPage />} />
        <Route path="/Settings" element={<SettingPage />} />
      </Route>
    </Routes>
  );
};

export default Router;
