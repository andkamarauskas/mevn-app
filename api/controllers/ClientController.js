'use strict';

var Client = require('../models/Client');

module.exports.getClients = function(req, res) {
	Client.find({}, 'name email phone')
		.populate({ path: 'providers', select: 'name' })
		.exec(function(err, clients) {
			if (err)
				return res.status(400).send({
					message: 'Error getting clients',
					error: err.message,
				});
			return res.status(200).send(clients);
		});
};

module.exports.newClient = function(req, res) {
	var new_client = new Client(req.body);

	new_client.save(function(error) {
		if (error)
			return res.status(400).send({
				message: 'Error adding new client',
				error: error.code === 11000 ? 'Client already exist' : error.message,
			});

		const response = {
			message: 'New client added',
			client_id: new_client._id,
		};

		return res.status(200).send(response);
	});
};

module.exports.updateClient = function(req, res) {
	var id = req.swagger.params.id.value;

	Client.findByIdAndUpdate(id, req.body, { new: true }, function(
		err,
		Client
	) {
		if (err)
			return res.status(400).send({
				message: 'Error editing Client',
				error: err.message,
			});

		return res.status(200).send({ message: 'Client updated' });
	});
};

module.exports.deleteClient = function(req, res) {
	var id = req.swagger.params.id.value;

	Client.findByIdAndRemove(id, (err, Client) => {
		if (err)
			return res.status(400).send({
				message: 'Error deleting Client',
				error: err.message,
			});

		return res.status(200).send({ message: 'Client successfully deleted' });
	});
};
