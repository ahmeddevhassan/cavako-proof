const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const integrationSchema = new Schema({
    integrationId: {
        type: Schema.Types.ObjectId
    },
    integrationData: {
        type: Object
    },
    integration: {
        type: Schema.Types.ObjectId,
        ref: "cavako-integration"
    },
    integrationName: String,
    userId: {
        type: String,
        default: ''
    },
    updatedDateTime: {
        type: Date,
        default: () => {
            return Date.now()
        }
    },
    createdDateTime: {
        type: Date,
        default: () => {
            return Date.now()
        }
    }


});
integrationSchema.pre('save', async function (next) {
    this.integrationId = this._id;
});
// Create a model
const IntegrationModel = mongoose.model('integration', integrationSchema);
// Export the model
module.exports = IntegrationModel;
