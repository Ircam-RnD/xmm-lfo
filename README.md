# xmm-lfo
### waves-lfo wrappers of xmm-client classes

See [waves-lfo](https://github.com/wavesjs/waves-lfo) from the wavesjs library
and [xmm-client](https://github.com/Ircam-RnD/xmm-client).

#### installation :

`npm install [--save] Ircam-RnD/xmm-lfo`

#### es6 example :

```JavaScript
import * as lfo from 'waves-lfo';
import { PhraseRecorderLfo, HhmmRecorderLfo } from 'xmm-lfo';

const eventIn = new lfo.sources.EventIn({
	frameSize: 6,
	ctx: audioContext
});

const xmmRecorder = new PhraseRecorderLfo({
	column_names: [
    'accelX', 'accelY', 'accelZ',
    'rotAlpha', 'rotBeta', 'rotGamma'
  ],
  label: 'someGesture'
});

const hhmmDecoder = new HhmmDecoderLfo({
	likelihoodWindow: 3
});

eventIn.connect(xmmRecorder);
eventIn.connect(hhmmDecoder);

if (window.DeviceMotionEvent) {
	window.addEventListener('devicemotion', function(e) {
		eventIn.process(Date.now(), [
			e.acceleration.x, e.acceleration.y, e.acceleration.z,
			e.rotationRate.alpha, e.rotationRate.beta, e.rotationRate.gamma
		]);
	});
}

eventIn.start();

// to start / stop recording :
xmmRecorder.start();
xmmRecorder.stop();

// when stop() is called, a promise updates the internal phrase that can
// be obtained by calling getRecordedPhrase() :
let phrase = xmmRecorder.getRecordedPhrase();

// once a model has been trained by xmm-node from the recorded phrases, it can
// be passed to the decoder like this :
hhmmDecoder.model = someModelFromXmmNode;
```

#### credits :

This library has been developed by the ISMM team at IRCAM, within the context of the RAPID-MIX project, funded by the European Union’s Horizon 2020 research and innovation programme.  
Original XMM code authored by Jules Françoise, ported to JS and wrapped into LFO operators by Joseph Larralde.  
See [waves-lfo](https://github.com/wavejs/waves-lfo) for LFO credits.
