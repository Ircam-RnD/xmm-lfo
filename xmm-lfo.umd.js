(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.xmmLfo = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('waves-lfo/common/core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

var _xmmClient = require('xmm-client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  model: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'static' }
  },
  likelihoodWindow: {
    type: 'integer',
    default: 20,
    min: 1,
    max: 1e30
  },
  output: {
    type: 'enum',
    default: 'likelihoods',
    list: ['likelihoods', 'regression'],
    constant: true
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Lfo class loading GMM models created by the xmm library to process an input
 * stream of vectors (models must have been trained from the same input stream).
 * As the results of the classification / regression are more complex than a
 * simple vector, a callback function can be passed to the constructor to handle
 * them, or they can alternatively be queried via the readonly filterResults
 * property.
 *
 * @param {Object} options - Override defaults.
 * @param {Object} [options.model=null] - Model comming from ...
 * @param {Object} [options.likelihoodWindow=20] - Number of lilikelihood
 */

var GmmDecoderLfo = function (_BaseLfo) {
  (0, _inherits3.default)(GmmDecoderLfo, _BaseLfo);

  function GmmDecoderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, GmmDecoderLfo);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GmmDecoderLfo.__proto__ || (0, _getPrototypeOf2.default)(GmmDecoderLfo)).call(this, definitions, options));

    _this._decoder = new _xmmClient.GmmDecoder(_this.params.likelihoodWindow);
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(GmmDecoderLfo, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(GmmDecoderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(GmmDecoderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      if (name === 'likelihoodWindow') {
        this._decoder.likelihoodWindow = value;
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.prepareStreamParams(prevStreamParams);

      this._decoder.model = this.params.get('model');

      if (this.params.get('output') === 'likelihoods') {
        this.streamParams.frameSize = this._decoder.nbClasses;
      } else {
        // === 'regression'
        this.streamParams.frameSize = this._decoder.regressionSize;
      }

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      var _this2 = this;

      this._decoder.filter(frame, function (err, res) {
        var callback = _this2.params.get('callback');
        var resData = res.likelihoods;
        var data = _this2.frame.data;
        var frameSize = _this2.streamParams.frameSize;

        if (err == null) {
          for (var i = 0; i < frameSize; i++) {
            data[i] = resData[i];
          }

          if (callback) {
            callback(res);
          }
        }

        _this2.propagateFrame();
      });
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame(frame);
      this.processFunction(frame);
    }
  }]);
  return GmmDecoderLfo;
}(_BaseLfo3.default);

;

exports.default = GmmDecoderLfo;

},{"babel-runtime/core-js/object/get-prototype-of":12,"babel-runtime/helpers/classCallCheck":16,"babel-runtime/helpers/createClass":17,"babel-runtime/helpers/get":18,"babel-runtime/helpers/inherits":19,"babel-runtime/helpers/possibleConstructorReturn":20,"waves-lfo/common/core/BaseLfo":112,"xmm-client":115}],2:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('waves-lfo/common/core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

var _xmmClient = require('xmm-client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  model: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'static' }
  },
  likelihoodWindow: {
    type: 'integer',
    default: 20,
    min: 1,
    max: 1e30
  },
  output: {
    type: 'enum',
    default: 'likelihoods',
    list: ['likelihoods', 'regression'],
    constant: true
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Lfo class loading Hierarchical HMM models created by the xmm library to
 * process an input stream of vectors (models must have been trained from the
 * same input stream).
 * As the results of the classification / following / regression are more
 * complex than a simple vector, a callback function can be passed to the
 * constructor to handle them, or they can alternatively be queried via the
 * readonly filterResults property.
 * @class
 */

var HhmmDecoderLfo = function (_BaseLfo) {
  (0, _inherits3.default)(HhmmDecoderLfo, _BaseLfo);

  function HhmmDecoderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, HhmmDecoderLfo);

    var _this = (0, _possibleConstructorReturn3.default)(this, (HhmmDecoderLfo.__proto__ || (0, _getPrototypeOf2.default)(HhmmDecoderLfo)).call(this, definitions, options));

    _this._decoder = new _xmmClient.HhmmDecoder(_this.params.likelihoodWindow);
    return _this;
  }

  /**
   * Resets the intermediate results of the estimation.
   */


  (0, _createClass3.default)(HhmmDecoderLfo, [{
    key: 'reset',
    value: function reset() {
      this._decoder.reset();
    }

    /** @private */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(HhmmDecoderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(HhmmDecoderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      if (name === 'likelihoodWindow') {
        this._decoder.setLikelihoodWindow(value);
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.prepareStreamParams(prevStreamParams);

      this._decoder.model = this.params.get('model');

      if (this.params.get('output') === 'likelihoods') {
        this.streamParams.frameSize = this._decoder.nbClasses;
      } else {
        // === 'regression'
        this.streamParams.frameSize = this._decoder.regressionSize;
      }

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      var _this2 = this;

      this._decoder.filter(frame, function (err, res) {
        var callback = _this2.params.get('callback');
        var resData = res.likelihoods;
        var data = _this2.frame.data;
        var frameSize = _this2.streamParams.frameSize;

        if (err == null) {
          for (var i = 0; i < frameSize; i++) {
            data[i] = resData[i];
          }

          if (callback) {
            callback(res);
          }
        }

        _this2.propagateFrame();
      });
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame(frame);
      this.processFunction(frame);
    }
  }]);
  return HhmmDecoderLfo;
}(_BaseLfo3.default);

;

exports.default = HhmmDecoderLfo;

},{"babel-runtime/core-js/object/get-prototype-of":12,"babel-runtime/helpers/classCallCheck":16,"babel-runtime/helpers/createClass":17,"babel-runtime/helpers/get":18,"babel-runtime/helpers/inherits":19,"babel-runtime/helpers/possibleConstructorReturn":20,"waves-lfo/common/core/BaseLfo":112,"xmm-client":115}],3:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _possibleConstructorReturn2 = require('babel-runtime/helpers/possibleConstructorReturn');

var _possibleConstructorReturn3 = _interopRequireDefault(_possibleConstructorReturn2);

var _get2 = require('babel-runtime/helpers/get');

var _get3 = _interopRequireDefault(_get2);

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _BaseLfo2 = require('waves-lfo/common/core/BaseLfo');

var _BaseLfo3 = _interopRequireDefault(_BaseLfo2);

var _xmmClient = require('xmm-client');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var definitions = {
  bimodal: {
    type: 'boolean',
    default: false,
    constant: true
  },
  dimensionInput: {
    type: 'integer',
    default: 0,
    constant: true
  },
  columnNames: {
    type: 'any',
    default: [''],
    constant: true
  }
};

// uncomment this and add to other xmm-lfo's when lfo is exposed in /common as well
// or use client ? (it's very likely that we won't run these lfo's server-side)
// if (lfo.version < '1.0.0')
//  throw new Error('')

/**
 * Lfo class using PhraseMaker class from xmm-client
 * to record input data and format it for xmm-node.
 */

var PhraseRecorderLfo = function (_BaseLfo) {
  (0, _inherits3.default)(PhraseRecorderLfo, _BaseLfo);

  function PhraseRecorderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, PhraseRecorderLfo);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PhraseRecorderLfo.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorderLfo)).call(this, definitions, options));

    _this._phraseMaker = new _xmmClient.PhraseMaker({
      bimodal: _this.params.get('bimodal'),
      dimensionInput: _this.params.get('dimensionInput'),
      columnNames: _this.params.get('columnNames')
    });

    _this._isStarted = false;
    return _this;
  }

  /**
   * Get the current label of the last / currently being recorded phrase.
   * @returns {String}.
   */


  (0, _createClass3.default)(PhraseRecorderLfo, [{
    key: 'getPhraseLabel',
    value: function getPhraseLabel() {
      return this._phraseMaker.getConfig()['label'];
    }

    /**
     * Set the current label of the last / currently being recorded phrase.
     * @param {String} label - The label.
     */

  }, {
    key: 'setPhraseLabel',
    value: function setPhraseLabel(label) {
      this._phraseMaker.setConfig({ label: label });
    }

    /**
     * Return the latest recorded phrase.
     * @returns {XmmPhrase}
     */

  }, {
    key: 'getRecordedPhrase',
    value: function getRecordedPhrase() {
      // this.stop();
      return this._phraseMaker.getPhrase();
    }

    /**
     * Start recording a phrase from the input stream.
     */

  }, {
    key: 'start',
    value: function start() {
      this._phraseMaker.reset();
      this._isStarted = true;
    }

    /**
     * Stop the current recording.
     * (makes the phrase available via <code>getRecordedPhrase()</code>).
     */

  }, {
    key: 'stop',
    value: function stop() {
      this._isStarted = false;
    }

    /** @private */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(PhraseRecorderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      var config = {};
      config[name] = value;
      this._phraseMaker.setConfig(config);
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.prepareStreamParams(prevStreamParams);

      this._phraseMaker.setConfig({ dimension: this.streamParams.frameSize });
      this._phraseMaker.reset();

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      if (!this._isStarted) {
        return;
      }

      // const { data } = frame;
      var frameSize = this.streamParams.frameSize;
      var inData = frame.data;
      var outData = this.frame.data;

      for (var i = 0; i < frameSize; i++) {
        outData[i] = inData[i];
      }

      this._phraseMaker.addObservation(inData);
    }
  }]);
  return PhraseRecorderLfo;
}(_BaseLfo3.default);

exports.default = PhraseRecorderLfo;

},{"babel-runtime/core-js/object/get-prototype-of":12,"babel-runtime/helpers/classCallCheck":16,"babel-runtime/helpers/createClass":17,"babel-runtime/helpers/get":18,"babel-runtime/helpers/inherits":19,"babel-runtime/helpers/possibleConstructorReturn":20,"waves-lfo/common/core/BaseLfo":112,"xmm-client":115}],4:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _GmmDecoderLfo = require('./GmmDecoderLfo');

Object.defineProperty(exports, 'GmmDecoderLfo', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_GmmDecoderLfo).default;
  }
});

var _HhmmDecoderLfo = require('./HhmmDecoderLfo');

Object.defineProperty(exports, 'HhmmDecoderLfo', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_HhmmDecoderLfo).default;
  }
});

var _PhraseRecorderLfo = require('./PhraseRecorderLfo');

Object.defineProperty(exports, 'PhraseRecorderLfo', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_PhraseRecorderLfo).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./GmmDecoderLfo":1,"./HhmmDecoderLfo":2,"./PhraseRecorderLfo":3}],5:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/get-iterator"), __esModule: true };
},{"core-js/library/fn/get-iterator":22}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/json/stringify"), __esModule: true };
},{"core-js/library/fn/json/stringify":23}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/number/is-integer"), __esModule: true };
},{"core-js/library/fn/number/is-integer":24}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":25}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":26}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":27}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":28}],12:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":29}],13:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":30}],14:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":31}],15:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":32}],16:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],17:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _defineProperty = require("../core-js/object/define-property");

var _defineProperty2 = _interopRequireDefault(_defineProperty);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      (0, _defineProperty2.default)(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();
},{"../core-js/object/define-property":10}],18:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _getPrototypeOf = require("../core-js/object/get-prototype-of");

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _getOwnPropertyDescriptor = require("../core-js/object/get-own-property-descriptor");

var _getOwnPropertyDescriptor2 = _interopRequireDefault(_getOwnPropertyDescriptor);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function get(object, property, receiver) {
  if (object === null) object = Function.prototype;
  var desc = (0, _getOwnPropertyDescriptor2.default)(object, property);

  if (desc === undefined) {
    var parent = (0, _getPrototypeOf2.default)(object);

    if (parent === null) {
      return undefined;
    } else {
      return get(parent, property, receiver);
    }
  } else if ("value" in desc) {
    return desc.value;
  } else {
    var getter = desc.get;

    if (getter === undefined) {
      return undefined;
    }

    return getter.call(receiver);
  }
};
},{"../core-js/object/get-own-property-descriptor":11,"../core-js/object/get-prototype-of":12}],19:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _setPrototypeOf = require("../core-js/object/set-prototype-of");

var _setPrototypeOf2 = _interopRequireDefault(_setPrototypeOf);

var _create = require("../core-js/object/create");

var _create2 = _interopRequireDefault(_create);

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + (typeof superClass === "undefined" ? "undefined" : (0, _typeof3.default)(superClass)));
  }

  subClass.prototype = (0, _create2.default)(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) _setPrototypeOf2.default ? (0, _setPrototypeOf2.default)(subClass, superClass) : subClass.__proto__ = superClass;
};
},{"../core-js/object/create":9,"../core-js/object/set-prototype-of":13,"../helpers/typeof":21}],20:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _typeof2 = require("../helpers/typeof");

var _typeof3 = _interopRequireDefault(_typeof2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && ((typeof call === "undefined" ? "undefined" : (0, _typeof3.default)(call)) === "object" || typeof call === "function") ? call : self;
};
},{"../helpers/typeof":21}],21:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default && obj !== _symbol2.default.prototype ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":14,"../core-js/symbol/iterator":15}],22:[function(require,module,exports){
require('../modules/web.dom.iterable');
require('../modules/es6.string.iterator');
module.exports = require('../modules/core.get-iterator');
},{"../modules/core.get-iterator":95,"../modules/es6.string.iterator":105,"../modules/web.dom.iterable":109}],23:[function(require,module,exports){
var core  = require('../../modules/_core')
  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};
},{"../../modules/_core":39}],24:[function(require,module,exports){
require('../../modules/es6.number.is-integer');
module.exports = require('../../modules/_core').Number.isInteger;
},{"../../modules/_core":39,"../../modules/es6.number.is-integer":97}],25:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;
},{"../../modules/_core":39,"../../modules/es6.object.assign":98}],26:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};
},{"../../modules/_core":39,"../../modules/es6.object.create":99}],27:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":39,"../../modules/es6.object.define-property":100}],28:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-descriptor');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};
},{"../../modules/_core":39,"../../modules/es6.object.get-own-property-descriptor":101}],29:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;
},{"../../modules/_core":39,"../../modules/es6.object.get-prototype-of":102}],30:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;
},{"../../modules/_core":39,"../../modules/es6.object.set-prototype-of":103}],31:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;
},{"../../modules/_core":39,"../../modules/es6.object.to-string":104,"../../modules/es6.symbol":106,"../../modules/es7.symbol.async-iterator":107,"../../modules/es7.symbol.observable":108}],32:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');
},{"../../modules/_wks-ext":92,"../../modules/es6.string.iterator":105,"../../modules/web.dom.iterable":109}],33:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],34:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],35:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":56}],36:[function(require,module,exports){
// false -> Array#indexOf
// true  -> Array#includes
var toIObject = require('./_to-iobject')
  , toLength  = require('./_to-length')
  , toIndex   = require('./_to-index');
module.exports = function(IS_INCLUDES){
  return function($this, el, fromIndex){
    var O      = toIObject($this)
      , length = toLength(O.length)
      , index  = toIndex(fromIndex, length)
      , value;
    // Array#includes uses SameValueZero equality algorithm
    if(IS_INCLUDES && el != el)while(length > index){
      value = O[index++];
      if(value != value)return true;
    // Array#toIndex ignores holes, Array#includes - not
    } else for(;length > index; index++)if(IS_INCLUDES || index in O){
      if(O[index] === el)return IS_INCLUDES || index || 0;
    } return !IS_INCLUDES && -1;
  };
};
},{"./_to-index":84,"./_to-iobject":86,"./_to-length":87}],37:[function(require,module,exports){
// getting tag from 19.1.3.6 Object.prototype.toString()
var cof = require('./_cof')
  , TAG = require('./_wks')('toStringTag')
  // ES3 wrong here
  , ARG = cof(function(){ return arguments; }()) == 'Arguments';

// fallback for IE11 Script Access Denied error
var tryGet = function(it, key){
  try {
    return it[key];
  } catch(e){ /* empty */ }
};

module.exports = function(it){
  var O, T, B;
  return it === undefined ? 'Undefined' : it === null ? 'Null'
    // @@toStringTag case
    : typeof (T = tryGet(O = Object(it), TAG)) == 'string' ? T
    // builtinTag case
    : ARG ? cof(O)
    // ES3 arguments fallback
    : (B = cof(O)) == 'Object' && typeof O.callee == 'function' ? 'Arguments' : B;
};
},{"./_cof":38,"./_wks":93}],38:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],39:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],40:[function(require,module,exports){
// optional / simple context binding
var aFunction = require('./_a-function');
module.exports = function(fn, that, length){
  aFunction(fn);
  if(that === undefined)return fn;
  switch(length){
    case 1: return function(a){
      return fn.call(that, a);
    };
    case 2: return function(a, b){
      return fn.call(that, a, b);
    };
    case 3: return function(a, b, c){
      return fn.call(that, a, b, c);
    };
  }
  return function(/* ...args */){
    return fn.apply(that, arguments);
  };
};
},{"./_a-function":33}],41:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],42:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":47}],43:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":48,"./_is-object":56}],44:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],45:[function(require,module,exports){
// all enumerable object keys, includes symbols
var getKeys = require('./_object-keys')
  , gOPS    = require('./_object-gops')
  , pIE     = require('./_object-pie');
module.exports = function(it){
  var result     = getKeys(it)
    , getSymbols = gOPS.f;
  if(getSymbols){
    var symbols = getSymbols(it)
      , isEnum  = pIE.f
      , i       = 0
      , key;
    while(symbols.length > i)if(isEnum.call(it, key = symbols[i++]))result.push(key);
  } return result;
};
},{"./_object-gops":71,"./_object-keys":74,"./_object-pie":75}],46:[function(require,module,exports){
var global    = require('./_global')
  , core      = require('./_core')
  , ctx       = require('./_ctx')
  , hide      = require('./_hide')
  , PROTOTYPE = 'prototype';

var $export = function(type, name, source){
  var IS_FORCED = type & $export.F
    , IS_GLOBAL = type & $export.G
    , IS_STATIC = type & $export.S
    , IS_PROTO  = type & $export.P
    , IS_BIND   = type & $export.B
    , IS_WRAP   = type & $export.W
    , exports   = IS_GLOBAL ? core : core[name] || (core[name] = {})
    , expProto  = exports[PROTOTYPE]
    , target    = IS_GLOBAL ? global : IS_STATIC ? global[name] : (global[name] || {})[PROTOTYPE]
    , key, own, out;
  if(IS_GLOBAL)source = name;
  for(key in source){
    // contains in native
    own = !IS_FORCED && target && target[key] !== undefined;
    if(own && key in exports)continue;
    // export native or passed
    out = own ? target[key] : source[key];
    // prevent global pollution for namespaces
    exports[key] = IS_GLOBAL && typeof target[key] != 'function' ? source[key]
    // bind timers to global for call from export context
    : IS_BIND && own ? ctx(out, global)
    // wrap global constructors for prevent change them in library
    : IS_WRAP && target[key] == out ? (function(C){
      var F = function(a, b, c){
        if(this instanceof C){
          switch(arguments.length){
            case 0: return new C;
            case 1: return new C(a);
            case 2: return new C(a, b);
          } return new C(a, b, c);
        } return C.apply(this, arguments);
      };
      F[PROTOTYPE] = C[PROTOTYPE];
      return F;
    // make static versions for prototype methods
    })(out) : IS_PROTO && typeof out == 'function' ? ctx(Function.call, out) : out;
    // export proto methods to core.%CONSTRUCTOR%.methods.%NAME%
    if(IS_PROTO){
      (exports.virtual || (exports.virtual = {}))[key] = out;
      // export proto methods to core.%CONSTRUCTOR%.prototype.%NAME%
      if(type & $export.R && expProto && !expProto[key])hide(expProto, key, out);
    }
  }
};
// type bitmap
$export.F = 1;   // forced
$export.G = 2;   // global
$export.S = 4;   // static
$export.P = 8;   // proto
$export.B = 16;  // bind
$export.W = 32;  // wrap
$export.U = 64;  // safe
$export.R = 128; // real proto method for `library` 
module.exports = $export;
},{"./_core":39,"./_ctx":40,"./_global":48,"./_hide":50}],47:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],48:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],49:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],50:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":42,"./_object-dp":66,"./_property-desc":77}],51:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":48}],52:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":42,"./_dom-create":43,"./_fails":47}],53:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":38}],54:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":38}],55:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":56}],56:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],57:[function(require,module,exports){
'use strict';
var create         = require('./_object-create')
  , descriptor     = require('./_property-desc')
  , setToStringTag = require('./_set-to-string-tag')
  , IteratorPrototype = {};

// 25.1.2.1.1 %IteratorPrototype%[@@iterator]()
require('./_hide')(IteratorPrototype, require('./_wks')('iterator'), function(){ return this; });

module.exports = function(Constructor, NAME, next){
  Constructor.prototype = create(IteratorPrototype, {next: descriptor(1, next)});
  setToStringTag(Constructor, NAME + ' Iterator');
};
},{"./_hide":50,"./_object-create":65,"./_property-desc":77,"./_set-to-string-tag":80,"./_wks":93}],58:[function(require,module,exports){
'use strict';
var LIBRARY        = require('./_library')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , hide           = require('./_hide')
  , has            = require('./_has')
  , Iterators      = require('./_iterators')
  , $iterCreate    = require('./_iter-create')
  , setToStringTag = require('./_set-to-string-tag')
  , getPrototypeOf = require('./_object-gpo')
  , ITERATOR       = require('./_wks')('iterator')
  , BUGGY          = !([].keys && 'next' in [].keys()) // Safari has buggy iterators w/o `next`
  , FF_ITERATOR    = '@@iterator'
  , KEYS           = 'keys'
  , VALUES         = 'values';

var returnThis = function(){ return this; };

module.exports = function(Base, NAME, Constructor, next, DEFAULT, IS_SET, FORCED){
  $iterCreate(Constructor, NAME, next);
  var getMethod = function(kind){
    if(!BUGGY && kind in proto)return proto[kind];
    switch(kind){
      case KEYS: return function keys(){ return new Constructor(this, kind); };
      case VALUES: return function values(){ return new Constructor(this, kind); };
    } return function entries(){ return new Constructor(this, kind); };
  };
  var TAG        = NAME + ' Iterator'
    , DEF_VALUES = DEFAULT == VALUES
    , VALUES_BUG = false
    , proto      = Base.prototype
    , $native    = proto[ITERATOR] || proto[FF_ITERATOR] || DEFAULT && proto[DEFAULT]
    , $default   = $native || getMethod(DEFAULT)
    , $entries   = DEFAULT ? !DEF_VALUES ? $default : getMethod('entries') : undefined
    , $anyNative = NAME == 'Array' ? proto.entries || $native : $native
    , methods, key, IteratorPrototype;
  // Fix native
  if($anyNative){
    IteratorPrototype = getPrototypeOf($anyNative.call(new Base));
    if(IteratorPrototype !== Object.prototype){
      // Set @@toStringTag to native iterators
      setToStringTag(IteratorPrototype, TAG, true);
      // fix for some old engines
      if(!LIBRARY && !has(IteratorPrototype, ITERATOR))hide(IteratorPrototype, ITERATOR, returnThis);
    }
  }
  // fix Array#{values, @@iterator}.name in V8 / FF
  if(DEF_VALUES && $native && $native.name !== VALUES){
    VALUES_BUG = true;
    $default = function values(){ return $native.call(this); };
  }
  // Define iterator
  if((!LIBRARY || FORCED) && (BUGGY || VALUES_BUG || !proto[ITERATOR])){
    hide(proto, ITERATOR, $default);
  }
  // Plug for library
  Iterators[NAME] = $default;
  Iterators[TAG]  = returnThis;
  if(DEFAULT){
    methods = {
      values:  DEF_VALUES ? $default : getMethod(VALUES),
      keys:    IS_SET     ? $default : getMethod(KEYS),
      entries: $entries
    };
    if(FORCED)for(key in methods){
      if(!(key in proto))redefine(proto, key, methods[key]);
    } else $export($export.P + $export.F * (BUGGY || VALUES_BUG), NAME, methods);
  }
  return methods;
};
},{"./_export":46,"./_has":49,"./_hide":50,"./_iter-create":57,"./_iterators":60,"./_library":62,"./_object-gpo":72,"./_redefine":78,"./_set-to-string-tag":80,"./_wks":93}],59:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],60:[function(require,module,exports){
module.exports = {};
},{}],61:[function(require,module,exports){
var getKeys   = require('./_object-keys')
  , toIObject = require('./_to-iobject');
module.exports = function(object, el){
  var O      = toIObject(object)
    , keys   = getKeys(O)
    , length = keys.length
    , index  = 0
    , key;
  while(length > index)if(O[key = keys[index++]] === el)return key;
};
},{"./_object-keys":74,"./_to-iobject":86}],62:[function(require,module,exports){
module.exports = true;
},{}],63:[function(require,module,exports){
var META     = require('./_uid')('meta')
  , isObject = require('./_is-object')
  , has      = require('./_has')
  , setDesc  = require('./_object-dp').f
  , id       = 0;
var isExtensible = Object.isExtensible || function(){
  return true;
};
var FREEZE = !require('./_fails')(function(){
  return isExtensible(Object.preventExtensions({}));
});
var setMeta = function(it){
  setDesc(it, META, {value: {
    i: 'O' + ++id, // object ID
    w: {}          // weak collections IDs
  }});
};
var fastKey = function(it, create){
  // return primitive with prefix
  if(!isObject(it))return typeof it == 'symbol' ? it : (typeof it == 'string' ? 'S' : 'P') + it;
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return 'F';
    // not necessary to add metadata
    if(!create)return 'E';
    // add missing metadata
    setMeta(it);
  // return object ID
  } return it[META].i;
};
var getWeak = function(it, create){
  if(!has(it, META)){
    // can't set metadata to uncaught frozen object
    if(!isExtensible(it))return true;
    // not necessary to add metadata
    if(!create)return false;
    // add missing metadata
    setMeta(it);
  // return hash weak collections IDs
  } return it[META].w;
};
// add metadata on freeze-family methods calling
var onFreeze = function(it){
  if(FREEZE && meta.NEED && isExtensible(it) && !has(it, META))setMeta(it);
  return it;
};
var meta = module.exports = {
  KEY:      META,
  NEED:     false,
  fastKey:  fastKey,
  getWeak:  getWeak,
  onFreeze: onFreeze
};
},{"./_fails":47,"./_has":49,"./_is-object":56,"./_object-dp":66,"./_uid":90}],64:[function(require,module,exports){
'use strict';
// 19.1.2.1 Object.assign(target, source, ...)
var getKeys  = require('./_object-keys')
  , gOPS     = require('./_object-gops')
  , pIE      = require('./_object-pie')
  , toObject = require('./_to-object')
  , IObject  = require('./_iobject')
  , $assign  = Object.assign;

// should work with symbols and should have deterministic property order (V8 bug)
module.exports = !$assign || require('./_fails')(function(){
  var A = {}
    , B = {}
    , S = Symbol()
    , K = 'abcdefghijklmnopqrst';
  A[S] = 7;
  K.split('').forEach(function(k){ B[k] = k; });
  return $assign({}, A)[S] != 7 || Object.keys($assign({}, B)).join('') != K;
}) ? function assign(target, source){ // eslint-disable-line no-unused-vars
  var T     = toObject(target)
    , aLen  = arguments.length
    , index = 1
    , getSymbols = gOPS.f
    , isEnum     = pIE.f;
  while(aLen > index){
    var S      = IObject(arguments[index++])
      , keys   = getSymbols ? getKeys(S).concat(getSymbols(S)) : getKeys(S)
      , length = keys.length
      , j      = 0
      , key;
    while(length > j)if(isEnum.call(S, key = keys[j++]))T[key] = S[key];
  } return T;
} : $assign;
},{"./_fails":47,"./_iobject":53,"./_object-gops":71,"./_object-keys":74,"./_object-pie":75,"./_to-object":88}],65:[function(require,module,exports){
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
var anObject    = require('./_an-object')
  , dPs         = require('./_object-dps')
  , enumBugKeys = require('./_enum-bug-keys')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , Empty       = function(){ /* empty */ }
  , PROTOTYPE   = 'prototype';

// Create object with fake `null` prototype: use iframe Object with cleared prototype
var createDict = function(){
  // Thrash, waste and sodomy: IE GC bug
  var iframe = require('./_dom-create')('iframe')
    , i      = enumBugKeys.length
    , lt     = '<'
    , gt     = '>'
    , iframeDocument;
  iframe.style.display = 'none';
  require('./_html').appendChild(iframe);
  iframe.src = 'javascript:'; // eslint-disable-line no-script-url
  // createDict = iframe.contentWindow.Object;
  // html.removeChild(iframe);
  iframeDocument = iframe.contentWindow.document;
  iframeDocument.open();
  iframeDocument.write(lt + 'script' + gt + 'document.F=Object' + lt + '/script' + gt);
  iframeDocument.close();
  createDict = iframeDocument.F;
  while(i--)delete createDict[PROTOTYPE][enumBugKeys[i]];
  return createDict();
};

module.exports = Object.create || function create(O, Properties){
  var result;
  if(O !== null){
    Empty[PROTOTYPE] = anObject(O);
    result = new Empty;
    Empty[PROTOTYPE] = null;
    // add "__proto__" for Object.getPrototypeOf polyfill
    result[IE_PROTO] = O;
  } else result = createDict();
  return Properties === undefined ? result : dPs(result, Properties);
};

},{"./_an-object":35,"./_dom-create":43,"./_enum-bug-keys":44,"./_html":51,"./_object-dps":67,"./_shared-key":81}],66:[function(require,module,exports){
var anObject       = require('./_an-object')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , toPrimitive    = require('./_to-primitive')
  , dP             = Object.defineProperty;

exports.f = require('./_descriptors') ? Object.defineProperty : function defineProperty(O, P, Attributes){
  anObject(O);
  P = toPrimitive(P, true);
  anObject(Attributes);
  if(IE8_DOM_DEFINE)try {
    return dP(O, P, Attributes);
  } catch(e){ /* empty */ }
  if('get' in Attributes || 'set' in Attributes)throw TypeError('Accessors not supported!');
  if('value' in Attributes)O[P] = Attributes.value;
  return O;
};
},{"./_an-object":35,"./_descriptors":42,"./_ie8-dom-define":52,"./_to-primitive":89}],67:[function(require,module,exports){
var dP       = require('./_object-dp')
  , anObject = require('./_an-object')
  , getKeys  = require('./_object-keys');

module.exports = require('./_descriptors') ? Object.defineProperties : function defineProperties(O, Properties){
  anObject(O);
  var keys   = getKeys(Properties)
    , length = keys.length
    , i = 0
    , P;
  while(length > i)dP.f(O, P = keys[i++], Properties[P]);
  return O;
};
},{"./_an-object":35,"./_descriptors":42,"./_object-dp":66,"./_object-keys":74}],68:[function(require,module,exports){
var pIE            = require('./_object-pie')
  , createDesc     = require('./_property-desc')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , has            = require('./_has')
  , IE8_DOM_DEFINE = require('./_ie8-dom-define')
  , gOPD           = Object.getOwnPropertyDescriptor;

exports.f = require('./_descriptors') ? gOPD : function getOwnPropertyDescriptor(O, P){
  O = toIObject(O);
  P = toPrimitive(P, true);
  if(IE8_DOM_DEFINE)try {
    return gOPD(O, P);
  } catch(e){ /* empty */ }
  if(has(O, P))return createDesc(!pIE.f.call(O, P), O[P]);
};
},{"./_descriptors":42,"./_has":49,"./_ie8-dom-define":52,"./_object-pie":75,"./_property-desc":77,"./_to-iobject":86,"./_to-primitive":89}],69:[function(require,module,exports){
// fallback for IE11 buggy Object.getOwnPropertyNames with iframe and window
var toIObject = require('./_to-iobject')
  , gOPN      = require('./_object-gopn').f
  , toString  = {}.toString;

var windowNames = typeof window == 'object' && window && Object.getOwnPropertyNames
  ? Object.getOwnPropertyNames(window) : [];

var getWindowNames = function(it){
  try {
    return gOPN(it);
  } catch(e){
    return windowNames.slice();
  }
};

module.exports.f = function getOwnPropertyNames(it){
  return windowNames && toString.call(it) == '[object Window]' ? getWindowNames(it) : gOPN(toIObject(it));
};

},{"./_object-gopn":70,"./_to-iobject":86}],70:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":44,"./_object-keys-internal":73}],71:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],72:[function(require,module,exports){
// 19.1.2.9 / 15.2.3.2 Object.getPrototypeOf(O)
var has         = require('./_has')
  , toObject    = require('./_to-object')
  , IE_PROTO    = require('./_shared-key')('IE_PROTO')
  , ObjectProto = Object.prototype;

module.exports = Object.getPrototypeOf || function(O){
  O = toObject(O);
  if(has(O, IE_PROTO))return O[IE_PROTO];
  if(typeof O.constructor == 'function' && O instanceof O.constructor){
    return O.constructor.prototype;
  } return O instanceof Object ? ObjectProto : null;
};
},{"./_has":49,"./_shared-key":81,"./_to-object":88}],73:[function(require,module,exports){
var has          = require('./_has')
  , toIObject    = require('./_to-iobject')
  , arrayIndexOf = require('./_array-includes')(false)
  , IE_PROTO     = require('./_shared-key')('IE_PROTO');

module.exports = function(object, names){
  var O      = toIObject(object)
    , i      = 0
    , result = []
    , key;
  for(key in O)if(key != IE_PROTO)has(O, key) && result.push(key);
  // Don't enum bug & hidden keys
  while(names.length > i)if(has(O, key = names[i++])){
    ~arrayIndexOf(result, key) || result.push(key);
  }
  return result;
};
},{"./_array-includes":36,"./_has":49,"./_shared-key":81,"./_to-iobject":86}],74:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":44,"./_object-keys-internal":73}],75:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],76:[function(require,module,exports){
// most Object methods by ES6 should accept primitives
var $export = require('./_export')
  , core    = require('./_core')
  , fails   = require('./_fails');
module.exports = function(KEY, exec){
  var fn  = (core.Object || {})[KEY] || Object[KEY]
    , exp = {};
  exp[KEY] = exec(fn);
  $export($export.S + $export.F * fails(function(){ fn(1); }), 'Object', exp);
};
},{"./_core":39,"./_export":46,"./_fails":47}],77:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],78:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":50}],79:[function(require,module,exports){
// Works with __proto__ only. Old v8 can't work with null proto objects.
/* eslint-disable no-proto */
var isObject = require('./_is-object')
  , anObject = require('./_an-object');
var check = function(O, proto){
  anObject(O);
  if(!isObject(proto) && proto !== null)throw TypeError(proto + ": can't set as prototype!");
};
module.exports = {
  set: Object.setPrototypeOf || ('__proto__' in {} ? // eslint-disable-line
    function(test, buggy, set){
      try {
        set = require('./_ctx')(Function.call, require('./_object-gopd').f(Object.prototype, '__proto__').set, 2);
        set(test, []);
        buggy = !(test instanceof Array);
      } catch(e){ buggy = true; }
      return function setPrototypeOf(O, proto){
        check(O, proto);
        if(buggy)O.__proto__ = proto;
        else set(O, proto);
        return O;
      };
    }({}, false) : undefined),
  check: check
};
},{"./_an-object":35,"./_ctx":40,"./_is-object":56,"./_object-gopd":68}],80:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":49,"./_object-dp":66,"./_wks":93}],81:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":82,"./_uid":90}],82:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":48}],83:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , defined   = require('./_defined');
// true  -> String#at
// false -> String#codePointAt
module.exports = function(TO_STRING){
  return function(that, pos){
    var s = String(defined(that))
      , i = toInteger(pos)
      , l = s.length
      , a, b;
    if(i < 0 || i >= l)return TO_STRING ? '' : undefined;
    a = s.charCodeAt(i);
    return a < 0xd800 || a > 0xdbff || i + 1 === l || (b = s.charCodeAt(i + 1)) < 0xdc00 || b > 0xdfff
      ? TO_STRING ? s.charAt(i) : a
      : TO_STRING ? s.slice(i, i + 2) : (a - 0xd800 << 10) + (b - 0xdc00) + 0x10000;
  };
};
},{"./_defined":41,"./_to-integer":85}],84:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":85}],85:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],86:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":41,"./_iobject":53}],87:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":85}],88:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":41}],89:[function(require,module,exports){
// 7.1.1 ToPrimitive(input [, PreferredType])
var isObject = require('./_is-object');
// instead of the ES6 spec version, we didn't implement @@toPrimitive case
// and the second argument - flag - preferred type is a string
module.exports = function(it, S){
  if(!isObject(it))return it;
  var fn, val;
  if(S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  if(typeof (fn = it.valueOf) == 'function' && !isObject(val = fn.call(it)))return val;
  if(!S && typeof (fn = it.toString) == 'function' && !isObject(val = fn.call(it)))return val;
  throw TypeError("Can't convert object to primitive value");
};
},{"./_is-object":56}],90:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],91:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":39,"./_global":48,"./_library":62,"./_object-dp":66,"./_wks-ext":92}],92:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":93}],93:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":48,"./_shared":82,"./_uid":90}],94:[function(require,module,exports){
var classof   = require('./_classof')
  , ITERATOR  = require('./_wks')('iterator')
  , Iterators = require('./_iterators');
module.exports = require('./_core').getIteratorMethod = function(it){
  if(it != undefined)return it[ITERATOR]
    || it['@@iterator']
    || Iterators[classof(it)];
};
},{"./_classof":37,"./_core":39,"./_iterators":60,"./_wks":93}],95:[function(require,module,exports){
var anObject = require('./_an-object')
  , get      = require('./core.get-iterator-method');
module.exports = require('./_core').getIterator = function(it){
  var iterFn = get(it);
  if(typeof iterFn != 'function')throw TypeError(it + ' is not iterable!');
  return anObject(iterFn.call(it));
};
},{"./_an-object":35,"./_core":39,"./core.get-iterator-method":94}],96:[function(require,module,exports){
'use strict';
var addToUnscopables = require('./_add-to-unscopables')
  , step             = require('./_iter-step')
  , Iterators        = require('./_iterators')
  , toIObject        = require('./_to-iobject');

// 22.1.3.4 Array.prototype.entries()
// 22.1.3.13 Array.prototype.keys()
// 22.1.3.29 Array.prototype.values()
// 22.1.3.30 Array.prototype[@@iterator]()
module.exports = require('./_iter-define')(Array, 'Array', function(iterated, kind){
  this._t = toIObject(iterated); // target
  this._i = 0;                   // next index
  this._k = kind;                // kind
// 22.1.5.2.1 %ArrayIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , kind  = this._k
    , index = this._i++;
  if(!O || index >= O.length){
    this._t = undefined;
    return step(1);
  }
  if(kind == 'keys'  )return step(0, index);
  if(kind == 'values')return step(0, O[index]);
  return step(0, [index, O[index]]);
}, 'values');

// argumentsList[@@iterator] is %ArrayProto_values% (9.4.4.6, 9.4.4.7)
Iterators.Arguments = Iterators.Array;

addToUnscopables('keys');
addToUnscopables('values');
addToUnscopables('entries');
},{"./_add-to-unscopables":34,"./_iter-define":58,"./_iter-step":59,"./_iterators":60,"./_to-iobject":86}],97:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":46,"./_is-integer":55}],98:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":46,"./_object-assign":64}],99:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":46,"./_object-create":65}],100:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":42,"./_export":46,"./_object-dp":66}],101:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":68,"./_object-sap":76,"./_to-iobject":86}],102:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":72,"./_object-sap":76,"./_to-object":88}],103:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":46,"./_set-proto":79}],104:[function(require,module,exports){

},{}],105:[function(require,module,exports){
'use strict';
var $at  = require('./_string-at')(true);

// 21.1.3.27 String.prototype[@@iterator]()
require('./_iter-define')(String, 'String', function(iterated){
  this._t = String(iterated); // target
  this._i = 0;                // next index
// 21.1.5.2.1 %StringIteratorPrototype%.next()
}, function(){
  var O     = this._t
    , index = this._i
    , point;
  if(index >= O.length)return {value: undefined, done: true};
  point = $at(O, index);
  this._i += point.length;
  return {value: point, done: false};
});
},{"./_iter-define":58,"./_string-at":83}],106:[function(require,module,exports){
'use strict';
// ECMAScript 6 symbols shim
var global         = require('./_global')
  , has            = require('./_has')
  , DESCRIPTORS    = require('./_descriptors')
  , $export        = require('./_export')
  , redefine       = require('./_redefine')
  , META           = require('./_meta').KEY
  , $fails         = require('./_fails')
  , shared         = require('./_shared')
  , setToStringTag = require('./_set-to-string-tag')
  , uid            = require('./_uid')
  , wks            = require('./_wks')
  , wksExt         = require('./_wks-ext')
  , wksDefine      = require('./_wks-define')
  , keyOf          = require('./_keyof')
  , enumKeys       = require('./_enum-keys')
  , isArray        = require('./_is-array')
  , anObject       = require('./_an-object')
  , toIObject      = require('./_to-iobject')
  , toPrimitive    = require('./_to-primitive')
  , createDesc     = require('./_property-desc')
  , _create        = require('./_object-create')
  , gOPNExt        = require('./_object-gopn-ext')
  , $GOPD          = require('./_object-gopd')
  , $DP            = require('./_object-dp')
  , $keys          = require('./_object-keys')
  , gOPD           = $GOPD.f
  , dP             = $DP.f
  , gOPN           = gOPNExt.f
  , $Symbol        = global.Symbol
  , $JSON          = global.JSON
  , _stringify     = $JSON && $JSON.stringify
  , PROTOTYPE      = 'prototype'
  , HIDDEN         = wks('_hidden')
  , TO_PRIMITIVE   = wks('toPrimitive')
  , isEnum         = {}.propertyIsEnumerable
  , SymbolRegistry = shared('symbol-registry')
  , AllSymbols     = shared('symbols')
  , OPSymbols      = shared('op-symbols')
  , ObjectProto    = Object[PROTOTYPE]
  , USE_NATIVE     = typeof $Symbol == 'function'
  , QObject        = global.QObject;
// Don't use setters in Qt Script, https://github.com/zloirock/core-js/issues/173
var setter = !QObject || !QObject[PROTOTYPE] || !QObject[PROTOTYPE].findChild;

// fallback for old Android, https://code.google.com/p/v8/issues/detail?id=687
var setSymbolDesc = DESCRIPTORS && $fails(function(){
  return _create(dP({}, 'a', {
    get: function(){ return dP(this, 'a', {value: 7}).a; }
  })).a != 7;
}) ? function(it, key, D){
  var protoDesc = gOPD(ObjectProto, key);
  if(protoDesc)delete ObjectProto[key];
  dP(it, key, D);
  if(protoDesc && it !== ObjectProto)dP(ObjectProto, key, protoDesc);
} : dP;

var wrap = function(tag){
  var sym = AllSymbols[tag] = _create($Symbol[PROTOTYPE]);
  sym._k = tag;
  return sym;
};

var isSymbol = USE_NATIVE && typeof $Symbol.iterator == 'symbol' ? function(it){
  return typeof it == 'symbol';
} : function(it){
  return it instanceof $Symbol;
};

var $defineProperty = function defineProperty(it, key, D){
  if(it === ObjectProto)$defineProperty(OPSymbols, key, D);
  anObject(it);
  key = toPrimitive(key, true);
  anObject(D);
  if(has(AllSymbols, key)){
    if(!D.enumerable){
      if(!has(it, HIDDEN))dP(it, HIDDEN, createDesc(1, {}));
      it[HIDDEN][key] = true;
    } else {
      if(has(it, HIDDEN) && it[HIDDEN][key])it[HIDDEN][key] = false;
      D = _create(D, {enumerable: createDesc(0, false)});
    } return setSymbolDesc(it, key, D);
  } return dP(it, key, D);
};
var $defineProperties = function defineProperties(it, P){
  anObject(it);
  var keys = enumKeys(P = toIObject(P))
    , i    = 0
    , l = keys.length
    , key;
  while(l > i)$defineProperty(it, key = keys[i++], P[key]);
  return it;
};
var $create = function create(it, P){
  return P === undefined ? _create(it) : $defineProperties(_create(it), P);
};
var $propertyIsEnumerable = function propertyIsEnumerable(key){
  var E = isEnum.call(this, key = toPrimitive(key, true));
  if(this === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return false;
  return E || !has(this, key) || !has(AllSymbols, key) || has(this, HIDDEN) && this[HIDDEN][key] ? E : true;
};
var $getOwnPropertyDescriptor = function getOwnPropertyDescriptor(it, key){
  it  = toIObject(it);
  key = toPrimitive(key, true);
  if(it === ObjectProto && has(AllSymbols, key) && !has(OPSymbols, key))return;
  var D = gOPD(it, key);
  if(D && has(AllSymbols, key) && !(has(it, HIDDEN) && it[HIDDEN][key]))D.enumerable = true;
  return D;
};
var $getOwnPropertyNames = function getOwnPropertyNames(it){
  var names  = gOPN(toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(!has(AllSymbols, key = names[i++]) && key != HIDDEN && key != META)result.push(key);
  } return result;
};
var $getOwnPropertySymbols = function getOwnPropertySymbols(it){
  var IS_OP  = it === ObjectProto
    , names  = gOPN(IS_OP ? OPSymbols : toIObject(it))
    , result = []
    , i      = 0
    , key;
  while(names.length > i){
    if(has(AllSymbols, key = names[i++]) && (IS_OP ? has(ObjectProto, key) : true))result.push(AllSymbols[key]);
  } return result;
};

// 19.4.1.1 Symbol([description])
if(!USE_NATIVE){
  $Symbol = function Symbol(){
    if(this instanceof $Symbol)throw TypeError('Symbol is not a constructor!');
    var tag = uid(arguments.length > 0 ? arguments[0] : undefined);
    var $set = function(value){
      if(this === ObjectProto)$set.call(OPSymbols, value);
      if(has(this, HIDDEN) && has(this[HIDDEN], tag))this[HIDDEN][tag] = false;
      setSymbolDesc(this, tag, createDesc(1, value));
    };
    if(DESCRIPTORS && setter)setSymbolDesc(ObjectProto, tag, {configurable: true, set: $set});
    return wrap(tag);
  };
  redefine($Symbol[PROTOTYPE], 'toString', function toString(){
    return this._k;
  });

  $GOPD.f = $getOwnPropertyDescriptor;
  $DP.f   = $defineProperty;
  require('./_object-gopn').f = gOPNExt.f = $getOwnPropertyNames;
  require('./_object-pie').f  = $propertyIsEnumerable;
  require('./_object-gops').f = $getOwnPropertySymbols;

  if(DESCRIPTORS && !require('./_library')){
    redefine(ObjectProto, 'propertyIsEnumerable', $propertyIsEnumerable, true);
  }

  wksExt.f = function(name){
    return wrap(wks(name));
  }
}

$export($export.G + $export.W + $export.F * !USE_NATIVE, {Symbol: $Symbol});

for(var symbols = (
  // 19.4.2.2, 19.4.2.3, 19.4.2.4, 19.4.2.6, 19.4.2.8, 19.4.2.9, 19.4.2.10, 19.4.2.11, 19.4.2.12, 19.4.2.13, 19.4.2.14
  'hasInstance,isConcatSpreadable,iterator,match,replace,search,species,split,toPrimitive,toStringTag,unscopables'
).split(','), i = 0; symbols.length > i; )wks(symbols[i++]);

for(var symbols = $keys(wks.store), i = 0; symbols.length > i; )wksDefine(symbols[i++]);

$export($export.S + $export.F * !USE_NATIVE, 'Symbol', {
  // 19.4.2.1 Symbol.for(key)
  'for': function(key){
    return has(SymbolRegistry, key += '')
      ? SymbolRegistry[key]
      : SymbolRegistry[key] = $Symbol(key);
  },
  // 19.4.2.5 Symbol.keyFor(sym)
  keyFor: function keyFor(key){
    if(isSymbol(key))return keyOf(SymbolRegistry, key);
    throw TypeError(key + ' is not a symbol!');
  },
  useSetter: function(){ setter = true; },
  useSimple: function(){ setter = false; }
});

$export($export.S + $export.F * !USE_NATIVE, 'Object', {
  // 19.1.2.2 Object.create(O [, Properties])
  create: $create,
  // 19.1.2.4 Object.defineProperty(O, P, Attributes)
  defineProperty: $defineProperty,
  // 19.1.2.3 Object.defineProperties(O, Properties)
  defineProperties: $defineProperties,
  // 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
  getOwnPropertyDescriptor: $getOwnPropertyDescriptor,
  // 19.1.2.7 Object.getOwnPropertyNames(O)
  getOwnPropertyNames: $getOwnPropertyNames,
  // 19.1.2.8 Object.getOwnPropertySymbols(O)
  getOwnPropertySymbols: $getOwnPropertySymbols
});

// 24.3.2 JSON.stringify(value [, replacer [, space]])
$JSON && $export($export.S + $export.F * (!USE_NATIVE || $fails(function(){
  var S = $Symbol();
  // MS Edge converts symbol values to JSON as {}
  // WebKit converts symbol values to JSON as null
  // V8 throws on boxed symbols
  return _stringify([S]) != '[null]' || _stringify({a: S}) != '{}' || _stringify(Object(S)) != '{}';
})), 'JSON', {
  stringify: function stringify(it){
    if(it === undefined || isSymbol(it))return; // IE8 returns string on undefined
    var args = [it]
      , i    = 1
      , replacer, $replacer;
    while(arguments.length > i)args.push(arguments[i++]);
    replacer = args[1];
    if(typeof replacer == 'function')$replacer = replacer;
    if($replacer || !isArray(replacer))replacer = function(key, value){
      if($replacer)value = $replacer.call(this, key, value);
      if(!isSymbol(value))return value;
    };
    args[1] = replacer;
    return _stringify.apply($JSON, args);
  }
});

// 19.4.3.4 Symbol.prototype[@@toPrimitive](hint)
$Symbol[PROTOTYPE][TO_PRIMITIVE] || require('./_hide')($Symbol[PROTOTYPE], TO_PRIMITIVE, $Symbol[PROTOTYPE].valueOf);
// 19.4.3.5 Symbol.prototype[@@toStringTag]
setToStringTag($Symbol, 'Symbol');
// 20.2.1.9 Math[@@toStringTag]
setToStringTag(Math, 'Math', true);
// 24.3.3 JSON[@@toStringTag]
setToStringTag(global.JSON, 'JSON', true);
},{"./_an-object":35,"./_descriptors":42,"./_enum-keys":45,"./_export":46,"./_fails":47,"./_global":48,"./_has":49,"./_hide":50,"./_is-array":54,"./_keyof":61,"./_library":62,"./_meta":63,"./_object-create":65,"./_object-dp":66,"./_object-gopd":68,"./_object-gopn":70,"./_object-gopn-ext":69,"./_object-gops":71,"./_object-keys":74,"./_object-pie":75,"./_property-desc":77,"./_redefine":78,"./_set-to-string-tag":80,"./_shared":82,"./_to-iobject":86,"./_to-primitive":89,"./_uid":90,"./_wks":93,"./_wks-define":91,"./_wks-ext":92}],107:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":91}],108:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":91}],109:[function(require,module,exports){
require('./es6.array.iterator');
var global        = require('./_global')
  , hide          = require('./_hide')
  , Iterators     = require('./_iterators')
  , TO_STRING_TAG = require('./_wks')('toStringTag');

for(var collections = ['NodeList', 'DOMTokenList', 'MediaList', 'StyleSheetList', 'CSSRuleList'], i = 0; i < 5; i++){
  var NAME       = collections[i]
    , Collection = global[NAME]
    , proto      = Collection && Collection.prototype;
  if(proto && !proto[TO_STRING_TAG])hide(proto, TO_STRING_TAG, NAME);
  Iterators[NAME] = Iterators.Array;
}
},{"./_global":48,"./_hide":50,"./_iterators":60,"./_wks":93,"./es6.array.iterator":96}],110:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
var min = Math.min;
var max = Math.max;

function clip(value) {
  var lower = arguments.length <= 1 || arguments[1] === undefined ? -Infinity : arguments[1];
  var upper = arguments.length <= 2 || arguments[2] === undefined ? +Infinity : arguments[2];

  return max(lower, min(upper, value));
}

/**
 * Dictionnary of the available types. Each key correspond to the type of the
 * implemented param while the corresponding object value should the
 * {@link `paramDefinition`} of the defined type.
 *
 * typedef {Object} paramTemplates
 * @type {Object<String, paramTemplate>}
 */

/**
 * Definition of a parameter. The definition should at least contain the entries
 * `type` and `default`. Every parameter can also accept optionnal configuration
 * entries `constant` and `metas`.
 * Available definitions are:
 * - {@link booleanDefinition}
 * - {@link integerDefinition}
 * - {@link floatDefinition}
 * - {@link stringDefinition}
 * - {@link enumDefinition}
 *
 * typedef {Object} paramDefinition
 * @property {String} type - Type of the parameter.
 * @property {Mixed} default - Default value of the parameter if no
 *  initialization value is provided.
 * @property {Boolean} [constant=false] - Define if the parameter can be change
 *  after its initialization.
 * @property {Object} [metas=null] - Any user defined data associated to the
 *  parameter that couls be usefull in the application.
 */

exports.default = {
  /**
   * @typedef {Object} booleanDefinition
   * @property {String} [type='boolean'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  boolean: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (typeof value !== 'boolean') throw new Error('Invalid value for boolean param "' + name + '": ' + value);

      return value;
    }
  },

  /**
   * @typedef {Object} integerDefinition
   * @property {String} [type='integer'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [min=-Infinity] - Minimum value of the parameter.
   * @property {Boolean} [max=+Infinity] - Maximum value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  integer: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (!(typeof value === 'number' && Math.floor(value) === value)) throw new Error('Invalid value for integer param "' + name + '": ' + value);

      return clip(value, definition.min, definition.max);
    }
  },

  /**
   * @typedef {Object} floatDefinition
   * @property {String} [type='float'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [min=-Infinity] - Minimum value of the parameter.
   * @property {Boolean} [max=+Infinity] - Maximum value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  float: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (typeof value !== 'number' || value !== value) // reject NaN
        throw new Error('Invalid value for float param "' + name + '": ' + value);

      return clip(value, definition.min, definition.max);
    }
  },

  /**
   * @typedef {Object} stringDefinition
   * @property {String} [type='string'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  string: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (typeof value !== 'string') throw new Error('Invalid value for string param "' + name + '": ' + value);

      return value;
    }
  },

  /**
   * @typedef {Object} enumDefinition
   * @property {String} [type='enum'] - Define a boolean parameter.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Array} list - Possible values of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  enum: {
    definitionTemplate: ['default', 'list'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      if (definition.list.indexOf(value) === -1) throw new Error('Invalid value for enum param "' + name + '": ' + value);

      return value;
    }
  },

  /**
   * @typedef {Object} anyDefinition
   * @property {String} [type='enum'] - Define a parameter of any type.
   * @property {Boolean} default - Default value of the parameter.
   * @property {Boolean} [constant=false] - Define if the parameter is constant.
   * @property {Object} [metas={}] - Optionnal metadata of the parameter.
   */
  any: {
    definitionTemplate: ['default'],
    typeCheckFunction: function typeCheckFunction(value, definition, name) {
      // no check as it can have any type...
      return value;
    }
  }
};

},{}],111:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _paramTemplates = require('./paramTemplates');

var _paramTemplates2 = _interopRequireDefault(_paramTemplates);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * Generic class for typed parameters.
 *
 * @param {String} name - Name of the parameter.
 * @param {Array} definitionTemplate - List of mandatory keys in the param
 *  definition.
 * @param {Function} typeCheckFunction - Function to be used in order to check
 *  the value against the param definition.
 * @param {Object} definition - Definition of the parameter.
 * @param {Mixed} value - Value of the parameter.
 * @private
 */
var Param = function () {
  function Param(name, definitionTemplate, typeCheckFunction, definition, value) {
    _classCallCheck(this, Param);

    definitionTemplate.forEach(function (key) {
      if (definition.hasOwnProperty(key) === false) throw new Error('Invalid definition for param "' + name + '", ' + key + ' is not defined');
    });

    this.name = name;
    this.type = definition.type;
    this.definition = definition;

    if (this.definition.nullable === true && value === null) this.value = null;else this.value = typeCheckFunction(value, definition, name);
    this._typeCheckFunction = typeCheckFunction;
  }

  /**
   * Returns the current value.
   * @return {Mixed}
   */


  _createClass(Param, [{
    key: 'getValue',
    value: function getValue() {
      return this.value;
    }

    /**
     * Update the current value.
     * @param {Mixed} value - New value of the parameter.
     * @return {Boolean} - `true` if the param has been updated, false otherwise
     *  (e.g. if the parameter already had this value).
     */

  }, {
    key: 'setValue',
    value: function setValue(value) {
      if (this.definition.constant === true) throw new Error('Invalid assignement to constant param "' + this.name + '"');

      if (!(this.definition.nullable === true && value === null)) value = this._typeCheckFunction(value, this.definition, this.name);

      if (this.value !== value) {
        this.value = value;
        return true;
      }

      return false;
    }
  }]);

  return Param;
}();

/**
 * Bag of parameters. Main interface of the library
 */


var ParameterBag = function () {
  function ParameterBag(params, definitions) {
    _classCallCheck(this, ParameterBag);

    /**
     * List of parameters.
     *
     * @type {Object<String, Param>}
     * @name _params
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._params = params;

    /**
     * List of definitions with init values.
     *
     * @type {Object<String, paramDefinition>}
     * @name _definitions
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._definitions = definitions;

    /**
     * List of global listeners.
     *
     * @type {Set}
     * @name _globalListeners
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._globalListeners = new Set();

    /**
     * List of params listeners.
     *
     * @type {Object<String, Set>}
     * @name _paramsListeners
     * @memberof ParameterBag
     * @instance
     * @private
     */
    this._paramsListeners = {};

    // initialize empty Set for each param
    for (var name in params) {
      this._paramsListeners[name] = new Set();
    }
  }

  /**
   * Return the given definitions along with the initialization values.
   *
   * @return {Object}
   */


  _createClass(ParameterBag, [{
    key: 'getDefinitions',
    value: function getDefinitions() {
      var name = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (name !== null) return this._definitions[name];else return this._definitions;
    }

    /**
     * Return the value of the given parameter.
     *
     * @param {String} name - Name of the parameter.
     * @return {Mixed} - Value of the parameter.
     */

  }, {
    key: 'get',
    value: function get(name) {
      if (!this._params[name]) throw new Error('Cannot read property value of undefined parameter "' + name + '"');

      return this._params[name].value;
    }

    /**
     * Set the value of a parameter. If the value of the parameter is updated
     * (aka if previous value is different from new value) all registered
     * callbacks are registered.
     *
     * @param {String} name - Name of the parameter.
     * @param {Mixed} value - Value of the parameter.
     * @return {Mixed} - New value of the parameter.
     */

  }, {
    key: 'set',
    value: function set(name, value) {
      var param = this._params[name];
      var updated = param.setValue(value);
      value = param.getValue();

      if (updated) {
        var metas = param.definition.metas;
        // trigger global listeners
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = this._globalListeners[Symbol.iterator](), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var listener = _step.value;

            listener(name, value, metas);
          } // trigger param listeners
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }

        var _iteratorNormalCompletion2 = true;
        var _didIteratorError2 = false;
        var _iteratorError2 = undefined;

        try {
          for (var _iterator2 = this._paramsListeners[name][Symbol.iterator](), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
            var _listener = _step2.value;

            _listener(value, metas);
          }
        } catch (err) {
          _didIteratorError2 = true;
          _iteratorError2 = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion2 && _iterator2.return) {
              _iterator2.return();
            }
          } finally {
            if (_didIteratorError2) {
              throw _iteratorError2;
            }
          }
        }
      }

      return value;
    }

    /**
     * Define if the `name` parameter exists or not.
     *
     * @param {String} name - Name of the parameter.
     * @return {Boolean}
     */

  }, {
    key: 'has',
    value: function has(name) {
      return this._params[name] ? true : false;
    }

    /**
     * Reset a parameter to its init value. Reset all parameters if no argument.
     *
     * @param {String} [name=null] - Name of the parameter to reset.
     */

  }, {
    key: 'reset',
    value: function reset() {
      var _this = this;

      var name = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (name !== null) this.set(name, param.definition.initValue);else Object.keys(this._params).forEach(function (name) {
        return _this.reset(name);
      });
    }

    /**
     * @callback ParameterBag~listenerCallback
     * @param {String} name - Parameter name.
     * @param {Mixed} value - Updated value of the parameter.
     * @param {Object} [meta=] - Given meta data of the parameter.
     */

    /**
     * Add listener to all param updates.
     *
     * @param {ParameterBag~listenerCallack} callback - Listener to register.
     */

  }, {
    key: 'addListener',
    value: function addListener(callback) {
      this._globalListeners.add(callback);
    }

    /**
     * Remove listener from all param changes.
     *
     * @param {ParameterBag~listenerCallack} callback - Listener to remove. If
     *  `null` remove all listeners.
     */

  }, {
    key: 'removeListener',
    value: function removeListener() {
      var callback = arguments.length <= 0 || arguments[0] === undefined ? null : arguments[0];

      if (callback === null) this._globalListeners.clear();else this._globalListeners.delete(callback);
    }

    /**
     * @callback ParameterBag~paramListenerCallack
     * @param {Mixed} value - Updated value of the parameter.
     * @param {Object} [meta=] - Given meta data of the parameter.
     */

    /**
     * Add listener to a given param updates.
     *
     * @param {String} name - Parameter name.
     * @param {ParameterBag~paramListenerCallack} callback - Function to apply
     *  when the value of the parameter changes.
     */

  }, {
    key: 'addParamListener',
    value: function addParamListener(name, callback) {
      this._paramsListeners[name].add(callback);
    }

    /**
     * Remove listener from a given param updates.
     *
     * @param {String} name - Parameter name.
     * @param {ParameterBag~paramListenerCallack} callback - Listener to remove.
     *  If `null` remove all listeners.
     */

  }, {
    key: 'removeParamListener',
    value: function removeParamListener(name) {
      var callback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      if (callback === null) this._paramsListeners[name].clear();else this._paramsListeners[name].delete(callback);
    }
  }]);

  return ParameterBag;
}();

/**
 * Factory for the `ParameterBag` class.
 *
 * @param {Object<String, paramDefinition>} definitions - Object describing the
 *  parameters.
 * @param {Object<String, Mixed>} values - Initialization values for the
 *  parameters.
 * @return {ParameterBag}
 */


function parameters(definitions) {
  var values = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var params = {};

  for (var name in values) {
    if (definitions.hasOwnProperty(name) === false) throw new Error('Unknown param "' + name + '"');
  }

  for (var _name in definitions) {
    if (params.hasOwnProperty(_name) === true) throw new Error('Parameter "' + _name + '" already defined');

    var definition = definitions[_name];

    if (!_paramTemplates2.default[definition.type]) throw new Error('Unknown param type "' + definition.type + '"');

    var _paramTemplates$defin = _paramTemplates2.default[definition.type];
    var definitionTemplate = _paramTemplates$defin.definitionTemplate;
    var typeCheckFunction = _paramTemplates$defin.typeCheckFunction;


    var value = void 0;

    if (values.hasOwnProperty(_name) === true) value = values[_name];else value = definition.default;

    // store init value in definition
    definition.initValue = value;

    if (!typeCheckFunction || !definitionTemplate) throw new Error('Invalid param type definition "' + definition.type + '"');

    params[_name] = new Param(_name, definitionTemplate, typeCheckFunction, definition, value);
  }

  return new ParameterBag(params, definitions);
}

/**
 * Register a new type for the `parameters` factory.
 * @param {String} typeName - Value that will be available as the `type` of a
 *  param definition.
 * @param {parameterDefinition} parameterDefinition - Object describing the
 *  parameter.
 */
parameters.defineType = function (typeName, parameterDefinition) {
  _paramTemplates2.default[typeName] = parameterDefinition;
};

exports.default = parameters;

},{"./paramTemplates":110}],112:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _parameters = require('parameters');

var _parameters2 = _interopRequireDefault(_parameters);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var id = 0;

/**
 * Base `lfo` class to be extended in order to create new nodes.
 *
 * Nodes are divided in 3 categories:
 * - **`source`** are responsible for acquering a signal and its properties
 *   (frameRate, frameSize, etc.)
 * - **`sink`** are endpoints of the graph, such nodes can be recorders,
 *   visualizers, etc.
 * - **`operator`** are used to make computation on the input signal and
 *   forward the results below in the graph.
 *
 * In most cases the methods to override / extend are:
 * - the **`constructor`** to define the parameters of the new lfo node.
 * - the **`processStreamParams`** method to define how the node modify the
 *   stream attributes (e.g. by changing the frame size)
 * - the **`process{FrameType}`** method to define the operations that the
 *   node apply on the stream. The type of input a node can handle is define
 *   by its implemented interface, if it implements `processSignal` a stream
 *   with `frameType === 'signal'` can be processed, `processVector` to handle
 *   an input of type `vector`.
 *
 * <span class="warning">_This class should be considered abstract and only
 * be used to be extended._</span>
 *
 *
 * // overview of the behavior of a node
 *
 * **processStreamParams(prevStreamParams)**
 *
 * `base` class (default implementation)
 * - call `preprocessStreamParams`
 * - call `propagateStreamParams`
 *
 * `child` class
 * - call `preprocessStreamParams`
 * - override some of the inherited `streamParams`
 * - creates the any related logic buffers
 * - call `propagateStreamParams`
 *
 * _should not call `super.processStreamParams`_
 *
 * **prepareStreamParams()**
 *
 * - assign prevStreamParams to this.streamParams
 * - check if the class implements the correct `processInput` method
 *
 * _shouldn't be extended, only consumed in `processStreamParams`_
 *
 * **propagateStreamParams()**
 *
 * - creates the `frameData` buffer
 * - propagate `streamParams` to children
 *
 * _shouldn't be extended, only consumed in `processStreamParams`_
 *
 * **processFrame()**
 *
 * `base` class (default implementation)
 * - call `preprocessFrame`
 * - assign frameTime and frameMetadata to identity
 * - call the proper function according to inputType
 * - call `propagateFrame`
 *
 * `child` class
 * - call `preprocessFrame`
 * - do whatever you want with incomming frame
 * - call `propagateFrame`
 *
 * _should not call `super.processFrame`_
 *
 * **prepareFrame()**
 *
 * - if `reinit` and trigger `processStreamParams` if needed
 *
 * _shouldn't be extended, only consumed in `processFrame`_
 *
 * **propagateFrame()**
 *
 * - propagate frame to children
 *
 * _shouldn't be extended, only consumed in `processFrame`_
 *
 * @memberof module:common.core
 */

var BaseLfo = function () {
  function BaseLfo() {
    var definitions = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    (0, _classCallCheck3.default)(this, BaseLfo);

    this.cid = id++;

    /**
     * Parameter bag containing parameter instances.
     *
     * @type {Object}
     * @name params
     * @instance
     * @memberof module:common.core.BaseLfo
     */
    this.params = (0, _parameters2.default)(definitions, options);
    // listen for param updates
    this.params.addListener(this.onParamUpdate.bind(this));

    /**
     * Description of the stream output of the node.
     * Set to `null` when the node is destroyed.
     *
     * @type {Object}
     * @property {Number} frameSize - Frame size at the output of the node.
     * @property {Number} frameRate - Frame rate at the output of the node.
     * @property {String} frameType - Frame type at the output of the node,
     *  possible values are `signal`, `vector` or `scalar`.
     * @property {Array|String} description - If type is `vector`, describe
     *  the dimension(s) of output stream.
     * @property {Number} sourceSampleRate - Sample rate of the source of the
     *  graph. _The value should be defined by sources and never modified_.
     * @property {Number} sourceSampleCount - Number of consecutive discrete
     *  time values contained in the data frame output by the source.
     *  _The value should be defined by sources and never modified_.
     *
     * @name streamParams
     * @instance
     * @memberof module:common.core.BaseLfo
     */
    this.streamParams = {
      frameType: null,
      frameSize: 1,
      frameRate: 0,
      description: null,
      sourceSampleRate: 0,
      sourceSampleCount: null
    };

    /**
     * Current frame. This object and its data are updated at each incomming
     * frame without reallocating memory.
     *
     * @type {Object}
     * @name frame
     * @property {Number} time - Time of the current frame.
     * @property {Float32Array} data - Data of the current frame.
     * @property {Object} metadata - Metadata associted to the current frame.
     * @instance
     * @memberof module:common.core.BaseLfo
     */
    this.frame = {
      time: 0,
      data: null,
      metadata: {}
    };

    /**
     * List of nodes connected to the ouput of the node (lower in the graph).
     * At each frame, the node forward its `frame` to to all its `nextOps`.
     *
     * @type {Array<BaseLfo>}
     * @name nextOps
     * @instance
     * @memberof module:common.core.BaseLfo
     * @see {@link module:common.core.BaseLfo#connect}
     * @see {@link module:common.core.BaseLfo#disconnect}
     */
    this.nextOps = [];

    /**
     * The node from which the node receive the frames (upper in the graph).
     *
     * @type {BaseLfo}
     * @name prevOp
     * @instance
     * @memberof module:common.core.BaseLfo
     * @see {@link module:common.core.BaseLfo#connect}
     * @see {@link module:common.core.BaseLfo#disconnect}
     */
    this.prevOp = null;

    /**
     * Is set to true when a static parameter is updated. On the next input
     * frame all the subgraph streamParams starting from this node will be
     * updated.
     *
     * @type {Boolean}
     * @name _reinit
     * @instance
     * @memberof module:common.core.BaseLfo
     * @private
     */
    this._reinit = false;
  }

  /**
   * Returns an object describing each available parameter of the node.
   *
   * @return {Object}
   */


  (0, _createClass3.default)(BaseLfo, [{
    key: 'getParamsDescription',
    value: function getParamsDescription() {
      return this.params.getDefinitions();
    }

    /**
     * Reset all parameters to their initial value (as defined on instantication)
     *
     * @see {@link module:common.core.BaseLfo#streamParams}
     */

  }, {
    key: 'resetParams',
    value: function resetParams() {
      this.params.reset();
    }

    /**
     * Function called when a param is updated. By default set the `_reinit`
     * flag to `true` if the param is `static` one. This method should be
     * extended to handle particular logic bound to a specific parameter.
     *
     * @param {String} name - Name of the parameter.
     * @param {Mixed} value - Value of the parameter.
     * @param {Object} metas - Metadata associated to the parameter.
     */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value) {
      var metas = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};

      if (metas.kind === 'static') this._reinit = true;
    }

    /**
     * Connect the current node (`prevOp`) to another node (`nextOp`).
     * A given node can be connected to several operators and propagate the
     * stream to each of them.
     *
     * @param {BaseLfo} next - Next operator in the graph.
     * @see {@link module:common.core.BaseLfo#processFrame}
     * @see {@link module:common.core.BaseLfo#disconnect}
     */

  }, {
    key: 'connect',
    value: function connect(next) {
      if (!(next instanceof BaseLfo)) throw new Error('Invalid connection: child node is not an instance of `BaseLfo`');

      if (this.streamParams === null || next.streamParams === null) throw new Error('Invalid connection: cannot connect a dead node');

      this.nextOps.push(next);
      next.prevOp = this;

      if (this.streamParams.frameType !== null) // graph has already been started
        next.processStreamParams(this.streamParams);
    }

    /**
     * Remove the given operator from its previous operators' `nextOps`.
     *
     * @param {BaseLfo} [next=null] - The operator to disconnect from the current
     *  operator. If `null` disconnect all the next operators.
     */

  }, {
    key: 'disconnect',
    value: function disconnect() {
      var _this = this;

      var next = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : null;

      if (next === null) {
        this.nextOps.forEach(function (next) {
          return _this.disconnect(next);
        });
      } else {
        var index = this.nextOps.indexOf(this);
        this.nextOps.splice(index, 1);
        next.prevOp = null;
      }
    }

    /**
     * Destroy all the nodes in the sub-graph starting from the current node.
     * When detroyed, the `streamParams` of the node are set to `null`, the
     * operator is then considered as `dead` and cannot be reconnected.
     *
     * @see {@link module:common.core.BaseLfo#connect}
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      // destroy all chidren
      var index = this.nextOps.length;

      while (index--) {
        this.nextOps[index].destroy();
      } // disconnect itself from the previous operator
      if (this.prevOp) this.prevOp.disconnect(this);

      // mark the object as dead
      this.streamParams = null;
    }

    /**
     * Helper to initialize the stream in standalone mode.
     *
     * @param {Object} [streamParams={}] - Stream parameters to be used.
     *
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     * @see {@link module:common.core.BaseLfo#resetStream}
     */

  }, {
    key: 'initStream',
    value: function initStream() {
      var streamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.processStreamParams(streamParams);
      this.resetStream();
    }

    /**
     * Reset the `frame.data` buffer by setting all its values to 0.
     * A source operator should call `processStreamParams` and `resetStream` when
     * started, each of these method propagate through the graph automaticaly.
     *
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     */

  }, {
    key: 'resetStream',
    value: function resetStream() {
      // buttom up
      for (var i = 0, l = this.nextOps.length; i < l; i++) {
        this.nextOps[i].resetStream();
      } // no buffer for `scalar` type or sink node
      if (this.streamParams.frameType !== 'scalar' && this.frame.data !== null) this.frame.data.fill(0);
    }

    /**
     * Finalize the stream. A source node should call this method when stopped,
     * `finalizeStream` is automatically propagated throught the graph.
     *
     * @param {Number} endTime - Logical time at which the graph is stopped.
     */

  }, {
    key: 'finalizeStream',
    value: function finalizeStream(endTime) {
      for (var i = 0, l = this.nextOps.length; i < l; i++) {
        this.nextOps[i].finalizeStream(endTime);
      }
    }

    /**
     * Initialize or update the operator's `streamParams` according to the
     * previous operators `streamParams` values.
     *
     * When implementing a new operator this method should:
     * 1. call `this.prepareStreamParams` with the given `prevStreamParams`
     * 2. optionnally change values to `this.streamParams` according to the
     *    logic performed by the operator.
     * 3. optionnally allocate memory for ring buffers, etc.
     * 4. call `this.propagateStreamParams` to trigger the method on the next
     *    operators in the graph.
     *
     * @param {Object} prevStreamParams - `streamParams` of the previous operator.
     *
     * @see {@link module:common.core.BaseLfo#prepareStreamParams}
     * @see {@link module:common.core.BaseLfo#propagateStreamParams}
     */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.prepareStreamParams(prevStreamParams);
      this.propagateStreamParams();
    }

    /**
     * Common logic to do at the beginning of the `processStreamParam`, must be
     * called at the beginning of any `processStreamParam` implementation.
     *
     * The method mainly check if the current node implement the interface to
     * handle the type of frame propagated by it's parent:
     * - to handle a `vector` frame type, the class must implement `processVector`
     * - to handle a `signal` frame type, the class must implement `processSignal`
     * - in case of a 'scalar' frame type, the class can implement any of the
     * following by order of preference: `processScalar`, `processVector`,
     * `processSignal`.
     *
     * @param {Object} prevStreamParams - `streamParams` of the previous operator.
     *
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     * @see {@link module:common.core.BaseLfo#propagateStreamParams}
     */

  }, {
    key: 'prepareStreamParams',
    value: function prepareStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      (0, _assign2.default)(this.streamParams, prevStreamParams);
      var prevFrameType = prevStreamParams.frameType;

      switch (prevFrameType) {
        case 'scalar':
          if (this.processScalar) this.processFunction = this.processScalar;else if (this.processVector) this.processFunction = this.processVector;else if (this.processSignal) this.processFunction = this.processSignal;else throw new Error(this.constructor.name + ' - no "process" function found');
          break;
        case 'vector':
          if (!('processVector' in this)) throw new Error(this.constructor.name + ' - "processVector" is not defined');

          this.processFunction = this.processVector;
          break;
        case 'signal':
          if (!('processSignal' in this)) throw new Error(this.constructor.name + ' - "processSignal" is not defined');

          this.processFunction = this.processSignal;
          break;
        default:
          // defaults to processFunction
          break;
      }
    }

    /**
     * Create the `this.frame.data` buffer and forward the operator's `streamParam`
     * to all its next operators, must be called at the end of any
     * `processStreamParams` implementation.
     *
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     * @see {@link module:common.core.BaseLfo#prepareStreamParams}
     */

  }, {
    key: 'propagateStreamParams',
    value: function propagateStreamParams() {
      this.frame.data = new Float32Array(this.streamParams.frameSize);

      for (var i = 0, l = this.nextOps.length; i < l; i++) {
        this.nextOps[i].processStreamParams(this.streamParams);
      }
    }

    /**
     * Define the particular logic the operator applies to the stream.
     * According to the frame type of the previous node, the method calls one
     * of the following method `processVector`, `processSignal` or `processScalar`
     *
     * @param {Object} frame - Frame (time, data, and metadata) as given by the
     *  previous operator. The incomming frame should never be modified by
     *  the operator.
     *
     * @see {@link module:common.core.BaseLfo#prepareFrame}
     * @see {@link module:common.core.BaseLfo#propagateFrame}
     * @see {@link module:common.core.BaseLfo#processStreamParams}
     */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame();

      // frameTime and frameMetadata defaults to identity
      this.frame.time = frame.time;
      this.frame.metadata = frame.metadata;

      this.processFunction(frame);
      this.propagateFrame();
    }

    /**
     * Pointer to the method called in `processFrame` according to the
     * frame type of the previous operator. Is dynamically assigned in
     * `prepareStreamParams`.
     *
     * @see {@link module:common.core.BaseLfo#prepareStreamParams}
     * @see {@link module:common.core.BaseLfo#processFrame}
     */

  }, {
    key: 'processFunction',
    value: function processFunction(frame) {
      this.frame = frame;
    }

    /**
     * Common logic to perform at the beginning of the `processFrame`.
     *
     * @see {@link module:common.core.BaseLfo#processFrame}
     */

  }, {
    key: 'prepareFrame',
    value: function prepareFrame() {
      if (this._reinit === true) {
        var streamParams = this.prevOp !== null ? this.prevOp.streamParams : {};
        this.initStream(streamParams);
        this._reinit = false;
      }
    }

    /**
     * Forward the current `frame` to the next operators, is called at the end of
     * `processFrame`.
     *
     * @see {@link module:common.core.BaseLfo#processFrame}
     */

  }, {
    key: 'propagateFrame',
    value: function propagateFrame() {
      for (var i = 0, l = this.nextOps.length; i < l; i++) {
        this.nextOps[i].processFrame(this.frame);
      }
    }
  }]);
  return BaseLfo;
}();

exports.default = BaseLfo;

},{"babel-runtime/core-js/object/assign":8,"babel-runtime/helpers/classCallCheck":16,"babel-runtime/helpers/createClass":17,"parameters":111}],113:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _gmmUtils = require('../utils/gmm-utils');

var gmmUtils = _interopRequireWildcard(_gmmUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * GMM decoder <br />
 * Loads a model trained by the XMM library and processes an input stream of float vectors in real-time.
 * If the model was trained for regression, outputs an estimation of the associated process.
 * @class
 */

var GmmDecoder = function () {

  /**
   * @param {Number} [windowSize=1] - Size of the likelihood smoothing window.
   */
  function GmmDecoder() {
    var windowSize = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    (0, _classCallCheck3.default)(this, GmmDecoder);


    /**
     * The model, as generated by XMM from a training data set.
     * @type {Object}
     * @private
     */
    this._model = undefined;

    /**
     * The model results, containing intermediate results that will be passed to the callback in filter.
     * @type {Object}
     * @private
     */
    this._modelResults = undefined;

    /**
     * Size of the likelihood smoothing window.
     * @type {Number}
     * @private
     */
    this._likelihoodWindow = windowSize;
  }

  /**
   * Callback handling estimation results.
   * @callback GmmResultsCallback
   * @param {String} err - Description of a potential error.
   * @param {GmmResults} res - Object holding the estimation results.
   */

  /**
   * Results of the filtering process.
   * @typedef GmmResults
   * @type {Object}
   * @property {String} likeliest - The likeliest model's label.
   * @property {Number} likeliestIndex - The likeliest model's index
   * @property {Array.number} likelihoods - The array of all models' smoothed normalized likelihoods.
   * @property {?Array.number} outputValues - If the model was trained with regression, the estimated float vector output.
   * @property {?Array.number} outputCovariance - If the model was trained with regression, the output covariance matrix.
   */

  /**
   * The decoding function.
   * @param {Array} observation - An input float vector to be estimated.
   * @param {GmmResultsCallback} [resultsCallback=null] - The callback handling the estimation results.
   * @returns {GmmResults} results - The estimation results.
   */


  (0, _createClass3.default)(GmmDecoder, [{
    key: 'filter',
    value: function filter(observation) {
      var resultsCallback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var err = null;
      var res = null;

      if (!this._model) {
        console.log("no model loaded");
        return;
      } else {
        try {
          gmmUtils.gmmFilter(observation, this._model, this._modelResults);

          var likeliest = this._modelResults.likeliest > -1 ? this._model.models[this._modelResults.likeliest].label : 'unknown';
          var likelihoods = this._modelResults.smoothed_normalized_likelihoods.slice(0);
          res = {
            likeliest: likeliest,
            likeliestIndex: this._modelResults.likeliest,
            likelihoods: likelihoods
          };

          // add regression results to global results if bimodal :
          if (this._model.shared_parameters.bimodal) {
            res['outputValues'] = this._modelResults.output_values.slice(0);
            res['outputCovariance'] = this.modelResults.output_covariance.slice(0);
          }
        } catch (e) {
          err = 'problem occured during filtering : ' + e;
        }
      }

      if (resultsCallback) {
        resultsCallback(err, res);
      }
      return res;
    }

    //=========================== GETTERS / SETTERS ============================//

    /**
     * Likelihood smoothing window size.
     * @type {Number}
     */

  }, {
    key: '_setModel',


    /** @private */
    value: function _setModel(model) {
      this._model = undefined;
      this._modelResults = undefined;

      // test if model is valid here (TODO : write a better test)
      if (model.models !== undefined) {
        this._model = model;
        var m = this._model;
        var nmodels = m.models.length;

        this._modelResults = {
          instant_likelihoods: new Array(nmodels),
          smoothed_log_likelihoods: new Array(nmodels),
          smoothed_likelihoods: new Array(nmodels),
          instant_normalized_likelihoods: new Array(nmodels),
          smoothed_normalized_likelihoods: new Array(nmodels),
          likeliest: -1,
          singleClassGmmModelResults: []
        };

        // the following variables are used for regression :
        var params = m.shared_parameters;
        var dimOut = params.dimension - params.dimension_input;
        this._modelResults.output_values = new Array(dimOut);

        for (var i = 0; i < dimOut; i++) {
          this._modelResults.output_values[i] = 0.0;
        }

        var outCovarSize = void 0;
        //------------------------------------------------------------------- full
        if (m.configuration.default_parameters.covariance_mode == 0) {
          outCovarSize = dimOut * dimOut;
          //--------------------------------------------------------------- diagonal
        } else {
          outCovarSize = dimOut;
        }

        this._modelResults.output_covariance = new Array(outCovarSize);

        for (var _i = 0; _i < dimOut; _i++) {
          this._modelResults.output_covariance[_i] = 0.0;
        }

        for (var _i2 = 0; _i2 < nmodels; _i2++) {

          this._modelResults.instant_likelihoods[_i2] = 0;
          this._modelResults.smoothed_log_likelihoods[_i2] = 0;
          this._modelResults.smoothed_likelihoods[_i2] = 0;
          this._modelResults.instant_normalized_likelihoods[_i2] = 0;
          this._modelResults.smoothed_normalized_likelihoods[_i2] = 0;

          var res = {
            instant_likelihood: 0,
            log_likelihood: 0
          };

          res.likelihood_buffer = new Array(this._likelihoodWindow);

          for (var j = 0; j < this._likelihoodWindow; j++) {
            res.likelihood_buffer[j] = 1 / this._likelihoodWindow;
          }

          res.likelihood_buffer_index = 0;

          // the following variables are used for regression :
          res.beta = new Array(m.models[_i2].components.length);

          for (var _j = 0; _j < res.beta.length; _j++) {
            res.beta[_j] = 1 / res.beta.length;
          }

          res.output_values = this._modelResults.output_values.slice(0);
          res.output_covariance = this._modelResults.output_covariance.slice(0);

          // now add this singleModelResults object
          // to the global modelResults object :
          this._modelResults.singleClassGmmModelResults.push(res);
        }
      }
    }

    /**
     * Currently estimated likeliest label.
     * @readonly
     * @type {String}
     */

  }, {
    key: 'likelihoodWindow',
    get: function get() {
      return this._likelihoodWindow;
    },
    set: function set(newWindowSize) {
      this._likelihoodWindow = newWindowSize;
      if (this._model === undefined) return;

      var res = this._modelResults.singleClassModelResults;

      for (var i = 0; i < this._model.models.length; i++) {
        res[i].likelihood_buffer = new Array(this._likelihoodWindow);

        for (var j = 0; j < this._likelihoodWindow; j++) {
          res.likelihood_buffer[j] = 1 / this._likelihoodWindow;
        }
      }
    }

    /**
     * The model generated by XMM.
     * It is mandatory for the class to have a model in order to do its job.
     * @type {Object}
     */

  }, {
    key: 'model',
    get: function get() {
      if (this._model !== undefined) {
        return JSON.fromString((0, _stringify2.default)(this._model));
      }
      return undefined;
    },
    set: function set(model) {
      this._setModel(model);
    }
  }, {
    key: 'likeliestLabel',
    get: function get() {
      if (this._modelResults !== undefined) {
        if (this._modelResults.likeliest > -1) {
          return this._model.models[this._modelResults.likeliest].label;
        }
      }
      return 'unknown';
    }

    /**
     * Number of classes contained in the model.
     * @readonly
     * @type {Number}
     */

  }, {
    key: 'nbClasses',
    get: function get() {
      if (this._model !== undefined) {
        return this._model.models.length;
      }
      return 0;
    }

    /**
     * Size of the regression vector if model is bimodal.
     * @readonly
     * @type {Number}
     */

  }, {
    key: 'regressionSize',
    get: function get() {
      if (this._model !== undefined) {
        return this._model.shared_parameters.dimension_input;
      }
      return 0;
    }
  }]);
  return GmmDecoder;
}();

;

exports.default = GmmDecoder;

},{"../utils/gmm-utils":118,"babel-runtime/core-js/json/stringify":6,"babel-runtime/helpers/classCallCheck":16,"babel-runtime/helpers/createClass":17}],114:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

var _hhmmUtils = require('../utils/hhmm-utils');

var hhmmUtils = _interopRequireWildcard(_hhmmUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * Hierarchical HMM decoder <br />
 * Loads a model trained by the XMM library and processes an input stream of float vectors in real-time.
 * If the model was trained for regression, outputs an estimation of the associated process.
 * @class
 */

var HhmmDecoder = function () {

  /**
   * @param {Number} [windowSize=1] - Size of the likelihood smoothing window.
   */
  function HhmmDecoder() {
    var windowSize = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
    (0, _classCallCheck3.default)(this, HhmmDecoder);


    /**
     * Size of the likelihood smoothing window.
     * @type {number}
     * @private
     */
    this._likelihoodWindow = windowSize;

    /**
     * The model, as generated by XMM from a training data set.
     * @type {Object}
     * @private
     */
    this._model = undefined;

    /**
     * The model results, containing intermediate results that will be passed to the callback in filter.
     * @type {Object}
     * @private
     */
    this._modelResults = undefined;
  }

  /**
   * Callback handling estimation results.
   * @callback HhmmResultsCallback
   * @param {string} err - Description of a potential error.
   * @param {HhmmResults} res - Object holding the estimation results.
   */

  /**
   * Results of the filtering process.
   * @typedef HhmmResults
   * @type {Object}
   * @property {String} likeliest - The likeliest model's label.
   * @property {Number} likeliestIndex - The likeliest model's index
   * @property {Array.number} likelihoods - The array of all models' smoothed normalized likelihoods.
   * @property {Array.number} timeProgressions - The array of all models' normalized time progressions.
   * @property {Array.Array.number} alphas - The array of all models' states likelihoods array.
   * @property {?Array.number} outputValues - If the model was trained with regression, the estimated float vector output.
   * @property {?Array.number} outputCovariance - If the model was trained with regression, the output covariance matrix.
   */

  /**
   * The decoding function.
   * @param {Array.number} observation - An input float vector to be estimated.
   * @param {HhmmResultsCallback} [resultsCallback=null] - The callback handling the estimation results.
   * @returns {HhmmResults} results - The estimation results.
   */


  (0, _createClass3.default)(HhmmDecoder, [{
    key: 'filter',
    value: function filter(observation) {
      var resultsCallback = arguments.length <= 1 || arguments[1] === undefined ? null : arguments[1];

      var err = null;
      var res = null;

      if (!this._model) {
        err = 'no model loaded yet';
      } else {
        //console.log(observation);
        //this._observation = observation;
        try {
          hhmmUtils.hhmmFilter(observation, this._model, this._modelResults);

          // create results object from relevant modelResults values :
          var likeliest = this._modelResults.likeliest > -1 ? this._model.models[this._modelResults.likeliest].label : 'unknown';
          var likelihoods = this._modelResults.smoothed_normalized_likelihoods.slice(0);
          res = {
            likeliest: likeliest,
            likeliestIndex: this._modelResults.likeliest,
            likelihoods: likelihoods,
            timeProgressions: new Array(this._model.models.length),
            alphas: new Array(this._model.models.length)
          };

          for (var i = 0; i < this._model.models.length; i++) {
            res.timeProgressions[i] = this._modelResults.singleClassHmmModelResults[i].progress;
            if (this._model.configuration.default_parameters.hierarchical) {
              res.alphas[i] = this._modelResults.singleClassHmmModelResults[i].alpha_h[0];
            } else {
              res.alphas[i] = this._modelResults.singleClassHmmModelResults[i].alpha[0];
            }
          }

          if (this._model.shared_parameters.bimodal) {
            res['outputValues'] = this._modelResults.output_values.slice(0);
            res['outputCovariance'] = this._modelResults.output_covariance.slice(0);
          }
        } catch (e) {
          err = 'problem occured during filtering : ' + e;
        }
      }

      if (resultsCallback) {
        resultsCallback(err, res);
      }
      return res;
    }

    /**
     * Resets the intermediate results of the estimation (shortcut for reloading the model).
     */

  }, {
    key: 'reset',
    value: function reset() {
      if (this._model !== undefined) {
        this._setModel(this._model);
      }
    }

    //========================== GETTERS / SETTERS =============================//

    /**
     * Likelihood smoothing window size.
     * @type {Number}
     */

  }, {
    key: '_setModel',


    /** @private */
    value: function _setModel(model) {

      this._model = undefined;
      this._modelResults = undefined;

      if (!model) return;

      // test if model is valid here (TODO : write a better test)
      if (model.models !== undefined) {
        this._model = model;
        var m = this._model;
        var nmodels = m.models.length;

        this._modelResults = {
          instant_likelihoods: new Array(nmodels),
          smoothed_log_likelihoods: new Array(nmodels),
          smoothed_likelihoods: new Array(nmodels),
          instant_normalized_likelihoods: new Array(nmodels),
          smoothed_normalized_likelihoods: new Array(nmodels),
          likeliest: -1,
          frontier_v1: new Array(nmodels),
          frontier_v2: new Array(nmodels),
          forward_initialized: false,
          singleClassHmmModelResults: []
        };

        var params = m.shared_parameters;
        var dimOut = params.dimension - params.dimension_input;
        this._modelResults.output_values = new Array(dimOut);
        for (var i = 0; i < dimOut; i++) {
          this._modelResults.output_values[i] = 0.0;
        }

        var outCovarSize = void 0;
        if (m.configuration.default_parameters.covariance_mode == 0) {
          //---- full
          outCovarSize = dimOut * dimOut;
        } else {
          //------------------------------------------------------ diagonal
          outCovarSize = dimOut;
        }

        this._modelResults.output_covariance = new Array(outCovarSize);

        for (var _i = 0; _i < dimOut; _i++) {
          this._modelResults.output_covariance[_i] = 0.0;
        }

        for (var _i2 = 0; _i2 < nmodels; _i2++) {
          this._modelResults.instant_likelihoods[_i2] = 0;
          this._modelResults.smoothed_log_likelihoods[_i2] = 0;
          this._modelResults.smoothed_likelihoods[_i2] = 0;
          this._modelResults.instant_normalized_likelihoods[_i2] = 0;
          this._modelResults.smoothed_normalized_likelihoods[_i2] = 0;

          var nstates = m.models[_i2].parameters.states;

          var alpha_h = new Array(3);
          for (var j = 0; j < 3; j++) {
            alpha_h[j] = new Array(nstates);
            for (var k = 0; k < nstates; k++) {
              alpha_h[j][k] = 0;
            }
          }

          var alpha = new Array(nstates);
          for (var _j = 0; _j < nstates; _j++) {
            alpha[_j] = 0;
          }

          var likelihood_buffer = new Array(this._likelihoodWindow);
          for (var _j2 = 0; _j2 < this._likelihoodWindow; _j2++) {
            likelihood_buffer[_j2] = 0.0;
          }

          var hmmRes = {
            hierarchical: m.configuration.default_parameters.hierarchical,
            instant_likelihood: 0,
            log_likelihood: 0,
            // for circular buffer implementation
            // (see hmmUpdateResults) :
            likelihood_buffer: likelihood_buffer,
            likelihood_buffer_index: 0,
            progress: 0,

            exit_likelihood: 0,
            exit_ratio: 0,

            likeliest_state: -1,

            // for non-hierarchical :
            previous_alpha: alpha.slice(0),
            alpha: alpha,
            // for hierarchical :       
            alpha_h: alpha_h,
            prior: new Array(nstates),
            transition: new Array(nstates),

            // used in hmmUpdateAlphaWindow
            window_minindex: 0,
            window_maxindex: 0,
            window_normalization_constant: 0,

            // for non-hierarchical mode
            forward_initialized: false,

            singleClassGmmModelResults: [] // aka states
          };

          hmmRes.output_values = this._modelResults.output_values.slice(0);
          hmmRes.output_covariance = this._modelResults.output_covariance.slice(0);

          // add HMM states (GMMs)
          for (var _j3 = 0; _j3 < nstates; _j3++) {
            var gmmRes = {
              instant_likelihood: 0,
              log_likelihood: 0
            };
            gmmRes.beta = new Array(this._model.models[_i2].parameters.gaussians);
            for (var _k = 0; _k < gmmRes.beta.length; _k++) {
              gmmRes.beta[_k] = 1 / gmmRes.beta.length;
            }
            gmmRes.output_values = hmmRes.output_values.slice(0);
            gmmRes.output_covariance = hmmRes.output_covariance.slice(0);

            hmmRes.singleClassGmmModelResults.push(gmmRes);
          }

          this._modelResults.singleClassHmmModelResults.push(hmmRes);
        }
      }
    }

    /**
     * Currently estimated likeliest label.
     * @readonly
     * @type {String}
     */

  }, {
    key: 'likelihoodWindow',
    get: function get() {
      return this._likelihoodWindow;
    },
    set: function set(newWindowSize) {
      this._likelihoodWindow = newWindowSize;

      if (this._model === undefined) return;

      var res = this._modelResults.singleClassModelResults;

      for (var i = 0; i < this._model.models.length; i++) {
        res[i].likelihood_buffer = new Array(this._likelihoodWindow);

        for (var j = 0; j < this._likelihoodWindow; j++) {
          res.likelihood_buffer[j] = 1 / this._likelihoodWindow;
        }
      }
    }

    /**
     * The model generated by XMM.
     * It is mandatory for the class to have a model in order to do its job.
     * @type {Object}
     */

  }, {
    key: 'model',
    get: function get() {
      if (this._model !== undefined) {
        return JSON.fromString((0, _stringify2.default)(this._model));
      }
      return undefined;
    },
    set: function set(model) {
      this._setModel(model);
    }
  }, {
    key: 'likeliestLabel',
    get: function get() {
      if (this._modelResults !== undefined) {
        if (this._modelResults.likeliest > -1) {
          return this._model.models[this._modelResults.likeliest].label;
        }
      }
      return 'unknown';
    }

    /**
     * Number of classes contained in the model.
     * @readonly
     * @type {Number}
     */

  }, {
    key: 'nbClasses',
    get: function get() {
      if (this._model !== undefined) {
        return this._model.models.length;
      }
      return 0;
    }

    /**
     * Size of the regression vector if model is bimodal.
     * @readonly
     * @type {Number}
     */

  }, {
    key: 'regressionSize',
    get: function get() {
      if (this._model !== undefined) {
        return this._model.shared_parameters.dimension_input;
      }
      return 0;
    }
  }]);
  return HhmmDecoder;
}();

;

exports.default = HhmmDecoder;

},{"../utils/hhmm-utils":119,"babel-runtime/core-js/json/stringify":6,"babel-runtime/helpers/classCallCheck":16,"babel-runtime/helpers/createClass":17}],115:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _gmmDecoder = require('./gmm/gmm-decoder');

Object.defineProperty(exports, 'GmmDecoder', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_gmmDecoder).default;
  }
});

var _hhmmDecoder = require('./hhmm/hhmm-decoder');

Object.defineProperty(exports, 'HhmmDecoder', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_hhmmDecoder).default;
  }
});

var _xmmPhrase = require('./set/xmm-phrase');

Object.defineProperty(exports, 'PhraseMaker', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_xmmPhrase).default;
  }
});

var _xmmSet = require('./set/xmm-set');

Object.defineProperty(exports, 'SetMaker', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_xmmSet).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./gmm/gmm-decoder":113,"./hhmm/hhmm-decoder":114,"./set/xmm-phrase":116,"./set/xmm-set":117}],116:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _typeof2 = require('babel-runtime/helpers/typeof');

var _typeof3 = _interopRequireDefault(_typeof2);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/**
 * XMM compatible phrase builder utility <br />
 * Class to ease the creation of XMM compatible data recordings, aka phrases. <br />
 * Phrases are typically arrays (flattened matrices) of size N * M,
 * N being the size of a vector element, and M the length of the phrase itself,
 * wrapped together in an object with a few settings.
 * @class
 */

var PhraseMaker = function () {
  /**
   * XMM phrase configuration object.
   * @typedef XmmPhraseConfig
   * @type {Object}
   * @name XmmPhraseConfig
   * @property {Boolean} bimodal - Indicates wether phrase data should be considered bimodal.
   * If true, the <code>dimension_input</code> property will be taken into account.
   * @property {Number} dimension - Size of a phrase's vector element.
   * @property {Number} dimensionInput - Size of the part of an input vector element that should be used for training.
   * This implies that the rest of the vector (of size <code>dimension - dimension_input</code>)
   * will be used for regression. Only taken into account if <code>bimodal</code> is true.
   * @property {Array.String} column_names - Array of string identifiers describing each scalar of the phrase's vector elements.
   * Typically of size <code>dimension</code>.
   * @property {String} label - The string identifier of the class the phrase belongs to.
   */

  /**
   * @param {XmmPhraseConfig} options - Default phrase configuration.
   * @see {@link config}.
   */
  function PhraseMaker() {
    var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
    (0, _classCallCheck3.default)(this, PhraseMaker);

    var defaults = {
      bimodal: false,
      dimension: 1,
      dimensionInput: 0,
      columnNames: [''],
      label: ''
    };

    this._config = defaults;
    this._setConfig(options);

    this.reset();
  }

  /**
   * XMM phrase configuration object.
   * Only legal fields will be checked before being added to the config, others will be ignored
   * @type {XmmPhraseConfig}
   * @deprecated since version 0.2.0
   */


  (0, _createClass3.default)(PhraseMaker, [{
    key: 'getConfig',


    // new API (b-ma tip : don' use accessors if there is some magic behind,
    // which is the case in _setConfig)
    // keeping accessors for backwards compatibility

    /**
     * Returns the current configuration.
     */
    value: function getConfig() {
      return this._config;
    }

    /**
     * Updates the current configuration with the provided information.
     * @param {XmmPhraseConfig} options
     */

  }, {
    key: 'setConfig',
    value: function setConfig() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._setConfig(options);
    }

    /**
     * A valid XMM phrase, ready to be processed by the XMM library.
     * @typedef XmmPhrase
     * @type {Object}
     * @name XmmPhrase
     * @property {Boolean} bimodal - Indicates wether phrase data should be considered bimodal.
     * If true, the <code>dimension_input</code> property will be taken into account.
     * @property {Number} dimension - Size of a phrase's vector element.
     * @property {Number} dimension_input - Size of the part of an input vector element that should be used for training.
     * This implies that the rest of the vector (of size <code>dimension - dimension_input</code>)
     * will be used for regression. Only taken into account if <code>bimodal</code> is true.
     * @property {Array.String} column_names - Array of string identifiers describing each scalar of the phrase's vector elements.
     * Typically of size <code>dimension</code>.
     * @property {String} label - The string identifier of the class the phrase belongs to.
     * @property {Array.Number} data - The phrase's data, containing all the vectors flattened into a single one.
     * Only taken into account if <code>bimodal</code> is false.
     * @property {Array.Number} data_input - The phrase's data which will be used for training, flattened into a single vector.
     * Only taken into account if <code>bimodal</code> is true.
     * @property {Array.Number} data_output - The phrase's data which will be used for regression, flattened into a single vector.
     * Only taken into account if <code>bimodal</code> is true.
     * @property {Number} length - The length of the phrase, e.g. one of the following :
     * <li style="list-style-type: none;">
     * <ul><code>data.length / dimension</code></ul>
     * <ul><code>data_input.length / dimension_input</code></ul>
     * <ul><code>data_output.length / dimension_output</code></ul>
     * </li>
     */

    /**
     * A valid XMM phrase, ready to be processed by the XMM library.
     * @readonly
     * @type {XmmPhrase}
     */

  }, {
    key: '_getPhrase',


    /** @private */
    value: function _getPhrase() {
      return {
        bimodal: this._config.bimodal,
        column_names: this._config.columnNames,
        dimension: this._config.dimension,
        dimension_input: this._config.dimensionInput,
        label: this._config.label,
        data: this._data.slice(0),
        data_input: this._dataIn.slice(0),
        data_output: this._dataOut.slice(0),
        length: this._config.bimodal ? this._dataIn.length / this._config.dimensionInput : this._data.length / this._config.dimension
      };
    }
    /**
     * Append an observation vector to the phrase's data. Must be of length <code>dimension</code>.
     * @param {Array.Number} obs - An input vector, aka observation. If <code>bimodal</code> is true
     * @throws Will throw an error if the input vector doesn't match the config.
     */

  }, {
    key: 'addObservation',
    value: function addObservation(obs) {
      // check input validity
      var badLengthMsg = 'Bad input length: observation length must match phrase dimension';
      var badTypeMsg = 'Bad data type: all observation values must be numbers';

      if (obs.length !== this._config.dimension || typeof obs === 'number' && this._config.dimension !== 1) {
        throw new Error(badLengthMsg);
      }

      if (Array.isArray(obs)) {
        var _iteratorNormalCompletion = true;
        var _didIteratorError = false;
        var _iteratorError = undefined;

        try {
          for (var _iterator = (0, _getIterator3.default)(obs), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
            var val = _step.value;

            if (typeof val !== 'number') {
              throw new Error(badTypeMsg);
            }
          }
        } catch (err) {
          _didIteratorError = true;
          _iteratorError = err;
        } finally {
          try {
            if (!_iteratorNormalCompletion && _iterator.return) {
              _iterator.return();
            }
          } finally {
            if (_didIteratorError) {
              throw _iteratorError;
            }
          }
        }
      } else if ((0, _typeof3.default)(obs !== 'number')) {
        throw new Error(badTypeMsg);
      }

      // add value(s) to internal arrays
      if (this._config.bimodal) {
        this._dataIn = this._dataIn.concat(obs.slice(0, this._config.dimensionInput));
        this._dataOut = this._dataOut.concat(obs.slice(this._config.dimensionInput));
      } else {
        if (Array.isArray(obs)) {
          this._data = this._data.concat(obs);
        } else {
          this._data.push(obs);
        }
      }
    }

    /**
     * Clear the phrase's data so that a new one is ready to be recorded.
     */

  }, {
    key: 'reset',
    value: function reset() {
      this._data = [];
      this._dataIn = [];
      this._dataOut = [];
    }

    /** @private */

  }, {
    key: '_setConfig',
    value: function _setConfig() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      for (var prop in options) {
        if (prop === 'bimodal' && typeof options[prop] === 'boolean') {
          this._config[prop] = options[prop];
        } else if (prop === 'dimension' && (0, _isInteger2.default)(options[prop])) {
          this._config[prop] = options[prop];
        } else if (prop === 'dimensionInput' && (0, _isInteger2.default)(options[prop])) {
          this._config[prop] = options[prop];
        } else if (prop === 'columnNames' && Array.isArray(options[prop])) {
          this._config[prop] = options[prop].slice(0);
        } else if (prop === 'label' && typeof options[prop] === 'string') {
          this._config[prop] = options[prop];
        }
      }
    }
  }, {
    key: 'config',
    get: function get() {
      return this._config;
    },
    set: function set() {
      var options = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];

      this._setConfig(options);
    }
  }, {
    key: 'phrase',
    get: function get() {
      return this._getPhrase();
    }
  }]);
  return PhraseMaker;
}();

;

exports.default = PhraseMaker;

},{"babel-runtime/core-js/get-iterator":5,"babel-runtime/core-js/number/is-integer":7,"babel-runtime/helpers/classCallCheck":16,"babel-runtime/helpers/createClass":17,"babel-runtime/helpers/typeof":21}],117:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _stringify = require('babel-runtime/core-js/json/stringify');

var _stringify2 = _interopRequireDefault(_stringify);

var _getIterator2 = require('babel-runtime/core-js/get-iterator');

var _getIterator3 = _interopRequireDefault(_getIterator2);

var _classCallCheck2 = require('babel-runtime/helpers/classCallCheck');

var _classCallCheck3 = _interopRequireDefault(_classCallCheck2);

var _createClass2 = require('babel-runtime/helpers/createClass');

var _createClass3 = _interopRequireDefault(_createClass2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// An xmm-compatible training set must have the following fields :
// - bimodal (boolean)
// - column_names (array of strings)
// - dimension (integer)
// - dimension_input (integer < dimension)
// - phrases (array of phrases)
//   - on export, each phrase must have an extra "index" field
//     => when the class returns a set with getPhrasesOfLabel or getTrainingSet,
//        it should add these index fields before returning the result.
//     => when a set is added with addTrainingSet, the indexes must be removed
//        from the phrases before they are added to the internal array

/**
 * XMM compatible training set manager utility <br />
 * Class to ease the creation of XMM compatible training sets. <br />
 * Phrases should be generated with the PhraseMaker class or the original XMM library.
 */
var SetMaker = function () {
  function SetMaker() {
    (0, _classCallCheck3.default)(this, SetMaker);

    this._config = {};
    this._phrases = [];
  }

  /**
   * The current total number of phrases in the set.
   * @readonly
   */


  (0, _createClass3.default)(SetMaker, [{
    key: 'addPhrase',


    /**
     * Add an XMM phrase to the current set.
     * @param {XmmPhrase} phrase - An XMM compatible phrase (ie created with the PhraseMaker class)
     */
    value: function addPhrase(phrase) {
      if (this._phrases.length === 0) {
        this._setConfigFrom(phrase);
      } else if (!this._checkCompatibility(phrase)) {
        throw new Error('Bad phrase format: added phrase must match current set configuration');
      }
      this._phrases.push(phrase);
    }

    /**
     * Add all phrases from another training set.
     * @param {XmmTrainingSet} set - An XMM compatible training set.
     */

  }, {
    key: 'addTrainingSet',
    value: function addTrainingSet(set) {
      if (this._phrases.length === 0) {
        this._setConfigFrom(set);
      } else if (!this._checkCompatibility(set)) {
        throw new Error('Bad set format: added set must match current set configuration');
      }

      var phrases = set['phrases'];
      var _iteratorNormalCompletion = true;
      var _didIteratorError = false;
      var _iteratorError = undefined;

      try {
        for (var _iterator = (0, _getIterator3.default)(phrases), _step; !(_iteratorNormalCompletion = (_step = _iterator.next()).done); _iteratorNormalCompletion = true) {
          var phrase = _step.value;

          this._phrases.push(phrase);
        }
      } catch (err) {
        _didIteratorError = true;
        _iteratorError = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion && _iterator.return) {
            _iterator.return();
          }
        } finally {
          if (_didIteratorError) {
            throw _iteratorError;
          }
        }
      }
    }

    /**
     * Get phrase at a particular index.
     * @param {Number} index - The index of the phrase to retrieve.
     * @returns {XmmPhrase}
     */

  }, {
    key: 'getPhrase',
    value: function getPhrase(index) {
      if (index > -1 && index < this._phrases.length) {
        // return a new copy of the phrase :
        return JSON.parse(JSON.srtingify(this._phrases[index]));
      }
      return null;
    }

    /**
     * Remove phrase at a particular index.
     * @param {Number} index - The index of the phrase to remove.
     */

  }, {
    key: 'removePhrase',
    value: function removePhrase(index) {
      if (index > -1 && index < this._phrases.length) {
        this._phrases.splice(index, 1);
      }
    }

    /**
     * Return the subset of phrases of a particular label.
     * @param {String} label - The label of the phrases from which to generate the sub-training set.
     * @returns {XmmTrainingSet}
     */

  }, {
    key: 'getPhrasesOfLabel',
    value: function getPhrasesOfLabel(label) {
      var res = {};

      for (var prop in this._config) {
        res[prop] = this._config[prop];
      }

      res['phrases'] = [];
      var index = 0;

      var _iteratorNormalCompletion2 = true;
      var _didIteratorError2 = false;
      var _iteratorError2 = undefined;

      try {
        for (var _iterator2 = (0, _getIterator3.default)(this._phrases), _step2; !(_iteratorNormalCompletion2 = (_step2 = _iterator2.next()).done); _iteratorNormalCompletion2 = true) {
          var phrase = _step2.value;

          if (phrase['label'] === label) {
            var p = JSON.parse((0, _stringify2.default)(phrase));
            p['index'] = index++;
            res['phrases'].push(p);
          }
        }
      } catch (err) {
        _didIteratorError2 = true;
        _iteratorError2 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion2 && _iterator2.return) {
            _iterator2.return();
          }
        } finally {
          if (_didIteratorError2) {
            throw _iteratorError2;
          }
        }
      }

      return res;
    }

    /**
     * Remove all phrases of a particular label.
     * @param {String} label - The label of the phrases to remove.
     */

  }, {
    key: 'removePhrasesOfLabel',
    value: function removePhrasesOfLabel(label) {
      for (var i = 0; i < this._phrases.length; i++) {
        if (this._phrases[i]['label'] === label) {
          this.phrases.splice(i, 1);
        }
      }
    }

    /**
     * Return the current training set.
     * @returns {TrainingSet}
     */

  }, {
    key: 'getTrainingSet',
    value: function getTrainingSet() {
      var res = {};

      for (var prop in this._config) {
        res[prop] = this._config[prop];
      }

      res['phrases'] = [];
      var index = 0;

      var _iteratorNormalCompletion3 = true;
      var _didIteratorError3 = false;
      var _iteratorError3 = undefined;

      try {
        for (var _iterator3 = (0, _getIterator3.default)(this._phrases), _step3; !(_iteratorNormalCompletion3 = (_step3 = _iterator3.next()).done); _iteratorNormalCompletion3 = true) {
          var phrase = _step3.value;

          var p = JSON.parse((0, _stringify2.default)(phrase));
          p['index'] = index++;
          res['phrases'].push(p);
        }
      } catch (err) {
        _didIteratorError3 = true;
        _iteratorError3 = err;
      } finally {
        try {
          if (!_iteratorNormalCompletion3 && _iterator3.return) {
            _iterator3.return();
          }
        } finally {
          if (_didIteratorError3) {
            throw _iteratorError3;
          }
        }
      }

      return res;
    }

    /**
     * Clear the whole set.
     */

  }, {
    key: 'clear',
    value: function clear() {
      this._config = {};
      this._phrases = [];
    }

    /**
     * Check the config of a phrase or training set before applying it
     * to the current class.
     * Throw errors if not valid ?
     * @private
     */

  }, {
    key: '_setConfigFrom',
    value: function _setConfigFrom(obj) {
      for (var prop in obj) {
        if (prop === 'bimodal' && typeof obj['bimodal'] === 'boolean') {
          this._config[prop] = obj[prop];
        } else if (prop === 'column_names' && Array.isArray(obj[prop])) {
          this._config[prop] = obj[prop].slice(0);
        } else if (prop === 'dimension' && (0, _isInteger2.default)(obj[prop])) {
          this._config[prop] = obj[prop];
        } else if (prop === 'dimension_input' && (0, _isInteger2.default)(obj[prop])) {
          this._config[prop] = obj[prop];
        }
      }
    }

    /**
     * Check if the phrase or set is compatible with the current settings.
     * @private
     */

  }, {
    key: '_checkCompatibility',
    value: function _checkCompatibility(obj) {
      if (obj['bimodal'] !== this._config['bimodal'] || obj['dimension'] !== this._config['dimension'] || obj['dimension_input'] !== this._config['dimension_input']) {
        return false;
      }

      var ocn = obj['column_names'];
      var ccn = this._config['column_names'];

      if (ocn.length !== ccn.length) {
        return false;
      } else {
        for (var i = 0; i < ocn.length; i++) {
          if (ocn[i] !== ccn[i]) {
            return false;
          }
        }
      }

      return true;
    }
  }, {
    key: 'size',
    get: function get() {
      return this._phrases.length;
    }
  }]);
  return SetMaker;
}();

;

exports.default = SetMaker;

},{"babel-runtime/core-js/get-iterator":5,"babel-runtime/core-js/json/stringify":6,"babel-runtime/core-js/number/is-integer":7,"babel-runtime/helpers/classCallCheck":16,"babel-runtime/helpers/createClass":17}],118:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
/**
 *  functions used for decoding, translated from XMM
 */

// TODO : write methods for generating modelResults object

// get the inverse_covariances matrix of each of the GMM classes
// for each input data, compute the distance of the frame to each of the GMMs
// with the following equations :

// ================================= //
// as in xmmGaussianDistribution.cpp //
// ================================= //


// from xmmGaussianDistribution::regression
var gmmComponentRegression = exports.gmmComponentRegression = function gmmComponentRegression(obsIn, predictOut, c) {
  // export const gmmComponentRegression = (obsIn, predictOut, component) => {
  //   const c = component;
  var dim = c.dimension;
  var dimIn = c.dimension_input;
  var dimOut = dim - dimIn;
  //let predictedOut = [];
  predictOut = new Array(dimOut);

  //----------------------------------------------------------------------- full
  if (c.covariance_mode === 0) {
    for (var d = 0; d < dimOut; d++) {
      predictOut[d] = c.mean[dimIn + d];
      for (var e = 0; e < dimIn; e++) {
        var tmp = 0.0;
        for (var f = 0; f < dimIn; f++) {
          tmp += c.inverse_covariance_input[e * dimIn + f] * (obsIn[f] - c.mean[f]);
        }
        predictOut[d] += c.covariance[(d + dimIn) * dim + e] * tmp;
      }
    }
    //------------------------------------------------------------------- diagonal
  } else {
    for (var _d = 0; _d < dimOut; _d++) {
      predictOut[_d] = c.covariance[_d + dimIn];
    }
  }
  //return predictionOut;
};

var gmmComponentLikelihood = exports.gmmComponentLikelihood = function gmmComponentLikelihood(obsIn, c) {
  // export const gmmComponentLikelihood = (obsIn, component) => {
  //   const c = component;
  // if(c.covariance_determinant === 0) {
  //  return undefined;
  // }
  var euclidianDistance = 0.0;

  //----------------------------------------------------------------------- full
  if (c.covariance_mode === 0) {
    for (var l = 0; l < c.dimension; l++) {
      var tmp = 0.0;
      for (var k = 0; k < c.dimension; k++) {
        tmp += c.inverse_covariance[l * c.dimension + k] * (obsIn[k] - c.mean[k]);
      }
      euclidianDistance += (obsIn[l] - c.mean[l]) * tmp;
    }
    //------------------------------------------------------------------- diagonal
  } else {
    for (var _l = 0; _l < c.dimension; _l++) {
      euclidianDistance += c.inverse_covariance[_l] * (obsIn[_l] - c.mean[_l]) * (obsIn[_l] - c.mean[_l]);
    }
  }

  var p = Math.exp(-0.5 * euclidianDistance) / Math.sqrt(c.covariance_determinant * Math.pow(2 * Math.PI, c.dimension));

  if (p < 1e-180 || isNaN(p) || isNaN(Math.abs(p))) {
    p = 1e-180;
  }
  return p;
};

var gmmComponentLikelihoodInput = exports.gmmComponentLikelihoodInput = function gmmComponentLikelihoodInput(obsIn, c) {
  // export const gmmComponentLikelihoodInput = (obsIn, component) => {
  //   const c = component;
  // if(c.covariance_determinant === 0) {
  //  return undefined;
  // }
  var euclidianDistance = 0.0;
  //----------------------------------------------------------------------- full
  if (c.covariance_mode === 0) {
    for (var l = 0; l < c.dimension_input; l++) {
      var tmp = 0.0;
      for (var k = 0; k < c.dimension_input; k++) {
        tmp += c.inverse_covariance_input[l * c.dimension_input + k] * (obsIn[k] - c.mean[k]);
      }
      euclidianDistance += (obsIn[l] - c.mean[l]) * tmp;
    }
    //------------------------------------------------------------------- diagonal
  } else {
    for (var _l2 = 0; _l2 < c.dimension_input; _l2++) {
      // or would it be c.inverse_covariance_input[l] ?
      // sounds logic ... but, according to Jules (cf e-mail),
      // not really important.
      euclidianDistance += c.inverse_covariance_input[_l2] * (obsIn[_l2] - c.mean[_l2]) * (obsIn[_l2] - c.mean[_l2]);
    }
  }

  var p = Math.exp(-0.5 * euclidianDistance) / Math.sqrt(c.covariance_determinant_input * Math.pow(2 * Math.PI, c.dimension_input));

  if (p < 1e-180 || isNaN(p) || isNaN(Math.abs(p))) {
    p = 1e-180;
  }
  return p;
};

var gmmComponentLikelihoodBimodal = exports.gmmComponentLikelihoodBimodal = function gmmComponentLikelihoodBimodal(obsIn, obsOut, c) {
  // export const gmmComponentLikelihoodBimodal = (obsIn, obsOut, component) => {
  //   const c = component;
  // if(c.covariance_determinant === 0) {
  //  return undefined;
  // }
  var dim = c.dimension;
  var dimIn = c.dimension_input;
  var dimOut = dim - dimIn;
  var euclidianDistance = 0.0;

  //----------------------------------------------------------------------- full
  if (c.covariance_mode === 0) {
    for (var l = 0; l < dim; l++) {
      var tmp = 0.0;
      for (var k = 0; k < c.dimension_input; k++) {
        tmp += c.inverse_covariance[l * dim + k] * (obsIn[k] - c.mean[k]);
      }
      for (var _k = 0; _k < dimOut; _k++) {
        tmp += c.inverse_covariance[l * dim + dimIn + _k] * (obsOut[_k] - c.mean[dimIn + _k]);
      }
      if (l < dimIn) {
        euclidianDistance += (obsIn[l] - c.mean[l]) * tmp;
      } else {
        euclidianDistance += (obsOut[l - dimIn] - c.mean[l]) * tmp;
      }
    }
    //------------------------------------------------------------------- diagonal
  } else {
    for (var _l3 = 0; _l3 < dimIn; _l3++) {
      euclidianDistance += c.inverse_covariance[_l3] * (obsIn[_l3] - c.mean[_l3]) * (obsIn[_l3] - c.mean[_l3]);
    }
    for (var _l4 = c.dimension_input; _l4 < c.dimension; _l4++) {
      var sq = (obsOut[_l4 - dimIn] - c.mean[_l4]) * (obsOut[_l4 - dimIn] - c.mean[_l4]);
      euclidianDistance += c.inverse_covariance[_l4] * sq;
    }
  }

  var p = Math.exp(-0.5 * euclidianDistance) / Math.sqrt(c.covariance_determinant * Math.pow(2 * Math.PI, c.dimension));

  if (p < 1e-180 || isNaN(p) || isNaN(Math.abs(p))) {
    p = 1e-180;
  }
  return p;
};

// ================================= //
//    as in xmmGmmSingleClass.cpp    //
// ================================= //

var gmmRegression = exports.gmmRegression = function gmmRegression(obsIn, m, mRes) {
  // export const gmmRegression = (obsIn, singleGmm, singleGmmRes) => {
  //   const m = singleGmm;
  //   const mRes = singleGmmResults;

  var dim = m.components[0].dimension;
  var dimIn = m.components[0].dimension_input;
  var dimOut = dim - dimIn;

  mRes.output_values = new Array(dimOut);
  for (var i = 0; i < dimOut; i++) {
    mRes.output_values[i] = 0.0;
  }

  var outCovarSize = void 0;
  //----------------------------------------------------------------------- full
  if (m.parameters.covariance_mode === 0) {
    outCovarSize = dimOut * dimOut;
    //------------------------------------------------------------------- diagonal
  } else {
    outCovarSize = dimOut;
  }
  mRes.output_covariance = new Array(outCovarSize);
  for (var _i = 0; _i < outCovarSize; _i++) {
    mRes.output_covariance[_i] = 0.0;
  }

  /*
  // useless : reinstanciated in gmmComponentRegression
  let tmpPredictedOutput = new Array(dimOut);
  for (let i = 0; i < dimOut; i++) {
    tmpPredictedOutput[i] = 0.0;
  }
  */
  var tmpPredictedOutput = void 0;

  for (var c = 0; c < m.components.length; c++) {
    gmmComponentRegression(obsIn, tmpPredictedOutput, m.components[c]);
    var sqbeta = mRes.beta[c] * mRes.beta[c];
    for (var d = 0; d < dimOut; d++) {
      mRes.output_values[d] += mRes.beta[c] * tmpPredictedOutput[d];
      //------------------------------------------------------------------- full
      if (m.parameters.covariance_mode === 0) {
        for (var d2 = 0; d2 < dimOut; d2++) {
          var index = d * dimOut + d2;
          mRes.output_covariance[index] += sqbeta * m.components[c].output_covariance[index];
        }
        //--------------------------------------------------------------- diagonal
      } else {
        mRes.output_covariance[d] += sqbeta * m.components[c].output_covariance[d];
      }
    }
  }
};

var gmmObsProb = exports.gmmObsProb = function gmmObsProb(obsIn, singleGmm) {
  var component = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];

  var coeffs = singleGmm.mixture_coeffs;
  //console.log(coeffs);
  //if(coeffs === undefined) coeffs = [1];
  var components = singleGmm.components;
  var p = 0.0;

  if (component < 0) {
    for (var c = 0; c < components.length; c++) {
      p += gmmObsProb(obsIn, singleGmm, c);
    }
  } else {
    p = coeffs[component] * gmmComponentLikelihood(obsIn, components[component]);
  }
  return p;
};

var gmmObsProbInput = exports.gmmObsProbInput = function gmmObsProbInput(obsIn, singleGmm) {
  var component = arguments.length <= 2 || arguments[2] === undefined ? -1 : arguments[2];

  var coeffs = singleGmm.mixture_coeffs;
  var components = singleGmm.components;
  var p = 0.0;

  if (component < 0) {
    for (var c = 0; c < components.length; c++) {
      p += gmmObsProbInput(obsIn, singleGmm, c);
    }
  } else {
    p = coeffs[component] * gmmComponentLikelihoodInput(obsIn, components[component]);
  }
  return p;
};

var gmmObsProbBimodal = exports.gmmObsProbBimodal = function gmmObsProbBimodal(obsIn, obsOut, singleGmm) {
  var component = arguments.length <= 3 || arguments[3] === undefined ? -1 : arguments[3];

  var coeffs = singleGmm.mixture_coeffs;
  var components = singleGmm.components;
  var p = 0.0;

  if (component < 0) {
    for (var c = 0; c < components.length; c++) {
      p += gmmObsProbBimodal(obsIn, obsOut, singleGmm, c);
    }
  } else {
    p = coeffs[component] * gmmComponentLikelihoodBimodal(obsIn, obsOut, components[component]);
  }
  return p;
};

var gmmLikelihood = exports.gmmLikelihood = function gmmLikelihood(obsIn, singleGmm, singleGmmRes) {
  var obsOut = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  var coeffs = singleGmm.mixture_coeffs;
  var components = singleGmm.components;
  var mRes = singleGmmRes;
  var likelihood = 0.0;

  for (var c = 0; c < components.length; c++) {
    //------------------------------------------------------------------ bimodal
    if (singleClassGmmModel.components[c].bimodal) {
      if (obsOut.length === 0) {
        mRes.beta[c] = gmmObsProbInput(obsIn, singleGmm, c);
      } else {
        mRes.beta[c] = gmmObsProbBimodal(obsIn, obsOut, singleGmm, c);
      }
      //----------------------------------------------------------------- unimodal
    } else {
      mRes.beta[c] = gmmObsProb(obsIn, singleGmm, c);
    }
    likelihood += mRes.beta[c];
  }
  for (var _c = 0; _c < coeffs.length; _c++) {
    mRes.beta[_c] /= likelihood;
  }

  mRes.instant_likelihood = likelihood;

  // as in xmm::SingleClassGMM::updateResults :
  // ------------------------------------------
  //res.likelihood_buffer.unshift(likelihood);
  //res.likelihood_buffer.length--;
  // THIS IS BETTER (circular buffer)
  mRes.likelihood_buffer[mRes.likelihood_buffer_index] = likelihood;
  mRes.likelihood_buffer_index = (mRes.likelihood_buffer_index + 1) % mRes.likelihood_buffer.length;
  // sum all array values :
  mRes.log_likelihood = mRes.likelihood_buffer.reduce(function (a, b) {
    return a + b;
  }, 0);
  mRes.log_likelihood /= mRes.likelihood_buffer.length;

  return likelihood;
};

// ================================= //
//          as in xmmGmm.cpp         //
// ================================= //

var gmmFilter = exports.gmmFilter = function gmmFilter(obsIn, gmm, gmmRes) {
  var likelihoods = [];
  var models = gmm.models;
  var mRes = gmmRes;

  var maxLogLikelihood = 0;
  var normConstInstant = 0;
  var normConstSmoothed = 0;

  for (var i = 0; i < models.length; i++) {
    var singleRes = mRes.singleClassGmmModelResults[i];
    mRes.instant_likelihoods[i] = gmmLikelihood(obsIn, models[i], singleRes);

    // as in xmm::GMM::updateResults :
    // -------------------------------
    mRes.smoothed_log_likelihoods[i] = singleRes.log_likelihood;
    mRes.smoothed_likelihoods[i] = Math.exp(mRes.smoothed_log_likelihoods[i]);
    mRes.instant_normalized_likelihoods[i] = mRes.instant_likelihoods[i];
    mRes.smoothed_normalized_likelihoods[i] = mRes.smoothed_likelihoods[i];

    normConstInstant += mRes.instant_normalized_likelihoods[i];
    normConstSmoothed += mRes.smoothed_normalized_likelihoods[i];

    if (i == 0 || mRes.smoothed_log_likelihoods[i] > maxLogLikelihood) {
      maxLogLikelihood = mRes.smoothed_log_likelihoods[i];
      mRes.likeliest = i;
    }
  }

  for (var _i2 = 0; _i2 < models.length; _i2++) {
    mRes.instant_normalized_likelihoods[_i2] /= normConstInstant;
    mRes.smoothed_normalized_likelihoods[_i2] /= normConstSmoothed;
  }

  // if model is bimodal :
  // ---------------------
  var params = gmm.shared_parameters;
  var config = gmm.configuration;

  if (params.bimodal) {
    var dim = params.dimension;
    var dimIn = params.dimension_input;
    var dimOut = dim - dimIn;

    //---------------------------------------------------------------- likeliest
    if (config.multiClass_regression_estimator === 0) {
      mRes.output_values = mRes.singleClassModelResults[mRes.likeliest].output_values;
      mRes.output_covariance = mRes.singleClassModelResults[mRes.likeliest].output_covariance;
      //------------------------------------------------------------------ mixture
    } else {
      // zero-fill output_values and output_covariance
      mRes.output_values = new Array(dimOut);
      for (var _i3 = 0; _i3 < dimOut; _i3++) {
        mRes.output_values[_i3] = 0.0;
      }

      var outCovarSize = void 0;
      //------------------------------------------------------------------- full
      if (config.default_parameters.covariance_mode == 0) {
        outCovarSize = dimOut * dimOut;
        //--------------------------------------------------------------- diagonal
      } else {
        outCovarSize = dimOut;
      }
      mRes.output_covariance = new Array(outCovarSize);
      for (var _i4 = 0; _i4 < outCovarSize; _i4++) {
        mRes.output_covariance[_i4] = 0.0;
      }

      // compute the actual values :
      for (var _i5 = 0; _i5 < models.length; _i5++) {
        var smoothNormLikelihood = mRes.smoothed_normalized_likelihoods[_i5];
        var _singleRes = mRes.singleClassGmmModelResults[_i5];
        for (var d = 0; d < dimOut; _i5++) {
          mRes.output_values[d] += smoothNormLikelihood * _singleRes.output_values[d];
          //--------------------------------------------------------------- full
          if (config.default_parameters.covariance_mode === 0) {
            for (var d2 = 0; d2 < dimOut; d2++) {
              var index = d * dimOut + d2;
              mRes.output_covariance[index] += smoothNormLikelihood * _singleRes.output_covariance[index];
            }
            //----------------------------------------------------------- diagonal
          } else {
            mRes.output_covariance[d] += smoothNormLikelihood * _singleRes.output_covariance[d];
          }
        }
      }
    }
  } /* end if(params.bimodal) */
};

},{}],119:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.hhmmFilter = exports.hhmmUpdateResults = exports.hhmmForwardUpdate = exports.hhmmForwardInit = exports.hhmmLikelihoodAlpha = exports.hmmFilter = exports.hmmUpdateResults = exports.hmmUpdateAlphaWindow = exports.hmmForwardUpdate = exports.hmmForwardInit = exports.hmmRegression = undefined;

var _gmmUtils = require('./gmm-utils');

var gmmUtils = _interopRequireWildcard(_gmmUtils);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

/**
 *  functions used for decoding, translated from XMM
 */

// ================================= //
//    as in xmmHmmSingleClass.cpp    //
// ================================= //

var hmmRegression = exports.hmmRegression = function hmmRegression(obsIn, m, mRes) {
  // export const hmmRegression = (obsIn, hmm, hmmRes) => {
  //   const m = hmm;
  //   const mRes = hmmRes;
  var dim = m.states[0].components[0].dimension;
  var dimIn = m.states[0].components[0].dimension_input;
  var dimOut = dim - dimIn;

  var outCovarSize = void 0;
  //----------------------------------------------------------------------- full
  if (m.states[0].components[0].covariance_mode === 0) {
    outCovarSize = dimOut * dimOut;
    //------------------------------------------------------------------- diagonal
  } else {
    outCovarSize = dimOut;
  }

  mRes.output_values = new Array(dimOut);
  for (var i = 0; i < dimOut; i++) {
    mRes.output_values[i] = 0.0;
  }
  mRes.output_covariance = new Array(outCovarSize);
  for (var _i = 0; _i < outCovarSize; _i++) {
    mRes.output_covariance[_i] = 0.0;
  }

  //------------------------------------------------------------------ likeliest
  if (m.parameters.regression_estimator === 2) {
    gmmUtils.gmmLikelihood(obsIn, m.states[mRes.likeliest_state], mRes.singleClassGmmModelResults[mRes.likeliest_state]);
    gmmUtils.gmmRegression(obsIn, m.states[mRes.likeliest_state], mRes.singleClassGmmModelResults[mRes.likeliest_state]);
    mRes.output_values = m.states[mRes.likeliest_state].output_values.slice(0);
    return;
  }

  var clipMinState = m.parameters.regression_estimator == 0 ?
  //----------------------------------------------------- full
  0
  //------------------------------------------------- windowed
  : mRes.window_minindex;

  var clipMaxState = m.parameters.regression_estimator == 0 ?
  //----------------------------------------------------- full
  m.states.length
  //------------------------------------------------- windowed
  : mRes.window_maxindex;

  var normConstant = m.parameters.regression_estimator == 0 ?
  //----------------------------------------------------- full
  1.0
  //------------------------------------------------- windowed
  : mRes.window_normalization_constant;

  if (normConstant <= 0.0) {
    normConstant = 1.;
  }

  for (var _i2 = clipMinState; _i2 < clipMaxState; _i2++) {
    gmmUtils.gmmLikelihood(obsIn, m.states[_i2], mRes.singleClassGmmModelResults[_i2]);
    gmmUtils.gmmRegression(obsIn, m.states[_i2], mRes.singleClassGmmModelResults[_i2]);
    var tmpPredictedOutput = mRes.singleClassGmmModelResults[_i2].output_values.slice(0);

    for (var d = 0; d < dimOut; d++) {
      //----------------------------------------------------------- hierarchical
      if (mRes.hierarchical) {
        mRes.output_values[d] += (mRes.alpha_h[0][_i2] + mRes.alpha_h[1][_i2]) * tmpPredictedOutput[d] / normConstant;
        //----------------------------------------------------------------- full
        if (m.parameters.covariance_mode === 0) {
          for (var d2 = 0; d2 < dimOut; d2++) {
            mRes.output_covariance[d * dimOut + d2] += (mRes.alpha_h[0][_i2] + mRes.alpha_h[1][_i2]) * (mRes.alpha_h[0][_i2] + mRes.alpha_h[1][_i2]) * mRes.singleClassGmmModelResults[_i2].output_covariance[d * dimOut + d2] / normConstant;
          }
          //------------------------------------------------------------- diagonal
        } else {
          mRes.output_covariance[d] += (mRes.alpha_h[0][_i2] + mRes.alpha_h[1][_i2]) * (mRes.alpha_h[0][_i2] + mRes.alpha_h[1][_i2]) * mRes.singleClassGmmModelResults[_i2].output_covariance[d] / normConstant;
        }
        //------------------------------------------------------- non-hierarchical
      } else {
        mRes.output_values[d] += mRes.alpha[_i2] * tmpPredictedOutput[d] / normConstant;
        //----------------------------------------------------------------- full
        if (m.parameters.covariance_mode === 0) {
          for (var _d = 0; _d < dimOut; _d++) {
            mRes.output_covariance[d * dimOut + _d] += mRes.alpha[_i2] * mRes.alpha[_i2] * mRes.singleClassGmmModelResults[_i2].output_covariance[d * dimOut + _d] / normConstant;
          }
          //----------------------------------------------------- diagonal
        } else {
          mRes.output_covariance[d] += mRes.alpha[_i2] * mRes.alpha[_i2] * mRes.singleClassGmmModelResults.output_covariance[d] / normConstant;
        }
      }
    }
  }
};

var hmmForwardInit = exports.hmmForwardInit = function hmmForwardInit(obsIn, m, mRes) {
  var obsOut = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  // export const hmmForwardInit = (obsIn, hmm, hmmRes, obsOut = []) => {
  //   const m = hmm;
  //   const mRes = hmmRes;
  var nstates = m.parameters.states;
  var normConst = 0.0;

  //-------------------------------------------------------------------- ergodic        
  if (m.parameters.transition_mode === 0) {
    for (var i = 0; i < nstates; i++) {
      //---------------------------------------------------------------- bimodal        
      if (m.states[i].components[0].bimodal) {
        if (obsOut.length > 0) {
          mRes.alpha[i] = m.prior[i] * gmmUtils.gmmObsProbBimodal(obsIn, obsOut, m.states[i]);
        } else {
          mRes.alpha[i] = m.prior[i] * gmmUtils.gmmObsProbInput(obsIn, m.states[i]);
        }
        //--------------------------------------------------------------- unimodal        
      } else {
        mRes.alpha[i] = m.prior[i] * gmmUtils.gmmObsProb(obsIn, m.states[i]);
      }
      normConst += mRes.alpha[i];
    }
    //----------------------------------------------------------------- left-right        
  } else {
    for (var _i3 = 0; _i3 < mRes.alpha.length; _i3++) {
      mRes.alpha[_i3] = 0.0;
    }
    //------------------------------------------------------------------ bimodal        
    if (m.states[0].components[0].bimodal) {
      if (obsOut.length > 0) {
        mRes.alpha[0] = gmmUtils.gmmObsProbBimodal(obsIn, obsOut, m.states[0]);
      } else {
        mRes.alpha[0] = gmmUtils.gmmObsProbInput(obsIn, m.states[0]);
      }
      //----------------------------------------------------------------- unimodal        
    } else {
      mRes.alpha[0] = gmmUtils.gmmObsProb(obsIn, m.states[0]);
    }
    normConst += mRes.alpha[0];
  }

  if (normConst > 0) {
    for (var _i4 = 0; _i4 < nstates; _i4++) {
      mRes.alpha[_i4] /= normConst;
    }
    return 1.0 / normConst;
  } else {
    for (var _i5 = 0; _i5 < nstates; _i5++) {
      mRes.alpha[_i5] = 1.0 / nstates;
    }
    return 1.0;
  }
};

var hmmForwardUpdate = exports.hmmForwardUpdate = function hmmForwardUpdate(obsIn, m, mRes) {
  var obsOut = arguments.length <= 3 || arguments[3] === undefined ? [] : arguments[3];

  // export const hmmForwardUpdate = (obsIn, hmm, hmmRes, obsOut = []) => {
  //   const m = hmm;
  //   const mRes = hmmRes;
  var nstates = m.parameters.states;
  var normConst = 0.0;

  mRes.previous_alpha = mRes.alpha.slice(0);
  for (var i = 0; i < nstates; i++) {
    mRes.alpha[i] = 0;
    //------------------------------------------------------------------ ergodic
    if (m.parameters.transition_mode === 0) {
      for (var j = 0; j < nstates; j++) {
        mRes.alpha[i] += mRes.previous_alpha[j] * mRes.transition[j * nstates + i];
      }
      //--------------------------------------------------------------- left-right
    } else {
      mRes.alpha[i] += mRes.previous_alpha[i] * mRes.transition[i * 2];
      if (i > 0) {
        mRes.alpha[i] += mRes.previous_alpha[i - 1] * mRes.transition[(i - 1) * 2 + 1];
      } else {
        mRes.alpha[0] += mRes.previous_alpha[nstates - 1] * mRes.transition[nstates * 2 - 1];
      }
    }

    //------------------------------------------------------------------ bimodal        
    if (m.states[i].components[0].bimodal) {
      if (obsOut.length > 0) {
        mRes.alpha[i] *= gmmUtils.gmmObsProbBimodal(obsIn, obsOut, m.states[i]);
      } else {
        mRes.alpha[i] *= gmmUtils.gmmObsProbInput(obsIn, m.states[i]);
      }
      //----------------------------------------------------------------- unimodal        
    } else {
      mRes.alpha[i] *= gmmUtils.gmmObsProb(obsIn, m.states[i]);
    }
    normConst += mRes.alpha[i];
  }

  if (normConst > 1e-300) {
    for (var _i6 = 0; _i6 < nstates; _i6++) {
      mRes.alpha[_i6] /= normConst;
    }
    return 1.0 / normConst;
  } else {
    return 0.0;
  }
};

var hmmUpdateAlphaWindow = exports.hmmUpdateAlphaWindow = function hmmUpdateAlphaWindow(m, mRes) {
  // export const hmmUpdateAlphaWindow = (hmm, hmmRes) => {
  //   const m = hmm;
  //   const mRes = hmmRes;
  var nstates = m.parameters.states;

  mRes.likeliest_state = 0;

  var best_alpha = void 0;
  //--------------------------------------------------------------- hierarchical
  if (m.parameters.hierarchical) {
    best_alpha = mRes.alpha_h[0][0] + mRes.alpha_h[1][0];
    //----------------------------------------------------------- non-hierarchical
  } else {
    best_alpha = mRes.alpha[0];
  }

  for (var i = 1; i < nstates; i++) {
    //------------------------------------------------------------- hierarchical
    if (m.parameters.hierarchical) {
      if (mRes.alpha_h[0][i] + mRes.alpha_h[1][i] > best_alpha) {
        best_alpha = mRes.alpha_h[0][i] + mRes.alpha_h[1][i];
        mRes.likeliest_state = i;
      }
      //--------------------------------------------------------- non-hierarchical        
    } else {
      if (mRes.alpha[i] > best_alpha) {
        best_alpha = mRes.alpha[0];
        mRes.likeliest_state = i;
      }
    }
  }

  mRes.window_minindex = mRes.likeliest_state - nstates / 2;
  mRes.window_maxindex = mRes.likeliest_state + nstates / 2;
  mRes.window_minindex = mRes.window_minindex >= 0 ? mRes.window_minindex : 0;
  mRes.window_maxindex = mRes.window_maxindex <= nstates ? mRes.window_maxindex : nstates;
  mRes.window_normalization_constant = 0;
  for (var _i7 = mRes.window_minindex; _i7 < mRes.window_maxindex; _i7++) {
    mRes.window_normalization_constant += mRes.alpha_h[0][_i7] + mRes.alpha_h[1][_i7];
  }
};

var hmmUpdateResults = exports.hmmUpdateResults = function hmmUpdateResults(m, mRes) {
  // export const hmmUpdateResults = (hmm, hmmRes) => {
  //   const m = hmm;
  //   const mRes = hmmRes;

  // IS THIS CORRECT  ? TODO : CHECK AGAIN (seems to have precision issues)
  // AHA ! : NORMALLY LIKELIHOOD_BUFFER IS CIRCULAR : IS IT THE CASE HERE ?
  // SHOULD I "POP_FRONT" ? (seems that yes)

  //res.likelihood_buffer.push(Math.log(res.instant_likelihood));

  // NOW THIS IS BETTER (SHOULD WORK AS INTENDED)
  mRes.likelihood_buffer[mRes.likelihood_buffer_index] = Math.log(mRes.instant_likelihood);
  mRes.likelihood_buffer_index = (mRes.likelihood_buffer_index + 1) % mRes.likelihood_buffer.length;

  mRes.log_likelihood = 0;
  var bufSize = mRes.likelihood_buffer.length;
  for (var i = 0; i < bufSize; i++) {
    mRes.log_likelihood += mRes.likelihood_buffer[i];
  }
  mRes.log_likelihood /= bufSize;

  mRes.progress = 0;
  for (var _i8 = mRes.window_minindex; _i8 < mRes.window_maxindex; _i8++) {
    if (m.parameters.hierarchical) {
      // hierarchical
      mRes.progress += (mRes.alpha_h[0][_i8] + mRes.alpha_h[1][_i8] + mRes.alpha_h[2][_i8]) * _i8 / mRes.window_normalization_constant;
    } else {
      // non hierarchical
      mRes.progress += mRes.alpha[_i8] * _i8 / mRes.window_normalization_constant;
    }
  }
  mRes.progress /= m.parameters.states - 1;
};

var hmmFilter = exports.hmmFilter = function hmmFilter(obsIn, m, mRes) {
  // export const hmmFilter = (obsIn, hmm, hmmRes) => {
  //   const m = hmm;
  //   const mRes = hmmRes;
  var ct = 0.0;
  if (mRes.forward_initialized) {
    ct = hmmForwardUpdate(obsIn, m, mRes);
  } else {
    for (var j = 0; j < mRes.likelihood_buffer.length; j++) {
      mRes.likelihood_buffer[j] = 0.0;
    }
    ct = hmmForwardInit(obsIn, m, mRes);
    mRes.forward_initialized = true;
  }

  mRes.instant_likelihood = 1.0 / ct;
  hmmUpdateAlphaWindow(m, mRes);
  hmmUpdateResults(m, mRes);

  if (m.states[0].components[0].bimodal) {
    hmmRegression(obsIn, m, mRes);
  }

  return mRes.instant_likelihood;
};

// ================================= //
//   as in xmmHierarchicalHmm.cpp    //
// ================================= //

var hhmmLikelihoodAlpha = exports.hhmmLikelihoodAlpha = function hhmmLikelihoodAlpha(exitNum, likelihoodVec, hm, hmRes) {
  // export const hhmmLikelihoodAlpha = (exitNum, likelihoodVec, hhmm, hhmmRes) => {
  //   const m = hhmm;
  //   const mRes = hhmmRes;

  if (exitNum < 0) {
    for (var i = 0; i < hm.models.length; i++) {
      likelihoodVec[i] = 0;
      for (var exit = 0; exit < 3; exit++) {
        for (var k = 0; k < hm.models[i].parameters.states; k++) {
          likelihoodVec[i] += hmRes.singleClassHmmModelResults[i].alpha_h[exit][k];
        }
      }
    }
  } else {
    for (var _i9 = 0; _i9 < hm.models.length; _i9++) {
      likelihoodVec[_i9] = 0;
      for (var _k = 0; _k < hm.models[_i9].parameters.states; _k++) {
        likelihoodVec[_i9] += hmRes.singleClassHmmModelResults[_i9].alpha_h[exitNum][_k];
      }
    }
  }
};

//============================================ FORWARD INIT

var hhmmForwardInit = exports.hhmmForwardInit = function hhmmForwardInit(obsIn, hm, hmRes) {
  // export const hhmmForwardInit = (obsIn, hhmm, hhmmRes) => {
  //   const hm = hhmm;
  //   const hmRes = hhmmRes;
  var norm_const = 0;

  //=================================== initialize alphas
  for (var i = 0; i < hm.models.length; i++) {

    var m = hm.models[i];
    var nstates = m.parameters.states;
    var mRes = hmRes.singleClassHmmModelResults[i];

    for (var j = 0; j < 3; j++) {
      mRes.alpha_h[j] = new Array(nstates);
      for (var k = 0; k < nstates; k++) {
        mRes.alpha_h[j][k] = 0;
      }
    }

    //------------------------------------------------------------------ ergodic
    if (m.parameters.transition_mode == 0) {
      for (var _k2 = 0; _k2 < nstates; _k2++) {
        //-------------------------------------------------------------- bimodal
        if (hm.shared_parameters.bimodal) {
          mRes.alpha_h[0][_k2] = m.prior[_k2] * gmmUtils.gmmObsProbInput(obsIn, m.states[_k2]);
          //------------------------------------------------------------- unimodal
        } else {
          mRes.alpha_h[0][_k2] = m.prior[_k2] * gmmUtils.gmmObsProb(obsIn, m.states[_k2]);
        }
        mRes.instant_likelihood += mRes.alpha_h[0][_k2];
      }
      //--------------------------------------------------------------- left-right
    } else {
      mRes.alpha_h[0][0] = hm.prior[i];
      //---------------------------------------------------------------- bimodal
      if (hm.shared_parameters.bimodal) {
        mRes.alpha_h[0][0] *= gmmUtils.gmmObsProbInput(obsIn, m.states[0]);
        //--------------------------------------------------------------- unimodal
      } else {
        mRes.alpha_h[0][0] *= gmmUtils.gmmObsProb(obsIn, m.states[0]);
      }
      mRes.instant_likelihood = mRes.alpha_h[0][0];
    }
    norm_const += mRes.instant_likelihood;
  }

  //==================================== normalize alphas
  for (var _i10 = 0; _i10 < hm.models.length; _i10++) {

    var _nstates = hm.models[_i10].parameters.states;
    for (var e = 0; e < 3; e++) {
      for (var _k3 = 0; _k3 < _nstates; _k3++) {
        hmRes.singleClassHmmModelResults[_i10].alpha_h[e][_k3] /= norm_const;
      }
    }
  }

  hmRes.forward_initialized = true;
};

//========================================== FORWARD UPDATE

var hhmmForwardUpdate = exports.hhmmForwardUpdate = function hhmmForwardUpdate(obsIn, hm, hmRes) {
  // export const hhmmForwardUpdate = (obsIn, hhmm, hhmmRes) => {
  //   const hm = hhmm;
  //   const hmRes = hhmmRes;
  var nmodels = hm.models.length;

  var norm_const = 0;
  var tmp = 0;
  var front = void 0; // array

  hhmmLikelihoodAlpha(1, hmRes.frontier_v1, hm, hmRes);
  hhmmLikelihoodAlpha(2, hmRes.frontier_v2, hm, hmRes);

  for (var i = 0; i < nmodels; i++) {

    var m = hm.models[i];
    var nstates = m.parameters.states;
    var mRes = hmRes.singleClassHmmModelResults[i];

    //======================= compute frontier variable
    front = new Array(nstates);
    for (var j = 0; j < nstates; j++) {
      front[j] = 0;
    }

    //------------------------------------------------------------------ ergodic
    if (m.parameters.transition_mode == 0) {
      // ergodic
      for (var k = 0; k < nstates; k++) {
        for (var _j = 0; _j < nstates; _j++) {
          front[k] += m.transition[_j * nstates + k] / (1 - m.exitProbabilities[_j]) * mRes.alpha_h[0][_j];
        }
        for (var srci = 0; srci < nmodels; srci++) {
          front[k] += m.prior[k] * (hmRes.frontier_v1[srci] * hm.transition[srci][i] + hmRes.frontier_v2[srci] * hm.prior[i]);
        }
      }
      //--------------------------------------------------------------- left-right
    } else {
      // k == 0 : first state of the primitive
      front[0] = m.transition[0] * mRes.alpha_h[0][0];

      for (var _srci = 0; _srci < nmodels; _srci++) {
        front[0] += hmRes.frontier_v1[_srci] * hm.transition[_srci][i] + hmRes.frontier_v2[_srci] * hm.prior[i];
      }

      // k > 0 : rest of the primitive
      for (var _k4 = 1; _k4 < nstates; _k4++) {
        front[_k4] += m.transition[_k4 * 2] / (1 - m.exitProbabilities[_k4]) * mRes.alpha_h[0][_k4];
        front[_k4] += m.transition[(_k4 - 1) * 2 + 1] / (1 - m.exitProbabilities[_k4 - 1]) * mRes.alpha_h[0][_k4 - 1];
      }

      for (var _j2 = 0; _j2 < 3; _j2++) {
        for (var _k5 = 0; _k5 < nstates; _k5++) {
          mRes.alpha_h[_j2][_k5] = 0;
        }
      }
    }
    //console.log(front);

    //========================= update forward variable
    mRes.exit_likelihood = 0;
    mRes.instant_likelihood = 0;

    for (var _k6 = 0; _k6 < nstates; _k6++) {
      if (hm.shared_parameters.bimodal) {
        tmp = gmmUtils.gmmObsProbInput(obsIn, m.states[_k6]) * front[_k6];
      } else {
        tmp = gmmUtils.gmmObsProb(obsIn, m.states[_k6]) * front[_k6];
      }

      mRes.alpha_h[2][_k6] = hm.exit_transition[i] * m.exitProbabilities[_k6] * tmp;
      mRes.alpha_h[1][_k6] = (1 - hm.exit_transition[i]) * m.exitProbabilities[_k6] * tmp;
      mRes.alpha_h[0][_k6] = (1 - m.exitProbabilities[_k6]) * tmp;

      mRes.exit_likelihood += mRes.alpha_h[1][_k6] + mRes.alpha_h[2][_k6];
      mRes.instant_likelihood += mRes.alpha_h[0][_k6] + mRes.alpha_h[1][_k6] + mRes.alpha_h[2][_k6];

      norm_const += tmp;
    }

    mRes.exit_ratio = mRes.exit_likelihood / mRes.instant_likelihood;
  }

  //==================================== normalize alphas
  for (var _i11 = 0; _i11 < nmodels; _i11++) {
    for (var e = 0; e < 3; e++) {
      for (var _k7 = 0; _k7 < hm.models[_i11].parameters.states; _k7++) {
        hmRes.singleClassHmmModelResults[_i11].alpha_h[e][_k7] /= norm_const;
      }
    }
  }
};

var hhmmUpdateResults = exports.hhmmUpdateResults = function hhmmUpdateResults(hm, hmRes) {
  // export const hhmmUpdateResults = (hhmm, hhmmRes) => {
  //   const hm = hhmm;
  //   const hmRes = hhmmRes;

  var maxlog_likelihood = 0;
  var normconst_instant = 0;
  var normconst_smoothed = 0;

  for (var i = 0; i < hm.models.length; i++) {

    var mRes = hmRes.singleClassHmmModelResults[i];

    hmRes.instant_likelihoods[i] = mRes.instant_likelihood;
    hmRes.smoothed_log_likelihoods[i] = mRes.log_likelihood;
    hmRes.smoothed_likelihoods[i] = Math.exp(hmRes.smoothed_log_likelihoods[i]);

    hmRes.instant_normalized_likelihoods[i] = hmRes.instant_likelihoods[i];
    hmRes.smoothed_normalized_likelihoods[i] = hmRes.smoothed_likelihoods[i];

    normconst_instant += hmRes.instant_normalized_likelihoods[i];
    normconst_smoothed += hmRes.smoothed_normalized_likelihoods[i];

    if (i == 0 || hmRes.smoothed_log_likelihoods[i] > maxlog_likelihood) {
      maxlog_likelihood = hmRes.smoothed_log_likelihoods[i];
      hmRes.likeliest = i;
    }
  }

  for (var _i12 = 0; _i12 < hm.models.length; _i12++) {
    hmRes.instant_normalized_likelihoods[_i12] /= normconst_instant;
    hmRes.smoothed_normalized_likelihoods[_i12] /= normconst_smoothed;
  }
};

var hhmmFilter = exports.hhmmFilter = function hhmmFilter(obsIn, hm, hmRes) {
  // export const hhmmFilter = (obsIn, hhmm, hhmmRes) => {
  //   const hm = hhmm;
  //   const hmRes = hhmmRes;

  //--------------------------------------------------------------- hierarchical
  if (hm.configuration.default_parameters.hierarchical) {
    if (hmRes.forward_initialized) {
      hhmmForwardUpdate(obsIn, hm, hmRes);
    } else {
      hhmmForwardInit(obsIn, hm, hmRes);
    }
    //----------------------------------------------------------- non-hierarchical
  } else {
    for (var i = 0; i < hm.models.length; i++) {
      hmRes.instant_likelihoods[i] = hmmFilter(obsIn, hm, hmRes);
    }
  }

  //----------------- compute time progression
  for (var _i13 = 0; _i13 < hm.models.length; _i13++) {
    hmmUpdateAlphaWindow(hm.models[_i13], hmRes.singleClassHmmModelResults[_i13]);
    hmmUpdateResults(hm.models[_i13], hmRes.singleClassHmmModelResults[_i13]);
  }

  hhmmUpdateResults(hm, hmRes);

  //-------------------------------------------------------------------- bimodal
  if (hm.shared_parameters.bimodal) {
    var dim = hm.shared_parameters.dimension;
    var dimIn = hm.shared_parameters.dimension_input;
    var dimOut = dim - dimIn;

    for (var _i14 = 0; _i14 < hm.models.length; _i14++) {
      hmmRegression(obsIn, hm.models[_i14], hmRes.singleClassHmmModelResults[_i14]);
    }

    //---------------------------------------------------------------- likeliest
    if (hm.configuration.multiClass_regression_estimator === 0) {
      hmRes.output_values = hmRes.singleClassHmmModelResults[hmRes.likeliest].output_values.slice(0);
      hmRes.output_covariance = hmRes.singleClassHmmModelResults[hmRes.likeliest].output_covariance.slice(0);
      //------------------------------------------------------------------ mixture
    } else {
      for (var _i15 = 0; _i15 < hmRes.output_values.length; _i15++) {
        hmRes.output_values[_i15] = 0.0;
      }
      for (var _i16 = 0; _i16 < hmRes.output_covariance.length; _i16++) {
        hmRes.output_covariance[_i16] = 0.0;
      }

      for (var _i17 = 0; _i17 < hm.models.length; _i17++) {
        for (var d = 0; d < dimOut; d++) {
          hmRes.output_values[d] += hmRes.smoothed_normalized_likelihoods[_i17] * hmRes.singleClassHmmModelResults[_i17].output_values[d];

          //--------------------------------------------------------------- full
          if (hm.configuration.covariance_mode === 0) {
            for (var d2 = 0; d2 < dimOut; d2++) {
              hmRes.output_covariance[d * dimOut + d2] += hmRes.smoothed_normalized_likelihoods[_i17] * hmRes.singleClassHmmModelResults[_i17].output_covariance[d * dimOut + d2];
            }
            //----------------------------------------------------------- diagonal
          } else {
            hmRes.output_covariance[d] += hmRes.smoothed_normalized_likelihoods[_i17] * hmRes.singleClassHmmModelResults[_i17].output_covariance[d];
          }
        }
      }
    }
  }
};

},{"./gmm-utils":118}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L0dtbURlY29kZXJMZm8uanMiLCJkaXN0L0hobW1EZWNvZGVyTGZvLmpzIiwiZGlzdC9QaHJhc2VSZWNvcmRlckxmby5qcyIsImRpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2dldC1pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvanNvbi9zdHJpbmdpZnkuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL251bWJlci9pcy1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvc3ltYm9sL2l0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9jbGFzc0NhbGxDaGVjay5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY3JlYXRlQ2xhc3MuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2dldC5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvaW5oZXJpdHMuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3Bvc3NpYmxlQ29uc3RydWN0b3JSZXR1cm4uanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL3R5cGVvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vZ2V0LWl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9qc29uL3N0cmluZ2lmeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vbnVtYmVyL2lzLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2luZGV4LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2EtZnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FkZC10by11bnNjb3BhYmxlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYW4tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hcnJheS1pbmNsdWRlcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY2xhc3NvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fY29mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb3JlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jdHguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RlZmluZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2Rlc2NyaXB0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19kb20tY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWJ1Zy1rZXlzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19lbnVtLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2V4cG9ydC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZmFpbHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2dsb2JhbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faGFzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oaWRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19odG1sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pZTgtZG9tLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtYXJyYXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2lzLW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLXN0ZXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXJhdG9ycy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fa2V5b2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2xpYnJhcnkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX21ldGEuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1hc3NpZ24uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1kcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwcy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcGQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BuLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1nb3BzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ3BvLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy1pbnRlcm5hbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1waWUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1zYXAuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3Byb3BlcnR5LWRlc2MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3JlZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zZXQtcHJvdG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC10by1zdHJpbmctdGFnLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQta2V5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19zaGFyZWQuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3N0cmluZy1hdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWludGVnZXIuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWlvYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLWxlbmd0aC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1wcmltaXRpdmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3VpZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWRlZmluZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLWV4dC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fd2tzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yLW1ldGhvZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9jb3JlLmdldC1pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuYXJyYXkuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm51bWJlci5pcy1pbnRlZ2VyLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LnNldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC50by1zdHJpbmcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYuc3ltYm9sLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUuanMiLCJub2RlX21vZHVsZXMvcGFyYW1ldGVycy9kaXN0L3BhcmFtVGVtcGxhdGVzLmpzIiwibm9kZV9tb2R1bGVzL3BhcmFtZXRlcnMvZGlzdC9wYXJhbWV0ZXJzLmpzIiwibm9kZV9tb2R1bGVzL3dhdmVzLWxmby9jb21tb24vY29yZS9CYXNlTGZvLmpzIiwibm9kZV9tb2R1bGVzL3htbS1jbGllbnQvZGlzdC9nbW0vZ21tLWRlY29kZXIuanMiLCJub2RlX21vZHVsZXMveG1tLWNsaWVudC9kaXN0L2hobW0vaGhtbS1kZWNvZGVyLmpzIiwibm9kZV9tb2R1bGVzL3htbS1jbGllbnQvZGlzdC9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy94bW0tY2xpZW50L2Rpc3Qvc2V0L3htbS1waHJhc2UuanMiLCJub2RlX21vZHVsZXMveG1tLWNsaWVudC9kaXN0L3NldC94bW0tc2V0LmpzIiwibm9kZV9tb2R1bGVzL3htbS1jbGllbnQvZGlzdC91dGlscy9nbW0tdXRpbHMuanMiLCJub2RlX21vZHVsZXMveG1tLWNsaWVudC9kaXN0L3V0aWxzL2hobW0tdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBR0EsSUFBTSxjQUFjO0FBQ2xCLFNBQU87QUFDTCxVQUFNLEtBREQ7QUFFTCxhQUFTLElBRko7QUFHTCxjQUFVLElBSEw7QUFJTCxXQUFPLEVBQUUsTUFBTSxRQUFSO0FBSkYsR0FEVztBQU9sQixvQkFBa0I7QUFDaEIsVUFBTSxTQURVO0FBRWhCLGFBQVMsRUFGTztBQUdoQixTQUFLLENBSFc7QUFJaEIsU0FBSztBQUpXLEdBUEE7QUFhbEIsVUFBUTtBQUNOLFVBQU0sTUFEQTtBQUVOLGFBQVMsYUFGSDtBQUdOLFVBQU0sQ0FBQyxhQUFELEVBQWdCLFlBQWhCLENBSEE7QUFJTixjQUFVO0FBSkosR0FiVTtBQW1CbEIsWUFBVTtBQUNSLFVBQU0sS0FERTtBQUVSLGFBQVMsSUFGRDtBQUdSLGNBQVUsSUFIRjtBQUlSLFdBQU8sRUFBRSxNQUFNLFNBQVI7QUFKQztBQW5CUSxDQUFwQjs7QUE0QkE7Ozs7Ozs7Ozs7Ozs7SUFZTSxhOzs7QUFDSiwyQkFBMEI7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLG9KQUNsQixXQURrQixFQUNMLE9BREs7O0FBR3hCLFVBQUssUUFBTCxHQUFnQiwwQkFBZSxNQUFLLE1BQUwsQ0FBWSxnQkFBM0IsQ0FBaEI7QUFId0I7QUFJekI7O0FBRUQ7Ozs7O2tDQUNjLEksRUFBTSxLLEVBQU8sSyxFQUFPO0FBQ2hDLHdKQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQyxLQUFqQzs7QUFFQSxVQUFJLFNBQVMsa0JBQWIsRUFBaUM7QUFDL0IsYUFBSyxRQUFMLENBQWMsZ0JBQWQsR0FBaUMsS0FBakM7QUFDRDtBQUNGOztBQUVEOzs7OzBDQUMyQztBQUFBLFVBQXZCLGdCQUF1Qix1RUFBSixFQUFJOztBQUN6QyxXQUFLLG1CQUFMLENBQXlCLGdCQUF6Qjs7QUFFQSxXQUFLLFFBQUwsQ0FBYyxLQUFkLEdBQXNCLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBdEI7O0FBRUEsVUFBSSxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DLGFBQUssWUFBTCxDQUFrQixTQUFsQixHQUE4QixLQUFLLFFBQUwsQ0FBYyxTQUE1QztBQUNELE9BRkQsTUFFTztBQUFFO0FBQ1AsYUFBSyxZQUFMLENBQWtCLFNBQWxCLEdBQThCLEtBQUssUUFBTCxDQUFjLGNBQTVDO0FBQ0Q7O0FBRUQsV0FBSyxxQkFBTDtBQUNEOztBQUVEOzs7O2tDQUNjLEssRUFBTztBQUFBOztBQUNuQixXQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLEtBQXJCLEVBQTRCLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUN4QyxZQUFNLFdBQVcsT0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixVQUFoQixDQUFqQjtBQUNBLFlBQU0sVUFBVSxJQUFJLFdBQXBCO0FBQ0EsWUFBTSxPQUFPLE9BQUssS0FBTCxDQUFXLElBQXhCO0FBQ0EsWUFBTSxZQUFZLE9BQUssWUFBTCxDQUFrQixTQUFwQzs7QUFFQSxZQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUNmLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFwQixFQUErQixHQUEvQixFQUFvQztBQUNsQyxpQkFBSyxDQUFMLElBQVUsUUFBUSxDQUFSLENBQVY7QUFDRDs7QUFFRCxjQUFJLFFBQUosRUFBYztBQUNaLHFCQUFTLEdBQVQ7QUFDRDtBQUNGOztBQUVELGVBQUssY0FBTDtBQUNELE9BakJEO0FBa0JEOztBQUVEOzs7O2lDQUNhLEssRUFBTztBQUNsQixXQUFLLFlBQUwsQ0FBa0IsS0FBbEI7QUFDQSxXQUFLLGVBQUwsQ0FBcUIsS0FBckI7QUFDRDs7Ozs7QUFDRjs7a0JBRWMsYTs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDeEdmOzs7O0FBQ0E7Ozs7QUFHQSxJQUFNLGNBQWM7QUFDbEIsU0FBTztBQUNMLFVBQU0sS0FERDtBQUVMLGFBQVMsSUFGSjtBQUdMLGNBQVUsSUFITDtBQUlMLFdBQU8sRUFBRSxNQUFNLFFBQVI7QUFKRixHQURXO0FBT2xCLG9CQUFrQjtBQUNoQixVQUFNLFNBRFU7QUFFaEIsYUFBUyxFQUZPO0FBR2hCLFNBQUssQ0FIVztBQUloQixTQUFLO0FBSlcsR0FQQTtBQWFsQixVQUFRO0FBQ04sVUFBTSxNQURBO0FBRU4sYUFBUyxhQUZIO0FBR04sVUFBTSxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsQ0FIQTtBQUlOLGNBQVU7QUFKSixHQWJVO0FBbUJsQixZQUFVO0FBQ1IsVUFBTSxLQURFO0FBRVIsYUFBUyxJQUZEO0FBR1IsY0FBVSxJQUhGO0FBSVIsV0FBTyxFQUFFLE1BQU0sU0FBUjtBQUpDO0FBbkJRLENBQXBCOztBQTRCQTs7Ozs7Ozs7Ozs7SUFVTSxjOzs7QUFDSiw0QkFBMEI7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLHNKQUNsQixXQURrQixFQUNMLE9BREs7O0FBR3hCLFVBQUssUUFBTCxHQUFnQiwyQkFBZ0IsTUFBSyxNQUFMLENBQVksZ0JBQTVCLENBQWhCO0FBSHdCO0FBSXpCOztBQUVEOzs7Ozs7OzRCQUdRO0FBQ04sV0FBSyxRQUFMLENBQWMsS0FBZDtBQUNEOztBQUVEOzs7O2tDQUNjLEksRUFBTSxLLEVBQU8sSyxFQUFPO0FBQ2hDLDBKQUFvQixJQUFwQixFQUEwQixLQUExQixFQUFpQyxLQUFqQzs7QUFFQSxVQUFJLFNBQVMsa0JBQWIsRUFBaUM7QUFDL0IsYUFBSyxRQUFMLENBQWMsbUJBQWQsQ0FBa0MsS0FBbEM7QUFDRDtBQUNGOztBQUVEOzs7OzBDQUMyQztBQUFBLFVBQXZCLGdCQUF1Qix1RUFBSixFQUFJOztBQUN6QyxXQUFLLG1CQUFMLENBQXlCLGdCQUF6Qjs7QUFFQSxXQUFLLFFBQUwsQ0FBYyxLQUFkLEdBQXNCLEtBQUssTUFBTCxDQUFZLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBdEI7O0FBRUEsVUFBSSxLQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DLGFBQUssWUFBTCxDQUFrQixTQUFsQixHQUE4QixLQUFLLFFBQUwsQ0FBYyxTQUE1QztBQUNELE9BRkQsTUFFTztBQUFFO0FBQ1AsYUFBSyxZQUFMLENBQWtCLFNBQWxCLEdBQThCLEtBQUssUUFBTCxDQUFjLGNBQTVDO0FBQ0Q7O0FBRUQsV0FBSyxxQkFBTDtBQUNEOztBQUVEOzs7O2tDQUNjLEssRUFBTztBQUFBOztBQUNuQixXQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLEtBQXJCLEVBQTRCLFVBQUMsR0FBRCxFQUFNLEdBQU4sRUFBYztBQUN4QyxZQUFNLFdBQVcsT0FBSyxNQUFMLENBQVksR0FBWixDQUFnQixVQUFoQixDQUFqQjtBQUNBLFlBQU0sVUFBVSxJQUFJLFdBQXBCO0FBQ0EsWUFBTSxPQUFPLE9BQUssS0FBTCxDQUFXLElBQXhCO0FBQ0EsWUFBTSxZQUFZLE9BQUssWUFBTCxDQUFrQixTQUFwQzs7QUFFQSxZQUFJLE9BQU8sSUFBWCxFQUFpQjtBQUNmLGVBQUssSUFBSSxJQUFJLENBQWIsRUFBZ0IsSUFBSSxTQUFwQixFQUErQixHQUEvQixFQUFvQztBQUNsQyxpQkFBSyxDQUFMLElBQVUsUUFBUSxDQUFSLENBQVY7QUFDRDs7QUFFRCxjQUFJLFFBQUosRUFBYztBQUNaLHFCQUFTLEdBQVQ7QUFDRDtBQUNGOztBQUVELGVBQUssY0FBTDtBQUNELE9BakJEO0FBa0JEOztBQUVEOzs7O2lDQUNhLEssRUFBTztBQUNsQixXQUFLLFlBQUwsQ0FBa0IsS0FBbEI7QUFDQSxXQUFLLGVBQUwsQ0FBcUIsS0FBckI7QUFDRDs7Ozs7QUFDRjs7a0JBRWMsYzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0dmOzs7O0FBQ0E7Ozs7QUFFQSxJQUFNLGNBQWM7QUFDbEIsV0FBUztBQUNQLFVBQU0sU0FEQztBQUVQLGFBQVMsS0FGRjtBQUdQLGNBQVU7QUFISCxHQURTO0FBTWxCLGtCQUFnQjtBQUNkLFVBQU0sU0FEUTtBQUVkLGFBQVMsQ0FGSztBQUdkLGNBQVU7QUFISSxHQU5FO0FBV2xCLGVBQWE7QUFDWCxVQUFNLEtBREs7QUFFWCxhQUFTLENBQUMsRUFBRCxDQUZFO0FBR1gsY0FBVTtBQUhDO0FBWEssQ0FBcEI7O0FBa0JBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7OztJQUlNLGlCOzs7QUFDSiwrQkFBMEI7QUFBQSxRQUFkLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLDRKQUNsQixXQURrQixFQUNMLE9BREs7O0FBR3hCLFVBQUssWUFBTCxHQUFvQiwyQkFBZ0I7QUFDbEMsZUFBUyxNQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLFNBQWhCLENBRHlCO0FBRWxDLHNCQUFnQixNQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLGdCQUFoQixDQUZrQjtBQUdsQyxtQkFBYSxNQUFLLE1BQUwsQ0FBWSxHQUFaLENBQWdCLGFBQWhCO0FBSHFCLEtBQWhCLENBQXBCOztBQU1BLFVBQUssVUFBTCxHQUFrQixLQUFsQjtBQVR3QjtBQVV6Qjs7QUFFRDs7Ozs7Ozs7cUNBSWlCO0FBQ2YsYUFBTyxLQUFLLFlBQUwsQ0FBa0IsU0FBbEIsR0FBOEIsT0FBOUIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O21DQUllLEssRUFBTztBQUNwQixXQUFLLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBNEIsRUFBRSxPQUFPLEtBQVQsRUFBNUI7QUFDRDs7QUFFRDs7Ozs7Ozt3Q0FJb0I7QUFDbEI7QUFDQSxhQUFPLEtBQUssWUFBTCxDQUFrQixTQUFsQixFQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs0QkFHUTtBQUNOLFdBQUssWUFBTCxDQUFrQixLQUFsQjtBQUNBLFdBQUssVUFBTCxHQUFrQixJQUFsQjtBQUNEOztBQUVEOzs7Ozs7OzJCQUlPO0FBQ0wsV0FBSyxVQUFMLEdBQWtCLEtBQWxCO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2MsSSxFQUFNLEssRUFBTyxLLEVBQU87QUFDaEMsZ0tBQW9CLElBQXBCLEVBQTBCLEtBQTFCLEVBQWlDLEtBQWpDOztBQUVBLFVBQU0sU0FBUyxFQUFmO0FBQ0EsYUFBTyxJQUFQLElBQWUsS0FBZjtBQUNBLFdBQUssWUFBTCxDQUFrQixTQUFsQixDQUE0QixNQUE1QjtBQUNEOztBQUVEOzs7OzBDQUMyQztBQUFBLFVBQXZCLGdCQUF1Qix1RUFBSixFQUFJOztBQUN6QyxXQUFLLG1CQUFMLENBQXlCLGdCQUF6Qjs7QUFFQSxXQUFLLFlBQUwsQ0FBa0IsU0FBbEIsQ0FBNEIsRUFBRSxXQUFXLEtBQUssWUFBTCxDQUFrQixTQUEvQixFQUE1QjtBQUNBLFdBQUssWUFBTCxDQUFrQixLQUFsQjs7QUFFQSxXQUFLLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2MsSyxFQUFPO0FBQ25CLFVBQUksQ0FBQyxLQUFLLFVBQVYsRUFBc0I7QUFDcEI7QUFDRDs7QUFFRDtBQUNBLFVBQU0sWUFBWSxLQUFLLFlBQUwsQ0FBa0IsU0FBcEM7QUFDQSxVQUFNLFNBQVMsTUFBTSxJQUFyQjtBQUNBLFVBQU0sVUFBVSxLQUFLLEtBQUwsQ0FBVyxJQUEzQjs7QUFFQSxXQUFLLElBQUksSUFBSSxDQUFiLEVBQWdCLElBQUksU0FBcEIsRUFBK0IsR0FBL0IsRUFBb0M7QUFDbEMsZ0JBQVEsQ0FBUixJQUFhLE9BQU8sQ0FBUCxDQUFiO0FBQ0Q7O0FBRUQsV0FBSyxZQUFMLENBQWtCLGNBQWxCLENBQWlDLE1BQWpDO0FBQ0Q7Ozs7O2tCQUdZLGlCOzs7Ozs7Ozs7Ozs7OztrREMxSE4sTzs7Ozs7Ozs7O21EQUNBLE87Ozs7Ozs7OztzREFDQSxPOzs7Ozs7O0FDRlQ7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1JBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUMxQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7O0FDREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBOztBQ0hBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNkQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUM1REE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTs7QUNBQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDckVBO0FBQ0E7QUFDQTs7QUNGQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3BEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaENBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN6Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNuQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDVEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNQQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUN4QkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDWEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7O0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNWQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ05BO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzFPQTs7QUNBQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFD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QyxvQkFBTSxpQkFBTixDQUF3QixJQUFJLE1BQUosR0FBYSxFQUFyQyxLQUNLLE1BQU0sK0JBQU4sQ0FBc0MsSUFBdEMsSUFDQSxNQUFNLDBCQUFOLENBQWlDLElBQWpDLEVBQ0UsaUJBREYsQ0FDb0IsSUFBSSxNQUFKLEdBQWEsRUFEakMsQ0FGTDtBQUlEO0FBQ0g7QUFDQyxXQVJELE1BUU87QUFDTCxrQkFBTSxpQkFBTixDQUF3QixDQUF4QixLQUNLLE1BQU0sK0JBQU4sQ0FBc0MsSUFBdEMsSUFDQSxNQUFNLDBCQUFOLENBQWlDLElBQWpDLEVBQ0UsaUJBREYsQ0FDb0IsQ0FEcEIsQ0FGTDtBQUlEO0FBQ0Y7QUFDRjtBQUNGO0FBQ0Y7QUFDRixDQXJGTSIsImZpbGUiOiJnZW5lcmF0ZWQuanMiLCJzb3VyY2VSb290IjoiIiwic291cmNlc0NvbnRlbnQiOlsiKGZ1bmN0aW9uIGUodCxuLHIpe2Z1bmN0aW9uIHMobyx1KXtpZighbltvXSl7aWYoIXRbb10pe3ZhciBhPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7aWYoIXUmJmEpcmV0dXJuIGEobywhMCk7aWYoaSlyZXR1cm4gaShvLCEwKTt2YXIgZj1uZXcgRXJyb3IoXCJDYW5ub3QgZmluZCBtb2R1bGUgJ1wiK28rXCInXCIpO3Rocm93IGYuY29kZT1cIk1PRFVMRV9OT1RfRk9VTkRcIixmfXZhciBsPW5bb109e2V4cG9ydHM6e319O3Rbb11bMF0uY2FsbChsLmV4cG9ydHMsZnVuY3Rpb24oZSl7dmFyIG49dFtvXVsxXVtlXTtyZXR1cm4gcyhuP246ZSl9LGwsbC5leHBvcnRzLGUsdCxuLHIpfXJldHVybiBuW29dLmV4cG9ydHN9dmFyIGk9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtmb3IodmFyIG89MDtvPHIubGVuZ3RoO28rKylzKHJbb10pO3JldHVybiBzfSkiLCJpbXBvcnQgQmFzZUxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgeyBHbW1EZWNvZGVyIH0gZnJvbSAneG1tLWNsaWVudCc7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIG1vZGVsOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LCBcbiAgbGlrZWxpaG9vZFdpbmRvdzoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyMCxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAxZTMwLFxuICB9LFxuICBvdXRwdXQ6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ2xpa2VsaWhvb2RzJyxcbiAgICBsaXN0OiBbJ2xpa2VsaWhvb2RzJywgJ3JlZ3Jlc3Npb24nXSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59O1xuXG5cbi8qKlxuICogTGZvIGNsYXNzIGxvYWRpbmcgR01NIG1vZGVscyBjcmVhdGVkIGJ5IHRoZSB4bW0gbGlicmFyeSB0byBwcm9jZXNzIGFuIGlucHV0XG4gKiBzdHJlYW0gb2YgdmVjdG9ycyAobW9kZWxzIG11c3QgaGF2ZSBiZWVuIHRyYWluZWQgZnJvbSB0aGUgc2FtZSBpbnB1dCBzdHJlYW0pLlxuICogQXMgdGhlIHJlc3VsdHMgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIC8gcmVncmVzc2lvbiBhcmUgbW9yZSBjb21wbGV4IHRoYW4gYVxuICogc2ltcGxlIHZlY3RvciwgYSBjYWxsYmFjayBmdW5jdGlvbiBjYW4gYmUgcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3RvciB0byBoYW5kbGVcbiAqIHRoZW0sIG9yIHRoZXkgY2FuIGFsdGVybmF0aXZlbHkgYmUgcXVlcmllZCB2aWEgdGhlIHJlYWRvbmx5IGZpbHRlclJlc3VsdHNcbiAqIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdHMuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubW9kZWw9bnVsbF0gLSBNb2RlbCBjb21taW5nIGZyb20gLi4uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubGlrZWxpaG9vZFdpbmRvdz0yMF0gLSBOdW1iZXIgb2YgbGlsaWtlbGlob29kXG4gKi9cbmNsYXNzIEdtbURlY29kZXJMZm8gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fZGVjb2RlciA9IG5ldyBHbW1EZWNvZGVyKHRoaXMucGFyYW1zLmxpa2VsaWhvb2RXaW5kb3cpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgaWYgKG5hbWUgPT09ICdsaWtlbGlob29kV2luZG93Jykge1xuICAgICAgdGhpcy5fZGVjb2Rlci5saWtlbGlob29kV2luZG93ID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5fZGVjb2Rlci5tb2RlbCA9IHRoaXMucGFyYW1zLmdldCgnbW9kZWwnKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLm5iQ2xhc3NlcztcbiAgICB9IGVsc2UgeyAvLyA9PT0gJ3JlZ3Jlc3Npb24nXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLnJlZ3Jlc3Npb25TaXplO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIHRoaXMuX2RlY29kZXIuZmlsdGVyKGZyYW1lLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdjYWxsYmFjaycpO1xuICAgICAgY29uc3QgcmVzRGF0YSA9IHJlcy5saWtlbGlob29kcztcbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICAgICAgZGF0YVtpXSA9IHJlc0RhdGFbaV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKGZyYW1lKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdtbURlY29kZXJMZm87IiwiaW1wb3J0IEJhc2VMZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IHsgSGhtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbW9kZWw6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sIFxuICBsaWtlbGlob29kV2luZG93OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIwLFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDFlMzAsXG4gIH0sXG4gIG91dHB1dDoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbGlrZWxpaG9vZHMnLFxuICAgIGxpc3Q6IFsnbGlrZWxpaG9vZHMnLCAncmVncmVzc2lvbiddLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cblxuLyoqXG4gKiBMZm8gY2xhc3MgbG9hZGluZyBIaWVyYXJjaGljYWwgSE1NIG1vZGVscyBjcmVhdGVkIGJ5IHRoZSB4bW0gbGlicmFyeSB0b1xuICogcHJvY2VzcyBhbiBpbnB1dCBzdHJlYW0gb2YgdmVjdG9ycyAobW9kZWxzIG11c3QgaGF2ZSBiZWVuIHRyYWluZWQgZnJvbSB0aGVcbiAqIHNhbWUgaW5wdXQgc3RyZWFtKS5cbiAqIEFzIHRoZSByZXN1bHRzIG9mIHRoZSBjbGFzc2lmaWNhdGlvbiAvIGZvbGxvd2luZyAvIHJlZ3Jlc3Npb24gYXJlIG1vcmVcbiAqIGNvbXBsZXggdGhhbiBhIHNpbXBsZSB2ZWN0b3IsIGEgY2FsbGJhY2sgZnVuY3Rpb24gY2FuIGJlIHBhc3NlZCB0byB0aGVcbiAqIGNvbnN0cnVjdG9yIHRvIGhhbmRsZSB0aGVtLCBvciB0aGV5IGNhbiBhbHRlcm5hdGl2ZWx5IGJlIHF1ZXJpZWQgdmlhIHRoZVxuICogcmVhZG9ubHkgZmlsdGVyUmVzdWx0cyBwcm9wZXJ0eS5cbiAqIEBjbGFzc1xuICovXG5jbGFzcyBIaG1tRGVjb2RlckxmbyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyID0gbmV3IEhobW1EZWNvZGVyKHRoaXMucGFyYW1zLmxpa2VsaWhvb2RXaW5kb3cpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIGVzdGltYXRpb24uXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9kZWNvZGVyLnJlc2V0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2xpa2VsaWhvb2RXaW5kb3cnKSB7XG4gICAgICB0aGlzLl9kZWNvZGVyLnNldExpa2VsaWhvb2RXaW5kb3codmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuX2RlY29kZXIubW9kZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ21vZGVsJyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5uYkNsYXNzZXM7XG4gICAgfSBlbHNlIHsgLy8gPT09ICdyZWdyZXNzaW9uJ1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5yZWdyZXNzaW9uU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICB0aGlzLl9kZWNvZGVyLmZpbHRlcihmcmFtZSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcbiAgICAgIGNvbnN0IHJlc0RhdGEgPSByZXMubGlrZWxpaG9vZHM7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgICAgIGRhdGFbaV0gPSByZXNEYXRhW2ldO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjayhyZXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZShmcmFtZSk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBIaG1tRGVjb2RlckxmbzsiLCJpbXBvcnQgQmFzZUxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgeyBQaHJhc2VNYWtlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgYmltb2RhbDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZVxuICB9LFxuICBkaW1lbnNpb25JbnB1dDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlXG4gIH0sXG4gIGNvbHVtbk5hbWVzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogWycnXSxcbiAgICBjb25zdGFudDogdHJ1ZVxuICB9LFxufTtcblxuLy8gdW5jb21tZW50IHRoaXMgYW5kIGFkZCB0byBvdGhlciB4bW0tbGZvJ3Mgd2hlbiBsZm8gaXMgZXhwb3NlZCBpbiAvY29tbW9uIGFzIHdlbGxcbi8vIG9yIHVzZSBjbGllbnQgPyAoaXQncyB2ZXJ5IGxpa2VseSB0aGF0IHdlIHdvbid0IHJ1biB0aGVzZSBsZm8ncyBzZXJ2ZXItc2lkZSlcbi8vIGlmIChsZm8udmVyc2lvbiA8ICcxLjAuMCcpXG4vLyAgdGhyb3cgbmV3IEVycm9yKCcnKVxuXG4vKipcbiAqIExmbyBjbGFzcyB1c2luZyBQaHJhc2VNYWtlciBjbGFzcyBmcm9tIHhtbS1jbGllbnRcbiAqIHRvIHJlY29yZCBpbnB1dCBkYXRhIGFuZCBmb3JtYXQgaXQgZm9yIHhtbS1ub2RlLlxuICovXG5jbGFzcyBQaHJhc2VSZWNvcmRlckxmbyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9waHJhc2VNYWtlciA9IG5ldyBQaHJhc2VNYWtlcih7XG4gICAgICBiaW1vZGFsOiB0aGlzLnBhcmFtcy5nZXQoJ2JpbW9kYWwnKSxcbiAgICAgIGRpbWVuc2lvbklucHV0OiB0aGlzLnBhcmFtcy5nZXQoJ2RpbWVuc2lvbklucHV0JyksXG4gICAgICBjb2x1bW5OYW1lczogdGhpcy5wYXJhbXMuZ2V0KCdjb2x1bW5OYW1lcycpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGxhYmVsIG9mIHRoZSBsYXN0IC8gY3VycmVudGx5IGJlaW5nIHJlY29yZGVkIHBocmFzZS5cbiAgICogQHJldHVybnMge1N0cmluZ30uXG4gICAqL1xuICBnZXRQaHJhc2VMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGhyYXNlTWFrZXIuZ2V0Q29uZmlnKClbJ2xhYmVsJ107XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IGxhYmVsIG9mIHRoZSBsYXN0IC8gY3VycmVudGx5IGJlaW5nIHJlY29yZGVkIHBocmFzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gVGhlIGxhYmVsLlxuICAgKi9cbiAgc2V0UGhyYXNlTGFiZWwobGFiZWwpIHtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5zZXRDb25maWcoeyBsYWJlbDogbGFiZWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBsYXRlc3QgcmVjb3JkZWQgcGhyYXNlLlxuICAgKiBAcmV0dXJucyB7WG1tUGhyYXNlfVxuICAgKi9cbiAgZ2V0UmVjb3JkZWRQaHJhc2UoKSB7XG4gICAgLy8gdGhpcy5zdG9wKCk7XG4gICAgcmV0dXJuIHRoaXMuX3BocmFzZU1ha2VyLmdldFBocmFzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHJlY29yZGluZyBhIHBocmFzZSBmcm9tIHRoZSBpbnB1dCBzdHJlYW0uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5yZXNldCgpO1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCB0aGUgY3VycmVudCByZWNvcmRpbmcuXG4gICAqIChtYWtlcyB0aGUgcGhyYXNlIGF2YWlsYWJsZSB2aWEgPGNvZGU+Z2V0UmVjb3JkZWRQaHJhc2UoKTwvY29kZT4pLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IHt9O1xuICAgIGNvbmZpZ1tuYW1lXSA9IHZhbHVlO1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnNldENvbmZpZyhjb25maWcpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5fcGhyYXNlTWFrZXIuc2V0Q29uZmlnKHsgZGltZW5zaW9uOiB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgfSk7XG4gICAgdGhpcy5fcGhyYXNlTWFrZXIucmVzZXQoKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY29uc3QgeyBkYXRhIH0gPSBmcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgb3V0RGF0YVtpXSA9IGluRGF0YVtpXTtcbiAgICB9XG5cbiAgICB0aGlzLl9waHJhc2VNYWtlci5hZGRPYnNlcnZhdGlvbihpbkRhdGEpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBocmFzZVJlY29yZGVyTGZvOyIsImV4cG9ydCB7IGRlZmF1bHQgYXMgR21tRGVjb2RlckxmbyB9IGZyb20gJy4vR21tRGVjb2Rlckxmbyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEhobW1EZWNvZGVyTGZvIH0gZnJvbSAnLi9IaG1tRGVjb2Rlckxmbyc7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBocmFzZVJlY29yZGVyTGZvIH0gZnJvbSAnLi9QaHJhc2VSZWNvcmRlckxmbyc7IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL2dldC1pdGVyYXRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9qc29uL3N0cmluZ2lmeVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9udW1iZXIvaXMtaW50ZWdlclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvYXNzaWduXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9jcmVhdGVcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9nZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbFwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaXRlcmF0b3JcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKGluc3RhbmNlLCBDb25zdHJ1Y3Rvcikge1xuICBpZiAoIShpbnN0YW5jZSBpbnN0YW5jZW9mIENvbnN0cnVjdG9yKSkge1xuICAgIHRocm93IG5ldyBUeXBlRXJyb3IoXCJDYW5ub3QgY2FsbCBhIGNsYXNzIGFzIGEgZnVuY3Rpb25cIik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZGVmaW5lLXByb3BlcnR5XCIpO1xuXG52YXIgX2RlZmluZVByb3BlcnR5MiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2RlZmluZVByb3BlcnR5KTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKCkge1xuICBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0aWVzKHRhcmdldCwgcHJvcHMpIHtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgZGVzY3JpcHRvciA9IHByb3BzW2ldO1xuICAgICAgZGVzY3JpcHRvci5lbnVtZXJhYmxlID0gZGVzY3JpcHRvci5lbnVtZXJhYmxlIHx8IGZhbHNlO1xuICAgICAgZGVzY3JpcHRvci5jb25maWd1cmFibGUgPSB0cnVlO1xuICAgICAgaWYgKFwidmFsdWVcIiBpbiBkZXNjcmlwdG9yKSBkZXNjcmlwdG9yLndyaXRhYmxlID0gdHJ1ZTtcbiAgICAgICgwLCBfZGVmaW5lUHJvcGVydHkyLmRlZmF1bHQpKHRhcmdldCwgZGVzY3JpcHRvci5rZXksIGRlc2NyaXB0b3IpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIHByb3RvUHJvcHMsIHN0YXRpY1Byb3BzKSB7XG4gICAgaWYgKHByb3RvUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IucHJvdG90eXBlLCBwcm90b1Byb3BzKTtcbiAgICBpZiAoc3RhdGljUHJvcHMpIGRlZmluZVByb3BlcnRpZXMoQ29uc3RydWN0b3IsIHN0YXRpY1Byb3BzKTtcbiAgICByZXR1cm4gQ29uc3RydWN0b3I7XG4gIH07XG59KCk7IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZlwiKTtcblxudmFyIF9nZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9nZXRQcm90b3R5cGVPZik7XG5cbnZhciBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvclwiKTtcblxudmFyIF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gZ2V0KG9iamVjdCwgcHJvcGVydHksIHJlY2VpdmVyKSB7XG4gIGlmIChvYmplY3QgPT09IG51bGwpIG9iamVjdCA9IEZ1bmN0aW9uLnByb3RvdHlwZTtcbiAgdmFyIGRlc2MgPSAoMCwgX2dldE93blByb3BlcnR5RGVzY3JpcHRvcjIuZGVmYXVsdCkob2JqZWN0LCBwcm9wZXJ0eSk7XG5cbiAgaWYgKGRlc2MgPT09IHVuZGVmaW5lZCkge1xuICAgIHZhciBwYXJlbnQgPSAoMCwgX2dldFByb3RvdHlwZU9mMi5kZWZhdWx0KShvYmplY3QpO1xuXG4gICAgaWYgKHBhcmVudCA9PT0gbnVsbCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9IGVsc2Uge1xuICAgICAgcmV0dXJuIGdldChwYXJlbnQsIHByb3BlcnR5LCByZWNlaXZlcik7XG4gICAgfVxuICB9IGVsc2UgaWYgKFwidmFsdWVcIiBpbiBkZXNjKSB7XG4gICAgcmV0dXJuIGRlc2MudmFsdWU7XG4gIH0gZWxzZSB7XG4gICAgdmFyIGdldHRlciA9IGRlc2MuZ2V0O1xuXG4gICAgaWYgKGdldHRlciA9PT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdW5kZWZpbmVkO1xuICAgIH1cblxuICAgIHJldHVybiBnZXR0ZXIuY2FsbChyZWNlaXZlcik7XG4gIH1cbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfc2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZlwiKTtcblxudmFyIF9zZXRQcm90b3R5cGVPZjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zZXRQcm90b3R5cGVPZik7XG5cbnZhciBfY3JlYXRlID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2NyZWF0ZVwiKTtcblxudmFyIF9jcmVhdGUyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfY3JlYXRlKTtcblxudmFyIF90eXBlb2YyID0gcmVxdWlyZShcIi4uL2hlbHBlcnMvdHlwZW9mXCIpO1xuXG52YXIgX3R5cGVvZjMgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF90eXBlb2YyKTtcblxuZnVuY3Rpb24gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChvYmopIHsgcmV0dXJuIG9iaiAmJiBvYmouX19lc01vZHVsZSA/IG9iaiA6IHsgZGVmYXVsdDogb2JqIH07IH1cblxuZXhwb3J0cy5kZWZhdWx0ID0gZnVuY3Rpb24gKHN1YkNsYXNzLCBzdXBlckNsYXNzKSB7XG4gIGlmICh0eXBlb2Ygc3VwZXJDbGFzcyAhPT0gXCJmdW5jdGlvblwiICYmIHN1cGVyQ2xhc3MgIT09IG51bGwpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiU3VwZXIgZXhwcmVzc2lvbiBtdXN0IGVpdGhlciBiZSBudWxsIG9yIGEgZnVuY3Rpb24sIG5vdCBcIiArICh0eXBlb2Ygc3VwZXJDbGFzcyA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiAoMCwgX3R5cGVvZjMuZGVmYXVsdCkoc3VwZXJDbGFzcykpKTtcbiAgfVxuXG4gIHN1YkNsYXNzLnByb3RvdHlwZSA9ICgwLCBfY3JlYXRlMi5kZWZhdWx0KShzdXBlckNsYXNzICYmIHN1cGVyQ2xhc3MucHJvdG90eXBlLCB7XG4gICAgY29uc3RydWN0b3I6IHtcbiAgICAgIHZhbHVlOiBzdWJDbGFzcyxcbiAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgd3JpdGFibGU6IHRydWUsXG4gICAgICBjb25maWd1cmFibGU6IHRydWVcbiAgICB9XG4gIH0pO1xuICBpZiAoc3VwZXJDbGFzcykgX3NldFByb3RvdHlwZU9mMi5kZWZhdWx0ID8gKDAsIF9zZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkoc3ViQ2xhc3MsIHN1cGVyQ2xhc3MpIDogc3ViQ2xhc3MuX19wcm90b19fID0gc3VwZXJDbGFzcztcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfdHlwZW9mMiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIF90eXBlb2YzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHlwZW9mMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzZWxmLCBjYWxsKSB7XG4gIGlmICghc2VsZikge1xuICAgIHRocm93IG5ldyBSZWZlcmVuY2VFcnJvcihcInRoaXMgaGFzbid0IGJlZW4gaW5pdGlhbGlzZWQgLSBzdXBlcigpIGhhc24ndCBiZWVuIGNhbGxlZFwiKTtcbiAgfVxuXG4gIHJldHVybiBjYWxsICYmICgodHlwZW9mIGNhbGwgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogKDAsIF90eXBlb2YzLmRlZmF1bHQpKGNhbGwpKSA9PT0gXCJvYmplY3RcIiB8fCB0eXBlb2YgY2FsbCA9PT0gXCJmdW5jdGlvblwiKSA/IGNhbGwgOiBzZWxmO1xufTsiLCJcInVzZSBzdHJpY3RcIjtcblxuZXhwb3J0cy5fX2VzTW9kdWxlID0gdHJ1ZTtcblxudmFyIF9pdGVyYXRvciA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvclwiKTtcblxudmFyIF9pdGVyYXRvcjIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9pdGVyYXRvcik7XG5cbnZhciBfc3ltYm9sID0gcmVxdWlyZShcIi4uL2NvcmUtanMvc3ltYm9sXCIpO1xuXG52YXIgX3N5bWJvbDIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9zeW1ib2wpO1xuXG52YXIgX3R5cGVvZiA9IHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgdHlwZW9mIF9pdGVyYXRvcjIuZGVmYXVsdCA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHsgcmV0dXJuIHR5cGVvZiBvYmo7IH0gOiBmdW5jdGlvbiAob2JqKSB7IHJldHVybiBvYmogJiYgdHlwZW9mIF9zeW1ib2wyLmRlZmF1bHQgPT09IFwiZnVuY3Rpb25cIiAmJiBvYmouY29uc3RydWN0b3IgPT09IF9zeW1ib2wyLmRlZmF1bHQgJiYgb2JqICE9PSBfc3ltYm9sMi5kZWZhdWx0LnByb3RvdHlwZSA/IFwic3ltYm9sXCIgOiB0eXBlb2Ygb2JqOyB9O1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIF90eXBlb2YoX2l0ZXJhdG9yMi5kZWZhdWx0KSA9PT0gXCJzeW1ib2xcIiA/IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihvYmopO1xufSA6IGZ1bmN0aW9uIChvYmopIHtcbiAgcmV0dXJuIG9iaiAmJiB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIG9iai5jb25zdHJ1Y3RvciA9PT0gX3N5bWJvbDIuZGVmYXVsdCAmJiBvYmogIT09IF9zeW1ib2wyLmRlZmF1bHQucHJvdG90eXBlID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihvYmopO1xufTsiLCJyZXF1aXJlKCcuLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbnJlcXVpcmUoJy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi9tb2R1bGVzL2NvcmUuZ2V0LWl0ZXJhdG9yJyk7IiwidmFyIGNvcmUgID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpXG4gICwgJEpTT04gPSBjb3JlLkpTT04gfHwgKGNvcmUuSlNPTiA9IHtzdHJpbmdpZnk6IEpTT04uc3RyaW5naWZ5fSk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgcmV0dXJuICRKU09OLnN0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJndW1lbnRzKTtcbn07IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYubnVtYmVyLmlzLWludGVnZXInKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk51bWJlci5pc0ludGVnZXI7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmFzc2lnbjsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuY3JlYXRlJyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGNyZWF0ZShQLCBEKXtcbiAgcmV0dXJuICRPYmplY3QuY3JlYXRlKFAsIEQpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZGVmaW5lLXByb3BlcnR5Jyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2Mpe1xuICByZXR1cm4gJE9iamVjdC5kZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBkZXNjKTtcbn07IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvcicpO1xudmFyICRPYmplY3QgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0O1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIHJldHVybiAkT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KTtcbn07IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LmdldC1wcm90b3R5cGUtb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdC5nZXRQcm90b3R5cGVPZjsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3Quc2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LnNldFByb3RvdHlwZU9mOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN5bWJvbCcpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYub2JqZWN0LnRvLXN0cmluZycpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wub2JzZXJ2YWJsZScpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuU3ltYm9sOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2LnN0cmluZy5pdGVyYXRvcicpO1xucmVxdWlyZSgnLi4vLi4vbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX3drcy1leHQnKS5mKCdpdGVyYXRvcicpOyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZih0eXBlb2YgaXQgIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBhIGZ1bmN0aW9uIScpO1xuICByZXR1cm4gaXQ7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oKXsgLyogZW1wdHkgKi8gfTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICBpZighaXNPYmplY3QoaXQpKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGFuIG9iamVjdCEnKTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBmYWxzZSAtPiBBcnJheSNpbmRleE9mXG4vLyB0cnVlICAtPiBBcnJheSNpbmNsdWRlc1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIHRvTGVuZ3RoICA9IHJlcXVpcmUoJy4vX3RvLWxlbmd0aCcpXG4gICwgdG9JbmRleCAgID0gcmVxdWlyZSgnLi9fdG8taW5kZXgnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oSVNfSU5DTFVERVMpe1xuICByZXR1cm4gZnVuY3Rpb24oJHRoaXMsIGVsLCBmcm9tSW5kZXgpe1xuICAgIHZhciBPICAgICAgPSB0b0lPYmplY3QoJHRoaXMpXG4gICAgICAsIGxlbmd0aCA9IHRvTGVuZ3RoKE8ubGVuZ3RoKVxuICAgICAgLCBpbmRleCAgPSB0b0luZGV4KGZyb21JbmRleCwgbGVuZ3RoKVxuICAgICAgLCB2YWx1ZTtcbiAgICAvLyBBcnJheSNpbmNsdWRlcyB1c2VzIFNhbWVWYWx1ZVplcm8gZXF1YWxpdHkgYWxnb3JpdGhtXG4gICAgaWYoSVNfSU5DTFVERVMgJiYgZWwgIT0gZWwpd2hpbGUobGVuZ3RoID4gaW5kZXgpe1xuICAgICAgdmFsdWUgPSBPW2luZGV4KytdO1xuICAgICAgaWYodmFsdWUgIT0gdmFsdWUpcmV0dXJuIHRydWU7XG4gICAgLy8gQXJyYXkjdG9JbmRleCBpZ25vcmVzIGhvbGVzLCBBcnJheSNpbmNsdWRlcyAtIG5vdFxuICAgIH0gZWxzZSBmb3IoO2xlbmd0aCA+IGluZGV4OyBpbmRleCsrKWlmKElTX0lOQ0xVREVTIHx8IGluZGV4IGluIE8pe1xuICAgICAgaWYoT1tpbmRleF0gPT09IGVsKXJldHVybiBJU19JTkNMVURFUyB8fCBpbmRleCB8fCAwO1xuICAgIH0gcmV0dXJuICFJU19JTkNMVURFUyAmJiAtMTtcbiAgfTtcbn07IiwiLy8gZ2V0dGluZyB0YWcgZnJvbSAxOS4xLjMuNiBPYmplY3QucHJvdG90eXBlLnRvU3RyaW5nKClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpXG4gIC8vIEVTMyB3cm9uZyBoZXJlXG4gICwgQVJHID0gY29mKGZ1bmN0aW9uKCl7IHJldHVybiBhcmd1bWVudHM7IH0oKSkgPT0gJ0FyZ3VtZW50cyc7XG5cbi8vIGZhbGxiYWNrIGZvciBJRTExIFNjcmlwdCBBY2Nlc3MgRGVuaWVkIGVycm9yXG52YXIgdHJ5R2V0ID0gZnVuY3Rpb24oaXQsIGtleSl7XG4gIHRyeSB7XG4gICAgcmV0dXJuIGl0W2tleV07XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbn07XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgTywgVCwgQjtcbiAgcmV0dXJuIGl0ID09PSB1bmRlZmluZWQgPyAnVW5kZWZpbmVkJyA6IGl0ID09PSBudWxsID8gJ051bGwnXG4gICAgLy8gQEB0b1N0cmluZ1RhZyBjYXNlXG4gICAgOiB0eXBlb2YgKFQgPSB0cnlHZXQoTyA9IE9iamVjdChpdCksIFRBRykpID09ICdzdHJpbmcnID8gVFxuICAgIC8vIGJ1aWx0aW5UYWcgY2FzZVxuICAgIDogQVJHID8gY29mKE8pXG4gICAgLy8gRVMzIGFyZ3VtZW50cyBmYWxsYmFja1xuICAgIDogKEIgPSBjb2YoTykpID09ICdPYmplY3QnICYmIHR5cGVvZiBPLmNhbGxlZSA9PSAnZnVuY3Rpb24nID8gJ0FyZ3VtZW50cycgOiBCO1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7IiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgcmVzdWx0ICAgICA9IGdldEtleXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICBpZihnZXRTeW1ib2xzKXtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpXG4gICAgICAsIGlzRW51bSAgPSBwSUUuZlxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoc3ltYm9scy5sZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIEMpe1xuICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IEMoYSk7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQyhhLCBiKTtcbiAgICAgICAgICB9IHJldHVybiBuZXcgQyhhLCBiLCBjKTtcbiAgICAgICAgfSByZXR1cm4gQy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUubWV0aG9kcy4lTkFNRSVcbiAgICBpZihJU19QUk9UTyl7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYodHlwZSAmICRleHBvcnQuUiAmJiBleHBQcm90byAmJiAhZXhwUHJvdG9ba2V5XSloaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCIvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZmxvb3IgICAgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0ludGVnZXIoaXQpe1xuICByZXR1cm4gIWlzT2JqZWN0KGl0KSAmJiBpc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwidmFyIGdldEtleXMgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGtleXMgICA9IGdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTsiLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgZ09QUyAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCAkYXNzaWduICA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHZhciBBID0ge31cbiAgICAsIEIgPSB7fVxuICAgICwgUyA9IFN5bWJvbCgpXG4gICAgLCBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24oayl7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgICAgID0gdG9PYmplY3QodGFyZ2V0KVxuICAgICwgYUxlbiAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBpbmRleCA9IDFcbiAgICAsIGdldFN5bWJvbHMgPSBnT1BTLmZcbiAgICAsIGlzRW51bSAgICAgPSBwSUUuZjtcbiAgd2hpbGUoYUxlbiA+IGluZGV4KXtcbiAgICB2YXIgUyAgICAgID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pXG4gICAgICAsIGtleXMgICA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaiAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUobGVuZ3RoID4gailpZihpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKVRba2V5XSA9IFNba2V5XTtcbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduOyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBkUHMgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBFbXB0eSAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcbiAgICAsIGx0ICAgICA9ICc8J1xuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpe1xuICB2YXIgcmVzdWx0O1xuICBpZihPICE9PSBudWxsKXtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgcElFICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCBnT1BEICAgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGdPUE4gICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZlxuICAsIHRvU3RyaW5nICA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24oaXQpe1xuICB0cnkge1xuICAgIHJldHVybiBnT1BOKGl0KTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICByZXR1cm4gd2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScgPyBnZXRXaW5kb3dOYW1lcyhpdCkgOiBnT1BOKHRvSU9iamVjdChpdCkpO1xufTtcbiIsIi8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbnZhciAka2V5cyAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07IiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sczsiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgbmFtZXMpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTsiLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTsiLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBjb3JlICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgZmFpbHMgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG4gIHZhciBmbiAgPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbihPLCBwcm90byl7XG4gIGFuT2JqZWN0KE8pO1xuICBpZighaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKXRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uKHRlc3QsIGJ1Z2d5LCBzZXQpe1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi9fY3R4JykoRnVuY3Rpb24uY2FsbCwgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBoYXMgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZihuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKWRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHt2YWx1ZTogd2tzRXh0LmYobmFtZSl9KTtcbn07IiwiZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fd2tzJyk7IiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7IiwidmFyIGNsYXNzb2YgICA9IHJlcXVpcmUoJy4vX2NsYXNzb2YnKVxuICAsIElURVJBVE9SICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgSXRlcmF0b3JzID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvck1ldGhvZCA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgIT0gdW5kZWZpbmVkKXJldHVybiBpdFtJVEVSQVRPUl1cbiAgICB8fCBpdFsnQEBpdGVyYXRvciddXG4gICAgfHwgSXRlcmF0b3JzW2NsYXNzb2YoaXQpXTtcbn07IiwidmFyIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBnZXQgICAgICA9IHJlcXVpcmUoJy4vY29yZS5nZXQtaXRlcmF0b3ItbWV0aG9kJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2NvcmUnKS5nZXRJdGVyYXRvciA9IGZ1bmN0aW9uKGl0KXtcbiAgdmFyIGl0ZXJGbiA9IGdldChpdCk7XG4gIGlmKHR5cGVvZiBpdGVyRm4gIT0gJ2Z1bmN0aW9uJyl0aHJvdyBUeXBlRXJyb3IoaXQgKyAnIGlzIG5vdCBpdGVyYWJsZSEnKTtcbiAgcmV0dXJuIGFuT2JqZWN0KGl0ZXJGbi5jYWxsKGl0KSk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBhZGRUb1Vuc2NvcGFibGVzID0gcmVxdWlyZSgnLi9fYWRkLXRvLXVuc2NvcGFibGVzJylcbiAgLCBzdGVwICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faXRlci1zdGVwJylcbiAgLCBJdGVyYXRvcnMgICAgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCB0b0lPYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpO1xuXG4vLyAyMi4xLjMuNCBBcnJheS5wcm90b3R5cGUuZW50cmllcygpXG4vLyAyMi4xLjMuMTMgQXJyYXkucHJvdG90eXBlLmtleXMoKVxuLy8gMjIuMS4zLjI5IEFycmF5LnByb3RvdHlwZS52YWx1ZXMoKVxuLy8gMjIuMS4zLjMwIEFycmF5LnByb3RvdHlwZVtAQGl0ZXJhdG9yXSgpXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoQXJyYXksICdBcnJheScsIGZ1bmN0aW9uKGl0ZXJhdGVkLCBraW5kKXtcbiAgdGhpcy5fdCA9IHRvSU9iamVjdChpdGVyYXRlZCk7IC8vIHRhcmdldFxuICB0aGlzLl9pID0gMDsgICAgICAgICAgICAgICAgICAgLy8gbmV4dCBpbmRleFxuICB0aGlzLl9rID0ga2luZDsgICAgICAgICAgICAgICAgLy8ga2luZFxuLy8gMjIuMS41LjIuMSAlQXJyYXlJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBraW5kICA9IHRoaXMuX2tcbiAgICAsIGluZGV4ID0gdGhpcy5faSsrO1xuICBpZighTyB8fCBpbmRleCA+PSBPLmxlbmd0aCl7XG4gICAgdGhpcy5fdCA9IHVuZGVmaW5lZDtcbiAgICByZXR1cm4gc3RlcCgxKTtcbiAgfVxuICBpZihraW5kID09ICdrZXlzJyAgKXJldHVybiBzdGVwKDAsIGluZGV4KTtcbiAgaWYoa2luZCA9PSAndmFsdWVzJylyZXR1cm4gc3RlcCgwLCBPW2luZGV4XSk7XG4gIHJldHVybiBzdGVwKDAsIFtpbmRleCwgT1tpbmRleF1dKTtcbn0sICd2YWx1ZXMnKTtcblxuLy8gYXJndW1lbnRzTGlzdFtAQGl0ZXJhdG9yXSBpcyAlQXJyYXlQcm90b192YWx1ZXMlICg5LjQuNC42LCA5LjQuNC43KVxuSXRlcmF0b3JzLkFyZ3VtZW50cyA9IEl0ZXJhdG9ycy5BcnJheTtcblxuYWRkVG9VbnNjb3BhYmxlcygna2V5cycpO1xuYWRkVG9VbnNjb3BhYmxlcygndmFsdWVzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCdlbnRyaWVzJyk7IiwiLy8gMjAuMS4yLjMgTnVtYmVyLmlzSW50ZWdlcihudW1iZXIpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUywgJ051bWJlcicsIHtpc0ludGVnZXI6IHJlcXVpcmUoJy4vX2lzLWludGVnZXInKX0pOyIsIi8vIDE5LjEuMy4xIE9iamVjdC5hc3NpZ24odGFyZ2V0LCBzb3VyY2UpXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiwgJ09iamVjdCcsIHthc3NpZ246IHJlcXVpcmUoJy4vX29iamVjdC1hc3NpZ24nKX0pOyIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jylcbi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7Y3JlYXRlOiByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJyl9KTsiLCJ2YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuLy8gMTkuMS4yLjQgLyAxNS4yLjMuNiBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJyksICdPYmplY3QnLCB7ZGVmaW5lUHJvcGVydHk6IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZ9KTsiLCIvLyAxOS4xLjIuNiBPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApXG52YXIgdG9JT2JqZWN0ICAgICAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpLmY7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yJywgZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgICByZXR1cm4gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcih0b0lPYmplY3QoaXQpLCBrZXkpO1xuICB9O1xufSk7IiwiLy8gMTkuMS4yLjkgT2JqZWN0LmdldFByb3RvdHlwZU9mKE8pXG52YXIgdG9PYmplY3QgICAgICAgID0gcmVxdWlyZSgnLi9fdG8tb2JqZWN0JylcbiAgLCAkZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJyk7XG5cbnJlcXVpcmUoJy4vX29iamVjdC1zYXAnKSgnZ2V0UHJvdG90eXBlT2YnLCBmdW5jdGlvbigpe1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0UHJvdG90eXBlT2YoaXQpe1xuICAgIHJldHVybiAkZ2V0UHJvdG90eXBlT2YodG9PYmplY3QoaXQpKTtcbiAgfTtcbn0pOyIsIi8vIDE5LjEuMy4xOSBPYmplY3Quc2V0UHJvdG90eXBlT2YoTywgcHJvdG8pXG52YXIgJGV4cG9ydCA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpO1xuJGV4cG9ydCgkZXhwb3J0LlMsICdPYmplY3QnLCB7c2V0UHJvdG90eXBlT2Y6IHJlcXVpcmUoJy4vX3NldC1wcm90bycpLnNldH0pOyIsIiIsIid1c2Ugc3RyaWN0JztcbnZhciAkYXQgID0gcmVxdWlyZSgnLi9fc3RyaW5nLWF0JykodHJ1ZSk7XG5cbi8vIDIxLjEuMy4yNyBTdHJpbmcucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2l0ZXItZGVmaW5lJykoU3RyaW5nLCAnU3RyaW5nJywgZnVuY3Rpb24oaXRlcmF0ZWQpe1xuICB0aGlzLl90ID0gU3RyaW5nKGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4vLyAyMS4xLjUuMi4xICVTdHJpbmdJdGVyYXRvclByb3RvdHlwZSUubmV4dCgpXG59LCBmdW5jdGlvbigpe1xuICB2YXIgTyAgICAgPSB0aGlzLl90XG4gICAgLCBpbmRleCA9IHRoaXMuX2lcbiAgICAsIHBvaW50O1xuICBpZihpbmRleCA+PSBPLmxlbmd0aClyZXR1cm4ge3ZhbHVlOiB1bmRlZmluZWQsIGRvbmU6IHRydWV9O1xuICBwb2ludCA9ICRhdChPLCBpbmRleCk7XG4gIHRoaXMuX2kgKz0gcG9pbnQubGVuZ3RoO1xuICByZXR1cm4ge3ZhbHVlOiBwb2ludCwgZG9uZTogZmFsc2V9O1xufSk7IiwiJ3VzZSBzdHJpY3QnO1xuLy8gRUNNQVNjcmlwdCA2IHN5bWJvbHMgc2hpbVxudmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoYXMgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hhcycpXG4gICwgREVTQ1JJUFRPUlMgICAgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpXG4gICwgJGV4cG9ydCAgICAgICAgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuICAsIHJlZGVmaW5lICAgICAgID0gcmVxdWlyZSgnLi9fcmVkZWZpbmUnKVxuICAsIE1FVEEgICAgICAgICAgID0gcmVxdWlyZSgnLi9fbWV0YScpLktFWVxuICAsICRmYWlscyAgICAgICAgID0gcmVxdWlyZSgnLi9fZmFpbHMnKVxuICAsIHNoYXJlZCAgICAgICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkJylcbiAgLCBzZXRUb1N0cmluZ1RhZyA9IHJlcXVpcmUoJy4vX3NldC10by1zdHJpbmctdGFnJylcbiAgLCB1aWQgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3VpZCcpXG4gICwgd2tzICAgICAgICAgICAgPSByZXF1aXJlKCcuL193a3MnKVxuICAsIHdrc0V4dCAgICAgICAgID0gcmVxdWlyZSgnLi9fd2tzLWV4dCcpXG4gICwgd2tzRGVmaW5lICAgICAgPSByZXF1aXJlKCcuL193a3MtZGVmaW5lJylcbiAgLCBrZXlPZiAgICAgICAgICA9IHJlcXVpcmUoJy4vX2tleW9mJylcbiAgLCBlbnVtS2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX2VudW0ta2V5cycpXG4gICwgaXNBcnJheSAgICAgICAgPSByZXF1aXJlKCcuL19pcy1hcnJheScpXG4gICwgYW5PYmplY3QgICAgICAgPSByZXF1aXJlKCcuL19hbi1vYmplY3QnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGNyZWF0ZURlc2MgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgX2NyZWF0ZSAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtY3JlYXRlJylcbiAgLCBnT1BORXh0ICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuLWV4dCcpXG4gICwgJEdPUEQgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wZCcpXG4gICwgJERQICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsICRrZXlzICAgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUEQgICAgICAgICAgID0gJEdPUEQuZlxuICAsIGRQICAgICAgICAgICAgID0gJERQLmZcbiAgLCBnT1BOICAgICAgICAgICA9IGdPUE5FeHQuZlxuICAsICRTeW1ib2wgICAgICAgID0gZ2xvYmFsLlN5bWJvbFxuICAsICRKU09OICAgICAgICAgID0gZ2xvYmFsLkpTT05cbiAgLCBfc3RyaW5naWZ5ICAgICA9ICRKU09OICYmICRKU09OLnN0cmluZ2lmeVxuICAsIFBST1RPVFlQRSAgICAgID0gJ3Byb3RvdHlwZSdcbiAgLCBISURERU4gICAgICAgICA9IHdrcygnX2hpZGRlbicpXG4gICwgVE9fUFJJTUlUSVZFICAgPSB3a3MoJ3RvUHJpbWl0aXZlJylcbiAgLCBpc0VudW0gICAgICAgICA9IHt9LnByb3BlcnR5SXNFbnVtZXJhYmxlXG4gICwgU3ltYm9sUmVnaXN0cnkgPSBzaGFyZWQoJ3N5bWJvbC1yZWdpc3RyeScpXG4gICwgQWxsU3ltYm9scyAgICAgPSBzaGFyZWQoJ3N5bWJvbHMnKVxuICAsIE9QU3ltYm9scyAgICAgID0gc2hhcmVkKCdvcC1zeW1ib2xzJylcbiAgLCBPYmplY3RQcm90byAgICA9IE9iamVjdFtQUk9UT1RZUEVdXG4gICwgVVNFX05BVElWRSAgICAgPSB0eXBlb2YgJFN5bWJvbCA9PSAnZnVuY3Rpb24nXG4gICwgUU9iamVjdCAgICAgICAgPSBnbG9iYWwuUU9iamVjdDtcbi8vIERvbid0IHVzZSBzZXR0ZXJzIGluIFF0IFNjcmlwdCwgaHR0cHM6Ly9naXRodWIuY29tL3psb2lyb2NrL2NvcmUtanMvaXNzdWVzLzE3M1xudmFyIHNldHRlciA9ICFRT2JqZWN0IHx8ICFRT2JqZWN0W1BST1RPVFlQRV0gfHwgIVFPYmplY3RbUFJPVE9UWVBFXS5maW5kQ2hpbGQ7XG5cbi8vIGZhbGxiYWNrIGZvciBvbGQgQW5kcm9pZCwgaHR0cHM6Ly9jb2RlLmdvb2dsZS5jb20vcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTY4N1xudmFyIHNldFN5bWJvbERlc2MgPSBERVNDUklQVE9SUyAmJiAkZmFpbHMoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIF9jcmVhdGUoZFAoe30sICdhJywge1xuICAgIGdldDogZnVuY3Rpb24oKXsgcmV0dXJuIGRQKHRoaXMsICdhJywge3ZhbHVlOiA3fSkuYTsgfVxuICB9KSkuYSAhPSA3O1xufSkgPyBmdW5jdGlvbihpdCwga2V5LCBEKXtcbiAgdmFyIHByb3RvRGVzYyA9IGdPUEQoT2JqZWN0UHJvdG8sIGtleSk7XG4gIGlmKHByb3RvRGVzYylkZWxldGUgT2JqZWN0UHJvdG9ba2V5XTtcbiAgZFAoaXQsIGtleSwgRCk7XG4gIGlmKHByb3RvRGVzYyAmJiBpdCAhPT0gT2JqZWN0UHJvdG8pZFAoT2JqZWN0UHJvdG8sIGtleSwgcHJvdG9EZXNjKTtcbn0gOiBkUDtcblxudmFyIHdyYXAgPSBmdW5jdGlvbih0YWcpe1xuICB2YXIgc3ltID0gQWxsU3ltYm9sc1t0YWddID0gX2NyZWF0ZSgkU3ltYm9sW1BST1RPVFlQRV0pO1xuICBzeW0uX2sgPSB0YWc7XG4gIHJldHVybiBzeW07XG59O1xuXG52YXIgaXNTeW1ib2wgPSBVU0VfTkFUSVZFICYmIHR5cGVvZiAkU3ltYm9sLml0ZXJhdG9yID09ICdzeW1ib2wnID8gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gdHlwZW9mIGl0ID09ICdzeW1ib2wnO1xufSA6IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGl0IGluc3RhbmNlb2YgJFN5bWJvbDtcbn07XG5cbnZhciAkZGVmaW5lUHJvcGVydHkgPSBmdW5jdGlvbiBkZWZpbmVQcm9wZXJ0eShpdCwga2V5LCBEKXtcbiAgaWYoaXQgPT09IE9iamVjdFByb3RvKSRkZWZpbmVQcm9wZXJ0eShPUFN5bWJvbHMsIGtleSwgRCk7XG4gIGFuT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgYW5PYmplY3QoRCk7XG4gIGlmKGhhcyhBbGxTeW1ib2xzLCBrZXkpKXtcbiAgICBpZighRC5lbnVtZXJhYmxlKXtcbiAgICAgIGlmKCFoYXMoaXQsIEhJRERFTikpZFAoaXQsIEhJRERFTiwgY3JlYXRlRGVzYygxLCB7fSkpO1xuICAgICAgaXRbSElEREVOXVtrZXldID0gdHJ1ZTtcbiAgICB9IGVsc2Uge1xuICAgICAgaWYoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSlpdFtISURERU5dW2tleV0gPSBmYWxzZTtcbiAgICAgIEQgPSBfY3JlYXRlKEQsIHtlbnVtZXJhYmxlOiBjcmVhdGVEZXNjKDAsIGZhbHNlKX0pO1xuICAgIH0gcmV0dXJuIHNldFN5bWJvbERlc2MoaXQsIGtleSwgRCk7XG4gIH0gcmV0dXJuIGRQKGl0LCBrZXksIEQpO1xufTtcbnZhciAkZGVmaW5lUHJvcGVydGllcyA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoaXQsIFApe1xuICBhbk9iamVjdChpdCk7XG4gIHZhciBrZXlzID0gZW51bUtleXMoUCA9IHRvSU9iamVjdChQKSlcbiAgICAsIGkgICAgPSAwXG4gICAgLCBsID0ga2V5cy5sZW5ndGhcbiAgICAsIGtleTtcbiAgd2hpbGUobCA+IGkpJGRlZmluZVByb3BlcnR5KGl0LCBrZXkgPSBrZXlzW2krK10sIFBba2V5XSk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgJGNyZWF0ZSA9IGZ1bmN0aW9uIGNyZWF0ZShpdCwgUCl7XG4gIHJldHVybiBQID09PSB1bmRlZmluZWQgPyBfY3JlYXRlKGl0KSA6ICRkZWZpbmVQcm9wZXJ0aWVzKF9jcmVhdGUoaXQpLCBQKTtcbn07XG52YXIgJHByb3BlcnR5SXNFbnVtZXJhYmxlID0gZnVuY3Rpb24gcHJvcGVydHlJc0VudW1lcmFibGUoa2V5KXtcbiAgdmFyIEUgPSBpc0VudW0uY2FsbCh0aGlzLCBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpKTtcbiAgaWYodGhpcyA9PT0gT2JqZWN0UHJvdG8gJiYgaGFzKEFsbFN5bWJvbHMsIGtleSkgJiYgIWhhcyhPUFN5bWJvbHMsIGtleSkpcmV0dXJuIGZhbHNlO1xuICByZXR1cm4gRSB8fCAhaGFzKHRoaXMsIGtleSkgfHwgIWhhcyhBbGxTeW1ib2xzLCBrZXkpIHx8IGhhcyh0aGlzLCBISURERU4pICYmIHRoaXNbSElEREVOXVtrZXldID8gRSA6IHRydWU7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IgPSBmdW5jdGlvbiBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoaXQsIGtleSl7XG4gIGl0ICA9IHRvSU9iamVjdChpdCk7XG4gIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSk7XG4gIGlmKGl0ID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSlyZXR1cm47XG4gIHZhciBEID0gZ09QRChpdCwga2V5KTtcbiAgaWYoRCAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhKGhhcyhpdCwgSElEREVOKSAmJiBpdFtISURERU5dW2tleV0pKUQuZW51bWVyYWJsZSA9IHRydWU7XG4gIHJldHVybiBEO1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlOYW1lcyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICB2YXIgbmFtZXMgID0gZ09QTih0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoIWhhcyhBbGxTeW1ib2xzLCBrZXkgPSBuYW1lc1tpKytdKSAmJiBrZXkgIT0gSElEREVOICYmIGtleSAhPSBNRVRBKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG52YXIgJGdldE93blByb3BlcnR5U3ltYm9scyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5U3ltYm9scyhpdCl7XG4gIHZhciBJU19PUCAgPSBpdCA9PT0gT2JqZWN0UHJvdG9cbiAgICAsIG5hbWVzICA9IGdPUE4oSVNfT1AgPyBPUFN5bWJvbHMgOiB0b0lPYmplY3QoaXQpKVxuICAgICwgcmVzdWx0ID0gW11cbiAgICAsIGkgICAgICA9IDBcbiAgICAsIGtleTtcbiAgd2hpbGUobmFtZXMubGVuZ3RoID4gaSl7XG4gICAgaWYoaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIChJU19PUCA/IGhhcyhPYmplY3RQcm90bywga2V5KSA6IHRydWUpKXJlc3VsdC5wdXNoKEFsbFN5bWJvbHNba2V5XSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07XG5cbi8vIDE5LjQuMS4xIFN5bWJvbChbZGVzY3JpcHRpb25dKVxuaWYoIVVTRV9OQVRJVkUpe1xuICAkU3ltYm9sID0gZnVuY3Rpb24gU3ltYm9sKCl7XG4gICAgaWYodGhpcyBpbnN0YW5jZW9mICRTeW1ib2wpdGhyb3cgVHlwZUVycm9yKCdTeW1ib2wgaXMgbm90IGEgY29uc3RydWN0b3IhJyk7XG4gICAgdmFyIHRhZyA9IHVpZChhcmd1bWVudHMubGVuZ3RoID4gMCA/IGFyZ3VtZW50c1swXSA6IHVuZGVmaW5lZCk7XG4gICAgdmFyICRzZXQgPSBmdW5jdGlvbih2YWx1ZSl7XG4gICAgICBpZih0aGlzID09PSBPYmplY3RQcm90bykkc2V0LmNhbGwoT1BTeW1ib2xzLCB2YWx1ZSk7XG4gICAgICBpZihoYXModGhpcywgSElEREVOKSAmJiBoYXModGhpc1tISURERU5dLCB0YWcpKXRoaXNbSElEREVOXVt0YWddID0gZmFsc2U7XG4gICAgICBzZXRTeW1ib2xEZXNjKHRoaXMsIHRhZywgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xuICAgIH07XG4gICAgaWYoREVTQ1JJUFRPUlMgJiYgc2V0dGVyKXNldFN5bWJvbERlc2MoT2JqZWN0UHJvdG8sIHRhZywge2NvbmZpZ3VyYWJsZTogdHJ1ZSwgc2V0OiAkc2V0fSk7XG4gICAgcmV0dXJuIHdyYXAodGFnKTtcbiAgfTtcbiAgcmVkZWZpbmUoJFN5bWJvbFtQUk9UT1RZUEVdLCAndG9TdHJpbmcnLCBmdW5jdGlvbiB0b1N0cmluZygpe1xuICAgIHJldHVybiB0aGlzLl9rO1xuICB9KTtcblxuICAkR09QRC5mID0gJGdldE93blByb3BlcnR5RGVzY3JpcHRvcjtcbiAgJERQLmYgICA9ICRkZWZpbmVQcm9wZXJ0eTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4nKS5mID0gZ09QTkV4dC5mID0gJGdldE93blByb3BlcnR5TmFtZXM7XG4gIHJlcXVpcmUoJy4vX29iamVjdC1waWUnKS5mICA9ICRwcm9wZXJ0eUlzRW51bWVyYWJsZTtcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcHMnKS5mID0gJGdldE93blByb3BlcnR5U3ltYm9scztcblxuICBpZihERVNDUklQVE9SUyAmJiAhcmVxdWlyZSgnLi9fbGlicmFyeScpKXtcbiAgICByZWRlZmluZShPYmplY3RQcm90bywgJ3Byb3BlcnR5SXNFbnVtZXJhYmxlJywgJHByb3BlcnR5SXNFbnVtZXJhYmxlLCB0cnVlKTtcbiAgfVxuXG4gIHdrc0V4dC5mID0gZnVuY3Rpb24obmFtZSl7XG4gICAgcmV0dXJuIHdyYXAod2tzKG5hbWUpKTtcbiAgfVxufVxuXG4kZXhwb3J0KCRleHBvcnQuRyArICRleHBvcnQuVyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCB7U3ltYm9sOiAkU3ltYm9sfSk7XG5cbmZvcih2YXIgc3ltYm9scyA9IChcbiAgLy8gMTkuNC4yLjIsIDE5LjQuMi4zLCAxOS40LjIuNCwgMTkuNC4yLjYsIDE5LjQuMi44LCAxOS40LjIuOSwgMTkuNC4yLjEwLCAxOS40LjIuMTEsIDE5LjQuMi4xMiwgMTkuNC4yLjEzLCAxOS40LjIuMTRcbiAgJ2hhc0luc3RhbmNlLGlzQ29uY2F0U3ByZWFkYWJsZSxpdGVyYXRvcixtYXRjaCxyZXBsYWNlLHNlYXJjaCxzcGVjaWVzLHNwbGl0LHRvUHJpbWl0aXZlLHRvU3RyaW5nVGFnLHVuc2NvcGFibGVzJ1xuKS5zcGxpdCgnLCcpLCBpID0gMDsgc3ltYm9scy5sZW5ndGggPiBpOyApd2tzKHN5bWJvbHNbaSsrXSk7XG5cbmZvcih2YXIgc3ltYm9scyA9ICRrZXlzKHdrcy5zdG9yZSksIGkgPSAwOyBzeW1ib2xzLmxlbmd0aCA+IGk7ICl3a3NEZWZpbmUoc3ltYm9sc1tpKytdKTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ1N5bWJvbCcsIHtcbiAgLy8gMTkuNC4yLjEgU3ltYm9sLmZvcihrZXkpXG4gICdmb3InOiBmdW5jdGlvbihrZXkpe1xuICAgIHJldHVybiBoYXMoU3ltYm9sUmVnaXN0cnksIGtleSArPSAnJylcbiAgICAgID8gU3ltYm9sUmVnaXN0cnlba2V5XVxuICAgICAgOiBTeW1ib2xSZWdpc3RyeVtrZXldID0gJFN5bWJvbChrZXkpO1xuICB9LFxuICAvLyAxOS40LjIuNSBTeW1ib2wua2V5Rm9yKHN5bSlcbiAga2V5Rm9yOiBmdW5jdGlvbiBrZXlGb3Ioa2V5KXtcbiAgICBpZihpc1N5bWJvbChrZXkpKXJldHVybiBrZXlPZihTeW1ib2xSZWdpc3RyeSwga2V5KTtcbiAgICB0aHJvdyBUeXBlRXJyb3Ioa2V5ICsgJyBpcyBub3QgYSBzeW1ib2whJyk7XG4gIH0sXG4gIHVzZVNldHRlcjogZnVuY3Rpb24oKXsgc2V0dGVyID0gdHJ1ZTsgfSxcbiAgdXNlU2ltcGxlOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSBmYWxzZTsgfVxufSk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsICdPYmplY3QnLCB7XG4gIC8vIDE5LjEuMi4yIE9iamVjdC5jcmVhdGUoTyBbLCBQcm9wZXJ0aWVzXSlcbiAgY3JlYXRlOiAkY3JlYXRlLFxuICAvLyAxOS4xLjIuNCBPYmplY3QuZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcylcbiAgZGVmaW5lUHJvcGVydHk6ICRkZWZpbmVQcm9wZXJ0eSxcbiAgLy8gMTkuMS4yLjMgT2JqZWN0LmRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcylcbiAgZGVmaW5lUHJvcGVydGllczogJGRlZmluZVByb3BlcnRpZXMsXG4gIC8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbiAgZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yOiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yLFxuICAvLyAxOS4xLjIuNyBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyhPKVxuICBnZXRPd25Qcm9wZXJ0eU5hbWVzOiAkZ2V0T3duUHJvcGVydHlOYW1lcyxcbiAgLy8gMTkuMS4yLjggT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhPKVxuICBnZXRPd25Qcm9wZXJ0eVN5bWJvbHM6ICRnZXRPd25Qcm9wZXJ0eVN5bWJvbHNcbn0pO1xuXG4vLyAyNC4zLjIgSlNPTi5zdHJpbmdpZnkodmFsdWUgWywgcmVwbGFjZXIgWywgc3BhY2VdXSlcbiRKU09OICYmICRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GICogKCFVU0VfTkFUSVZFIHx8ICRmYWlscyhmdW5jdGlvbigpe1xuICB2YXIgUyA9ICRTeW1ib2woKTtcbiAgLy8gTVMgRWRnZSBjb252ZXJ0cyBzeW1ib2wgdmFsdWVzIHRvIEpTT04gYXMge31cbiAgLy8gV2ViS2l0IGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyBudWxsXG4gIC8vIFY4IHRocm93cyBvbiBib3hlZCBzeW1ib2xzXG4gIHJldHVybiBfc3RyaW5naWZ5KFtTXSkgIT0gJ1tudWxsXScgfHwgX3N0cmluZ2lmeSh7YTogU30pICE9ICd7fScgfHwgX3N0cmluZ2lmeShPYmplY3QoUykpICE9ICd7fSc7XG59KSksICdKU09OJywge1xuICBzdHJpbmdpZnk6IGZ1bmN0aW9uIHN0cmluZ2lmeShpdCl7XG4gICAgaWYoaXQgPT09IHVuZGVmaW5lZCB8fCBpc1N5bWJvbChpdCkpcmV0dXJuOyAvLyBJRTggcmV0dXJucyBzdHJpbmcgb24gdW5kZWZpbmVkXG4gICAgdmFyIGFyZ3MgPSBbaXRdXG4gICAgICAsIGkgICAgPSAxXG4gICAgICAsIHJlcGxhY2VyLCAkcmVwbGFjZXI7XG4gICAgd2hpbGUoYXJndW1lbnRzLmxlbmd0aCA+IGkpYXJncy5wdXNoKGFyZ3VtZW50c1tpKytdKTtcbiAgICByZXBsYWNlciA9IGFyZ3NbMV07XG4gICAgaWYodHlwZW9mIHJlcGxhY2VyID09ICdmdW5jdGlvbicpJHJlcGxhY2VyID0gcmVwbGFjZXI7XG4gICAgaWYoJHJlcGxhY2VyIHx8ICFpc0FycmF5KHJlcGxhY2VyKSlyZXBsYWNlciA9IGZ1bmN0aW9uKGtleSwgdmFsdWUpe1xuICAgICAgaWYoJHJlcGxhY2VyKXZhbHVlID0gJHJlcGxhY2VyLmNhbGwodGhpcywga2V5LCB2YWx1ZSk7XG4gICAgICBpZighaXNTeW1ib2wodmFsdWUpKXJldHVybiB2YWx1ZTtcbiAgICB9O1xuICAgIGFyZ3NbMV0gPSByZXBsYWNlcjtcbiAgICByZXR1cm4gX3N0cmluZ2lmeS5hcHBseSgkSlNPTiwgYXJncyk7XG4gIH1cbn0pO1xuXG4vLyAxOS40LjMuNCBTeW1ib2wucHJvdG90eXBlW0BAdG9QcmltaXRpdmVdKGhpbnQpXG4kU3ltYm9sW1BST1RPVFlQRV1bVE9fUFJJTUlUSVZFXSB8fCByZXF1aXJlKCcuL19oaWRlJykoJFN5bWJvbFtQUk9UT1RZUEVdLCBUT19QUklNSVRJVkUsICRTeW1ib2xbUFJPVE9UWVBFXS52YWx1ZU9mKTtcbi8vIDE5LjQuMy41IFN5bWJvbC5wcm90b3R5cGVbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKCRTeW1ib2wsICdTeW1ib2wnKTtcbi8vIDIwLjIuMS45IE1hdGhbQEB0b1N0cmluZ1RhZ11cbnNldFRvU3RyaW5nVGFnKE1hdGgsICdNYXRoJywgdHJ1ZSk7XG4vLyAyNC4zLjMgSlNPTltAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoZ2xvYmFsLkpTT04sICdKU09OJywgdHJ1ZSk7IiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdhc3luY0l0ZXJhdG9yJyk7IiwicmVxdWlyZSgnLi9fd2tzLWRlZmluZScpKCdvYnNlcnZhYmxlJyk7IiwicmVxdWlyZSgnLi9lczYuYXJyYXkuaXRlcmF0b3InKTtcbnZhciBnbG9iYWwgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBoaWRlICAgICAgICAgID0gcmVxdWlyZSgnLi9faGlkZScpXG4gICwgSXRlcmF0b3JzICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgVE9fU1RSSU5HX1RBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5mb3IodmFyIGNvbGxlY3Rpb25zID0gWydOb2RlTGlzdCcsICdET01Ub2tlbkxpc3QnLCAnTWVkaWFMaXN0JywgJ1N0eWxlU2hlZXRMaXN0JywgJ0NTU1J1bGVMaXN0J10sIGkgPSAwOyBpIDwgNTsgaSsrKXtcbiAgdmFyIE5BTUUgICAgICAgPSBjb2xsZWN0aW9uc1tpXVxuICAgICwgQ29sbGVjdGlvbiA9IGdsb2JhbFtOQU1FXVxuICAgICwgcHJvdG8gICAgICA9IENvbGxlY3Rpb24gJiYgQ29sbGVjdGlvbi5wcm90b3R5cGU7XG4gIGlmKHByb3RvICYmICFwcm90b1tUT19TVFJJTkdfVEFHXSloaWRlKHByb3RvLCBUT19TVFJJTkdfVEFHLCBOQU1FKTtcbiAgSXRlcmF0b3JzW05BTUVdID0gSXRlcmF0b3JzLkFycmF5O1xufSIsImNvbnN0IG1pbiA9IE1hdGgubWluO1xuY29uc3QgbWF4ID0gTWF0aC5tYXg7XG5cbmZ1bmN0aW9uIGNsaXAodmFsdWUsIGxvd2VyID0gLUluZmluaXR5LCB1cHBlciA9ICtJbmZpbml0eSkge1xuICByZXR1cm4gbWF4KGxvd2VyLCBtaW4odXBwZXIsIHZhbHVlKSlcbn1cblxuLyoqXG4gKiBEaWN0aW9ubmFyeSBvZiB0aGUgYXZhaWxhYmxlIHR5cGVzLiBFYWNoIGtleSBjb3JyZXNwb25kIHRvIHRoZSB0eXBlIG9mIHRoZVxuICogaW1wbGVtZW50ZWQgcGFyYW0gd2hpbGUgdGhlIGNvcnJlc3BvbmRpbmcgb2JqZWN0IHZhbHVlIHNob3VsZCB0aGVcbiAqIHtAbGluayBgcGFyYW1EZWZpbml0aW9uYH0gb2YgdGhlIGRlZmluZWQgdHlwZS5cbiAqXG4gKiB0eXBlZGVmIHtPYmplY3R9IHBhcmFtVGVtcGxhdGVzXG4gKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgcGFyYW1UZW1wbGF0ZT59XG4gKi9cblxuLyoqXG4gKiBEZWZpbml0aW9uIG9mIGEgcGFyYW1ldGVyLiBUaGUgZGVmaW5pdGlvbiBzaG91bGQgYXQgbGVhc3QgY29udGFpbiB0aGUgZW50cmllc1xuICogYHR5cGVgIGFuZCBgZGVmYXVsdGAuIEV2ZXJ5IHBhcmFtZXRlciBjYW4gYWxzbyBhY2NlcHQgb3B0aW9ubmFsIGNvbmZpZ3VyYXRpb25cbiAqIGVudHJpZXMgYGNvbnN0YW50YCBhbmQgYG1ldGFzYC5cbiAqIEF2YWlsYWJsZSBkZWZpbml0aW9ucyBhcmU6XG4gKiAtIHtAbGluayBib29sZWFuRGVmaW5pdGlvbn1cbiAqIC0ge0BsaW5rIGludGVnZXJEZWZpbml0aW9ufVxuICogLSB7QGxpbmsgZmxvYXREZWZpbml0aW9ufVxuICogLSB7QGxpbmsgc3RyaW5nRGVmaW5pdGlvbn1cbiAqIC0ge0BsaW5rIGVudW1EZWZpbml0aW9ufVxuICpcbiAqIHR5cGVkZWYge09iamVjdH0gcGFyYW1EZWZpbml0aW9uXG4gKiBAcHJvcGVydHkge1N0cmluZ30gdHlwZSAtIFR5cGUgb2YgdGhlIHBhcmFtZXRlci5cbiAqIEBwcm9wZXJ0eSB7TWl4ZWR9IGRlZmF1bHQgLSBEZWZhdWx0IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgaWYgbm9cbiAqICBpbml0aWFsaXphdGlvbiB2YWx1ZSBpcyBwcm92aWRlZC5cbiAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGNhbiBiZSBjaGFuZ2VcbiAqICBhZnRlciBpdHMgaW5pdGlhbGl6YXRpb24uXG4gKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPW51bGxdIC0gQW55IHVzZXIgZGVmaW5lZCBkYXRhIGFzc29jaWF0ZWQgdG8gdGhlXG4gKiAgcGFyYW1ldGVyIHRoYXQgY291bHMgYmUgdXNlZnVsbCBpbiB0aGUgYXBwbGljYXRpb24uXG4gKi9cblxuZXhwb3J0IGRlZmF1bHQge1xuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gYm9vbGVhbkRlZmluaXRpb25cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlPSdib29sZWFuJ10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFtjb25zdGFudD1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHBhcmFtZXRlciBpcyBjb25zdGFudC5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IFttZXRhcz17fV0gLSBPcHRpb25uYWwgbWV0YWRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGJvb2xlYW46IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCddLFxuICAgIHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnYm9vbGVhbicpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgYm9vbGVhbiBwYXJhbSBcIiR7bmFtZX1cIjogJHt2YWx1ZX1gKTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gaW50ZWdlckRlZmluaXRpb25cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlPSdpbnRlZ2VyJ10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFttaW49LUluZmluaXR5XSAtIE1pbmltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbbWF4PStJbmZpbml0eV0gLSBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGlzIGNvbnN0YW50LlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPXt9XSAtIE9wdGlvbm5hbCBtZXRhZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgaW50ZWdlcjoge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmICghKHR5cGVvZiB2YWx1ZSA9PT0gJ251bWJlcicgJiYgTWF0aC5mbG9vcih2YWx1ZSkgPT09IHZhbHVlKSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciBpbnRlZ2VyIHBhcmFtIFwiJHtuYW1lfVwiOiAke3ZhbHVlfWApO1xuXG4gICAgICByZXR1cm4gY2xpcCh2YWx1ZSwgZGVmaW5pdGlvbi5taW4sIGRlZmluaXRpb24ubWF4KTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IGZsb2F0RGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J2Zsb2F0J10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFttaW49LUluZmluaXR5XSAtIE1pbmltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbbWF4PStJbmZpbml0eV0gLSBNYXhpbXVtIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGlzIGNvbnN0YW50LlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPXt9XSAtIE9wdGlvbm5hbCBtZXRhZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgZmxvYXQ6IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCddLFxuICAgIHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnbnVtYmVyJyB8fMKgdmFsdWUgIT09IHZhbHVlKSAvLyByZWplY3QgTmFOXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgZmxvYXQgcGFyYW0gXCIke25hbWV9XCI6ICR7dmFsdWV9YCk7XG5cbiAgICAgIHJldHVybiBjbGlwKHZhbHVlLCBkZWZpbml0aW9uLm1pbiwgZGVmaW5pdGlvbi5tYXgpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gc3RyaW5nRGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J3N0cmluZyddIC0gRGVmaW5lIGEgYm9vbGVhbiBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVmYXVsdCAtIERlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgaXMgY29uc3RhbnQuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9e31dIC0gT3B0aW9ubmFsIG1ldGFkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBzdHJpbmc6IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCddLFxuICAgIHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKSB7XG4gICAgICBpZiAodHlwZW9mIHZhbHVlICE9PSAnc3RyaW5nJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciBzdHJpbmcgcGFyYW0gXCIke25hbWV9XCI6ICR7dmFsdWV9YCk7XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IGVudW1EZWZpbml0aW9uXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZT0nZW51bSddIC0gRGVmaW5lIGEgYm9vbGVhbiBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVmYXVsdCAtIERlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtBcnJheX0gbGlzdCAtIFBvc3NpYmxlIHZhbHVlcyBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFtjb25zdGFudD1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHBhcmFtZXRlciBpcyBjb25zdGFudC5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IFttZXRhcz17fV0gLSBPcHRpb25uYWwgbWV0YWRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGVudW06IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCcsICdsaXN0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmIChkZWZpbml0aW9uLmxpc3QuaW5kZXhPZih2YWx1ZSkgPT09IC0xKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yIGVudW0gcGFyYW0gXCIke25hbWV9XCI6ICR7dmFsdWV9YCk7XG5cbiAgICAgIHJldHVybiB2YWx1ZTtcbiAgICB9XG4gIH0sXG5cbiAgLyoqXG4gICAqIEB0eXBlZGVmIHtPYmplY3R9IGFueURlZmluaXRpb25cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlPSdlbnVtJ10gLSBEZWZpbmUgYSBwYXJhbWV0ZXIgb2YgYW55IHR5cGUuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gZGVmYXVsdCAtIERlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgaXMgY29uc3RhbnQuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9e31dIC0gT3B0aW9ubmFsIG1ldGFkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBhbnk6IHtcbiAgICBkZWZpbml0aW9uVGVtcGxhdGU6IFsnZGVmYXVsdCddLFxuICAgIHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKSB7XG4gICAgICAvLyBubyBjaGVjayBhcyBpdCBjYW4gaGF2ZSBhbnkgdHlwZS4uLlxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfVxufVxuIiwiaW1wb3J0IHBhcmFtVGVtcGxhdGVzIGZyb20gJy4vcGFyYW1UZW1wbGF0ZXMnO1xuXG4vKipcbiAqIEdlbmVyaWMgY2xhc3MgZm9yIHR5cGVkIHBhcmFtZXRlcnMuXG4gKlxuICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge0FycmF5fSBkZWZpbml0aW9uVGVtcGxhdGUgLSBMaXN0IG9mIG1hbmRhdG9yeSBrZXlzIGluIHRoZSBwYXJhbVxuICogIGRlZmluaXRpb24uXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSB0eXBlQ2hlY2tGdW5jdGlvbiAtIEZ1bmN0aW9uIHRvIGJlIHVzZWQgaW4gb3JkZXIgdG8gY2hlY2tcbiAqICB0aGUgdmFsdWUgYWdhaW5zdCB0aGUgcGFyYW0gZGVmaW5pdGlvbi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBkZWZpbml0aW9uIC0gRGVmaW5pdGlvbiBvZiB0aGUgcGFyYW1ldGVyLlxuICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBWYWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICogQHByaXZhdGVcbiAqL1xuY2xhc3MgUGFyYW0ge1xuICBjb25zdHJ1Y3RvcihuYW1lLCBkZWZpbml0aW9uVGVtcGxhdGUsIHR5cGVDaGVja0Z1bmN0aW9uLCBkZWZpbml0aW9uLCB2YWx1ZSkge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZS5mb3JFYWNoKGZ1bmN0aW9uKGtleSkge1xuICAgICAgaWYgKGRlZmluaXRpb24uaGFzT3duUHJvcGVydHkoa2V5KSA9PT0gZmFsc2UpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBkZWZpbml0aW9uIGZvciBwYXJhbSBcIiR7bmFtZX1cIiwgJHtrZXl9IGlzIG5vdCBkZWZpbmVkYCk7XG4gICAgfSk7XG5cbiAgICB0aGlzLm5hbWUgPSBuYW1lO1xuICAgIHRoaXMudHlwZSA9IGRlZmluaXRpb24udHlwZTtcbiAgICB0aGlzLmRlZmluaXRpb24gPSBkZWZpbml0aW9uO1xuXG4gICAgaWYgKHRoaXMuZGVmaW5pdGlvbi5udWxsYWJsZSA9PT0gdHJ1ZSAmJiB2YWx1ZSA9PT0gbnVsbClcbiAgICAgIHRoaXMudmFsdWUgPSBudWxsO1xuICAgIGVsc2VcbiAgICAgIHRoaXMudmFsdWUgPSB0eXBlQ2hlY2tGdW5jdGlvbih2YWx1ZSwgZGVmaW5pdGlvbiwgbmFtZSk7XG4gICAgdGhpcy5fdHlwZUNoZWNrRnVuY3Rpb24gPSB0eXBlQ2hlY2tGdW5jdGlvbjtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiBAcmV0dXJuIHtNaXhlZH1cbiAgICovXG4gIGdldFZhbHVlKCkge1xuICAgIHJldHVybiB0aGlzLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFVwZGF0ZSB0aGUgY3VycmVudCB2YWx1ZS5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybiB7Qm9vbGVhbn0gLSBgdHJ1ZWAgaWYgdGhlIHBhcmFtIGhhcyBiZWVuIHVwZGF0ZWQsIGZhbHNlIG90aGVyd2lzZVxuICAgKiAgKGUuZy4gaWYgdGhlIHBhcmFtZXRlciBhbHJlYWR5IGhhZCB0aGlzIHZhbHVlKS5cbiAgICovXG4gIHNldFZhbHVlKHZhbHVlKSB7XG4gICAgaWYgKHRoaXMuZGVmaW5pdGlvbi5jb25zdGFudCA9PT0gdHJ1ZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCBhc3NpZ25lbWVudCB0byBjb25zdGFudCBwYXJhbSBcIiR7dGhpcy5uYW1lfVwiYCk7XG5cbiAgICBpZiAoISh0aGlzLmRlZmluaXRpb24ubnVsbGFibGUgPT09IHRydWUgJiYgdmFsdWUgPT09IG51bGwpKVxuICAgICAgdmFsdWUgPSB0aGlzLl90eXBlQ2hlY2tGdW5jdGlvbih2YWx1ZSwgdGhpcy5kZWZpbml0aW9uLCB0aGlzLm5hbWUpO1xuXG4gICAgaWYgKHRoaXMudmFsdWUgIT09IHZhbHVlKSB7XG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICB9XG5cbiAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuXG4vKipcbiAqIEJhZyBvZiBwYXJhbWV0ZXJzLiBNYWluIGludGVyZmFjZSBvZiB0aGUgbGlicmFyeVxuICovXG5jbGFzcyBQYXJhbWV0ZXJCYWcge1xuICBjb25zdHJ1Y3RvcihwYXJhbXMsIGRlZmluaXRpb25zKSB7XG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBwYXJhbWV0ZXJzLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmcsIFBhcmFtPn1cbiAgICAgKiBAbmFtZSBfcGFyYW1zXG4gICAgICogQG1lbWJlcm9mIFBhcmFtZXRlckJhZ1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fcGFyYW1zID0gcGFyYW1zO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBkZWZpbml0aW9ucyB3aXRoIGluaXQgdmFsdWVzLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmcsIHBhcmFtRGVmaW5pdGlvbj59XG4gICAgICogQG5hbWUgX2RlZmluaXRpb25zXG4gICAgICogQG1lbWJlcm9mIFBhcmFtZXRlckJhZ1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZGVmaW5pdGlvbnMgPSBkZWZpbml0aW9ucztcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgZ2xvYmFsIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtTZXR9XG4gICAgICogQG5hbWUgX2dsb2JhbExpc3RlbmVyc1xuICAgICAqIEBtZW1iZXJvZiBQYXJhbWV0ZXJCYWdcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2dsb2JhbExpc3RlbmVycyA9IG5ldyBTZXQoKTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2YgcGFyYW1zIGxpc3RlbmVycy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBTZXQ+fVxuICAgICAqIEBuYW1lIF9wYXJhbXNMaXN0ZW5lcnNcbiAgICAgKiBAbWVtYmVyb2YgUGFyYW1ldGVyQmFnXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9wYXJhbXNMaXN0ZW5lcnMgPSB7fTtcblxuICAgIC8vIGluaXRpYWxpemUgZW1wdHkgU2V0IGZvciBlYWNoIHBhcmFtXG4gICAgZm9yIChsZXQgbmFtZSBpbiBwYXJhbXMpXG4gICAgICB0aGlzLl9wYXJhbXNMaXN0ZW5lcnNbbmFtZV0gPSBuZXcgU2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBnaXZlbiBkZWZpbml0aW9ucyBhbG9uZyB3aXRoIHRoZSBpbml0aWFsaXphdGlvbiB2YWx1ZXMuXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldERlZmluaXRpb25zKG5hbWUgPSBudWxsKSB7XG4gICAgaWYgKG5hbWUgIT09IG51bGwpXG4gICAgICByZXR1cm4gdGhpcy5fZGVmaW5pdGlvbnNbbmFtZV07XG4gICAgZWxzZVxuICAgICAgcmV0dXJuIHRoaXMuX2RlZmluaXRpb25zO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgdmFsdWUgb2YgdGhlIGdpdmVuIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEByZXR1cm4ge01peGVkfSAtIFZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBnZXQobmFtZSkge1xuICAgIGlmICghdGhpcy5fcGFyYW1zW25hbWVdKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBDYW5ub3QgcmVhZCBwcm9wZXJ0eSB2YWx1ZSBvZiB1bmRlZmluZWQgcGFyYW1ldGVyIFwiJHtuYW1lfVwiYCk7XG5cbiAgICByZXR1cm4gdGhpcy5fcGFyYW1zW25hbWVdLnZhbHVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgdmFsdWUgb2YgYSBwYXJhbWV0ZXIuIElmIHRoZSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIGlzIHVwZGF0ZWRcbiAgICogKGFrYSBpZiBwcmV2aW91cyB2YWx1ZSBpcyBkaWZmZXJlbnQgZnJvbSBuZXcgdmFsdWUpIGFsbCByZWdpc3RlcmVkXG4gICAqIGNhbGxiYWNrcyBhcmUgcmVnaXN0ZXJlZC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybiB7TWl4ZWR9IC0gTmV3IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBzZXQobmFtZSwgdmFsdWUpIHtcbiAgICBjb25zdCBwYXJhbSA9IHRoaXMuX3BhcmFtc1tuYW1lXTtcbiAgICBjb25zdCB1cGRhdGVkID0gcGFyYW0uc2V0VmFsdWUodmFsdWUpO1xuICAgIHZhbHVlID0gcGFyYW0uZ2V0VmFsdWUoKTtcblxuICAgIGlmICh1cGRhdGVkKSB7XG4gICAgICBjb25zdCBtZXRhcyA9IHBhcmFtLmRlZmluaXRpb24ubWV0YXM7XG4gICAgICAvLyB0cmlnZ2VyIGdsb2JhbCBsaXN0ZW5lcnNcbiAgICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMuX2dsb2JhbExpc3RlbmVycylcbiAgICAgICAgbGlzdGVuZXIobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgICAgLy8gdHJpZ2dlciBwYXJhbSBsaXN0ZW5lcnNcbiAgICAgIGZvciAobGV0IGxpc3RlbmVyIG9mIHRoaXMuX3BhcmFtc0xpc3RlbmVyc1tuYW1lXSlcbiAgICAgICAgbGlzdGVuZXIodmFsdWUsIG1ldGFzKTtcbiAgICB9XG5cbiAgICByZXR1cm4gdmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIGlmIHRoZSBgbmFtZWAgcGFyYW1ldGVyIGV4aXN0cyBvciBub3QuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gTmFtZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufVxuICAgKi9cbiAgaGFzKG5hbWUpIHtcbiAgICByZXR1cm4gKHRoaXMuX3BhcmFtc1tuYW1lXSkgPyB0cnVlIDogZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYSBwYXJhbWV0ZXIgdG8gaXRzIGluaXQgdmFsdWUuIFJlc2V0IGFsbCBwYXJhbWV0ZXJzIGlmIG5vIGFyZ3VtZW50LlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gW25hbWU9bnVsbF0gLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIgdG8gcmVzZXQuXG4gICAqL1xuICByZXNldChuYW1lID0gbnVsbCkge1xuICAgIGlmIChuYW1lICE9PSBudWxsKVxuICAgICAgdGhpcy5zZXQobmFtZSwgcGFyYW0uZGVmaW5pdGlvbi5pbml0VmFsdWUpO1xuICAgIGVsc2VcbiAgICAgIE9iamVjdC5rZXlzKHRoaXMuX3BhcmFtcykuZm9yRWFjaCgobmFtZSkgPT4gdGhpcy5yZXNldChuYW1lKSk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIFBhcmFtZXRlckJhZ35saXN0ZW5lckNhbGxiYWNrXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gUGFyYW1ldGVyIG5hbWUuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVXBkYXRlZCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW21ldGE9XSAtIEdpdmVuIG1ldGEgZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cblxuICAvKipcbiAgICogQWRkIGxpc3RlbmVyIHRvIGFsbCBwYXJhbSB1cGRhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1BhcmFtZXRlckJhZ35saXN0ZW5lckNhbGxhY2t9IGNhbGxiYWNrIC0gTGlzdGVuZXIgdG8gcmVnaXN0ZXIuXG4gICAqL1xuICBhZGRMaXN0ZW5lcihjYWxsYmFjaykge1xuICAgIHRoaXMuX2dsb2JhbExpc3RlbmVycy5hZGQoY2FsbGJhY2spO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSBsaXN0ZW5lciBmcm9tIGFsbCBwYXJhbSBjaGFuZ2VzLlxuICAgKlxuICAgKiBAcGFyYW0ge1BhcmFtZXRlckJhZ35saXN0ZW5lckNhbGxhY2t9IGNhbGxiYWNrIC0gTGlzdGVuZXIgdG8gcmVtb3ZlLiBJZlxuICAgKiAgYG51bGxgIHJlbW92ZSBhbGwgbGlzdGVuZXJzLlxuICAgKi9cbiAgcmVtb3ZlTGlzdGVuZXIoY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgaWYgKGNhbGxiYWNrID09PSBudWxsKVxuICAgICAgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzLmNsZWFyKCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogQGNhbGxiYWNrIFBhcmFtZXRlckJhZ35wYXJhbUxpc3RlbmVyQ2FsbGFja1xuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFVwZGF0ZWQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IFttZXRhPV0gLSBHaXZlbiBtZXRhIGRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG5cbiAgLyoqXG4gICAqIEFkZCBsaXN0ZW5lciB0byBhIGdpdmVuIHBhcmFtIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gUGFyYW1ldGVyIG5hbWUuXG4gICAqIEBwYXJhbSB7UGFyYW1ldGVyQmFnfnBhcmFtTGlzdGVuZXJDYWxsYWNrfSBjYWxsYmFjayAtIEZ1bmN0aW9uIHRvIGFwcGx5XG4gICAqICB3aGVuIHRoZSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyIGNoYW5nZXMuXG4gICAqL1xuICBhZGRQYXJhbUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fcGFyYW1zTGlzdGVuZXJzW25hbWVdLmFkZChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGxpc3RlbmVyIGZyb20gYSBnaXZlbiBwYXJhbSB1cGRhdGVzLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIFBhcmFtZXRlciBuYW1lLlxuICAgKiBAcGFyYW0ge1BhcmFtZXRlckJhZ35wYXJhbUxpc3RlbmVyQ2FsbGFja30gY2FsbGJhY2sgLSBMaXN0ZW5lciB0byByZW1vdmUuXG4gICAqICBJZiBgbnVsbGAgcmVtb3ZlIGFsbCBsaXN0ZW5lcnMuXG4gICAqL1xuICByZW1vdmVQYXJhbUxpc3RlbmVyKG5hbWUsIGNhbGxiYWNrID0gbnVsbCkge1xuICAgIGlmIChjYWxsYmFjayA9PT0gbnVsbClcbiAgICAgIHRoaXMuX3BhcmFtc0xpc3RlbmVyc1tuYW1lXS5jbGVhcigpO1xuICAgIGVsc2VcbiAgICAgIHRoaXMuX3BhcmFtc0xpc3RlbmVyc1tuYW1lXS5kZWxldGUoY2FsbGJhY2spO1xuICB9XG59XG5cbi8qKlxuICogRmFjdG9yeSBmb3IgdGhlIGBQYXJhbWV0ZXJCYWdgIGNsYXNzLlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0PFN0cmluZywgcGFyYW1EZWZpbml0aW9uPn0gZGVmaW5pdGlvbnMgLSBPYmplY3QgZGVzY3JpYmluZyB0aGVcbiAqICBwYXJhbWV0ZXJzLlxuICogQHBhcmFtIHtPYmplY3Q8U3RyaW5nLCBNaXhlZD59IHZhbHVlcyAtIEluaXRpYWxpemF0aW9uIHZhbHVlcyBmb3IgdGhlXG4gKiAgcGFyYW1ldGVycy5cbiAqIEByZXR1cm4ge1BhcmFtZXRlckJhZ31cbiAqL1xuZnVuY3Rpb24gcGFyYW1ldGVycyhkZWZpbml0aW9ucywgdmFsdWVzID0ge30pIHtcbiAgY29uc3QgcGFyYW1zID0ge307XG5cbiAgZm9yIChsZXQgbmFtZSBpbiB2YWx1ZXMpIHtcbiAgICBpZiAoZGVmaW5pdGlvbnMuaGFzT3duUHJvcGVydHkobmFtZSkgPT09IGZhbHNlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHBhcmFtIFwiJHtuYW1lfVwiYCk7XG4gIH1cblxuICBmb3IgKGxldCBuYW1lIGluIGRlZmluaXRpb25zKSB7XG4gICAgaWYgKHBhcmFtcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA9PT0gdHJ1ZSlcbiAgICAgIHRocm93IG5ldyBFcnJvcihgUGFyYW1ldGVyIFwiJHtuYW1lfVwiIGFscmVhZHkgZGVmaW5lZGApO1xuXG4gICAgY29uc3QgZGVmaW5pdGlvbiA9IGRlZmluaXRpb25zW25hbWVdO1xuXG4gICAgaWYgKCFwYXJhbVRlbXBsYXRlc1tkZWZpbml0aW9uLnR5cGVdKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBVbmtub3duIHBhcmFtIHR5cGUgXCIke2RlZmluaXRpb24udHlwZX1cImApO1xuXG4gICAgY29uc3Qge1xuICAgICAgZGVmaW5pdGlvblRlbXBsYXRlLFxuICAgICAgdHlwZUNoZWNrRnVuY3Rpb25cbiAgICB9ID0gcGFyYW1UZW1wbGF0ZXNbZGVmaW5pdGlvbi50eXBlXTtcblxuICAgIGxldCB2YWx1ZTtcblxuICAgIGlmICh2YWx1ZXMuaGFzT3duUHJvcGVydHkobmFtZSkgPT09IHRydWUpXG4gICAgICB2YWx1ZSA9IHZhbHVlc1tuYW1lXTtcbiAgICBlbHNlXG4gICAgICB2YWx1ZSA9IGRlZmluaXRpb24uZGVmYXVsdDtcblxuICAgIC8vIHN0b3JlIGluaXQgdmFsdWUgaW4gZGVmaW5pdGlvblxuICAgIGRlZmluaXRpb24uaW5pdFZhbHVlID0gdmFsdWU7XG5cbiAgICBpZiAoIXR5cGVDaGVja0Z1bmN0aW9uIHx8wqAhZGVmaW5pdGlvblRlbXBsYXRlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHBhcmFtIHR5cGUgZGVmaW5pdGlvbiBcIiR7ZGVmaW5pdGlvbi50eXBlfVwiYCk7XG5cbiAgICBwYXJhbXNbbmFtZV0gPSBuZXcgUGFyYW0obmFtZSwgZGVmaW5pdGlvblRlbXBsYXRlLCB0eXBlQ2hlY2tGdW5jdGlvbiwgZGVmaW5pdGlvbiwgdmFsdWUpO1xuICB9XG5cbiAgcmV0dXJuIG5ldyBQYXJhbWV0ZXJCYWcocGFyYW1zLCBkZWZpbml0aW9ucyk7XG59XG5cbi8qKlxuICogUmVnaXN0ZXIgYSBuZXcgdHlwZSBmb3IgdGhlIGBwYXJhbWV0ZXJzYCBmYWN0b3J5LlxuICogQHBhcmFtIHtTdHJpbmd9IHR5cGVOYW1lIC0gVmFsdWUgdGhhdCB3aWxsIGJlIGF2YWlsYWJsZSBhcyB0aGUgYHR5cGVgIG9mIGFcbiAqICBwYXJhbSBkZWZpbml0aW9uLlxuICogQHBhcmFtIHtwYXJhbWV0ZXJEZWZpbml0aW9ufSBwYXJhbWV0ZXJEZWZpbml0aW9uIC0gT2JqZWN0IGRlc2NyaWJpbmcgdGhlXG4gKiAgcGFyYW1ldGVyLlxuICovXG5wYXJhbWV0ZXJzLmRlZmluZVR5cGUgPSBmdW5jdGlvbih0eXBlTmFtZSwgcGFyYW1ldGVyRGVmaW5pdGlvbikge1xuICBwYXJhbVRlbXBsYXRlc1t0eXBlTmFtZV0gPSBwYXJhbWV0ZXJEZWZpbml0aW9uO1xufVxuXG5leHBvcnQgZGVmYXVsdCBwYXJhbWV0ZXJzO1xuIiwiaW1wb3J0IHBhcmFtZXRlcnMgZnJvbSAncGFyYW1ldGVycyc7XG5cbmxldCBpZCA9IDA7XG5cbi8qKlxuICogQmFzZSBgbGZvYCBjbGFzcyB0byBiZSBleHRlbmRlZCBpbiBvcmRlciB0byBjcmVhdGUgbmV3IG5vZGVzLlxuICpcbiAqIE5vZGVzIGFyZSBkaXZpZGVkIGluIDMgY2F0ZWdvcmllczpcbiAqIC0gKipgc291cmNlYCoqIGFyZSByZXNwb25zaWJsZSBmb3IgYWNxdWVyaW5nIGEgc2lnbmFsIGFuZCBpdHMgcHJvcGVydGllc1xuICogICAoZnJhbWVSYXRlLCBmcmFtZVNpemUsIGV0Yy4pXG4gKiAtICoqYHNpbmtgKiogYXJlIGVuZHBvaW50cyBvZiB0aGUgZ3JhcGgsIHN1Y2ggbm9kZXMgY2FuIGJlIHJlY29yZGVycyxcbiAqICAgdmlzdWFsaXplcnMsIGV0Yy5cbiAqIC0gKipgb3BlcmF0b3JgKiogYXJlIHVzZWQgdG8gbWFrZSBjb21wdXRhdGlvbiBvbiB0aGUgaW5wdXQgc2lnbmFsIGFuZFxuICogICBmb3J3YXJkIHRoZSByZXN1bHRzIGJlbG93IGluIHRoZSBncmFwaC5cbiAqXG4gKiBJbiBtb3N0IGNhc2VzIHRoZSBtZXRob2RzIHRvIG92ZXJyaWRlIC8gZXh0ZW5kIGFyZTpcbiAqIC0gdGhlICoqYGNvbnN0cnVjdG9yYCoqIHRvIGRlZmluZSB0aGUgcGFyYW1ldGVycyBvZiB0aGUgbmV3IGxmbyBub2RlLlxuICogLSB0aGUgKipgcHJvY2Vzc1N0cmVhbVBhcmFtc2AqKiBtZXRob2QgdG8gZGVmaW5lIGhvdyB0aGUgbm9kZSBtb2RpZnkgdGhlXG4gKiAgIHN0cmVhbSBhdHRyaWJ1dGVzIChlLmcuIGJ5IGNoYW5naW5nIHRoZSBmcmFtZSBzaXplKVxuICogLSB0aGUgKipgcHJvY2Vzc3tGcmFtZVR5cGV9YCoqIG1ldGhvZCB0byBkZWZpbmUgdGhlIG9wZXJhdGlvbnMgdGhhdCB0aGVcbiAqICAgbm9kZSBhcHBseSBvbiB0aGUgc3RyZWFtLiBUaGUgdHlwZSBvZiBpbnB1dCBhIG5vZGUgY2FuIGhhbmRsZSBpcyBkZWZpbmVcbiAqICAgYnkgaXRzIGltcGxlbWVudGVkIGludGVyZmFjZSwgaWYgaXQgaW1wbGVtZW50cyBgcHJvY2Vzc1NpZ25hbGAgYSBzdHJlYW1cbiAqICAgd2l0aCBgZnJhbWVUeXBlID09PSAnc2lnbmFsJ2AgY2FuIGJlIHByb2Nlc3NlZCwgYHByb2Nlc3NWZWN0b3JgIHRvIGhhbmRsZVxuICogICBhbiBpbnB1dCBvZiB0eXBlIGB2ZWN0b3JgLlxuICpcbiAqIDxzcGFuIGNsYXNzPVwid2FybmluZ1wiPl9UaGlzIGNsYXNzIHNob3VsZCBiZSBjb25zaWRlcmVkIGFic3RyYWN0IGFuZCBvbmx5XG4gKiBiZSB1c2VkIHRvIGJlIGV4dGVuZGVkLl88L3NwYW4+XG4gKlxuICpcbiAqIC8vIG92ZXJ2aWV3IG9mIHRoZSBiZWhhdmlvciBvZiBhIG5vZGVcbiAqXG4gKiAqKnByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcykqKlxuICpcbiAqIGBiYXNlYCBjbGFzcyAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbilcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc1N0cmVhbVBhcmFtc2BcbiAqIC0gY2FsbCBgcHJvcGFnYXRlU3RyZWFtUGFyYW1zYFxuICpcbiAqIGBjaGlsZGAgY2xhc3NcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc1N0cmVhbVBhcmFtc2BcbiAqIC0gb3ZlcnJpZGUgc29tZSBvZiB0aGUgaW5oZXJpdGVkIGBzdHJlYW1QYXJhbXNgXG4gKiAtIGNyZWF0ZXMgdGhlIGFueSByZWxhdGVkIGxvZ2ljIGJ1ZmZlcnNcbiAqIC0gY2FsbCBgcHJvcGFnYXRlU3RyZWFtUGFyYW1zYFxuICpcbiAqIF9zaG91bGQgbm90IGNhbGwgYHN1cGVyLnByb2Nlc3NTdHJlYW1QYXJhbXNgX1xuICpcbiAqICoqcHJlcGFyZVN0cmVhbVBhcmFtcygpKipcbiAqXG4gKiAtIGFzc2lnbiBwcmV2U3RyZWFtUGFyYW1zIHRvIHRoaXMuc3RyZWFtUGFyYW1zXG4gKiAtIGNoZWNrIGlmIHRoZSBjbGFzcyBpbXBsZW1lbnRzIHRoZSBjb3JyZWN0IGBwcm9jZXNzSW5wdXRgIG1ldGhvZFxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NTdHJlYW1QYXJhbXNgX1xuICpcbiAqICoqcHJvcGFnYXRlU3RyZWFtUGFyYW1zKCkqKlxuICpcbiAqIC0gY3JlYXRlcyB0aGUgYGZyYW1lRGF0YWAgYnVmZmVyXG4gKiAtIHByb3BhZ2F0ZSBgc3RyZWFtUGFyYW1zYCB0byBjaGlsZHJlblxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NTdHJlYW1QYXJhbXNgX1xuICpcbiAqICoqcHJvY2Vzc0ZyYW1lKCkqKlxuICpcbiAqIGBiYXNlYCBjbGFzcyAoZGVmYXVsdCBpbXBsZW1lbnRhdGlvbilcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc0ZyYW1lYFxuICogLSBhc3NpZ24gZnJhbWVUaW1lIGFuZCBmcmFtZU1ldGFkYXRhIHRvIGlkZW50aXR5XG4gKiAtIGNhbGwgdGhlIHByb3BlciBmdW5jdGlvbiBhY2NvcmRpbmcgdG8gaW5wdXRUeXBlXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZUZyYW1lYFxuICpcbiAqIGBjaGlsZGAgY2xhc3NcbiAqIC0gY2FsbCBgcHJlcHJvY2Vzc0ZyYW1lYFxuICogLSBkbyB3aGF0ZXZlciB5b3Ugd2FudCB3aXRoIGluY29tbWluZyBmcmFtZVxuICogLSBjYWxsIGBwcm9wYWdhdGVGcmFtZWBcbiAqXG4gKiBfc2hvdWxkIG5vdCBjYWxsIGBzdXBlci5wcm9jZXNzRnJhbWVgX1xuICpcbiAqICoqcHJlcGFyZUZyYW1lKCkqKlxuICpcbiAqIC0gaWYgYHJlaW5pdGAgYW5kIHRyaWdnZXIgYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGlmIG5lZWRlZFxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NGcmFtZWBfXG4gKlxuICogKipwcm9wYWdhdGVGcmFtZSgpKipcbiAqXG4gKiAtIHByb3BhZ2F0ZSBmcmFtZSB0byBjaGlsZHJlblxuICpcbiAqIF9zaG91bGRuJ3QgYmUgZXh0ZW5kZWQsIG9ubHkgY29uc3VtZWQgaW4gYHByb2Nlc3NGcmFtZWBfXG4gKlxuICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZVxuICovXG5jbGFzcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3IoZGVmaW5pdGlvbnMgPSB7fSwgb3B0aW9ucyA9IHt9KSB7XG4gICAgdGhpcy5jaWQgPSBpZCsrO1xuXG4gICAgLyoqXG4gICAgICogUGFyYW1ldGVyIGJhZyBjb250YWluaW5nIHBhcmFtZXRlciBpbnN0YW5jZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBuYW1lIHBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMucGFyYW1zID0gcGFyYW1ldGVycyhkZWZpbml0aW9ucywgb3B0aW9ucyk7XG4gICAgLy8gbGlzdGVuIGZvciBwYXJhbSB1cGRhdGVzXG4gICAgdGhpcy5wYXJhbXMuYWRkTGlzdGVuZXIodGhpcy5vblBhcmFtVXBkYXRlLmJpbmQodGhpcykpO1xuXG4gICAgLyoqXG4gICAgICogRGVzY3JpcHRpb24gb2YgdGhlIHN0cmVhbSBvdXRwdXQgb2YgdGhlIG5vZGUuXG4gICAgICogU2V0IHRvIGBudWxsYCB3aGVuIHRoZSBub2RlIGlzIGRlc3Ryb3llZC5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGZyYW1lU2l6ZSAtIEZyYW1lIHNpemUgYXQgdGhlIG91dHB1dCBvZiB0aGUgbm9kZS5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZnJhbWVSYXRlIC0gRnJhbWUgcmF0ZSBhdCB0aGUgb3V0cHV0IG9mIHRoZSBub2RlLlxuICAgICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBmcmFtZVR5cGUgLSBGcmFtZSB0eXBlIGF0IHRoZSBvdXRwdXQgb2YgdGhlIG5vZGUsXG4gICAgICogIHBvc3NpYmxlIHZhbHVlcyBhcmUgYHNpZ25hbGAsIGB2ZWN0b3JgIG9yIGBzY2FsYXJgLlxuICAgICAqIEBwcm9wZXJ0eSB7QXJyYXl8U3RyaW5nfSBkZXNjcmlwdGlvbiAtIElmIHR5cGUgaXMgYHZlY3RvcmAsIGRlc2NyaWJlXG4gICAgICogIHRoZSBkaW1lbnNpb24ocykgb2Ygb3V0cHV0IHN0cmVhbS5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc291cmNlU2FtcGxlUmF0ZSAtIFNhbXBsZSByYXRlIG9mIHRoZSBzb3VyY2Ugb2YgdGhlXG4gICAgICogIGdyYXBoLiBfVGhlIHZhbHVlIHNob3VsZCBiZSBkZWZpbmVkIGJ5IHNvdXJjZXMgYW5kIG5ldmVyIG1vZGlmaWVkXy5cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gc291cmNlU2FtcGxlQ291bnQgLSBOdW1iZXIgb2YgY29uc2VjdXRpdmUgZGlzY3JldGVcbiAgICAgKiAgdGltZSB2YWx1ZXMgY29udGFpbmVkIGluIHRoZSBkYXRhIGZyYW1lIG91dHB1dCBieSB0aGUgc291cmNlLlxuICAgICAqICBfVGhlIHZhbHVlIHNob3VsZCBiZSBkZWZpbmVkIGJ5IHNvdXJjZXMgYW5kIG5ldmVyIG1vZGlmaWVkXy5cbiAgICAgKlxuICAgICAqIEBuYW1lIHN0cmVhbVBhcmFtc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMuc3RyZWFtUGFyYW1zID0ge1xuICAgICAgZnJhbWVUeXBlOiBudWxsLFxuICAgICAgZnJhbWVTaXplOiAxLFxuICAgICAgZnJhbWVSYXRlOiAwLFxuICAgICAgZGVzY3JpcHRpb246IG51bGwsXG4gICAgICBzb3VyY2VTYW1wbGVSYXRlOiAwLFxuICAgICAgc291cmNlU2FtcGxlQ291bnQ6IG51bGwsXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIEN1cnJlbnQgZnJhbWUuIFRoaXMgb2JqZWN0IGFuZCBpdHMgZGF0YSBhcmUgdXBkYXRlZCBhdCBlYWNoIGluY29tbWluZ1xuICAgICAqIGZyYW1lIHdpdGhvdXQgcmVhbGxvY2F0aW5nIG1lbW9yeS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgZnJhbWVcbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gdGltZSAtIFRpbWUgb2YgdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAgICogQHByb3BlcnR5IHtGbG9hdDMyQXJyYXl9IGRhdGEgLSBEYXRhIG9mIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBtZXRhZGF0YSAtIE1ldGFkYXRhIGFzc29jaXRlZCB0byB0aGUgY3VycmVudCBmcmFtZS5cbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKi9cbiAgICB0aGlzLmZyYW1lID0ge1xuICAgICAgdGltZTogMCxcbiAgICAgIGRhdGE6IG51bGwsXG4gICAgICBtZXRhZGF0YToge30sXG4gICAgfTtcblxuICAgIC8qKlxuICAgICAqIExpc3Qgb2Ygbm9kZXMgY29ubmVjdGVkIHRvIHRoZSBvdXB1dCBvZiB0aGUgbm9kZSAobG93ZXIgaW4gdGhlIGdyYXBoKS5cbiAgICAgKiBBdCBlYWNoIGZyYW1lLCB0aGUgbm9kZSBmb3J3YXJkIGl0cyBgZnJhbWVgIHRvIHRvIGFsbCBpdHMgYG5leHRPcHNgLlxuICAgICAqXG4gICAgICogQHR5cGUge0FycmF5PEJhc2VMZm8+fVxuICAgICAqIEBuYW1lIG5leHRPcHNcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm9cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNjb25uZWN0fVxuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAgICovXG4gICAgdGhpcy5uZXh0T3BzID0gW107XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbm9kZSBmcm9tIHdoaWNoIHRoZSBub2RlIHJlY2VpdmUgdGhlIGZyYW1lcyAodXBwZXIgaW4gdGhlIGdyYXBoKS5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtCYXNlTGZvfVxuICAgICAqIEBuYW1lIHByZXZPcFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Nvbm5lY3R9XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZGlzY29ubmVjdH1cbiAgICAgKi9cbiAgICB0aGlzLnByZXZPcCA9IG51bGw7XG5cbiAgICAvKipcbiAgICAgKiBJcyBzZXQgdG8gdHJ1ZSB3aGVuIGEgc3RhdGljIHBhcmFtZXRlciBpcyB1cGRhdGVkLiBPbiB0aGUgbmV4dCBpbnB1dFxuICAgICAqIGZyYW1lIGFsbCB0aGUgc3ViZ3JhcGggc3RyZWFtUGFyYW1zIHN0YXJ0aW5nIGZyb20gdGhpcyBub2RlIHdpbGwgYmVcbiAgICAgKiB1cGRhdGVkLlxuICAgICAqXG4gICAgICogQHR5cGUge0Jvb2xlYW59XG4gICAgICogQG5hbWUgX3JlaW5pdFxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fcmVpbml0ID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJucyBhbiBvYmplY3QgZGVzY3JpYmluZyBlYWNoIGF2YWlsYWJsZSBwYXJhbWV0ZXIgb2YgdGhlIG5vZGUuXG4gICAqXG4gICAqIEByZXR1cm4ge09iamVjdH1cbiAgICovXG4gIGdldFBhcmFtc0Rlc2NyaXB0aW9uKCkge1xuICAgIHJldHVybiB0aGlzLnBhcmFtcy5nZXREZWZpbml0aW9ucygpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0IGFsbCBwYXJhbWV0ZXJzIHRvIHRoZWlyIGluaXRpYWwgdmFsdWUgKGFzIGRlZmluZWQgb24gaW5zdGFudGljYXRpb24pXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3N0cmVhbVBhcmFtc31cbiAgICovXG4gIHJlc2V0UGFyYW1zKCkge1xuICAgIHRoaXMucGFyYW1zLnJlc2V0KCk7XG4gIH1cblxuICAvKipcbiAgICogRnVuY3Rpb24gY2FsbGVkIHdoZW4gYSBwYXJhbSBpcyB1cGRhdGVkLiBCeSBkZWZhdWx0IHNldCB0aGUgYF9yZWluaXRgXG4gICAqIGZsYWcgdG8gYHRydWVgIGlmIHRoZSBwYXJhbSBpcyBgc3RhdGljYCBvbmUuIFRoaXMgbWV0aG9kIHNob3VsZCBiZVxuICAgKiBleHRlbmRlZCB0byBoYW5kbGUgcGFydGljdWxhciBsb2dpYyBib3VuZCB0byBhIHNwZWNpZmljIHBhcmFtZXRlci5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtPYmplY3R9IG1ldGFzIC0gTWV0YWRhdGEgYXNzb2NpYXRlZCB0byB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMgPSB7fSkge1xuICAgIGlmIChtZXRhcy5raW5kID09PSAnc3RhdGljJylcbiAgICAgIHRoaXMuX3JlaW5pdCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogQ29ubmVjdCB0aGUgY3VycmVudCBub2RlIChgcHJldk9wYCkgdG8gYW5vdGhlciBub2RlIChgbmV4dE9wYCkuXG4gICAqIEEgZ2l2ZW4gbm9kZSBjYW4gYmUgY29ubmVjdGVkIHRvIHNldmVyYWwgb3BlcmF0b3JzIGFuZCBwcm9wYWdhdGUgdGhlXG4gICAqIHN0cmVhbSB0byBlYWNoIG9mIHRoZW0uXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gbmV4dCAtIE5leHQgb3BlcmF0b3IgaW4gdGhlIGdyYXBoLlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Rpc2Nvbm5lY3R9XG4gICAqL1xuICBjb25uZWN0KG5leHQpIHtcbiAgICBpZiAoIShuZXh0IGluc3RhbmNlb2YgQmFzZUxmbykpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0ludmFsaWQgY29ubmVjdGlvbjogY2hpbGQgbm9kZSBpcyBub3QgYW4gaW5zdGFuY2Ugb2YgYEJhc2VMZm9gJyk7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMgPT09IG51bGwgfHxuZXh0LnN0cmVhbVBhcmFtcyA9PT0gbnVsbClcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25uZWN0aW9uOiBjYW5ub3QgY29ubmVjdCBhIGRlYWQgbm9kZScpO1xuXG4gICAgdGhpcy5uZXh0T3BzLnB1c2gobmV4dCk7XG4gICAgbmV4dC5wcmV2T3AgPSB0aGlzO1xuXG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSAhPT0gbnVsbCkgLy8gZ3JhcGggaGFzIGFscmVhZHkgYmVlbiBzdGFydGVkXG4gICAgICBuZXh0LnByb2Nlc3NTdHJlYW1QYXJhbXModGhpcy5zdHJlYW1QYXJhbXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlbW92ZSB0aGUgZ2l2ZW4gb3BlcmF0b3IgZnJvbSBpdHMgcHJldmlvdXMgb3BlcmF0b3JzJyBgbmV4dE9wc2AuXG4gICAqXG4gICAqIEBwYXJhbSB7QmFzZUxmb30gW25leHQ9bnVsbF0gLSBUaGUgb3BlcmF0b3IgdG8gZGlzY29ubmVjdCBmcm9tIHRoZSBjdXJyZW50XG4gICAqICBvcGVyYXRvci4gSWYgYG51bGxgIGRpc2Nvbm5lY3QgYWxsIHRoZSBuZXh0IG9wZXJhdG9ycy5cbiAgICovXG4gIGRpc2Nvbm5lY3QobmV4dCA9IG51bGwpIHtcbiAgICBpZiAobmV4dCA9PT0gbnVsbCkge1xuICAgICAgdGhpcy5uZXh0T3BzLmZvckVhY2goKG5leHQpID0+IHRoaXMuZGlzY29ubmVjdChuZXh0KSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGNvbnN0IGluZGV4ID0gdGhpcy5uZXh0T3BzLmluZGV4T2YodGhpcyk7XG4gICAgICB0aGlzLm5leHRPcHMuc3BsaWNlKGluZGV4LCAxKTtcbiAgICAgIG5leHQucHJldk9wID0gbnVsbDtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRGVzdHJveSBhbGwgdGhlIG5vZGVzIGluIHRoZSBzdWItZ3JhcGggc3RhcnRpbmcgZnJvbSB0aGUgY3VycmVudCBub2RlLlxuICAgKiBXaGVuIGRldHJveWVkLCB0aGUgYHN0cmVhbVBhcmFtc2Agb2YgdGhlIG5vZGUgYXJlIHNldCB0byBgbnVsbGAsIHRoZVxuICAgKiBvcGVyYXRvciBpcyB0aGVuIGNvbnNpZGVyZWQgYXMgYGRlYWRgIGFuZCBjYW5ub3QgYmUgcmVjb25uZWN0ZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Nvbm5lY3R9XG4gICAqL1xuICBkZXN0cm95KCkge1xuICAgIC8vIGRlc3Ryb3kgYWxsIGNoaWRyZW5cbiAgICBsZXQgaW5kZXggPSB0aGlzLm5leHRPcHMubGVuZ3RoO1xuXG4gICAgd2hpbGUgKGluZGV4LS0pXG4gICAgICB0aGlzLm5leHRPcHNbaW5kZXhdLmRlc3Ryb3koKTtcblxuICAgIC8vIGRpc2Nvbm5lY3QgaXRzZWxmIGZyb20gdGhlIHByZXZpb3VzIG9wZXJhdG9yXG4gICAgaWYgKHRoaXMucHJldk9wKVxuICAgICAgdGhpcy5wcmV2T3AuZGlzY29ubmVjdCh0aGlzKTtcblxuICAgIC8vIG1hcmsgdGhlIG9iamVjdCBhcyBkZWFkXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSBudWxsO1xuICB9XG5cbiAgLyoqXG4gICAqIEhlbHBlciB0byBpbml0aWFsaXplIHRoZSBzdHJlYW0gaW4gc3RhbmRhbG9uZSBtb2RlLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gW3N0cmVhbVBhcmFtcz17fV0gLSBTdHJlYW0gcGFyYW1ldGVycyB0byBiZSB1c2VkLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNyZXNldFN0cmVhbX1cbiAgICovXG4gIGluaXRTdHJlYW0oc3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByb2Nlc3NTdHJlYW1QYXJhbXMoc3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnJlc2V0U3RyZWFtKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgdGhlIGBmcmFtZS5kYXRhYCBidWZmZXIgYnkgc2V0dGluZyBhbGwgaXRzIHZhbHVlcyB0byAwLlxuICAgKiBBIHNvdXJjZSBvcGVyYXRvciBzaG91bGQgY2FsbCBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgYW5kIGByZXNldFN0cmVhbWAgd2hlblxuICAgKiBzdGFydGVkLCBlYWNoIG9mIHRoZXNlIG1ldGhvZCBwcm9wYWdhdGUgdGhyb3VnaCB0aGUgZ3JhcGggYXV0b21hdGljYWx5LlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcmVzZXRTdHJlYW0oKSB7XG4gICAgLy8gYnV0dG9tIHVwXG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRPcHMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0T3BzW2ldLnJlc2V0U3RyZWFtKCk7XG5cbiAgICAvLyBubyBidWZmZXIgZm9yIGBzY2FsYXJgIHR5cGUgb3Igc2luayBub2RlXG4gICAgaWYgKHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lVHlwZSAhPT0gJ3NjYWxhcicgJiYgdGhpcy5mcmFtZS5kYXRhICE9PSBudWxsKVxuICAgICAgdGhpcy5mcmFtZS5kYXRhLmZpbGwoMCk7XG4gIH1cblxuICAvKipcbiAgICogRmluYWxpemUgdGhlIHN0cmVhbS4gQSBzb3VyY2Ugbm9kZSBzaG91bGQgY2FsbCB0aGlzIG1ldGhvZCB3aGVuIHN0b3BwZWQsXG4gICAqIGBmaW5hbGl6ZVN0cmVhbWAgaXMgYXV0b21hdGljYWxseSBwcm9wYWdhdGVkIHRocm91Z2h0IHRoZSBncmFwaC5cbiAgICpcbiAgICogQHBhcmFtIHtOdW1iZXJ9IGVuZFRpbWUgLSBMb2dpY2FsIHRpbWUgYXQgd2hpY2ggdGhlIGdyYXBoIGlzIHN0b3BwZWQuXG4gICAqL1xuICBmaW5hbGl6ZVN0cmVhbShlbmRUaW1lKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRPcHMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0T3BzW2ldLmZpbmFsaXplU3RyZWFtKGVuZFRpbWUpO1xuICB9XG5cbiAgLyoqXG4gICAqIEluaXRpYWxpemUgb3IgdXBkYXRlIHRoZSBvcGVyYXRvcidzIGBzdHJlYW1QYXJhbXNgIGFjY29yZGluZyB0byB0aGVcbiAgICogcHJldmlvdXMgb3BlcmF0b3JzIGBzdHJlYW1QYXJhbXNgIHZhbHVlcy5cbiAgICpcbiAgICogV2hlbiBpbXBsZW1lbnRpbmcgYSBuZXcgb3BlcmF0b3IgdGhpcyBtZXRob2Qgc2hvdWxkOlxuICAgKiAxLiBjYWxsIGB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXNgIHdpdGggdGhlIGdpdmVuIGBwcmV2U3RyZWFtUGFyYW1zYFxuICAgKiAyLiBvcHRpb25uYWxseSBjaGFuZ2UgdmFsdWVzIHRvIGB0aGlzLnN0cmVhbVBhcmFtc2AgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiAgICBsb2dpYyBwZXJmb3JtZWQgYnkgdGhlIG9wZXJhdG9yLlxuICAgKiAzLiBvcHRpb25uYWxseSBhbGxvY2F0ZSBtZW1vcnkgZm9yIHJpbmcgYnVmZmVycywgZXRjLlxuICAgKiA0LiBjYWxsIGB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtc2AgdG8gdHJpZ2dlciB0aGUgbWV0aG9kIG9uIHRoZSBuZXh0XG4gICAqICAgIG9wZXJhdG9ycyBpbiB0aGUgZ3JhcGguXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBwcmV2U3RyZWFtUGFyYW1zIC0gYHN0cmVhbVBhcmFtc2Agb2YgdGhlIHByZXZpb3VzIG9wZXJhdG9yLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9wYWdhdGVTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqXG4gICAqIENvbW1vbiBsb2dpYyB0byBkbyBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBgcHJvY2Vzc1N0cmVhbVBhcmFtYCwgbXVzdCBiZVxuICAgKiBjYWxsZWQgYXQgdGhlIGJlZ2lubmluZyBvZiBhbnkgYHByb2Nlc3NTdHJlYW1QYXJhbWAgaW1wbGVtZW50YXRpb24uXG4gICAqXG4gICAqIFRoZSBtZXRob2QgbWFpbmx5IGNoZWNrIGlmIHRoZSBjdXJyZW50IG5vZGUgaW1wbGVtZW50IHRoZSBpbnRlcmZhY2UgdG9cbiAgICogaGFuZGxlIHRoZSB0eXBlIG9mIGZyYW1lIHByb3BhZ2F0ZWQgYnkgaXQncyBwYXJlbnQ6XG4gICAqIC0gdG8gaGFuZGxlIGEgYHZlY3RvcmAgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIG11c3QgaW1wbGVtZW50IGBwcm9jZXNzVmVjdG9yYFxuICAgKiAtIHRvIGhhbmRsZSBhIGBzaWduYWxgIGZyYW1lIHR5cGUsIHRoZSBjbGFzcyBtdXN0IGltcGxlbWVudCBgcHJvY2Vzc1NpZ25hbGBcbiAgICogLSBpbiBjYXNlIG9mIGEgJ3NjYWxhcicgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIGNhbiBpbXBsZW1lbnQgYW55IG9mIHRoZVxuICAgKiBmb2xsb3dpbmcgYnkgb3JkZXIgb2YgcHJlZmVyZW5jZTogYHByb2Nlc3NTY2FsYXJgLCBgcHJvY2Vzc1ZlY3RvcmAsXG4gICAqIGBwcm9jZXNzU2lnbmFsYC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXZTdHJlYW1QYXJhbXMgLSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgcHJldmlvdXMgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb3BhZ2F0ZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgT2JqZWN0LmFzc2lnbih0aGlzLnN0cmVhbVBhcmFtcywgcHJldlN0cmVhbVBhcmFtcyk7XG4gICAgY29uc3QgcHJldkZyYW1lVHlwZSA9IHByZXZTdHJlYW1QYXJhbXMuZnJhbWVUeXBlO1xuXG4gICAgc3dpdGNoIChwcmV2RnJhbWVUeXBlKSB7XG4gICAgICBjYXNlICdzY2FsYXInOlxuICAgICAgICBpZiAodGhpcy5wcm9jZXNzU2NhbGFyKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzU2NhbGFyO1xuICAgICAgICBlbHNlIGlmICh0aGlzLnByb2Nlc3NWZWN0b3IpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NWZWN0b3I7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucHJvY2Vzc1NpZ25hbClcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1NpZ25hbDtcbiAgICAgICAgZWxzZVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IC0gbm8gXCJwcm9jZXNzXCIgZnVuY3Rpb24gZm91bmRgKTtcbiAgICAgICAgYnJlYWs7XG4gICAgICBjYXNlICd2ZWN0b3InOlxuICAgICAgICBpZiAoISgncHJvY2Vzc1ZlY3RvcicgaW4gdGhpcykpXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gLSBcInByb2Nlc3NWZWN0b3JcIiBpcyBub3QgZGVmaW5lZGApO1xuXG4gICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzVmVjdG9yO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3NpZ25hbCc6XG4gICAgICAgIGlmICghKCdwcm9jZXNzU2lnbmFsJyBpbiB0aGlzKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAtIFwicHJvY2Vzc1NpZ25hbFwiIGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NTaWduYWw7XG4gICAgICAgIGJyZWFrO1xuICAgICAgZGVmYXVsdDpcbiAgICAgICAgLy8gZGVmYXVsdHMgdG8gcHJvY2Vzc0Z1bmN0aW9uXG4gICAgICAgIGJyZWFrO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBDcmVhdGUgdGhlIGB0aGlzLmZyYW1lLmRhdGFgIGJ1ZmZlciBhbmQgZm9yd2FyZCB0aGUgb3BlcmF0b3IncyBgc3RyZWFtUGFyYW1gXG4gICAqIHRvIGFsbCBpdHMgbmV4dCBvcGVyYXRvcnMsIG11c3QgYmUgY2FsbGVkIGF0IHRoZSBlbmQgb2YgYW55XG4gICAqIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJlcGFyZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpIHtcbiAgICB0aGlzLmZyYW1lLmRhdGEgPSBuZXcgRmxvYXQzMkFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG5cbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE9wcy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLm5leHRPcHNbaV0ucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogRGVmaW5lIHRoZSBwYXJ0aWN1bGFyIGxvZ2ljIHRoZSBvcGVyYXRvciBhcHBsaWVzIHRvIHRoZSBzdHJlYW0uXG4gICAqIEFjY29yZGluZyB0byB0aGUgZnJhbWUgdHlwZSBvZiB0aGUgcHJldmlvdXMgbm9kZSwgdGhlIG1ldGhvZCBjYWxscyBvbmVcbiAgICogb2YgdGhlIGZvbGxvd2luZyBtZXRob2QgYHByb2Nlc3NWZWN0b3JgLCBgcHJvY2Vzc1NpZ25hbGAgb3IgYHByb2Nlc3NTY2FsYXJgXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBmcmFtZSAtIEZyYW1lICh0aW1lLCBkYXRhLCBhbmQgbWV0YWRhdGEpIGFzIGdpdmVuIGJ5IHRoZVxuICAgKiAgcHJldmlvdXMgb3BlcmF0b3IuIFRoZSBpbmNvbW1pbmcgZnJhbWUgc2hvdWxkIG5ldmVyIGJlIG1vZGlmaWVkIGJ5XG4gICAqICB0aGUgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvcGFnYXRlRnJhbWV9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZSgpO1xuXG4gICAgLy8gZnJhbWVUaW1lIGFuZCBmcmFtZU1ldGFkYXRhIGRlZmF1bHRzIHRvIGlkZW50aXR5XG4gICAgdGhpcy5mcmFtZS50aW1lID0gZnJhbWUudGltZTtcbiAgICB0aGlzLmZyYW1lLm1ldGFkYXRhID0gZnJhbWUubWV0YWRhdGE7XG5cbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFBvaW50ZXIgdG8gdGhlIG1ldGhvZCBjYWxsZWQgaW4gYHByb2Nlc3NGcmFtZWAgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiBmcmFtZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBvcGVyYXRvci4gSXMgZHluYW1pY2FsbHkgYXNzaWduZWQgaW5cbiAgICogYHByZXBhcmVTdHJlYW1QYXJhbXNgLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzRnJhbWV9XG4gICAqL1xuICBwcm9jZXNzRnVuY3Rpb24oZnJhbWUpIHtcbiAgICB0aGlzLmZyYW1lID0gZnJhbWU7XG4gIH1cblxuICAvKipcbiAgICogQ29tbW9uIGxvZ2ljIHRvIHBlcmZvcm0gYXQgdGhlIGJlZ2lubmluZyBvZiB0aGUgYHByb2Nlc3NGcmFtZWAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByZXBhcmVGcmFtZSgpIHtcbiAgICBpZiAodGhpcy5fcmVpbml0ID09PSB0cnVlKSB7XG4gICAgICBjb25zdCBzdHJlYW1QYXJhbXMgPSB0aGlzLnByZXZPcCAhPT0gbnVsbCA/IHRoaXMucHJldk9wLnN0cmVhbVBhcmFtcyA6IHt9O1xuICAgICAgdGhpcy5pbml0U3RyZWFtKHN0cmVhbVBhcmFtcyk7XG4gICAgICB0aGlzLl9yZWluaXQgPSBmYWxzZTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogRm9yd2FyZCB0aGUgY3VycmVudCBgZnJhbWVgIHRvIHRoZSBuZXh0IG9wZXJhdG9ycywgaXMgY2FsbGVkIGF0IHRoZSBlbmQgb2ZcbiAgICogYHByb2Nlc3NGcmFtZWAuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByb3BhZ2F0ZUZyYW1lKCkge1xuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5uZXh0T3BzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMubmV4dE9wc1tpXS5wcm9jZXNzRnJhbWUodGhpcy5mcmFtZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgQmFzZUxmbztcblxuIiwiaW1wb3J0ICogYXMgZ21tVXRpbHMgZnJvbSAnLi4vdXRpbHMvZ21tLXV0aWxzJztcblxuLyoqXG4gKiBHTU0gZGVjb2RlciA8YnIgLz5cbiAqIExvYWRzIGEgbW9kZWwgdHJhaW5lZCBieSB0aGUgWE1NIGxpYnJhcnkgYW5kIHByb2Nlc3NlcyBhbiBpbnB1dCBzdHJlYW0gb2YgZmxvYXQgdmVjdG9ycyBpbiByZWFsLXRpbWUuXG4gKiBJZiB0aGUgbW9kZWwgd2FzIHRyYWluZWQgZm9yIHJlZ3Jlc3Npb24sIG91dHB1dHMgYW4gZXN0aW1hdGlvbiBvZiB0aGUgYXNzb2NpYXRlZCBwcm9jZXNzLlxuICogQGNsYXNzXG4gKi9cblxuY2xhc3MgR21tRGVjb2RlciB7XG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBbd2luZG93U2l6ZT0xXSAtIFNpemUgb2YgdGhlIGxpa2VsaWhvb2Qgc21vb3RoaW5nIHdpbmRvdy5cbiAgICovXG4gIGNvbnN0cnVjdG9yKHdpbmRvd1NpemUgPSAxKSB7XG5cbiAgICAvKipcbiAgICAgKiBUaGUgbW9kZWwsIGFzIGdlbmVyYXRlZCBieSBYTU0gZnJvbSBhIHRyYWluaW5nIGRhdGEgc2V0LlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9tb2RlbCA9IHVuZGVmaW5lZDtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtb2RlbCByZXN1bHRzLCBjb250YWluaW5nIGludGVybWVkaWF0ZSByZXN1bHRzIHRoYXQgd2lsbCBiZSBwYXNzZWQgdG8gdGhlIGNhbGxiYWNrIGluIGZpbHRlci5cbiAgICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fbW9kZWxSZXN1bHRzID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogU2l6ZSBvZiB0aGUgbGlrZWxpaG9vZCBzbW9vdGhpbmcgd2luZG93LlxuICAgICAqIEB0eXBlIHtOdW1iZXJ9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9saWtlbGlob29kV2luZG93ID0gd2luZG93U2l6ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDYWxsYmFjayBoYW5kbGluZyBlc3RpbWF0aW9uIHJlc3VsdHMuXG4gICAqIEBjYWxsYmFjayBHbW1SZXN1bHRzQ2FsbGJhY2tcbiAgICogQHBhcmFtIHtTdHJpbmd9IGVyciAtIERlc2NyaXB0aW9uIG9mIGEgcG90ZW50aWFsIGVycm9yLlxuICAgKiBAcGFyYW0ge0dtbVJlc3VsdHN9IHJlcyAtIE9iamVjdCBob2xkaW5nIHRoZSBlc3RpbWF0aW9uIHJlc3VsdHMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZXN1bHRzIG9mIHRoZSBmaWx0ZXJpbmcgcHJvY2Vzcy5cbiAgICogQHR5cGVkZWYgR21tUmVzdWx0c1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gbGlrZWxpZXN0IC0gVGhlIGxpa2VsaWVzdCBtb2RlbCdzIGxhYmVsLlxuICAgKiBAcHJvcGVydHkge051bWJlcn0gbGlrZWxpZXN0SW5kZXggLSBUaGUgbGlrZWxpZXN0IG1vZGVsJ3MgaW5kZXhcbiAgICogQHByb3BlcnR5IHtBcnJheS5udW1iZXJ9IGxpa2VsaWhvb2RzIC0gVGhlIGFycmF5IG9mIGFsbCBtb2RlbHMnIHNtb290aGVkIG5vcm1hbGl6ZWQgbGlrZWxpaG9vZHMuXG4gICAqIEBwcm9wZXJ0eSB7P0FycmF5Lm51bWJlcn0gb3V0cHV0VmFsdWVzIC0gSWYgdGhlIG1vZGVsIHdhcyB0cmFpbmVkIHdpdGggcmVncmVzc2lvbiwgdGhlIGVzdGltYXRlZCBmbG9hdCB2ZWN0b3Igb3V0cHV0LlxuICAgKiBAcHJvcGVydHkgez9BcnJheS5udW1iZXJ9IG91dHB1dENvdmFyaWFuY2UgLSBJZiB0aGUgbW9kZWwgd2FzIHRyYWluZWQgd2l0aCByZWdyZXNzaW9uLCB0aGUgb3V0cHV0IGNvdmFyaWFuY2UgbWF0cml4LlxuICAgKi9cblxuICAvKipcbiAgICogVGhlIGRlY29kaW5nIGZ1bmN0aW9uLlxuICAgKiBAcGFyYW0ge0FycmF5fSBvYnNlcnZhdGlvbiAtIEFuIGlucHV0IGZsb2F0IHZlY3RvciB0byBiZSBlc3RpbWF0ZWQuXG4gICAqIEBwYXJhbSB7R21tUmVzdWx0c0NhbGxiYWNrfSBbcmVzdWx0c0NhbGxiYWNrPW51bGxdIC0gVGhlIGNhbGxiYWNrIGhhbmRsaW5nIHRoZSBlc3RpbWF0aW9uIHJlc3VsdHMuXG4gICAqIEByZXR1cm5zIHtHbW1SZXN1bHRzfSByZXN1bHRzIC0gVGhlIGVzdGltYXRpb24gcmVzdWx0cy5cbiAgICovXG4gIGZpbHRlcihvYnNlcnZhdGlvbiwgcmVzdWx0c0NhbGxiYWNrID0gbnVsbCkge1xuICAgIGxldCBlcnIgPSBudWxsO1xuICAgIGxldCByZXMgPSBudWxsO1xuXG4gICAgaWYoIXRoaXMuX21vZGVsKSB7XG4gICAgICBjb25zb2xlLmxvZyhcIm5vIG1vZGVsIGxvYWRlZFwiKTtcbiAgICAgIHJldHVybjtcbiAgICB9IGVsc2Uge1xuICAgICAgdHJ5IHtcbiAgICAgICAgZ21tVXRpbHMuZ21tRmlsdGVyKG9ic2VydmF0aW9uLCB0aGlzLl9tb2RlbCwgdGhpcy5fbW9kZWxSZXN1bHRzKTsgICAgICAgICBcblxuICAgICAgICBjb25zdCBsaWtlbGllc3QgPSAodGhpcy5fbW9kZWxSZXN1bHRzLmxpa2VsaWVzdCA+IC0xKVxuICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLl9tb2RlbC5tb2RlbHNbdGhpcy5fbW9kZWxSZXN1bHRzLmxpa2VsaWVzdF0ubGFiZWxcbiAgICAgICAgICAgICAgICAgICAgICAgIDogJ3Vua25vd24nO1xuICAgICAgICBjb25zdCBsaWtlbGlob29kcyA9IHRoaXMuX21vZGVsUmVzdWx0cy5zbW9vdGhlZF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzLnNsaWNlKDApO1xuICAgICAgICByZXMgPSB7XG4gICAgICAgICAgbGlrZWxpZXN0OiBsaWtlbGllc3QsXG4gICAgICAgICAgbGlrZWxpZXN0SW5kZXg6IHRoaXMuX21vZGVsUmVzdWx0cy5saWtlbGllc3QsXG4gICAgICAgICAgbGlrZWxpaG9vZHM6IGxpa2VsaWhvb2RzXG4gICAgICAgIH1cblxuICAgICAgICAvLyBhZGQgcmVncmVzc2lvbiByZXN1bHRzIHRvIGdsb2JhbCByZXN1bHRzIGlmIGJpbW9kYWwgOlxuICAgICAgICBpZih0aGlzLl9tb2RlbC5zaGFyZWRfcGFyYW1ldGVycy5iaW1vZGFsKSB7XG4gICAgICAgICAgcmVzWydvdXRwdXRWYWx1ZXMnXSA9IHRoaXMuX21vZGVsUmVzdWx0cy5vdXRwdXRfdmFsdWVzLnNsaWNlKDApO1xuICAgICAgICAgIHJlc1snb3V0cHV0Q292YXJpYW5jZSddXG4gICAgICAgICAgICAgID0gdGhpcy5tb2RlbFJlc3VsdHMub3V0cHV0X2NvdmFyaWFuY2Uuc2xpY2UoMCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyID0gJ3Byb2JsZW0gb2NjdXJlZCBkdXJpbmcgZmlsdGVyaW5nIDogJyArIGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdHNDYWxsYmFjaykge1xuICAgICAgcmVzdWx0c0NhbGxiYWNrKGVyciwgcmVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09IEdFVFRFUlMgLyBTRVRURVJTID09PT09PT09PT09PT09PT09PT09PT09PT09PT0vL1xuXG4gIC8qKlxuICAgKiBMaWtlbGlob29kIHNtb290aGluZyB3aW5kb3cgc2l6ZS5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBsaWtlbGlob29kV2luZG93KCkge1xuICAgIHJldHVybiB0aGlzLl9saWtlbGlob29kV2luZG93O1xuICB9XG5cbiAgc2V0IGxpa2VsaWhvb2RXaW5kb3cobmV3V2luZG93U2l6ZSkge1xuICAgIHRoaXMuX2xpa2VsaWhvb2RXaW5kb3cgPSBuZXdXaW5kb3dTaXplO1xuICAgIGlmICh0aGlzLl9tb2RlbCA9PT0gdW5kZWZpbmVkKSByZXR1cm47XG5cbiAgICBjb25zdCByZXMgPSB0aGlzLl9tb2RlbFJlc3VsdHMuc2luZ2xlQ2xhc3NNb2RlbFJlc3VsdHM7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21vZGVsLm1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgcmVzW2ldLmxpa2VsaWhvb2RfYnVmZmVyID0gbmV3IEFycmF5KHRoaXMuX2xpa2VsaWhvb2RXaW5kb3cpO1xuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2xpa2VsaWhvb2RXaW5kb3c7IGorKykge1xuICAgICAgICByZXMubGlrZWxpaG9vZF9idWZmZXJbal0gPSAxIC8gdGhpcy5fbGlrZWxpaG9vZFdpbmRvdztcbiAgICAgIH1cbiAgICB9ICAgIFxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtb2RlbCBnZW5lcmF0ZWQgYnkgWE1NLlxuICAgKiBJdCBpcyBtYW5kYXRvcnkgZm9yIHRoZSBjbGFzcyB0byBoYXZlIGEgbW9kZWwgaW4gb3JkZXIgdG8gZG8gaXRzIGpvYi5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGdldCBtb2RlbCgpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIEpTT04uZnJvbVN0cmluZyhKU09OLnN0cmluZ2lmeSh0aGlzLl9tb2RlbCkpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0IG1vZGVsKG1vZGVsKSB7XG4gICAgdGhpcy5fc2V0TW9kZWwobW9kZWwpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9zZXRNb2RlbChtb2RlbCkge1xuICAgIHRoaXMuX21vZGVsID0gdW5kZWZpbmVkO1xuICAgIHRoaXMuX21vZGVsUmVzdWx0cyA9IHVuZGVmaW5lZDtcblxuICAgIC8vIHRlc3QgaWYgbW9kZWwgaXMgdmFsaWQgaGVyZSAoVE9ETyA6IHdyaXRlIGEgYmV0dGVyIHRlc3QpXG4gICAgaWYgKG1vZGVsLm1vZGVscyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9tb2RlbCA9IG1vZGVsO1xuICAgICAgY29uc3QgbSA9IHRoaXMuX21vZGVsO1xuICAgICAgY29uc3Qgbm1vZGVscyA9IG0ubW9kZWxzLmxlbmd0aDtcblxuICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzID0ge1xuICAgICAgICBpbnN0YW50X2xpa2VsaWhvb2RzOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIHNtb290aGVkX2xvZ19saWtlbGlob29kczogbmV3IEFycmF5KG5tb2RlbHMpLFxuICAgICAgICBzbW9vdGhlZF9saWtlbGlob29kczogbmV3IEFycmF5KG5tb2RlbHMpLFxuICAgICAgICBpbnN0YW50X25vcm1hbGl6ZWRfbGlrZWxpaG9vZHM6IG5ldyBBcnJheShubW9kZWxzKSxcbiAgICAgICAgc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kczogbmV3IEFycmF5KG5tb2RlbHMpLFxuICAgICAgICBsaWtlbGllc3Q6IC0xLFxuICAgICAgICBzaW5nbGVDbGFzc0dtbU1vZGVsUmVzdWx0czogW11cbiAgICAgIH07XG5cbiAgICAgIC8vIHRoZSBmb2xsb3dpbmcgdmFyaWFibGVzIGFyZSB1c2VkIGZvciByZWdyZXNzaW9uIDpcbiAgICAgIGNvbnN0IHBhcmFtcyA9IG0uc2hhcmVkX3BhcmFtZXRlcnM7XG4gICAgICBjb25zdCBkaW1PdXQgPSBwYXJhbXMuZGltZW5zaW9uIC0gcGFyYW1zLmRpbWVuc2lvbl9pbnB1dDtcbiAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5vdXRwdXRfdmFsdWVzID0gbmV3IEFycmF5KGRpbU91dCk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGltT3V0OyBpKyspIHtcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF92YWx1ZXNbaV0gPSAwLjA7XG4gICAgICB9XG5cbiAgICAgIGxldCBvdXRDb3ZhclNpemU7XG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICAgICAgaWYgKG0uY29uZmlndXJhdGlvbi5kZWZhdWx0X3BhcmFtZXRlcnMuY292YXJpYW5jZV9tb2RlID09IDApIHtcbiAgICAgICAgb3V0Q292YXJTaXplID0gZGltT3V0ICogZGltT3V0O1xuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dENvdmFyU2l6ZSA9IGRpbU91dDtcbiAgICAgIH1cbiAgICAgIFxuICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF9jb3ZhcmlhbmNlID0gbmV3IEFycmF5KG91dENvdmFyU2l6ZSk7XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGltT3V0OyBpKyspIHtcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF9jb3ZhcmlhbmNlW2ldID0gMC4wO1xuICAgICAgfVxuXG5cbiAgICAgIGZvcihsZXQgaSA9IDA7IGkgPCBubW9kZWxzOyBpKyspIHtcblxuICAgICAgICB0aGlzLl9tb2RlbFJlc3VsdHMuaW5zdGFudF9saWtlbGlob29kc1tpXSA9IDA7XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5zbW9vdGhlZF9sb2dfbGlrZWxpaG9vZHNbaV0gPSAwO1xuICAgICAgICB0aGlzLl9tb2RlbFJlc3VsdHMuc21vb3RoZWRfbGlrZWxpaG9vZHNbaV0gPSAwO1xuICAgICAgICB0aGlzLl9tb2RlbFJlc3VsdHMuaW5zdGFudF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzW2ldID0gMDtcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gPSAwO1xuXG4gICAgICAgIGNvbnN0IHJlcyA9IHtcbiAgICAgICAgICBpbnN0YW50X2xpa2VsaWhvb2Q6IDAsXG4gICAgICAgICAgbG9nX2xpa2VsaWhvb2Q6IDBcbiAgICAgICAgfTtcblxuICAgICAgICByZXMubGlrZWxpaG9vZF9idWZmZXIgPSBuZXcgQXJyYXkodGhpcy5fbGlrZWxpaG9vZFdpbmRvdyk7XG5cbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCB0aGlzLl9saWtlbGlob29kV2luZG93OyBqKyspIHtcbiAgICAgICAgICByZXMubGlrZWxpaG9vZF9idWZmZXJbal0gPSAxIC8gdGhpcy5fbGlrZWxpaG9vZFdpbmRvdztcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgcmVzLmxpa2VsaWhvb2RfYnVmZmVyX2luZGV4ID0gMDtcblxuICAgICAgICAvLyB0aGUgZm9sbG93aW5nIHZhcmlhYmxlcyBhcmUgdXNlZCBmb3IgcmVncmVzc2lvbiA6XG4gICAgICAgIHJlcy5iZXRhID0gbmV3IEFycmF5KG0ubW9kZWxzW2ldLmNvbXBvbmVudHMubGVuZ3RoKTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHJlcy5iZXRhLmxlbmd0aDsgaisrKSB7XG4gICAgICAgICAgcmVzLmJldGFbal0gPSAxIC8gcmVzLmJldGEubGVuZ3RoO1xuICAgICAgICB9XG5cbiAgICAgICAgcmVzLm91dHB1dF92YWx1ZXMgPSB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X3ZhbHVlcy5zbGljZSgwKTtcbiAgICAgICAgcmVzLm91dHB1dF9jb3ZhcmlhbmNlID0gdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF9jb3ZhcmlhbmNlLnNsaWNlKDApO1xuXG4gICAgICAgIC8vIG5vdyBhZGQgdGhpcyBzaW5nbGVNb2RlbFJlc3VsdHMgb2JqZWN0XG4gICAgICAgIC8vIHRvIHRoZSBnbG9iYWwgbW9kZWxSZXN1bHRzIG9iamVjdCA6XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5zaW5nbGVDbGFzc0dtbU1vZGVsUmVzdWx0cy5wdXNoKHJlcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnRseSBlc3RpbWF0ZWQgbGlrZWxpZXN0IGxhYmVsLlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCBsaWtlbGllc3RMYWJlbCgpIHtcbiAgICBpZiAodGhpcy5fbW9kZWxSZXN1bHRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbFJlc3VsdHMubGlrZWxpZXN0ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLm1vZGVsc1t0aGlzLl9tb2RlbFJlc3VsdHMubGlrZWxpZXN0XS5sYWJlbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICd1bmtub3duJztcbiAgfVxuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgY2xhc3NlcyBjb250YWluZWQgaW4gdGhlIG1vZGVsLlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBuYkNsYXNzZXMoKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5tb2RlbHMubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaXplIG9mIHRoZSByZWdyZXNzaW9uIHZlY3RvciBpZiBtb2RlbCBpcyBiaW1vZGFsLlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCByZWdyZXNzaW9uU2l6ZSgpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLnNoYXJlZF9wYXJhbWV0ZXJzLmRpbWVuc2lvbl9pbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdtbURlY29kZXI7IiwiaW1wb3J0ICogYXMgaGhtbVV0aWxzIGZyb20gJy4uL3V0aWxzL2hobW0tdXRpbHMnO1xuXG4vKipcbiAqIEhpZXJhcmNoaWNhbCBITU0gZGVjb2RlciA8YnIgLz5cbiAqIExvYWRzIGEgbW9kZWwgdHJhaW5lZCBieSB0aGUgWE1NIGxpYnJhcnkgYW5kIHByb2Nlc3NlcyBhbiBpbnB1dCBzdHJlYW0gb2YgZmxvYXQgdmVjdG9ycyBpbiByZWFsLXRpbWUuXG4gKiBJZiB0aGUgbW9kZWwgd2FzIHRyYWluZWQgZm9yIHJlZ3Jlc3Npb24sIG91dHB1dHMgYW4gZXN0aW1hdGlvbiBvZiB0aGUgYXNzb2NpYXRlZCBwcm9jZXNzLlxuICogQGNsYXNzXG4gKi9cblxuY2xhc3MgSGhtbURlY29kZXIge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3dpbmRvd1NpemU9MV0gLSBTaXplIG9mIHRoZSBsaWtlbGlob29kIHNtb290aGluZyB3aW5kb3cuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih3aW5kb3dTaXplID0gMSkge1xuXG4gICAgLyoqXG4gICAgICogU2l6ZSBvZiB0aGUgbGlrZWxpaG9vZCBzbW9vdGhpbmcgd2luZG93LlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9saWtlbGlob29kV2luZG93ID0gd2luZG93U2l6ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtb2RlbCwgYXMgZ2VuZXJhdGVkIGJ5IFhNTSBmcm9tIGEgdHJhaW5pbmcgZGF0YSBzZXQuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX21vZGVsID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1vZGVsIHJlc3VsdHMsIGNvbnRhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2sgaW4gZmlsdGVyLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9tb2RlbFJlc3VsdHMgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgaGFuZGxpbmcgZXN0aW1hdGlvbiByZXN1bHRzLlxuICAgKiBAY2FsbGJhY2sgSGhtbVJlc3VsdHNDYWxsYmFja1xuICAgKiBAcGFyYW0ge3N0cmluZ30gZXJyIC0gRGVzY3JpcHRpb24gb2YgYSBwb3RlbnRpYWwgZXJyb3IuXG4gICAqIEBwYXJhbSB7SGhtbVJlc3VsdHN9IHJlcyAtIE9iamVjdCBob2xkaW5nIHRoZSBlc3RpbWF0aW9uIHJlc3VsdHMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZXN1bHRzIG9mIHRoZSBmaWx0ZXJpbmcgcHJvY2Vzcy5cbiAgICogQHR5cGVkZWYgSGhtbVJlc3VsdHNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGxpa2VsaWVzdCAtIFRoZSBsaWtlbGllc3QgbW9kZWwncyBsYWJlbC5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxpa2VsaWVzdEluZGV4IC0gVGhlIGxpa2VsaWVzdCBtb2RlbCdzIGluZGV4XG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkubnVtYmVyfSBsaWtlbGlob29kcyAtIFRoZSBhcnJheSBvZiBhbGwgbW9kZWxzJyBzbW9vdGhlZCBub3JtYWxpemVkIGxpa2VsaWhvb2RzLlxuICAgKiBAcHJvcGVydHkge0FycmF5Lm51bWJlcn0gdGltZVByb2dyZXNzaW9ucyAtIFRoZSBhcnJheSBvZiBhbGwgbW9kZWxzJyBub3JtYWxpemVkIHRpbWUgcHJvZ3Jlc3Npb25zLlxuICAgKiBAcHJvcGVydHkge0FycmF5LkFycmF5Lm51bWJlcn0gYWxwaGFzIC0gVGhlIGFycmF5IG9mIGFsbCBtb2RlbHMnIHN0YXRlcyBsaWtlbGlob29kcyBhcnJheS5cbiAgICogQHByb3BlcnR5IHs/QXJyYXkubnVtYmVyfSBvdXRwdXRWYWx1ZXMgLSBJZiB0aGUgbW9kZWwgd2FzIHRyYWluZWQgd2l0aCByZWdyZXNzaW9uLCB0aGUgZXN0aW1hdGVkIGZsb2F0IHZlY3RvciBvdXRwdXQuXG4gICAqIEBwcm9wZXJ0eSB7P0FycmF5Lm51bWJlcn0gb3V0cHV0Q292YXJpYW5jZSAtIElmIHRoZSBtb2RlbCB3YXMgdHJhaW5lZCB3aXRoIHJlZ3Jlc3Npb24sIHRoZSBvdXRwdXQgY292YXJpYW5jZSBtYXRyaXguXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaGUgZGVjb2RpbmcgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7QXJyYXkubnVtYmVyfSBvYnNlcnZhdGlvbiAtIEFuIGlucHV0IGZsb2F0IHZlY3RvciB0byBiZSBlc3RpbWF0ZWQuXG4gICAqIEBwYXJhbSB7SGhtbVJlc3VsdHNDYWxsYmFja30gW3Jlc3VsdHNDYWxsYmFjaz1udWxsXSAtIFRoZSBjYWxsYmFjayBoYW5kbGluZyB0aGUgZXN0aW1hdGlvbiByZXN1bHRzLlxuICAgKiBAcmV0dXJucyB7SGhtbVJlc3VsdHN9IHJlc3VsdHMgLSBUaGUgZXN0aW1hdGlvbiByZXN1bHRzLlxuICAgKi9cbiAgZmlsdGVyKG9ic2VydmF0aW9uLCByZXN1bHRzQ2FsbGJhY2sgPSBudWxsKSB7XG4gICAgbGV0IGVyciA9IG51bGw7XG4gICAgbGV0IHJlcyA9IG51bGw7XG5cbiAgICBpZighdGhpcy5fbW9kZWwpIHtcbiAgICAgIGVyciA9ICdubyBtb2RlbCBsb2FkZWQgeWV0JztcbiAgICB9IGVsc2Uge1xuICAgICAgLy9jb25zb2xlLmxvZyhvYnNlcnZhdGlvbik7XG4gICAgICAvL3RoaXMuX29ic2VydmF0aW9uID0gb2JzZXJ2YXRpb247XG4gICAgICB0cnkge1xuICAgICAgICBoaG1tVXRpbHMuaGhtbUZpbHRlcihvYnNlcnZhdGlvbiwgdGhpcy5fbW9kZWwsIHRoaXMuX21vZGVsUmVzdWx0cyk7XG5cbiAgICAgICAgLy8gY3JlYXRlIHJlc3VsdHMgb2JqZWN0IGZyb20gcmVsZXZhbnQgbW9kZWxSZXN1bHRzIHZhbHVlcyA6XG4gICAgICAgIGNvbnN0IGxpa2VsaWVzdCA9ICh0aGlzLl9tb2RlbFJlc3VsdHMubGlrZWxpZXN0ID4gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuX21vZGVsLm1vZGVsc1t0aGlzLl9tb2RlbFJlc3VsdHMubGlrZWxpZXN0XS5sYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgOiAndW5rbm93bic7XG4gICAgICAgIGNvbnN0IGxpa2VsaWhvb2RzID0gdGhpcy5fbW9kZWxSZXN1bHRzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHMuc2xpY2UoMCk7XG4gICAgICAgIHJlcyA9IHtcbiAgICAgICAgICBsaWtlbGllc3Q6IGxpa2VsaWVzdCxcbiAgICAgICAgICBsaWtlbGllc3RJbmRleDogdGhpcy5fbW9kZWxSZXN1bHRzLmxpa2VsaWVzdCxcbiAgICAgICAgICBsaWtlbGlob29kczogbGlrZWxpaG9vZHMsXG4gICAgICAgICAgdGltZVByb2dyZXNzaW9uczogbmV3IEFycmF5KHRoaXMuX21vZGVsLm1vZGVscy5sZW5ndGgpLFxuICAgICAgICAgIGFscGhhczogbmV3IEFycmF5KHRoaXMuX21vZGVsLm1vZGVscy5sZW5ndGgpXG4gICAgICAgIH07XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9tb2RlbC5tb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgICByZXMudGltZVByb2dyZXNzaW9uc1tpXSA9IHRoaXMuX21vZGVsUmVzdWx0cy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXS5wcm9ncmVzcztcbiAgICAgICAgICBpZiAodGhpcy5fbW9kZWwuY29uZmlndXJhdGlvbi5kZWZhdWx0X3BhcmFtZXRlcnMuaGllcmFyY2hpY2FsKSB7XG4gICAgICAgICAgICByZXMuYWxwaGFzW2ldXG4gICAgICAgICAgICAgID0gdGhpcy5fbW9kZWxSZXN1bHRzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldLmFscGhhX2hbMF07XG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIHJlcy5hbHBoYXNbaV1cbiAgICAgICAgICAgICAgPSB0aGlzLl9tb2RlbFJlc3VsdHMuc2luZ2xlQ2xhc3NIbW1Nb2RlbFJlc3VsdHNbaV0uYWxwaGFbMF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYgKHRoaXMuX21vZGVsLnNoYXJlZF9wYXJhbWV0ZXJzLmJpbW9kYWwpIHtcbiAgICAgICAgICByZXNbJ291dHB1dFZhbHVlcyddID0gdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF92YWx1ZXMuc2xpY2UoMCk7XG4gICAgICAgICAgcmVzWydvdXRwdXRDb3ZhcmlhbmNlJ11cbiAgICAgICAgICAgICAgPSB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X2NvdmFyaWFuY2Uuc2xpY2UoMCk7XG4gICAgICAgIH1cbiAgICAgIH0gY2F0Y2ggKGUpIHtcbiAgICAgICAgZXJyID0gJ3Byb2JsZW0gb2NjdXJlZCBkdXJpbmcgZmlsdGVyaW5nIDogJyArIGU7XG4gICAgICB9XG4gICAgfVxuXG4gICAgaWYgKHJlc3VsdHNDYWxsYmFjaykge1xuICAgICAgcmVzdWx0c0NhbGxiYWNrKGVyciwgcmVzKTtcbiAgICB9XG4gICAgcmV0dXJuIHJlcztcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGludGVybWVkaWF0ZSByZXN1bHRzIG9mIHRoZSBlc3RpbWF0aW9uIChzaG9ydGN1dCBmb3IgcmVsb2FkaW5nIHRoZSBtb2RlbCkuXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fc2V0TW9kZWwodGhpcy5fbW9kZWwpO1xuICAgIH1cbiAgfVxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT0gR0VUVEVSUyAvIFNFVFRFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PT0vL1xuXG4gIC8qKlxuICAgKiBMaWtlbGlob29kIHNtb290aGluZyB3aW5kb3cgc2l6ZS5cbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBsaWtlbGlob29kV2luZG93KCkge1xuICAgIHJldHVybiB0aGlzLl9saWtlbGlob29kV2luZG93O1xuICB9XG5cbiAgc2V0IGxpa2VsaWhvb2RXaW5kb3cobmV3V2luZG93U2l6ZSkge1xuICAgIHRoaXMuX2xpa2VsaWhvb2RXaW5kb3cgPSBuZXdXaW5kb3dTaXplO1xuXG4gICAgaWYgKHRoaXMuX21vZGVsID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIGNvbnN0IHJlcyA9IHRoaXMuX21vZGVsUmVzdWx0cy5zaW5nbGVDbGFzc01vZGVsUmVzdWx0cztcbiAgICBcbiAgICBmb3IgKGxldCBpPTA7IGk8dGhpcy5fbW9kZWwubW9kZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICByZXNbaV0ubGlrZWxpaG9vZF9idWZmZXIgPSBuZXcgQXJyYXkodGhpcy5fbGlrZWxpaG9vZFdpbmRvdyk7XG5cbiAgICAgIGZvciAobGV0IGo9MDsgajx0aGlzLl9saWtlbGlob29kV2luZG93OyBqKyspIHtcbiAgICAgICAgcmVzLmxpa2VsaWhvb2RfYnVmZmVyW2pdID0gMSAvIHRoaXMuX2xpa2VsaWhvb2RXaW5kb3c7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIFRoZSBtb2RlbCBnZW5lcmF0ZWQgYnkgWE1NLlxuICAgKiBJdCBpcyBtYW5kYXRvcnkgZm9yIHRoZSBjbGFzcyB0byBoYXZlIGEgbW9kZWwgaW4gb3JkZXIgdG8gZG8gaXRzIGpvYi5cbiAgICogQHR5cGUge09iamVjdH1cbiAgICovXG4gIGdldCBtb2RlbCgpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIEpTT04uZnJvbVN0cmluZyhKU09OLnN0cmluZ2lmeSh0aGlzLl9tb2RlbCkpO1xuICAgIH1cbiAgICByZXR1cm4gdW5kZWZpbmVkO1xuICB9XG5cbiAgc2V0IG1vZGVsKG1vZGVsKSB7XG4gICAgdGhpcy5fc2V0TW9kZWwobW9kZWwpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9zZXRNb2RlbChtb2RlbCkgeyAgICAgIFxuXG4gICAgdGhpcy5fbW9kZWwgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fbW9kZWxSZXN1bHRzID0gdW5kZWZpbmVkO1xuXG4gICAgaWYgKCFtb2RlbCkgcmV0dXJuO1xuXG4gICAgLy8gdGVzdCBpZiBtb2RlbCBpcyB2YWxpZCBoZXJlIChUT0RPIDogd3JpdGUgYSBiZXR0ZXIgdGVzdClcbiAgICBpZiAobW9kZWwubW9kZWxzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX21vZGVsID0gbW9kZWw7XG4gICAgICBjb25zdCBtID0gdGhpcy5fbW9kZWw7XG4gICAgICBjb25zdCBubW9kZWxzID0gbS5tb2RlbHMubGVuZ3RoO1xuXG4gICAgICB0aGlzLl9tb2RlbFJlc3VsdHMgPSB7XG4gICAgICAgIGluc3RhbnRfbGlrZWxpaG9vZHM6IG5ldyBBcnJheShubW9kZWxzKSxcbiAgICAgICAgc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIHNtb290aGVkX2xpa2VsaWhvb2RzOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIGluc3RhbnRfbm9ybWFsaXplZF9saWtlbGlob29kczogbmV3IEFycmF5KG5tb2RlbHMpLFxuICAgICAgICBzbW9vdGhlZF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIGxpa2VsaWVzdDogLTEsXG4gICAgICAgIGZyb250aWVyX3YxOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIGZyb250aWVyX3YyOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIGZvcndhcmRfaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgICBzaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0czogW11cbiAgICAgIH07XG5cbiAgICAgIGNvbnN0IHBhcmFtcyA9IG0uc2hhcmVkX3BhcmFtZXRlcnM7XG4gICAgICBjb25zdCBkaW1PdXQgPSBwYXJhbXMuZGltZW5zaW9uIC0gcGFyYW1zLmRpbWVuc2lvbl9pbnB1dDtcbiAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5vdXRwdXRfdmFsdWVzID0gbmV3IEFycmF5KGRpbU91dCk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpbU91dDsgaSsrKSB7XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5vdXRwdXRfdmFsdWVzW2ldID0gMC4wO1xuICAgICAgfVxuXG4gICAgICBsZXQgb3V0Q292YXJTaXplO1xuICAgICAgaWYgKG0uY29uZmlndXJhdGlvbi5kZWZhdWx0X3BhcmFtZXRlcnMuY292YXJpYW5jZV9tb2RlID09IDApIHsgLy8tLS0tIGZ1bGxcbiAgICAgICAgb3V0Q292YXJTaXplID0gZGltT3V0ICogZGltT3V0O1xuICAgICAgfSBlbHNlIHsgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgICAgICAgb3V0Q292YXJTaXplID0gZGltT3V0O1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X2NvdmFyaWFuY2UgPSBuZXcgQXJyYXkob3V0Q292YXJTaXplKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1PdXQ7IGkrKykge1xuICAgICAgICB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X2NvdmFyaWFuY2VbaV0gPSAwLjA7XG4gICAgICB9XG5cbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbm1vZGVsczsgaSsrKSB7XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5pbnN0YW50X2xpa2VsaWhvb2RzW2ldID0gMDtcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLnNtb290aGVkX2xvZ19saWtlbGlob29kc1tpXSA9IDA7XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5zbW9vdGhlZF9saWtlbGlob29kc1tpXSA9IDA7XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5pbnN0YW50X25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gPSAwO1xuICAgICAgICB0aGlzLl9tb2RlbFJlc3VsdHMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSA9IDA7XG5cbiAgICAgICAgY29uc3QgbnN0YXRlcyA9IG0ubW9kZWxzW2ldLnBhcmFtZXRlcnMuc3RhdGVzO1xuXG4gICAgICAgIGNvbnN0IGFscGhhX2ggPSBuZXcgQXJyYXkoMyk7XG4gICAgICAgIGZvciAobGV0IGo9MDsgajwzOyBqKyspIHtcbiAgICAgICAgICBhbHBoYV9oW2pdID0gbmV3IEFycmF5KG5zdGF0ZXMpO1xuICAgICAgICAgIGZvciAobGV0IGs9MDsgazxuc3RhdGVzOyBrKyspIHtcbiAgICAgICAgICAgIGFscGhhX2hbal1ba10gPSAwO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgY29uc3QgYWxwaGEgPSBuZXcgQXJyYXkobnN0YXRlcyk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnN0YXRlczsgaisrKSB7XG4gICAgICAgICAgYWxwaGFbal0gPSAwO1xuICAgICAgICB9XG5cbiAgICAgICAgbGV0IGxpa2VsaWhvb2RfYnVmZmVyID0gbmV3IEFycmF5KHRoaXMuX2xpa2VsaWhvb2RXaW5kb3cpO1xuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2xpa2VsaWhvb2RXaW5kb3c7IGorKykge1xuICAgICAgICAgIGxpa2VsaWhvb2RfYnVmZmVyW2pdID0gMC4wO1xuICAgICAgICB9XG5cbiAgICAgICAgY29uc3QgaG1tUmVzID0ge1xuICAgICAgICAgIGhpZXJhcmNoaWNhbDogbS5jb25maWd1cmF0aW9uLmRlZmF1bHRfcGFyYW1ldGVycy5oaWVyYXJjaGljYWwsXG4gICAgICAgICAgaW5zdGFudF9saWtlbGlob29kOiAwLFxuICAgICAgICAgIGxvZ19saWtlbGlob29kOiAwLFxuICAgICAgICAgIC8vIGZvciBjaXJjdWxhciBidWZmZXIgaW1wbGVtZW50YXRpb25cbiAgICAgICAgICAvLyAoc2VlIGhtbVVwZGF0ZVJlc3VsdHMpIDpcbiAgICAgICAgICBsaWtlbGlob29kX2J1ZmZlcjogbGlrZWxpaG9vZF9idWZmZXIsXG4gICAgICAgICAgbGlrZWxpaG9vZF9idWZmZXJfaW5kZXg6IDAsXG4gICAgICAgICAgcHJvZ3Jlc3M6IDAsXG5cbiAgICAgICAgICBleGl0X2xpa2VsaWhvb2Q6IDAsXG4gICAgICAgICAgZXhpdF9yYXRpbzogMCxcblxuICAgICAgICAgIGxpa2VsaWVzdF9zdGF0ZTogLTEsXG5cbiAgICAgICAgICAvLyBmb3Igbm9uLWhpZXJhcmNoaWNhbCA6XG4gICAgICAgICAgcHJldmlvdXNfYWxwaGE6IGFscGhhLnNsaWNlKDApLFxuICAgICAgICAgIGFscGhhOiBhbHBoYSxcbiAgICAgICAgICAvLyBmb3IgaGllcmFyY2hpY2FsIDogICAgICAgXG4gICAgICAgICAgYWxwaGFfaDogYWxwaGFfaCxcbiAgICAgICAgICBwcmlvcjogbmV3IEFycmF5KG5zdGF0ZXMpLFxuICAgICAgICAgIHRyYW5zaXRpb246IG5ldyBBcnJheShuc3RhdGVzKSxcblxuICAgICAgICAgIC8vIHVzZWQgaW4gaG1tVXBkYXRlQWxwaGFXaW5kb3dcbiAgICAgICAgICB3aW5kb3dfbWluaW5kZXg6IDAsXG4gICAgICAgICAgd2luZG93X21heGluZGV4OiAwLFxuICAgICAgICAgIHdpbmRvd19ub3JtYWxpemF0aW9uX2NvbnN0YW50OiAwLFxuXG4gICAgICAgICAgLy8gZm9yIG5vbi1oaWVyYXJjaGljYWwgbW9kZVxuICAgICAgICAgIGZvcndhcmRfaW5pdGlhbGl6ZWQ6IGZhbHNlLFxuICAgICAgICAgIFxuICAgICAgICAgIHNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzOiBbXSAgLy8gYWthIHN0YXRlc1xuICAgICAgICB9O1xuXG4gICAgICAgIGhtbVJlcy5vdXRwdXRfdmFsdWVzID0gdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF92YWx1ZXMuc2xpY2UoMCk7XG4gICAgICAgIGhtbVJlcy5vdXRwdXRfY292YXJpYW5jZSA9IHRoaXMuX21vZGVsUmVzdWx0cy5vdXRwdXRfY292YXJpYW5jZS5zbGljZSgwKTtcblxuICAgICAgICAvLyBhZGQgSE1NIHN0YXRlcyAoR01NcylcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuc3RhdGVzOyBqKyspIHtcbiAgICAgICAgICBjb25zdCBnbW1SZXMgPSB7XG4gICAgICAgICAgICBpbnN0YW50X2xpa2VsaWhvb2Q6IDAsXG4gICAgICAgICAgICBsb2dfbGlrZWxpaG9vZDogMFxuICAgICAgICAgIH07XG4gICAgICAgICAgZ21tUmVzLmJldGEgPSBuZXcgQXJyYXkodGhpcy5fbW9kZWwubW9kZWxzW2ldLnBhcmFtZXRlcnMuZ2F1c3NpYW5zKTtcbiAgICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGdtbVJlcy5iZXRhLmxlbmd0aDsgaysrKSB7XG4gICAgICAgICAgICBnbW1SZXMuYmV0YVtrXSA9IDEgLyBnbW1SZXMuYmV0YS5sZW5ndGg7XG4gICAgICAgICAgfVxuICAgICAgICAgIGdtbVJlcy5vdXRwdXRfdmFsdWVzID0gaG1tUmVzLm91dHB1dF92YWx1ZXMuc2xpY2UoMCk7XG4gICAgICAgICAgZ21tUmVzLm91dHB1dF9jb3ZhcmlhbmNlID0gaG1tUmVzLm91dHB1dF9jb3ZhcmlhbmNlLnNsaWNlKDApO1xuXG4gICAgICAgICAgaG1tUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzLnB1c2goZ21tUmVzKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0cy5wdXNoKGhtbVJlcyk7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIEN1cnJlbnRseSBlc3RpbWF0ZWQgbGlrZWxpZXN0IGxhYmVsLlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge1N0cmluZ31cbiAgICovXG4gIGdldCBsaWtlbGllc3RMYWJlbCgpIHtcbiAgICBpZiAodGhpcy5fbW9kZWxSZXN1bHRzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIGlmICh0aGlzLl9tb2RlbFJlc3VsdHMubGlrZWxpZXN0ID4gLTEpIHtcbiAgICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLm1vZGVsc1t0aGlzLl9tb2RlbFJlc3VsdHMubGlrZWxpZXN0XS5sYWJlbDtcbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuICd1bmtub3duJztcbiAgfVxuXG4gIC8qKlxuICAgKiBOdW1iZXIgb2YgY2xhc3NlcyBjb250YWluZWQgaW4gdGhlIG1vZGVsLlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCBuYkNsYXNzZXMoKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHJldHVybiB0aGlzLl9tb2RlbC5tb2RlbHMubGVuZ3RoO1xuICAgIH1cbiAgICByZXR1cm4gMDtcbiAgfVxuXG4gIC8qKlxuICAgKiBTaXplIG9mIHRoZSByZWdyZXNzaW9uIHZlY3RvciBpZiBtb2RlbCBpcyBiaW1vZGFsLlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge051bWJlcn1cbiAgICovXG4gIGdldCByZWdyZXNzaW9uU2l6ZSgpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLnNoYXJlZF9wYXJhbWV0ZXJzLmRpbWVuc2lvbl9pbnB1dDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEhobW1EZWNvZGVyOyIsImV4cG9ydCB7IGRlZmF1bHQgYXMgR21tRGVjb2RlciB9IGZyb20gJy4vZ21tL2dtbS1kZWNvZGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgSGhtbURlY29kZXIgfSBmcm9tICcuL2hobW0vaGhtbS1kZWNvZGVyJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGhyYXNlTWFrZXIgfSBmcm9tICcuL3NldC94bW0tcGhyYXNlJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgU2V0TWFrZXIgfSBmcm9tICcuL3NldC94bW0tc2V0JyIsIi8qKlxuICogWE1NIGNvbXBhdGlibGUgcGhyYXNlIGJ1aWxkZXIgdXRpbGl0eSA8YnIgLz5cbiAqIENsYXNzIHRvIGVhc2UgdGhlIGNyZWF0aW9uIG9mIFhNTSBjb21wYXRpYmxlIGRhdGEgcmVjb3JkaW5ncywgYWthIHBocmFzZXMuIDxiciAvPlxuICogUGhyYXNlcyBhcmUgdHlwaWNhbGx5IGFycmF5cyAoZmxhdHRlbmVkIG1hdHJpY2VzKSBvZiBzaXplIE4gKiBNLFxuICogTiBiZWluZyB0aGUgc2l6ZSBvZiBhIHZlY3RvciBlbGVtZW50LCBhbmQgTSB0aGUgbGVuZ3RoIG9mIHRoZSBwaHJhc2UgaXRzZWxmLFxuICogd3JhcHBlZCB0b2dldGhlciBpbiBhbiBvYmplY3Qgd2l0aCBhIGZldyBzZXR0aW5ncy5cbiAqIEBjbGFzc1xuICovXG5cbmNsYXNzIFBocmFzZU1ha2VyIHtcbiAgLyoqXG4gICAqIFhNTSBwaHJhc2UgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAqIEB0eXBlZGVmIFhtbVBocmFzZUNvbmZpZ1xuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbmFtZSBYbW1QaHJhc2VDb25maWdcbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBiaW1vZGFsIC0gSW5kaWNhdGVzIHdldGhlciBwaHJhc2UgZGF0YSBzaG91bGQgYmUgY29uc2lkZXJlZCBiaW1vZGFsLlxuICAgKiBJZiB0cnVlLCB0aGUgPGNvZGU+ZGltZW5zaW9uX2lucHV0PC9jb2RlPiBwcm9wZXJ0eSB3aWxsIGJlIHRha2VuIGludG8gYWNjb3VudC5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRpbWVuc2lvbiAtIFNpemUgb2YgYSBwaHJhc2UncyB2ZWN0b3IgZWxlbWVudC5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRpbWVuc2lvbklucHV0IC0gU2l6ZSBvZiB0aGUgcGFydCBvZiBhbiBpbnB1dCB2ZWN0b3IgZWxlbWVudCB0aGF0IHNob3VsZCBiZSB1c2VkIGZvciB0cmFpbmluZy5cbiAgICogVGhpcyBpbXBsaWVzIHRoYXQgdGhlIHJlc3Qgb2YgdGhlIHZlY3RvciAob2Ygc2l6ZSA8Y29kZT5kaW1lbnNpb24gLSBkaW1lbnNpb25faW5wdXQ8L2NvZGU+KVxuICAgKiB3aWxsIGJlIHVzZWQgZm9yIHJlZ3Jlc3Npb24uIE9ubHkgdGFrZW4gaW50byBhY2NvdW50IGlmIDxjb2RlPmJpbW9kYWw8L2NvZGU+IGlzIHRydWUuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuU3RyaW5nfSBjb2x1bW5fbmFtZXMgLSBBcnJheSBvZiBzdHJpbmcgaWRlbnRpZmllcnMgZGVzY3JpYmluZyBlYWNoIHNjYWxhciBvZiB0aGUgcGhyYXNlJ3MgdmVjdG9yIGVsZW1lbnRzLlxuICAgKiBUeXBpY2FsbHkgb2Ygc2l6ZSA8Y29kZT5kaW1lbnNpb248L2NvZGU+LlxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gbGFiZWwgLSBUaGUgc3RyaW5nIGlkZW50aWZpZXIgb2YgdGhlIGNsYXNzIHRoZSBwaHJhc2UgYmVsb25ncyB0by5cbiAgICovXG5cbiAgLyoqXG4gICAqIEBwYXJhbSB7WG1tUGhyYXNlQ29uZmlnfSBvcHRpb25zIC0gRGVmYXVsdCBwaHJhc2UgY29uZmlndXJhdGlvbi5cbiAgICogQHNlZSB7QGxpbmsgY29uZmlnfS5cbiAgICovXG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIGNvbnN0IGRlZmF1bHRzID0ge1xuICAgICAgYmltb2RhbDogZmFsc2UsXG4gICAgICBkaW1lbnNpb246IDEsXG4gICAgICBkaW1lbnNpb25JbnB1dDogMCxcbiAgICAgIGNvbHVtbk5hbWVzOiBbJyddLFxuICAgICAgbGFiZWw6ICcnXG4gICAgfVxuXG4gICAgdGhpcy5fY29uZmlnID0gZGVmYXVsdHM7XG4gICAgdGhpcy5fc2V0Q29uZmlnKG9wdGlvbnMpO1xuXG4gICAgdGhpcy5yZXNldCgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFhNTSBwaHJhc2UgY29uZmlndXJhdGlvbiBvYmplY3QuXG4gICAqIE9ubHkgbGVnYWwgZmllbGRzIHdpbGwgYmUgY2hlY2tlZCBiZWZvcmUgYmVpbmcgYWRkZWQgdG8gdGhlIGNvbmZpZywgb3RoZXJzIHdpbGwgYmUgaWdub3JlZFxuICAgKiBAdHlwZSB7WG1tUGhyYXNlQ29uZmlnfVxuICAgKiBAZGVwcmVjYXRlZCBzaW5jZSB2ZXJzaW9uIDAuMi4wXG4gICAqL1xuICBnZXQgY29uZmlnKCkge1xuICAgIHJldHVybiB0aGlzLl9jb25maWc7XG4gIH1cblxuICBzZXQgY29uZmlnKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NldENvbmZpZyhvcHRpb25zKTtcbiAgfVxuXG4gIC8vIG5ldyBBUEkgKGItbWEgdGlwIDogZG9uJyB1c2UgYWNjZXNzb3JzIGlmIHRoZXJlIGlzIHNvbWUgbWFnaWMgYmVoaW5kLFxuICAvLyB3aGljaCBpcyB0aGUgY2FzZSBpbiBfc2V0Q29uZmlnKVxuICAvLyBrZWVwaW5nIGFjY2Vzc29ycyBmb3IgYmFja3dhcmRzIGNvbXBhdGliaWxpdHlcblxuICAvKipcbiAgICogUmV0dXJucyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uLlxuICAgKi9cbiAgZ2V0Q29uZmlnKCkge1xuICAgIHJldHVybiB0aGlzLl9jb25maWc7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlcyB0aGUgY3VycmVudCBjb25maWd1cmF0aW9uIHdpdGggdGhlIHByb3ZpZGVkIGluZm9ybWF0aW9uLlxuICAgKiBAcGFyYW0ge1htbVBocmFzZUNvbmZpZ30gb3B0aW9uc1xuICAgKi9cbiAgc2V0Q29uZmlnKG9wdGlvbnMgPSB7fSkge1xuICAgIHRoaXMuX3NldENvbmZpZyhvcHRpb25zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBBIHZhbGlkIFhNTSBwaHJhc2UsIHJlYWR5IHRvIGJlIHByb2Nlc3NlZCBieSB0aGUgWE1NIGxpYnJhcnkuXG4gICAqIEB0eXBlZGVmIFhtbVBocmFzZVxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKiBAbmFtZSBYbW1QaHJhc2VcbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBiaW1vZGFsIC0gSW5kaWNhdGVzIHdldGhlciBwaHJhc2UgZGF0YSBzaG91bGQgYmUgY29uc2lkZXJlZCBiaW1vZGFsLlxuICAgKiBJZiB0cnVlLCB0aGUgPGNvZGU+ZGltZW5zaW9uX2lucHV0PC9jb2RlPiBwcm9wZXJ0eSB3aWxsIGJlIHRha2VuIGludG8gYWNjb3VudC5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRpbWVuc2lvbiAtIFNpemUgb2YgYSBwaHJhc2UncyB2ZWN0b3IgZWxlbWVudC5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGRpbWVuc2lvbl9pbnB1dCAtIFNpemUgb2YgdGhlIHBhcnQgb2YgYW4gaW5wdXQgdmVjdG9yIGVsZW1lbnQgdGhhdCBzaG91bGQgYmUgdXNlZCBmb3IgdHJhaW5pbmcuXG4gICAqIFRoaXMgaW1wbGllcyB0aGF0IHRoZSByZXN0IG9mIHRoZSB2ZWN0b3IgKG9mIHNpemUgPGNvZGU+ZGltZW5zaW9uIC0gZGltZW5zaW9uX2lucHV0PC9jb2RlPilcbiAgICogd2lsbCBiZSB1c2VkIGZvciByZWdyZXNzaW9uLiBPbmx5IHRha2VuIGludG8gYWNjb3VudCBpZiA8Y29kZT5iaW1vZGFsPC9jb2RlPiBpcyB0cnVlLlxuICAgKiBAcHJvcGVydHkge0FycmF5LlN0cmluZ30gY29sdW1uX25hbWVzIC0gQXJyYXkgb2Ygc3RyaW5nIGlkZW50aWZpZXJzIGRlc2NyaWJpbmcgZWFjaCBzY2FsYXIgb2YgdGhlIHBocmFzZSdzIHZlY3RvciBlbGVtZW50cy5cbiAgICogVHlwaWNhbGx5IG9mIHNpemUgPGNvZGU+ZGltZW5zaW9uPC9jb2RlPi5cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGxhYmVsIC0gVGhlIHN0cmluZyBpZGVudGlmaWVyIG9mIHRoZSBjbGFzcyB0aGUgcGhyYXNlIGJlbG9uZ3MgdG8uXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuTnVtYmVyfSBkYXRhIC0gVGhlIHBocmFzZSdzIGRhdGEsIGNvbnRhaW5pbmcgYWxsIHRoZSB2ZWN0b3JzIGZsYXR0ZW5lZCBpbnRvIGEgc2luZ2xlIG9uZS5cbiAgICogT25seSB0YWtlbiBpbnRvIGFjY291bnQgaWYgPGNvZGU+Ymltb2RhbDwvY29kZT4gaXMgZmFsc2UuXG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkuTnVtYmVyfSBkYXRhX2lucHV0IC0gVGhlIHBocmFzZSdzIGRhdGEgd2hpY2ggd2lsbCBiZSB1c2VkIGZvciB0cmFpbmluZywgZmxhdHRlbmVkIGludG8gYSBzaW5nbGUgdmVjdG9yLlxuICAgKiBPbmx5IHRha2VuIGludG8gYWNjb3VudCBpZiA8Y29kZT5iaW1vZGFsPC9jb2RlPiBpcyB0cnVlLlxuICAgKiBAcHJvcGVydHkge0FycmF5Lk51bWJlcn0gZGF0YV9vdXRwdXQgLSBUaGUgcGhyYXNlJ3MgZGF0YSB3aGljaCB3aWxsIGJlIHVzZWQgZm9yIHJlZ3Jlc3Npb24sIGZsYXR0ZW5lZCBpbnRvIGEgc2luZ2xlIHZlY3Rvci5cbiAgICogT25seSB0YWtlbiBpbnRvIGFjY291bnQgaWYgPGNvZGU+Ymltb2RhbDwvY29kZT4gaXMgdHJ1ZS5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxlbmd0aCAtIFRoZSBsZW5ndGggb2YgdGhlIHBocmFzZSwgZS5nLiBvbmUgb2YgdGhlIGZvbGxvd2luZyA6XG4gICAqIDxsaSBzdHlsZT1cImxpc3Qtc3R5bGUtdHlwZTogbm9uZTtcIj5cbiAgICogPHVsPjxjb2RlPmRhdGEubGVuZ3RoIC8gZGltZW5zaW9uPC9jb2RlPjwvdWw+XG4gICAqIDx1bD48Y29kZT5kYXRhX2lucHV0Lmxlbmd0aCAvIGRpbWVuc2lvbl9pbnB1dDwvY29kZT48L3VsPlxuICAgKiA8dWw+PGNvZGU+ZGF0YV9vdXRwdXQubGVuZ3RoIC8gZGltZW5zaW9uX291dHB1dDwvY29kZT48L3VsPlxuICAgKiA8L2xpPlxuICAgKi9cblxuICAvKipcbiAgICogQSB2YWxpZCBYTU0gcGhyYXNlLCByZWFkeSB0byBiZSBwcm9jZXNzZWQgYnkgdGhlIFhNTSBsaWJyYXJ5LlxuICAgKiBAcmVhZG9ubHlcbiAgICogQHR5cGUge1htbVBocmFzZX1cbiAgICovXG4gIGdldCBwaHJhc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX2dldFBocmFzZSgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9nZXRQaHJhc2UoKSB7XG4gICAgcmV0dXJuIHtcbiAgICAgIGJpbW9kYWw6IHRoaXMuX2NvbmZpZy5iaW1vZGFsLFxuICAgICAgY29sdW1uX25hbWVzOiB0aGlzLl9jb25maWcuY29sdW1uTmFtZXMsXG4gICAgICBkaW1lbnNpb246IHRoaXMuX2NvbmZpZy5kaW1lbnNpb24sXG4gICAgICBkaW1lbnNpb25faW5wdXQ6IHRoaXMuX2NvbmZpZy5kaW1lbnNpb25JbnB1dCxcbiAgICAgIGxhYmVsOiB0aGlzLl9jb25maWcubGFiZWwsXG4gICAgICBkYXRhOiB0aGlzLl9kYXRhLnNsaWNlKDApLFxuICAgICAgZGF0YV9pbnB1dDogdGhpcy5fZGF0YUluLnNsaWNlKDApLFxuICAgICAgZGF0YV9vdXRwdXQ6IHRoaXMuX2RhdGFPdXQuc2xpY2UoMCksXG4gICAgICBsZW5ndGg6IHRoaXMuX2NvbmZpZy5iaW1vZGFsXG4gICAgICAgICAgICA/IHRoaXMuX2RhdGFJbi5sZW5ndGggLyB0aGlzLl9jb25maWcuZGltZW5zaW9uSW5wdXRcbiAgICAgICAgICAgIDogdGhpcy5fZGF0YS5sZW5ndGggLyB0aGlzLl9jb25maWcuZGltZW5zaW9uXG4gICAgfTtcbiAgfVxuICAvKipcbiAgICogQXBwZW5kIGFuIG9ic2VydmF0aW9uIHZlY3RvciB0byB0aGUgcGhyYXNlJ3MgZGF0YS4gTXVzdCBiZSBvZiBsZW5ndGggPGNvZGU+ZGltZW5zaW9uPC9jb2RlPi5cbiAgICogQHBhcmFtIHtBcnJheS5OdW1iZXJ9IG9icyAtIEFuIGlucHV0IHZlY3RvciwgYWthIG9ic2VydmF0aW9uLiBJZiA8Y29kZT5iaW1vZGFsPC9jb2RlPiBpcyB0cnVlXG4gICAqIEB0aHJvd3MgV2lsbCB0aHJvdyBhbiBlcnJvciBpZiB0aGUgaW5wdXQgdmVjdG9yIGRvZXNuJ3QgbWF0Y2ggdGhlIGNvbmZpZy5cbiAgICovXG4gIGFkZE9ic2VydmF0aW9uKG9icykge1xuICAgIC8vIGNoZWNrIGlucHV0IHZhbGlkaXR5XG4gICAgY29uc3QgYmFkTGVuZ3RoTXNnID0gJ0JhZCBpbnB1dCBsZW5ndGg6IG9ic2VydmF0aW9uIGxlbmd0aCBtdXN0IG1hdGNoIHBocmFzZSBkaW1lbnNpb24nO1xuICAgIGNvbnN0IGJhZFR5cGVNc2cgPSAnQmFkIGRhdGEgdHlwZTogYWxsIG9ic2VydmF0aW9uIHZhbHVlcyBtdXN0IGJlIG51bWJlcnMnO1xuXG4gICAgaWYgKG9icy5sZW5ndGggIT09IHRoaXMuX2NvbmZpZy5kaW1lbnNpb24gfHxcbiAgICAgICAgKHR5cGVvZihvYnMpID09PSAnbnVtYmVyJyAmJiB0aGlzLl9jb25maWcuZGltZW5zaW9uICE9PSAxKSkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKGJhZExlbmd0aE1zZyk7XG4gICAgfVxuXG4gICAgaWYgKEFycmF5LmlzQXJyYXkob2JzKSkge1xuICAgICAgZm9yIChsZXQgdmFsIG9mIG9icykge1xuICAgICAgICBpZiAodHlwZW9mKHZhbCkgIT09ICdudW1iZXInKSB7XG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGJhZFR5cGVNc2cpO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlb2Yob2JzICE9PSAnbnVtYmVyJykpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcihiYWRUeXBlTXNnKTtcbiAgICB9XG5cbiAgICAvLyBhZGQgdmFsdWUocykgdG8gaW50ZXJuYWwgYXJyYXlzXG4gICAgaWYgKHRoaXMuX2NvbmZpZy5iaW1vZGFsKSB7XG4gICAgICB0aGlzLl9kYXRhSW4gPSB0aGlzLl9kYXRhSW4uY29uY2F0KFxuICAgICAgICBvYnMuc2xpY2UoMCwgdGhpcy5fY29uZmlnLmRpbWVuc2lvbklucHV0KVxuICAgICAgKTtcbiAgICAgIHRoaXMuX2RhdGFPdXQgPSB0aGlzLl9kYXRhT3V0LmNvbmNhdChcbiAgICAgICAgb2JzLnNsaWNlKHRoaXMuX2NvbmZpZy5kaW1lbnNpb25JbnB1dClcbiAgICAgICk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGlmIChBcnJheS5pc0FycmF5KG9icykpIHtcbiAgICAgICAgdGhpcy5fZGF0YSA9IHRoaXMuX2RhdGEuY29uY2F0KG9icyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICB0aGlzLl9kYXRhLnB1c2gob2JzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIHBocmFzZSdzIGRhdGEgc28gdGhhdCBhIG5ldyBvbmUgaXMgcmVhZHkgdG8gYmUgcmVjb3JkZWQuXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9kYXRhID0gW107XG4gICAgdGhpcy5fZGF0YUluID0gW107XG4gICAgdGhpcy5fZGF0YU91dCA9IFtdO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIF9zZXRDb25maWcob3B0aW9ucyA9IHt9KSB7XG4gICAgZm9yIChsZXQgcHJvcCBpbiBvcHRpb25zKSB7XG4gICAgICBpZiAocHJvcCA9PT0gJ2JpbW9kYWwnICYmIHR5cGVvZihvcHRpb25zW3Byb3BdKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ1twcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gICAgICB9IGVsc2UgaWYgKHByb3AgPT09ICdkaW1lbnNpb24nICYmIE51bWJlci5pc0ludGVnZXIob3B0aW9uc1twcm9wXSkpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnW3Byb3BdID0gb3B0aW9uc1twcm9wXTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2RpbWVuc2lvbklucHV0JyAmJiBOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnNbcHJvcF0pKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ1twcm9wXSA9IG9wdGlvbnNbcHJvcF07XG4gICAgICB9IGVsc2UgaWYgKHByb3AgPT09ICdjb2x1bW5OYW1lcycgJiYgQXJyYXkuaXNBcnJheShvcHRpb25zW3Byb3BdKSkge1xuICAgICAgICB0aGlzLl9jb25maWdbcHJvcF0gPSBvcHRpb25zW3Byb3BdLnNsaWNlKDApO1xuICAgICAgfSBlbHNlIGlmIChwcm9wID09PSAnbGFiZWwnICYmIHR5cGVvZihvcHRpb25zW3Byb3BdKSA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgdGhpcy5fY29uZmlnW3Byb3BdID0gb3B0aW9uc1twcm9wXTtcbiAgICAgIH1cbiAgICB9ICAgXG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFBocmFzZU1ha2VyOyIsIi8vIEFuIHhtbS1jb21wYXRpYmxlIHRyYWluaW5nIHNldCBtdXN0IGhhdmUgdGhlIGZvbGxvd2luZyBmaWVsZHMgOlxuLy8gLSBiaW1vZGFsIChib29sZWFuKVxuLy8gLSBjb2x1bW5fbmFtZXMgKGFycmF5IG9mIHN0cmluZ3MpXG4vLyAtIGRpbWVuc2lvbiAoaW50ZWdlcilcbi8vIC0gZGltZW5zaW9uX2lucHV0IChpbnRlZ2VyIDwgZGltZW5zaW9uKVxuLy8gLSBwaHJhc2VzIChhcnJheSBvZiBwaHJhc2VzKVxuLy8gICAtIG9uIGV4cG9ydCwgZWFjaCBwaHJhc2UgbXVzdCBoYXZlIGFuIGV4dHJhIFwiaW5kZXhcIiBmaWVsZFxuLy8gICAgID0+IHdoZW4gdGhlIGNsYXNzIHJldHVybnMgYSBzZXQgd2l0aCBnZXRQaHJhc2VzT2ZMYWJlbCBvciBnZXRUcmFpbmluZ1NldCxcbi8vICAgICAgICBpdCBzaG91bGQgYWRkIHRoZXNlIGluZGV4IGZpZWxkcyBiZWZvcmUgcmV0dXJuaW5nIHRoZSByZXN1bHQuXG4vLyAgICAgPT4gd2hlbiBhIHNldCBpcyBhZGRlZCB3aXRoIGFkZFRyYWluaW5nU2V0LCB0aGUgaW5kZXhlcyBtdXN0IGJlIHJlbW92ZWRcbi8vICAgICAgICBmcm9tIHRoZSBwaHJhc2VzIGJlZm9yZSB0aGV5IGFyZSBhZGRlZCB0byB0aGUgaW50ZXJuYWwgYXJyYXlcblxuLyoqXG4gKiBYTU0gY29tcGF0aWJsZSB0cmFpbmluZyBzZXQgbWFuYWdlciB1dGlsaXR5IDxiciAvPlxuICogQ2xhc3MgdG8gZWFzZSB0aGUgY3JlYXRpb24gb2YgWE1NIGNvbXBhdGlibGUgdHJhaW5pbmcgc2V0cy4gPGJyIC8+XG4gKiBQaHJhc2VzIHNob3VsZCBiZSBnZW5lcmF0ZWQgd2l0aCB0aGUgUGhyYXNlTWFrZXIgY2xhc3Mgb3IgdGhlIG9yaWdpbmFsIFhNTSBsaWJyYXJ5LlxuICovXG5jbGFzcyBTZXRNYWtlciB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHRoaXMuX2NvbmZpZyA9IHt9O1xuICAgIHRoaXMuX3BocmFzZXMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBUaGUgY3VycmVudCB0b3RhbCBudW1iZXIgb2YgcGhyYXNlcyBpbiB0aGUgc2V0LlxuICAgKiBAcmVhZG9ubHlcbiAgICovXG4gIGdldCBzaXplKCkge1xuICAgIHJldHVybiB0aGlzLl9waHJhc2VzLmxlbmd0aDtcbiAgfVxuXG4gIC8qKlxuICAgKiBBZGQgYW4gWE1NIHBocmFzZSB0byB0aGUgY3VycmVudCBzZXQuXG4gICAqIEBwYXJhbSB7WG1tUGhyYXNlfSBwaHJhc2UgLSBBbiBYTU0gY29tcGF0aWJsZSBwaHJhc2UgKGllIGNyZWF0ZWQgd2l0aCB0aGUgUGhyYXNlTWFrZXIgY2xhc3MpXG4gICAqL1xuICBhZGRQaHJhc2UocGhyYXNlKSB7XG4gICAgaWYgKHRoaXMuX3BocmFzZXMubGVuZ3RoID09PSAwKSB7XG4gICAgICB0aGlzLl9zZXRDb25maWdGcm9tKHBocmFzZSk7XG4gICAgfSBlbHNlIGlmICghdGhpcy5fY2hlY2tDb21wYXRpYmlsaXR5KHBocmFzZSkpIHtcbiAgICAgIHRocm93IG5ldyBFcnJvcignQmFkIHBocmFzZSBmb3JtYXQ6IGFkZGVkIHBocmFzZSBtdXN0IG1hdGNoIGN1cnJlbnQgc2V0IGNvbmZpZ3VyYXRpb24nKTtcbiAgICB9XG4gICAgdGhpcy5fcGhyYXNlcy5wdXNoKHBocmFzZSk7XG4gIH1cblxuICAvKipcbiAgICogQWRkIGFsbCBwaHJhc2VzIGZyb20gYW5vdGhlciB0cmFpbmluZyBzZXQuXG4gICAqIEBwYXJhbSB7WG1tVHJhaW5pbmdTZXR9IHNldCAtIEFuIFhNTSBjb21wYXRpYmxlIHRyYWluaW5nIHNldC5cbiAgICovXG4gIGFkZFRyYWluaW5nU2V0KHNldCkge1xuICAgIGlmICh0aGlzLl9waHJhc2VzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgdGhpcy5fc2V0Q29uZmlnRnJvbShzZXQpO1xuICAgIH0gZWxzZSBpZiAoIXRoaXMuX2NoZWNrQ29tcGF0aWJpbGl0eShzZXQpKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ0JhZCBzZXQgZm9ybWF0OiBhZGRlZCBzZXQgbXVzdCBtYXRjaCBjdXJyZW50IHNldCBjb25maWd1cmF0aW9uJyk7XG4gICAgfVxuXG4gICAgY29uc3QgcGhyYXNlcyA9IHNldFsncGhyYXNlcyddO1xuICAgIGZvciAobGV0IHBocmFzZSBvZiBwaHJhc2VzKSB7XG4gICAgICB0aGlzLl9waHJhc2VzLnB1c2gocGhyYXNlKTtcbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogR2V0IHBocmFzZSBhdCBhIHBhcnRpY3VsYXIgaW5kZXguXG4gICAqIEBwYXJhbSB7TnVtYmVyfSBpbmRleCAtIFRoZSBpbmRleCBvZiB0aGUgcGhyYXNlIHRvIHJldHJpZXZlLlxuICAgKiBAcmV0dXJucyB7WG1tUGhyYXNlfVxuICAgKi9cbiAgZ2V0UGhyYXNlKGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID4gLTEgJiYgaW5kZXggPCB0aGlzLl9waHJhc2VzLmxlbmd0aCkge1xuICAgICAgLy8gcmV0dXJuIGEgbmV3IGNvcHkgb2YgdGhlIHBocmFzZSA6XG4gICAgICByZXR1cm4gSlNPTi5wYXJzZShKU09OLnNydGluZ2lmeSh0aGlzLl9waHJhc2VzW2luZGV4XSkpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgcGhyYXNlIGF0IGEgcGFydGljdWxhciBpbmRleC5cbiAgICogQHBhcmFtIHtOdW1iZXJ9IGluZGV4IC0gVGhlIGluZGV4IG9mIHRoZSBwaHJhc2UgdG8gcmVtb3ZlLlxuICAgKi9cbiAgcmVtb3ZlUGhyYXNlKGluZGV4KSB7XG4gICAgaWYgKGluZGV4ID4gLTEgJiYgaW5kZXggPCB0aGlzLl9waHJhc2VzLmxlbmd0aCkge1xuICAgICAgdGhpcy5fcGhyYXNlcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIHN1YnNldCBvZiBwaHJhc2VzIG9mIGEgcGFydGljdWxhciBsYWJlbC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gVGhlIGxhYmVsIG9mIHRoZSBwaHJhc2VzIGZyb20gd2hpY2ggdG8gZ2VuZXJhdGUgdGhlIHN1Yi10cmFpbmluZyBzZXQuXG4gICAqIEByZXR1cm5zIHtYbW1UcmFpbmluZ1NldH1cbiAgICovXG4gIGdldFBocmFzZXNPZkxhYmVsKGxhYmVsKSB7XG4gICAgY29uc3QgcmVzID0ge307XG5cbiAgICBmb3IgKGxldCBwcm9wIGluIHRoaXMuX2NvbmZpZykge1xuICAgICAgcmVzW3Byb3BdID0gdGhpcy5fY29uZmlnW3Byb3BdO1xuICAgIH1cblxuICAgIHJlc1sncGhyYXNlcyddID0gW107XG4gICAgbGV0IGluZGV4ID0gMDtcblxuICAgIGZvciAobGV0IHBocmFzZSBvZiB0aGlzLl9waHJhc2VzKSB7XG4gICAgICBpZiAocGhyYXNlWydsYWJlbCddID09PSBsYWJlbCkge1xuICAgICAgICBsZXQgcCA9IEpTT04ucGFyc2UoSlNPTi5zdHJpbmdpZnkocGhyYXNlKSk7XG4gICAgICAgIHBbJ2luZGV4J10gPSBpbmRleCsrO1xuICAgICAgICByZXNbJ3BocmFzZXMnXS5wdXNoKHApO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGFsbCBwaHJhc2VzIG9mIGEgcGFydGljdWxhciBsYWJlbC5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gVGhlIGxhYmVsIG9mIHRoZSBwaHJhc2VzIHRvIHJlbW92ZS5cbiAgICovXG4gIHJlbW92ZVBocmFzZXNPZkxhYmVsKGxhYmVsKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9waHJhc2VzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBpZiAodGhpcy5fcGhyYXNlc1tpXVsnbGFiZWwnXSA9PT0gbGFiZWwpIHtcbiAgICAgICAgdGhpcy5waHJhc2VzLnNwbGljZShpLCAxKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBjdXJyZW50IHRyYWluaW5nIHNldC5cbiAgICogQHJldHVybnMge1RyYWluaW5nU2V0fVxuICAgKi9cbiAgZ2V0VHJhaW5pbmdTZXQoKSB7XG4gICAgbGV0IHJlcyA9IHt9O1xuXG4gICAgZm9yIChsZXQgcHJvcCBpbiB0aGlzLl9jb25maWcpIHtcbiAgICAgIHJlc1twcm9wXSA9IHRoaXMuX2NvbmZpZ1twcm9wXTtcbiAgICB9XG5cbiAgICByZXNbJ3BocmFzZXMnXSA9IFtdO1xuICAgIGxldCBpbmRleCA9IDA7XG5cbiAgICBmb3IgKGxldCBwaHJhc2Ugb2YgdGhpcy5fcGhyYXNlcykge1xuICAgICAgbGV0IHAgPSBKU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KHBocmFzZSkpO1xuICAgICAgcFsnaW5kZXgnXSA9IGluZGV4Kys7XG4gICAgICByZXNbJ3BocmFzZXMnXS5wdXNoKHApO1xuICAgIH1cblxuICAgIHJldHVybiByZXM7XG4gIH1cblxuICAvKipcbiAgICogQ2xlYXIgdGhlIHdob2xlIHNldC5cbiAgICovXG4gIGNsZWFyKCkge1xuICAgIHRoaXMuX2NvbmZpZyA9IHt9O1xuICAgIHRoaXMuX3BocmFzZXMgPSBbXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDaGVjayB0aGUgY29uZmlnIG9mIGEgcGhyYXNlIG9yIHRyYWluaW5nIHNldCBiZWZvcmUgYXBwbHlpbmcgaXRcbiAgICogdG8gdGhlIGN1cnJlbnQgY2xhc3MuXG4gICAqIFRocm93IGVycm9ycyBpZiBub3QgdmFsaWQgP1xuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX3NldENvbmZpZ0Zyb20ob2JqKSB7XG4gICAgZm9yIChsZXQgcHJvcCBpbiBvYmopIHtcbiAgICAgIGlmIChwcm9wID09PSAnYmltb2RhbCcgJiYgdHlwZW9mKG9ialsnYmltb2RhbCddKSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ1twcm9wXSA9IG9ialtwcm9wXTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2NvbHVtbl9uYW1lcycgJiYgQXJyYXkuaXNBcnJheShvYmpbcHJvcF0pKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ1twcm9wXSA9IG9ialtwcm9wXS5zbGljZSgwKTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2RpbWVuc2lvbicgJiYgTnVtYmVyLmlzSW50ZWdlcihvYmpbcHJvcF0pKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ1twcm9wXSA9IG9ialtwcm9wXTtcbiAgICAgIH0gZWxzZSBpZiAocHJvcCA9PT0gJ2RpbWVuc2lvbl9pbnB1dCcgJiYgTnVtYmVyLmlzSW50ZWdlcihvYmpbcHJvcF0pKSB7XG4gICAgICAgIHRoaXMuX2NvbmZpZ1twcm9wXSA9IG9ialtwcm9wXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ2hlY2sgaWYgdGhlIHBocmFzZSBvciBzZXQgaXMgY29tcGF0aWJsZSB3aXRoIHRoZSBjdXJyZW50IHNldHRpbmdzLlxuICAgKiBAcHJpdmF0ZVxuICAgKi9cbiAgX2NoZWNrQ29tcGF0aWJpbGl0eShvYmopIHtcbiAgICBpZiAob2JqWydiaW1vZGFsJ10gIT09IHRoaXMuX2NvbmZpZ1snYmltb2RhbCddXG4gICAgICB8fCBvYmpbJ2RpbWVuc2lvbiddICE9PSB0aGlzLl9jb25maWdbJ2RpbWVuc2lvbiddXG4gICAgICB8fCBvYmpbJ2RpbWVuc2lvbl9pbnB1dCddICE9PSB0aGlzLl9jb25maWdbJ2RpbWVuc2lvbl9pbnB1dCddKSB7XG4gICAgICByZXR1cm4gZmFsc2U7XG4gICAgfVxuXG4gICAgY29uc3Qgb2NuID0gb2JqWydjb2x1bW5fbmFtZXMnXTtcbiAgICBjb25zdCBjY24gPSB0aGlzLl9jb25maWdbJ2NvbHVtbl9uYW1lcyddO1xuXG4gICAgaWYgKG9jbi5sZW5ndGggIT09IGNjbi5sZW5ndGgpIHtcbiAgICAgIHJldHVybiBmYWxzZTtcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBvY24ubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgaWYgKG9jbltpXSAhPT0gY2NuW2ldKSB7XG4gICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuXG4gICAgcmV0dXJuIHRydWU7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IFNldE1ha2VyOyIsIi8qKlxuICogIGZ1bmN0aW9ucyB1c2VkIGZvciBkZWNvZGluZywgdHJhbnNsYXRlZCBmcm9tIFhNTVxuICovXG5cbi8vIFRPRE8gOiB3cml0ZSBtZXRob2RzIGZvciBnZW5lcmF0aW5nIG1vZGVsUmVzdWx0cyBvYmplY3RcblxuLy8gZ2V0IHRoZSBpbnZlcnNlX2NvdmFyaWFuY2VzIG1hdHJpeCBvZiBlYWNoIG9mIHRoZSBHTU0gY2xhc3Nlc1xuLy8gZm9yIGVhY2ggaW5wdXQgZGF0YSwgY29tcHV0ZSB0aGUgZGlzdGFuY2Ugb2YgdGhlIGZyYW1lIHRvIGVhY2ggb2YgdGhlIEdNTXNcbi8vIHdpdGggdGhlIGZvbGxvd2luZyBlcXVhdGlvbnMgOlxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8vIGFzIGluIHhtbUdhdXNzaWFuRGlzdHJpYnV0aW9uLmNwcCAvL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cblxuLy8gZnJvbSB4bW1HYXVzc2lhbkRpc3RyaWJ1dGlvbjo6cmVncmVzc2lvblxuZXhwb3J0IGNvbnN0IGdtbUNvbXBvbmVudFJlZ3Jlc3Npb24gPSAob2JzSW4sIHByZWRpY3RPdXQsIGMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBnbW1Db21wb25lbnRSZWdyZXNzaW9uID0gKG9ic0luLCBwcmVkaWN0T3V0LCBjb21wb25lbnQpID0+IHtcbi8vICAgY29uc3QgYyA9IGNvbXBvbmVudDtcbiAgY29uc3QgZGltID0gYy5kaW1lbnNpb247XG4gIGNvbnN0IGRpbUluID0gYy5kaW1lbnNpb25faW5wdXQ7XG4gIGNvbnN0IGRpbU91dCA9IGRpbSAtIGRpbUluO1xuICAvL2xldCBwcmVkaWN0ZWRPdXQgPSBbXTtcbiAgcHJlZGljdE91dCA9IG5ldyBBcnJheShkaW1PdXQpO1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICBpZiAoYy5jb3ZhcmlhbmNlX21vZGUgPT09IDApIHtcbiAgICBmb3IgKGxldCBkID0gMDsgZCA8IGRpbU91dDsgZCsrKSB7XG4gICAgICBwcmVkaWN0T3V0W2RdID0gYy5tZWFuW2RpbUluICsgZF07XG4gICAgICBmb3IgKGxldCBlID0gMDsgZSA8IGRpbUluOyBlKyspIHtcbiAgICAgICAgbGV0IHRtcCA9IDAuMDtcbiAgICAgICAgZm9yIChsZXQgZiA9IDA7IGYgPCBkaW1JbjsgZisrKSB7XG4gICAgICAgICAgdG1wICs9IGMuaW52ZXJzZV9jb3ZhcmlhbmNlX2lucHV0W2UgKiBkaW1JbiArIGZdICpcbiAgICAgICAgICAgICAgIChvYnNJbltmXSAtIGMubWVhbltmXSk7XG4gICAgICAgIH1cbiAgICAgICAgcHJlZGljdE91dFtkXSArPSBjLmNvdmFyaWFuY2VbKGQgKyBkaW1JbikgKiBkaW0gKyBlXSAqIHRtcDtcbiAgICAgIH1cbiAgICB9XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFnb25hbFxuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGQgPSAwOyBkIDwgZGltT3V0OyBkKyspIHtcbiAgICAgIHByZWRpY3RPdXRbZF0gPSBjLmNvdmFyaWFuY2VbZCArIGRpbUluXTtcbiAgICB9XG4gIH1cbiAgLy9yZXR1cm4gcHJlZGljdGlvbk91dDtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGdtbUNvbXBvbmVudExpa2VsaWhvb2QgPSAob2JzSW4sIGMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBnbW1Db21wb25lbnRMaWtlbGlob29kID0gKG9ic0luLCBjb21wb25lbnQpID0+IHtcbi8vICAgY29uc3QgYyA9IGNvbXBvbmVudDtcbiAgLy8gaWYoYy5jb3ZhcmlhbmNlX2RldGVybWluYW50ID09PSAwKSB7XG4gIC8vICByZXR1cm4gdW5kZWZpbmVkO1xuICAvLyB9XG4gIGxldCBldWNsaWRpYW5EaXN0YW5jZSA9IDAuMDtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZ1bGxcbiAgaWYgKGMuY292YXJpYW5jZV9tb2RlID09PSAwKSB7XG4gICAgZm9yIChsZXQgbCA9IDA7IGwgPCBjLmRpbWVuc2lvbjsgbCsrKSB7XG4gICAgICBsZXQgdG1wID0gMC4wO1xuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjLmRpbWVuc2lvbjsgaysrKSB7XG4gICAgICAgIHRtcCArPSBjLmludmVyc2VfY292YXJpYW5jZVtsICogYy5kaW1lbnNpb24gKyBrXVxuICAgICAgICAgICogKG9ic0luW2tdIC0gYy5tZWFuW2tdKTtcbiAgICAgIH1cbiAgICAgIGV1Y2xpZGlhbkRpc3RhbmNlICs9IChvYnNJbltsXSAtIGMubWVhbltsXSkgKiB0bXA7XG4gICAgfVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBsID0gMDsgbCA8IGMuZGltZW5zaW9uOyBsKyspIHtcbiAgICAgIGV1Y2xpZGlhbkRpc3RhbmNlICs9IGMuaW52ZXJzZV9jb3ZhcmlhbmNlW2xdICpcbiAgICAgICAgICAgICAgICAgKG9ic0luW2xdIC0gYy5tZWFuW2xdKSAqXG4gICAgICAgICAgICAgICAgIChvYnNJbltsXSAtIGMubWVhbltsXSk7XG4gICAgfVxuICB9XG5cbiAgbGV0IHAgPSBNYXRoLmV4cCgtMC41ICogZXVjbGlkaWFuRGlzdGFuY2UpIC9cbiAgICAgIE1hdGguc3FydChcbiAgICAgICAgYy5jb3ZhcmlhbmNlX2RldGVybWluYW50ICpcbiAgICAgICAgTWF0aC5wb3coMiAqIE1hdGguUEksIGMuZGltZW5zaW9uKVxuICAgICAgKTtcblxuICBpZiAocCA8IDFlLTE4MCB8fCBpc05hTihwKSB8fCBpc05hTihNYXRoLmFicyhwKSkpIHtcbiAgICBwID0gMWUtMTgwO1xuICB9XG4gIHJldHVybiBwO1xufTtcblxuXG5leHBvcnQgY29uc3QgZ21tQ29tcG9uZW50TGlrZWxpaG9vZElucHV0ID0gKG9ic0luLCBjKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgZ21tQ29tcG9uZW50TGlrZWxpaG9vZElucHV0ID0gKG9ic0luLCBjb21wb25lbnQpID0+IHtcbi8vICAgY29uc3QgYyA9IGNvbXBvbmVudDtcbiAgLy8gaWYoYy5jb3ZhcmlhbmNlX2RldGVybWluYW50ID09PSAwKSB7XG4gIC8vICByZXR1cm4gdW5kZWZpbmVkO1xuICAvLyB9XG4gIGxldCBldWNsaWRpYW5EaXN0YW5jZSA9IDAuMDtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gIGlmIChjLmNvdmFyaWFuY2VfbW9kZSA9PT0gMCkge1xuICAgIGZvciAobGV0IGwgPSAwOyBsIDwgYy5kaW1lbnNpb25faW5wdXQ7IGwrKykge1xuICAgICAgbGV0IHRtcCA9IDAuMDtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYy5kaW1lbnNpb25faW5wdXQ7IGsrKykge1xuICAgICAgICB0bXAgKz0gYy5pbnZlcnNlX2NvdmFyaWFuY2VfaW5wdXRbbCAqIGMuZGltZW5zaW9uX2lucHV0ICsga10gKlxuICAgICAgICAgICAgIChvYnNJbltrXSAtIGMubWVhbltrXSk7XG4gICAgICB9XG4gICAgICBldWNsaWRpYW5EaXN0YW5jZSArPSAob2JzSW5bbF0gLSBjLm1lYW5bbF0pICogdG1wO1xuICAgIH1cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgbCA9IDA7IGwgPCBjLmRpbWVuc2lvbl9pbnB1dDsgbCsrKSB7XG4gICAgICAvLyBvciB3b3VsZCBpdCBiZSBjLmludmVyc2VfY292YXJpYW5jZV9pbnB1dFtsXSA/XG4gICAgICAvLyBzb3VuZHMgbG9naWMgLi4uIGJ1dCwgYWNjb3JkaW5nIHRvIEp1bGVzIChjZiBlLW1haWwpLFxuICAgICAgLy8gbm90IHJlYWxseSBpbXBvcnRhbnQuXG4gICAgICBldWNsaWRpYW5EaXN0YW5jZSArPSBjLmludmVyc2VfY292YXJpYW5jZV9pbnB1dFtsXSAqXG4gICAgICAgICAgICAgICAgIChvYnNJbltsXSAtIGMubWVhbltsXSkgKlxuICAgICAgICAgICAgICAgICAob2JzSW5bbF0gLSBjLm1lYW5bbF0pO1xuICAgIH1cbiAgfVxuXG4gIGxldCBwID0gTWF0aC5leHAoLTAuNSAqIGV1Y2xpZGlhbkRpc3RhbmNlKSAvXG4gICAgICBNYXRoLnNxcnQoXG4gICAgICAgIGMuY292YXJpYW5jZV9kZXRlcm1pbmFudF9pbnB1dCAqXG4gICAgICAgIE1hdGgucG93KDIgKiBNYXRoLlBJLCBjLmRpbWVuc2lvbl9pbnB1dClcbiAgICAgICk7XG5cbiAgaWYgKHAgPCAxZS0xODAgfHxpc05hTihwKSB8fCBpc05hTihNYXRoLmFicyhwKSkpIHtcbiAgICBwID0gMWUtMTgwO1xuICB9XG4gIHJldHVybiBwO1xufTtcblxuXG5leHBvcnQgY29uc3QgZ21tQ29tcG9uZW50TGlrZWxpaG9vZEJpbW9kYWwgPSAob2JzSW4sIG9ic091dCwgYykgPT4ge1xuLy8gZXhwb3J0IGNvbnN0IGdtbUNvbXBvbmVudExpa2VsaWhvb2RCaW1vZGFsID0gKG9ic0luLCBvYnNPdXQsIGNvbXBvbmVudCkgPT4ge1xuLy8gICBjb25zdCBjID0gY29tcG9uZW50O1xuICAvLyBpZihjLmNvdmFyaWFuY2VfZGV0ZXJtaW5hbnQgPT09IDApIHtcbiAgLy8gIHJldHVybiB1bmRlZmluZWQ7XG4gIC8vIH1cbiAgY29uc3QgZGltID0gYy5kaW1lbnNpb247XG4gIGNvbnN0IGRpbUluID0gYy5kaW1lbnNpb25faW5wdXQ7XG4gIGNvbnN0IGRpbU91dCA9IGRpbSAtIGRpbUluO1xuICBsZXQgZXVjbGlkaWFuRGlzdGFuY2UgPSAwLjA7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gIGlmIChjLmNvdmFyaWFuY2VfbW9kZSA9PT0gMCkge1xuICAgIGZvciAobGV0IGwgPSAwOyBsIDwgZGltOyBsKyspIHtcbiAgICAgIGxldCB0bXAgPSAwLjA7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IGMuZGltZW5zaW9uX2lucHV0OyBrKyspIHtcbiAgICAgICAgdG1wICs9IGMuaW52ZXJzZV9jb3ZhcmlhbmNlW2wgKiBkaW0gKyBrXSAqXG4gICAgICAgICAgICAgKG9ic0luW2tdIC0gYy5tZWFuW2tdKTtcbiAgICAgIH1cbiAgICAgIGZvciAobGV0IGsgPSAgMDsgayA8IGRpbU91dDsgaysrKSB7XG4gICAgICAgIHRtcCArPSBjLmludmVyc2VfY292YXJpYW5jZVtsICogZGltICsgZGltSW4gKyBrXSAqXG4gICAgICAgICAgICAgKG9ic091dFtrXSAtIGMubWVhbltkaW1JbiAra10pO1xuICAgICAgfVxuICAgICAgaWYgKGwgPCBkaW1Jbikge1xuICAgICAgICBldWNsaWRpYW5EaXN0YW5jZSArPSAob2JzSW5bbF0gLSBjLm1lYW5bbF0pICogdG1wO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgZXVjbGlkaWFuRGlzdGFuY2UgKz0gKG9ic091dFtsIC0gZGltSW5dIC0gYy5tZWFuW2xdKSAqXG4gICAgICAgICAgICAgICAgICAgdG1wO1xuICAgICAgfVxuICAgIH1cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgbCA9IDA7IGwgPCBkaW1JbjsgbCsrKSB7XG4gICAgICBldWNsaWRpYW5EaXN0YW5jZSArPSBjLmludmVyc2VfY292YXJpYW5jZVtsXSAqXG4gICAgICAgICAgICAgICAgIChvYnNJbltsXSAtIGMubWVhbltsXSkgKlxuICAgICAgICAgICAgICAgICAob2JzSW5bbF0gLSBjLm1lYW5bbF0pO1xuICAgIH1cbiAgICBmb3IgKGxldCBsID0gYy5kaW1lbnNpb25faW5wdXQ7IGwgPCBjLmRpbWVuc2lvbjsgbCsrKSB7XG4gICAgICBsZXQgc3EgPSAob2JzT3V0W2wgLSBkaW1Jbl0gLSBjLm1lYW5bbF0pICpcbiAgICAgICAgICAgKG9ic091dFtsIC0gZGltSW5dIC0gYy5tZWFuW2xdKTtcbiAgICAgIGV1Y2xpZGlhbkRpc3RhbmNlICs9IGMuaW52ZXJzZV9jb3ZhcmlhbmNlW2xdICogc3E7XG4gICAgfVxuICB9XG5cbiAgbGV0IHAgPSBNYXRoLmV4cCgtMC41ICogZXVjbGlkaWFuRGlzdGFuY2UpIC9cbiAgICAgIE1hdGguc3FydChcbiAgICAgICAgYy5jb3ZhcmlhbmNlX2RldGVybWluYW50ICpcbiAgICAgICAgTWF0aC5wb3coMiAqIE1hdGguUEksIGMuZGltZW5zaW9uKVxuICAgICAgKTtcblxuICBpZiAocCA8IDFlLTE4MCB8fCBpc05hTihwKSB8fCBpc05hTihNYXRoLmFicyhwKSkpIHtcbiAgICBwID0gMWUtMTgwO1xuICB9XG4gIHJldHVybiBwO1xufTtcblxuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8vICAgIGFzIGluIHhtbUdtbVNpbmdsZUNsYXNzLmNwcCAgICAvL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmV4cG9ydCBjb25zdCBnbW1SZWdyZXNzaW9uID0gKG9ic0luLCBtLCBtUmVzKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgZ21tUmVncmVzc2lvbiA9IChvYnNJbiwgc2luZ2xlR21tLCBzaW5nbGVHbW1SZXMpID0+IHtcbi8vICAgY29uc3QgbSA9IHNpbmdsZUdtbTtcbi8vICAgY29uc3QgbVJlcyA9IHNpbmdsZUdtbVJlc3VsdHM7XG5cbiAgY29uc3QgZGltID0gbS5jb21wb25lbnRzWzBdLmRpbWVuc2lvbjtcbiAgY29uc3QgZGltSW4gPSBtLmNvbXBvbmVudHNbMF0uZGltZW5zaW9uX2lucHV0O1xuICBjb25zdCBkaW1PdXQgPSBkaW0gLSBkaW1JbjtcblxuICBtUmVzLm91dHB1dF92YWx1ZXMgPSBuZXcgQXJyYXkoZGltT3V0KTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1PdXQ7IGkrKykge1xuICAgIG1SZXMub3V0cHV0X3ZhbHVlc1tpXSA9IDAuMDtcbiAgfVxuXG4gIGxldCBvdXRDb3ZhclNpemU7XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICBpZiAobS5wYXJhbWV0ZXJzLmNvdmFyaWFuY2VfbW9kZSA9PT0gMCkge1xuICAgIG91dENvdmFyU2l6ZSA9IGRpbU91dCAqIGRpbU91dDtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gIH0gZWxzZSB7XG4gICAgb3V0Q292YXJTaXplID0gZGltT3V0O1xuICB9XG4gIG1SZXMub3V0cHV0X2NvdmFyaWFuY2UgPSBuZXcgQXJyYXkob3V0Q292YXJTaXplKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRDb3ZhclNpemU7IGkrKykge1xuICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbaV0gPSAwLjA7XG4gIH1cblxuICAvKlxuICAvLyB1c2VsZXNzIDogcmVpbnN0YW5jaWF0ZWQgaW4gZ21tQ29tcG9uZW50UmVncmVzc2lvblxuICBsZXQgdG1wUHJlZGljdGVkT3V0cHV0ID0gbmV3IEFycmF5KGRpbU91dCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGltT3V0OyBpKyspIHtcbiAgICB0bXBQcmVkaWN0ZWRPdXRwdXRbaV0gPSAwLjA7XG4gIH1cbiAgKi9cbiAgbGV0IHRtcFByZWRpY3RlZE91dHB1dDtcblxuICBmb3IgKGxldCBjID0gMDsgYyA8IG0uY29tcG9uZW50cy5sZW5ndGg7IGMrKykge1xuICAgIGdtbUNvbXBvbmVudFJlZ3Jlc3Npb24oXG4gICAgICBvYnNJbiwgdG1wUHJlZGljdGVkT3V0cHV0LCBtLmNvbXBvbmVudHNbY11cbiAgICApO1xuICAgIGxldCBzcWJldGEgPSBtUmVzLmJldGFbY10gKiBtUmVzLmJldGFbY107XG4gICAgZm9yIChsZXQgZCA9IDA7IGQgPCBkaW1PdXQ7IGQrKykge1xuICAgICAgbVJlcy5vdXRwdXRfdmFsdWVzW2RdICs9IG1SZXMuYmV0YVtjXSAqIHRtcFByZWRpY3RlZE91dHB1dFtkXTtcbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gICAgICBpZiAobS5wYXJhbWV0ZXJzLmNvdmFyaWFuY2VfbW9kZSA9PT0gMCkge1xuICAgICAgICBmb3IgKGxldCBkMiA9IDA7IGQyIDwgZGltT3V0OyBkMisrKSB7XG4gICAgICAgICAgbGV0IGluZGV4ID0gZCAqIGRpbU91dCArIGQyO1xuICAgICAgICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbaW5kZXhdXG4gICAgICAgICAgICArPSBzcWJldGEgKiBtLmNvbXBvbmVudHNbY10ub3V0cHV0X2NvdmFyaWFuY2VbaW5kZXhdO1xuICAgICAgICB9XG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFnb25hbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbVJlcy5vdXRwdXRfY292YXJpYW5jZVtkXVxuICAgICAgICAgICs9IHNxYmV0YSAqIG0uY29tcG9uZW50c1tjXS5vdXRwdXRfY292YXJpYW5jZVtkXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblxuZXhwb3J0IGNvbnN0IGdtbU9ic1Byb2IgPSAob2JzSW4sIHNpbmdsZUdtbSwgY29tcG9uZW50ID0gLTEpID0+IHtcbiAgY29uc3QgY29lZmZzID0gc2luZ2xlR21tLm1peHR1cmVfY29lZmZzO1xuICAvL2NvbnNvbGUubG9nKGNvZWZmcyk7XG4gIC8vaWYoY29lZmZzID09PSB1bmRlZmluZWQpIGNvZWZmcyA9IFsxXTtcbiAgY29uc3QgY29tcG9uZW50cyA9IHNpbmdsZUdtbS5jb21wb25lbnRzO1xuICBsZXQgcCA9IDAuMDtcblxuICBpZiAoY29tcG9uZW50IDwgMCkge1xuICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29tcG9uZW50cy5sZW5ndGg7IGMrKykge1xuICAgICAgcCArPSBnbW1PYnNQcm9iKG9ic0luLCBzaW5nbGVHbW0sIGMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwID0gY29lZmZzW2NvbXBvbmVudF0gKlxuICAgICAgZ21tQ29tcG9uZW50TGlrZWxpaG9vZChvYnNJbiwgY29tcG9uZW50c1tjb21wb25lbnRdKTsgICAgICAgXG4gIH1cbiAgcmV0dXJuIHA7XG59O1xuXG5cbmV4cG9ydCBjb25zdCBnbW1PYnNQcm9iSW5wdXQgPSAob2JzSW4sIHNpbmdsZUdtbSwgY29tcG9uZW50ID0gLTEpID0+IHtcbiAgY29uc3QgY29lZmZzID0gc2luZ2xlR21tLm1peHR1cmVfY29lZmZzO1xuICBjb25zdCBjb21wb25lbnRzID0gc2luZ2xlR21tLmNvbXBvbmVudHM7XG4gIGxldCBwID0gMC4wO1xuXG4gIGlmIChjb21wb25lbnQgPCAwKSB7XG4gICAgZm9yKGxldCBjID0gMDsgYyA8IGNvbXBvbmVudHMubGVuZ3RoOyBjKyspIHtcbiAgICAgIHAgKz0gZ21tT2JzUHJvYklucHV0KG9ic0luLCBzaW5nbGVHbW0sIGMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwID0gY29lZmZzW2NvbXBvbmVudF0gKlxuICAgICAgZ21tQ29tcG9uZW50TGlrZWxpaG9vZElucHV0KG9ic0luLCBjb21wb25lbnRzW2NvbXBvbmVudF0pOyAgICAgIFxuICB9XG4gIHJldHVybiBwO1xufTtcblxuXG5leHBvcnQgY29uc3QgZ21tT2JzUHJvYkJpbW9kYWwgPSAob2JzSW4sIG9ic091dCwgc2luZ2xlR21tLCBjb21wb25lbnQgPSAtMSkgPT4ge1xuICBjb25zdCBjb2VmZnMgPSBzaW5nbGVHbW0ubWl4dHVyZV9jb2VmZnM7XG4gIGNvbnN0IGNvbXBvbmVudHMgPSBzaW5nbGVHbW0uY29tcG9uZW50cztcbiAgbGV0IHAgPSAwLjA7XG5cbiAgaWYgKGNvbXBvbmVudCA8IDApIHtcbiAgICBmb3IgKGxldCBjID0gMDsgYyA8IGNvbXBvbmVudHMubGVuZ3RoOyBjKyspIHtcbiAgICAgIHAgKz0gZ21tT2JzUHJvYkJpbW9kYWwob2JzSW4sIG9ic091dCwgc2luZ2xlR21tLCBjKTtcbiAgICB9XG4gIH0gZWxzZSB7XG4gICAgcCA9IGNvZWZmc1tjb21wb25lbnRdICpcbiAgICAgIGdtbUNvbXBvbmVudExpa2VsaWhvb2RCaW1vZGFsKG9ic0luLCBvYnNPdXQsIGNvbXBvbmVudHNbY29tcG9uZW50XSk7XG4gIH1cbiAgcmV0dXJuIHA7XG59O1xuXG5cbmV4cG9ydCBjb25zdCBnbW1MaWtlbGlob29kID0gKG9ic0luLCBzaW5nbGVHbW0sIHNpbmdsZUdtbVJlcywgb2JzT3V0ID0gW10pID0+IHtcbiAgY29uc3QgY29lZmZzID0gc2luZ2xlR21tLm1peHR1cmVfY29lZmZzO1xuICBjb25zdCBjb21wb25lbnRzID0gc2luZ2xlR21tLmNvbXBvbmVudHM7XG4gIGNvbnN0IG1SZXMgPSBzaW5nbGVHbW1SZXM7XG4gIGxldCBsaWtlbGlob29kID0gMC4wO1xuICBcbiAgZm9yIChsZXQgYyA9IDA7IGMgPCBjb21wb25lbnRzLmxlbmd0aDsgYysrKSB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gYmltb2RhbFxuICAgIGlmIChzaW5nbGVDbGFzc0dtbU1vZGVsLmNvbXBvbmVudHNbY10uYmltb2RhbCkge1xuICAgICAgaWYgKG9ic091dC5sZW5ndGggPT09IDApIHtcbiAgICAgICAgbVJlcy5iZXRhW2NdXG4gICAgICAgICAgPSBnbW1PYnNQcm9iSW5wdXQob2JzSW4sIHNpbmdsZUdtbSwgYyk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtUmVzLmJldGFbY11cbiAgICAgICAgICA9IGdtbU9ic1Byb2JCaW1vZGFsKG9ic0luLCBvYnNPdXQsIHNpbmdsZUdtbSwgYyk7XG4gICAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB1bmltb2RhbFxuICAgIH0gZWxzZSB7XG4gICAgICBtUmVzLmJldGFbY10gPSBnbW1PYnNQcm9iKG9ic0luLCBzaW5nbGVHbW0sIGMpO1xuICAgIH1cbiAgICBsaWtlbGlob29kICs9IG1SZXMuYmV0YVtjXTtcbiAgfVxuICBmb3IgKGxldCBjID0gMDsgYyA8IGNvZWZmcy5sZW5ndGg7IGMrKykge1xuICAgIG1SZXMuYmV0YVtjXSAvPSBsaWtlbGlob29kO1xuICB9XG5cbiAgbVJlcy5pbnN0YW50X2xpa2VsaWhvb2QgPSBsaWtlbGlob29kO1xuXG4gIC8vIGFzIGluIHhtbTo6U2luZ2xlQ2xhc3NHTU06OnVwZGF0ZVJlc3VsdHMgOlxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgLy9yZXMubGlrZWxpaG9vZF9idWZmZXIudW5zaGlmdChsaWtlbGlob29kKTtcbiAgLy9yZXMubGlrZWxpaG9vZF9idWZmZXIubGVuZ3RoLS07XG4gIC8vIFRISVMgSVMgQkVUVEVSIChjaXJjdWxhciBidWZmZXIpXG4gIG1SZXMubGlrZWxpaG9vZF9idWZmZXJbbVJlcy5saWtlbGlob29kX2J1ZmZlcl9pbmRleF0gPSBsaWtlbGlob29kO1xuICBtUmVzLmxpa2VsaWhvb2RfYnVmZmVyX2luZGV4XG4gICAgPSAobVJlcy5saWtlbGlob29kX2J1ZmZlcl9pbmRleCArIDEpICUgbVJlcy5saWtlbGlob29kX2J1ZmZlci5sZW5ndGg7XG4gIC8vIHN1bSBhbGwgYXJyYXkgdmFsdWVzIDpcbiAgbVJlcy5sb2dfbGlrZWxpaG9vZCA9IG1SZXMubGlrZWxpaG9vZF9idWZmZXIucmVkdWNlKChhLCBiKSA9PiBhICsgYiwgMCk7XG4gIG1SZXMubG9nX2xpa2VsaWhvb2QgLz0gbVJlcy5saWtlbGlob29kX2J1ZmZlci5sZW5ndGg7XG5cbiAgcmV0dXJuIGxpa2VsaWhvb2Q7XG59O1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLy8gICAgICAgICAgYXMgaW4geG1tR21tLmNwcCAgICAgICAgIC8vXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZXhwb3J0IGNvbnN0IGdtbUZpbHRlciA9IChvYnNJbiwgZ21tLCBnbW1SZXMpID0+IHtcbiAgbGV0IGxpa2VsaWhvb2RzID0gW107XG4gIGNvbnN0IG1vZGVscyA9IGdtbS5tb2RlbHM7XG4gIGNvbnN0IG1SZXMgPSBnbW1SZXM7XG5cbiAgbGV0IG1heExvZ0xpa2VsaWhvb2QgPSAwO1xuICBsZXQgbm9ybUNvbnN0SW5zdGFudCA9IDA7XG4gIGxldCBub3JtQ29uc3RTbW9vdGhlZCA9IDA7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBsZXQgc2luZ2xlUmVzID0gbVJlcy5zaW5nbGVDbGFzc0dtbU1vZGVsUmVzdWx0c1tpXTtcbiAgICBtUmVzLmluc3RhbnRfbGlrZWxpaG9vZHNbaV1cbiAgICAgID0gZ21tTGlrZWxpaG9vZChvYnNJbiwgbW9kZWxzW2ldLCBzaW5nbGVSZXMpO1xuXG4gICAgLy8gYXMgaW4geG1tOjpHTU06OnVwZGF0ZVJlc3VsdHMgOlxuICAgIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICBtUmVzLnNtb290aGVkX2xvZ19saWtlbGlob29kc1tpXSA9IHNpbmdsZVJlcy5sb2dfbGlrZWxpaG9vZDtcbiAgICBtUmVzLnNtb290aGVkX2xpa2VsaWhvb2RzW2ldXG4gICAgICA9IE1hdGguZXhwKG1SZXMuc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzW2ldKTtcbiAgICBtUmVzLmluc3RhbnRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSA9IG1SZXMuaW5zdGFudF9saWtlbGlob29kc1tpXTtcbiAgICBtUmVzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gPSBtUmVzLnNtb290aGVkX2xpa2VsaWhvb2RzW2ldO1xuXG4gICAgbm9ybUNvbnN0SW5zdGFudCArPSBtUmVzLmluc3RhbnRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXTtcbiAgICBub3JtQ29uc3RTbW9vdGhlZCArPSBtUmVzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV07XG5cbiAgICBpZiAoaSA9PSAwIHx8IG1SZXMuc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzW2ldID4gbWF4TG9nTGlrZWxpaG9vZCkge1xuICAgICAgbWF4TG9nTGlrZWxpaG9vZCA9IG1SZXMuc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzW2ldO1xuICAgICAgbVJlcy5saWtlbGllc3QgPSBpO1xuICAgIH1cbiAgfVxuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbW9kZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgbVJlcy5pbnN0YW50X25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gLz0gbm9ybUNvbnN0SW5zdGFudDtcbiAgICBtUmVzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gLz0gbm9ybUNvbnN0U21vb3RoZWQ7XG4gIH1cblxuICAvLyBpZiBtb2RlbCBpcyBiaW1vZGFsIDpcbiAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gIGNvbnN0IHBhcmFtcyA9IGdtbS5zaGFyZWRfcGFyYW1ldGVycztcbiAgY29uc3QgY29uZmlnID0gZ21tLmNvbmZpZ3VyYXRpb247XG5cbiAgaWYgKHBhcmFtcy5iaW1vZGFsKSB7XG4gICAgbGV0IGRpbSA9IHBhcmFtcy5kaW1lbnNpb247XG4gICAgbGV0IGRpbUluID0gcGFyYW1zLmRpbWVuc2lvbl9pbnB1dDtcbiAgICBsZXQgZGltT3V0ID0gZGltIC0gZGltSW47XG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbGlrZWxpZXN0XG4gICAgaWYgKGNvbmZpZy5tdWx0aUNsYXNzX3JlZ3Jlc3Npb25fZXN0aW1hdG9yID09PSAwKSB7XG4gICAgICBtUmVzLm91dHB1dF92YWx1ZXNcbiAgICAgICAgPSBtUmVzLnNpbmdsZUNsYXNzTW9kZWxSZXN1bHRzW21SZXMubGlrZWxpZXN0XVxuICAgICAgICAgICAgLm91dHB1dF92YWx1ZXM7XG4gICAgICBtUmVzLm91dHB1dF9jb3ZhcmlhbmNlXG4gICAgICAgID0gbVJlcy5zaW5nbGVDbGFzc01vZGVsUmVzdWx0c1ttUmVzLmxpa2VsaWVzdF1cbiAgICAgICAgICAgIC5vdXRwdXRfY292YXJpYW5jZTsgICAgICAgICAgIFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIG1peHR1cmVcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gemVyby1maWxsIG91dHB1dF92YWx1ZXMgYW5kIG91dHB1dF9jb3ZhcmlhbmNlXG4gICAgICBtUmVzLm91dHB1dF92YWx1ZXMgPSBuZXcgQXJyYXkoZGltT3V0KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGltT3V0OyBpKyspIHtcbiAgICAgICAgbVJlcy5vdXRwdXRfdmFsdWVzW2ldID0gMC4wO1xuICAgICAgfVxuXG4gICAgICBsZXQgb3V0Q292YXJTaXplO1xuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZ1bGxcbiAgICAgIGlmIChjb25maWcuZGVmYXVsdF9wYXJhbWV0ZXJzLmNvdmFyaWFuY2VfbW9kZSA9PSAwKSB7XG4gICAgICAgIG91dENvdmFyU2l6ZSA9IGRpbU91dCAqIGRpbU91dDtcbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBvdXRDb3ZhclNpemUgPSBkaW1PdXQ7XG4gICAgICB9XG4gICAgICBtUmVzLm91dHB1dF9jb3ZhcmlhbmNlID0gbmV3IEFycmF5KG91dENvdmFyU2l6ZSk7XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENvdmFyU2l6ZTsgaSsrKSB7XG4gICAgICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbaV0gPSAwLjA7XG4gICAgICB9XG5cbiAgICAgIC8vIGNvbXB1dGUgdGhlIGFjdHVhbCB2YWx1ZXMgOlxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgbGV0IHNtb290aE5vcm1MaWtlbGlob29kXG4gICAgICAgICAgPSBtUmVzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV07XG4gICAgICAgIGxldCBzaW5nbGVSZXMgPSBtUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzW2ldO1xuICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGRpbU91dDsgaSsrKSB7XG4gICAgICAgICAgbVJlcy5vdXRwdXRfdmFsdWVzW2RdICs9IHNtb290aE5vcm1MaWtlbGlob29kICpcbiAgICAgICAgICAgICAgICAgICAgICAgc2luZ2xlUmVzLm91dHB1dF92YWx1ZXNbZF07XG4gICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICAgICAgICAgIGlmIChjb25maWcuZGVmYXVsdF9wYXJhbWV0ZXJzLmNvdmFyaWFuY2VfbW9kZSA9PT0gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgZDIgPSAwOyBkMiA8IGRpbU91dDsgZDIrKykge1xuICAgICAgICAgICAgICBsZXQgaW5kZXggPSBkICogZGltT3V0ICsgZDI7XG4gICAgICAgICAgICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbaW5kZXhdXG4gICAgICAgICAgICAgICAgKz0gc21vb3RoTm9ybUxpa2VsaWhvb2QgKlxuICAgICAgICAgICAgICAgICAgIHNpbmdsZVJlcy5vdXRwdXRfY292YXJpYW5jZVtpbmRleF07XG4gICAgICAgICAgICB9XG4gICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFnb25hbFxuICAgICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgICBtUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2RdXG4gICAgICAgICAgICAgICs9IHNtb290aE5vcm1MaWtlbGlob29kICpcbiAgICAgICAgICAgICAgICAgc2luZ2xlUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2RdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSAvKiBlbmQgaWYocGFyYW1zLmJpbW9kYWwpICovXG59O1xuIiwiaW1wb3J0ICogYXMgZ21tVXRpbHMgZnJvbSAnLi9nbW0tdXRpbHMnO1xuXG4vKipcbiAqICBmdW5jdGlvbnMgdXNlZCBmb3IgZGVjb2RpbmcsIHRyYW5zbGF0ZWQgZnJvbSBYTU1cbiAqL1xuXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cbi8vICAgIGFzIGluIHhtbUhtbVNpbmdsZUNsYXNzLmNwcCAgICAvL1xuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG5cbmV4cG9ydCBjb25zdCBobW1SZWdyZXNzaW9uID0gKG9ic0luLCBtLCBtUmVzKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgaG1tUmVncmVzc2lvbiA9IChvYnNJbiwgaG1tLCBobW1SZXMpID0+IHtcbi8vICAgY29uc3QgbSA9IGhtbTtcbi8vICAgY29uc3QgbVJlcyA9IGhtbVJlcztcbiAgY29uc3QgZGltID0gbS5zdGF0ZXNbMF0uY29tcG9uZW50c1swXS5kaW1lbnNpb247XG4gIGNvbnN0IGRpbUluID0gbS5zdGF0ZXNbMF0uY29tcG9uZW50c1swXS5kaW1lbnNpb25faW5wdXQ7XG4gIGNvbnN0IGRpbU91dCA9IGRpbSAtIGRpbUluO1xuXG4gIGxldCBvdXRDb3ZhclNpemU7XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICBpZiAobS5zdGF0ZXNbMF0uY29tcG9uZW50c1swXS5jb3ZhcmlhbmNlX21vZGUgPT09IDApIHtcbiAgICBvdXRDb3ZhclNpemUgPSBkaW1PdXQgKiBkaW1PdXQ7XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFnb25hbFxuICB9IGVsc2Uge1xuICAgIG91dENvdmFyU2l6ZSA9IGRpbU91dDtcbiAgfVxuXG4gIG1SZXMub3V0cHV0X3ZhbHVlcyA9IG5ldyBBcnJheShkaW1PdXQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpbU91dDsgaSsrKSB7XG4gICAgbVJlcy5vdXRwdXRfdmFsdWVzW2ldID0gMC4wO1xuICB9XG4gIG1SZXMub3V0cHV0X2NvdmFyaWFuY2UgPSBuZXcgQXJyYXkob3V0Q292YXJTaXplKTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBvdXRDb3ZhclNpemU7IGkrKykge1xuICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbaV0gPSAwLjA7XG4gIH1cblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBsaWtlbGllc3RcbiAgaWYgKG0ucGFyYW1ldGVycy5yZWdyZXNzaW9uX2VzdGltYXRvciA9PT0gMikge1xuICAgIGdtbVV0aWxzLmdtbUxpa2VsaWhvb2QoXG4gICAgICBvYnNJbixcbiAgICAgIG0uc3RhdGVzW21SZXMubGlrZWxpZXN0X3N0YXRlXSxcbiAgICAgIG1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHNbbVJlcy5saWtlbGllc3Rfc3RhdGVdXG4gICAgKTtcbiAgICBnbW1VdGlscy5nbW1SZWdyZXNzaW9uKFxuICAgICAgb2JzSW4sXG4gICAgICBtLnN0YXRlc1ttUmVzLmxpa2VsaWVzdF9zdGF0ZV0sXG4gICAgICBtUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzW21SZXMubGlrZWxpZXN0X3N0YXRlXVxuICAgICk7XG4gICAgbVJlcy5vdXRwdXRfdmFsdWVzXG4gICAgICA9IG0uc3RhdGVzW21SZXMubGlrZWxpZXN0X3N0YXRlXS5vdXRwdXRfdmFsdWVzLnNsaWNlKDApO1xuICAgIHJldHVybjtcbiAgfVxuXG4gIGNvbnN0IGNsaXBNaW5TdGF0ZSA9IChtLnBhcmFtZXRlcnMucmVncmVzc2lvbl9lc3RpbWF0b3IgPT0gMClcbiAgICAgICAgICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gICAgICAgICAgICAgICAgICAgID8gMFxuICAgICAgICAgICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gd2luZG93ZWRcbiAgICAgICAgICAgICAgICAgICAgOiBtUmVzLndpbmRvd19taW5pbmRleDtcblxuICBjb25zdCBjbGlwTWF4U3RhdGUgPSAobS5wYXJhbWV0ZXJzLnJlZ3Jlc3Npb25fZXN0aW1hdG9yID09IDApXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICAgICAgICAgICAgICAgICAgICA/IG0uc3RhdGVzLmxlbmd0aFxuICAgICAgICAgICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gd2luZG93ZWRcbiAgICAgICAgICAgICAgICAgICAgOiBtUmVzLndpbmRvd19tYXhpbmRleDtcblxuICBsZXQgbm9ybUNvbnN0YW50ID0gKG0ucGFyYW1ldGVycy5yZWdyZXNzaW9uX2VzdGltYXRvciA9PSAwKVxuICAgICAgICAgICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZ1bGxcbiAgICAgICAgICAgICAgICAgICAgPyAxLjBcbiAgICAgICAgICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHdpbmRvd2VkXG4gICAgICAgICAgICAgICAgICAgIDogbVJlcy53aW5kb3dfbm9ybWFsaXphdGlvbl9jb25zdGFudDtcblxuICBpZiAobm9ybUNvbnN0YW50IDw9IDAuMCkge1xuICAgIG5vcm1Db25zdGFudCA9IDEuO1xuICB9XG5cbiAgZm9yIChsZXQgaSA9IGNsaXBNaW5TdGF0ZTsgaSA8IGNsaXBNYXhTdGF0ZTsgaSsrKSB7XG4gICAgZ21tVXRpbHMuZ21tTGlrZWxpaG9vZChcbiAgICAgIG9ic0luLFxuICAgICAgbS5zdGF0ZXNbaV0sXG4gICAgICBtUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzW2ldXG4gICAgKTtcbiAgICBnbW1VdGlscy5nbW1SZWdyZXNzaW9uKFxuICAgICAgb2JzSW4sXG4gICAgICBtLnN0YXRlc1tpXSxcbiAgICAgIG1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHNbaV1cbiAgICApO1xuICAgIGNvbnN0IHRtcFByZWRpY3RlZE91dHB1dFxuICAgICAgPSBtUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzW2ldLm91dHB1dF92YWx1ZXMuc2xpY2UoMCk7XG5cbiAgICBmb3IgKGxldCBkID0gMDsgZCA8IGRpbU91dDsgZCsrKSB7XG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGhpZXJhcmNoaWNhbFxuICAgICAgaWYgKG1SZXMuaGllcmFyY2hpY2FsKSB7XG4gICAgICAgIG1SZXMub3V0cHV0X3ZhbHVlc1tkXVxuICAgICAgICAgICs9IChtUmVzLmFscGhhX2hbMF1baV0gKyBtUmVzLmFscGhhX2hbMV1baV0pICpcbiAgICAgICAgICAgICB0bXBQcmVkaWN0ZWRPdXRwdXRbZF0gLyBub3JtQ29uc3RhbnQ7XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICAgICAgICBpZiAobS5wYXJhbWV0ZXJzLmNvdmFyaWFuY2VfbW9kZSA9PT0gMCkge1xuICAgICAgICAgIGZvciAobGV0IGQyID0gMDsgZDIgPCBkaW1PdXQ7IGQyKyspIHtcbiAgICAgICAgICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbZCAqIGRpbU91dCArIGQyXVxuICAgICAgICAgICAgICArPSAobVJlcy5hbHBoYV9oWzBdW2ldICsgbVJlcy5hbHBoYV9oWzFdW2ldKSAqXG4gICAgICAgICAgICAgICAgIChtUmVzLmFscGhhX2hbMF1baV0gKyBtUmVzLmFscGhhX2hbMV1baV0pICpcbiAgICAgICAgICAgICAgICBtUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzW2ldXG4gICAgICAgICAgICAgICAgICAub3V0cHV0X2NvdmFyaWFuY2VbZCAqIGRpbU91dCArIGQyXSAvXG4gICAgICAgICAgICAgICAgbm9ybUNvbnN0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbVJlcy5vdXRwdXRfY292YXJpYW5jZVtkXVxuICAgICAgICAgICAgKz0gKG1SZXMuYWxwaGFfaFswXVtpXSArIG1SZXMuYWxwaGFfaFsxXVtpXSkgKlxuICAgICAgICAgICAgICAgKG1SZXMuYWxwaGFfaFswXVtpXSArIG1SZXMuYWxwaGFfaFsxXVtpXSkgKlxuICAgICAgICAgICAgICBtUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzW2ldXG4gICAgICAgICAgICAgICAgLm91dHB1dF9jb3ZhcmlhbmNlW2RdIC9cbiAgICAgICAgICAgICAgbm9ybUNvbnN0YW50O1xuICAgICAgICB9XG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbm9uLWhpZXJhcmNoaWNhbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbVJlcy5vdXRwdXRfdmFsdWVzW2RdICs9IG1SZXMuYWxwaGFbaV0gKiBcbiAgICAgICAgICAgICAgICAgICAgIHRtcFByZWRpY3RlZE91dHB1dFtkXSAvIG5vcm1Db25zdGFudDtcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gICAgICAgIGlmIChtLnBhcmFtZXRlcnMuY292YXJpYW5jZV9tb2RlID09PSAwKSB7XG4gICAgICAgICAgZm9yIChsZXQgZDIgPSAwOyBkMiA8IGRpbU91dDsgZDIrKykge1xuICAgICAgICAgICAgbVJlcy5vdXRwdXRfY292YXJpYW5jZVtkICogZGltT3V0ICsgZDJdXG4gICAgICAgICAgICAgICs9ICBtUmVzLmFscGhhW2ldICogbVJlcy5hbHBoYVtpXSAqXG4gICAgICAgICAgICAgICAgbVJlcy5zaW5nbGVDbGFzc0dtbU1vZGVsUmVzdWx0c1tpXVxuICAgICAgICAgICAgICAgICAgLm91dHB1dF9jb3ZhcmlhbmNlW2QgKiBkaW1PdXQgKyBkMl0gL1xuICAgICAgICAgICAgICAgIG5vcm1Db25zdGFudDtcbiAgICAgICAgICB9XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2RdICs9IG1SZXMuYWxwaGFbaV0gKiBtUmVzLmFscGhhW2ldICpcbiAgICAgICAgICAgICAgICAgICAgICAgICBtUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAub3V0cHV0X2NvdmFyaWFuY2VbZF0gL1xuICAgICAgICAgICAgICAgICAgICAgICAgIG5vcm1Db25zdGFudDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuXG5leHBvcnQgY29uc3QgaG1tRm9yd2FyZEluaXQgPSAob2JzSW4sIG0sIG1SZXMsIG9ic091dCA9IFtdKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgaG1tRm9yd2FyZEluaXQgPSAob2JzSW4sIGhtbSwgaG1tUmVzLCBvYnNPdXQgPSBbXSkgPT4ge1xuLy8gICBjb25zdCBtID0gaG1tO1xuLy8gICBjb25zdCBtUmVzID0gaG1tUmVzO1xuICBjb25zdCBuc3RhdGVzID0gbS5wYXJhbWV0ZXJzLnN0YXRlcztcbiAgbGV0IG5vcm1Db25zdCA9IDAuMDtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGVyZ29kaWMgICAgICAgIFxuICBpZiAobS5wYXJhbWV0ZXJzLnRyYW5zaXRpb25fbW9kZSA9PT0gMCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnN0YXRlczsgaSsrKSB7XG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gYmltb2RhbCAgICAgICAgXG4gICAgICBpZiAobS5zdGF0ZXNbaV0uY29tcG9uZW50c1swXS5iaW1vZGFsKSB7XG4gICAgICAgIGlmIChvYnNPdXQubGVuZ3RoID4gMCkge1xuICAgICAgICAgIG1SZXMuYWxwaGFbaV0gPSBtLnByaW9yW2ldICpcbiAgICAgICAgICAgICAgICAgIGdtbVV0aWxzLmdtbU9ic1Byb2JCaW1vZGFsKG9ic0luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzT3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbS5zdGF0ZXNbaV0pO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1SZXMuYWxwaGFbaV0gPSBtLnByaW9yW2ldICpcbiAgICAgICAgICAgICAgICAgIGdtbVV0aWxzLmdtbU9ic1Byb2JJbnB1dChvYnNJbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLnN0YXRlc1tpXSk7XG4gICAgICAgIH1cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHVuaW1vZGFsICAgICAgICBcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1SZXMuYWxwaGFbaV0gPSBtLnByaW9yW2ldICpcbiAgICAgICAgICAgICAgICBnbW1VdGlscy5nbW1PYnNQcm9iKG9ic0luLCBtLnN0YXRlc1tpXSk7XG4gICAgICB9XG4gICAgICBub3JtQ29uc3QgKz0gbVJlcy5hbHBoYVtpXTtcbiAgICB9XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbGVmdC1yaWdodCAgICAgICAgXG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBtUmVzLmFscGhhLmxlbmd0aDsgaSsrKSB7XG4gICAgICBtUmVzLmFscGhhW2ldID0gMC4wO1xuICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBiaW1vZGFsICAgICAgICBcbiAgICBpZiAobS5zdGF0ZXNbMF0uY29tcG9uZW50c1swXS5iaW1vZGFsKSB7XG4gICAgICBpZiAob2JzT3V0Lmxlbmd0aCA+IDApIHtcbiAgICAgICAgbVJlcy5hbHBoYVswXSA9IGdtbVV0aWxzLmdtbU9ic1Byb2JCaW1vZGFsKG9ic0luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9ic091dCxcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLnN0YXRlc1swXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtUmVzLmFscGhhWzBdID0gZ21tVXRpbHMuZ21tT2JzUHJvYklucHV0KG9ic0luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLnN0YXRlc1swXSk7XG4gICAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB1bmltb2RhbCAgICAgICAgXG4gICAgfSBlbHNlIHtcbiAgICAgIG1SZXMuYWxwaGFbMF0gPSBnbW1VdGlscy5nbW1PYnNQcm9iKG9ic0luLCBtLnN0YXRlc1swXSk7XG4gICAgfVxuICAgIG5vcm1Db25zdCArPSBtUmVzLmFscGhhWzBdO1xuICB9XG5cbiAgaWYgKG5vcm1Db25zdCA+IDApIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5zdGF0ZXM7IGkrKykge1xuICAgICAgbVJlcy5hbHBoYVtpXSAvPSBub3JtQ29uc3Q7XG4gICAgfVxuICAgIHJldHVybiAoMS4wIC8gbm9ybUNvbnN0KTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5zdGF0ZXM7IGkrKykge1xuICAgICAgbVJlcy5hbHBoYVtpXSA9IDEuMCAvIG5zdGF0ZXM7XG4gICAgfVxuICAgIHJldHVybiAxLjA7XG4gIH1cbn07XG5cblxuZXhwb3J0IGNvbnN0IGhtbUZvcndhcmRVcGRhdGUgPSAob2JzSW4sIG0sIG1SZXMsIG9ic091dCA9IFtdKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgaG1tRm9yd2FyZFVwZGF0ZSA9IChvYnNJbiwgaG1tLCBobW1SZXMsIG9ic091dCA9IFtdKSA9PiB7XG4vLyAgIGNvbnN0IG0gPSBobW07XG4vLyAgIGNvbnN0IG1SZXMgPSBobW1SZXM7XG4gIGNvbnN0IG5zdGF0ZXMgPSBtLnBhcmFtZXRlcnMuc3RhdGVzO1xuICBsZXQgbm9ybUNvbnN0ID0gMC4wO1xuXG4gIG1SZXMucHJldmlvdXNfYWxwaGEgPSBtUmVzLmFscGhhLnNsaWNlKDApO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5zdGF0ZXM7IGkrKykge1xuICAgIG1SZXMuYWxwaGFbaV0gPSAwO1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGVyZ29kaWNcbiAgICBpZiAobS5wYXJhbWV0ZXJzLnRyYW5zaXRpb25fbW9kZSA9PT0gMCkge1xuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuc3RhdGVzOyBqKyspIHtcbiAgICAgICAgbVJlcy5hbHBoYVtpXSArPSBtUmVzLnByZXZpb3VzX2FscGhhW2pdICpcbiAgICAgICAgICAgICAgICAgbVJlcy50cmFuc2l0aW9uW2ogKiBuc3RhdGVzKyBpXTtcbiAgICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBsZWZ0LXJpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIG1SZXMuYWxwaGFbaV0gKz0gbVJlcy5wcmV2aW91c19hbHBoYVtpXSAqIG1SZXMudHJhbnNpdGlvbltpICogMl07XG4gICAgICBpZiAoaSA+IDApIHtcbiAgICAgICAgbVJlcy5hbHBoYVtpXSArPSBtUmVzLnByZXZpb3VzX2FscGhhW2kgLSAxXSAqXG4gICAgICAgICAgICAgICAgIG1SZXMudHJhbnNpdGlvblsoaSAtIDEpICogMiArIDFdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbVJlcy5hbHBoYVswXSArPSBtUmVzLnByZXZpb3VzX2FscGhhW25zdGF0ZXMgLSAxXSAqXG4gICAgICAgICAgICAgICAgIG1SZXMudHJhbnNpdGlvbltuc3RhdGVzICogMiAtIDFdO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGJpbW9kYWwgICAgICAgIFxuICAgIGlmIChtLnN0YXRlc1tpXS5jb21wb25lbnRzWzBdLmJpbW9kYWwpIHtcbiAgICAgIGlmIChvYnNPdXQubGVuZ3RoID4gMCkge1xuICAgICAgICBtUmVzLmFscGhhW2ldICo9IGdtbVV0aWxzLmdtbU9ic1Byb2JCaW1vZGFsKG9ic0luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzT3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbS5zdGF0ZXNbaV0pO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbVJlcy5hbHBoYVtpXSAqPSBnbW1VdGlscy5nbW1PYnNQcm9iSW5wdXQob2JzSW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLnN0YXRlc1tpXSk7XG4gICAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB1bmltb2RhbCAgICAgICAgXG4gICAgfSBlbHNlIHtcbiAgICAgIG1SZXMuYWxwaGFbaV0gKj0gZ21tVXRpbHMuZ21tT2JzUHJvYihvYnNJbiwgbS5zdGF0ZXNbaV0pO1xuICAgIH1cbiAgICBub3JtQ29uc3QgKz0gbVJlcy5hbHBoYVtpXTtcbiAgfVxuXG4gIGlmIChub3JtQ29uc3QgPiAxZS0zMDApIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG5zdGF0ZXM7IGkrKykge1xuICAgICAgbVJlcy5hbHBoYVtpXSAvPSBub3JtQ29uc3Q7XG4gICAgfVxuICAgIHJldHVybiAoMS4wIC8gbm9ybUNvbnN0KTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gMC4wO1xuICB9XG59O1xuXG5cbmV4cG9ydCBjb25zdCBobW1VcGRhdGVBbHBoYVdpbmRvdyA9IChtLCBtUmVzKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgaG1tVXBkYXRlQWxwaGFXaW5kb3cgPSAoaG1tLCBobW1SZXMpID0+IHtcbi8vICAgY29uc3QgbSA9IGhtbTtcbi8vICAgY29uc3QgbVJlcyA9IGhtbVJlcztcbiAgY29uc3QgbnN0YXRlcyA9IG0ucGFyYW1ldGVycy5zdGF0ZXM7XG4gIFxuICBtUmVzLmxpa2VsaWVzdF9zdGF0ZSA9IDA7XG5cbiAgbGV0IGJlc3RfYWxwaGE7XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGhpZXJhcmNoaWNhbFxuICBpZiAobS5wYXJhbWV0ZXJzLmhpZXJhcmNoaWNhbCkge1xuICAgIGJlc3RfYWxwaGEgPSBtUmVzLmFscGhhX2hbMF1bMF0gKyBtUmVzLmFscGhhX2hbMV1bMF07XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbm9uLWhpZXJhcmNoaWNhbFxuICB9IGVsc2Uge1xuICAgIGJlc3RfYWxwaGEgPSBtUmVzLmFscGhhWzBdOyBcbiAgfVxuXG4gIGZvciAobGV0IGkgPSAxOyBpIDwgbnN0YXRlczsgaSsrKSB7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGhpZXJhcmNoaWNhbFxuICAgIGlmIChtLnBhcmFtZXRlcnMuaGllcmFyY2hpY2FsKSB7XG4gICAgICBpZiAoKG1SZXMuYWxwaGFfaFswXVtpXSArIG1SZXMuYWxwaGFfaFsxXVtpXSkgPiBiZXN0X2FscGhhKSB7XG4gICAgICAgIGJlc3RfYWxwaGEgPSBtUmVzLmFscGhhX2hbMF1baV0gKyBtUmVzLmFscGhhX2hbMV1baV07XG4gICAgICAgIG1SZXMubGlrZWxpZXN0X3N0YXRlID0gaTtcbiAgICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBub24taGllcmFyY2hpY2FsICAgICAgICBcbiAgICB9IGVsc2Uge1xuICAgICAgaWYobVJlcy5hbHBoYVtpXSA+IGJlc3RfYWxwaGEpIHtcbiAgICAgICAgYmVzdF9hbHBoYSA9IG1SZXMuYWxwaGFbMF07XG4gICAgICAgIG1SZXMubGlrZWxpZXN0X3N0YXRlID0gaTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBtUmVzLndpbmRvd19taW5pbmRleCA9IG1SZXMubGlrZWxpZXN0X3N0YXRlIC0gbnN0YXRlcyAvIDI7XG4gIG1SZXMud2luZG93X21heGluZGV4ID0gbVJlcy5saWtlbGllc3Rfc3RhdGUgKyBuc3RhdGVzIC8gMjtcbiAgbVJlcy53aW5kb3dfbWluaW5kZXggPSAobVJlcy53aW5kb3dfbWluaW5kZXggPj0gMClcbiAgICAgICAgICAgICA/IG1SZXMud2luZG93X21pbmluZGV4XG4gICAgICAgICAgICAgOiAwO1xuICBtUmVzLndpbmRvd19tYXhpbmRleCA9IChtUmVzLndpbmRvd19tYXhpbmRleCA8PSBuc3RhdGVzKVxuICAgICAgICAgICAgID8gbVJlcy53aW5kb3dfbWF4aW5kZXhcbiAgICAgICAgICAgICA6IG5zdGF0ZXM7XG4gIG1SZXMud2luZG93X25vcm1hbGl6YXRpb25fY29uc3RhbnQgPSAwO1xuICBmb3IgKGxldCBpID0gbVJlcy53aW5kb3dfbWluaW5kZXg7IGkgPCBtUmVzLndpbmRvd19tYXhpbmRleDsgaSsrKSB7XG4gICAgbVJlcy53aW5kb3dfbm9ybWFsaXphdGlvbl9jb25zdGFudFxuICAgICAgKz0gKG1SZXMuYWxwaGFfaFswXVtpXSArIG1SZXMuYWxwaGFfaFsxXVtpXSk7XG4gIH1cbn07XG5cblxuZXhwb3J0IGNvbnN0IGhtbVVwZGF0ZVJlc3VsdHMgPSAobSwgbVJlcykgPT4ge1xuLy8gZXhwb3J0IGNvbnN0IGhtbVVwZGF0ZVJlc3VsdHMgPSAoaG1tLCBobW1SZXMpID0+IHtcbi8vICAgY29uc3QgbSA9IGhtbTtcbi8vICAgY29uc3QgbVJlcyA9IGhtbVJlcztcblxuICAvLyBJUyBUSElTIENPUlJFQ1QgID8gVE9ETyA6IENIRUNLIEFHQUlOIChzZWVtcyB0byBoYXZlIHByZWNpc2lvbiBpc3N1ZXMpXG4gIC8vIEFIQSAhIDogTk9STUFMTFkgTElLRUxJSE9PRF9CVUZGRVIgSVMgQ0lSQ1VMQVIgOiBJUyBJVCBUSEUgQ0FTRSBIRVJFID9cbiAgLy8gU0hPVUxEIEkgXCJQT1BfRlJPTlRcIiA/IChzZWVtcyB0aGF0IHllcylcblxuICAvL3Jlcy5saWtlbGlob29kX2J1ZmZlci5wdXNoKE1hdGgubG9nKHJlcy5pbnN0YW50X2xpa2VsaWhvb2QpKTtcblxuICAvLyBOT1cgVEhJUyBJUyBCRVRURVIgKFNIT1VMRCBXT1JLIEFTIElOVEVOREVEKVxuICBtUmVzLmxpa2VsaWhvb2RfYnVmZmVyW21SZXMubGlrZWxpaG9vZF9idWZmZXJfaW5kZXhdXG4gICAgPSBNYXRoLmxvZyhtUmVzLmluc3RhbnRfbGlrZWxpaG9vZCk7XG4gIG1SZXMubGlrZWxpaG9vZF9idWZmZXJfaW5kZXhcbiAgICA9IChtUmVzLmxpa2VsaWhvb2RfYnVmZmVyX2luZGV4ICsgMSkgJSBtUmVzLmxpa2VsaWhvb2RfYnVmZmVyLmxlbmd0aDtcblxuICBtUmVzLmxvZ19saWtlbGlob29kID0gMDtcbiAgY29uc3QgYnVmU2l6ZSA9IG1SZXMubGlrZWxpaG9vZF9idWZmZXIubGVuZ3RoO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGJ1ZlNpemU7IGkrKykge1xuICAgIG1SZXMubG9nX2xpa2VsaWhvb2QgKz0gbVJlcy5saWtlbGlob29kX2J1ZmZlcltpXTtcbiAgfVxuICBtUmVzLmxvZ19saWtlbGlob29kIC89IGJ1ZlNpemU7XG5cbiAgbVJlcy5wcm9ncmVzcyA9IDA7XG4gIGZvciAobGV0IGkgPSBtUmVzLndpbmRvd19taW5pbmRleDsgaSA8IG1SZXMud2luZG93X21heGluZGV4OyBpKyspIHtcbiAgICBpZiAobS5wYXJhbWV0ZXJzLmhpZXJhcmNoaWNhbCkgeyAvLyBoaWVyYXJjaGljYWxcbiAgICAgIG1SZXMucHJvZ3Jlc3NcbiAgICAgICAgKz0gKFxuICAgICAgICAgICAgbVJlcy5hbHBoYV9oWzBdW2ldICtcbiAgICAgICAgICAgIG1SZXMuYWxwaGFfaFsxXVtpXSArXG4gICAgICAgICAgICBtUmVzLmFscGhhX2hbMl1baV1cbiAgICAgICAgICApICpcbiAgICAgICAgICBpIC8gbVJlcy53aW5kb3dfbm9ybWFsaXphdGlvbl9jb25zdGFudDtcbiAgICB9IGVsc2UgeyAvLyBub24gaGllcmFyY2hpY2FsXG4gICAgICBtUmVzLnByb2dyZXNzICs9IG1SZXMuYWxwaGFbaV0gKlxuICAgICAgICAgICAgICAgaSAvIG1SZXMud2luZG93X25vcm1hbGl6YXRpb25fY29uc3RhbnQ7XG4gICAgfVxuICB9XG4gIG1SZXMucHJvZ3Jlc3MgLz0gKG0ucGFyYW1ldGVycy5zdGF0ZXMgLSAxKTtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGhtbUZpbHRlciA9IChvYnNJbiwgbSwgbVJlcykgPT4ge1xuLy8gZXhwb3J0IGNvbnN0IGhtbUZpbHRlciA9IChvYnNJbiwgaG1tLCBobW1SZXMpID0+IHtcbi8vICAgY29uc3QgbSA9IGhtbTtcbi8vICAgY29uc3QgbVJlcyA9IGhtbVJlcztcbiAgbGV0IGN0ID0gMC4wO1xuICBpZiAobVJlcy5mb3J3YXJkX2luaXRpYWxpemVkKSB7XG4gICAgY3QgPSBobW1Gb3J3YXJkVXBkYXRlKG9ic0luLCBtLCBtUmVzKTtcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG1SZXMubGlrZWxpaG9vZF9idWZmZXIubGVuZ3RoOyBqKyspIHtcbiAgICAgIG1SZXMubGlrZWxpaG9vZF9idWZmZXJbal0gPSAwLjA7XG4gICAgfVxuICAgIGN0ID0gaG1tRm9yd2FyZEluaXQob2JzSW4sIG0sIG1SZXMpO1xuICAgIG1SZXMuZm9yd2FyZF9pbml0aWFsaXplZCA9IHRydWU7XG4gIH1cblxuICBtUmVzLmluc3RhbnRfbGlrZWxpaG9vZCA9IDEuMCAvIGN0O1xuICBobW1VcGRhdGVBbHBoYVdpbmRvdyhtLCBtUmVzKTtcbiAgaG1tVXBkYXRlUmVzdWx0cyhtLCBtUmVzKTtcblxuICBpZiAobS5zdGF0ZXNbMF0uY29tcG9uZW50c1swXS5iaW1vZGFsKSB7XG4gICAgaG1tUmVncmVzc2lvbihvYnNJbiwgbSwgbVJlcyk7XG4gIH1cblxuICByZXR1cm4gbVJlcy5pbnN0YW50X2xpa2VsaWhvb2Q7XG59O1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLy8gICBhcyBpbiB4bW1IaWVyYXJjaGljYWxIbW0uY3BwICAgIC8vXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZXhwb3J0IGNvbnN0IGhobW1MaWtlbGlob29kQWxwaGEgPSAoZXhpdE51bSwgbGlrZWxpaG9vZFZlYywgaG0sIGhtUmVzKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgaGhtbUxpa2VsaWhvb2RBbHBoYSA9IChleGl0TnVtLCBsaWtlbGlob29kVmVjLCBoaG1tLCBoaG1tUmVzKSA9PiB7XG4vLyAgIGNvbnN0IG0gPSBoaG1tO1xuLy8gICBjb25zdCBtUmVzID0gaGhtbVJlcztcblxuICBpZiAoZXhpdE51bSA8IDApIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhtLm1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgbGlrZWxpaG9vZFZlY1tpXSA9IDA7XG4gICAgICBmb3IgKGxldCBleGl0ID0gMDsgZXhpdCA8IDM7IGV4aXQrKykge1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IGhtLm1vZGVsc1tpXS5wYXJhbWV0ZXJzLnN0YXRlczsgaysrKSB7XG4gICAgICAgICAgbGlrZWxpaG9vZFZlY1tpXVxuICAgICAgICAgICAgKz0gaG1SZXMuc2luZ2xlQ2xhc3NIbW1Nb2RlbFJlc3VsdHNbaV0uYWxwaGFfaFtleGl0XVtrXTtcbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhtLm1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgbGlrZWxpaG9vZFZlY1tpXSA9IDA7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IGhtLm1vZGVsc1tpXS5wYXJhbWV0ZXJzLnN0YXRlczsgaysrKSB7XG4gICAgICAgIGxpa2VsaWhvb2RWZWNbaV1cbiAgICAgICAgICArPSBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXS5hbHBoYV9oW2V4aXROdW1dW2tdO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuXG4vLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IEZPUldBUkQgSU5JVFxuXG5leHBvcnQgY29uc3QgaGhtbUZvcndhcmRJbml0ID0gKG9ic0luLCBobSwgaG1SZXMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBoaG1tRm9yd2FyZEluaXQgPSAob2JzSW4sIGhobW0sIGhobW1SZXMpID0+IHtcbi8vICAgY29uc3QgaG0gPSBoaG1tO1xuLy8gICBjb25zdCBobVJlcyA9IGhobW1SZXM7XG4gIGxldCBub3JtX2NvbnN0ID0gMDtcblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IGluaXRpYWxpemUgYWxwaGFzXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaG0ubW9kZWxzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICBjb25zdCBtID0gaG0ubW9kZWxzW2ldO1xuICAgIGNvbnN0IG5zdGF0ZXMgPSBtLnBhcmFtZXRlcnMuc3RhdGVzO1xuICAgIGNvbnN0IG1SZXMgPSBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXTtcblxuICAgIGZvciAobGV0IGogPSAwOyBqIDwgMzsgaisrKSB7XG4gICAgICBtUmVzLmFscGhhX2hbal0gPSBuZXcgQXJyYXkobnN0YXRlcyk7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IG5zdGF0ZXM7IGsrKykge1xuICAgICAgICBtUmVzLmFscGhhX2hbal1ba10gPSAwO1xuICAgICAgfVxuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGVyZ29kaWNcbiAgICBpZiAobS5wYXJhbWV0ZXJzLnRyYW5zaXRpb25fbW9kZSA9PSAwKSB7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IG5zdGF0ZXM7IGsrKykge1xuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGJpbW9kYWxcbiAgICAgICAgaWYgKGhtLnNoYXJlZF9wYXJhbWV0ZXJzLmJpbW9kYWwpIHtcbiAgICAgICAgICBtUmVzLmFscGhhX2hbMF1ba10gPSBtLnByaW9yW2tdICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbW1VdGlscy5nbW1PYnNQcm9iSW5wdXQob2JzSW4sIG0uc3RhdGVzW2tdKTtcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHVuaW1vZGFsXG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbVJlcy5hbHBoYV9oWzBdW2tdID0gbS5wcmlvcltrXSAqXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZ21tVXRpbHMuZ21tT2JzUHJvYihvYnNJbiwgbS5zdGF0ZXNba10pO1xuICAgICAgICB9XG4gICAgICAgIG1SZXMuaW5zdGFudF9saWtlbGlob29kICs9IG1SZXMuYWxwaGFfaFswXVtrXTtcbiAgICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBsZWZ0LXJpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIG1SZXMuYWxwaGFfaFswXVswXSA9IGhtLnByaW9yW2ldO1xuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGJpbW9kYWxcbiAgICAgIGlmIChobS5zaGFyZWRfcGFyYW1ldGVycy5iaW1vZGFsKSB7XG4gICAgICAgIG1SZXMuYWxwaGFfaFswXVswXSAqPSBnbW1VdGlscy5nbW1PYnNQcm9iSW5wdXQob2JzSW4sIG0uc3RhdGVzWzBdKTtcbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHVuaW1vZGFsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtUmVzLmFscGhhX2hbMF1bMF0gKj0gZ21tVXRpbHMuZ21tT2JzUHJvYihvYnNJbiwgbS5zdGF0ZXNbMF0pO1xuICAgICAgfVxuICAgICAgbVJlcy5pbnN0YW50X2xpa2VsaWhvb2QgPSBtUmVzLmFscGhhX2hbMF1bMF07XG4gICAgfVxuICAgIG5vcm1fY29uc3QgKz0gbVJlcy5pbnN0YW50X2xpa2VsaWhvb2Q7XG4gIH1cblxuICAvLz09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSBub3JtYWxpemUgYWxwaGFzXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaG0ubW9kZWxzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICBjb25zdCBuc3RhdGVzID0gaG0ubW9kZWxzW2ldLnBhcmFtZXRlcnMuc3RhdGVzO1xuICAgIGZvciAobGV0IGUgPSAwOyBlIDwgMzsgZSsrKSB7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IG5zdGF0ZXM7IGsrKykge1xuICAgICAgICBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXS5hbHBoYV9oW2VdW2tdIC89IG5vcm1fY29uc3Q7XG4gICAgICB9XG4gICAgfVxuICB9XG5cbiAgaG1SZXMuZm9yd2FyZF9pbml0aWFsaXplZCA9IHRydWU7XG59O1xuXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IEZPUldBUkQgVVBEQVRFXG5cbmV4cG9ydCBjb25zdCBoaG1tRm9yd2FyZFVwZGF0ZSA9IChvYnNJbiwgaG0sIGhtUmVzKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgaGhtbUZvcndhcmRVcGRhdGUgPSAob2JzSW4sIGhobW0sIGhobW1SZXMpID0+IHtcbi8vICAgY29uc3QgaG0gPSBoaG1tO1xuLy8gICBjb25zdCBobVJlcyA9IGhobW1SZXM7XG4gIGNvbnN0IG5tb2RlbHMgPSBobS5tb2RlbHMubGVuZ3RoO1xuXG4gIGxldCBub3JtX2NvbnN0ID0gMDtcbiAgbGV0IHRtcCA9IDA7XG4gIGxldCBmcm9udDsgLy8gYXJyYXlcblxuICBoaG1tTGlrZWxpaG9vZEFscGhhKDEsIGhtUmVzLmZyb250aWVyX3YxLCBobSwgaG1SZXMpO1xuICBoaG1tTGlrZWxpaG9vZEFscGhhKDIsIGhtUmVzLmZyb250aWVyX3YyLCBobSwgaG1SZXMpO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbm1vZGVsczsgaSsrKSB7XG5cbiAgICBjb25zdCBtID0gaG0ubW9kZWxzW2ldO1xuICAgIGNvbnN0IG5zdGF0ZXMgPSBtLnBhcmFtZXRlcnMuc3RhdGVzO1xuICAgIGNvbnN0IG1SZXMgPSBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXTtcbiAgICBcbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09IGNvbXB1dGUgZnJvbnRpZXIgdmFyaWFibGVcbiAgICBmcm9udCA9IG5ldyBBcnJheShuc3RhdGVzKTtcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5zdGF0ZXM7IGorKykge1xuICAgICAgZnJvbnRbal0gPSAwO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGVyZ29kaWNcbiAgICBpZiAobS5wYXJhbWV0ZXJzLnRyYW5zaXRpb25fbW9kZSA9PSAwKSB7IC8vIGVyZ29kaWNcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbnN0YXRlczsgaysrKSB7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnN0YXRlczsgaisrKSB7XG4gICAgICAgICAgZnJvbnRba10gKz0gbS50cmFuc2l0aW9uW2ogKiBuc3RhdGVzICsga10gL1xuICAgICAgICAgICAgICAgICgxIC0gbS5leGl0UHJvYmFiaWxpdGllc1tqXSkgKlxuICAgICAgICAgICAgICAgIG1SZXMuYWxwaGFfaFswXVtqXTtcbiAgICAgICAgfVxuICAgICAgICBmb3IgKGxldCBzcmNpID0gMDsgc3JjaSA8IG5tb2RlbHM7IHNyY2krKykge1xuICAgICAgICAgIGZyb250W2tdICs9IG0ucHJpb3Jba10gKlxuICAgICAgICAgICAgICAgIChcbiAgICAgICAgICAgICAgICAgIGhtUmVzLmZyb250aWVyX3YxW3NyY2ldICpcbiAgICAgICAgICAgICAgICAgIGhtLnRyYW5zaXRpb25bc3JjaV1baV1cbiAgICAgICAgICAgICAgICAgICsgaG1SZXMuZnJvbnRpZXJfdjJbc3JjaV0gKlxuICAgICAgICAgICAgICAgICAgaG0ucHJpb3JbaV1cbiAgICAgICAgICAgICAgICApO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbGVmdC1yaWdodFxuICAgIH0gZWxzZSB7XG4gICAgICAvLyBrID09IDAgOiBmaXJzdCBzdGF0ZSBvZiB0aGUgcHJpbWl0aXZlXG4gICAgICBmcm9udFswXSA9IG0udHJhbnNpdGlvblswXSAqIG1SZXMuYWxwaGFfaFswXVswXTtcblxuICAgICAgZm9yIChsZXQgc3JjaSA9IDA7IHNyY2kgPCBubW9kZWxzOyBzcmNpKyspIHtcbiAgICAgICAgZnJvbnRbMF0gKz0gaG1SZXMuZnJvbnRpZXJfdjFbc3JjaV0gKlxuICAgICAgICAgICAgICBobS50cmFuc2l0aW9uW3NyY2ldW2ldXG4gICAgICAgICAgICAgICsgaG1SZXMuZnJvbnRpZXJfdjJbc3JjaV0gKlxuICAgICAgICAgICAgICBobS5wcmlvcltpXTtcbiAgICAgIH1cblxuICAgICAgLy8gayA+IDAgOiByZXN0IG9mIHRoZSBwcmltaXRpdmVcbiAgICAgIGZvciAobGV0IGsgPSAxOyBrIDwgbnN0YXRlczsgaysrKSB7XG4gICAgICAgIGZyb250W2tdICs9IG0udHJhbnNpdGlvbltrICogMl0gL1xuICAgICAgICAgICAgICAoMSAtIG0uZXhpdFByb2JhYmlsaXRpZXNba10pICpcbiAgICAgICAgICAgICAgbVJlcy5hbHBoYV9oWzBdW2tdO1xuICAgICAgICBmcm9udFtrXSArPSBtLnRyYW5zaXRpb25bKGsgLSAxKSAqIDIgKyAxXSAvXG4gICAgICAgICAgICAgICgxIC0gbS5leGl0UHJvYmFiaWxpdGllc1trIC0gMV0pICpcbiAgICAgICAgICAgICAgbVJlcy5hbHBoYV9oWzBdW2sgLSAxXTtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBuc3RhdGVzOyBrKyspIHtcbiAgICAgICAgICBtUmVzLmFscGhhX2hbal1ba10gPSAwO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2coZnJvbnQpO1xuXG4gICAgLy89PT09PT09PT09PT09PT09PT09PT09PT09IHVwZGF0ZSBmb3J3YXJkIHZhcmlhYmxlXG4gICAgbVJlcy5leGl0X2xpa2VsaWhvb2QgPSAwO1xuICAgIG1SZXMuaW5zdGFudF9saWtlbGlob29kID0gMDtcblxuICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbnN0YXRlczsgaysrKSB7XG4gICAgICBpZiAoaG0uc2hhcmVkX3BhcmFtZXRlcnMuYmltb2RhbCkge1xuICAgICAgICB0bXAgPSBnbW1VdGlscy5nbW1PYnNQcm9iSW5wdXQob2JzSW4sIG0uc3RhdGVzW2tdKSAqXG4gICAgICAgICAgICBmcm9udFtrXTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIHRtcCA9IGdtbVV0aWxzLmdtbU9ic1Byb2Iob2JzSW4sIG0uc3RhdGVzW2tdKSAqIGZyb250W2tdO1xuICAgICAgfVxuXG4gICAgICBtUmVzLmFscGhhX2hbMl1ba10gPSBobS5leGl0X3RyYW5zaXRpb25baV0gKlxuICAgICAgICAgICAgICAgICBtLmV4aXRQcm9iYWJpbGl0aWVzW2tdICogdG1wO1xuICAgICAgbVJlcy5hbHBoYV9oWzFdW2tdID0gKDEgLSBobS5leGl0X3RyYW5zaXRpb25baV0pICpcbiAgICAgICAgICAgICAgICAgbS5leGl0UHJvYmFiaWxpdGllc1trXSAqIHRtcDtcbiAgICAgIG1SZXMuYWxwaGFfaFswXVtrXSA9ICgxIC0gbS5leGl0UHJvYmFiaWxpdGllc1trXSkgKiB0bXA7XG5cbiAgICAgIG1SZXMuZXhpdF9saWtlbGlob29kICs9IG1SZXMuYWxwaGFfaFsxXVtrXSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtUmVzLmFscGhhX2hbMl1ba107XG4gICAgICBtUmVzLmluc3RhbnRfbGlrZWxpaG9vZCArPSBtUmVzLmFscGhhX2hbMF1ba10gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbVJlcy5hbHBoYV9oWzFdW2tdICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1SZXMuYWxwaGFfaFsyXVtrXTtcblxuICAgICAgbm9ybV9jb25zdCArPSB0bXA7XG4gICAgfVxuXG4gICAgbVJlcy5leGl0X3JhdGlvID0gbVJlcy5leGl0X2xpa2VsaWhvb2QgLyBtUmVzLmluc3RhbnRfbGlrZWxpaG9vZDtcbiAgfVxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IG5vcm1hbGl6ZSBhbHBoYXNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBubW9kZWxzOyBpKyspIHtcbiAgICBmb3IgKGxldCBlID0gMDsgZSA8IDM7IGUrKykge1xuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBobS5tb2RlbHNbaV0ucGFyYW1ldGVycy5zdGF0ZXM7IGsrKykge1xuICAgICAgICBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXS5hbHBoYV9oW2VdW2tdIC89IG5vcm1fY29uc3Q7XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5cbmV4cG9ydCBjb25zdCBoaG1tVXBkYXRlUmVzdWx0cyA9IChobSwgaG1SZXMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBoaG1tVXBkYXRlUmVzdWx0cyA9IChoaG1tLCBoaG1tUmVzKSA9PiB7XG4vLyAgIGNvbnN0IGhtID0gaGhtbTtcbi8vICAgY29uc3QgaG1SZXMgPSBoaG1tUmVzO1xuXG4gIGxldCBtYXhsb2dfbGlrZWxpaG9vZCA9IDA7XG4gIGxldCBub3JtY29uc3RfaW5zdGFudCA9IDA7XG4gIGxldCBub3JtY29uc3Rfc21vb3RoZWQgPSAwO1xuXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaG0ubW9kZWxzLmxlbmd0aDsgaSsrKSB7XG5cbiAgICBsZXQgbVJlcyA9IGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldO1xuXG4gICAgaG1SZXMuaW5zdGFudF9saWtlbGlob29kc1tpXSA9IG1SZXMuaW5zdGFudF9saWtlbGlob29kO1xuICAgIGhtUmVzLnNtb290aGVkX2xvZ19saWtlbGlob29kc1tpXSA9IG1SZXMubG9nX2xpa2VsaWhvb2Q7XG4gICAgaG1SZXMuc21vb3RoZWRfbGlrZWxpaG9vZHNbaV0gPSBNYXRoLmV4cChobVJlcy5zbW9vdGhlZF9sb2dfbGlrZWxpaG9vZHNbaV0pO1xuXG4gICAgaG1SZXMuaW5zdGFudF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzW2ldID0gaG1SZXMuaW5zdGFudF9saWtlbGlob29kc1tpXTtcbiAgICBobVJlcy5zbW9vdGhlZF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzW2ldID0gaG1SZXMuc21vb3RoZWRfbGlrZWxpaG9vZHNbaV07XG5cbiAgICBub3JtY29uc3RfaW5zdGFudCAgICs9IGhtUmVzLmluc3RhbnRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXTtcbiAgICBub3JtY29uc3Rfc21vb3RoZWQgICs9IGhtUmVzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV07XG5cbiAgICBpZiAoaSA9PSAwIHx8IGhtUmVzLnNtb290aGVkX2xvZ19saWtlbGlob29kc1tpXSA+IG1heGxvZ19saWtlbGlob29kKSB7XG4gICAgICBtYXhsb2dfbGlrZWxpaG9vZCA9IGhtUmVzLnNtb290aGVkX2xvZ19saWtlbGlob29kc1tpXTtcbiAgICAgIGhtUmVzLmxpa2VsaWVzdCA9IGk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBobS5tb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBobVJlcy5pbnN0YW50X25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gLz0gbm9ybWNvbnN0X2luc3RhbnQ7XG4gICAgaG1SZXMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSAvPSBub3JtY29uc3Rfc21vb3RoZWQ7XG4gIH1cbn07XG5cblxuZXhwb3J0IGNvbnN0IGhobW1GaWx0ZXIgPSAob2JzSW4sIGhtLCBobVJlcykgPT4ge1xuLy8gZXhwb3J0IGNvbnN0IGhobW1GaWx0ZXIgPSAob2JzSW4sIGhobW0sIGhobW1SZXMpID0+IHtcbi8vICAgY29uc3QgaG0gPSBoaG1tO1xuLy8gICBjb25zdCBobVJlcyA9IGhobW1SZXM7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaGllcmFyY2hpY2FsXG4gIGlmIChobS5jb25maWd1cmF0aW9uLmRlZmF1bHRfcGFyYW1ldGVycy5oaWVyYXJjaGljYWwpIHtcbiAgICBpZiAoaG1SZXMuZm9yd2FyZF9pbml0aWFsaXplZCkge1xuICAgICAgaGhtbUZvcndhcmRVcGRhdGUob2JzSW4sIGhtLCBobVJlcyk7XG4gICAgfSBlbHNlIHtcbiAgICAgIGhobW1Gb3J3YXJkSW5pdChvYnNJbiwgaG0sIGhtUmVzKTtcbiAgICB9XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbm9uLWhpZXJhcmNoaWNhbFxuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaG0ubW9kZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBobVJlcy5pbnN0YW50X2xpa2VsaWhvb2RzW2ldID0gaG1tRmlsdGVyKG9ic0luLCBobSwgaG1SZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0gY29tcHV0ZSB0aW1lIHByb2dyZXNzaW9uXG4gIGZvciAobGV0IGkgPSAwOyBpIDwgaG0ubW9kZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgaG1tVXBkYXRlQWxwaGFXaW5kb3coXG4gICAgICBobS5tb2RlbHNbaV0sXG4gICAgICBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXVxuICAgICk7XG4gICAgaG1tVXBkYXRlUmVzdWx0cyhcbiAgICAgIGhtLm1vZGVsc1tpXSxcbiAgICAgIGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldXG4gICAgKTtcbiAgfVxuXG4gIGhobW1VcGRhdGVSZXN1bHRzKGhtLCBobVJlcyk7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBiaW1vZGFsXG4gIGlmIChobS5zaGFyZWRfcGFyYW1ldGVycy5iaW1vZGFsKSB7XG4gICAgY29uc3QgZGltID0gaG0uc2hhcmVkX3BhcmFtZXRlcnMuZGltZW5zaW9uO1xuICAgIGNvbnN0IGRpbUluID0gaG0uc2hhcmVkX3BhcmFtZXRlcnMuZGltZW5zaW9uX2lucHV0O1xuICAgIGNvbnN0IGRpbU91dCA9IGRpbSAtIGRpbUluO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBobS5tb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGhtbVJlZ3Jlc3Npb24ob2JzSW4sIGhtLm1vZGVsc1tpXSwgaG1SZXMuc2luZ2xlQ2xhc3NIbW1Nb2RlbFJlc3VsdHNbaV0pO1xuICAgIH1cblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBsaWtlbGllc3RcbiAgICBpZiAoaG0uY29uZmlndXJhdGlvbi5tdWx0aUNsYXNzX3JlZ3Jlc3Npb25fZXN0aW1hdG9yID09PSAwKSB7XG4gICAgICBobVJlcy5vdXRwdXRfdmFsdWVzXG4gICAgICAgID0gaG1SZXMuc2luZ2xlQ2xhc3NIbW1Nb2RlbFJlc3VsdHNbaG1SZXMubGlrZWxpZXN0XVxuICAgICAgICAgICAgICAgLm91dHB1dF92YWx1ZXMuc2xpY2UoMCk7XG4gICAgICBobVJlcy5vdXRwdXRfY292YXJpYW5jZVxuICAgICAgICA9IGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2htUmVzLmxpa2VsaWVzdF1cbiAgICAgICAgICAgICAgIC5vdXRwdXRfY292YXJpYW5jZS5zbGljZSgwKTtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBtaXh0dXJlXG4gICAgfSBlbHNlIHtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaG1SZXMub3V0cHV0X3ZhbHVlcy5sZW5ndGg7IGkrKykge1xuICAgICAgICBobVJlcy5vdXRwdXRfdmFsdWVzW2ldID0gMC4wO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBobVJlcy5vdXRwdXRfY292YXJpYW5jZS5sZW5ndGg7IGkrKykge1xuICAgICAgICBobVJlcy5vdXRwdXRfY292YXJpYW5jZVtpXSA9IDAuMDtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBobS5tb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgICAgZm9yIChsZXQgZCA9IDA7IGQgPCBkaW1PdXQ7IGQrKykge1xuICAgICAgICAgIGhtUmVzLm91dHB1dF92YWx1ZXNbZF1cbiAgICAgICAgICAgICs9IGhtUmVzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gKlxuICAgICAgICAgICAgICAgaG1SZXMuc2luZ2xlQ2xhc3NIbW1Nb2RlbFJlc3VsdHNbaV0ub3V0cHV0X3ZhbHVlc1tkXTtcblxuICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZ1bGxcbiAgICAgICAgICBpZiAoaG0uY29uZmlndXJhdGlvbi5jb3ZhcmlhbmNlX21vZGUgPT09IDApIHtcbiAgICAgICAgICAgIGZvciAobGV0IGQyID0gMDsgZDIgPCBkaW1PdXQ7IGQyICsrKSB7XG4gICAgICAgICAgICAgIGhtUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2QgKiBkaW1PdXQgKyBkMl1cbiAgICAgICAgICAgICAgICArPSBobVJlcy5zbW9vdGhlZF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzW2ldICpcbiAgICAgICAgICAgICAgICAgICBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXVxuICAgICAgICAgICAgICAgICAgICAub3V0cHV0X2NvdmFyaWFuY2VbZCAqIGRpbU91dCArIGQyXTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIGhtUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2RdXG4gICAgICAgICAgICAgICs9IGhtUmVzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gKlxuICAgICAgICAgICAgICAgICBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXVxuICAgICAgICAgICAgICAgICAgLm91dHB1dF9jb3ZhcmlhbmNlW2RdO1xuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufTtcbiJdfQ==
