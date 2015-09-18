var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
  name: String,
	team: String,
  price: Number,
  quantity: Number,
  checkout: Array
});

module.exports = mongoose.model('Item', ItemSchema);
