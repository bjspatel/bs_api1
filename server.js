var express 		= require("express"),
	app 	   		= express(),
	path			= require("path"),
	http			= require("http"),
	passport 		= require("passport"),
	flash 			= require("connect-flash"),

	morgan			= require("morgan"),
	cookieParser	= require("cookie-parser"),
	bodyParser		= require("body-parser"),
	session			= require("express-session"),

	config 			= require("./config/development"),
	port			= config.port;

//------------------------------initialize database---------------------------------\\
require("./app/database/init-db")("./app/database/brokersumo.sql");

//-------------------------setup the express application----------------------------\\

app.use(morgan("dev"));				//logs every request to console
app.use(cookieParser());			//use cookie - needed for auth
app.use(bodyParser.json() );		// to support JSON-encoded bodies
app.use(bodyParser.urlencoded({		// to support URL-encoded bodies
	extended: true
}));

//-----------------------setup hogan-express for templating-------------------------\\

app.set("views", path.join(__dirname, "views"));
app.set("view engine", "html");
app.engine("html", require("hogan-express"));

app.use(session({secret:config.sessionSecret, resave: true, saveUninitialized: true}));
app.use(flash());
app.use(express.static(path.join(__dirname, "public")));

//-----------------------initialize and configure passport--------------------------\\

app.use(passport.initialize());
app.use(passport.session());
require("./app/controllers/passport/local-passport-controller.js")(passport);
require("./app/routes/routes.js")(express, app, passport);

//---------------------------------start server-------------------------------------\\

app.listen(port, function() {
	console.log("Server is running on port " + port);
});
