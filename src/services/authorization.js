import client from './api/api-client';

export default {

    /**
     * @returns {Promise|null}
     */
    checkToken() {
        const credentials = this._getStoredCredentials();
        if (credentials) {
            return this._refreshToken(credentials.refreshToken);
        }

        return null;
    },

    /**
     * @param {String} username
     * @param {String} password
     * @returns {Promise}
     */
    login(username, password) {
        return this._getToken({username: username, password: password});
    },

    logout() {
        localStorage.removeItem('credentials');
    },

    /**
     * @param {Object} credentials
     * @returns {Promise}
     * @private
     */
    _getToken(credentials) {
        const promise = client.post('/login_check', credentials);
        promise.then(response => {
            this._storeCredentials(credentials.username, response.body.token, response.body.refresh_token);
        }, error => {
            this._onTokenError(error);
        });

        return promise;
    },

    /**
     * @param {String} refreshToken
     * @returns {Promise}
     * @private
     */
    _refreshToken(refreshToken) {
        const promise = client.post('/token/refresh', {refresh_token: refreshToken});
        promise.then(response => {
            this._storeCredentials(this._getStoredCredentials().username, response.body.token, response.body.refresh_token);
        }, error => {
            this._onTokenError(error);
        });

        return promise;
    },

    /**
     * @param {String} error
     * @private
     */
    _onTokenError(error) {
        console.error("AUTH_ERROR", {
            username: this._getStoredCredentials().username,
            message: error.body.message
        });
    },

    /**
     *
     * @param {String} username
     * @param {String} token
     * @param {String} refreshToken
     * @private
     */
    _storeCredentials(username, token, refreshToken) {
        client.setToken(token);
        localStorage.setItem(
            'credentials',
            JSON.stringify({username: username, refreshToken: refreshToken})
        );
    },

    /**
     * @returns {null|Object}
     * @private
     */
    _getStoredCredentials() {
        if (!localStorage.hasOwnProperty("credentials")) {
            return null;
        }

        return JSON.parse(localStorage.getItem("credentials"));
    }
}