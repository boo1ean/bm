<template lang="pug">
v-card
	v-card-title Training history
	v-card-text
		v-data-table(
			:headers="headers"
			:items="reports"
		)
			template(v-slot:item.createdAt="{ item }")
				span.text--secondary {{ item.createdAt | date }}

			template(v-slot:item.completedTasks="{ item }")
				span
					span.green--text {{ item.completedTasksCount }}
					span /
					span.orange--text {{ item.wrongAttempts }}
					span /
					span.red--text {{ item.failedTasksCount }}

			template(v-slot:item.duration="{ item }")
				span {{ Math.round(item.duration / 1000) }} sec

			template(v-slot:item.avgReactionTime="{ item }")
				span {{ Math.round(item.avgReactionTime) }} ms

			template(v-slot:item.id="{ item }")
				div
					v-btn(text small @click="() => $emit('show', item)") show
					v-btn(text small color="red" @click="() => $emit('delete', item)") delete

			template(v-slot:item.maxReactionTimeBind="{ item }")
				span {{ item.maxReactionTimeBind.title }}&nbsp;
				i.text--secondary.reaction {{ item.maxReactionTime }} ms
</template>

<style scoped lang="scss">
.reaction {
	font-size: .7rem;
}
</style>

<script>
import { DateTime } from 'luxon'

export default {
	props: ['reports'],
	data () {
		return {
			headers: [
				{
					text: 'Date',
					value: 'createdAt',
				},
				{
					text: 'Duration',
					value: 'duration',
				},
				{
					text: 'Tasks',
					value: 'completedTasks',
				},
				{
					text: 'Avg. reaction',
					value: 'avgReactionTime',
				},
				{
					text: 'Slowest bind',
					value: 'maxReactionTimeBind',
				},
				{
					text: '',
					value: 'id',
				}
			]
		}
	},
	filters: {
		date (timestamp) {
			return DateTime.fromMillis(timestamp).toLocaleString(DateTime.DATETIME_FULL)
		}
	},
}
</script>
