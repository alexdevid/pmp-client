import client from './api-client';

const defaultParams = {
    page: 1,
    limit: 30,
    direction: 'DESC',
    sort: 'id',
    query: null,
    user: null,
};

export default {
    /**
     * @param {Object} params
     * @returns {Promise}
     */
    get(params) {
        return new Promise((resolve, reject) => {
            client.get('/audios', this._prepareParams(params)).then(response => {
                resolve(response.data._embedded.items);
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
}