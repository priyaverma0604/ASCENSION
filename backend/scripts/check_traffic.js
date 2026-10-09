const mongoose = require('mongoose');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

async function checkTraffic() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const db = mongoose.connection.db;

    const totalVisits = await db.collection('visitlogs').countDocuments();

    const now = new Date();
    const todayStart = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const visitsToday = await db.collection('visitlogs').countDocuments({ timestamp: { $gte: todayStart } });
    const visits7d = await db.collection('visitlogs').countDocuments({ timestamp: { $gte: sevenDaysAgo } });
    const visits30d = await db.collection('visitlogs').countDocuments({ timestamp: { $gte: thirtyDaysAgo } });
    const activeNow = await db.collection('visitlogs').distinct('visitorId', { timestamp: { $gte: fiveMinutesAgo } });

    const uniqueTotal = (await db.collection('visitlogs').distinct('visitorId')).length;
    const uniqueToday = (await db.collection('visitlogs').distinct('visitorId', { timestamp: { $gte: todayStart } })).length;
    const unique7d = (await db.collection('visitlogs').distinct('visitorId', { timestamp: { $gte: sevenDaysAgo } })).length;

    const metaVisitsTotal = await db.collection('visitlogs').countDocuments({ isMetaTraffic: true });
    const metaVisitsToday = await db.collection('visitlogs').countDocuments({ isMetaTraffic: true, timestamp: { $gte: todayStart } });

    const topPages = await db.collection('visitlogs').aggregate([
      { $group: { _id: '$pagePath', count: { $sum: 1 }, unique: { $addToSet: '$visitorId' } } },
      { $project: { page: '$_id', views: '$count', uniqueVisitors: { $size: '$unique' } } },
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]).toArray();

    const topCampaigns = await db.collection('visitlogs').aggregate([
      { $match: { utmCampaign: { $exists: true, $ne: null, $ne: '' } } },
      { $group: { _id: '$utmCampaign', views: { $sum: 1 }, unique: { $addToSet: '$visitorId' } } },
      { $project: { campaign: '$_id', views: '$views', uniqueVisitors: { $size: '$unique' } } },
      { $sort: { views: -1 } },
      { $limit: 5 }
    ]).toArray();

    const totalUsers = await db.collection('users').countDocuments();
    const activeUsers7d = await db.collection('users').countDocuments({ lastActive: { $gte: sevenDaysAgo } });
    const totalOrders = await db.collection('orders').countDocuments();
    const totalProgramRegs = await db.collection('programregistrations').countDocuments();
    const totalWebinarRegs = await db.collection('webinarregistrations').countDocuments();

    console.log(JSON.stringify({
      totalVisits,
      visitsToday,
      visits7d,
      visits30d,
      activeNow: activeNow.length,
      uniqueTotal,
      uniqueToday,
      unique7d,
      metaVisitsTotal,
      metaVisitsToday,
      topPages,
      topCampaigns,
      totalUsers,
      activeUsers7d,
      totalOrders,
      totalProgramRegs,
      totalWebinarRegs
    }, null, 2));

    await mongoose.disconnect();
  } catch (err) {
    console.error('Error querying stats:', err);
  }
}

checkTraffic();
