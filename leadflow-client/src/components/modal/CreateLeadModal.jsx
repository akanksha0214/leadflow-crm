import {
  Dialog,
  DialogTitle,
  DialogContent,
  TextField,
  Button,
  MenuItem,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useState, useEffect } from "react";
import api from "../../services/instance";
import { DateTimePicker } from "@mui/x-date-pickers/DateTimePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import dayjs from "dayjs";
import toast from "react-hot-toast";

const SOURCES = [
  { label: "Website", value: "website" },
  { label: "WhatsApp", value: "whatsapp" },
  { label: "Referral", value: "referral" },
];

const STATUS = [
  { label: "New", value: "new" },
  { label: "Contacted", value: "contacted" },
  { label: "Interested", value: "interested" },
  { label: "Converted", value: "converted" },
  { label: "Lost", value: "lost" },
];

const CreateLeadModal = ({ open, onClose, onSuccess, lead }) => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [source, setSource] = useState("website");
  const [notes, setNotes] = useState("");
  const [loading, setLoading] = useState(false);
  const [followUpDate, setFollowUpDate] = useState(null);
  const [status, setStatus] = useState("")

  useEffect(() => {
    if (lead) {
      setName(lead.name);
      setEmail(lead.email || "");
      setPhone(lead.phone || "");
      setSource(lead.source);
      setNotes(lead.notes || "");
      setStatus(lead.status || "new");
      setFollowUpDate(
        lead.next_followup_date ? dayjs(lead.next_followup_date) : null
      );
    }
  }, [lead]);



  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);

  //   const payload = {
  //     name,
  //     email,
  //     phone,
  //     source,
  //     notes,
  //     next_followup_date: followUpDate
  //       ? followUpDate.toISOString()
  //       : null,
  //   };

  //   if (lead) {
  //     payload.status = status;
  //   }

  //   try {
  //     if (lead) {
  //       // ✏️ EDIT
  //       await api.put(`/lead/${lead._id}`, payload);
  //     } else {
  //       // ➕ CREATE
  //       await api.post("/lead/create-lead", payload);
  //     }

  //     onSuccess();
  //     onClose();
  //     resetForm();
  //   } catch (err) {
  //     alert("Failed to save lead");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      name,
      email,
      phone,
      source,
      notes,
      next_followup_date: followUpDate
        ? followUpDate.toISOString()
        : null,
    };

    if (lead) {
      payload.status = status;
    }

    const loadingToast = toast.loading(
      lead ? "Updating lead..." : "Creating lead..."
    );

    try {
      let res;

      if (lead) {
        // ✏️ EDIT
        res = await api.put(`/lead/${lead._id}`, payload);
      } else {
        // ➕ CREATE
        res = await api.post("/lead/create-lead", payload);
      }

      toast.dismiss(loadingToast);
      toast.success(
        res.data?.msg ||
        (lead ? "Lead updated successfully" : "Lead created successfully")
      );

      onSuccess();
      onClose();
      resetForm();
    } catch (err) {
      toast.dismiss(loadingToast);

      toast.error(
        err.response?.data?.msg || "Failed to save lead"
      );
    } finally {
      setLoading(false);
    }
  };


  const enhanceNotes = async () => {
    try {
      const res = await api.post("/ai/format-notes", {
        notes,
      });

      setNotes(res.data.formattedNotes);
    } catch (err) {
      console.error(err.response?.data || err.message);
      alert(err.response?.data?.msg || "AI failed to format notes");
    }
  };

  const resetForm = () => {
    setName("");
    setEmail("");
    setPhone("");
    setSource("website");
    setNotes("");
    setFollowUpDate(null);
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
      <DialogTitle>
        {lead ? "Edit Lead" : "Add Lead"}
      </DialogTitle>


      <DialogContent>
        <Box component="form" onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Lead Name"
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
          />

          <TextField
            fullWidth
            label="Phone"
            margin="normal"
            value={phone}
            onChange={(e) => {
              const onlyNumbers = e.target.value.replace(/\D/g, "");
              setPhone(onlyNumbers.slice(0, 10));
            }}
            sx={inputStyles}
            inputProps={{
              inputMode: "numeric",
              pattern: "[0-9]*",
            }}
          />

          <TextField
            select
            fullWidth
            label="Source"
            margin="normal"
            value={source}
            onChange={(e) => setSource(e.target.value)}
            sx={inputStyles}
          >
            {SOURCES.map((s) => (
              <MenuItem key={s.value} value={s.value}>
                {s.label}
              </MenuItem>
            ))}
          </TextField>

          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DateTimePicker
              label="Next Follow-up Date"
              value={followUpDate}
              onChange={(newValue) => setFollowUpDate(newValue)}
              sx={inputStyles}
              slotProps={{
                textField: {
                  fullWidth: true,
                  margin: "normal",
                },
              }}
            />
          </LocalizationProvider>

          {lead && (
            <TextField
              select
              fullWidth
              label="Status"
              margin="normal"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              sx={inputStyles}
            >
              {STATUS.map((s) => (
                <MenuItem key={s.value} value={s.value}>
                  {s.label}
                </MenuItem>
              ))}
            </TextField>
          )}

          <Button
            size="small"
            onClick={enhanceNotes}
            className="d-flex flex-end"
            sx={{ textTransform: "none" }}
          >
            ✨ Enhance Notes
          </Button>

          <TextField
            fullWidth
            label="Notes"
            margin="normal"
            multiline
            rows={3}
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            sx={inputStyles}
          />


          <Button type="submit">
            {loading
              ? "Saving..."
              : lead
                ? "Update Lead"
                : "Add Lead"}
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

export default CreateLeadModal;
