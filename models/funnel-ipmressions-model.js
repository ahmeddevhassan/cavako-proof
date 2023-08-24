const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const funnelImpressionsSchema = new Schema({
    pixelId: Schema.Types.ObjectId,
    campaignId: Schema.Types.ObjectId,
    visitorDetails: {},
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
const funnelImpressionsModel = mongoose.model('funnel-impressions', funnelImpressionsSchema);
// Export the model
module.exports = funnelImpressionsModel;
