
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const registeredToolsSchema = new Schema({
    toolId: Schema.Types.ObjectId,
    toolName: {
        type: String
    },
    toolIcon: {
        type: String
    },
    toolImage: {
        type: String
    },
    toolStatus: {
        type: String
    },
    microService: {
        type: String
    },
    createdDateTime: {
        type: String,
        default: Math.floor(Date.now() / 1000)
    }

});
registeredToolsSchema.pre('save', async function( next) {
    this.toolId  = this._id;
});
// Create a model
const registeredToolsModel = mongoose.model('registeredTool', registeredToolsSchema);
// Export the model
module.exports = registeredToolsModel;
