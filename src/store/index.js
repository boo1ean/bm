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
			countdownDuration: 3000,
			// max number of tasks in training session
			maxTasks: 1000,
			// max duration of training session (ms)
			maxDuration: 60000,
			// task time limit (ms)
			taskTimeLimit: 1000,
			// rest between tasks (ms)
			restTime: 300,
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

			let task = {
				...it.next().value,
				startTime,
				recentTickTime: startTime,
				success: false,
			}
			commit('updateActiveSession', {
				currentTask: task,
				remainingTime: state.trainingSession.duration,
			})

			function sessionTickHandler () {
				const currentTime = new Date().getTime()
				const diff = currentTime - startTime

				if (diff >= state.trainingSession.maxDuration) {
					clearInterval(sessionInterval)
					window.removeEventListener('keyup', trackKeypress, true)
					finishAndReport()
					return
				}

				const currentTask = state.activeSession.currentTask
				const taskTimeDiff = currentTime - currentTask.startTime
				const taskRemainingTime = currentTask.timeLimit - taskTimeDiff

				if (taskRemainingTime <= 1 && !currentTask.failed) {
					const failedTask = {
						...currentTask,
						failed: true,
					}
					commit('updateActiveSession', {
						completedTasks: state.activeSession.completedTasks.concat([ failedTask ]),
						currentTask: failedTask,
					})

					const newTask = {
						...it.next().value,
						startTime: currentTime,
						recentTickTime: currentTime,
						success: false,
					}
					scheduleNewTask(newTask)
				}

				commit('updateActiveSession', {
					remainingTime: state.trainingSession.maxDuration - diff
				})

			}

			window.addEventListener('keyup', trackKeypress, true)

			function trackKeypress (e) {
				const currentTask = state.activeSession.currentTask
				if (currentTask.failed || currentTask.success) {
					return
				}
				const pressedPayload = _.pick(e, [
					'altKey',
					'code',
					'ctrlKey',
					'key',
					'keyCode',
					'metaKey',
					'shiftKey',
				])

				//console.log(JSON.stringify(pressedPayload))
				//console.log(JSON.stringify(state.activeSession.currentTask.bind.bind))

				const currentTime = new Date().getTime()
				if (_.isEqual(pressedPayload, state.activeSession.currentTask.bind.bind)) {
					const completedTask = {
						...state.activeSession.currentTask,
						success: true,
						recentTickTime: currentTime,
					}
					const newTask = {
						...it.next().value,
						startTime: currentTime,
						recentTickTime: currentTime,
						success: false,
					}
					commit('updateActiveSession', {
						completedTasks: state.activeSession.completedTasks.concat([completedTask]),
						currentTask: completedTask,
					})
					scheduleNewTask(newTask)
				} else {
					const currentTask = {
						...state.activeSession.currentTask,
						wrongAttempts: state.activeSession.currentTask.wrongAttempts + 1,
						recentTickTime: currentTime,
					}
					commit('updateActiveSession', {
						currentTask,
					})
				}
			}

			function scheduleNewTask (newTask) {
				console.log('scheduling', newTask)
				setTimeout(() => {
					commit('updateActiveSession', {
						currentTask: newTask,
					})
				}, state.trainingSession.restTime)
			}

			function finishAndReport () {
				commit('updateActiveSession', {
					status: 'finished'
				})

				const totalTasks = state.activeSession.completedTasks

				const report = {
					totalTasksCount: totalTasks.length,
					avgReactionTime: 0,
					maxReactionTime: Number.MAX_VALUE,
					minReactionTime: Number.MIN_VALUE,
				}

				const completedTasks = []
				const failedTasks = []
				const reactionTimes = []
				const taskById = {}

				let wrongAttempts = 0

				for (const t of totalTasks) {
					if (!taskById[t.bind.id]) {
						taskById[t.bind.id] = {
							id: t.bind.id,
							completed: [],
							failed: [],
							reactionTimes: [],
							wrongAttempts: 0,
							avgReactionTime: 0,
							maxReactionTime: Number.MAX_VALUE,
							minReactionTime: Number.MIN_VALUE,
						}
					}

					if (t.failed) {
						failedTasks.push(t)
						taskById[t.bind.id].failed.push(t)
					} else if (t.success) {
						completedTasks.push(t)

						const reactionTime = t.recentTickTime - t.startTime
						if (reactionTime > report.maxReactionTime) {
							report.maxReactionTime = reactionTime
						}
						if (reactionTime < report.minReactionTime) {
							report.minReactionTime = reactionTime
						}

						reactionTimes.push(reactionTime)

						// Tasks-specific stats
						const taskStats = taskById[t.bind.id]
						taskStats.completed.push(t)

						taskStats.reactionTimes.push(reactionTime)
						taskStats.wrongAttempts += t.wrongAttempts

						if (reactionTime > taskStats.maxReactionTime) {
							taskStats.maxReactionTime = reactionTime
						}
						if (reactionTime < taskStats.minReactionTime) {
							taskStats.minReactionTime = reactionTime
						}
					}
					wrongAttempts += t.wrongAttempts
				}

				for (const t of taskById) {
					for (const rt of t.reactionTimes) {
						t.avgReactionTime += rt
					}
					t.avgReactionTime /= t.reactionTimes.length
				}

				report.completedTasksCount = completedTasks.length
				report.failedTasksCount = failedTasks.length
				report.wrongAttempts = wrongAttempts

			}
		}
	},
	plugins: [new VuexPersistence().plugin],
})

export default store
