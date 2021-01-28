<template lang="pug">
v-card
	v-card-title.d-flex.align-center
		span.mr-3 Training settings
		v-btn-toggle(
			v-model="ts.mode"
			mandatory
		)
			v-btn(v-for="m in modes" small :value="m") {{ m }}
	v-card-text
		label Mouse rotations
		br
		label Mouse movement
		//-.countdown(
			//-v-if="isStarting"
		//-)
			//-h1 GET READY
			//-h2.text-center.mt-3 {{ countdownTimer | formatCountdown }}

		//-.battleground(v-else-if="isStarted")
			//-h2 Training is in progress

		v-btn(
			block
			@click="() => $emit('start-clicked')"
		) START TRAINING SESSION

</template>

<script>
import tsModes from '../training-session-modes'
export default {
	props: ['bindings', 'ts'],

	data () {
		return {
			countdownInterval: null,
		}
	},

	methods: {
	},

	filters: {
		formatCountdown (timer) {
			return timer.toFixed(1)
		}
	},

	computed: {
		modes: function () {
			return Object.keys(tsModes)
		}
	},
}
</script>
