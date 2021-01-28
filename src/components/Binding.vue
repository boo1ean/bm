<template lang="pug">
	v-row
		v-col(cols=6)
			v-text-field
		v-col(cols=6).d-flex.align-center
			v-btn(v-if="!binding.bind" text @click="() => $emit('bind', binding)") Bind
			v-btn(v-else="!binding.bind" text @click="() => $emit('bind', binding)") {{ binding.bind | keybind }}
			v-btn(v-if="binding.id" text color="red" @click="() => $emit('remove', binding)") REMOVE
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
