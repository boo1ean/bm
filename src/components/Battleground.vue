<template lang="pug">
.wrapper
	.countdown(v-if="as.status == 'starting'").d-flex.justify-center.align-center.flex-column
		h1.text-center GET READY
		h2.text-center.mt-3 {{ as.countdownTimer | formatCountdown }}

	.progress-wrapper(v-if="as.status == 'in progress'").d-flex.justify-center.align-center
		.remaining-time {{ as.remainingTime | remainingTime }}
		.current-keybind {{ as.currentTask.bind.title }}

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
