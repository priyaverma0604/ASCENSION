const VisitLog = require('../models/VisitLog');
const User = require('../models/User');

// Helper to determine device type
const getDeviceType = (ua = '') => {
  const userAgent = ua.toLowerCase();
  if (/(tablet|ipad|playbook|silk)|(android(?!.*mobi))/i.test(userAgent)) {
    return 'Tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini|iemobile|wpdesktop/i.test(userAgent)) {
    return 'Mobile';
  }
  return 'Desktop';
};

// @desc    Track a page view / website visit
// @route   POST /api/analytics/track
// @access  Public
exports.trackVisit = async (req, res, next) => {
  try {
    const {
      visitorId,
      pagePath,
      pageTitle,
      referrer,
      userId,
      userName,
      userEmail,
      utmSource,
      utmMedium,
      utmCampaign,
      utmContent,
      utmTerm,
      fbclid
    } = req.body;

    if (!pagePath || !visitorId) {
      return res.status(400).json({ success: false, message: 'Missing pagePath or visitorId' });
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || req.ip || '';
    const userAgent = req.headers['user-agent'] || '';
    const deviceType = getDeviceType(userAgent);

    // Filter out common bot crawls from inflating stats
    const isBot = /bot|googlebot|crawler|spider|robot|crawling/i.test(userAgent);
    if (isBot) {
      return res.json({ success: true, ignored: true });
    }

    // Determine if traffic is originated from Meta (Facebook / Instagram Ads or organic)
    const sourceStr = (utmSource || '').toLowerCase();
    const refStr = (referrer || '').toLowerCase();
    const isMetaTraffic = Boolean(
      fbclid ||
      /meta|facebook|fb|instagram|ig|threads/i.test(sourceStr) ||
      /facebook\.com|instagram\.com|fb\.me|meta\.com/i.test(refStr)
    );

    // Save the visit log
    await VisitLog.create({
      visitorId,
      userId: userId || (req.user ? req.user._id : null),
      userName: userName || (req.user ? req.user.name : null),
      userEmail: userEmail || (req.user ? req.user.email : null),
      pagePath,
      pageTitle: pageTitle || '',
      referrer: referrer || '',
      utmSource: utmSource || '',
      utmMedium: utmMedium || '',
      utmCampaign: utmCampaign || '',
      utmContent: utmContent || '',
      utmTerm: utmTerm || '',
      fbclid: fbclid || '',
      isMetaTraffic,
      userAgent,
      deviceType,
      ipAddress: clientIp.toString(),
      timestamp: new Date()
    });

    // If a logged-in user is browsing, touch their lastActive timestamp
    const activeUserId = userId || (req.user ? req.user._id : null);
    if (activeUserId) {
      User.findByIdAndUpdate(activeUserId, { 
        lastActive: new Date(),
        ipAddress: clientIp.toString()
      }).exec().catch(() => {});
    }

    res.json({ success: true });
  } catch (error) {
    // Analytics should never crash client flows
    console.error('Analytics track error:', error.message);
    res.status(200).json({ success: false, error: error.message });
  }
};

// @desc    Get website traffic analytics summary
// @route   GET /api/analytics/summary
// @access  Private / Admin
exports.getAnalyticsSummary = async (req, res, next) => {
  try {
    const now = new Date();
    const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);

    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Totals and Uniques
    const [
      totalPageviews,
      todayPageviews,
      weekPageviews,
      monthPageviews,
      realtimeActiveVisitors,
      realtimeActiveUsers,
      totalMetaViews,
      todayMetaViews,
      weekMetaViews,
      monthMetaViews
    ] = await Promise.all([
      VisitLog.countDocuments({}),
      VisitLog.countDocuments({ timestamp: { $gte: startOfToday } }),
      VisitLog.countDocuments({ timestamp: { $gte: sevenDaysAgo } }),
      VisitLog.countDocuments({ timestamp: { $gte: thirtyDaysAgo } }),
      VisitLog.distinct('visitorId', { timestamp: { $gte: fiveMinutesAgo } }),
      VisitLog.distinct('userId', { timestamp: { $gte: fiveMinutesAgo }, userId: { $ne: null } }),
      VisitLog.countDocuments({ isMetaTraffic: true }),
      VisitLog.countDocuments({ isMetaTraffic: true, timestamp: { $gte: startOfToday } }),
      VisitLog.countDocuments({ isMetaTraffic: true, timestamp: { $gte: sevenDaysAgo } }),
      VisitLog.countDocuments({ isMetaTraffic: true, timestamp: { $gte: thirtyDaysAgo } })
    ]);

    const [todayUnique, weekUnique, monthUnique, allTimeUnique, metaUnique] = await Promise.all([
      VisitLog.distinct('visitorId', { timestamp: { $gte: startOfToday } }),
      VisitLog.distinct('visitorId', { timestamp: { $gte: sevenDaysAgo } }),
      VisitLog.distinct('visitorId', { timestamp: { $gte: thirtyDaysAgo } }),
      VisitLog.distinct('visitorId', {}),
      VisitLog.distinct('visitorId', { isMetaTraffic: true })
    ]);

    // Top Pages in the last 30 days
    const topPages = await VisitLog.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { 
          _id: '$pagePath', 
          views: { $sum: 1 }, 
          uniqueVisitors: { $addToSet: '$visitorId' },
          metaViews: { $sum: { $cond: ['$isMetaTraffic', 1, 0] } }
      }},
      { $project: { 
          pagePath: '$_id', 
          views: 1, 
          uniqueVisitors: { $size: '$uniqueVisitors' },
          metaViews: 1,
          _id: 0 
      }},
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Top Campaigns (UTM Campaign) in the last 30 days
    const topCampaigns = await VisitLog.aggregate([
      { $match: { 
          timestamp: { $gte: thirtyDaysAgo },
          $or: [
            { utmCampaign: { $exists: true, $ne: '' } },
            { isMetaTraffic: true }
          ]
      }},
      { $group: {
          _id: {
            $cond: [
              { $and: [{ $ne: ['$utmCampaign', ''] }, { $ne: ['$utmCampaign', null] }] },
              '$utmCampaign',
              'Meta General Traffic'
            ]
          },
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' },
          metaViews: { $sum: { $cond: ['$isMetaTraffic', 1, 0] } },
          sources: { $addToSet: '$utmSource' }
      }},
      { $project: {
          campaign: '$_id',
          views: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          metaViews: 1,
          sources: 1,
          _id: 0
      }},
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Source breakdown (UTM Sources / Direct / Meta / Referrals)
    const sourceBreakdown = await VisitLog.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      { $project: {
          source: {
            $cond: [
              { $and: [{ $ne: ['$utmSource', ''] }, { $ne: ['$utmSource', null] }] },
              '$utmSource',
              {
                $cond: [
                  { $eq: ['$isMetaTraffic', true] },
                  'Meta / Facebook',
                  {
                    $cond: [
                      { $or: [{ $eq: ['$referrer', ''] }, { $eq: ['$referrer', null] }] },
                      'Direct / Organic',
                      'Referral'
                    ]
                  }
                ]
              }
            ]
          },
          visitorId: 1
      }},
      { $group: {
          _id: '$source',
          views: { $sum: 1 },
          uniqueVisitors: { $addToSet: '$visitorId' }
      }},
      { $project: {
          source: { $ifNull: ['$_id', 'Direct / Organic'] },
          views: 1,
          uniqueVisitors: { $size: '$uniqueVisitors' },
          _id: 0
      }},
      { $sort: { views: -1 } },
      { $limit: 10 }
    ]);

    // Device breakdown in the last 30 days
    const deviceBreakdown = await VisitLog.aggregate([
      { $match: { timestamp: { $gte: thirtyDaysAgo } } },
      { $group: { _id: '$deviceType', count: { $sum: 1 } } },
      { $project: { device: '$_id', count: 1, _id: 0 } },
      { $sort: { count: -1 } }
    ]);

    // 14-Day Daily Traffic Trend (with Meta Breakdown)
    const fourteenDaysAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    fourteenDaysAgo.setHours(0, 0, 0, 0);

    const dailyTrend = await VisitLog.aggregate([
      { $match: { timestamp: { $gte: fourteenDaysAgo } } },
      {
        $group: {
          _id: {
            $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
          },
          views: { $sum: 1 },
          metaViews: { $sum: { $cond: ['$isMetaTraffic', 1, 0] } },
          visitors: { $addToSet: '$visitorId' }
        }
      },
      {
        $project: {
          date: '$_id',
          views: 1,
          metaViews: 1,
          uniqueVisitors: { $size: '$visitors' },
          _id: 0
        }
      },
      { $sort: { date: 1 } }
    ]);

    res.json({
      success: true,
      data: {
        pageviews: {
          total: totalPageviews,
          today: todayPageviews,
          week: weekPageviews,
          month: monthPageviews
        },
        metaViews: {
          total: totalMetaViews,
          today: todayMetaViews,
          week: weekMetaViews,
          month: monthMetaViews,
          unique: metaUnique.length
        },
        uniqueVisitors: {
          total: allTimeUnique.length,
          today: todayUnique.length,
          week: weekUnique.length,
          month: monthUnique.length
        },
        realtime: {
          activeVisitors: realtimeActiveVisitors.length,
          activeUsers: realtimeActiveUsers.length
        },
        topPages,
        topCampaigns,
        sourceBreakdown,
        deviceBreakdown,
        dailyTrend
      }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get recent live website activity log
// @route   GET /api/analytics/recent
// @access  Private / Admin
exports.getRecentVisits = async (req, res, next) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 50;
    const filter = {};

    if (req.query.metaOnly === 'true') {
      filter.isMetaTraffic = true;
    }
    if (req.query.campaign) {
      filter.utmCampaign = req.query.campaign;
    }

    const visits = await VisitLog.find(filter)
      .populate('userId', 'name email role')
      .sort({ timestamp: -1 })
      .limit(limit)
      .lean();

    res.json({
      success: true,
      count: visits.length,
      data: visits
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Clear analytics logs (Admin maintenance)
// @route   DELETE /api/analytics/clear
// @access  Private / Admin
exports.clearAnalytics = async (req, res, next) => {
  try {
    await VisitLog.deleteMany({});
    res.json({ success: true, message: 'Website visit logs cleared' });
  } catch (error) {
    next(error);
  }
};

