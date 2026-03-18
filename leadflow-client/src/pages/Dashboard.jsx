import { Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/instance";
import "./Dashboard.css";

const StatCard = ({ title, value, type }) => {
  return (
    <Paper className={`dashboard-stat-card ${type}`}>
      <Typography variant="body2" className="dashboard-stat-title">
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold" className="dashboard-stat-value">
        {value}
      </Typography>
    </Paper>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await api.get("/lead/dashboard");
        setStats(res.data);
        console.log(res.data);
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <div className="dashboard-container">
        <div className="dashboard-header">
          <Typography variant="h5" fontWeight="bold" className="dashboard-title">
            Dashboard Overview
          </Typography>
          <Typography variant="body2" className="dashboard-subtitle">
            Monitor your key metrics and performance indicators
          </Typography>
        </div>

        {!stats ? (
          <div className="dashboard-loading">
            <CircularProgress className="dashboard-loading-spinner" />
          </div>
        ) : (
          <div className="dashboard-stats-grid">
            <StatCard 
              title="Total Leads" 
              value={stats.totalLeads} 
              type="total-leads" 
            />

            <StatCard 
              title="New Leads" 
              value={stats.newLeads} 
              type="new-leads" 
            />

            <StatCard 
              title="Follow Ups Due" 
              value={stats.followUpsDue} 
              type="follow-ups" 
            />

            <StatCard 
              title="Closed Leads" 
              value={stats.closedLeads} 
              type="closed-leads" 
            />
          </div>
        )}
      </div>
    </DashboardLayout>
  );
};

export default Dashboard;