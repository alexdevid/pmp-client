import Vue from "vue";
import Vuex from "vuex";
import events from './events';

Vue.use(Vuex);

const state = {
    user: null,
    searchString: null,
    authComplete: false
};

export default new Vuex.Store({
    state
});
