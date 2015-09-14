var mongoose     = require('mongoose');
var Schema       = mongoose.Schema;

var ItemSchema   = new Schema({
  name: String,
	team: String
});

module.exports = mongoose.model('Item', ItemSchema);
