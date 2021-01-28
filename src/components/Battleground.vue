<template lang="pug">
.wrapper
	.countdown(v-if="ts.status == 'starting'").d-flex.justify-center.align-center.flex-column
		h1.text-center GET READY
		h2.text-center.mt-3 {{ ts.countdownTimer | formatCountdown }}

	.tasks(v-if="ts.status == 'in progress'")

</template>

<style lang="scss">
.wrapper {
	height: 100%;
	background-color: black;
	color: white;
	.countdown {
		height: 100%;
	}
}
</style>
<script>
export default {
	props: ['ts'],
	filters: {
		formatCountdown (timer) {
			return timer.toFixed(1)
		}
	},
}
</script>
