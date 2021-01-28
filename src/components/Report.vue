<template lang="pug">
v-card
	v-card-title Session result
	v-card-text
		v-simple-table
			template(v-slot:default)
				tbody
					tr
						td Duration
						td {{ r.duration | duration }}
					tr
						td Total binds
						td {{ r.totalTasksCount }}
					tr
						td Completed
						td {{ r.completedTasksCount }}
					tr
						td Failed
						td {{ r.failedTasksCount }}
					tr
						td Wrong attempts
						td {{ r.wrongAttempts }}
					tr
						td Avg. reaction time
						td {{ r.avgReactionTime | reaction }}
					tr
						td Slowest keybind
						td {{ r.maxReactionTimeBind.title }}
					tr
						td Fastest keybind
						td {{ r.minReactionTimeBind.title }}
		br
		.text-center
			v-btn(@click="() => $emit('save')").mr-2 Save result
			v-btn(@click="() => $emit('close')") Ok
</template>

<style lang="scss">

</style>

<script>
export default {
	props: ['r'],
	filters: {
		duration (ms) {
			return Math.round(ms / 1000) + ' seconds'
		},
		reaction (ms) {
			return Math.round(ms) + ' ms'
		}
	},
}
</script>
