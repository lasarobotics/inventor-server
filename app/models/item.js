var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
  name: String,
	team: String,
  quantity: Number,
  checkout: Array
});

module.exports = mongoose.model('Item', ItemSchema);
