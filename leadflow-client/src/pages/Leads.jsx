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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CreateLeadModal from "../components/modal/CreateLeadModal";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import api from "../services/instance";
import dayjs from "dayjs";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import Tooltip from "@mui/material/Tooltip";
import SetFollowUpModal from "../components/modal/SetFollowUpModal";
import LeadActivityModal from "../components/modal/LeadActivityModal";
import toast from "react-hot-toast";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [activityOpen, setActivityOpen] = useState(false);

  const isOverdue = (lead) =>
    lead.next_followup_date &&
    dayjs(lead.next_followup_date).isBefore(dayjs());

  const fetchLeads = async () => {
    const res = await api.get("/lead/leads");
    setLeads(res.data);
  };

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Delete this lead?")) return;

  //   try {
  //     await api.delete(`/lead/${id}`);
  //     fetchLeads();
  //   } catch (err) {
  //     alert("Failed to delete lead");
  //   }
  // };

  const handleDelete = async (id) => {
    toast(
      (t) => (
        <div>
          <p>Delete this lead?</p>
          <div style={{ marginTop: 5 }}>
            <button
              onClick={async () => {
                toast.dismiss(t.id);

                const loadingToast = toast.loading("Deleting...");

                try {
                  await api.delete(`/lead/${id}`);
                  toast.dismiss(loadingToast);
                  toast.success("Lead deleted");
                  fetchLeads();
                } catch (err) {
                  toast.dismiss(loadingToast);
                  toast.error("Failed to delete lead");
                }
              }}
              style={{ marginRight: 10 }}
            >
              Yes
            </button>

            <button onClick={() => toast.dismiss(t.id)}>
              Cancel
            </button>
          </div>
        </div>
      ),
      { duration: 5000 }
    );
  };

  // const handleFollowUpDone = async (id) => {
  //   try {
  //     await api.put(`/lead/followup/${id}`);
  //     fetchLeads();
  //   } catch (err) {
  //     alert("Failed to mark follow-up done");
  //   }
  // };

  const handleFollowUpDone = async (id) => {
    const loadingToast = toast.loading("Marking follow-up as done...");

    try {
      const res = await api.put(`/lead/followup/${id}`);

      toast.dismiss(loadingToast);
      toast.success(res.data?.msg || "Follow-up marked as done");

      fetchLeads(); // refresh list
    } catch (err) {
      toast.dismiss(loadingToast);

      toast.error(
        err.response?.data?.msg || "Failed to mark follow-up done"
      );
    }
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const sortedLeads = [...leads].sort((a, b) => {
    const aOverdue = isOverdue(a);
    const bOverdue = isOverdue(b);

    if (aOverdue && !bOverdue) return -1;
    if (!aOverdue && bOverdue) return 1;
    return 0;
  });


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
          Leads
        </Typography>

        <Button
          startIcon={<AddCircleOutlineIcon />}
          onClick={() => setOpen(true)}
          sx={{
            background: "linear-gradient(90deg,#00c6ff,#0072ff)",
            color: "#fff",
            fontWeight: 600,
          }}
        >
          Add Lead
        </Button>
      </Box>

      {/* Leads Table */}
      {sortedLeads.length === 0 ? (
        <Box
          sx={{
            minHeight: "300px",        // gives vertical space
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexDirection: "column",
          }}>
          <Typography variant="h6" sx={{ color: "#fff", mb: 1 }}>
            No Leads Yet
          </Typography>
        </Box>
      ) : (
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
                <TableCell sx={{ color: "#fff" }}>Phone</TableCell>
                <TableCell sx={{ color: "#fff" }}>Follow Up Date</TableCell>
                <TableCell sx={{ color: "#fff" }}>Source</TableCell>
                <TableCell sx={{ color: "#fff" }}>Status</TableCell>
                <TableCell sx={{ color: "#fff" }}>Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {sortedLeads.map((l) => (
                <TableRow
                  key={l._id}
                  sx={{
                    backgroundColor: isOverdue(l)
                      ? "rgba(255, 77, 77, 0.08)"
                      : "transparent",
                  }}
                >
                  <TableCell sx={{ color: "#ddd" }}>{l.name}</TableCell>
                  <TableCell sx={{ color: "#aaa" }}>{l.email || "-"}</TableCell>
                  <TableCell sx={{ color: "#aaa" }}>{l.phone || "-"}</TableCell>
                  <TableCell sx={{ color: "#aaa" }}>
                    {l.next_followup_date
                      ? dayjs(l.next_followup_date).format("DD MMM YYYY, hh:mm A")
                      : "-"}
                  </TableCell>

                  <TableCell sx={{ color: "#aaa", textTransform: "capitalize" }}>
                    {l.source}
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={l.status}
                      size="small"
                      sx={{
                        textTransform: "capitalize",
                        background: isOverdue(l)
                          ? "rgba(255, 77, 77, 0.25)"
                          : "rgba(0,198,255,0.2)",
                        color: "#fff",
                      }}
                    />

                  </TableCell>

                  {/* ACTIONS */}
                  <TableCell>
                    <IconButton
                      onClick={() => {
                        setSelectedLead(l);
                        setOpen(true);
                      }}
                      sx={{ color: "#00c6ff" }}
                    >
                      <EditIcon />
                    </IconButton>

                    <IconButton
                      onClick={() => handleDelete(l._id)}
                      sx={{ color: "#ff6b6b" }}
                    >
                      <DeleteOutlineIcon />
                    </IconButton>

                    {l.next_followup_date && (
                      <Tooltip title="Mark follow-up done">
                        <IconButton
                          onClick={() => handleFollowUpDone(l._id)}
                          sx={{
                            color: isOverdue(l) ? "#ff6b6b" : "#00c6ff",
                          }}
                        >
                          <CheckCircleOutlineIcon />
                        </IconButton>
                      </Tooltip>
                    )}

                    {!l.next_followup_date && (
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedLeadId(l._id);
                          setFollowUpModalOpen(true);
                        }}
                      >
                        Set Next Follow-up
                      </Button>
                    )}
                    <Button
                      size="small"
                      onClick={() => {
                        setSelectedLeadId(l._id);
                        setActivityOpen(true);
                      }}
                    >
                      View Activity
                    </Button>


                  </TableCell>
                </TableRow>

              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      {/* Modal */}
      <CreateLeadModal
        open={open}
        onClose={() => {
          setOpen(false);
          setSelectedLead(null);
        }}
        onSuccess={fetchLeads}
        lead={selectedLead}
      />

      <SetFollowUpModal
        open={followUpModalOpen}
        leadId={selectedLeadId}
        onClose={() => setFollowUpModalOpen(false)}
        onSuccess={fetchLeads}
      />

      <LeadActivityModal
        open={activityOpen}
        leadId={selectedLeadId}
        onClose={() => setActivityOpen(false)}
      />



    </DashboardLayout>
  );
};

export default Leads;
