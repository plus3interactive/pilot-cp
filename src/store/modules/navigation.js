import api from '../../api'
import { default as router, processRoutes } from '../../router'
import _ from 'lodash'

/**
 * STATE
 */
const state = {
  navigation: {
    main_nav: {},
    user_nav: {}
  },
  routes: {},
  breadcrumbs: [],
  side_nav: {}
}

const getters = {
  navigation: state => state.navigation,
  main_nav: state => state.navigation.main_nav,
  user_nav: state => state.navigation.user_nav,
  routes: state => state.routes,
  side_nav: state => state.side_nav,
  breadcrumbs: state => state.breadcrumbs
}

/**
 * Actions
 */

const actions = {
  LOGGED ({ commit, dispatch }) {
    dispatch('INIT_ROUTES')
    dispatch('INIT_NAVIGATION')
  },

  INIT_NAVIGATION ({ commit, state }) {
    api.get('/api/menus').then(response => {
      delete response.data.debug
      commit('NAVIGATION', response.data)
    })
  },

  LOGOUT ({ commit }) {
    commit('LOGOUT')
  },

  INIT_ROUTES ({ commit, state }) {
    api.get('/api/routes').then(response => {
      commit('ROUTES', response.data.routes)
    })
  },

  UPDATE_NAV ({ commit }, nav) {
    if (Array.isArray(nav) && nav.length === 0) {
      commit('CLEAR_NAV', 'side_nav')
    }
    commit('UPDATE_NAV', nav)
  },

  CLEAR_NAV ({ commit }, navName) {
    commit('CLEAR_NAV', navName)
  },

  SET_BREADCRUMBS ({ commit }, breadcrumbs) {
    commit('SET_BREADCRUMBS', breadcrumbs)
  }
}

/**
 * MuTaTiOnS
 */

const mutations = {
  NAVIGATION (state, nav) {
    state.navigation = nav
  },

  SET_SIDE_NAV (state, sideNav) {
    state.side_nav = sideNav
  },

  UPDATE_NAV (state, nav) {
    Object.assign(state, nav)
  },

  CLEAR_NAV (state, navName) {
    state[navName] = {}
  },

  // @TODO get rid of this, make it human readable
  ROUTES (state, routes) {
    if (_.isEmpty(state.routes)) {
      processRoutes(routes)
      router.addRoutes(routes)
      state.routes = routes
    }
  },

  SET_BREADCRUMBS (state, breadcrumbs) {
    state.breadcrumbs = breadcrumbs
  },

  LOGOUT (state) {
    state.side_nav = {}
    state.breadcrumbs = []
    state.navigation = {
      main_nav: {},
      user_nav: {}
    }
  }
}

export default {
  state,
  getters,
  actions,
  mutations
}
