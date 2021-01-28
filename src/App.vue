<template lang="pug">
v-app
	v-main
		//-v-app-bar.mb-3(
			//-color="yellow"
			//-dense
		//-)
		Battleground(
			v-show="ts.status != 'stopped'"
			:ts="ts"
		)
		v-container.fluid
			v-row
				v-col(cols=6 v-show="ts.status == 'stopped'")
					Bindings(
						:bindings="bindings"
						@add="addBinding"
						@remove-binding="removeBinding"
						@update-binding="updateBinding"
					)
				v-col(cols=6 v-show="ts.status == 'stopped'")
					TrainingSessionSettings(
						:bindings="bindings"
						:ts="ts"
						@start-clicked="startSession"
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
	},
	mounted () {
	},
	methods: {
		startSession () {
			store.dispatch('startSession')
		},
		addBinding () {
			store.dispatch('addBinding')
		},
		updateBinding (binding) {
			store.dispatch('updateBinding', binding)
		},
		removeBinding (binding) {
			console.log('remove bind method')
			store.dispatch('removeBinding', binding)
		},
	},
}

</script>
