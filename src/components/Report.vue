<template lang="pug">
v-card
	v-card-title Session result
	v-card-text
		v-simple-table
			template(v-slot:default)
				tbody
					tr
						td Total tasks
						td {{ tasksTotal }}
					tr
						td Completed
						td {{ tasksCompleted }}
					tr
						td Failed
						td {{ tasksFailed }}
					tr
						td Wrong attempts
						td {{ wrongAttempts }}
					tr
						td Avg. reaction time
						td {{ wrongAttempts }}
					tr
						td Slowest keybind
						td {{ slowestKeybind }}
					tr
						td Fastest keybind
						td {{ fastestKeybind }}
					tr
						td Slow to fast
						td {{ slowToFastRanks }}
		br
		.text-center
			v-btn().mr-2 Save result
			v-btn() Ok
</template>

<style lang="scss">

</style>

<script>
export default {

}
</script>
