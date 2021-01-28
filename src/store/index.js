import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import { v4 } from 'uuid'
import tsStatuses from '../training-session-statuses'
import tsModes from '../training-session-modes'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		bindings: [],
		trainingSession: {
			status: tsStatuses.stopped,
			mode: tsModes.random,
		},
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
		removeBinding (state, binding) {
			console.log('remove bind')
			state.bindings.splice(_.findIndex(state.bindings, { id: binding.id }), 1)
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
		removeBinding({ commit }, binding) {
			commit('removeBinding', binding)
		},
	},
})

export default store
