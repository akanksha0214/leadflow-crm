import {
  Box,
  Button,
  Typography,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  TextField,
  InputAdornment,
  Tooltip,
  IconButton,
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CreateUserModal from "../components/modal/CreateUserModal";
import api from "../services/instance";
import "./CreateUser.css";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  const fetchUsers = async () => {
    const res = await api.get("/auth/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  // Filter users based on search term
  const filteredUsers = users.filter(
    (user) =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.role.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Calculate user statistics
  const totalUsers = users.length;
  const adminUsers = users.filter((u) => u.role === "admin").length;
  const regularUsers = users.filter((u) => u.role === "user").length;

  return (
    <DashboardLayout>
      {/* Header Section */}
      <Box className="users-header">
        <Box className="users-header-content">
          <Typography 
            variant="h4" 
            className="users-main-title"
          >
            Users Management
          </Typography>
          <Typography 
            variant="body2" 
            className="users-subtitle"
          >
            Manage system users and their roles
          </Typography>
        </Box>

        <Button
          startIcon={<PersonAddAltOutlinedIcon />}
          onClick={() => setOpen(true)}
          fullWidth={{ xs: true, sm: false }}
          className="users-create-button"
        >
          Create User
        </Button>
      </Box>

      {/* Stats Cards */}
      <Box className="users-stats-container">
        <Paper className="users-stats-card total">
          <Typography 
            variant="h4" 
            className="users-stats-number"
          >
            {totalUsers}
          </Typography>
          <Typography 
            variant="body2" 
            className="users-stats-label"
          >
            Total Users
          </Typography>
        </Paper>

        <Paper className="users-stats-card admin">
          <Typography 
            variant="h4" 
            className="users-stats-number"
          >
            {adminUsers}
          </Typography>
          <Typography 
            variant="body2" 
            className="users-stats-label"
          >
            Admin Users
          </Typography>
        </Paper>

        <Paper className="users-stats-card regular">
          <Typography 
            variant="h4" 
            className="users-stats-number"
          >
            {regularUsers}
          </Typography>
          <Typography 
            variant="body2" 
            className="users-stats-label"
          >
            Regular Users
          </Typography>
        </Paper>
      </Box>

      {/* Search Bar */}
      <Box className="users-search-container">
        <TextField
          fullWidth
          placeholder="Search users by name, email, or role..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="users-search-field"
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon className="users-search-icon" />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      {/* Users Table */}
      {filteredUsers.length === 0 ? (
        <Paper className="users-empty-state">
          <Typography variant="h6" className="users-empty-title">
            {searchTerm ? "No users found matching your search" : "No users found"}
          </Typography>
          <Typography variant="body1" className="users-empty-subtitle">
            {searchTerm ? "Try adjusting your search criteria" : "Create your first user to get started"}
          </Typography>
        </Paper>
      ) : (
        <Box className="users-table-container">
          <Box className="users-table-wrapper">
            <Paper className="users-table-paper">
              <Table className="users-table">
                <TableHead>
                  <TableRow className="users-table-head">
                    <TableCell className="users-header-cell name">
                      Name
                    </TableCell>
                    <TableCell className="users-header-cell email">
                      Email
                    </TableCell>
                    <TableCell className="users-header-cell role">
                      Role
                    </TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredUsers.map((u) => (
                    <TableRow
                      key={u._id}
                      className="users-table-row"
                    >
                      <TableCell className="users-body-cell name">
                        {u.name}
                      </TableCell>
                      <TableCell className="users-body-cell email">
                        {u.email}
                      </TableCell>
                      <TableCell className="users-body-cell role">
                        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                          <Chip
                            label={u.role}
                            size="small"
                            className={`users-role-chip ${u.role}`}
                          />
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Box>
        </Box>
      )}

      {/* Modal */}
      <CreateUserModal
        open={open}
        onClose={() => setOpen(false)}
        onSuccess={fetchUsers}
      />
    </DashboardLayout>
  );
};

export default Users;
