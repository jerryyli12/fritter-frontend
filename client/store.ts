import Vue from 'vue';
import Vuex from 'vuex';
import createPersistedState from 'vuex-persistedstate';

Vue.use(Vuex);

/**
 * Storage for data that needs to be accessed from various compoentns.
 */
const store = new Vuex.Store({
  state: {
    filter: undefined,
    freets: [], // All freets created in the app
    communities: [],
    events: [],
    communityFilter: undefined,
    eventFilter: undefined,
    controversial: null,
    username: null, // Username of the logged in user
    viewingLeft: null,
    alerts: {} // global success/error messages encountered during submissions to non-visible forms
  },
  mutations: {
    alert(state, payload) {
      /**
       * Add a new message to the global alerts.
       */
      Vue.set(state.alerts, payload.message, payload.status);
      setTimeout(() => {
        Vue.delete(state.alerts, payload.message);
      }, 3000);
    },
    setUsername(state, username) {
      /**
       * Update the stored username to the specified one.
       * @param username - new username to set
       */
      state.username = username;
    },
    setControversial(state, setting) {
      state.controversial = setting;
    },
    updateFilter(state, filter) {
      /**
       * Update the stored freets filter to the specified one.
       * @param filter - Username of the user to fitler freets by
       */
      state.filter = filter;
    },
    updateFreets(state, freets) {
      /**
       * Update the stored freets to the provided freets.
       * @param freets - Freets to store
       */
      state.freets = freets;
    },
    updateViewing(state, view) {
      state.viewingLeft = view;
    },
    async refreshFreets(state) {
      /**
       * Request the server for the currently available freets.
       */
      const url = state.filter ? state.filter : '/api/freets';
      const res = await fetch(url).then(async r => r.json());
      if (!res.freets)
        state.freets = res;
      else
        state.freets = res.freets;
    },
    updateCommunityFilter(state, filter) {
      state.communityFilter = filter;
    },
    async refreshCommunities(state) {
      const url = state.communityFilter ? state.communityFilter : '/api/communities';
      const res = await fetch(url).then(async r => r.json());
      state.communities = res;
    },
    updateEventFilter(state, filter) {
      state.eventFilter = filter;
    },
    async refreshEvents(state) {
      const url = state.eventFilter ? state.eventFilter : '/api/events';
      const res = await fetch(url).then(async r => r.json());
      if (res.attending)
        state.events = res.attending.concat(res.interested);
      else
        state.events = res;
    }
  },
  // Store data across page refreshes, only discard on browser close
  plugins: [createPersistedState()]
});

export default store;
