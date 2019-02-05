import Vue from "vue";
import VueResource from "vue-resource";

Vue.use(VueResource);

const API_ENDPOINT = "http://music.test/index.php/api";

export default {
    token: null,
    refreshToken: null,

    get(url, data) {
        this._addTokenToRequest();
        return Vue.http.get(API_ENDPOINT + url, {params: data});
    },

    post(url, data, progress) {
        this._addTokenToRequest();
        return Vue.http.post(API_ENDPOINT + url, data, {
            progress(e) {
                let loaded = null;
                if (e.lengthComputable) {
                    loaded = e.loaded / e.total * 100;
                }

                if (progress) {
                    progress(loaded);
                }
            }
        });
    },

    put(url, data) {
        this._addTokenToRequest();
        return Vue.http.put(API_ENDPOINT + url, data);
    },

    setToken(token) {
        this.token = token;
    },
    _addTokenToRequest(){
        Vue.http.interceptors.push((request, next) => {
            request.headers.set("X-Bearer-Token", this.token);
            next();
        });
    }
};
