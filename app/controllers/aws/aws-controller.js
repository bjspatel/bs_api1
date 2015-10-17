var formidable      = require("formidable"),
    fs              = require("fs"),
    os              = require("os"),
    mime            = require("mime"),
    config          = require("../../../config/development"),
    awsController   = {};

awsController.generateFileName = function (fileName) {

    var extRegEx = /(?:\.([^.]+))?$/,
        ext = extRegEx.exec(fileName)[1],
        date = new Date().getTime(),
        charBank = "abcdefghijklmnopqrstuvwxyz",
        fString = "";

    for(var i=0; i<15; i++) {
        fString += charBank[parseInt(Math.random()*26)];
    }
    return (fString += date + "." + ext);
}

awsController.uploadFile = function (req, res, next) {

    //Store file in temporary location on server
    var tmpFile, nFile, fileName;
    var form = new formidable.IncomingForm();
    form.keepExtensions = true;
    form.parse(req, function(error, fields, files) {
        tmpFile = files.upload.path;
        fileName = awsController.generateFileName(files.upload.name);
        nFile = os.tmpDir() + "\\" + fileName;
    });

    form.on("end", function() {
        fs.rename(tmpFile, nFile, function() {
            //Upload the file into s3 bucket
            fs.readFile(nFile, function(error, buffer) {
                var AWS = require('aws-sdk');
                AWS.config.update({
                    accessKeyId:    config.accessKeyId,
                    secretAccessKey:config.secretAccessKey,
                    region:         config.region
                })
                var s3Obj = new AWS.S3({
                    params: {
                        Bucket: config.bucketName
                    }
                });

                var fileBuffer = fs.createReadStream(nFile);
                var data = {
                    Key: fileName,
                    Body: fileBuffer,
                    ContentType: mime.lookup(fileName)
                };
                s3Obj.putObject(data, function(err, data) {
                    var responseObj = {};
                    if(err) {
                        console.log("Error uploading file: " + JSON.stringify(err, null, 4));
                        responseObj = {
                            message: "Error occured while uploading file"
                        };
                        res.status(500).json(responseObj);
                    } else {
                        responseObj = {
                            fileName: fileName,
                            message: "File uploaded to S3 server successfully"
                        };
                        res.status(200).json(responseObj);
                    }
                });
            });
        });
    });
};

awsController.getS3Url = function (fileName) {
    return ("http://s3-" + config.region + ".amazonaws.com/" + config.bucketName + "/" + fileName);
};

module.exports = awsController;
