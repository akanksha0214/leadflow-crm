import {
    Dialog,
    DialogTitle,
    DialogContent,
    Button,
    Box,
    IconButton,
    TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useState } from "react";
import dayjs from "dayjs";
import api from "../../services/instance";

const SetFollowUpModal = ({ open, onClose, leadId, onSuccess }) => {
    const [date, setDate] = useState("");
    const [loading, setLoading] = useState(false);

    const minDateTime = dayjs().add(1, "minute").format("YYYY-MM-DDTHH:mm");

    const handleSave = async () => {
        if (!date) return alert("Select follow-up date");

        if (dayjs(date).isBefore(dayjs())) {
            return alert("Follow-up must be in the future");
        }

        setLoading(true);
        try {
            await api.put(`/lead/next-followup/${leadId}`, {
                next_followup_date: dayjs(date).toISOString(),
            });

            onSuccess();
            onClose();
        } catch {
            alert("Failed to set follow-up");
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
                Set Next Follow-up
                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent>
                <Box sx={{ mt: 2 }}>
                    <TextField
                        type="datetime-local"
                        fullWidth
                        value={date}
                        inputProps={{
                            min: minDateTime,
                        }}
                        onChange={(e) => setDate(e.target.value)}
                    />

                    <Button
                        fullWidth
                        sx={{ mt: 3 }}
                        variant="contained"
                        onClick={handleSave}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Save Follow-up"}
                    </Button>
                </Box>
            </DialogContent>
        </Dialog>
    );
};

export default SetFollowUpModal;
