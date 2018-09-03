var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var robotSchema = new Schema({
	name: {type: String},
	fileName: {type: String},
	file: {type: String},
	userId:{type: String},
	status:{type: String}
});

module.exports = mongoose.model('Robot', robotSchema);