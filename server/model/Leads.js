import mongoose from "mongoose";

const leadSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      trim: true,
      lowercase: true,
    },

    phone: {
      type: String,
      trim: true,
    },

    source: {
      type: String,
      enum: ["website", "whatsapp", "referral"],
      required: true,
    },

    status: {
      type: String,
      enum: ["new", "contacted", "interested", "converted", "lost"],
      default: "new",
    },

    assignedTo: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null, // ✅ IMPORTANT
    },

    next_followup_date: {
      type: Date,
      default: null, // ✅ IMPORTANT
    },

    notes: {
      type: String,
      default: null
    },

    followup_reminded: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

leadSchema.index({
  next_followup_date: 1,
  followup_reminded: 1,
});


export default mongoose.model("Lead", leadSchema);
