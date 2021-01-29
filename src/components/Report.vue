<template lang="pug">
.wrapper
	v-card(
		width=800
	)
		v-card-title.justify-space-between
			span Training report
			v-btn(icon @click="() => $emit('close')")
				v-icon mdi-close
		v-card-subtitle {{ r.createdAt | date }}
		v-card-text
			v-tabs(
				v-model="tab"
				background-color="transparent"
				color="basil"
				grow
			)
				v-tab(
					key="summary"
				) Summary
				v-tab(
					key="details"
				) Details

			v-tabs-items(v-model="tab")
				v-tab-item(
					key="summary"
				)
					v-simple-table
						template(v-slot:default)
							tbody
								tr
									td Duration
									td {{ r.duration | duration }}
								tr
									td Total tasks
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
				v-tab-item(
					key="details"
				)
					v-data-table(
						:headers="detailsHeaders"
						:items="tasks"
						:items-per-page=100
						hide-default-footer
					)
						template(v-slot:item.totalAttempts="{ item }")
							span
								span.green--text {{ item.completed.length }}
								span /
								span.orange--text {{ item.wrongAttempts }}
								span /
								span.red--text {{ item.failed.length }}

		v-card-actions.flex-row-reverse
			v-btn(text @click="() => $emit('close')") Close
			v-btn(text color="red" @click="() => $emit('delete', r)") Delete
</template>

<style lang="scss">
.wrapper {
	position: fixed;
	height: 100%;
	width: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
	z-index: 2;
	background-color: rgba(50, 50, 50, 0.9)
}
</style>

<script>
import { DateTime } from 'luxon'
export default {
	props: ['r'],
	data () {
		return {
			tab: 'summary',
			detailsHeaders: [
				{
					text: 'Bind',
					value: 'title',
				},
				{
					text: 'Attempts',
					value: 'totalAttempts',
				},
				{
					text: 'Avg. reaction',
					value: 'avgReactionTime',
				},
				{
					text: 'Slowest reaction',
					value: 'maxReactionTime',
				},
				{
					text: 'Fastest reaction',
					value: 'minReactionTime',
				},
			],
		}
	},
	computed: {
		tasks: function () {
			return Object.values(this.r.taskById)
		}
	},
	filters: {
		duration (ms) {
			return Math.round(ms / 1000) + ' seconds'
		},
		reaction (ms) {
			return Math.round(ms) + ' ms'
		},
		date (ts) {
			return DateTime.fromMillis(ts).toLocaleString(DateTime.DATETIME_FULL)
		},
	},
}
</script>
