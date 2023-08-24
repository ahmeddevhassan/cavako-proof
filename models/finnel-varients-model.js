const mongoose = require('mongoose')
const Schema = mongoose.Schema
const uniqueusers = require('./unique-user-model')
// Create a schema

const varientSchema = new Schema({
	VaraintId: Schema.Types.ObjectId,
	varaintName: {
		type: String,
		default: ' '
	},
	hasEndDate: {
		type: String,
		default: false,
	},
	// userInfo: {
	// 	VaraintId: Schema.Types.ObjectId,
	// 	ref: 'uniqueuser'
	// },
	timeZone: {
		type: String,
		default: '+5'
	},
	deadLineDays: {
		type: String,
		default: ''
	},
	deadLineType: {
		type: String,
		default: ''
	},
	deadLineEndTime: {
		type: String,
		default: ''
	},
	totalSeconds: {
		type: Number,
		default: 0
	},
	hasStartDate: {
		type: String,
		default: false,
	},
	isFixed: {
		type: String,
		default: false,
	},
	startDate: {
		type: String,
		default: '',
	},
	endDate: {
		type: String,
		default: '',
	},
	// hybrid means for a week, or for a month
	hasHybridType: {
		type: String,
		default: false,
	},
	// it will define the hybrid type. like month or week
	// there must be a start time and end time for the hybrid
	// cronjobs will be there for the hybrid scnerio

	hybridType: {
		type: String,
		default: 'week',
	},
	// it will always remain date and time, the cron job will be run with 8th interval for week, and 30th interval for month
	hybridDateTime: {
		type: String,
		default: '',
	},
	hybridDay: {
		type: String,
		default: '',
	},
	//new category
	hasSpecialOffer: {
		type: String,
		default: false,
	},
	// how to track the sale ?
	startingQuantity: {
		type: Number,
		default: 100
	},
	currentQuantity: {
		type: Number,
		default: 0
	},
	trackSaleStartTime: {
		type: String,
		default: '',
	},
	trackSaleEndTime: {
		type: String,
		default: '',
	},
	hasOneDeadline: {
		type: String,
		default: '',
	},
	isrepeat: {
		type: String,
		default: '',
	},
	// triggers identification
	triggers: [],
	//setting
	settingId: [{
		type: mongoose.Schema.ObjectId,
		ref: "funnelToolSettings"
	}],
	setUp: [{
		type: mongoose.Schema.ObjectId,
		ref: "funnelSetupModel"
	}],
	updatedDateTime: {
		type: String,
		default: ''
	},
	createdDateTime: {
		type: String,
		default: Math.floor(Date.now() / 1000)
	},
	displayPageFlag: {
		type: String,
		default: 'false'
	},
	gifCount: {
		type: Number,
		default: 0,
	},
	gifObj: {
		type: mongoose.Schema.ObjectId,
		ref: "gifModel"
		//gifSchema
	},

});

varientSchema.pre('save', async function (next) {
	this.VaraintId = this._id;
});
// Create a model
const Varient = mongoose.model('fvariant', varientSchema, 'variants');
// Export the model
module.exports = Varient

