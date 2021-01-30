<template lang="pug">
tr
	td
		v-text-field(
			v-model="title"
			label="Binding title"
		)
	td
		v-btn(v-if="!binding.bind" text @click="() => $emit('bind', binding)") Bind
		v-btn(v-else="!binding.bind" text @click="() => $emit('bind', binding)") {{ binding.bind | keybind }}
	td
		v-btn(v-if="binding.id" text color="red" @click="() => $emit('remove', binding)") REMOVE
</template>

<script>
export default {
	props: ['binding'],
	computed: {
		title: {
			get () {
				return this.binding.title
			},
			set (title) {
				this.$emit('update', {
					...this.binding,
					title,
				})
			}
		},
	},
	filters: {
		keybind (bind) {
			let prefix = []
			if (bind.altKey) {
				prefix.push('Alt')
			}
			if (bind.ctrlKey) {
				prefix.push('Ctrl')
			}
			if (bind.metaKey) {
				prefix.push('Meta')
			}
			if (bind.shiftKey) {
				prefix.push('Shift')
			}
			prefix.push(bind.key)
			if (bind.code.indexOf('Num') === 0) {
				prefix[prefix.length - 1] += ' (np)'
			}
			return prefix.join('+')
		},
	},
}
</script>
