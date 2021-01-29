<template lang="pug">
v-app
	v-main
		Report(
			v-if="report.id"
			:r="report"
			@close="closeReport"
			@delete="deleteReport"
		)
		Battleground(
			v-show="as.status != 'stopped'"
			:ts="ts"
			:as="as"
			:report="report"
			@close="resetBattleground"
		)
		v-container.fluid(v-show="as.status == 'stopped'")
			v-row
				v-col(cols=6)
					Bindings(
						:bindings="bindings"
						@add="addBinding"
						@remove-binding="removeBinding"
						@update-binding="updateBinding"
					)
				v-col(cols=6)
					TrainingSessionSettings(
						:bindings="bindings"
						:ts="ts"
						@start-clicked="startSession"
						@update="updateTrainingSession"
					)
				v-col(cols=12)
					ReportsHistory(
						:reports="reports"
						@show="showReport"
						@delete="deleteReport"
					)
</template>

<script>
import Bindings from './components/Bindings'
import TrainingSessionSettings from './components/TrainingSessionSettings'
import Battleground from './components/Battleground'
import Report from './components/Report'
import ReportsHistory from './components/ReportsHistory'
import store from './store'

export default {
	components: {
		Bindings,
		TrainingSessionSettings,
		Battleground,
		Report,
		ReportsHistory,
	},
	data () {
		return {
			countdownInterval: null,
		}
	},
	computed: { bindings: () => store.state.bindings,
		ts: () => store.state.trainingSession,
		as: () => store.state.activeSession,
		report: () => store.state.report,
		reports: () => store.state.reports,
	},
	mounted () {
		store.dispatch('resetState')
	},
	methods: {
		startSession () {
			store.dispatch('startSesssionCountdown')
		},
		addBinding () {
			store.dispatch('addBinding')
		},
		updateBinding (binding) {
			store.dispatch('updateBinding', binding)
		},
		removeBinding (binding) {
			store.dispatch('removeBinding', binding)
		},
		updateTrainingSession (ts) {
			store.dispatch('updateTrainingSession', ts)
		},
		resetBattleground () {
			store.dispatch('resetState')
		},
		closeReport () {
			store.dispatch('closeReport')
		},
		deleteReport (report) {
			if (window.confirm('Are you sure?')) {
				store.dispatch('deleteReport', report)
			}
		},
		showReport (report) {
			store.dispatch('setReport', report)
		},
	},
}

</script>
