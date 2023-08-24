const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

// This is separate from campaign as we will have many different tools that we can add to a campaign. And each tool will have it's own database and statistics
// Hence we can not keep this schema in campaigns service.
const notificationSchema = new Schema({
    notificationId: Schema.Types.ObjectId,
    variantId: Schema.Types.ObjectId,
    notificationName: {
        type: String
    },
    notificationSettings: {
        toolMessage: {
            type: String,
            default: ''
        },
        customImage : {
            type: String,
            default: ''
        },
        lastConversions: {
            type: Number,
            default: 20
        },
        showFromDays: {
            type: String,
            default: 7
        },
        leastConversion: {
            type: String,
            default: 7
        },
        showMostRecentConversions: {
            type: Boolean,
            default: false
        },
        ownNotification: {
            type: Boolean,
            default: false
        },
        hideAnonymous: {
            type: Boolean,
            default: false
        },
        showAllConversions: {
            type: Boolean,
            default: false
        },
        doNotLoopNotification: {
            type: Boolean,
            default: true
        }
    },
    updatedDateTime: {
        type: String,
        default:''
    },
    createdDateTime: {
        type: Date,
        default:  () => { return Date.now() }
    }
});
// Create a model
const notificationModel = mongoose.model('notification', notificationSchema);
// Export the model
module.exports = notificationModel;
