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
    'https://merchant.placeloop.com/ysnpm-middleware/merchant/oauth2/authorize';
  options.tokenURL = options.tokenURL || 'https://merchant.placeloop.com/ysnpm-middleware/merchant/oauth2/token';
  options.customHeaders = options.customHeaders || {};
  options.callbackURL = options.callbackURL || "http://localhost:3042/oauth2/callback"
  if (!options.customHeaders['User-Agent']) {
    options.customHeaders['User-Agent'] = options.userAgent || 'passport-placeloop';
  }

  OAuth2Strategy.call(this, options, verify);
  this.name = 'placeloop';
  this._profileURL = options.profileURL || 'https://merchant.placeloop.com/api/v1/auth/merchant/state/current';
  this._oauth2.useAuthorizationHeaderforGET(true);
}

util.inherits(Strategy, OAuth2Strategy);

Strategy.prototype.userProfile = function(accessToken, done) {
  try {
    this._oauth2.get(this._profileURL, accessToken, function (err, body) {
      if (err && err.data)
        return done(new InternalOAuthError('Failed to fetch user profile', err));

      const json = JSON.parse(body);
      if (!json || !json.user || !json.user.id)
        return done("Could not retrieve user profile");
      let profile = {
        user_id: json.user.id || '',
        email: json.user.email || '',
        place: {
          id: json.place.id || '',
          name: json.place.name || '',
          phone: json.place.phone || '',
          avatar: json.place.avatar || '',
          address: json.place.address || {}
        },
      };
      return done(err, profile);
    });
  } catch (error) {
    return done(new InternalOAuthError('Failed to fetch user profile', err));
  }
};

module.exports = Strategy;
