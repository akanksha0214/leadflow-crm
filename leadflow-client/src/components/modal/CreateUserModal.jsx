import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PersonAddAltOutlinedIcon from "@mui/icons-material/PersonAddAltOutlined";
import { useState } from "react";
import api from "../../services/instance";

const CreateUserModal = ({ open, onClose, onSuccess }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("agent");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/auth/create-user", {
        name,
        email,
        password,
        role,
      });

      onSuccess();   // refresh table
      onClose();     // close modal

      setName("");
      setEmail("");
      setPassword("");
      setRole("agent");
    } catch (err) {
      alert(err.response?.data?.msg || "Failed to create user");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background: "#0f1629",
          borderRadius: 3,
          border: "1px solid rgba(255,255,255,0.08)",
        },
      }}
    >
      <DialogTitle
        sx={{
          color: "#fff",
          display: "flex",
          alignItems: "center",
          gap: 1,
        }}
      >
        <PersonAddAltOutlinedIcon />
        Create User
        <IconButton
          onClick={onClose}
          sx={{ marginLeft: "auto", color: "#aaa" }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Full Name"
            margin="normal"
            value={name}
            onChange={(e) => setName(e.target.value)}
            sx={inputStyles}
            required
          />

          <TextField
            fullWidth
            label="Email"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            sx={inputStyles}
            required
          />

          <TextField
            fullWidth
            label="Temporary Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            sx={inputStyles}
            required
          />

          <TextField
            select
            fullWidth
            label="Role"
            margin="normal"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            sx={inputStyles}
          >
            <MenuItem value="agent">Agent</MenuItem>
            <MenuItem value="admin">Admin</MenuItem>
          </TextField>

          <Button
            fullWidth
            type="submit"
            disabled={loading}
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 2,
              background: "linear-gradient(90deg,#00c6ff,#0072ff)",
              fontWeight: "bold",
              color: "#fff",
            }}
          >
            {loading ? "Creating..." : "Create User"}
          </Button>
        </Box>
      </DialogContent>
    </Dialog>
  );
};

const inputStyles = {
  "& .MuiOutlinedInput-root": {
    background: "rgba(255,255,255,0.05)",
    color: "#fff",
    "& fieldset": {
      borderColor: "rgba(255,255,255,0.25)",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#00c6ff",
    },
  },
  "& .MuiInputLabel-root": {
    color: "rgba(255,255,255,0.65)",
  },
  "& .MuiInputLabel-root.Mui-focused": {
    color: "#00c6ff",
  },
};

export default CreateUserModal;
