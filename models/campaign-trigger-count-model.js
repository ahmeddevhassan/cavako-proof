const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const campaignTriggerCountSchema = new Schema({
    pixelId: Schema.Types.ObjectId,
    campaignId: Schema.Types.ObjectId,
    visitorDetails: {
    },
    visitorId: {
        type: String,
        default: ''
    },
    email: {
        type: String,
        default: ''
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
const campaignTriggerCountModel = mongoose.model('campaign-trigger-count', campaignTriggerCountSchema);
// Export the model
module.exports = campaignTriggerCountModel;
