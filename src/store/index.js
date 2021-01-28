import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import { v4 } from 'uuid'
import VuexPersistence from 'vuex-persist'
import tsStatuses from '../training-session-statuses'
import tsModes from '../training-session-modes'
import modes from '../modes'

Vue.use(Vuex)

const store = new Vuex.Store({
	state: {
		bindings: [],
		trainingSession: {
			status: tsStatuses.stopped,
			mode: tsModes.random,
			countdownTimer: 0,
			timeToComplete: 300,

			// max number of tasks in training session
			maxTasks: 1000,
			// max duration of training session in seconds
			maxDuration: 60,
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
			state.bindings.splice(_.findIndex(state.bindings, { id: binding.id }), 1)
		},
		updateTrainingSession (state, payload) {
			state.trainingSession = {
				...state.trainingSession,
				...payload,
			}
		},
	},
	actions: {
		resetState ({ commit }) {
			commit('updateTrainingSession', {
				status: tsStatuses.stopped,
				countdownTimer: 0,
			})
		},
		updateBinding ({ commit }, binding) {
			commit('updateBinding', binding)
		},
		addBinding ({ commit }) {
			commit('addBinding', {
				id: v4(),
				bind: null,
			})
		},
		removeBinding ({ commit }, binding) {
			commit('removeBinding', binding)
		},
		updateTrainingSession ({ commit }, payload) {
			commit('updateTrainingSession', payload)
		},
		startSesssionCountdown ({ commit, state }) {
			const DEFAULT_CONTDOWN_TIME = 3
			const COUNTDOWN_INTERVAL_MS = 100

			commit('updateTrainingSession', {
				status: 'starting',
				countdownTimer: DEFAULT_CONTDOWN_TIME,
			})

			setTimeout(countdownTick, COUNTDOWN_INTERVAL_MS)
			function countdownTick () {
				if (state.trainingSession.countdownTimer < 0.1) {
					commit('updateTrainingSession', {
						status: 'in progress',
						countdownTimer: 0,
					})
					store.dispatch('startSession')
				} else {
					commit('updateTrainingSession', {
						countdownTimer: state.trainingSession.countdownTimer - 0.1
					})
					setTimeout(countdownTick, COUNTDOWN_INTERVAL_MS)
				}
			}
		},
		startSession ({ state }) {
			const it = modes.random(state.trainingSession, state.bindings)

			const task = it.next()
			console.log(task)

			//window.addEventListener('keyup', trackKeypress, true)

			//function trackKeypress () {

			//}
		}
	},
	plugins: [new VuexPersistence().plugin],
})

export default store
