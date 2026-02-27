import Leads from "../model/Leads.js";
import Activity from "../model/Activity.js";
import { logActivity } from "../utils/logActivity.js";

//creating lead
export const createLead = async (req, res) => {
    console.log(req.body)
    try {
        const { name, email, phone, source, notes, next_followup_date } = req.body;

        const lead = await Leads.create({
            name,
            email,
            phone,
            source,
            notes,
            next_followup_date,
            assignedTo: req.user.id,
            status: "new"
        });
        await logActivity({
            lead: lead._id,
            user: req.user.id,
            type: "lead_created",
            message: "Lead created",
        });

        res.json({ success: true, lead });
    } catch (error) {
        res.status(500).json({ msg: "Unable to create lead" });
    }
};

//get lead
export const getAllLeads = async (req, res) => {
    try {
        const leads = await Leads.find();
        res.json(leads)
    } catch {
        res.status(500).json({ msg: "Failed to fetch leads" })
    }
}

export const getDashboardStats = async (req, res) => {
    try {
        const totalLeads = await Leads.countDocuments();

        const newLeads = await Leads.countDocuments({ status: "new" });

        const closedLeads = await Leads.countDocuments({ status: "closed" });

        const followUpsDue = await Leads.countDocuments({
            next_followup_date: { $lte: new Date() },
            status: { $ne: "closed" },
        });

        res.json({
            totalLeads,
            newLeads,
            followUpsDue,
            closedLeads,
        });
    } catch (err) {
        res.status(500).json({ msg: "Failed to fetch dashboard stats" });
    }
};

//edit lead
// export const editLead = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedLead = await Leads.findByIdAndUpdate(id, req.body, { new: true });
//         if (!updatedLead) {
//             res.status(500).json({
//                 success: true,
//                 lead: updatedLead,
//             })
//         }

//         if (req.body.status && req.body.status !== updatedLead.status) {
//             await Activity.create({
//                 lead: updatedLead._id,
//                 user: req.user.id,
//                 type: "status_changed",
//                 message: `Status changed to ${req.body.status}`,
//             });
//         }

//         res.status(201).json({ msg: "Lead updated successfully!" })
//     } catch {
//         res.status(500).json({ msg: "Failed to update lead!" })
//     }
// }

export const editLead = async (req, res) => {
    try {
        const { id } = req.params;

        const lead = await Leads.findById(id);
        if (!lead) {
            return res.status(404).json({ msg: "Lead not found" });
        }

        // Keep old values
        const oldData = {
            name: lead.name,
            status: lead.status,
            source: lead.source,
            notes: lead.notes,
            next_followup_date: lead.next_followup_date,
        };

        // Update lead
        Object.assign(lead, req.body);
        if (
            req.body.next_followup_date &&
            String(oldData.next_followup_date) !== String(req.body.next_followup_date)
        ) {
            lead.followup_reminded = false;
        }
        await lead.save();

        // 🔥 Detect & log changes
        if (req.body.status && oldData.status !== lead.status) {
            await logActivity({
                lead: lead._id,
                user: req.user.id,
                type: "status_changed",
                message: `Status changed from ${oldData.status} to ${lead.status}`,
            });
        }

        if (req.body.name && oldData.name !== lead.name) {
            await logActivity({
                lead: lead._id,
                user: req.user.id,
                type: "note_added",
                message: `Name updated from "${oldData.name}" to "${lead.name}"`,
            });
        }

        if (req.body.source && oldData.source !== lead.source) {
            await logActivity({
                lead: lead._id,
                user: req.user.id,
                type: "note_added",
                message: `Source changed from ${oldData.source} to ${lead.source}`,
            });
        }

        if (req.body.notes && oldData.notes !== lead.notes) {
            await logActivity({
                lead: lead._id,
                user: req.user.id,
                type: "note_added",
                message: "Notes updated",
            });
        }

        if (
            req.body.next_followup_date &&
            String(oldData.next_followup_date) !== String(lead.next_followup_date)
        ) {
            await logActivity({
                lead: lead._id,
                user: req.user.id,
                type: "followup_reminder",
                message: `Follow-up updated to ${new Date(
                    lead.next_followup_date
                ).toLocaleString()}`,
            });
        }

        res.json({ success: true, lead });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to update lead" });
    }
};


//delete lead
// export const deleteLead = async (req, res) => {
//     try {
//         const { id } = req.params;
//         const deleteId = await Leads.findOneAndDelete(id);

//         if (!deleteId) {
//             return res.status(500).json({ msg: "Lead not found!" })
//         }
//         await logActivity({
//             lead: id,
//             user: req.user.id,
//             type: "note_added",
//             message: "Lead deleted",
//         });

//         res.status(200).json({
//             success: true,
//             msg: "Lead deleted successfully"
//         })
//     } catch {
//         res.status(500).json({ msg: "Failed to delete Laed!" })
//     }
// }

export const deleteLead = async (req, res) => {
    try {
        const { id } = req.params;

        // 1️⃣ Delete Lead
        const deletedLead = await Leads.findByIdAndDelete(id);

        if (!deletedLead) {
            return res.status(404).json({ msg: "Lead not found!" });
        }

        // 2️⃣ Delete related activities
        await Activity.deleteMany({ lead: id });

        res.status(200).json({
            success: true,
            msg: "Lead and related activities deleted successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to delete Lead!" });
    }
};

//updated followup 
export const markFollowUpDone = async (req, res) => {
    try {
        const { id } = req.params;

        const updatedLead = await Leads.findByIdAndUpdate(
            id,
            {
                $set: {
                    next_followup_date: null,
                    status: "contacted",
                },
            },
            { new: true }
        );

        if (!updatedLead) {
            return res.status(404).json({ msg: "Lead not found" });
        }

        await logActivity({
            lead: updatedLead._id,
            user: req.user.id,
            type: "followup_done",
            message: "Follow-up marked as done",
        });

        res.json({
            success: true,
            msg: "Follow-up marked as done",
            lead: updatedLead,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ msg: "Failed to mark follow-up done" });
    }
};

//next followup
export const setNextFollowUp = async (req, res) => {
    try {
        const { id } = req.params;
        const { next_followup_date } = req.body;

        const lead = await Leads.findByIdAndUpdate(
            id,
            {
                next_followup_date,
                followup_reminded: false, // 🔑 RESET reminder
            },
            { new: true }
        );

        if (!lead) {
            return res.status(404).json({ msg: "Lead not found" });
        }

        await logActivity({
            lead: lead._id,
            user: req.user.id,
            type: "followup_set",
            message: `Next follow-up scheduled for ${new Date(next_followup_date).toLocaleString()}`,
        });

        res.json({
            success: true,
            msg: "Next follow-up scheduled",
            lead,
        });
    } catch (error) {
        res.status(500).json({ msg: "Failed to set follow-up" });
    }
};

//lead activity 
export const getLeadActivities = async (req, res) => {
    try {
        const activities = await Activity.find({ lead: req.params.id })
            .populate("user", "name")
            .sort({ createdAt: -1 });

        res.json(activities);
    } catch {
        res.status(500).json({ msg: "Failed to fetch activities" });
    }
};
