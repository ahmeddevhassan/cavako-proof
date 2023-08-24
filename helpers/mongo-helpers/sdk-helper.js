const GoalModel = require('../../models/goal-model');
const CampaignModel = require('../../models/campaign-model');
const DataRecentModel = require('../../models/data-recent-model');
const ReviewsModel = require('../../models/reviews-model');
const VisitorModel = require('../../models/visitor-model');
const NotificationClicksModel = require('../../models/clicks-model');
const GoalCompletionModel = require('../../models/goalCompletion-model');
const impressionsModel = require('../../models/impressions-model');
const mongoose = require('mongoose');

module.exports = {
    store_data_DB: async (data) => {
        const dataRecent = new DataRecentModel(data);
        return await dataRecent.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    store_clicks_DB: async (data) => {
        const dataClicks = new NotificationClicksModel(data);
        return await dataClicks.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    store_goalCompletions_DB: async (data) => {
        const goalCompletionCheck = await GoalCompletionModel.findOne({
            visitorId: data.visitorId,
            pixelId: data.pixelId,
            goalId: data.goalId
        });
        if (goalCompletionCheck) {
            return;
        }
        const goalCompletion = new GoalCompletionModel(data);
        return await goalCompletion.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    store_impressions_DB: async (data) => {
        /*const impressions = await impressionsModel.findOne({visitorId:  data.visitorId, pixelId: data.pixelId, campaignId: data.campaignId, notificationType: data.notificationType});
        if(impressions) {
            return ;
        }*/
        const impressionStore = new impressionsModel(data);
        return await impressionStore.save().then(fullfilled => {
            return fullfilled;
        }).catch(err => {
            return err;
        });
    },
    load_data_recent: async (notification, data) => {
        const query = {
            pixelId: data.pixelId,
            domainOrigin: data.domainOrigin,
            createdDateTime: {$gte: new Date(new Date().setDate(new Date().getDate() - `${notification.notificationSettings.showFromDays}`))}
        };
        if (notification.notificationSettings.ownNotification === true) {
            query['visitorId'] = {$ne: data.visitorId}
        }
        if (notification.notificationSettings.hideAnonymous === true) {
            query['notificationData.name'] = {$ne: 'someone'}
        }
        const dataRecent = await DataRecentModel.find(query).sort(notification.notificationSettings.showMostRecentConversions === true ? '-createdDateTime' : 'createdDateTime').limit(notification.notificationSettings.lastConversions)
        if (notification.notificationSettings.showAllConversions === true) {
            console.log('showAllConversions as anonymous notifications true');
            dataRecent.forEach((arrayData, index) => {
                arrayData.notificationData.name = 'someone';
                arrayData.notificationData.location = 'somewhere';
            });
        }
        if (dataRecent.length >= notification.notificationSettings.leastConversion) {
            return dataRecent;
        } else {
            return [];
        }
    },
    load_reviews_helper: async (notification, data) => {
        const query = {
            userId: data.pixelId,
           campaignId: notification.campaignId
        };
        const dataRecent = await ReviewsModel.findOne(query);
        return dataRecent? dataRecent.reviewData : [] ;
    },
    load_count: async (notification, data) => {
        const query = {
            pixelId: data.pixelId,
            domainOrigin: data.domainOrigin
        };
        if (notification.notificationSettings['displayType'] === 'visitors') {
            return VisitorModel.countDocuments(query);
        }
        if (notification.notificationSettings['displayType'] === 'conversions') {
            return DataRecentModel.countDocuments(query);
        }
    },
    real_time_visitors_data_count: async (data) => {
        const query = {
            pixelId: data.pixelId,
            domainOrigin: data.domainOrigin
        };
        return VisitorModel.countDocuments(query);
    },
};
