import mongoose from "mongoose";

const activitySchema = new mongoose.Schema(
  {
    lead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lead",
      required: true,
    },

    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    type: {
      type: String,
      enum: [
        "lead_created",
        "status_changed",
        "followup_set",
        "followup_done",
        "note_added",
        "followup_reminder",
      ],
      required: true,
    },

    message: {
      type: String,
      required: true,
    },
    read: {
      type: Boolean,
      default: false,
    },
    isNotification: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default mongoose.model("Activity", activitySchema);
