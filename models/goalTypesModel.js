const mongoose = require('mongoose');
const Schema = mongoose.Schema;

// Create a schema

const goalTypeSchema = new Schema({
    goalCategoryId: Schema.Types.ObjectId,
    goalCategoryName: {
        type: String,
        required: true
    },
    goalTypeDetails: String

});
// Create a model
const goalTypeModel = mongoose.model('goalType', goalTypeSchema);
// Export the model
module.exports = goalTypeModel;
