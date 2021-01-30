import _ from "lodash";
import { v4 } from 'uuid'

export default {
	validateBinding,
	pickBindingValues,
	generateNewBinding,
}

const BINDING_FIELDS = [
	'altKey',
	'code',
	'ctrlKey',
	'key',
	'keyCode',
	'metaKey',
	'shiftKey',
]

function validateBinding (b) {
	if (!_.isObject(b) || !_.has(b, 'title') || !_.has(b, 'bind') || !_.has(b, 'id')) {
		return false
	}
	for (const f of BINDING_FIELDS) {
		if (!_.has(b.bind, f)) {
			return false
		}
	}
	return true
}

function generateNewBinding () {
	return {
		id: v4(),
		title: 'Bind title',
		bind: null,
	}
}

function pickBindingValues (b) {
	return {
		id: b.id,
		title: b.title,
		bind: _.pick(b.bind, BINDING_FIELDS)
	}
}
