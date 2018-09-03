var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var userSchema = new Schema({
  nombre: { type: String },
  email:  { type: String }
});

module.exports = mongoose.model('User', userSchema);