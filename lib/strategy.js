var OAuth2Strategy = require('passport-oauth2');
var util = require('util');
var InternalOAuthError = require('passport-oauth2').InternalOAuthError;

/**
 * Creates an instance of `Strategy`.
 *
 * @constructor
 * @api public
 */
function Strategy(options, verify) {
  options = options || {};
  options.authorizationURL = options.authorizationURL ||
    'https://merchant.placeloop.vm/ysnpm-middleware/merchant/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://merchant.placeloop.vm/ysnpm-middleware/merchant/oauth2/token';
  options.customHeaders = options.customHeaders || {};
  options.callbackURL = options.callbackURL || "http://localhost:3042/oauth2/callback"
  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-42';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'placeloop';
  // this._profileURL = options.profileURL || 'https://api.intra.42.fr/v2/me';
  // this._profileFields = options.profileFields || null;
  // this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.currentState = function(accessToken, done) {
  done({toto: true});
};

/**
 * Expose `Strategy`.
 */
module.exports = Strategy;
