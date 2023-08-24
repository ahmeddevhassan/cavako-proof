const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const statusSchema = new Schema({
    statusId: Schema.Types.ObjectId,
    statusName: {
        type: String,
        default: ''
    }

});
statusSchema.pre('save', async function( next) {
    this.statusId  = this._id;
});
// Create a model
const statusModel = mongoose.model('status', statusSchema);
// Export the model
module.exports = statusModel;
