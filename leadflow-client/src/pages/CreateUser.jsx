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
} from "@mui/material";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CreateUserModal from "../components/modal/CreateUserModal";
import api from "../services/instance";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [open, setOpen] = useState(false);

  const fetchUsers = async () => {
    const res = await api.get("/auth/users");
    setUsers(res.data);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <DashboardLayout>
      {/* Header */}
      <Box
        sx={{
          mb: 3,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h5" fontWeight="bold">
          Users
        </Typography>

        <Button
          startIcon={<PersonAddAltOutlinedIcon />}
          onClick={() => setOpen(true)}
          sx={{
            background: "linear-gradient(90deg,#00c6ff,#0072ff)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Create User
        </Button>
      </Box>

      {/* Table */}
      <Paper
        sx={{
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: 3,
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell sx={{ color: "#fff" }}>Name</TableCell>
              <TableCell sx={{ color: "#fff" }}>Email</TableCell>
              <TableCell sx={{ color: "#fff" }}>Role</TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {users.map((u) => (
              <TableRow key={u._id}>
                <TableCell sx={{ color: "#ddd" }}>{u.name}</TableCell>
                <TableCell sx={{ color: "#aaa" }}>{u.email}</TableCell>
                <TableCell>
                  <Chip
                    label={u.role}
                    size="small"
                    sx={{
                      textTransform: "capitalize",
                      background:
                        u.role === "admin"
                          ? "rgba(0,198,255,0.2)"
                          : "rgba(255,255,255,0.15)",
                      color: "#fff",
                    }}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>

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
