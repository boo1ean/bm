<template lang="pug">
v-app
	v-main
		//-v-app-bar.mb-3(
			//-color="yellow"
			//-dense
		//-)
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
</template>

<script>
import Bindings from './components/Bindings'
import TrainingSessionSettings from './components/TrainingSessionSettings'
import Battleground from './components/Battleground'
import store from './store'

export default {
	components: {
		Bindings,
		TrainingSessionSettings,
		Battleground,
	},
	data () {
		return {
			countdownInterval: null,
		}
	},
	computed: {
		bindings: () => store.state.bindings,
		ts: () => store.state.trainingSession,
		as: () => store.state.activeSession,
		report: () => store.state.report,
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
	},
}

</script>
