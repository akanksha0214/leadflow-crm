import {
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  Box,
  Divider,
} from "@mui/material";
import dayjs from "dayjs";
import api from "../../services/instance";
import { useEffect, useState } from "react";
import socket from "../../services/socket";

const LeadActivityModal = ({ open, onClose, leadId }) => {
  const [activities, setActivities] = useState([]);

  // 1️⃣ Fetch existing activities when modal opens
  useEffect(() => {
    if (!open || !leadId) return;

    api.get(`/lead/activities/${leadId}`).then((res) => {
      setActivities(res.data);
    });
  }, [open, leadId]);

  // 2️⃣ Listen for real-time activity updates
  useEffect(() => {
    if (!open || !leadId) return;

    const handleActivity = (data) => {
      // 🔒 only update if activity belongs to this lead
      if (String(data.lead) !== String(leadId)) return;

      setActivities((prev) => [
        {
          _id: data._id,
          message: data.message,
          user: data.user,
          createdAt: data.createdAt,
        },
        ...prev,
      ]);
    };

    socket.on("new_notification", handleActivity);

    return () => {
      socket.off("new_notification", handleActivity);
    };
  }, [open, leadId]);

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Lead Activity</DialogTitle>

      <DialogContent>
        {activities.length === 0 ? (
          <Typography>No activity yet</Typography>
        ) : (
          activities.map((a, i) => (
            <Box key={i} sx={{ mb: 2 }}>
              <Typography fontWeight={600}>{a.message}</Typography>
              <Typography variant="caption" sx={{ opacity: 0.7 }}>
                {a.user?.name || "System"} ·{" "}
                {dayjs(a.createdAt).format("DD MMM YYYY, hh:mm A")}
              </Typography>
              <Divider sx={{ mt: 1 }} />
            </Box>
          ))
        )}
      </DialogContent>
    </Dialog>
  );
};

export default LeadActivityModal;
