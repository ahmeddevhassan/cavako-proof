const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const goalCompletionSchema = new Schema({
    pixelId: Schema.Types.ObjectId,
    campaignId: Schema.Types.ObjectId,
    goalId: Schema.Types.ObjectId,
    domainOrigin: {
        type: String
    },
    domainRef: {
        type: String
    },
    visitorId: {
        type: String
    },
    goalCompletionUrl : {
        type: String
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    }
});
// Create a model
const goalCompletionModel = mongoose.model('goal-completion', goalCompletionSchema);
// Export the model
module.exports = goalCompletionModel;
