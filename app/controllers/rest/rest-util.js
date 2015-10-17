var util = {};

util.getResponseData = function(result, entityName, action) {

    var failureResponse = {};
    switch(action) {
        case "add":
            failureResponse = {message: entityName + " not added."};
            break;
        case "update":
            failureResponse = {message: entityName + " not updated."};
            break;
        case "find":
        default:
            failureResponse = {message: entityName + " not found."};
            break;
    }

    var response = {};
    if(!!result) {
        response.content = result.toJSON();
        response.code = 200;
        if(Object.prototype.toString.call(responseContent) === '[object Array]' ) {
            if(response.content.length === 0) {
                response.content = failureResponse;
                response.code = 404;
            }
        } else if(typeof result === "Error") {
            response.content = result;
            response.code = result.responseCode;
        }
    } else {
        response.content = failureResponse;
        response.code = 404;
    }

    return response;
};

module.exports = util;
