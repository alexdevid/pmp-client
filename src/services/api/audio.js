import client from './api-client';

const COLLECTION_LENGTH = 10;
const defaultParams = {
    page: 1,
    limit: COLLECTION_LENGTH,
    direction: 'DESC',
    sort: 'id',
    query: null,
    user: null,
};

const audioService = {
    COLLECTION_LENGTH: COLLECTION_LENGTH,

    /**
     * @param {Object} params
     * @returns {Promise}
     */
    get(params) {
        return new Promise((resolve, reject) => {
            client.get('/audios', this._prepareParams(params)).then(response => {
                resolve(response.data);
            }, error => {
                reject(error);
            });
        });
    },

    /**
     * @param {int|String} id
     * @returns {Promise}
     */
    fav(id) {
        return new Promise((resolve, reject) => {
            client.post('/audio/favorite/' + id).then(response => {
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

export default audioService;