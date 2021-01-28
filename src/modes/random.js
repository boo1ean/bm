import _ from 'lodash'

//const trainingTask = {
	//// Keybinding object
	//bind: {},
	//// Time to complete in ms
	//ttc: 300,
//}

//const trainingTaskResult = {
	//// Training Task object reference
	//tt: {},

	//// Complition time (ms)
	//ct: 153,
//}

export default function *randomTrainingSession (ts, bindings) {
	while (true) {
		const bindIndex = _.random(0, bindings.length - 1)
		yield {
			bind: bindings[bindIndex],
			ttc: ts.timeToComplete,
		}
	}
}
