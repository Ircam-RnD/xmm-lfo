import * as lfo from 'waves-lfo';
//import PhraseMaker from './xmm-phrase';
import { PhraseMaker } from 'xmm-client';

export default class XmmPhraseRecorder extends lfo.sinks.DataRecorder {
	constructor(options = {}) {
		const defaults = {
			separateArrays: true,
			bimodal: false,
			dimension_input: 0,
			column_names: ['']
		}
		Object.assign(defaults, options);
		//console.log('defaults : ' + defaults);
		super(defaults);

		this._phraseMaker = new PhraseMaker(this.params);

		this.updatePhrase = ((data) => {
			for (let vecid in data.data) {
				const obs = [];
				for (let id in data.data[vecid]) {
					obs.push(data.data[vecid][id]);
				}
				//console.log(obs);
				this._phraseMaker.addObservation(obs);
			}
			this.retrieve()
				.then(this.updatePhrase.bind(this))
				.catch((err) => console.error(err.stack));
		});

		this.retrieve()
			.then(this.updatePhrase.bind(this))
			.catch((err) => console.error(err.stack));
	}

	get label() {
		return this.phraseMaker.config.label;
	}

	set label(label) {
		this._phraseMaker.config = { label: label };
	}

	start() {
		super.start();
	}

	stop() {
		super.stop();
		this._phraseMaker.reset();
	}

	initialize(streamParams = {}) {
		super.initialize(streamParams);
		this._phraseMaker.config = { dimension: this.streamParams.frameSize };
		this._phraseMaker.reset();
	}

	getRecordedPhrase() {
		return this._phraseMaker.phrase;
	}
}