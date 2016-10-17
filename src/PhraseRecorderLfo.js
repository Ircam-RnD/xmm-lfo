import * as lfo from 'waves-lfo';
import { PhraseMaker } from 'xmm-client';

/**
 * Lfo class extending lfo.sinks.DataRecorder, using PhraseMaker from xmm-client
 * to format the input data for xmm-node.
 * @class
 */
class PhraseRecorderLfo extends lfo.sinks.DataRecorder {
	constructor(options = {}) {
		const defaults = {
			separateArrays: true,
			bimodal: false,
			dimension_input: 0,
			column_names: ['']
		}
		Object.assign(defaults, options);
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

	/**
	 * The current label of the last / currently being recorded phrase.
	 * @type {String}
	 */
	get label() {
		return this.phraseMaker.config.label;
	}

	set label(label) {
		this._phraseMaker.config = { label: label };
	}

	/**
	 * Start recording a phrase from the input stream.
	 */
	start() {
		this._phraseMaker.reset(); // is this better here than in stop() ?
		super.start();
	}

	/**
	 * Stop the current recording.
	 * (makes the phrase available via <code>getRecordedPhrase()</code>).
	 */
	stop() {
		super.stop();
		//this._phraseMaker.reset();
	}

	/** @private */
	initialize(streamParams = {}) {
		super.initialize(streamParams);
		this._phraseMaker.config = { dimension: this.streamParams.frameSize };
		this._phraseMaker.reset();
	}

	/**
	 * Returns the latest recorded phrase.
	 */
	getRecordedPhrase() {
		return this._phraseMaker.phrase;
	}
}

export default PhraseRecorderLfo;