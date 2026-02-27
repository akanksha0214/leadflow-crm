import { Box } from "@mui/material";
import Navbar from "./Navbar";

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ minHeight: "100vh", background: "#0b0f19", color: "#fff" }}>
      <Navbar />
      <Box sx={{ p: 2 }}>{children}</Box>
    </Box>
  );
};

export default DashboardLayout;
