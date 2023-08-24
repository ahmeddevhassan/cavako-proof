const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const recentDataSchema = new Schema({
    pixelId: Schema.Types.ObjectId,
    campaignId: Schema.Types.ObjectId,
    domainOrigin: {
        type: String
    },
    domainRef: {
        type: String
    },
    visitorId: {
        type: String
    },
    variantId: {
        type: Schema.Types.ObjectId,
    },
    notificationType: {
        type: String
    },
    notificationData: {
        name: {
            type: String,
            default: 'someone'
        },
        email: {
            type: String,
            default: 'someone'
        },

        location: {
            type: String,
            default: 'somewhere'
        },
        countryCode: {
            type: String,
            default: 'somewhere'
        },
        time: {
            type: String,
            default: () => { return Date.now() }
        }
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    }
});
// Create a model
const dataRecentModel = mongoose.model('data-recent', recentDataSchema);
// Export the model
module.exports = dataRecentModel;
