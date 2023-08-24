const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const funnelSetupModel = new Schema({
    Id: {
        type: Schema.Types.ObjectId,
        default: this._id
    },
    setUpId: {
        type: String,
    },
    ApiKey: {
        type: String,
    },
    ApiSecret: {
        type: String,
    },
    updatedDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    createdDateTime: {
        type: Date,
        default: () => { return Date.now() }
    },
    type: {
        type: String,
        default: ''
    }


});
funnelSetupModel.pre('save', async function (next) {
    this.setUpId = this._id;
});
// Create a model
const FunnelSetupModel = mongoose.model('funnelSetupModel', funnelSetupModel);
// Export the model
module.exports = FunnelSetupModel;
