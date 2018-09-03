var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var arenaSchema = new Schema({
	name: {type: String},
	status: {type: String},
	engineId: {type: String},
	robots: [String]
});

module.exports = mongoose.model('Arena', arenaSchema);