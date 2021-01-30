import _ from 'lodash'

export default function *randomTrainingSession (ts, bindings) {
	while (true) {
		const bindIndex = _.random(0, bindings.length - 1)
		yield {
			bind: bindings[bindIndex],
			timeLimit: ts.taskTimeLimit,
			wrongAttempts: 0,
		}
	}
}
