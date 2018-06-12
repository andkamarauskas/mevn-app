'use strict';

var Provider = require('../models/Provider');

module.exports.getProviders = function(req, res) {
	Provider.find({}, 'id name', function(error, providers) {
		if (error)
			return res.status(400).send({
				message: 'Error getting providers',
				error: error.message,
			});

		return res.status(200).send(providers);
	});
};

module.exports.newProvider = function(req, res) {
	var new_provider = new Provider({
		name: req.body.name,
	});
	new_provider.save(function(error) {
		if (error)
			return res.status(400).send({
				message: 'Error adding new provider',
				error: error.code === 11000 ? 'Provider already exist' : error.message,
			});

		return res.status(200).send({
			message: 'New provider added',
			provider_id: new_provider._id,
		});
	});
};

module.exports.updateProvider = function(req, res) {
	var id = req.swagger.params.id.value;
	Provider.findByIdAndUpdate(id, req.body, { new: true }, function(
		err,
		provider
	) {
		if (err)
			return res.status(400).send({
				message: 'Error editing provider',
				error: err.message,
			});

		return res.status(200).send({ message: 'Provider updated' });
	});
};

module.exports.deleteProvider = function(req, res) {
	var id = req.swagger.params.id.value;

	Provider.findByIdAndRemove(id, (err, provider) => {
		if (err)
			return res.status(400).send({
				message: 'Error deleting provider',
				error: err.message,
			});

		return res
			.status(200)
			.send({ message: 'Provider successfully deleted' });
	});
};
