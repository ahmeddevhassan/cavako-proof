const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const pixelSchema = new Schema({
    pixelId: Schema.Types.ObjectId,
    userId: {
        type: String,
        required: true
    },
    pixelStatus: {
        type: String
    },
    installedDomainOrigins: Array,
    pixelValue: {
        type: String
    },
    createdDateTime: {
        type: String,
        default: Math.floor(Date.now() / 1000)
    }


});
// Create a model
const userPixelModel = mongoose.model('userPixel', pixelSchema);
// Export the model
module.exports = userPixelModel;
