var config  = require("../../config/development");

var knex = require("knex")({
   client: 'mysql',
   connection: {
	   host: 		config.dburl,  // your host
	   user: 		config.dbusername, // your database user
	   password: 	config.dbpassword, // your database password
	   database: 	config.dbdatabasename
	}
});

module.exports.bookshelf 	= require('bookshelf')(knex);
module.exports.knex			= knex;
