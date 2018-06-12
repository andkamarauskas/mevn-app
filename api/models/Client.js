var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var Provider = require('./Provider');

var ClientSchema = new Schema({
	name: { type: String, required: true },
	email: { type: String, unique: true, required: true },
	phone: { type: String, unique: true, required: true },
	providers: [{ type: Schema.Types.ObjectId, ref: 'Provider' }],
});

var Client = mongoose.model('Client', ClientSchema);
module.exports = Client;
