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
		.countdown(
			v-if="isStarting"
		)
			h1 GET READY
			h2.text-center.mt-3 {{ countdownTimer | formatCountdown }}

		.battleground(v-else-if="isStarted")
			h2 Training is in progress

		v-btn(
			v-else
			block
			@click="() => $emit('startClicked')"
		) START TRAINING SESSION

</template>

<script>
import tsModes from '../training-session-modes'
const DEFAULT_CONTDOWN_TIME = 3

export default {
	props: ['bindings', 'ts'],

	data () {
		return {
			isStarting: false,
			isStarted: false,
			countdownTimer: 0,
			countdownInterval: null,
		}
	},

	methods: {
		startSession () {
			this.isStarting = true
			this.countdownTimer = DEFAULT_CONTDOWN_TIME
			this.countdownInterval = setInterval(() => countdownTick(this), 100)
		},
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

function countdownTick (ctx) {
	if (ctx.countdownTimer < 0.1) {
		ctx.isStarting = false
		ctx.isStarted = true
		ctx.countdownTimer = 0
		clearInterval(ctx.countdownInterval)
	} else {
		ctx.countdownTimer -= 0.1
	}
}
</script>
