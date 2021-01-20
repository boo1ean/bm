<template lang="pug">
v-app
	v-main
		v-row
			v-col(cols=4)
				Bindings(
					:bindings="bindings"
					@add="addBinding"
					@updateBinding="updateBinding"
				)
</template>

<script>
import Bindings from './components/Bindings'
import store from './store'

export default {
	components: {
		Bindings,
	},
	computed: {
		bindings: () => store.state.bindings
	},
	mounted () {
	},
	methods: {
		addBinding () {
			store.dispatch('addBinding')
		},
		updateBinding (binding) {
			store.dispatch('updateBinding', binding)
		},
	},
};
</script>
