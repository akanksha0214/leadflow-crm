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
  Chip,
  Tooltip,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { useEffect, useState, useRef } from "react";
import NotificationsIcon from "@mui/icons-material/Notifications";
import LogoutIcon from "@mui/icons-material/Logout";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../redux/authSlice";
import { useNavigate, useLocation } from "react-router-dom";
import socket from "../services/socket";
import api from "../services/instance";
import "./Navbar.css";

const Navbar = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useSelector((state) => state.auth);

  const [anchorEl, setAnchorEl] = useState(null);
  const [notifications, setNotifications] = useState([]);

  const joinedRef = useRef(false);
  const open = Boolean(anchorEl);

  // 🔊 Notification sound function
  const playNotificationSound = () => {
    try {
      // Create audio context for better browser compatibility
      const audioContext = new (window.AudioContext || window.webkitAudioContext)();
      
      // Create oscillator for pop sound
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();
      
      // Connect nodes
      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);
      
      // Configure sound - short pop
      oscillator.frequency.setValueAtTime(800, audioContext.currentTime); // Start frequency
      oscillator.frequency.exponentialRampToValueAtTime(400, audioContext.currentTime + 0.1); // End frequency
      
      // Configure volume envelope
      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime); // Start volume
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1); // Fade out
      
      // Play sound
      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.1);
      
    } catch (error) {
      // Fallback to HTML5 audio if Web Audio API fails
      try {
        const audio = new Audio("data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmwhBSuBzvLZiTYIG2m98OScTgwOUarm7blmGgU7k9n1unEiBC13yO/eizEIHWq+8+OWT");
        audio.volume = 0.3;
        audio.play().catch(() => {
          // Silent fail if audio can't play
        });
      } catch (fallbackError) {
        // Silent fail if both methods fail
      }
    }
  };

  // Helper function to format relative time
  const formatRelativeTime = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return "Just now";
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

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

        // 🔊 Play notification sound for new notification
        playNotificationSound();

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
      className="navbar-appbar"
    >
      <Toolbar className="navbar-toolbar">
        {/* LEFT — BRAND */}
        <Box className="navbar-brand">
          <Box className="navbar-brand-dot" />
          <Typography variant="h6" className="navbar-brand-text" onClick={() => navigate("/dashboard")}>
            CRM
          </Typography>
        </Box>

        {/* RIGHT — ACTIONS */}
        <Box className="navbar-actions">
          {user?.role === "admin" && (
            <Button
              onClick={() => navigate("/create-user")}
              className={`navbar-nav-item ${location.pathname === "/create-user" ? "active" : ""}`}
            >
              Create User
            </Button>
          )}
          
          {/* LEADS MENU */}
          <Button
            onClick={() => navigate("/leads")}
            className={`navbar-nav-item ${location.pathname === "/leads" ? "active" : ""}`}
          >
            Leads
          </Button>
          
          <Divider orientation="vertical" flexItem />

          {/* NOTIFICATIONS */}
          <IconButton 
            onClick={(e) => setAnchorEl(e.currentTarget)}
            className="navbar-notification-btn"
          >
            <Badge 
              badgeContent={notifications.length} 
              color="error"
              className="navbar-notification-badge"
            >
              <NotificationsIcon />
            </Badge>
          </IconButton>

          <Menu
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            className="navbar-notification-menu"
            PaperProps={{ className: "navbar-menu-paper" }}
            transformOrigin={{
              horizontal: { xs: 'center', sm: 'right', md: 'right' },
              vertical: 'top'
            }}
            anchorOrigin={{
              horizontal: { xs: 'center', sm: 'right', md: 'right' },
              vertical: 'bottom'
            }}
            MenuListProps={{
              className: "navbar-notification-list"
            }}
          >
            {/* HEADER */}
            <Box className="navbar-notification-header">
              <Box className="navbar-notification-title-section">
                <Box className="navbar-notification-title-content">
                  <Box className="navbar-notification-indicator" />
                  <Typography className="navbar-notification-title">
                    Notifications
                  </Typography>
                </Box>
                {notifications.length > 0 && (
                  <Chip 
                    label={notifications.length} 
                    size="small"
                    className="navbar-notification-count"
                  />
                )}
              </Box>

              {notifications.length > 0 && (
                <Button
                  size="small"
                  onClick={handleClearNotifications}
                  className="navbar-clear-btn"
                >
                  Clear all
                </Button>
              )}
            </Box>

            {/* BODY */}
            <Box className="navbar-notification-body">
              {notifications.length === 0 ? (
                <Box className="navbar-notification-empty">
                  <Box className="navbar-empty-icon-container">
                    <NotificationsIcon className="navbar-empty-icon" />
                  </Box>
                  <Typography variant="h6" className="navbar-empty-title">
                    No notifications
                  </Typography>
                  <Typography variant="body2" className="navbar-empty-subtitle">
                    You're all caught up!
                  </Typography>
                </Box>
              ) : (
                notifications.map((n, index) => (
                  <MenuItem
                    key={n._id}
                    onClick={handleMenuClose}
                    className="navbar-notification-item"
                  >
                    <Box className="navbar-notification-content">
                      <Box className="navbar-notification-indicator-dot" />
                      <Box className="navbar-notification-text">
                        <Typography className="navbar-notification-message">
                          {n.message}
                        </Typography>
                        <Typography className="navbar-notification-time">
                          {formatRelativeTime(n.createdAt)}
                        </Typography>
                      </Box>
                    </Box>
                  </MenuItem>
                ))
              )}
            </Box>
          </Menu>

          {/* USER INFO */}
          <Box className="navbar-user-info">
            <Avatar className="navbar-avatar">
              {user?.name?.charAt(0).toUpperCase()}
            </Avatar>

            <Box className="navbar-user-details">
              <Typography variant="body2">{user?.name}</Typography>
              <Typography variant="caption">{user?.role}</Typography>
            </Box>
          </Box>

          {/* LOGOUT */}
          <Button
            onClick={handleLogout}
            startIcon={<LogoutIcon />}
            className="navbar-logout-btn"
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
