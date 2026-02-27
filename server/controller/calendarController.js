import { generateICS } from "../utils/calendar.js";

export const downloadFollowupInvite = async (req, res) => {
  try {
    const { name, next_followup_date } = req.body;

    if (!next_followup_date) {
      return res.status(400).json({ msg: "Follow-up date required" });
    }

    const ics = generateICS({
      title: `Follow-up with ${name}`,
      description: `CRM follow-up reminder for ${name}`,
      startDate: next_followup_date,
    });

    res.setHeader("Content-Type", "text/calendar");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=followup-${Date.now()}.ics`
    );

    res.send(ics);
  } catch (err) {
    res.status(500).json({ msg: "Failed to generate calendar invite" });
  }
};
