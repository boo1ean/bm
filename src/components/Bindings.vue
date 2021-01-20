<template lang="pug">
v-card
	v-card-title Bindings
	v-card-text
		Binding(
			v-for="b in bindings"
			:binding="b"
			@bind="b => activeBind = b"
		)
		v-row
			v-col(cols=12)
				v-btn(block @click="() => $emit('add')") ADD
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
			activeBind: null
		}
	},
	mounted () {
		window.addEventListener('keyup', e => {
			if (this.activeBind) {
				this.$emit('updateBinding', {
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
		}, true)
	},
}

</script>
