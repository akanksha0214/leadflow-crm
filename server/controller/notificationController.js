import Activity from "../model/Activity.js";

export const getNotifications = async (req,res)=>{
    try{
        const notifications = await Activity.find({
            user: req.user.id,
            isNotification: true,
            read:false
        })
        .sort({createdAt:-1})
        .limit(10)
        res.json(notifications)
    }catch{
        res.status(500).json({msg:"Failed to fetch notifications"})
    }
}

export const markNotificationRead = async (req,res)=>{
    await Activity.updateMany(
        {user: req.user.id, read:false},
        {read:true}
    )
    res.json({success:true, msg:"All notifications marked as read"})
}