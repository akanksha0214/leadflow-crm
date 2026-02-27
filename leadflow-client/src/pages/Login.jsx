import { TextField, Button, Typography, Box, Paper } from "@mui/material";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import { motion } from "framer-motion";
import { useDispatch } from "react-redux";
import { loginUser } from "../redux/authSlice";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import AuthBackground from "../components/AuthBackground";
import toast from "react-hot-toast";


const MotionPaper = motion(Paper);

const Login = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // const handleSubmit = (e) => {
  //   e.preventDefault();
  //   dispatch(loginUser({ email, password }));
  //   navigate("/dashboard");
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const result = await dispatch(loginUser({ email, password }));
    console.log(result)

    if (result.meta.requestStatus === "fulfilled") {
      toast.success("Login successful 🎉");
      navigate("/dashboard");
    } else {
      toast.error(
        result.payload?.msg || "Invalid email or password"
      );
    }
  };

  return (
    <AuthBackground>
      <MotionPaper
        elevation={24}
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        whileHover={{ scale: 1.03 }}
        sx={{
          width: 380,
          p: 4,
          borderRadius: 4,
          backdropFilter: "blur(16px)",
          background: "rgba(20, 28, 48, 0.65)",
          border: "1px solid rgba(255,255,255,0.08)",
          color: "#fff",
          boxShadow: "0 30px 80px rgba(0,0,0,0.6)",
        }}
      >
        {/* Icon */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            mb: 2,
          }}
        >
          <LockOutlinedIcon sx={{ fontSize: 40 }} />
        </Box>

        <Typography
          variant="h5"
          textAlign="center"
          fontWeight="bold"
          gutterBottom
        >
          Welcome Back
        </Typography>

        <Typography
          variant="body2"
          textAlign="center"
          sx={{ mb: 3, opacity: 0.8 }}
        >
          Sign in to your CRM dashboard
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Email"
            variant="outlined"
            margin="normal"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            InputLabelProps={{ style: { color: "#ddd" } }}
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
              },
            }}
          />

          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputLabelProps={{ style: { color: "#ddd" } }}
            sx={{
              input: { color: "#fff" },
              "& .MuiOutlinedInput-root": {
                "& fieldset": {
                  borderColor: "rgba(255,255,255,0.3)",
                },
                "&:hover fieldset": {
                  borderColor: "#fff",
                },
              },
            }}
          />

          <Button
            fullWidth
            type="submit"
            size="large"
            sx={{
              mt: 3,
              py: 1.2,
              borderRadius: 3,
              background:
                "linear-gradient(90deg, #00c6ff, #0072ff)",
              fontWeight: "bold",
              color: "#fff",
              boxShadow: "0 10px 20px rgba(0,0,0,0.4)",
              "&:hover": {
                transform: "translateY(-2px)",
              },
            }}
          >
            Login
          </Button>
        </form>
      </MotionPaper>
    </AuthBackground>
  );
};

export default Login;
