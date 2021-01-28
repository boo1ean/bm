import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import { v4 } from 'uuid'
import VuexPersistence from 'vuex-persist'
import tsStatuses from '../training-session-statuses'
import tsModes from '../training-session-modes'
import modes from '../modes'

Vue.use(Vuex)

const initialActiveSessionState = {
	status: tsStatuses.stopped,
	completedTasks: [],
	countdownTimer: 0,
	remainingTime: 0,
	currentTask: null
}

const store = new Vuex.Store({
	state: {
		bindings: [],
		trainingSession: {
			mode: tsModes.random,
			timeToComplete: 300,

			// get ready timer (ms)
			countdownDuration: 5000,
			// max number of tasks in training session
			maxTasks: 1000,
			// max duration of training session (ms)
			maxDuration: 60000,
		},
		activeSession: {
			...initialActiveSessionState,
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
		updateActiveSession (state, payload) {
			state.activeSession = {
				...state.activeSession,
				...payload,
			}
		},
	},
	actions: {
		resetState ({ commit }) {
			commit('updateActiveSession', {
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
			const COUNTDOWN_INTERVAL_MS = 100

			commit('updateActiveSession', {
				status: 'starting',
				countdownTimer: state.trainingSession.countdownDuration,
			})

			setTimeout(countdownTick, COUNTDOWN_INTERVAL_MS)
			function countdownTick () {
				if (state.activeSession.countdownTimer < 100) {
					commit('updateActiveSession', {
						status: 'in progress',
						countdownTimer: 0,
					})
					store.dispatch('startSession')
				} else {
					commit('updateActiveSession', {
						countdownTimer: state.activeSession.countdownTimer - 100
					})
					setTimeout(countdownTick, COUNTDOWN_INTERVAL_MS)
				}
			}
		},
		startSession ({ state, commit }) {
			const it = modes.random(state.trainingSession, state.bindings)
			const startTime = new Date().getTime()

			const SESSION_HANDLER_FREQ = 30
			let sessionInterval = setInterval(sessionTickHandler, SESSION_HANDLER_FREQ)

			commit('updateActiveSession', {
				currentTask: it.next(),
				remainingTime: state.trainingSession.duration,
			})

			function sessionTickHandler () {
				const currentTime = new Date().getTime()
				const diff = currentTime - startTime

				if (diff >= state.trainingSession.maxDuration) {
					clearInterval(sessionInterval)
					console.log('Session finished by duration')
				}

				commit('updateActiveSession', {
					remainingTime: state.trainingSession.maxDuration - diff
				})

			}

			//window.addEventListener('keyup', trackKeypress, true)

			//function trackKeypress () {

			//}
		}
	},
	plugins: [new VuexPersistence().plugin],
})

export default store
