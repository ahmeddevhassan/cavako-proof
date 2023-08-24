const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const visitorSchema = new Schema({
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
    visitorDetails: {},
    createdDateTime: {
        type: Date,
        default: () => {return Date.now()}
    }
});
// Create a model
const visitorModel = mongoose.model('visitor', visitorSchema);
// Export the model
module.exports = visitorModel;
