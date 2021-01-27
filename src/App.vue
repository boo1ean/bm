<template lang="pug">
v-app
	v-main
		//-v-app-bar.mb-3(
			//-color="yellow"
			//-dense
		//-)
		v-container.fluid
			v-row
				v-col(cols=6)
					Bindings(
						:bindings="bindings"
						@add="addBinding"
						@updateBinding="updateBinding"
					)
				v-col(cols=6)
					TrainingSessionSettings(
						:bindings="bindings"
						:ts="ts"
					)
</template>

<script>
import Bindings from './components/Bindings'
import TrainingSessionSettings from './components/TrainingSessionSettings'
import store from './store'

export default {
	components: {
		Bindings,
		TrainingSessionSettings,
	},
	computed: {
		bindings: () => store.state.bindings,
		ts: () => store.state.trainingSession,
	},
	mounted () {
	},
	methods: {
		addBinding () {
			store.dispatch('addBinding')
		},
		updateBinding (binding) {
			store.dispatch('updateBinding', binding)
		},
	},
};
</script>
