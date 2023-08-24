const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const impressionsSchema = new Schema({
    pixelId: Schema.Types.ObjectId,
    campaignId: Schema.Types.ObjectId,
    variantId: Schema.Types.ObjectId,
    domainOrigin: {
        type: String
    },
    domainRef: {
        type: String
    },
    notificationType: {
        type: String
    },
    visitorId: {
        type: String
    },
    locationData: {
      type: Object
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    }
});
// Create a model
const impressionsModel = mongoose.model('impressions', impressionsSchema);
// Export the model
module.exports = impressionsModel;
