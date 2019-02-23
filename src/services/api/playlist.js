import client from './api-client';

const COLLECTION_LENGTH = 30;
const defaultParams = {
    page: 1,
    limit: COLLECTION_LENGTH,
    direction: 'DESC',
    sort: 'id',
    user: null,
};

const playlistService = {
    COLLECTION_LENGTH: COLLECTION_LENGTH,

    /**
     * @param {Object} params
     * @returns {Promise}
     */
    get(params) {
        return new Promise((resolve, reject) => {
            client.get('/playlists', this._prepareParams(params)).then(response => {
                resolve(response.data);
            }, error => {
                reject(error);
            });
        });
    },

    /**
     * @param {Number} id
     * @returns {Promise}
     */
    getById(id) {
        return new Promise((resolve, reject) => {
            client.get('/playlist/' + id).then(response => {
                resolve(response.data);
            }, error => {
                reject(error);
            });
        });
    },

    add(playlist) {
        return new Promise((resolve, reject) => {
            client.put('/playlist', playlist).then(response => {
                resolve(response.data);
            }, error => {
                reject(error);
            });
        });
    },

    _prepareParams(params) {
        let data = defaultParams;
        for (let key in params) {
            if (data.hasOwnProperty(key)) {
                data[key] = params[key];
            }
        }

        return data;
    }
};

export default playlistService;