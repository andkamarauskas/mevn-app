var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ProviderSchema = new Schema({
	name: { type: String, unique: true, required: true },
});

module.exports = mongoose.model('Provider', ProviderSchema);
