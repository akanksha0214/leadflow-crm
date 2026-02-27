import Activity from "../model/Activity.js";

export const logActivity = async ({ lead, user, type, message, isNotification = false }) => {
  try {
    const activity = await Activity.create({
      lead,
      user,
      type,
      message,
      isNotification,
      read: false,
    });

    // 🔔 EMIT ONLY IF USER IS CONNECTED
    // const room = global.io?.sockets?.adapter?.rooms?.get(String(user));

    // if (isNotification && room?.size > 0) {
    //   global.io.to(String(user)).emit("new_notification", {
    //     _id: activity._id,
    //     message: activity.message,
    //     createdAt: activity.createdAt,
    //   });
    // }

    // return activity;

    if (isNotification && global.io) {
      console.log("🔔 Emitting to room:", String(user));  // 👈 ADD THIS
      global.io.to(String(user)).emit("new_notification", {
        _id: activity._id,
        message: activity.message,
        createdAt: activity.createdAt,
      });
    }
  } catch (err) {
    console.error("Activity log failed:", err.message);
  }
};
