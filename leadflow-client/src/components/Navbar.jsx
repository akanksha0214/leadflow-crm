import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Button,
  Avatar,
  Divider,
  IconButton,
  Badge,
  Menu,
  MenuItem,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "../services/socket";
import api from "../services/instance";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const joinedRef = useRef(false);
  const open = Boolean(anchorEl);

  const handleLogout = async () => {
    await dispatch(logoutUser());
    navigate("/login");
  };

  // // 🔌 SOCKET SETUP
  // useEffect(() => {
  //   if (!user?._id) return;

  //   socket.emit("join", user._id);

  //   const handleNotification = (data) => {
  //       console.log("🔔 Notification received:", data);
  //     setNotifications((prev) => [data, ...prev]);
  //   };

  //   socket.on("new_notification", handleNotification);

  //   return () => {
  //     socket.off("new_notification", handleNotification);
  //   };
  // }, [user?._id]);

  // useEffect(() => {
  //   if (!user?.id) return;

  //   console.log("🔥 Joining room:", user.id);

  //   socket.emit("join", user.id);

  //   const handleNotification = (data) => {
  //     console.log("🔔 Notification received:", data);
  //     setNotifications((prev) => [data, ...prev]);
  //   };

  //   socket.on("new_notification", handleNotification);

  //   return () => {
  //     socket.off("new_notification", handleNotification);
  //   };
  // }, [user?.id]);


  useEffect(() => {
    if (!user?.id) return;

    // 🔥 Join only once
    socket.emit("join", user.id);

    const handleNotification = (data) => {
      console.log("🔔 Notification received:", data);

      setNotifications((prev) => {
        // ✅ prevent duplicate by id
        const exists = prev.some(n => n._id === data._id);
        if (exists) return prev;

        return [data, ...prev];
      });
    };

    // 🔥 Remove any existing listeners first
    socket.off("new_notification");
    socket.on("new_notification", handleNotification);

    return () => {
      socket.off("new_notification", handleNotification);
    };
  }, [user?.id]);

  useEffect(() => {
    const hydrate = async () => {
      const res = await api.get("/notifications");
      // setNotifications(res.data);
      setNotifications((prev) => {
        const existingIds = new Set(prev.map(n => n._id));
        const newOnes = res.data.filter(n => !existingIds.has(n._id));
        return [...prev, ...newOnes];
      });
    };

    hydrate();
  }, []);


  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  // const handleClearNotifications = () => {
  //   setNotifications([]);
  //   setAnchorEl(null);
  // };

  const handleClearNotifications = async () => {
    try {
      await api.put("/notifications/read");  // 🔥 mark read in DB
      setNotifications([]);                 // clear local state
      setAnchorEl(null);
    } catch (err) {
      console.error("Failed to clear notifications");
    }
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(10px)",
        background: "rgba(11,15,25,0.9)",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      <Toolbar sx={{ px: 3, display: "flex", justifyContent: "space-between" }}>
        {/* LEFT — BRAND */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
          <Box
            sx={{
              width: 10,
              height: 10,
              borderRadius: "50%",
              background: "linear-gradient(90deg,#00c6ff,#7f00ff)",
            }}
          />
          <Typography variant="h6" sx={{ opacity: 0.5 }}>
            CRM
          </Typography>
        </Box>

        {/* RIGHT — ACTIONS */}
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          {user?.role === "admin" && (
            <Button
              onClick={() => navigate("/create-user")}
              sx={{
                textTransform: "none",
                fontWeight: 500,
                color:
                  location.pathname === "/create-user"
                    ? "#00c6ff"
                    : "#bbb",
                borderBottom:
                  location.pathname === "/create-user"
                    ? "2px solid #00c6ff"
                    : "2px solid transparent",
                borderRadius: 0,
                "&:hover": {
                  color: "#fff",
                  background: "transparent",
                },
              }}
            >
              Create User
            </Button>
          )}
          {/* 📂 LEADS MENU */}
          <Button
            onClick={() => navigate("/leads")}
            sx={{
              textTransform: "none",
              fontWeight: 500,
              color: location.pathname === "/leads" ? "#00c6ff" : "#bbb",
              borderBottom:
                location.pathname === "/leads"
                  ? "2px solid #00c6ff"
                  : "2px solid transparent",
              borderRadius: 0,
              "&:hover": {
                color: "#fff",
                background: "transparent",
              },
            }}
          >
            Leads
          </Button>
          <Divider orientation="vertical" flexItem />


          <IconButton onClick={(e) => setAnchorEl(e.currentTarget)}>
            <Badge badgeContent={notifications.length} color="error">
              <NotificationsIcon sx={{ color: "#fff" }} />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            PaperProps={{
              sx: {
                width: 360,
                background: "#0f1629",
                border: "1px solid rgba(255,255,255,0.08)",
              },
            }}
          >
            {/* HEADER */}
            <Box
              sx={{
                px: 2,
                py: 1,
                display: "flex",
                justifyContent: "space-between",
                borderBottom: "1px solid rgba(255,255,255,0.08)",
              }}
            >
              <Typography fontWeight={600}>Notifications</Typography>

              {notifications.length > 0 && (
                <Button
                  size="small"
                  onClick={handleClearNotifications}
                  sx={{ textTransform: "none", color: "#00c6ff" }}
                >
                  Clear all
                </Button>
              )}
            </Box>

            {/* BODY */}
            {notifications.length === 0 ? (
              <MenuItem sx={{ opacity: 0.6 }}>
                No new notifications
              </MenuItem>
            ) : (
              notifications.map((n) => (
                <MenuItem key={n._id} sx={{ alignItems: "flex-start" }}>
                  <Box>
                    <Typography variant="body2">
                      {n.message}
                    </Typography>
                    <Typography variant="caption" sx={{ opacity: 0.6 }}>
                      {new Date(n.createdAt).toLocaleString()}
                    </Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Menu>

          {/* USER INFO */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
            <Avatar
              sx={{
                width: 36,
                height: 36,
                background:
                  "linear-gradient(135deg,#7f00ff,#00c6ff)",
              }}
            >
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box>
              <Typography variant="body2">{user?.name}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.6 }}>
                {user?.role}
              </Typography>
            </Box>
          </Box>

          {/* LOGOUT */}
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            sx={{ color: "#bbb" }}
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
