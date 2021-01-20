<template lang="pug">
	v-row
		v-col(cols=6)
			v-text-field
		v-col(cols=6).d-flex.justify-center.align-center
			v-btn(v-if="!binding.bind" label block @click="() => $emit('bind', binding)") Bind
			v-btn(v-else="!binding.bind" label block @click="() => $emit('bind', binding)") {{ binding.bind | keybind }}
</template>

<script>
export default {
	props: ['binding'],
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
			return prefix.join('+')
		},
	},
}
</script>
