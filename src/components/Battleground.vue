<template lang="pug">
.wrapper
	.countdown(v-if="as.status == 'starting'").d-flex.justify-center.align-center.flex-column
		h1.text-center GET READY
		h2.text-center.mt-3 {{ as.countdownTimer | formatCountdown }}

	.progress-wrapper(v-if="as.status == 'in progress'").d-flex.justify-center.align-center.flex-column
		.remaining-time {{ as.remainingTime | remainingTime }}
		.task-wrapper.d-flex.flex-column
			.current-keybind {{ as.currentTask.bind.title }}
			v-icon(color="green" x-large v-if="as.currentTask.success") mdi-check-circle
			v-icon(color="orange" x-large v-else-if="as.currentTask.wrongAttempt") mdi-alert-circle
			v-icon(color="red" x-large v-else-if="as.currentTask.fail") mdi-cancel
			.mock-40px(v-else)

</template>

<style lang="scss">
.wrapper {
	height: 100%;
	background-color: black;
	color: white;
	user-select: none;

	.countdown {
		height: 100%;
	}

	.progress-wrapper {
		height: 100%;
	}

	.current-keybind {
		font-size: 3rem;
	}

	.remaining-time {
		position: absolute;
		top: 1rem;
		right: 1rem;
	}
	.mock-40px {
		height: 40px;
	}
}
</style>
<script>
export default {
	props: ['ts', 'as'],
	filters: {
		formatCountdown (timer) {
			return (timer / 1000).toFixed(1)
		},
		remainingTime (time) {
			return (time / 1000).toFixed(1)
		},
	},
}
</script>
