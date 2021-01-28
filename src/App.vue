<template lang="pug">
v-app
	v-main
		//-v-app-bar.mb-3(
			//-color="yellow"
			//-dense
		//-)
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

const DEFAULT_CONTDOWN_TIME = 3

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
			this.ts.status = 'starting'
			this.ts.countdownTimer = DEFAULT_CONTDOWN_TIME
			this.countdownInterval = setInterval(() => countdownTick(this), 100)
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

function countdownTick (ctx) {
	if (ctx.countdownTimer < 0.1) {
		ctx.ts.status = 'in progress'
		ctx.ts.countdownTimer = 0
		clearInterval(ctx.countdownInterval)
	} else {
		ctx.ts.countdownTimer -= 0.1
	}
}
</script>
