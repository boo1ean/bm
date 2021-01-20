import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import { v4 } from 'uuid'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		bindings: [],
	},
	mutations: {
		updateBinding (state, binding) {
			const index = _.findIndex(state.bindings, { id: binding.id })
			state.bindings.splice(index, 1, binding)
		},
		addBinding (state, binding) {
			console.log(state, binding)
			state.bindings = state.bindings.concat([binding])
		},
	},
	actions: {
		updateBinding ({ commit }, binding) {
			commit('updateBinding', binding)
		},
		addBinding({ commit }) {
			commit('addBinding', {
				id: v4(),
				bind: null,
			})
		},
	},
})

export default store
