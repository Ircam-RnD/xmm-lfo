import * as lfo from 'waves-lfo';
import assert from 'assert';
import { HhmmDecoder } from 'xmm-client';

class HhmmDecoderLfo extends lfo.core.BaseLfo {
	constructor(options = {}) {
		const defaults = {
			model: undefined,
			likelihoodWindow: 1,
			ctx: undefined,
			callback: undefined
		}
		super(defaults, options);
		this._decoder = new HhmmDecoder(this.params.likelihoodWindow);
		this._results = null;
		this._callback = this.params.callback;
		//console.log(this._callback);
	}

	process(time, frame, metaData) {
		this.time = time;
		this.metaData = metaData;
		this._decoder.filter(frame, (err, res) => {
			//assert.equal(null, err);
			if (err == null) {
				this._results = res;
				for (let i = 0; i < this._decoder.nbClasses; i++) {
					this.outFrame[i] = res.likelihoods[i];
				}
				if (this._callback) {
					this._callback(res);
				}
			} else {
				console.error(err);
			}

			this.output();
		});
	}

	set model(model) {
		this._decoder.model = model;
		this.initialize({ frameSize: this._decoder.nbClasses });
	}

	set likelihoodWindow(windowSize) {
		this._decoder.likelihoodWindow = windowSize;
	}

	get filterResults() {
		return this._results;
	}
};

export default HhmmDecoderLfo;