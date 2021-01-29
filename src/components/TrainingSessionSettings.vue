<template lang="pug">
v-card
	v-card-title.d-flex.align-center.justify-space-between
		span.mr-3 Training settings
		v-btn(text @click="expanded = !expanded")
			span(v-if="expanded") hide
			span(v-else) show
		//-v-btn-toggle(
			//-v-model="ts.mode"
			//-mandatory
		//-)
			//-v-btn(v-for="m in modes" small :value="m") {{ m }}
	v-card-text
		//-label Mouse rotations
		//-br
		//-label Mouse movement

		.settings-form(v-if="expanded")
			v-text-field(
				label="Start countdown duration (sec)"
				v-model="countdownDuration"
			)
			v-text-field(
				label="Session duration (sec)"
				v-model="maxDuration"
			)
			v-text-field(
				label="Max nubmer of tasks to complete"
				v-model="maxTasks"
			)
			v-text-field(
				label="Task time limit (ms)"
				v-model="taskTimeLimit"
			)
			v-text-field(
				label="Time between tasks (ms)"
				v-model="restTime"
			)
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
			expanded: true,
		}
	},

	filters: {
		formatCountdown (timer) {
			return timer.toFixed(1)
		}
	},

	computed: {
		modes: function () {
			return Object.keys(tsModes)
		},
		maxTasks: {
			get () {
				return this.ts.maxTasks
			},
			set (maxTasks) {
				this.$emit('update', {
					...this.ts,
					maxTasks,
				})
			}
		},
		maxDuration: {
			get () {
				return this.ts.maxDuration / 1000
			},
			set (maxDuration) {
				this.$emit('update', {
					...this.ts,
					maxDuration: maxDuration * 1000,
				})
			}
		},
		countdownDuration: {
			get () {
				return this.ts.countdownDuration / 1000
			},
			set (countdownDuration) {
				this.$emit('update', {
					...this.ts,
					countdownDuration: countdownDuration * 1000,
				})
			}
		},
		restTime: {
			get () {
				return this.ts.restTime
			},
			set (restTime) {
				this.$emit('update', {
					...this.ts,
					restTime,
				})
			}
		},
		taskTimeLimit: {
			get () {
				return this.ts.taskTimeLimit
			},
			set (taskTimeLimit) {
				this.$emit('update', {
					...this.ts,
					taskTimeLimit,
				})
			}
		},
	},
}
</script>
