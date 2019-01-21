import Vue from "vue";
import VueResource from "vue-resource";

Vue.use(VueResource);

const API_ENDPOINT = "http://music.test/index.php/api";

export default {
    token: null,

    put(url, data, successCallback, errorCallback) {
        this.setToken();
        Vue.http.put(API_ENDPOINT + url, data).then(
            response => {
                successCallback(response.body);
            },
            error => {
                errorCallback(error.body);
            }
        );
    },
    post(url, data, successCallback, errorCallback) {
        this.setToken();
        Vue.http.post(API_ENDPOINT + url, data).then(
            response => {
                successCallback(response.body);
            },
            error => {
                errorCallback(error.body);
            }
        );
    },
    get(url, successCallback, errorCallback) {
        this.setToken();
        Vue.http.get(API_ENDPOINT + url).then(
            response => {
                successCallback(response);
            },
            error => {
                errorCallback(error.body);
            }
        );
    },
    getToken(credentials, successCallback, errorCallback) {
        Vue.http.post(API_ENDPOINT + "/login_check", credentials).then(
            response => {
                this.token = response.body.token;
                successCallback(response.body);
            },
            error => {
                console.error("AUTH_ERROR", {
                    username: credentials.username,
                    message: error.body.message
                });
                errorCallback(error.body);
            }
        );
    },
    setToken() {
        Vue.http.interceptors.push((request, next) => {
            request.headers.set("X-Bearer-Token", this.token);
            next();
        });
    }
};
