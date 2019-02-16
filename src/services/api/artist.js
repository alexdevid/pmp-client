import client from './api-client';

export default {
    /**
     * @param {Number} id
     * @returns {Promise}
     */
    getArtist(id) {
        return new Promise((resolve, reject) => {
            client.get('/artist/' + id).then(response => {
                resolve(response.data);
            }, error => {
                reject(error);
            });
        });
    },
}