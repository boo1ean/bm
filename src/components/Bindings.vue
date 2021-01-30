<template lang="pug">
v-card
	v-card-title.align-center.justify-space-between
		span Bindings
		div
			v-btn(text @click="$emit('copy')") Copy
			v-btn(text @click="$emit('paste')") Paste
			v-btn(text @click="$emit('append')") Append
			v-btn(text @click="expanded = !expanded")
				span(v-if="expanded") hide
				span(v-else) show
	v-card-text
		v-simple-table(v-show="expanded")
			template(v-slot:default)
				tbody
					Binding(
						v-for="b in bindings"
						:binding="b"
						@bind="b => activeBind = b"
						@remove="b => $emit('remove-binding', b)"
						@update="b => $emit('update-binding', b)"
					)
		v-btn(block @click="() => { $emit('add'); expanded = true }") ADD
</template>
<script>
import _ from 'lodash'
import Binding from './Binding'
export default {
	components: {
		Binding,
	},
	props: ['bindings'],
	data () {
		return {
			activeBind: null,
			expanded: true,
		}
	},
	mounted () {
		window.addEventListener('keyup', this.trackUpdateBinding, true)
	},
	unmounted () {
		window.removeEventListener('keyup', this.trackUpdateBinding)
	},
	methods: {
		trackUpdateBinding (e) {
			if (this.activeBind) {
				this.$emit('update-binding', {
					...this.activeBind,
					bind: _.pick(e, [
						'altKey',
						'code',
						'ctrlKey',
						'key',
						'keyCode',
						'metaKey',
						'shiftKey',
					])
				})
				this.activeBind = null
			}
		},
	},
}

</script>
