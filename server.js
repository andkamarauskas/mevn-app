'use strict';

require('dotenv').load();
var mongoose = require('mongoose');
var path = require('path');
var SwaggerExpress = require('swagger-express-mw');
var express = require('express');
var app = express();

module.exports = app;

var config = {
	appRoot: __dirname, 
};

mongoose.connect(process.env.MONGO_DB);
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error'));

SwaggerExpress.create(config, function(err, swaggerExpress) {
	if (err) {
		throw err;
	}
	
	swaggerExpress.register(app);

	app.use(swaggerExpress.runner.swaggerTools.swaggerUi());

	var port = process.env.PORT || 8098;
	app.listen(port);
});
