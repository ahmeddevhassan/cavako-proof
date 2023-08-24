const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const clicksSchema = new Schema({
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
    locationData: {
        type: Object
    },
    variantId: {
        type: Schema.Types.ObjectId,
    },
    notificationType: {
        type: String
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    }
});
// Create a model
const notificationClicksModel = mongoose.model('notification-click', clicksSchema);
// Export the model
module.exports = notificationClicksModel;
