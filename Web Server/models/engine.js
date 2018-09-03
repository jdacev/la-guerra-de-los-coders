var mongoose = require('mongoose'),
    Schema   = mongoose.Schema;

var engineSchema = new Schema({
  nombre:    { type: String },
  ip:  { type: String } ,
  puerto:  { type: String }  
});

module.exports = mongoose.model('Engine', engineSchema);