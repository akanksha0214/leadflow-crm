import { Grid, Paper, Typography, CircularProgress } from "@mui/material";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import api from "../services/instance";

const StatCard = ({ title, value }) => {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        background: "rgba(255,255,255,0.04)",
        border: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Typography variant="body2" sx={{ opacity: 0.7 }}>
        {title}
      </Typography>
      <Typography variant="h4" fontWeight="bold">
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
      } catch (err) {
        console.error("Failed to fetch stats");
      }
    };

    fetchStats();
  }, []);

  return (
    <DashboardLayout>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Dashboard Overview
      </Typography>

      {!stats ? (
        <CircularProgress sx={{ mt: 4 }} />
      ) : (
        <Grid container spacing={3} sx={{ mt: 1 }}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Total Leads" value={stats.totalLeads} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="New Leads" value={stats.newLeads} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Follow Ups Due" value={stats.followUpsDue} />
          </Grid>

          <Grid item xs={12} sm={6} md={3}>
            <StatCard title="Closed Leads" value={stats.closedLeads} />
          </Grid>
        </Grid>
      )}
    </DashboardLayout>
  );
};

export default Dashboard;