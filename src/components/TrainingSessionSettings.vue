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
		//-label Mouse rotations
		//-br
		//-label Mouse movement

		v-text-field(
			label="Max duration (sec)"
			v-model="maxDuration"
		)
		v-text-field(
			label="Max nubmer of tasks to complete"
			v-model="maxTasks"
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
				return this.ts.maxDuration
			},
			set (maxDuration) {
				this.$emit('update', {
					...this.ts,
					maxDuration,
				})
			}
		},
	},
}
</script>
