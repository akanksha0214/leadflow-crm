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
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import SearchIcon from "@mui/icons-material/Search";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import { useEffect, useState } from "react";
import DashboardLayout from "../components/DashboardLayout";
import CreateLeadModal from "../components/modal/CreateLeadModal";
import SetFollowUpModal from "../components/modal/SetFollowUpModal";
import LeadActivityModal from "../components/modal/LeadActivityModal";
import api from "../services/instance";
import dayjs from "dayjs";
import toast from "react-hot-toast";
import socket from "../services/socket";
import "./Leads.css";

const Leads = () => {
  const [leads, setLeads] = useState([]);
  const [open, setOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState(null);
  const [followUpModalOpen, setFollowUpModalOpen] = useState(false);
  const [selectedLeadId, setSelectedLeadId] = useState(null);
  const [activityOpen, setActivityOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

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

  const sortedLeads = [...leads]
    .filter((lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.toLowerCase().includes(searchTerm.toLowerCase())
    )
    .sort((a, b) => {
      const aOverdue = isOverdue(a);
      const bOverdue = isOverdue(b);

      if (aOverdue && !bOverdue) return -1;
      if (!aOverdue && bOverdue) return 1;
      return 0;
    });

  return (
    <DashboardLayout>
      {/* Modern Header Section */}
      <Box className="leads-header">
        <Typography variant="h4" className="leads-main-title">
          Leads Management
        </Typography>

        <Box className="leads-search-container">
          {/* Search Bar */}
          <TextField
            placeholder="Search leads..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            size="small"
            fullWidth={{ xs: true, sm: false }}
            className="leads-search-field"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#64748b", fontSize: { xs: "16px", sm: "18px" } }} />
                </InputAdornment>
              ),
            }}
          />

          {/* Add Lead Button */}
          <Button
            variant="contained"
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => setOpen(true)}
            fullWidth={{ xs: true, sm: false }}
            className="leads-add-button"
          >
            Add Lead
          </Button>
        </Box>
      </Box>

      {/* Stats Cards */}
      <Box className="leads-stats-container">
        <Paper className="leads-stat-card total">
          <Typography variant="h6" className="leads-stat-label">
            Total Leads
          </Typography>
          <Typography variant="h4" className="leads-stat-number">
            {leads.length}
          </Typography>
        </Paper>

        <Paper className="leads-stat-card new">
          <Typography variant="h6" className="leads-stat-label">
            New Leads
          </Typography>
          <Typography variant="h4" className="leads-stat-number">
            {leads.filter((lead) => lead.status === "new").length}
          </Typography>
        </Paper>

        <Paper className="leads-stat-card interested">
          <Typography variant="h6" className="leads-stat-label">
            Interested
          </Typography>
          <Typography variant="h4" className="leads-stat-number">
            {leads.filter((lead) => lead.status === "interested").length}
          </Typography>
        </Paper>
      </Box>

      {/* Enhanced Leads Table */}
      {sortedLeads.length === 0 ? (
        <Paper className="leads-empty-state">
          <Box className="leads-empty-content">
            <Box className="leads-empty-icon-wrapper">
              <Typography className="leads-empty-emoji">
                📋
              </Typography>
            </Box>
            <Typography variant="h6" className="leads-empty-title">
              No leads found
            </Typography>
            <Typography variant="body1" className="leads-empty-subtitle">
              Try adjusting your search criteria or add new leads to get started.
            </Typography>
          </Box>
        </Paper>
      ) : (
        <Box className="leads-table-container">
          <Box className="leads-table-wrapper">
            <Paper className="leads-table-paper">
              <Table className="leads-table">
                <TableHead>
                  <TableRow className="leads-table-head">
                    <TableCell className="leads-header-cell name">
                      Name
                    </TableCell>
                    <TableCell className="leads-header-cell email">
                      Email
                    </TableCell>
                    <TableCell className="leads-header-cell phone">
                      Phone
                    </TableCell>
                    <TableCell className="leads-header-cell followup">
                      Follow Up
                    </TableCell>
                    <TableCell className="leads-header-cell source">
                      Source
                    </TableCell>
                    <TableCell className="leads-header-cell status">
                      Status
                    </TableCell>
                    <TableCell className="leads-header-cell actions">
                      Actions
                    </TableCell>
                  </TableRow>
                </TableHead>
            <TableBody>
              {sortedLeads.map((l) => (
                <TableRow
                  key={l._id}
                  className={`leads-table-row ${isOverdue(l) ? 'overdue' : ''}`}
                >
                  <TableCell className="leads-body-cell name">
                    {l.name}
                  </TableCell>
                  <TableCell className="leads-body-cell email">
                    {l.email || "-"}
                  </TableCell>
                  <TableCell className="leads-body-cell phone">
                    {l.phone || "-"}
                  </TableCell>
                  <TableCell className="leads-body-cell followup">
                    <Box className="leads-chip-container">
                      {l.next_followup_date && (
                        <Tooltip title={`Follow up: ${dayjs(l.next_followup_date).format("DD MMM YYYY, hh:mm A")}`} arrow>
                          <Box className={`leads-followup-badge ${isOverdue(l) ? 'overdue' : 'normal'}`}>
                            <Typography className="leads-followup-date">
                              {dayjs(l.next_followup_date).format("DD MMM")}
                            </Typography>
                          </Box>
                        </Tooltip>
                      )}
                    </Box>
                  </TableCell>
                  <TableCell className="leads-body-cell source">
                    <Box className="leads-chip-container">
                      <Chip
                        label={l.source}
                        size="small"
                        className="leads-source-chip"
                      />
                    </Box>
                  </TableCell>
                  <TableCell className="leads-body-cell status">
                    <Box className="leads-chip-container">
                      <Chip
                        label={l.status}
                        size="small"
                        className={`leads-status-chip ${l.status}`}
                      />
                    </Box>
                  </TableCell>
                  <TableCell className="leads-body-cell actions">
                    <Box className="leads-actions-container">
                      <Tooltip title="Edit" arrow>
                        <IconButton
                          size="small"
                          onClick={() => {
                            setSelectedLead(l);
                            setOpen(true);
                          }}
                          className="leads-action-button leads-edit-button"
                        >
                          <EditIcon className="leads-action-icon"/>
                        </IconButton>
                      </Tooltip>

                      {l.next_followup_date && (
                        <Tooltip title="Done" arrow>
                          <IconButton
                            onClick={() => handleFollowUpDone(l._id)}
                            className={`leads-action-button leads-done-button ${isOverdue(l) ? 'overdue' : 'normal'}`}
                          >
                            <CheckCircleOutlineIcon className="leads-action-icon"/>
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
                          className="leads-followup-button"
                        >
                          Follow-up
                        </Button>
                      )}
                      
                      <Button
                        size="small"
                        onClick={() => {
                          setSelectedLeadId(l._id);
                          setActivityOpen(true);
                        }}
                        className="leads-activity-button"
                      >
                        Activity
                      </Button>

                      <Tooltip title="Delete" arrow>
                        <IconButton
                          size="small"
                          onClick={() => handleDelete(l._id)}
                          className="leads-action-button leads-delete-button"
                        >
                          <DeleteOutlineIcon className="leads-action-icon"/>
                        </IconButton>
                      </Tooltip>
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
