import cron from "node-cron";
import Leads from "../model/Leads.js";
import User from "../model/User.js";
import dayjs from "dayjs";
import { logActivity } from "../utils/logActivity.js";
import { generateFollowupReminder } from "../utils/aiReminder.js";
import utc from "dayjs/plugin/utc.js";
import timezone from "dayjs/plugin/timezone.js";

dayjs.extend(utc);
dayjs.extend(timezone);


export const startFollowupReminderCron = () => {
  cron.schedule("*/1 * * * *", async () => {
    try {
      const now = dayjs();
      const upcomingLimit = now.add(2, "minute");

      const leads = await Leads.find({
        next_followup_date: {
          $gte: now.toDate(),
          $lte: upcomingLimit.toDate(),
        },
        followup_reminded: false,
      });

      for (const lead of leads) {
        console.log("Lead:", lead.id);
        const userId = lead.createdBy || lead.assignedTo;

        if (!userId) {
          console.log("❌ No user assigned for lead:", lead._id);
          continue;
        }

        // ✅ Fetch user to get name + email
        const user = await User.findById(userId);
        if (!user) {
          console.log("❌ User not found:", userId);
          continue;
        }

        console.log("🔔 Sending reminder to:", user.name);

        // 🤖 AI MESSAGE
        const aiMessage = await generateFollowupReminder({
          leadName: lead.name,
          // followupTime: dayjs(lead.next_followup_date).format("hh:mm A"),
          followupTime: dayjs
            .utc(lead.next_followup_date)     // ⬅️ read as UTC
            .tz("Asia/Kolkata")               // ⬅️ convert to IST
            .format("hh:mm A"),
          notes: lead.notes,
          executiveName: user.name, 
        });

        // 🔔 SAVE + SOCKET PUSH
        await logActivity({
          lead: lead._id,
          user: userId,
          type: "followup_reminder",
          message: aiMessage,
          isNotification: true,
        });

        lead.followup_reminded = true;
        await lead.save();
      }
    } catch (err) {
      console.error("Cron error:", err.message);
    }
  });
};
