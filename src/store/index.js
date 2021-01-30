import _ from 'lodash'
import Vue from 'vue'
import Vuex from 'vuex'
import { v4 } from 'uuid'
import VuexPersistence from 'vuex-persist'
import tsStatuses from '../training-session-statuses'
import tsModes from '../training-session-modes'
import modes from '../modes'
import bindingUtils from "../utils/binding-utils";

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
			// get ready timer (ms)
			countdownDuration: 3000,
			// max number of tasks in training session
			maxTasks: 1000,
			// max duration of training session (ms)
			maxDuration: 30000,
			// task time limit (ms)
			taskTimeLimit: 5000,
			// rest between tasks (ms)
			restTime: 300,
		},
		activeSession: {
			...initialActiveSessionState,
		},
		report: {},
		reports: [],
	},
	mutations: {
		updateBinding (state, binding) {
			const index = _.findIndex(state.bindings, { id: binding.id })
			state.bindings.splice(index, 1, binding)
		},
		addBinding (state, binding) {
			state.bindings = state.bindings.concat([binding])
		},
		setBindings (state, bindings) {
			state.bindings = [...bindings]
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
		setReport (state, report) {
			state.report = { ...report }
		},
		addReport (state, report) {
			state.reports = state.reports.concat([ report ])
		},
		deleteReport (state, report) {
			const index = _.findIndex(state.reports, { id: report.id })
			state.reports.splice(index, 1)
		},
	},
	actions: {
		resetState ({ commit }) {
			commit('updateActiveSession', { ...initialActiveSessionState })
			commit('setReport', {})
		},
		updateBinding ({ commit }, binding) {
			commit('updateBinding', binding)
		},
		addBinding ({ commit }) {
			commit('addBinding', bindingUtils.generateNewBinding())
		},
		appendBinding ({ commit }, binding) {
			commit('addBinding', binding)
		},
		setBindings({ commit }, bindings) {
			commit('setBindings', bindings)
		},
		removeBinding ({ commit }, binding) {
			if (window.confirm('Are you sure?')) {
				commit('removeBinding', binding)
			}
		},
		updateTrainingSession ({ commit }, payload) {
			commit('updateTrainingSession', payload)
		},
		startSesssionCountdown ({ commit, state }) {
			if (!state.bindings.length) {
				return window.alert('No bindings, no training!')
			}

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
			commit('updateActiveSession', { ...initialActiveSessionState })
            
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
				startTime,
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
				const totalTasks = state.activeSession.completedTasks
				const currentTime = new Date().getTime()

				const report = {
					id: v4(),
					createdAt: currentTime,
					duration: currentTime - state.activeSession.startTime,
					totalTasksCount: totalTasks.length,
					avgReactionTime: 0,
					maxReactionTime: Number.MIN_VALUE,
					maxReactionTimeBind: null,
					minReactionTime: Number.MAX_VALUE,
					minReactionTimeBind: null,
				}

				const completedTasks = []
				const failedTasks = []
				const reactionTimes = []
				const taskById = {}

				let wrongAttempts = 0
				let avgReactionTime = 0

				for (const t of totalTasks) {
					if (!taskById[t.bind.id]) {
						taskById[t.bind.id] = {
							id: t.bind.id,
							title: t.bind.title,
							completed: [],
							failed: [],
							reactionTimes: [],
							totalAttempts: 0,
							wrongAttempts: 0,
							avgReactionTime: 0,
							maxReactionTime: Number.MIN_VALUE,
							minReactionTime: Number.MAX_VALUE,
						}
					}

					if (t.failed) {
						failedTasks.push(t)
						taskById[t.bind.id].failed.push(t)
					} else if (t.success) {
						completedTasks.push(t)

						const reactionTime = t.recentTickTime - t.startTime
						reactionTimes.push(reactionTime)
						avgReactionTime += reactionTime

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
					taskById[t.bind.id].totalAttempts++

					wrongAttempts += t.wrongAttempts
				}

				for (const id in taskById) {
					const t = taskById[id]
					for (const rt of t.reactionTimes) {
						t.avgReactionTime += rt
					}
					t.avgReactionTime = Math.round(t.avgReactionTime / t.reactionTimes.length)

					if (t.avgReactionTime > report.maxReactionTime) {
						report.maxReactionTime = t.avgReactionTime
						report.maxReactionTimeBind = t
					}
					if (t.avgReactionTime < report.minReactionTime) {
						report.minReactionTime = t.avgReactionTime
						report.minReactionTimeBind = t
					}
				}

				report.completedTasksCount = completedTasks.length
				report.failedTasksCount = failedTasks.length
				report.wrongAttempts = wrongAttempts
				report.avgReactionTime = avgReactionTime / reactionTimes.length
				report.taskById = taskById

				console.log(report)

				if (!report.completedTasksCount) {
					window.alert('You pressed nothing!')
					commit('updateActiveSession', {
						status: 'stopped'
					})
					return
				}

				commit('addReport', report)
				commit('setReport', report)
				commit('updateActiveSession', {
					status: 'stopped'
				})
			}
		},
		closeReport ({ commit }) {
			commit('setReport', {})
		},
		deleteReport ({ commit }, report) {
			commit('deleteReport', report)
		},
		setReport ({ commit }, report) {
			commit('setReport', report)
		},
	},
	plugins: [new VuexPersistence().plugin],
})

export default store
