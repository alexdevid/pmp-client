import client from './api-client';

const params = {
    page: 1,
    per_page: 30,
    order: 'DESC',
    order_by: 'id',
    query: null
};

export default {
    /**
     * @param {int|null} page
     * @param {String|null} order
     * @param {String|null} order_by
     * @returns {Promise}
     */
    getAll(page, order, order_by) {
        let requestParams = params;
        if (typeof page !== 'undefined') {
            requestParams.page = page;
        }
        if (typeof order !== 'undefined') {
            requestParams.order = order;
        }
        if (typeof order_by !== 'undefined') {
            requestParams.order_by = order_by;
        }

        return new Promise((resolve, reject) => {
            client.get('/audio', requestParams).then(response => {
                resolve(response.data.collection);
            }, error => {
                reject(error);
            });
        });
    },

    getByUsername(username, page, order, order_by) {
        let requestParams = params;
        if (typeof page !== 'undefined') {
            requestParams.page = page;
        }
        if (typeof order !== 'undefined') {
            requestParams.order = order;
        }
        if (typeof order_by !== 'undefined') {
            requestParams.order_by = order_by;
        }

        return new Promise((resolve, reject) => {
            client.get('/audio/' + username, requestParams).then(response => {
                resolve(response.data.collection);
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
    }
}