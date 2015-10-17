var Model   = require("../../models/db-model"),	//Load bookshelf model
    bcrypt  = require("bcrypt-nodejs");

module.exports = function(passport) {

    /**
     * @function
     * @name signup
     * @description Signs up the broker.
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    this.signup = function (req, res, next) {

        passport.authenticate('local-signup', function(err, user, info) {
            if (err) return next(err);
            return res.status(info.responseCode).json({
                message: info.message
            });
        })(req, res, next);
    };

    /**
     * @function
     * @name sendAgentData
     * @description Signs in user (broker / agent)
     *
     * @param {Object - Request} req: Express request object
     * @param {Object - Response} res: Express response object
     * @param {Function} next: Next function to be invoked in the middleware queue
     *
     * @return undefined
     */
    this.signin = function (req, res, next) {

        passport.authenticate('local-signin', function(err, user, info) {
            if (err) return next(err);
            if (!user) {
                return res.status(info.responseCode).json({
                    message: info.message
                });
            }

            // Manually establish the session
            req.login(user, function(err) {
                if (err) return next(err);
                return res.status(info.responseCode).json({
                    message: info.message
                });
            });
        })(req, res, next);
    };

    return this;
};
