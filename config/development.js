module.exports = {

	//mysql database parameters
	dburl: "localhost",
	dbport: 3306,
	dbusername: "root",
	dbpassword: "",
	dbdatabasename: "brokersumo",

	//application parameters
	sessionSecret: "brokersumo_secret",
	host: "localhost:3000",
	port: 3000,

	//aws parameters
	accessKeyId:"aws_api_key",
  secretAccessKey:"aws_secret_key"
  region:"aws_region",
	bucketName: "bucket_name"
};
