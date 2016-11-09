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

},{"babel-runtime/core-js/object/get-prototype-of":11,"babel-runtime/helpers/classCallCheck":15,"babel-runtime/helpers/createClass":16,"babel-runtime/helpers/get":17,"babel-runtime/helpers/inherits":18,"babel-runtime/helpers/possibleConstructorReturn":19,"waves-lfo/common/core/BaseLfo":107,"xmm-client":110}],2:[function(require,module,exports){
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

},{"babel-runtime/core-js/object/get-prototype-of":11,"babel-runtime/helpers/classCallCheck":15,"babel-runtime/helpers/createClass":16,"babel-runtime/helpers/get":17,"babel-runtime/helpers/inherits":18,"babel-runtime/helpers/possibleConstructorReturn":19,"waves-lfo/common/core/BaseLfo":107,"xmm-client":110}],3:[function(require,module,exports){
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

},{"babel-runtime/core-js/object/get-prototype-of":11,"babel-runtime/helpers/classCallCheck":15,"babel-runtime/helpers/createClass":16,"babel-runtime/helpers/get":17,"babel-runtime/helpers/inherits":18,"babel-runtime/helpers/possibleConstructorReturn":19,"waves-lfo/common/core/BaseLfo":107,"xmm-client":110}],4:[function(require,module,exports){
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
module.exports = { "default": require("core-js/library/fn/json/stringify"), __esModule: true };
},{"core-js/library/fn/json/stringify":21}],6:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/number/is-integer"), __esModule: true };
},{"core-js/library/fn/number/is-integer":22}],7:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/assign"), __esModule: true };
},{"core-js/library/fn/object/assign":23}],8:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/create"), __esModule: true };
},{"core-js/library/fn/object/create":24}],9:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/define-property"), __esModule: true };
},{"core-js/library/fn/object/define-property":25}],10:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-own-property-descriptor"), __esModule: true };
},{"core-js/library/fn/object/get-own-property-descriptor":26}],11:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/get-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/get-prototype-of":27}],12:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/object/set-prototype-of"), __esModule: true };
},{"core-js/library/fn/object/set-prototype-of":28}],13:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol"), __esModule: true };
},{"core-js/library/fn/symbol":29}],14:[function(require,module,exports){
module.exports = { "default": require("core-js/library/fn/symbol/iterator"), __esModule: true };
},{"core-js/library/fn/symbol/iterator":30}],15:[function(require,module,exports){
"use strict";

exports.__esModule = true;

exports.default = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};
},{}],16:[function(require,module,exports){
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
},{"../core-js/object/define-property":9}],17:[function(require,module,exports){
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
},{"../core-js/object/get-own-property-descriptor":10,"../core-js/object/get-prototype-of":11}],18:[function(require,module,exports){
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
},{"../core-js/object/create":8,"../core-js/object/set-prototype-of":12,"../helpers/typeof":20}],19:[function(require,module,exports){
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
},{"../helpers/typeof":20}],20:[function(require,module,exports){
"use strict";

exports.__esModule = true;

var _iterator = require("../core-js/symbol/iterator");

var _iterator2 = _interopRequireDefault(_iterator);

var _symbol = require("../core-js/symbol");

var _symbol2 = _interopRequireDefault(_symbol);

var _typeof = typeof _symbol2.default === "function" && typeof _iterator2.default === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj; };

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.default = typeof _symbol2.default === "function" && _typeof(_iterator2.default) === "symbol" ? function (obj) {
  return typeof obj === "undefined" ? "undefined" : _typeof(obj);
} : function (obj) {
  return obj && typeof _symbol2.default === "function" && obj.constructor === _symbol2.default ? "symbol" : typeof obj === "undefined" ? "undefined" : _typeof(obj);
};
},{"../core-js/symbol":13,"../core-js/symbol/iterator":14}],21:[function(require,module,exports){
var core  = require('../../modules/_core')
  , $JSON = core.JSON || (core.JSON = {stringify: JSON.stringify});
module.exports = function stringify(it){ // eslint-disable-line no-unused-vars
  return $JSON.stringify.apply($JSON, arguments);
};
},{"../../modules/_core":36}],22:[function(require,module,exports){
require('../../modules/es6.number.is-integer');
module.exports = require('../../modules/_core').Number.isInteger;
},{"../../modules/_core":36,"../../modules/es6.number.is-integer":92}],23:[function(require,module,exports){
require('../../modules/es6.object.assign');
module.exports = require('../../modules/_core').Object.assign;
},{"../../modules/_core":36,"../../modules/es6.object.assign":93}],24:[function(require,module,exports){
require('../../modules/es6.object.create');
var $Object = require('../../modules/_core').Object;
module.exports = function create(P, D){
  return $Object.create(P, D);
};
},{"../../modules/_core":36,"../../modules/es6.object.create":94}],25:[function(require,module,exports){
require('../../modules/es6.object.define-property');
var $Object = require('../../modules/_core').Object;
module.exports = function defineProperty(it, key, desc){
  return $Object.defineProperty(it, key, desc);
};
},{"../../modules/_core":36,"../../modules/es6.object.define-property":95}],26:[function(require,module,exports){
require('../../modules/es6.object.get-own-property-descriptor');
var $Object = require('../../modules/_core').Object;
module.exports = function getOwnPropertyDescriptor(it, key){
  return $Object.getOwnPropertyDescriptor(it, key);
};
},{"../../modules/_core":36,"../../modules/es6.object.get-own-property-descriptor":96}],27:[function(require,module,exports){
require('../../modules/es6.object.get-prototype-of');
module.exports = require('../../modules/_core').Object.getPrototypeOf;
},{"../../modules/_core":36,"../../modules/es6.object.get-prototype-of":97}],28:[function(require,module,exports){
require('../../modules/es6.object.set-prototype-of');
module.exports = require('../../modules/_core').Object.setPrototypeOf;
},{"../../modules/_core":36,"../../modules/es6.object.set-prototype-of":98}],29:[function(require,module,exports){
require('../../modules/es6.symbol');
require('../../modules/es6.object.to-string');
require('../../modules/es7.symbol.async-iterator');
require('../../modules/es7.symbol.observable');
module.exports = require('../../modules/_core').Symbol;
},{"../../modules/_core":36,"../../modules/es6.object.to-string":99,"../../modules/es6.symbol":101,"../../modules/es7.symbol.async-iterator":102,"../../modules/es7.symbol.observable":103}],30:[function(require,module,exports){
require('../../modules/es6.string.iterator');
require('../../modules/web.dom.iterable');
module.exports = require('../../modules/_wks-ext').f('iterator');
},{"../../modules/_wks-ext":89,"../../modules/es6.string.iterator":100,"../../modules/web.dom.iterable":104}],31:[function(require,module,exports){
module.exports = function(it){
  if(typeof it != 'function')throw TypeError(it + ' is not a function!');
  return it;
};
},{}],32:[function(require,module,exports){
module.exports = function(){ /* empty */ };
},{}],33:[function(require,module,exports){
var isObject = require('./_is-object');
module.exports = function(it){
  if(!isObject(it))throw TypeError(it + ' is not an object!');
  return it;
};
},{"./_is-object":53}],34:[function(require,module,exports){
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
},{"./_to-index":81,"./_to-iobject":83,"./_to-length":84}],35:[function(require,module,exports){
var toString = {}.toString;

module.exports = function(it){
  return toString.call(it).slice(8, -1);
};
},{}],36:[function(require,module,exports){
var core = module.exports = {version: '2.4.0'};
if(typeof __e == 'number')__e = core; // eslint-disable-line no-undef
},{}],37:[function(require,module,exports){
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
},{"./_a-function":31}],38:[function(require,module,exports){
// 7.2.1 RequireObjectCoercible(argument)
module.exports = function(it){
  if(it == undefined)throw TypeError("Can't call method on  " + it);
  return it;
};
},{}],39:[function(require,module,exports){
// Thank's IE8 for his funny defineProperty
module.exports = !require('./_fails')(function(){
  return Object.defineProperty({}, 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_fails":44}],40:[function(require,module,exports){
var isObject = require('./_is-object')
  , document = require('./_global').document
  // in old IE typeof document.createElement is 'object'
  , is = isObject(document) && isObject(document.createElement);
module.exports = function(it){
  return is ? document.createElement(it) : {};
};
},{"./_global":45,"./_is-object":53}],41:[function(require,module,exports){
// IE 8- don't enum bug keys
module.exports = (
  'constructor,hasOwnProperty,isPrototypeOf,propertyIsEnumerable,toLocaleString,toString,valueOf'
).split(',');
},{}],42:[function(require,module,exports){
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
},{"./_object-gops":68,"./_object-keys":71,"./_object-pie":72}],43:[function(require,module,exports){
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
},{"./_core":36,"./_ctx":37,"./_global":45,"./_hide":47}],44:[function(require,module,exports){
module.exports = function(exec){
  try {
    return !!exec();
  } catch(e){
    return true;
  }
};
},{}],45:[function(require,module,exports){
// https://github.com/zloirock/core-js/issues/86#issuecomment-115759028
var global = module.exports = typeof window != 'undefined' && window.Math == Math
  ? window : typeof self != 'undefined' && self.Math == Math ? self : Function('return this')();
if(typeof __g == 'number')__g = global; // eslint-disable-line no-undef
},{}],46:[function(require,module,exports){
var hasOwnProperty = {}.hasOwnProperty;
module.exports = function(it, key){
  return hasOwnProperty.call(it, key);
};
},{}],47:[function(require,module,exports){
var dP         = require('./_object-dp')
  , createDesc = require('./_property-desc');
module.exports = require('./_descriptors') ? function(object, key, value){
  return dP.f(object, key, createDesc(1, value));
} : function(object, key, value){
  object[key] = value;
  return object;
};
},{"./_descriptors":39,"./_object-dp":63,"./_property-desc":74}],48:[function(require,module,exports){
module.exports = require('./_global').document && document.documentElement;
},{"./_global":45}],49:[function(require,module,exports){
module.exports = !require('./_descriptors') && !require('./_fails')(function(){
  return Object.defineProperty(require('./_dom-create')('div'), 'a', {get: function(){ return 7; }}).a != 7;
});
},{"./_descriptors":39,"./_dom-create":40,"./_fails":44}],50:[function(require,module,exports){
// fallback for non-array-like ES3 and non-enumerable old V8 strings
var cof = require('./_cof');
module.exports = Object('z').propertyIsEnumerable(0) ? Object : function(it){
  return cof(it) == 'String' ? it.split('') : Object(it);
};
},{"./_cof":35}],51:[function(require,module,exports){
// 7.2.2 IsArray(argument)
var cof = require('./_cof');
module.exports = Array.isArray || function isArray(arg){
  return cof(arg) == 'Array';
};
},{"./_cof":35}],52:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var isObject = require('./_is-object')
  , floor    = Math.floor;
module.exports = function isInteger(it){
  return !isObject(it) && isFinite(it) && floor(it) === it;
};
},{"./_is-object":53}],53:[function(require,module,exports){
module.exports = function(it){
  return typeof it === 'object' ? it !== null : typeof it === 'function';
};
},{}],54:[function(require,module,exports){
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
},{"./_hide":47,"./_object-create":62,"./_property-desc":74,"./_set-to-string-tag":77,"./_wks":90}],55:[function(require,module,exports){
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
},{"./_export":43,"./_has":46,"./_hide":47,"./_iter-create":54,"./_iterators":57,"./_library":59,"./_object-gpo":69,"./_redefine":75,"./_set-to-string-tag":77,"./_wks":90}],56:[function(require,module,exports){
module.exports = function(done, value){
  return {value: value, done: !!done};
};
},{}],57:[function(require,module,exports){
module.exports = {};
},{}],58:[function(require,module,exports){
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
},{"./_object-keys":71,"./_to-iobject":83}],59:[function(require,module,exports){
module.exports = true;
},{}],60:[function(require,module,exports){
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
},{"./_fails":44,"./_has":46,"./_is-object":53,"./_object-dp":63,"./_uid":87}],61:[function(require,module,exports){
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
},{"./_fails":44,"./_iobject":50,"./_object-gops":68,"./_object-keys":71,"./_object-pie":72,"./_to-object":85}],62:[function(require,module,exports){
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

},{"./_an-object":33,"./_dom-create":40,"./_enum-bug-keys":41,"./_html":48,"./_object-dps":64,"./_shared-key":78}],63:[function(require,module,exports){
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
},{"./_an-object":33,"./_descriptors":39,"./_ie8-dom-define":49,"./_to-primitive":86}],64:[function(require,module,exports){
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
},{"./_an-object":33,"./_descriptors":39,"./_object-dp":63,"./_object-keys":71}],65:[function(require,module,exports){
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
},{"./_descriptors":39,"./_has":46,"./_ie8-dom-define":49,"./_object-pie":72,"./_property-desc":74,"./_to-iobject":83,"./_to-primitive":86}],66:[function(require,module,exports){
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

},{"./_object-gopn":67,"./_to-iobject":83}],67:[function(require,module,exports){
// 19.1.2.7 / 15.2.3.4 Object.getOwnPropertyNames(O)
var $keys      = require('./_object-keys-internal')
  , hiddenKeys = require('./_enum-bug-keys').concat('length', 'prototype');

exports.f = Object.getOwnPropertyNames || function getOwnPropertyNames(O){
  return $keys(O, hiddenKeys);
};
},{"./_enum-bug-keys":41,"./_object-keys-internal":70}],68:[function(require,module,exports){
exports.f = Object.getOwnPropertySymbols;
},{}],69:[function(require,module,exports){
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
},{"./_has":46,"./_shared-key":78,"./_to-object":85}],70:[function(require,module,exports){
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
},{"./_array-includes":34,"./_has":46,"./_shared-key":78,"./_to-iobject":83}],71:[function(require,module,exports){
// 19.1.2.14 / 15.2.3.14 Object.keys(O)
var $keys       = require('./_object-keys-internal')
  , enumBugKeys = require('./_enum-bug-keys');

module.exports = Object.keys || function keys(O){
  return $keys(O, enumBugKeys);
};
},{"./_enum-bug-keys":41,"./_object-keys-internal":70}],72:[function(require,module,exports){
exports.f = {}.propertyIsEnumerable;
},{}],73:[function(require,module,exports){
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
},{"./_core":36,"./_export":43,"./_fails":44}],74:[function(require,module,exports){
module.exports = function(bitmap, value){
  return {
    enumerable  : !(bitmap & 1),
    configurable: !(bitmap & 2),
    writable    : !(bitmap & 4),
    value       : value
  };
};
},{}],75:[function(require,module,exports){
module.exports = require('./_hide');
},{"./_hide":47}],76:[function(require,module,exports){
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
},{"./_an-object":33,"./_ctx":37,"./_is-object":53,"./_object-gopd":65}],77:[function(require,module,exports){
var def = require('./_object-dp').f
  , has = require('./_has')
  , TAG = require('./_wks')('toStringTag');

module.exports = function(it, tag, stat){
  if(it && !has(it = stat ? it : it.prototype, TAG))def(it, TAG, {configurable: true, value: tag});
};
},{"./_has":46,"./_object-dp":63,"./_wks":90}],78:[function(require,module,exports){
var shared = require('./_shared')('keys')
  , uid    = require('./_uid');
module.exports = function(key){
  return shared[key] || (shared[key] = uid(key));
};
},{"./_shared":79,"./_uid":87}],79:[function(require,module,exports){
var global = require('./_global')
  , SHARED = '__core-js_shared__'
  , store  = global[SHARED] || (global[SHARED] = {});
module.exports = function(key){
  return store[key] || (store[key] = {});
};
},{"./_global":45}],80:[function(require,module,exports){
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
},{"./_defined":38,"./_to-integer":82}],81:[function(require,module,exports){
var toInteger = require('./_to-integer')
  , max       = Math.max
  , min       = Math.min;
module.exports = function(index, length){
  index = toInteger(index);
  return index < 0 ? max(index + length, 0) : min(index, length);
};
},{"./_to-integer":82}],82:[function(require,module,exports){
// 7.1.4 ToInteger
var ceil  = Math.ceil
  , floor = Math.floor;
module.exports = function(it){
  return isNaN(it = +it) ? 0 : (it > 0 ? floor : ceil)(it);
};
},{}],83:[function(require,module,exports){
// to indexed object, toObject with fallback for non-array-like ES3 strings
var IObject = require('./_iobject')
  , defined = require('./_defined');
module.exports = function(it){
  return IObject(defined(it));
};
},{"./_defined":38,"./_iobject":50}],84:[function(require,module,exports){
// 7.1.15 ToLength
var toInteger = require('./_to-integer')
  , min       = Math.min;
module.exports = function(it){
  return it > 0 ? min(toInteger(it), 0x1fffffffffffff) : 0; // pow(2, 53) - 1 == 9007199254740991
};
},{"./_to-integer":82}],85:[function(require,module,exports){
// 7.1.13 ToObject(argument)
var defined = require('./_defined');
module.exports = function(it){
  return Object(defined(it));
};
},{"./_defined":38}],86:[function(require,module,exports){
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
},{"./_is-object":53}],87:[function(require,module,exports){
var id = 0
  , px = Math.random();
module.exports = function(key){
  return 'Symbol('.concat(key === undefined ? '' : key, ')_', (++id + px).toString(36));
};
},{}],88:[function(require,module,exports){
var global         = require('./_global')
  , core           = require('./_core')
  , LIBRARY        = require('./_library')
  , wksExt         = require('./_wks-ext')
  , defineProperty = require('./_object-dp').f;
module.exports = function(name){
  var $Symbol = core.Symbol || (core.Symbol = LIBRARY ? {} : global.Symbol || {});
  if(name.charAt(0) != '_' && !(name in $Symbol))defineProperty($Symbol, name, {value: wksExt.f(name)});
};
},{"./_core":36,"./_global":45,"./_library":59,"./_object-dp":63,"./_wks-ext":89}],89:[function(require,module,exports){
exports.f = require('./_wks');
},{"./_wks":90}],90:[function(require,module,exports){
var store      = require('./_shared')('wks')
  , uid        = require('./_uid')
  , Symbol     = require('./_global').Symbol
  , USE_SYMBOL = typeof Symbol == 'function';

var $exports = module.exports = function(name){
  return store[name] || (store[name] =
    USE_SYMBOL && Symbol[name] || (USE_SYMBOL ? Symbol : uid)('Symbol.' + name));
};

$exports.store = store;
},{"./_global":45,"./_shared":79,"./_uid":87}],91:[function(require,module,exports){
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
},{"./_add-to-unscopables":32,"./_iter-define":55,"./_iter-step":56,"./_iterators":57,"./_to-iobject":83}],92:[function(require,module,exports){
// 20.1.2.3 Number.isInteger(number)
var $export = require('./_export');

$export($export.S, 'Number', {isInteger: require('./_is-integer')});
},{"./_export":43,"./_is-integer":52}],93:[function(require,module,exports){
// 19.1.3.1 Object.assign(target, source)
var $export = require('./_export');

$export($export.S + $export.F, 'Object', {assign: require('./_object-assign')});
},{"./_export":43,"./_object-assign":61}],94:[function(require,module,exports){
var $export = require('./_export')
// 19.1.2.2 / 15.2.3.5 Object.create(O [, Properties])
$export($export.S, 'Object', {create: require('./_object-create')});
},{"./_export":43,"./_object-create":62}],95:[function(require,module,exports){
var $export = require('./_export');
// 19.1.2.4 / 15.2.3.6 Object.defineProperty(O, P, Attributes)
$export($export.S + $export.F * !require('./_descriptors'), 'Object', {defineProperty: require('./_object-dp').f});
},{"./_descriptors":39,"./_export":43,"./_object-dp":63}],96:[function(require,module,exports){
// 19.1.2.6 Object.getOwnPropertyDescriptor(O, P)
var toIObject                 = require('./_to-iobject')
  , $getOwnPropertyDescriptor = require('./_object-gopd').f;

require('./_object-sap')('getOwnPropertyDescriptor', function(){
  return function getOwnPropertyDescriptor(it, key){
    return $getOwnPropertyDescriptor(toIObject(it), key);
  };
});
},{"./_object-gopd":65,"./_object-sap":73,"./_to-iobject":83}],97:[function(require,module,exports){
// 19.1.2.9 Object.getPrototypeOf(O)
var toObject        = require('./_to-object')
  , $getPrototypeOf = require('./_object-gpo');

require('./_object-sap')('getPrototypeOf', function(){
  return function getPrototypeOf(it){
    return $getPrototypeOf(toObject(it));
  };
});
},{"./_object-gpo":69,"./_object-sap":73,"./_to-object":85}],98:[function(require,module,exports){
// 19.1.3.19 Object.setPrototypeOf(O, proto)
var $export = require('./_export');
$export($export.S, 'Object', {setPrototypeOf: require('./_set-proto').set});
},{"./_export":43,"./_set-proto":76}],99:[function(require,module,exports){

},{}],100:[function(require,module,exports){
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
},{"./_iter-define":55,"./_string-at":80}],101:[function(require,module,exports){
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
},{"./_an-object":33,"./_descriptors":39,"./_enum-keys":42,"./_export":43,"./_fails":44,"./_global":45,"./_has":46,"./_hide":47,"./_is-array":51,"./_keyof":58,"./_library":59,"./_meta":60,"./_object-create":62,"./_object-dp":63,"./_object-gopd":65,"./_object-gopn":67,"./_object-gopn-ext":66,"./_object-gops":68,"./_object-keys":71,"./_object-pie":72,"./_property-desc":74,"./_redefine":75,"./_set-to-string-tag":77,"./_shared":79,"./_to-iobject":83,"./_to-primitive":86,"./_uid":87,"./_wks":90,"./_wks-define":88,"./_wks-ext":89}],102:[function(require,module,exports){
require('./_wks-define')('asyncIterator');
},{"./_wks-define":88}],103:[function(require,module,exports){
require('./_wks-define')('observable');
},{"./_wks-define":88}],104:[function(require,module,exports){
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
},{"./_global":45,"./_hide":47,"./_iterators":57,"./_wks":90,"./es6.array.iterator":91}],105:[function(require,module,exports){
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

},{}],106:[function(require,module,exports){
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

},{"./paramTemplates":105}],107:[function(require,module,exports){
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

},{"babel-runtime/core-js/object/assign":7,"babel-runtime/helpers/classCallCheck":15,"babel-runtime/helpers/createClass":16,"parameters":106}],108:[function(require,module,exports){
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
   * @param {GmmResultsCallback} resultsCallback - The callback handling the estimation results.
   */


  (0, _createClass3.default)(GmmDecoder, [{
    key: 'filter',
    value: function filter(observation, resultsCallback) {
      var err = null;
      var res = null;

      if (this._model === undefined) {
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

      resultsCallback(err, res);
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
  }]);
  return GmmDecoder;
}();

;

exports.default = GmmDecoder;

},{"../utils/gmm-utils":112,"babel-runtime/core-js/json/stringify":5,"babel-runtime/helpers/classCallCheck":15,"babel-runtime/helpers/createClass":16}],109:[function(require,module,exports){
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
   * @param {HhmmResultsCallback} resultsCallback - The callback handling the estimation results.
   */


  (0, _createClass3.default)(HhmmDecoder, [{
    key: 'filter',
    value: function filter(observation, resultsCallback) {
      var err = null;
      var res = null;

      if (this._model === undefined) {
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

      resultsCallback(err, res);
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
  }]);
  return HhmmDecoder;
}();

;

exports.default = HhmmDecoder;

},{"../utils/hhmm-utils":113,"babel-runtime/core-js/json/stringify":5,"babel-runtime/helpers/classCallCheck":15,"babel-runtime/helpers/createClass":16}],110:[function(require,module,exports){
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

var _xmmPhrase = require('./phrase/xmm-phrase');

Object.defineProperty(exports, 'PhraseMaker', {
  enumerable: true,
  get: function get() {
    return _interopRequireDefault(_xmmPhrase).default;
  }
});

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

},{"./gmm/gmm-decoder":108,"./hhmm/hhmm-decoder":109,"./phrase/xmm-phrase":111}],111:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _isInteger = require('babel-runtime/core-js/number/is-integer');

var _isInteger2 = _interopRequireDefault(_isInteger);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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
  * @property {Number} dimension_input - Size of the part of an input vector element that should be used for training.
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
			dimension_input: 0,
			column_names: [''],
			label: ''
		};
		(0, _assign2.default)(defaults, options);
		this._config = {};
		this._setConfig(options);

		this.reset();
	}

	/**
  * XMM phrase configuration object.
  * Only legal fields will be checked before being added to the config, others will be ignored
  * @type {XmmPhraseConfig}
  */


	(0, _createClass3.default)(PhraseMaker, [{
		key: 'addObservation',


		/**
   * Append an observation vector to the phrase's data. Must be of length <code>dimension</code>.
   * @param {Array.Number} obs - An input vector, aka observation. If <code>bimodal</code> is true
   * @throws Will throw an error if the input vector doesn't match the config.
   */
		value: function addObservation(obs) {
			if (obs.length !== this._config.dimension || typeof obs === 'number' && this._config.dimension !== 1) {
				console.error('error : incoming observation length not matching with dimensions');
				throw 'BadVectorSizeException';
				return;
			}

			if (this._config.bimodal) {
				this._data_in = this._data_in.concat(obs.slice(0, this._config.dimension_input));
				this._data_out = this._data_out.concat(obs.slice(this._config.dimension_input));
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
			this._data_in = [];
			this._data_out = [];
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
				} else if (prop === 'dimension_input' && (0, _isInteger2.default)(options[prop])) {
					this._config[prop] = options[prop];
				} else if (prop === 'column_names' && Array.isArray(options[prop])) {
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
		key: 'phrase',
		get: function get() {
			return {
				bimodal: this._config.bimodal,
				column_names: this._config.column_names,
				dimension: this._config.dimension,
				dimension_input: this._config.dimension_input,
				label: this._config.label,
				data: this._data.slice(0),
				data_input: this._data_in.slice(0),
				data_output: this._data_out.slice(0),
				length: this._config.bimodal ? this._data_in.length / this._config.dimension_input : this._data.length / this._config.dimension
			};
		}
	}]);
	return PhraseMaker;
}();

;

exports.default = PhraseMaker;

},{"babel-runtime/core-js/number/is-integer":6,"babel-runtime/core-js/object/assign":7,"babel-runtime/helpers/classCallCheck":15,"babel-runtime/helpers/createClass":16}],112:[function(require,module,exports){
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

},{}],113:[function(require,module,exports){
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

},{"./gmm-utils":112}]},{},[4])(4)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJkaXN0L0dtbURlY29kZXJMZm8uanMiLCJkaXN0L0hobW1EZWNvZGVyTGZvLmpzIiwiZGlzdC9QaHJhc2VSZWNvcmRlckxmby5qcyIsImRpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL2pzb24vc3RyaW5naWZ5LmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9udW1iZXIvaXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2Fzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2NyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvY29yZS1qcy9zeW1ib2wuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9jb3JlLWpzL3N5bWJvbC9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9iYWJlbC1ydW50aW1lL2hlbHBlcnMvY2xhc3NDYWxsQ2hlY2suanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2NyZWF0ZUNsYXNzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9nZXQuanMiLCJub2RlX21vZHVsZXMvYmFiZWwtcnVudGltZS9oZWxwZXJzL2luaGVyaXRzLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy9wb3NzaWJsZUNvbnN0cnVjdG9yUmV0dXJuLmpzIiwibm9kZV9tb2R1bGVzL2JhYmVsLXJ1bnRpbWUvaGVscGVycy90eXBlb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL2pzb24vc3RyaW5naWZ5LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9udW1iZXIvaXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2NyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2RlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9mbi9zeW1ib2wvaW5kZXguanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L2ZuL3N5bWJvbC9pdGVyYXRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYS1mdW5jdGlvbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fYWRkLXRvLXVuc2NvcGFibGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19hbi1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2FycmF5LWluY2x1ZGVzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19jb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2NvcmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2N0eC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVmaW5lZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZGVzY3JpcHRvcnMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2RvbS1jcmVhdGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0tYnVnLWtleXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2VudW0ta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZXhwb3J0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19mYWlscy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fZ2xvYmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19oYXMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2hpZGUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2h0bWwuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2llOC1kb20tZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pcy1hcnJheS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXMtb2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19pdGVyLWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlci1kZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX2l0ZXItc3RlcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9faXRlcmF0b3JzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19rZXlvZi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbGlicmFyeS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fbWV0YS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWRwLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZHBzLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcG4tZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3QtZ29wbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LWdvcHMuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1ncG8uanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX29iamVjdC1rZXlzLWludGVybmFsLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL19vYmplY3Qta2V5cy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXBpZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fb2JqZWN0LXNhcC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcHJvcGVydHktZGVzYy5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fcmVkZWZpbmUuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NldC1wcm90by5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc2V0LXRvLXN0cmluZy10YWcuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC1rZXkuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3NoYXJlZC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fc3RyaW5nLWF0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8taW9iamVjdC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdG8tbGVuZ3RoLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL190by1vYmplY3QuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvX3RvLXByaW1pdGl2ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9fdWlkLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZGVmaW5lLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MtZXh0LmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL193a3MuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LmFycmF5Lml0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5udW1iZXIuaXMtaW50ZWdlci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmFzc2lnbi5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmNyZWF0ZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmRlZmluZS1wcm9wZXJ0eS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmdldC1vd24tcHJvcGVydHktZGVzY3JpcHRvci5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczYub2JqZWN0LmdldC1wcm90b3R5cGUtb2YuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNi5zdHJpbmcuaXRlcmF0b3IuanMiLCJub2RlX21vZHVsZXMvY29yZS1qcy9saWJyYXJ5L21vZHVsZXMvZXM2LnN5bWJvbC5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy9lczcuc3ltYm9sLmFzeW5jLWl0ZXJhdG9yLmpzIiwibm9kZV9tb2R1bGVzL2NvcmUtanMvbGlicmFyeS9tb2R1bGVzL2VzNy5zeW1ib2wub2JzZXJ2YWJsZS5qcyIsIm5vZGVfbW9kdWxlcy9jb3JlLWpzL2xpYnJhcnkvbW9kdWxlcy93ZWIuZG9tLml0ZXJhYmxlLmpzIiwibm9kZV9tb2R1bGVzL3BhcmFtZXRlcnMvZGlzdC9wYXJhbVRlbXBsYXRlcy5qcyIsIm5vZGVfbW9kdWxlcy9wYXJhbWV0ZXJzL2Rpc3QvcGFyYW1ldGVycy5qcyIsIm5vZGVfbW9kdWxlcy93YXZlcy1sZm8vY29tbW9uL2NvcmUvQmFzZUxmby5qcyIsIm5vZGVfbW9kdWxlcy94bW0tY2xpZW50L2Rpc3QvZ21tL2dtbS1kZWNvZGVyLmpzIiwibm9kZV9tb2R1bGVzL3htbS1jbGllbnQvZGlzdC9oaG1tL2hobW0tZGVjb2Rlci5qcyIsIm5vZGVfbW9kdWxlcy94bW0tY2xpZW50L2Rpc3QvaW5kZXguanMiLCJub2RlX21vZHVsZXMveG1tLWNsaWVudC9kaXN0L3BocmFzZS94bW0tcGhyYXNlLmpzIiwibm9kZV9tb2R1bGVzL3htbS1jbGllbnQvZGlzdC91dGlscy9nbW0tdXRpbHMuanMiLCJub2RlX21vZHVsZXMveG1tLWNsaWVudC9kaXN0L3V0aWxzL2hobW0tdXRpbHMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6IkFBQUE7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUNBQTs7OztBQUNBOzs7O0FBR0EsSUFBTSxjQUFjO0FBQ2xCLFNBQU87QUFDTCxVQUFNLEtBREQ7QUFFTCxhQUFTLElBRko7QUFHTCxjQUFVLElB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QTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTs7QUNEQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7O0FDREE7QUFDQTs7QUNEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNwQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNKQTtBQUNBOztBQ0RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDbkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTkE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2RBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQzVEQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDSkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTs7QUNGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNyRUE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1RBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDcERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNmQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25CQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNaQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNUQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1BBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2hCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNOQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDTEE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0xBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNMQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNYQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ0pBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTs7QUNBQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ1ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7QUFDQTs7QUNIQTtBQUNBO0FBQ0E7O0FDRkE7QUFDQTtBQUNBOztBQ0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNSQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDUkE7QUFDQTtBQUNBOztBQ0ZBOztBQ0FBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDaEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FB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LElBQUksTUFBcEIsRUFBNEIsR0FBNUIsRUFBaUM7QUFDL0IsZ0JBQU0sYUFBTixDQUFvQixDQUFwQixLQUNLLE1BQU0sK0JBQU4sQ0FBc0MsSUFBdEMsSUFDQSxNQUFNLDBCQUFOLENBQWlDLElBQWpDLEVBQW9DLGFBQXBDLENBQWtELENBQWxELENBRkw7O0FBSUE7QUFDQSxjQUFJLEdBQUcsYUFBSCxDQUFpQixlQUFqQixLQUFxQyxDQUF6QyxFQUE0QztBQUMxQyxpQkFBSyxJQUFJLEtBQUssQ0FBZCxFQUFpQixLQUFLLE1BQXRCLEVBQThCLElBQTlCLEVBQXFDO0FBQ25DLG9CQUFNLGlCQUFOLENBQXdCLElBQUksTUFBSixHQUFhLEVBQXJDLEtBQ0ssTUFBTSwrQkFBTixDQUFzQyxJQUF0QyxJQUNBLE1BQU0sMEJBQU4sQ0FBaUMsSUFBakMsRUFDRSxpQkFERixDQUNvQixJQUFJLE1BQUosR0FBYSxFQURqQyxDQUZMO0FBSUQ7QUFDSDtBQUNDLFdBUkQsTUFRTztBQUNMLGtCQUFNLGlCQUFOLENBQXdCLENBQXhCLEtBQ0ssTUFBTSwrQkFBTixDQUFzQyxJQUF0QyxJQUNBLE1BQU0sMEJBQU4sQ0FBaUMsSUFBakMsRUFDRSxpQkFERixDQUNvQixDQURwQixDQUZMO0FBSUQ7QUFDRjtBQUNGO0FBQ0Y7QUFDRjtBQUNGLENBckZNIiwiZmlsZSI6ImdlbmVyYXRlZC5qcyIsInNvdXJjZVJvb3QiOiIiLCJzb3VyY2VzQ29udGVudCI6WyIoZnVuY3Rpb24gZSh0LG4scil7ZnVuY3Rpb24gcyhvLHUpe2lmKCFuW29dKXtpZighdFtvXSl7dmFyIGE9dHlwZW9mIHJlcXVpcmU9PVwiZnVuY3Rpb25cIiYmcmVxdWlyZTtpZighdSYmYSlyZXR1cm4gYShvLCEwKTtpZihpKXJldHVybiBpKG8sITApO3ZhciBmPW5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIrbytcIidcIik7dGhyb3cgZi5jb2RlPVwiTU9EVUxFX05PVF9GT1VORFwiLGZ9dmFyIGw9bltvXT17ZXhwb3J0czp7fX07dFtvXVswXS5jYWxsKGwuZXhwb3J0cyxmdW5jdGlvbihlKXt2YXIgbj10W29dWzFdW2VdO3JldHVybiBzKG4/bjplKX0sbCxsLmV4cG9ydHMsZSx0LG4scil9cmV0dXJuIG5bb10uZXhwb3J0c312YXIgaT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2Zvcih2YXIgbz0wO288ci5sZW5ndGg7bysrKXMocltvXSk7cmV0dXJuIHN9KSIsImltcG9ydCBCYXNlTGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24vY29yZS9CYXNlTGZvJztcbmltcG9ydCB7IEdtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbW9kZWw6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sIFxuICBsaWtlbGlob29kV2luZG93OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIwLFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDFlMzAsXG4gIH0sXG4gIG91dHB1dDoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbGlrZWxpaG9vZHMnLFxuICAgIGxpc3Q6IFsnbGlrZWxpaG9vZHMnLCAncmVncmVzc2lvbiddLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cblxuLyoqXG4gKiBMZm8gY2xhc3MgbG9hZGluZyBHTU0gbW9kZWxzIGNyZWF0ZWQgYnkgdGhlIHhtbSBsaWJyYXJ5IHRvIHByb2Nlc3MgYW4gaW5wdXRcbiAqIHN0cmVhbSBvZiB2ZWN0b3JzIChtb2RlbHMgbXVzdCBoYXZlIGJlZW4gdHJhaW5lZCBmcm9tIHRoZSBzYW1lIGlucHV0IHN0cmVhbSkuXG4gKiBBcyB0aGUgcmVzdWx0cyBvZiB0aGUgY2xhc3NpZmljYXRpb24gLyByZWdyZXNzaW9uIGFyZSBtb3JlIGNvbXBsZXggdGhhbiBhXG4gKiBzaW1wbGUgdmVjdG9yLCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbiBiZSBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yIHRvIGhhbmRsZVxuICogdGhlbSwgb3IgdGhleSBjYW4gYWx0ZXJuYXRpdmVseSBiZSBxdWVyaWVkIHZpYSB0aGUgcmVhZG9ubHkgZmlsdGVyUmVzdWx0c1xuICogcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0cy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5tb2RlbD1udWxsXSAtIE1vZGVsIGNvbW1pbmcgZnJvbSAuLi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5saWtlbGlob29kV2luZG93PTIwXSAtIE51bWJlciBvZiBsaWxpa2VsaWhvb2RcbiAqL1xuY2xhc3MgR21tRGVjb2RlckxmbyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyID0gbmV3IEdtbURlY29kZXIodGhpcy5wYXJhbXMubGlrZWxpaG9vZFdpbmRvdyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2xpa2VsaWhvb2RXaW5kb3cnKSB7XG4gICAgICB0aGlzLl9kZWNvZGVyLmxpa2VsaWhvb2RXaW5kb3cgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyLm1vZGVsID0gdGhpcy5wYXJhbXMuZ2V0KCdtb2RlbCcpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIubmJDbGFzc2VzO1xuICAgIH0gZWxzZSB7IC8vID09PSAncmVncmVzc2lvbidcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIucmVncmVzc2lvblNpemU7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgdGhpcy5fZGVjb2Rlci5maWx0ZXIoZnJhbWUsIChlcnIsIHJlcykgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG4gICAgICBjb25zdCByZXNEYXRhID0gcmVzLmxpa2VsaWhvb2RzO1xuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgICAgICBkYXRhW2ldID0gcmVzRGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoZnJhbWUpO1xuICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgR21tRGVjb2RlckxmbzsiLCJpbXBvcnQgQmFzZUxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG5pbXBvcnQgeyBIaG1tRGVjb2RlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBtb2RlbDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSwgXG4gIGxpa2VsaWhvb2RXaW5kb3c6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjAsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWUzMCxcbiAgfSxcbiAgb3V0cHV0OiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGRlZmF1bHQ6ICdsaWtlbGlob29kcycsXG4gICAgbGlzdDogWydsaWtlbGlob29kcycsICdyZWdyZXNzaW9uJ10sXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfVxufTtcblxuXG4vKipcbiAqIExmbyBjbGFzcyBsb2FkaW5nIEhpZXJhcmNoaWNhbCBITU0gbW9kZWxzIGNyZWF0ZWQgYnkgdGhlIHhtbSBsaWJyYXJ5IHRvXG4gKiBwcm9jZXNzIGFuIGlucHV0IHN0cmVhbSBvZiB2ZWN0b3JzIChtb2RlbHMgbXVzdCBoYXZlIGJlZW4gdHJhaW5lZCBmcm9tIHRoZVxuICogc2FtZSBpbnB1dCBzdHJlYW0pLlxuICogQXMgdGhlIHJlc3VsdHMgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIC8gZm9sbG93aW5nIC8gcmVncmVzc2lvbiBhcmUgbW9yZVxuICogY29tcGxleCB0aGFuIGEgc2ltcGxlIHZlY3RvciwgYSBjYWxsYmFjayBmdW5jdGlvbiBjYW4gYmUgcGFzc2VkIHRvIHRoZVxuICogY29uc3RydWN0b3IgdG8gaGFuZGxlIHRoZW0sIG9yIHRoZXkgY2FuIGFsdGVybmF0aXZlbHkgYmUgcXVlcmllZCB2aWEgdGhlXG4gKiByZWFkb25seSBmaWx0ZXJSZXN1bHRzIHByb3BlcnR5LlxuICogQGNsYXNzXG4gKi9cbmNsYXNzIEhobW1EZWNvZGVyTGZvIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2RlY29kZXIgPSBuZXcgSGhtbURlY29kZXIodGhpcy5wYXJhbXMubGlrZWxpaG9vZFdpbmRvdyk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBpbnRlcm1lZGlhdGUgcmVzdWx0cyBvZiB0aGUgZXN0aW1hdGlvbi5cbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2RlY29kZXIucmVzZXQoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGlmIChuYW1lID09PSAnbGlrZWxpaG9vZFdpbmRvdycpIHtcbiAgICAgIHRoaXMuX2RlY29kZXIuc2V0TGlrZWxpaG9vZFdpbmRvdyh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5fZGVjb2Rlci5tb2RlbCA9IHRoaXMucGFyYW1zLmdldCgnbW9kZWwnKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLm5iQ2xhc3NlcztcbiAgICB9IGVsc2UgeyAvLyA9PT0gJ3JlZ3Jlc3Npb24nXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLnJlZ3Jlc3Npb25TaXplO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIHRoaXMuX2RlY29kZXIuZmlsdGVyKGZyYW1lLCAoZXJyLCByZXMpID0+IHtcbiAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdjYWxsYmFjaycpO1xuICAgICAgY29uc3QgcmVzRGF0YSA9IHJlcy5saWtlbGlob29kcztcbiAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICAgIGlmIChlcnIgPT0gbnVsbCkge1xuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICAgICAgZGF0YVtpXSA9IHJlc0RhdGFbaV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKGZyYW1lKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEhobW1EZWNvZGVyTGZvOyIsImltcG9ydCBCYXNlTGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24vY29yZS9CYXNlTGZvJztcbmltcG9ydCB7IFBocmFzZU1ha2VyIH0gZnJvbSAneG1tLWNsaWVudCc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBiaW1vZGFsOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlXG4gIH0sXG4gIGRpbWVuc2lvbklucHV0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWVcbiAgfSxcbiAgY29sdW1uTmFtZXM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBbJyddLFxuICAgIGNvbnN0YW50OiB0cnVlXG4gIH0sXG59O1xuXG4vLyB1bmNvbW1lbnQgdGhpcyBhbmQgYWRkIHRvIG90aGVyIHhtbS1sZm8ncyB3aGVuIGxmbyBpcyBleHBvc2VkIGluIC9jb21tb24gYXMgd2VsbFxuLy8gb3IgdXNlIGNsaWVudCA/IChpdCdzIHZlcnkgbGlrZWx5IHRoYXQgd2Ugd29uJ3QgcnVuIHRoZXNlIGxmbydzIHNlcnZlci1zaWRlKVxuLy8gaWYgKGxmby52ZXJzaW9uIDwgJzEuMC4wJylcbi8vICB0aHJvdyBuZXcgRXJyb3IoJycpXG5cbi8qKlxuICogTGZvIGNsYXNzIHVzaW5nIFBocmFzZU1ha2VyIGNsYXNzIGZyb20geG1tLWNsaWVudFxuICogdG8gcmVjb3JkIGlucHV0IGRhdGEgYW5kIGZvcm1hdCBpdCBmb3IgeG1tLW5vZGUuXG4gKi9cbmNsYXNzIFBocmFzZVJlY29yZGVyTGZvIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3BocmFzZU1ha2VyID0gbmV3IFBocmFzZU1ha2VyKHtcbiAgICAgIGJpbW9kYWw6IHRoaXMucGFyYW1zLmdldCgnYmltb2RhbCcpLFxuICAgICAgZGltZW5zaW9uSW5wdXQ6IHRoaXMucGFyYW1zLmdldCgnZGltZW5zaW9uSW5wdXQnKSxcbiAgICAgIGNvbHVtbk5hbWVzOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbHVtbk5hbWVzJyksXG4gICAgfSk7XG5cbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgbGFiZWwgb2YgdGhlIGxhc3QgLyBjdXJyZW50bHkgYmVpbmcgcmVjb3JkZWQgcGhyYXNlLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfS5cbiAgICovXG4gIGdldFBocmFzZUxhYmVsKCkge1xuICAgIHJldHVybiB0aGlzLl9waHJhc2VNYWtlci5nZXRDb25maWcoKVsnbGFiZWwnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgbGFiZWwgb2YgdGhlIGxhc3QgLyBjdXJyZW50bHkgYmVpbmcgcmVjb3JkZWQgcGhyYXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBUaGUgbGFiZWwuXG4gICAqL1xuICBzZXRQaHJhc2VMYWJlbChsYWJlbCkge1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnNldENvbmZpZyh7IGxhYmVsOiBsYWJlbCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGxhdGVzdCByZWNvcmRlZCBwaHJhc2UuXG4gICAqIEByZXR1cm5zIHtYbW1QaHJhc2V9XG4gICAqL1xuICBnZXRSZWNvcmRlZFBocmFzZSgpIHtcbiAgICAvLyB0aGlzLnN0b3AoKTtcbiAgICByZXR1cm4gdGhpcy5fcGhyYXNlTWFrZXIuZ2V0UGhyYXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgcmVjb3JkaW5nIGEgcGhyYXNlIGZyb20gdGhlIGlucHV0IHN0cmVhbS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnJlc2V0KCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBjdXJyZW50IHJlY29yZGluZy5cbiAgICogKG1ha2VzIHRoZSBwaHJhc2UgYXZhaWxhYmxlIHZpYSA8Y29kZT5nZXRSZWNvcmRlZFBocmFzZSgpPC9jb2RlPikuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgY29uc3QgY29uZmlnID0ge307XG4gICAgY29uZmlnW25hbWVdID0gdmFsdWU7XG4gICAgdGhpcy5fcGhyYXNlTWFrZXIuc2V0Q29uZmlnKGNvbmZpZyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLl9waHJhc2VNYWtlci5zZXRDb25maWcoeyBkaW1lbnNpb246IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSB9KTtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5yZXNldCgpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgaWYgKCF0aGlzLl9pc1N0YXJ0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjb25zdCB7IGRhdGEgfSA9IGZyYW1lO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBpbkRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBvdXREYXRhW2ldID0gaW5EYXRhW2ldO1xuICAgIH1cblxuICAgIHRoaXMuX3BocmFzZU1ha2VyLmFkZE9ic2VydmF0aW9uKGluRGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGhyYXNlUmVjb3JkZXJMZm87IiwiZXhwb3J0IHsgZGVmYXVsdCBhcyBHbW1EZWNvZGVyTGZvIH0gZnJvbSAnLi9HbW1EZWNvZGVyTGZvJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgSGhtbURlY29kZXJMZm8gfSBmcm9tICcuL0hobW1EZWNvZGVyTGZvJztcbmV4cG9ydCB7IGRlZmF1bHQgYXMgUGhyYXNlUmVjb3JkZXJMZm8gfSBmcm9tICcuL1BocmFzZVJlY29yZGVyTGZvJzsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vanNvbi9zdHJpbmdpZnlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vbnVtYmVyL2lzLWludGVnZXJcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2Fzc2lnblwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvY3JlYXRlXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwibW9kdWxlLmV4cG9ydHMgPSB7IFwiZGVmYXVsdFwiOiByZXF1aXJlKFwiY29yZS1qcy9saWJyYXJ5L2ZuL29iamVjdC9kZWZpbmUtcHJvcGVydHlcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vb2JqZWN0L2dldC1vd24tcHJvcGVydHktZGVzY3JpcHRvclwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3QvZ2V0LXByb3RvdHlwZS1vZlwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9vYmplY3Qvc2V0LXByb3RvdHlwZS1vZlwiKSwgX19lc01vZHVsZTogdHJ1ZSB9OyIsIm1vZHVsZS5leHBvcnRzID0geyBcImRlZmF1bHRcIjogcmVxdWlyZShcImNvcmUtanMvbGlicmFyeS9mbi9zeW1ib2xcIiksIF9fZXNNb2R1bGU6IHRydWUgfTsiLCJtb2R1bGUuZXhwb3J0cyA9IHsgXCJkZWZhdWx0XCI6IHJlcXVpcmUoXCJjb3JlLWpzL2xpYnJhcnkvZm4vc3ltYm9sL2l0ZXJhdG9yXCIpLCBfX2VzTW9kdWxlOiB0cnVlIH07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChpbnN0YW5jZSwgQ29uc3RydWN0b3IpIHtcbiAgaWYgKCEoaW5zdGFuY2UgaW5zdGFuY2VvZiBDb25zdHJ1Y3RvcikpIHtcbiAgICB0aHJvdyBuZXcgVHlwZUVycm9yKFwiQ2Fubm90IGNhbGwgYSBjbGFzcyBhcyBhIGZ1bmN0aW9uXCIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2RlZmluZVByb3BlcnR5ID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2RlZmluZS1wcm9wZXJ0eVwiKTtcblxudmFyIF9kZWZpbmVQcm9wZXJ0eTIgPSBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KF9kZWZpbmVQcm9wZXJ0eSk7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uICgpIHtcbiAgZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyh0YXJnZXQsIHByb3BzKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBwcm9wcy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGRlc2NyaXB0b3IgPSBwcm9wc1tpXTtcbiAgICAgIGRlc2NyaXB0b3IuZW51bWVyYWJsZSA9IGRlc2NyaXB0b3IuZW51bWVyYWJsZSB8fCBmYWxzZTtcbiAgICAgIGRlc2NyaXB0b3IuY29uZmlndXJhYmxlID0gdHJ1ZTtcbiAgICAgIGlmIChcInZhbHVlXCIgaW4gZGVzY3JpcHRvcikgZGVzY3JpcHRvci53cml0YWJsZSA9IHRydWU7XG4gICAgICAoMCwgX2RlZmluZVByb3BlcnR5Mi5kZWZhdWx0KSh0YXJnZXQsIGRlc2NyaXB0b3Iua2V5LCBkZXNjcmlwdG9yKTtcbiAgICB9XG4gIH1cblxuICByZXR1cm4gZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBwcm90b1Byb3BzLCBzdGF0aWNQcm9wcykge1xuICAgIGlmIChwcm90b1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLnByb3RvdHlwZSwgcHJvdG9Qcm9wcyk7XG4gICAgaWYgKHN0YXRpY1Byb3BzKSBkZWZpbmVQcm9wZXJ0aWVzKENvbnN0cnVjdG9yLCBzdGF0aWNQcm9wcyk7XG4gICAgcmV0dXJuIENvbnN0cnVjdG9yO1xuICB9O1xufSgpOyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX2dldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L2dldC1wcm90b3R5cGUtb2ZcIik7XG5cbnZhciBfZ2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfZ2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2dldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9nZXQtb3duLXByb3BlcnR5LWRlc2NyaXB0b3JcIik7XG5cbnZhciBfZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2dldE93blByb3BlcnR5RGVzY3JpcHRvcik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIGdldChvYmplY3QsIHByb3BlcnR5LCByZWNlaXZlcikge1xuICBpZiAob2JqZWN0ID09PSBudWxsKSBvYmplY3QgPSBGdW5jdGlvbi5wcm90b3R5cGU7XG4gIHZhciBkZXNjID0gKDAsIF9nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IyLmRlZmF1bHQpKG9iamVjdCwgcHJvcGVydHkpO1xuXG4gIGlmIChkZXNjID09PSB1bmRlZmluZWQpIHtcbiAgICB2YXIgcGFyZW50ID0gKDAsIF9nZXRQcm90b3R5cGVPZjIuZGVmYXVsdCkob2JqZWN0KTtcblxuICAgIGlmIChwYXJlbnQgPT09IG51bGwpIHtcbiAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgfSBlbHNlIHtcbiAgICAgIHJldHVybiBnZXQocGFyZW50LCBwcm9wZXJ0eSwgcmVjZWl2ZXIpO1xuICAgIH1cbiAgfSBlbHNlIGlmIChcInZhbHVlXCIgaW4gZGVzYykge1xuICAgIHJldHVybiBkZXNjLnZhbHVlO1xuICB9IGVsc2Uge1xuICAgIHZhciBnZXR0ZXIgPSBkZXNjLmdldDtcblxuICAgIGlmIChnZXR0ZXIgPT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgICB9XG5cbiAgICByZXR1cm4gZ2V0dGVyLmNhbGwocmVjZWl2ZXIpO1xuICB9XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3NldFByb3RvdHlwZU9mID0gcmVxdWlyZShcIi4uL2NvcmUtanMvb2JqZWN0L3NldC1wcm90b3R5cGUtb2ZcIik7XG5cbnZhciBfc2V0UHJvdG90eXBlT2YyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc2V0UHJvdG90eXBlT2YpO1xuXG52YXIgX2NyZWF0ZSA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL29iamVjdC9jcmVhdGVcIik7XG5cbnZhciBfY3JlYXRlMiA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX2NyZWF0ZSk7XG5cbnZhciBfdHlwZW9mMiA9IHJlcXVpcmUoXCIuLi9oZWxwZXJzL3R5cGVvZlwiKTtcblxudmFyIF90eXBlb2YzID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfdHlwZW9mMik7XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IGZ1bmN0aW9uIChzdWJDbGFzcywgc3VwZXJDbGFzcykge1xuICBpZiAodHlwZW9mIHN1cGVyQ2xhc3MgIT09IFwiZnVuY3Rpb25cIiAmJiBzdXBlckNsYXNzICE9PSBudWxsKSB7XG4gICAgdGhyb3cgbmV3IFR5cGVFcnJvcihcIlN1cGVyIGV4cHJlc3Npb24gbXVzdCBlaXRoZXIgYmUgbnVsbCBvciBhIGZ1bmN0aW9uLCBub3QgXCIgKyAodHlwZW9mIHN1cGVyQ2xhc3MgPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogKDAsIF90eXBlb2YzLmRlZmF1bHQpKHN1cGVyQ2xhc3MpKSk7XG4gIH1cblxuICBzdWJDbGFzcy5wcm90b3R5cGUgPSAoMCwgX2NyZWF0ZTIuZGVmYXVsdCkoc3VwZXJDbGFzcyAmJiBzdXBlckNsYXNzLnByb3RvdHlwZSwge1xuICAgIGNvbnN0cnVjdG9yOiB7XG4gICAgICB2YWx1ZTogc3ViQ2xhc3MsXG4gICAgICBlbnVtZXJhYmxlOiBmYWxzZSxcbiAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgY29uZmlndXJhYmxlOiB0cnVlXG4gICAgfVxuICB9KTtcbiAgaWYgKHN1cGVyQ2xhc3MpIF9zZXRQcm90b3R5cGVPZjIuZGVmYXVsdCA/ICgwLCBfc2V0UHJvdG90eXBlT2YyLmRlZmF1bHQpKHN1YkNsYXNzLCBzdXBlckNsYXNzKSA6IHN1YkNsYXNzLl9fcHJvdG9fXyA9IHN1cGVyQ2xhc3M7XG59OyIsIlwidXNlIHN0cmljdFwiO1xuXG5leHBvcnRzLl9fZXNNb2R1bGUgPSB0cnVlO1xuXG52YXIgX3R5cGVvZjIgPSByZXF1aXJlKFwiLi4vaGVscGVycy90eXBlb2ZcIik7XG5cbnZhciBfdHlwZW9mMyA9IF9pbnRlcm9wUmVxdWlyZURlZmF1bHQoX3R5cGVvZjIpO1xuXG5mdW5jdGlvbiBfaW50ZXJvcFJlcXVpcmVEZWZhdWx0KG9iaikgeyByZXR1cm4gb2JqICYmIG9iai5fX2VzTW9kdWxlID8gb2JqIDogeyBkZWZhdWx0OiBvYmogfTsgfVxuXG5leHBvcnRzLmRlZmF1bHQgPSBmdW5jdGlvbiAoc2VsZiwgY2FsbCkge1xuICBpZiAoIXNlbGYpIHtcbiAgICB0aHJvdyBuZXcgUmVmZXJlbmNlRXJyb3IoXCJ0aGlzIGhhc24ndCBiZWVuIGluaXRpYWxpc2VkIC0gc3VwZXIoKSBoYXNuJ3QgYmVlbiBjYWxsZWRcIik7XG4gIH1cblxuICByZXR1cm4gY2FsbCAmJiAoKHR5cGVvZiBjYWxsID09PSBcInVuZGVmaW5lZFwiID8gXCJ1bmRlZmluZWRcIiA6ICgwLCBfdHlwZW9mMy5kZWZhdWx0KShjYWxsKSkgPT09IFwib2JqZWN0XCIgfHwgdHlwZW9mIGNhbGwgPT09IFwiZnVuY3Rpb25cIikgPyBjYWxsIDogc2VsZjtcbn07IiwiXCJ1c2Ugc3RyaWN0XCI7XG5cbmV4cG9ydHMuX19lc01vZHVsZSA9IHRydWU7XG5cbnZhciBfaXRlcmF0b3IgPSByZXF1aXJlKFwiLi4vY29yZS1qcy9zeW1ib2wvaXRlcmF0b3JcIik7XG5cbnZhciBfaXRlcmF0b3IyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfaXRlcmF0b3IpO1xuXG52YXIgX3N5bWJvbCA9IHJlcXVpcmUoXCIuLi9jb3JlLWpzL3N5bWJvbFwiKTtcblxudmFyIF9zeW1ib2wyID0gX2ludGVyb3BSZXF1aXJlRGVmYXVsdChfc3ltYm9sKTtcblxudmFyIF90eXBlb2YgPSB0eXBlb2YgX3N5bWJvbDIuZGVmYXVsdCA9PT0gXCJmdW5jdGlvblwiICYmIHR5cGVvZiBfaXRlcmF0b3IyLmRlZmF1bHQgPT09IFwic3ltYm9sXCIgPyBmdW5jdGlvbiAob2JqKSB7IHJldHVybiB0eXBlb2Ygb2JqOyB9IDogZnVuY3Rpb24gKG9iaikgeyByZXR1cm4gb2JqICYmIHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfc3ltYm9sMi5kZWZhdWx0ID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmo7IH07XG5cbmZ1bmN0aW9uIF9pbnRlcm9wUmVxdWlyZURlZmF1bHQob2JqKSB7IHJldHVybiBvYmogJiYgb2JqLl9fZXNNb2R1bGUgPyBvYmogOiB7IGRlZmF1bHQ6IG9iaiB9OyB9XG5cbmV4cG9ydHMuZGVmYXVsdCA9IHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgX3R5cGVvZihfaXRlcmF0b3IyLmRlZmF1bHQpID09PSBcInN5bWJvbFwiID8gZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gdHlwZW9mIG9iaiA9PT0gXCJ1bmRlZmluZWRcIiA/IFwidW5kZWZpbmVkXCIgOiBfdHlwZW9mKG9iaik7XG59IDogZnVuY3Rpb24gKG9iaikge1xuICByZXR1cm4gb2JqICYmIHR5cGVvZiBfc3ltYm9sMi5kZWZhdWx0ID09PSBcImZ1bmN0aW9uXCIgJiYgb2JqLmNvbnN0cnVjdG9yID09PSBfc3ltYm9sMi5kZWZhdWx0ID8gXCJzeW1ib2xcIiA6IHR5cGVvZiBvYmogPT09IFwidW5kZWZpbmVkXCIgPyBcInVuZGVmaW5lZFwiIDogX3R5cGVvZihvYmopO1xufTsiLCJ2YXIgY29yZSAgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJylcbiAgLCAkSlNPTiA9IGNvcmUuSlNPTiB8fCAoY29yZS5KU09OID0ge3N0cmluZ2lmeTogSlNPTi5zdHJpbmdpZnl9KTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gc3RyaW5naWZ5KGl0KXsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby11bnVzZWQtdmFyc1xuICByZXR1cm4gJEpTT04uc3RyaW5naWZ5LmFwcGx5KCRKU09OLCBhcmd1bWVudHMpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5udW1iZXIuaXMtaW50ZWdlcicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuTnVtYmVyLmlzSW50ZWdlcjsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuYXNzaWduJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3QuYXNzaWduOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5jcmVhdGUnKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gY3JlYXRlKFAsIEQpe1xuICByZXR1cm4gJE9iamVjdC5jcmVhdGUoUCwgRCk7XG59OyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5kZWZpbmUtcHJvcGVydHknKTtcbnZhciAkT2JqZWN0ID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fY29yZScpLk9iamVjdDtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoaXQsIGtleSwgZGVzYyl7XG4gIHJldHVybiAkT2JqZWN0LmRlZmluZVByb3BlcnR5KGl0LCBrZXksIGRlc2MpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LW93bi1wcm9wZXJ0eS1kZXNjcmlwdG9yJyk7XG52YXIgJE9iamVjdCA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Q7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgcmV0dXJuICRPYmplY3QuZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpO1xufTsiLCJyZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QuZ2V0LXByb3RvdHlwZS1vZicpO1xubW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKCcuLi8uLi9tb2R1bGVzL19jb3JlJykuT2JqZWN0LmdldFByb3RvdHlwZU9mOyIsInJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM2Lm9iamVjdC5zZXQtcHJvdG90eXBlLW9mJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5PYmplY3Quc2V0UHJvdG90eXBlT2Y7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3ltYm9sJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNi5vYmplY3QudG8tc3RyaW5nJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL2VzNy5zeW1ib2wuYXN5bmMtaXRlcmF0b3InKTtcbnJlcXVpcmUoJy4uLy4uL21vZHVsZXMvZXM3LnN5bWJvbC5vYnNlcnZhYmxlJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4uLy4uL21vZHVsZXMvX2NvcmUnKS5TeW1ib2w7IiwicmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9lczYuc3RyaW5nLml0ZXJhdG9yJyk7XG5yZXF1aXJlKCcuLi8uLi9tb2R1bGVzL3dlYi5kb20uaXRlcmFibGUnKTtcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi4vLi4vbW9kdWxlcy9fd2tzLWV4dCcpLmYoJ2l0ZXJhdG9yJyk7IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKHR5cGVvZiBpdCAhPSAnZnVuY3Rpb24nKXRocm93IFR5cGVFcnJvcihpdCArICcgaXMgbm90IGEgZnVuY3Rpb24hJyk7XG4gIHJldHVybiBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbigpeyAvKiBlbXB0eSAqLyB9OyIsInZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIGlmKCFpc09iamVjdChpdCkpdGhyb3cgVHlwZUVycm9yKGl0ICsgJyBpcyBub3QgYW4gb2JqZWN0IScpO1xuICByZXR1cm4gaXQ7XG59OyIsIi8vIGZhbHNlIC0+IEFycmF5I2luZGV4T2Zcbi8vIHRydWUgIC0+IEFycmF5I2luY2x1ZGVzXG52YXIgdG9JT2JqZWN0ID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9MZW5ndGggID0gcmVxdWlyZSgnLi9fdG8tbGVuZ3RoJylcbiAgLCB0b0luZGV4ICAgPSByZXF1aXJlKCcuL190by1pbmRleCcpO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihJU19JTkNMVURFUyl7XG4gIHJldHVybiBmdW5jdGlvbigkdGhpcywgZWwsIGZyb21JbmRleCl7XG4gICAgdmFyIE8gICAgICA9IHRvSU9iamVjdCgkdGhpcylcbiAgICAgICwgbGVuZ3RoID0gdG9MZW5ndGgoTy5sZW5ndGgpXG4gICAgICAsIGluZGV4ICA9IHRvSW5kZXgoZnJvbUluZGV4LCBsZW5ndGgpXG4gICAgICAsIHZhbHVlO1xuICAgIC8vIEFycmF5I2luY2x1ZGVzIHVzZXMgU2FtZVZhbHVlWmVybyBlcXVhbGl0eSBhbGdvcml0aG1cbiAgICBpZihJU19JTkNMVURFUyAmJiBlbCAhPSBlbCl3aGlsZShsZW5ndGggPiBpbmRleCl7XG4gICAgICB2YWx1ZSA9IE9baW5kZXgrK107XG4gICAgICBpZih2YWx1ZSAhPSB2YWx1ZSlyZXR1cm4gdHJ1ZTtcbiAgICAvLyBBcnJheSN0b0luZGV4IGlnbm9yZXMgaG9sZXMsIEFycmF5I2luY2x1ZGVzIC0gbm90XG4gICAgfSBlbHNlIGZvcig7bGVuZ3RoID4gaW5kZXg7IGluZGV4KyspaWYoSVNfSU5DTFVERVMgfHwgaW5kZXggaW4gTyl7XG4gICAgICBpZihPW2luZGV4XSA9PT0gZWwpcmV0dXJuIElTX0lOQ0xVREVTIHx8IGluZGV4IHx8IDA7XG4gICAgfSByZXR1cm4gIUlTX0lOQ0xVREVTICYmIC0xO1xuICB9O1xufTsiLCJ2YXIgdG9TdHJpbmcgPSB7fS50b1N0cmluZztcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0b1N0cmluZy5jYWxsKGl0KS5zbGljZSg4LCAtMSk7XG59OyIsInZhciBjb3JlID0gbW9kdWxlLmV4cG9ydHMgPSB7dmVyc2lvbjogJzIuNC4wJ307XG5pZih0eXBlb2YgX19lID09ICdudW1iZXInKV9fZSA9IGNvcmU7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW5kZWYiLCIvLyBvcHRpb25hbCAvIHNpbXBsZSBjb250ZXh0IGJpbmRpbmdcbnZhciBhRnVuY3Rpb24gPSByZXF1aXJlKCcuL19hLWZ1bmN0aW9uJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGZuLCB0aGF0LCBsZW5ndGgpe1xuICBhRnVuY3Rpb24oZm4pO1xuICBpZih0aGF0ID09PSB1bmRlZmluZWQpcmV0dXJuIGZuO1xuICBzd2l0Y2gobGVuZ3RoKXtcbiAgICBjYXNlIDE6IHJldHVybiBmdW5jdGlvbihhKXtcbiAgICAgIHJldHVybiBmbi5jYWxsKHRoYXQsIGEpO1xuICAgIH07XG4gICAgY2FzZSAyOiByZXR1cm4gZnVuY3Rpb24oYSwgYil7XG4gICAgICByZXR1cm4gZm4uY2FsbCh0aGF0LCBhLCBiKTtcbiAgICB9O1xuICAgIGNhc2UgMzogcmV0dXJuIGZ1bmN0aW9uKGEsIGIsIGMpe1xuICAgICAgcmV0dXJuIGZuLmNhbGwodGhhdCwgYSwgYiwgYyk7XG4gICAgfTtcbiAgfVxuICByZXR1cm4gZnVuY3Rpb24oLyogLi4uYXJncyAqLyl7XG4gICAgcmV0dXJuIGZuLmFwcGx5KHRoYXQsIGFyZ3VtZW50cyk7XG4gIH07XG59OyIsIi8vIDcuMi4xIFJlcXVpcmVPYmplY3RDb2VyY2libGUoYXJndW1lbnQpXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgaWYoaXQgPT0gdW5kZWZpbmVkKXRocm93IFR5cGVFcnJvcihcIkNhbid0IGNhbGwgbWV0aG9kIG9uICBcIiArIGl0KTtcbiAgcmV0dXJuIGl0O1xufTsiLCIvLyBUaGFuaydzIElFOCBmb3IgaGlzIGZ1bm55IGRlZmluZVByb3BlcnR5XG5tb2R1bGUuZXhwb3J0cyA9ICFyZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHJldHVybiBPYmplY3QuZGVmaW5lUHJvcGVydHkoe30sICdhJywge2dldDogZnVuY3Rpb24oKXsgcmV0dXJuIDc7IH19KS5hICE9IDc7XG59KTsiLCJ2YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGRvY3VtZW50ID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnRcbiAgLy8gaW4gb2xkIElFIHR5cGVvZiBkb2N1bWVudC5jcmVhdGVFbGVtZW50IGlzICdvYmplY3QnXG4gICwgaXMgPSBpc09iamVjdChkb2N1bWVudCkgJiYgaXNPYmplY3QoZG9jdW1lbnQuY3JlYXRlRWxlbWVudCk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIGlzID8gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChpdCkgOiB7fTtcbn07IiwiLy8gSUUgOC0gZG9uJ3QgZW51bSBidWcga2V5c1xubW9kdWxlLmV4cG9ydHMgPSAoXG4gICdjb25zdHJ1Y3RvcixoYXNPd25Qcm9wZXJ0eSxpc1Byb3RvdHlwZU9mLHByb3BlcnR5SXNFbnVtZXJhYmxlLHRvTG9jYWxlU3RyaW5nLHRvU3RyaW5nLHZhbHVlT2YnXG4pLnNwbGl0KCcsJyk7IiwiLy8gYWxsIGVudW1lcmFibGUgb2JqZWN0IGtleXMsIGluY2x1ZGVzIHN5bWJvbHNcbnZhciBnZXRLZXlzID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMnKVxuICAsIGdPUFMgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1waWUnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICB2YXIgcmVzdWx0ICAgICA9IGdldEtleXMoaXQpXG4gICAgLCBnZXRTeW1ib2xzID0gZ09QUy5mO1xuICBpZihnZXRTeW1ib2xzKXtcbiAgICB2YXIgc3ltYm9scyA9IGdldFN5bWJvbHMoaXQpXG4gICAgICAsIGlzRW51bSAgPSBwSUUuZlxuICAgICAgLCBpICAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUoc3ltYm9scy5sZW5ndGggPiBpKWlmKGlzRW51bS5jYWxsKGl0LCBrZXkgPSBzeW1ib2xzW2krK10pKXJlc3VsdC5wdXNoKGtleSk7XG4gIH0gcmV0dXJuIHJlc3VsdDtcbn07IiwidmFyIGdsb2JhbCAgICA9IHJlcXVpcmUoJy4vX2dsb2JhbCcpXG4gICwgY29yZSAgICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgY3R4ICAgICAgID0gcmVxdWlyZSgnLi9fY3R4JylcbiAgLCBoaWRlICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBQUk9UT1RZUEUgPSAncHJvdG90eXBlJztcblxudmFyICRleHBvcnQgPSBmdW5jdGlvbih0eXBlLCBuYW1lLCBzb3VyY2Upe1xuICB2YXIgSVNfRk9SQ0VEID0gdHlwZSAmICRleHBvcnQuRlxuICAgICwgSVNfR0xPQkFMID0gdHlwZSAmICRleHBvcnQuR1xuICAgICwgSVNfU1RBVElDID0gdHlwZSAmICRleHBvcnQuU1xuICAgICwgSVNfUFJPVE8gID0gdHlwZSAmICRleHBvcnQuUFxuICAgICwgSVNfQklORCAgID0gdHlwZSAmICRleHBvcnQuQlxuICAgICwgSVNfV1JBUCAgID0gdHlwZSAmICRleHBvcnQuV1xuICAgICwgZXhwb3J0cyAgID0gSVNfR0xPQkFMID8gY29yZSA6IGNvcmVbbmFtZV0gfHwgKGNvcmVbbmFtZV0gPSB7fSlcbiAgICAsIGV4cFByb3RvICA9IGV4cG9ydHNbUFJPVE9UWVBFXVxuICAgICwgdGFyZ2V0ICAgID0gSVNfR0xPQkFMID8gZ2xvYmFsIDogSVNfU1RBVElDID8gZ2xvYmFsW25hbWVdIDogKGdsb2JhbFtuYW1lXSB8fCB7fSlbUFJPVE9UWVBFXVxuICAgICwga2V5LCBvd24sIG91dDtcbiAgaWYoSVNfR0xPQkFMKXNvdXJjZSA9IG5hbWU7XG4gIGZvcihrZXkgaW4gc291cmNlKXtcbiAgICAvLyBjb250YWlucyBpbiBuYXRpdmVcbiAgICBvd24gPSAhSVNfRk9SQ0VEICYmIHRhcmdldCAmJiB0YXJnZXRba2V5XSAhPT0gdW5kZWZpbmVkO1xuICAgIGlmKG93biAmJiBrZXkgaW4gZXhwb3J0cyljb250aW51ZTtcbiAgICAvLyBleHBvcnQgbmF0aXZlIG9yIHBhc3NlZFxuICAgIG91dCA9IG93biA/IHRhcmdldFtrZXldIDogc291cmNlW2tleV07XG4gICAgLy8gcHJldmVudCBnbG9iYWwgcG9sbHV0aW9uIGZvciBuYW1lc3BhY2VzXG4gICAgZXhwb3J0c1trZXldID0gSVNfR0xPQkFMICYmIHR5cGVvZiB0YXJnZXRba2V5XSAhPSAnZnVuY3Rpb24nID8gc291cmNlW2tleV1cbiAgICAvLyBiaW5kIHRpbWVycyB0byBnbG9iYWwgZm9yIGNhbGwgZnJvbSBleHBvcnQgY29udGV4dFxuICAgIDogSVNfQklORCAmJiBvd24gPyBjdHgob3V0LCBnbG9iYWwpXG4gICAgLy8gd3JhcCBnbG9iYWwgY29uc3RydWN0b3JzIGZvciBwcmV2ZW50IGNoYW5nZSB0aGVtIGluIGxpYnJhcnlcbiAgICA6IElTX1dSQVAgJiYgdGFyZ2V0W2tleV0gPT0gb3V0ID8gKGZ1bmN0aW9uKEMpe1xuICAgICAgdmFyIEYgPSBmdW5jdGlvbihhLCBiLCBjKXtcbiAgICAgICAgaWYodGhpcyBpbnN0YW5jZW9mIEMpe1xuICAgICAgICAgIHN3aXRjaChhcmd1bWVudHMubGVuZ3RoKXtcbiAgICAgICAgICAgIGNhc2UgMDogcmV0dXJuIG5ldyBDO1xuICAgICAgICAgICAgY2FzZSAxOiByZXR1cm4gbmV3IEMoYSk7XG4gICAgICAgICAgICBjYXNlIDI6IHJldHVybiBuZXcgQyhhLCBiKTtcbiAgICAgICAgICB9IHJldHVybiBuZXcgQyhhLCBiLCBjKTtcbiAgICAgICAgfSByZXR1cm4gQy5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgICAgfTtcbiAgICAgIEZbUFJPVE9UWVBFXSA9IENbUFJPVE9UWVBFXTtcbiAgICAgIHJldHVybiBGO1xuICAgIC8vIG1ha2Ugc3RhdGljIHZlcnNpb25zIGZvciBwcm90b3R5cGUgbWV0aG9kc1xuICAgIH0pKG91dCkgOiBJU19QUk9UTyAmJiB0eXBlb2Ygb3V0ID09ICdmdW5jdGlvbicgPyBjdHgoRnVuY3Rpb24uY2FsbCwgb3V0KSA6IG91dDtcbiAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUubWV0aG9kcy4lTkFNRSVcbiAgICBpZihJU19QUk9UTyl7XG4gICAgICAoZXhwb3J0cy52aXJ0dWFsIHx8IChleHBvcnRzLnZpcnR1YWwgPSB7fSkpW2tleV0gPSBvdXQ7XG4gICAgICAvLyBleHBvcnQgcHJvdG8gbWV0aG9kcyB0byBjb3JlLiVDT05TVFJVQ1RPUiUucHJvdG90eXBlLiVOQU1FJVxuICAgICAgaWYodHlwZSAmICRleHBvcnQuUiAmJiBleHBQcm90byAmJiAhZXhwUHJvdG9ba2V5XSloaWRlKGV4cFByb3RvLCBrZXksIG91dCk7XG4gICAgfVxuICB9XG59O1xuLy8gdHlwZSBiaXRtYXBcbiRleHBvcnQuRiA9IDE7ICAgLy8gZm9yY2VkXG4kZXhwb3J0LkcgPSAyOyAgIC8vIGdsb2JhbFxuJGV4cG9ydC5TID0gNDsgICAvLyBzdGF0aWNcbiRleHBvcnQuUCA9IDg7ICAgLy8gcHJvdG9cbiRleHBvcnQuQiA9IDE2OyAgLy8gYmluZFxuJGV4cG9ydC5XID0gMzI7ICAvLyB3cmFwXG4kZXhwb3J0LlUgPSA2NDsgIC8vIHNhZmVcbiRleHBvcnQuUiA9IDEyODsgLy8gcmVhbCBwcm90byBtZXRob2QgZm9yIGBsaWJyYXJ5YCBcbm1vZHVsZS5leHBvcnRzID0gJGV4cG9ydDsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGV4ZWMpe1xuICB0cnkge1xuICAgIHJldHVybiAhIWV4ZWMoKTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gdHJ1ZTtcbiAgfVxufTsiLCIvLyBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvODYjaXNzdWVjb21tZW50LTExNTc1OTAyOFxudmFyIGdsb2JhbCA9IG1vZHVsZS5leHBvcnRzID0gdHlwZW9mIHdpbmRvdyAhPSAndW5kZWZpbmVkJyAmJiB3aW5kb3cuTWF0aCA9PSBNYXRoXG4gID8gd2luZG93IDogdHlwZW9mIHNlbGYgIT0gJ3VuZGVmaW5lZCcgJiYgc2VsZi5NYXRoID09IE1hdGggPyBzZWxmIDogRnVuY3Rpb24oJ3JldHVybiB0aGlzJykoKTtcbmlmKHR5cGVvZiBfX2cgPT0gJ251bWJlcicpX19nID0gZ2xvYmFsOyAvLyBlc2xpbnQtZGlzYWJsZS1saW5lIG5vLXVuZGVmIiwidmFyIGhhc093blByb3BlcnR5ID0ge30uaGFzT3duUHJvcGVydHk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCBrZXkpe1xuICByZXR1cm4gaGFzT3duUHJvcGVydHkuY2FsbChpdCwga2V5KTtcbn07IiwidmFyIGRQICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZHAnKVxuICAsIGNyZWF0ZURlc2MgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJyk7XG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBmdW5jdGlvbihvYmplY3QsIGtleSwgdmFsdWUpe1xuICByZXR1cm4gZFAuZihvYmplY3QsIGtleSwgY3JlYXRlRGVzYygxLCB2YWx1ZSkpO1xufSA6IGZ1bmN0aW9uKG9iamVjdCwga2V5LCB2YWx1ZSl7XG4gIG9iamVjdFtrZXldID0gdmFsdWU7XG4gIHJldHVybiBvYmplY3Q7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuZG9jdW1lbnQgJiYgZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50OyIsIm1vZHVsZS5leHBvcnRzID0gIXJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgJiYgIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShyZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2RpdicpLCAnYScsIHtnZXQ6IGZ1bmN0aW9uKCl7IHJldHVybiA3OyB9fSkuYSAhPSA3O1xufSk7IiwiLy8gZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBhbmQgbm9uLWVudW1lcmFibGUgb2xkIFY4IHN0cmluZ3NcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0KCd6JykucHJvcGVydHlJc0VudW1lcmFibGUoMCkgPyBPYmplY3QgOiBmdW5jdGlvbihpdCl7XG4gIHJldHVybiBjb2YoaXQpID09ICdTdHJpbmcnID8gaXQuc3BsaXQoJycpIDogT2JqZWN0KGl0KTtcbn07IiwiLy8gNy4yLjIgSXNBcnJheShhcmd1bWVudClcbnZhciBjb2YgPSByZXF1aXJlKCcuL19jb2YnKTtcbm1vZHVsZS5leHBvcnRzID0gQXJyYXkuaXNBcnJheSB8fCBmdW5jdGlvbiBpc0FycmF5KGFyZyl7XG4gIHJldHVybiBjb2YoYXJnKSA9PSAnQXJyYXknO1xufTsiLCIvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcbnZhciBpc09iamVjdCA9IHJlcXVpcmUoJy4vX2lzLW9iamVjdCcpXG4gICwgZmxvb3IgICAgPSBNYXRoLmZsb29yO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiBpc0ludGVnZXIoaXQpe1xuICByZXR1cm4gIWlzT2JqZWN0KGl0KSAmJiBpc0Zpbml0ZShpdCkgJiYgZmxvb3IoaXQpID09PSBpdDtcbn07IiwibW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT09ICdvYmplY3QnID8gaXQgIT09IG51bGwgOiB0eXBlb2YgaXQgPT09ICdmdW5jdGlvbic7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBjcmVhdGUgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGRlc2NyaXB0b3IgICAgID0gcmVxdWlyZSgnLi9fcHJvcGVydHktZGVzYycpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgSXRlcmF0b3JQcm90b3R5cGUgPSB7fTtcblxuLy8gMjUuMS4yLjEuMSAlSXRlcmF0b3JQcm90b3R5cGUlW0BAaXRlcmF0b3JdKClcbnJlcXVpcmUoJy4vX2hpZGUnKShJdGVyYXRvclByb3RvdHlwZSwgcmVxdWlyZSgnLi9fd2tzJykoJ2l0ZXJhdG9yJyksIGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9KTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihDb25zdHJ1Y3RvciwgTkFNRSwgbmV4dCl7XG4gIENvbnN0cnVjdG9yLnByb3RvdHlwZSA9IGNyZWF0ZShJdGVyYXRvclByb3RvdHlwZSwge25leHQ6IGRlc2NyaXB0b3IoMSwgbmV4dCl9KTtcbiAgc2V0VG9TdHJpbmdUYWcoQ29uc3RydWN0b3IsIE5BTUUgKyAnIEl0ZXJhdG9yJyk7XG59OyIsIid1c2Ugc3RyaWN0JztcbnZhciBMSUJSQVJZICAgICAgICA9IHJlcXVpcmUoJy4vX2xpYnJhcnknKVxuICAsICRleHBvcnQgICAgICAgID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCByZWRlZmluZSAgICAgICA9IHJlcXVpcmUoJy4vX3JlZGVmaW5lJylcbiAgLCBoaWRlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2hpZGUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJdGVyYXRvcnMgICAgICA9IHJlcXVpcmUoJy4vX2l0ZXJhdG9ycycpXG4gICwgJGl0ZXJDcmVhdGUgICAgPSByZXF1aXJlKCcuL19pdGVyLWNyZWF0ZScpXG4gICwgc2V0VG9TdHJpbmdUYWcgPSByZXF1aXJlKCcuL19zZXQtdG8tc3RyaW5nLXRhZycpXG4gICwgZ2V0UHJvdG90eXBlT2YgPSByZXF1aXJlKCcuL19vYmplY3QtZ3BvJylcbiAgLCBJVEVSQVRPUiAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpKCdpdGVyYXRvcicpXG4gICwgQlVHR1kgICAgICAgICAgPSAhKFtdLmtleXMgJiYgJ25leHQnIGluIFtdLmtleXMoKSkgLy8gU2FmYXJpIGhhcyBidWdneSBpdGVyYXRvcnMgdy9vIGBuZXh0YFxuICAsIEZGX0lURVJBVE9SICAgID0gJ0BAaXRlcmF0b3InXG4gICwgS0VZUyAgICAgICAgICAgPSAna2V5cydcbiAgLCBWQUxVRVMgICAgICAgICA9ICd2YWx1ZXMnO1xuXG52YXIgcmV0dXJuVGhpcyA9IGZ1bmN0aW9uKCl7IHJldHVybiB0aGlzOyB9O1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEJhc2UsIE5BTUUsIENvbnN0cnVjdG9yLCBuZXh0LCBERUZBVUxULCBJU19TRVQsIEZPUkNFRCl7XG4gICRpdGVyQ3JlYXRlKENvbnN0cnVjdG9yLCBOQU1FLCBuZXh0KTtcbiAgdmFyIGdldE1ldGhvZCA9IGZ1bmN0aW9uKGtpbmQpe1xuICAgIGlmKCFCVUdHWSAmJiBraW5kIGluIHByb3RvKXJldHVybiBwcm90b1traW5kXTtcbiAgICBzd2l0Y2goa2luZCl7XG4gICAgICBjYXNlIEtFWVM6IHJldHVybiBmdW5jdGlvbiBrZXlzKCl7IHJldHVybiBuZXcgQ29uc3RydWN0b3IodGhpcywga2luZCk7IH07XG4gICAgICBjYXNlIFZBTFVFUzogcmV0dXJuIGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gbmV3IENvbnN0cnVjdG9yKHRoaXMsIGtpbmQpOyB9O1xuICAgIH0gcmV0dXJuIGZ1bmN0aW9uIGVudHJpZXMoKXsgcmV0dXJuIG5ldyBDb25zdHJ1Y3Rvcih0aGlzLCBraW5kKTsgfTtcbiAgfTtcbiAgdmFyIFRBRyAgICAgICAgPSBOQU1FICsgJyBJdGVyYXRvcidcbiAgICAsIERFRl9WQUxVRVMgPSBERUZBVUxUID09IFZBTFVFU1xuICAgICwgVkFMVUVTX0JVRyA9IGZhbHNlXG4gICAgLCBwcm90byAgICAgID0gQmFzZS5wcm90b3R5cGVcbiAgICAsICRuYXRpdmUgICAgPSBwcm90b1tJVEVSQVRPUl0gfHwgcHJvdG9bRkZfSVRFUkFUT1JdIHx8IERFRkFVTFQgJiYgcHJvdG9bREVGQVVMVF1cbiAgICAsICRkZWZhdWx0ICAgPSAkbmF0aXZlIHx8IGdldE1ldGhvZChERUZBVUxUKVxuICAgICwgJGVudHJpZXMgICA9IERFRkFVTFQgPyAhREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKCdlbnRyaWVzJykgOiB1bmRlZmluZWRcbiAgICAsICRhbnlOYXRpdmUgPSBOQU1FID09ICdBcnJheScgPyBwcm90by5lbnRyaWVzIHx8ICRuYXRpdmUgOiAkbmF0aXZlXG4gICAgLCBtZXRob2RzLCBrZXksIEl0ZXJhdG9yUHJvdG90eXBlO1xuICAvLyBGaXggbmF0aXZlXG4gIGlmKCRhbnlOYXRpdmUpe1xuICAgIEl0ZXJhdG9yUHJvdG90eXBlID0gZ2V0UHJvdG90eXBlT2YoJGFueU5hdGl2ZS5jYWxsKG5ldyBCYXNlKSk7XG4gICAgaWYoSXRlcmF0b3JQcm90b3R5cGUgIT09IE9iamVjdC5wcm90b3R5cGUpe1xuICAgICAgLy8gU2V0IEBAdG9TdHJpbmdUYWcgdG8gbmF0aXZlIGl0ZXJhdG9yc1xuICAgICAgc2V0VG9TdHJpbmdUYWcoSXRlcmF0b3JQcm90b3R5cGUsIFRBRywgdHJ1ZSk7XG4gICAgICAvLyBmaXggZm9yIHNvbWUgb2xkIGVuZ2luZXNcbiAgICAgIGlmKCFMSUJSQVJZICYmICFoYXMoSXRlcmF0b3JQcm90b3R5cGUsIElURVJBVE9SKSloaWRlKEl0ZXJhdG9yUHJvdG90eXBlLCBJVEVSQVRPUiwgcmV0dXJuVGhpcyk7XG4gICAgfVxuICB9XG4gIC8vIGZpeCBBcnJheSN7dmFsdWVzLCBAQGl0ZXJhdG9yfS5uYW1lIGluIFY4IC8gRkZcbiAgaWYoREVGX1ZBTFVFUyAmJiAkbmF0aXZlICYmICRuYXRpdmUubmFtZSAhPT0gVkFMVUVTKXtcbiAgICBWQUxVRVNfQlVHID0gdHJ1ZTtcbiAgICAkZGVmYXVsdCA9IGZ1bmN0aW9uIHZhbHVlcygpeyByZXR1cm4gJG5hdGl2ZS5jYWxsKHRoaXMpOyB9O1xuICB9XG4gIC8vIERlZmluZSBpdGVyYXRvclxuICBpZigoIUxJQlJBUlkgfHwgRk9SQ0VEKSAmJiAoQlVHR1kgfHwgVkFMVUVTX0JVRyB8fCAhcHJvdG9bSVRFUkFUT1JdKSl7XG4gICAgaGlkZShwcm90bywgSVRFUkFUT1IsICRkZWZhdWx0KTtcbiAgfVxuICAvLyBQbHVnIGZvciBsaWJyYXJ5XG4gIEl0ZXJhdG9yc1tOQU1FXSA9ICRkZWZhdWx0O1xuICBJdGVyYXRvcnNbVEFHXSAgPSByZXR1cm5UaGlzO1xuICBpZihERUZBVUxUKXtcbiAgICBtZXRob2RzID0ge1xuICAgICAgdmFsdWVzOiAgREVGX1ZBTFVFUyA/ICRkZWZhdWx0IDogZ2V0TWV0aG9kKFZBTFVFUyksXG4gICAgICBrZXlzOiAgICBJU19TRVQgICAgID8gJGRlZmF1bHQgOiBnZXRNZXRob2QoS0VZUyksXG4gICAgICBlbnRyaWVzOiAkZW50cmllc1xuICAgIH07XG4gICAgaWYoRk9SQ0VEKWZvcihrZXkgaW4gbWV0aG9kcyl7XG4gICAgICBpZighKGtleSBpbiBwcm90bykpcmVkZWZpbmUocHJvdG8sIGtleSwgbWV0aG9kc1trZXldKTtcbiAgICB9IGVsc2UgJGV4cG9ydCgkZXhwb3J0LlAgKyAkZXhwb3J0LkYgKiAoQlVHR1kgfHwgVkFMVUVTX0JVRyksIE5BTUUsIG1ldGhvZHMpO1xuICB9XG4gIHJldHVybiBtZXRob2RzO1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGRvbmUsIHZhbHVlKXtcbiAgcmV0dXJuIHt2YWx1ZTogdmFsdWUsIGRvbmU6ICEhZG9uZX07XG59OyIsIm1vZHVsZS5leHBvcnRzID0ge307IiwidmFyIGdldEtleXMgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzJylcbiAgLCB0b0lPYmplY3QgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgZWwpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGtleXMgICA9IGdldEtleXMoTylcbiAgICAsIGxlbmd0aCA9IGtleXMubGVuZ3RoXG4gICAgLCBpbmRleCAgPSAwXG4gICAgLCBrZXk7XG4gIHdoaWxlKGxlbmd0aCA+IGluZGV4KWlmKE9ba2V5ID0ga2V5c1tpbmRleCsrXV0gPT09IGVsKXJldHVybiBrZXk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gdHJ1ZTsiLCJ2YXIgTUVUQSAgICAgPSByZXF1aXJlKCcuL191aWQnKSgnbWV0YScpXG4gICwgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGhhcyAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBzZXREZXNjICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBpZCAgICAgICA9IDA7XG52YXIgaXNFeHRlbnNpYmxlID0gT2JqZWN0LmlzRXh0ZW5zaWJsZSB8fCBmdW5jdGlvbigpe1xuICByZXR1cm4gdHJ1ZTtcbn07XG52YXIgRlJFRVpFID0gIXJlcXVpcmUoJy4vX2ZhaWxzJykoZnVuY3Rpb24oKXtcbiAgcmV0dXJuIGlzRXh0ZW5zaWJsZShPYmplY3QucHJldmVudEV4dGVuc2lvbnMoe30pKTtcbn0pO1xudmFyIHNldE1ldGEgPSBmdW5jdGlvbihpdCl7XG4gIHNldERlc2MoaXQsIE1FVEEsIHt2YWx1ZToge1xuICAgIGk6ICdPJyArICsraWQsIC8vIG9iamVjdCBJRFxuICAgIHc6IHt9ICAgICAgICAgIC8vIHdlYWsgY29sbGVjdGlvbnMgSURzXG4gIH19KTtcbn07XG52YXIgZmFzdEtleSA9IGZ1bmN0aW9uKGl0LCBjcmVhdGUpe1xuICAvLyByZXR1cm4gcHJpbWl0aXZlIHdpdGggcHJlZml4XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIHR5cGVvZiBpdCA9PSAnc3ltYm9sJyA/IGl0IDogKHR5cGVvZiBpdCA9PSAnc3RyaW5nJyA/ICdTJyA6ICdQJykgKyBpdDtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuICdGJztcbiAgICAvLyBub3QgbmVjZXNzYXJ5IHRvIGFkZCBtZXRhZGF0YVxuICAgIGlmKCFjcmVhdGUpcmV0dXJuICdFJztcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gb2JqZWN0IElEXG4gIH0gcmV0dXJuIGl0W01FVEFdLmk7XG59O1xudmFyIGdldFdlYWsgPSBmdW5jdGlvbihpdCwgY3JlYXRlKXtcbiAgaWYoIWhhcyhpdCwgTUVUQSkpe1xuICAgIC8vIGNhbid0IHNldCBtZXRhZGF0YSB0byB1bmNhdWdodCBmcm96ZW4gb2JqZWN0XG4gICAgaWYoIWlzRXh0ZW5zaWJsZShpdCkpcmV0dXJuIHRydWU7XG4gICAgLy8gbm90IG5lY2Vzc2FyeSB0byBhZGQgbWV0YWRhdGFcbiAgICBpZighY3JlYXRlKXJldHVybiBmYWxzZTtcbiAgICAvLyBhZGQgbWlzc2luZyBtZXRhZGF0YVxuICAgIHNldE1ldGEoaXQpO1xuICAvLyByZXR1cm4gaGFzaCB3ZWFrIGNvbGxlY3Rpb25zIElEc1xuICB9IHJldHVybiBpdFtNRVRBXS53O1xufTtcbi8vIGFkZCBtZXRhZGF0YSBvbiBmcmVlemUtZmFtaWx5IG1ldGhvZHMgY2FsbGluZ1xudmFyIG9uRnJlZXplID0gZnVuY3Rpb24oaXQpe1xuICBpZihGUkVFWkUgJiYgbWV0YS5ORUVEICYmIGlzRXh0ZW5zaWJsZShpdCkgJiYgIWhhcyhpdCwgTUVUQSkpc2V0TWV0YShpdCk7XG4gIHJldHVybiBpdDtcbn07XG52YXIgbWV0YSA9IG1vZHVsZS5leHBvcnRzID0ge1xuICBLRVk6ICAgICAgTUVUQSxcbiAgTkVFRDogICAgIGZhbHNlLFxuICBmYXN0S2V5OiAgZmFzdEtleSxcbiAgZ2V0V2VhazogIGdldFdlYWssXG4gIG9uRnJlZXplOiBvbkZyZWV6ZVxufTsiLCIndXNlIHN0cmljdCc7XG4vLyAxOS4xLjIuMSBPYmplY3QuYXNzaWduKHRhcmdldCwgc291cmNlLCAuLi4pXG52YXIgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgZ09QUyAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpXG4gICwgcElFICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCB0b09iamVjdCA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSU9iamVjdCAgPSByZXF1aXJlKCcuL19pb2JqZWN0JylcbiAgLCAkYXNzaWduICA9IE9iamVjdC5hc3NpZ247XG5cbi8vIHNob3VsZCB3b3JrIHdpdGggc3ltYm9scyBhbmQgc2hvdWxkIGhhdmUgZGV0ZXJtaW5pc3RpYyBwcm9wZXJ0eSBvcmRlciAoVjggYnVnKVxubW9kdWxlLmV4cG9ydHMgPSAhJGFzc2lnbiB8fCByZXF1aXJlKCcuL19mYWlscycpKGZ1bmN0aW9uKCl7XG4gIHZhciBBID0ge31cbiAgICAsIEIgPSB7fVxuICAgICwgUyA9IFN5bWJvbCgpXG4gICAgLCBLID0gJ2FiY2RlZmdoaWprbG1ub3BxcnN0JztcbiAgQVtTXSA9IDc7XG4gIEsuc3BsaXQoJycpLmZvckVhY2goZnVuY3Rpb24oayl7IEJba10gPSBrOyB9KTtcbiAgcmV0dXJuICRhc3NpZ24oe30sIEEpW1NdICE9IDcgfHwgT2JqZWN0LmtleXMoJGFzc2lnbih7fSwgQikpLmpvaW4oJycpICE9IEs7XG59KSA/IGZ1bmN0aW9uIGFzc2lnbih0YXJnZXQsIHNvdXJjZSl7IC8vIGVzbGludC1kaXNhYmxlLWxpbmUgbm8tdW51c2VkLXZhcnNcbiAgdmFyIFQgICAgID0gdG9PYmplY3QodGFyZ2V0KVxuICAgICwgYUxlbiAgPSBhcmd1bWVudHMubGVuZ3RoXG4gICAgLCBpbmRleCA9IDFcbiAgICAsIGdldFN5bWJvbHMgPSBnT1BTLmZcbiAgICAsIGlzRW51bSAgICAgPSBwSUUuZjtcbiAgd2hpbGUoYUxlbiA+IGluZGV4KXtcbiAgICB2YXIgUyAgICAgID0gSU9iamVjdChhcmd1bWVudHNbaW5kZXgrK10pXG4gICAgICAsIGtleXMgICA9IGdldFN5bWJvbHMgPyBnZXRLZXlzKFMpLmNvbmNhdChnZXRTeW1ib2xzKFMpKSA6IGdldEtleXMoUylcbiAgICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAgICwgaiAgICAgID0gMFxuICAgICAgLCBrZXk7XG4gICAgd2hpbGUobGVuZ3RoID4gailpZihpc0VudW0uY2FsbChTLCBrZXkgPSBrZXlzW2orK10pKVRba2V5XSA9IFNba2V5XTtcbiAgfSByZXR1cm4gVDtcbn0gOiAkYXNzaWduOyIsIi8vIDE5LjEuMi4yIC8gMTUuMi4zLjUgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxudmFyIGFuT2JqZWN0ICAgID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0JylcbiAgLCBkUHMgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcHMnKVxuICAsIGVudW1CdWdLZXlzID0gcmVxdWlyZSgnLi9fZW51bS1idWcta2V5cycpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBFbXB0eSAgICAgICA9IGZ1bmN0aW9uKCl7IC8qIGVtcHR5ICovIH1cbiAgLCBQUk9UT1RZUEUgICA9ICdwcm90b3R5cGUnO1xuXG4vLyBDcmVhdGUgb2JqZWN0IHdpdGggZmFrZSBgbnVsbGAgcHJvdG90eXBlOiB1c2UgaWZyYW1lIE9iamVjdCB3aXRoIGNsZWFyZWQgcHJvdG90eXBlXG52YXIgY3JlYXRlRGljdCA9IGZ1bmN0aW9uKCl7XG4gIC8vIFRocmFzaCwgd2FzdGUgYW5kIHNvZG9teTogSUUgR0MgYnVnXG4gIHZhciBpZnJhbWUgPSByZXF1aXJlKCcuL19kb20tY3JlYXRlJykoJ2lmcmFtZScpXG4gICAgLCBpICAgICAgPSBlbnVtQnVnS2V5cy5sZW5ndGhcbiAgICAsIGx0ICAgICA9ICc8J1xuICAgICwgZ3QgICAgID0gJz4nXG4gICAgLCBpZnJhbWVEb2N1bWVudDtcbiAgaWZyYW1lLnN0eWxlLmRpc3BsYXkgPSAnbm9uZSc7XG4gIHJlcXVpcmUoJy4vX2h0bWwnKS5hcHBlbmRDaGlsZChpZnJhbWUpO1xuICBpZnJhbWUuc3JjID0gJ2phdmFzY3JpcHQ6JzsgLy8gZXNsaW50LWRpc2FibGUtbGluZSBuby1zY3JpcHQtdXJsXG4gIC8vIGNyZWF0ZURpY3QgPSBpZnJhbWUuY29udGVudFdpbmRvdy5PYmplY3Q7XG4gIC8vIGh0bWwucmVtb3ZlQ2hpbGQoaWZyYW1lKTtcbiAgaWZyYW1lRG9jdW1lbnQgPSBpZnJhbWUuY29udGVudFdpbmRvdy5kb2N1bWVudDtcbiAgaWZyYW1lRG9jdW1lbnQub3BlbigpO1xuICBpZnJhbWVEb2N1bWVudC53cml0ZShsdCArICdzY3JpcHQnICsgZ3QgKyAnZG9jdW1lbnQuRj1PYmplY3QnICsgbHQgKyAnL3NjcmlwdCcgKyBndCk7XG4gIGlmcmFtZURvY3VtZW50LmNsb3NlKCk7XG4gIGNyZWF0ZURpY3QgPSBpZnJhbWVEb2N1bWVudC5GO1xuICB3aGlsZShpLS0pZGVsZXRlIGNyZWF0ZURpY3RbUFJPVE9UWVBFXVtlbnVtQnVnS2V5c1tpXV07XG4gIHJldHVybiBjcmVhdGVEaWN0KCk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IE9iamVjdC5jcmVhdGUgfHwgZnVuY3Rpb24gY3JlYXRlKE8sIFByb3BlcnRpZXMpe1xuICB2YXIgcmVzdWx0O1xuICBpZihPICE9PSBudWxsKXtcbiAgICBFbXB0eVtQUk9UT1RZUEVdID0gYW5PYmplY3QoTyk7XG4gICAgcmVzdWx0ID0gbmV3IEVtcHR5O1xuICAgIEVtcHR5W1BST1RPVFlQRV0gPSBudWxsO1xuICAgIC8vIGFkZCBcIl9fcHJvdG9fX1wiIGZvciBPYmplY3QuZ2V0UHJvdG90eXBlT2YgcG9seWZpbGxcbiAgICByZXN1bHRbSUVfUFJPVE9dID0gTztcbiAgfSBlbHNlIHJlc3VsdCA9IGNyZWF0ZURpY3QoKTtcbiAgcmV0dXJuIFByb3BlcnRpZXMgPT09IHVuZGVmaW5lZCA/IHJlc3VsdCA6IGRQcyhyZXN1bHQsIFByb3BlcnRpZXMpO1xufTtcbiIsInZhciBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgSUU4X0RPTV9ERUZJTkUgPSByZXF1aXJlKCcuL19pZTgtZG9tLWRlZmluZScpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGRQICAgICAgICAgICAgID0gT2JqZWN0LmRlZmluZVByb3BlcnR5O1xuXG5leHBvcnRzLmYgPSByZXF1aXJlKCcuL19kZXNjcmlwdG9ycycpID8gT2JqZWN0LmRlZmluZVByb3BlcnR5IDogZnVuY3Rpb24gZGVmaW5lUHJvcGVydHkoTywgUCwgQXR0cmlidXRlcyl7XG4gIGFuT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGFuT2JqZWN0KEF0dHJpYnV0ZXMpO1xuICBpZihJRThfRE9NX0RFRklORSl0cnkge1xuICAgIHJldHVybiBkUChPLCBQLCBBdHRyaWJ1dGVzKTtcbiAgfSBjYXRjaChlKXsgLyogZW1wdHkgKi8gfVxuICBpZignZ2V0JyBpbiBBdHRyaWJ1dGVzIHx8ICdzZXQnIGluIEF0dHJpYnV0ZXMpdGhyb3cgVHlwZUVycm9yKCdBY2Nlc3NvcnMgbm90IHN1cHBvcnRlZCEnKTtcbiAgaWYoJ3ZhbHVlJyBpbiBBdHRyaWJ1dGVzKU9bUF0gPSBBdHRyaWJ1dGVzLnZhbHVlO1xuICByZXR1cm4gTztcbn07IiwidmFyIGRQICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWRwJylcbiAgLCBhbk9iamVjdCA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgZ2V0S2V5cyAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyA6IGZ1bmN0aW9uIGRlZmluZVByb3BlcnRpZXMoTywgUHJvcGVydGllcyl7XG4gIGFuT2JqZWN0KE8pO1xuICB2YXIga2V5cyAgID0gZ2V0S2V5cyhQcm9wZXJ0aWVzKVxuICAgICwgbGVuZ3RoID0ga2V5cy5sZW5ndGhcbiAgICAsIGkgPSAwXG4gICAgLCBQO1xuICB3aGlsZShsZW5ndGggPiBpKWRQLmYoTywgUCA9IGtleXNbaSsrXSwgUHJvcGVydGllc1tQXSk7XG4gIHJldHVybiBPO1xufTsiLCJ2YXIgcElFICAgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3QtcGllJylcbiAgLCBjcmVhdGVEZXNjICAgICA9IHJlcXVpcmUoJy4vX3Byb3BlcnR5LWRlc2MnKVxuICAsIHRvSU9iamVjdCAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgdG9QcmltaXRpdmUgICAgPSByZXF1aXJlKCcuL190by1wcmltaXRpdmUnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBJRThfRE9NX0RFRklORSA9IHJlcXVpcmUoJy4vX2llOC1kb20tZGVmaW5lJylcbiAgLCBnT1BEICAgICAgICAgICA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I7XG5cbmV4cG9ydHMuZiA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJykgPyBnT1BEIDogZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKE8sIFApe1xuICBPID0gdG9JT2JqZWN0KE8pO1xuICBQID0gdG9QcmltaXRpdmUoUCwgdHJ1ZSk7XG4gIGlmKElFOF9ET01fREVGSU5FKXRyeSB7XG4gICAgcmV0dXJuIGdPUEQoTywgUCk7XG4gIH0gY2F0Y2goZSl7IC8qIGVtcHR5ICovIH1cbiAgaWYoaGFzKE8sIFApKXJldHVybiBjcmVhdGVEZXNjKCFwSUUuZi5jYWxsKE8sIFApLCBPW1BdKTtcbn07IiwiLy8gZmFsbGJhY2sgZm9yIElFMTEgYnVnZ3kgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMgd2l0aCBpZnJhbWUgYW5kIHdpbmRvd1xudmFyIHRvSU9iamVjdCA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGdPUE4gICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BuJykuZlxuICAsIHRvU3RyaW5nICA9IHt9LnRvU3RyaW5nO1xuXG52YXIgd2luZG93TmFtZXMgPSB0eXBlb2Ygd2luZG93ID09ICdvYmplY3QnICYmIHdpbmRvdyAmJiBPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lc1xuICA/IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHdpbmRvdykgOiBbXTtcblxudmFyIGdldFdpbmRvd05hbWVzID0gZnVuY3Rpb24oaXQpe1xuICB0cnkge1xuICAgIHJldHVybiBnT1BOKGl0KTtcbiAgfSBjYXRjaChlKXtcbiAgICByZXR1cm4gd2luZG93TmFtZXMuc2xpY2UoKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMuZiA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoaXQpe1xuICByZXR1cm4gd2luZG93TmFtZXMgJiYgdG9TdHJpbmcuY2FsbChpdCkgPT0gJ1tvYmplY3QgV2luZG93XScgPyBnZXRXaW5kb3dOYW1lcyhpdCkgOiBnT1BOKHRvSU9iamVjdChpdCkpO1xufTtcbiIsIi8vIDE5LjEuMi43IC8gMTUuMi4zLjQgT2JqZWN0LmdldE93blByb3BlcnR5TmFtZXMoTylcbnZhciAka2V5cyAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWtleXMtaW50ZXJuYWwnKVxuICAsIGhpZGRlbktleXMgPSByZXF1aXJlKCcuL19lbnVtLWJ1Zy1rZXlzJykuY29uY2F0KCdsZW5ndGgnLCAncHJvdG90eXBlJyk7XG5cbmV4cG9ydHMuZiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzIHx8IGZ1bmN0aW9uIGdldE93blByb3BlcnR5TmFtZXMoTyl7XG4gIHJldHVybiAka2V5cyhPLCBoaWRkZW5LZXlzKTtcbn07IiwiZXhwb3J0cy5mID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9sczsiLCIvLyAxOS4xLjIuOSAvIDE1LjIuMy4yIE9iamVjdC5nZXRQcm90b3R5cGVPZihPKVxudmFyIGhhcyAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCB0b09iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLW9iamVjdCcpXG4gICwgSUVfUFJPVE8gICAgPSByZXF1aXJlKCcuL19zaGFyZWQta2V5JykoJ0lFX1BST1RPJylcbiAgLCBPYmplY3RQcm90byA9IE9iamVjdC5wcm90b3R5cGU7XG5cbm1vZHVsZS5leHBvcnRzID0gT2JqZWN0LmdldFByb3RvdHlwZU9mIHx8IGZ1bmN0aW9uKE8pe1xuICBPID0gdG9PYmplY3QoTyk7XG4gIGlmKGhhcyhPLCBJRV9QUk9UTykpcmV0dXJuIE9bSUVfUFJPVE9dO1xuICBpZih0eXBlb2YgTy5jb25zdHJ1Y3RvciA9PSAnZnVuY3Rpb24nICYmIE8gaW5zdGFuY2VvZiBPLmNvbnN0cnVjdG9yKXtcbiAgICByZXR1cm4gTy5jb25zdHJ1Y3Rvci5wcm90b3R5cGU7XG4gIH0gcmV0dXJuIE8gaW5zdGFuY2VvZiBPYmplY3QgPyBPYmplY3RQcm90byA6IG51bGw7XG59OyIsInZhciBoYXMgICAgICAgICAgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIHRvSU9iamVjdCAgICA9IHJlcXVpcmUoJy4vX3RvLWlvYmplY3QnKVxuICAsIGFycmF5SW5kZXhPZiA9IHJlcXVpcmUoJy4vX2FycmF5LWluY2x1ZGVzJykoZmFsc2UpXG4gICwgSUVfUFJPVE8gICAgID0gcmVxdWlyZSgnLi9fc2hhcmVkLWtleScpKCdJRV9QUk9UTycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG9iamVjdCwgbmFtZXMpe1xuICB2YXIgTyAgICAgID0gdG9JT2JqZWN0KG9iamVjdClcbiAgICAsIGkgICAgICA9IDBcbiAgICAsIHJlc3VsdCA9IFtdXG4gICAgLCBrZXk7XG4gIGZvcihrZXkgaW4gTylpZihrZXkgIT0gSUVfUFJPVE8paGFzKE8sIGtleSkgJiYgcmVzdWx0LnB1c2goa2V5KTtcbiAgLy8gRG9uJ3QgZW51bSBidWcgJiBoaWRkZW4ga2V5c1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKWlmKGhhcyhPLCBrZXkgPSBuYW1lc1tpKytdKSl7XG4gICAgfmFycmF5SW5kZXhPZihyZXN1bHQsIGtleSkgfHwgcmVzdWx0LnB1c2goa2V5KTtcbiAgfVxuICByZXR1cm4gcmVzdWx0O1xufTsiLCIvLyAxOS4xLjIuMTQgLyAxNS4yLjMuMTQgT2JqZWN0LmtleXMoTylcbnZhciAka2V5cyAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1rZXlzLWludGVybmFsJylcbiAgLCBlbnVtQnVnS2V5cyA9IHJlcXVpcmUoJy4vX2VudW0tYnVnLWtleXMnKTtcblxubW9kdWxlLmV4cG9ydHMgPSBPYmplY3Qua2V5cyB8fCBmdW5jdGlvbiBrZXlzKE8pe1xuICByZXR1cm4gJGtleXMoTywgZW51bUJ1Z0tleXMpO1xufTsiLCJleHBvcnRzLmYgPSB7fS5wcm9wZXJ0eUlzRW51bWVyYWJsZTsiLCIvLyBtb3N0IE9iamVjdCBtZXRob2RzIGJ5IEVTNiBzaG91bGQgYWNjZXB0IHByaW1pdGl2ZXNcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0JylcbiAgLCBjb3JlICAgID0gcmVxdWlyZSgnLi9fY29yZScpXG4gICwgZmFpbHMgICA9IHJlcXVpcmUoJy4vX2ZhaWxzJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKEtFWSwgZXhlYyl7XG4gIHZhciBmbiAgPSAoY29yZS5PYmplY3QgfHwge30pW0tFWV0gfHwgT2JqZWN0W0tFWV1cbiAgICAsIGV4cCA9IHt9O1xuICBleHBbS0VZXSA9IGV4ZWMoZm4pO1xuICAkZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqIGZhaWxzKGZ1bmN0aW9uKCl7IGZuKDEpOyB9KSwgJ09iamVjdCcsIGV4cCk7XG59OyIsIm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oYml0bWFwLCB2YWx1ZSl7XG4gIHJldHVybiB7XG4gICAgZW51bWVyYWJsZSAgOiAhKGJpdG1hcCAmIDEpLFxuICAgIGNvbmZpZ3VyYWJsZTogIShiaXRtYXAgJiAyKSxcbiAgICB3cml0YWJsZSAgICA6ICEoYml0bWFwICYgNCksXG4gICAgdmFsdWUgICAgICAgOiB2YWx1ZVxuICB9O1xufTsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vX2hpZGUnKTsiLCIvLyBXb3JrcyB3aXRoIF9fcHJvdG9fXyBvbmx5LiBPbGQgdjggY2FuJ3Qgd29yayB3aXRoIG51bGwgcHJvdG8gb2JqZWN0cy5cbi8qIGVzbGludC1kaXNhYmxlIG5vLXByb3RvICovXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKVxuICAsIGFuT2JqZWN0ID0gcmVxdWlyZSgnLi9fYW4tb2JqZWN0Jyk7XG52YXIgY2hlY2sgPSBmdW5jdGlvbihPLCBwcm90byl7XG4gIGFuT2JqZWN0KE8pO1xuICBpZighaXNPYmplY3QocHJvdG8pICYmIHByb3RvICE9PSBudWxsKXRocm93IFR5cGVFcnJvcihwcm90byArIFwiOiBjYW4ndCBzZXQgYXMgcHJvdG90eXBlIVwiKTtcbn07XG5tb2R1bGUuZXhwb3J0cyA9IHtcbiAgc2V0OiBPYmplY3Quc2V0UHJvdG90eXBlT2YgfHwgKCdfX3Byb3RvX18nIGluIHt9ID8gLy8gZXNsaW50LWRpc2FibGUtbGluZVxuICAgIGZ1bmN0aW9uKHRlc3QsIGJ1Z2d5LCBzZXQpe1xuICAgICAgdHJ5IHtcbiAgICAgICAgc2V0ID0gcmVxdWlyZSgnLi9fY3R4JykoRnVuY3Rpb24uY2FsbCwgcmVxdWlyZSgnLi9fb2JqZWN0LWdvcGQnKS5mKE9iamVjdC5wcm90b3R5cGUsICdfX3Byb3RvX18nKS5zZXQsIDIpO1xuICAgICAgICBzZXQodGVzdCwgW10pO1xuICAgICAgICBidWdneSA9ICEodGVzdCBpbnN0YW5jZW9mIEFycmF5KTtcbiAgICAgIH0gY2F0Y2goZSl7IGJ1Z2d5ID0gdHJ1ZTsgfVxuICAgICAgcmV0dXJuIGZ1bmN0aW9uIHNldFByb3RvdHlwZU9mKE8sIHByb3RvKXtcbiAgICAgICAgY2hlY2soTywgcHJvdG8pO1xuICAgICAgICBpZihidWdneSlPLl9fcHJvdG9fXyA9IHByb3RvO1xuICAgICAgICBlbHNlIHNldChPLCBwcm90byk7XG4gICAgICAgIHJldHVybiBPO1xuICAgICAgfTtcbiAgICB9KHt9LCBmYWxzZSkgOiB1bmRlZmluZWQpLFxuICBjaGVjazogY2hlY2tcbn07IiwidmFyIGRlZiA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmZcbiAgLCBoYXMgPSByZXF1aXJlKCcuL19oYXMnKVxuICAsIFRBRyA9IHJlcXVpcmUoJy4vX3drcycpKCd0b1N0cmluZ1RhZycpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0LCB0YWcsIHN0YXQpe1xuICBpZihpdCAmJiAhaGFzKGl0ID0gc3RhdCA/IGl0IDogaXQucHJvdG90eXBlLCBUQUcpKWRlZihpdCwgVEFHLCB7Y29uZmlndXJhYmxlOiB0cnVlLCB2YWx1ZTogdGFnfSk7XG59OyIsInZhciBzaGFyZWQgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgna2V5cycpXG4gICwgdWlkICAgID0gcmVxdWlyZSgnLi9fdWlkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGtleSl7XG4gIHJldHVybiBzaGFyZWRba2V5XSB8fCAoc2hhcmVkW2tleV0gPSB1aWQoa2V5KSk7XG59OyIsInZhciBnbG9iYWwgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIFNIQVJFRCA9ICdfX2NvcmUtanNfc2hhcmVkX18nXG4gICwgc3RvcmUgID0gZ2xvYmFsW1NIQVJFRF0gfHwgKGdsb2JhbFtTSEFSRURdID0ge30pO1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihrZXkpe1xuICByZXR1cm4gc3RvcmVba2V5XSB8fCAoc3RvcmVba2V5XSA9IHt9KTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIGRlZmluZWQgICA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbi8vIHRydWUgIC0+IFN0cmluZyNhdFxuLy8gZmFsc2UgLT4gU3RyaW5nI2NvZGVQb2ludEF0XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKFRPX1NUUklORyl7XG4gIHJldHVybiBmdW5jdGlvbih0aGF0LCBwb3Mpe1xuICAgIHZhciBzID0gU3RyaW5nKGRlZmluZWQodGhhdCkpXG4gICAgICAsIGkgPSB0b0ludGVnZXIocG9zKVxuICAgICAgLCBsID0gcy5sZW5ndGhcbiAgICAgICwgYSwgYjtcbiAgICBpZihpIDwgMCB8fCBpID49IGwpcmV0dXJuIFRPX1NUUklORyA/ICcnIDogdW5kZWZpbmVkO1xuICAgIGEgPSBzLmNoYXJDb2RlQXQoaSk7XG4gICAgcmV0dXJuIGEgPCAweGQ4MDAgfHwgYSA+IDB4ZGJmZiB8fCBpICsgMSA9PT0gbCB8fCAoYiA9IHMuY2hhckNvZGVBdChpICsgMSkpIDwgMHhkYzAwIHx8IGIgPiAweGRmZmZcbiAgICAgID8gVE9fU1RSSU5HID8gcy5jaGFyQXQoaSkgOiBhXG4gICAgICA6IFRPX1NUUklORyA/IHMuc2xpY2UoaSwgaSArIDIpIDogKGEgLSAweGQ4MDAgPDwgMTApICsgKGIgLSAweGRjMDApICsgMHgxMDAwMDtcbiAgfTtcbn07IiwidmFyIHRvSW50ZWdlciA9IHJlcXVpcmUoJy4vX3RvLWludGVnZXInKVxuICAsIG1heCAgICAgICA9IE1hdGgubWF4XG4gICwgbWluICAgICAgID0gTWF0aC5taW47XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGluZGV4LCBsZW5ndGgpe1xuICBpbmRleCA9IHRvSW50ZWdlcihpbmRleCk7XG4gIHJldHVybiBpbmRleCA8IDAgPyBtYXgoaW5kZXggKyBsZW5ndGgsIDApIDogbWluKGluZGV4LCBsZW5ndGgpO1xufTsiLCIvLyA3LjEuNCBUb0ludGVnZXJcbnZhciBjZWlsICA9IE1hdGguY2VpbFxuICAsIGZsb29yID0gTWF0aC5mbG9vcjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXNOYU4oaXQgPSAraXQpID8gMCA6IChpdCA+IDAgPyBmbG9vciA6IGNlaWwpKGl0KTtcbn07IiwiLy8gdG8gaW5kZXhlZCBvYmplY3QsIHRvT2JqZWN0IHdpdGggZmFsbGJhY2sgZm9yIG5vbi1hcnJheS1saWtlIEVTMyBzdHJpbmdzXG52YXIgSU9iamVjdCA9IHJlcXVpcmUoJy4vX2lvYmplY3QnKVxuICAsIGRlZmluZWQgPSByZXF1aXJlKCcuL19kZWZpbmVkJyk7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGl0KXtcbiAgcmV0dXJuIElPYmplY3QoZGVmaW5lZChpdCkpO1xufTsiLCIvLyA3LjEuMTUgVG9MZW5ndGhcbnZhciB0b0ludGVnZXIgPSByZXF1aXJlKCcuL190by1pbnRlZ2VyJylcbiAgLCBtaW4gICAgICAgPSBNYXRoLm1pbjtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgPiAwID8gbWluKHRvSW50ZWdlcihpdCksIDB4MWZmZmZmZmZmZmZmZmYpIDogMDsgLy8gcG93KDIsIDUzKSAtIDEgPT0gOTAwNzE5OTI1NDc0MDk5MVxufTsiLCIvLyA3LjEuMTMgVG9PYmplY3QoYXJndW1lbnQpXG52YXIgZGVmaW5lZCA9IHJlcXVpcmUoJy4vX2RlZmluZWQnKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gT2JqZWN0KGRlZmluZWQoaXQpKTtcbn07IiwiLy8gNy4xLjEgVG9QcmltaXRpdmUoaW5wdXQgWywgUHJlZmVycmVkVHlwZV0pXG52YXIgaXNPYmplY3QgPSByZXF1aXJlKCcuL19pcy1vYmplY3QnKTtcbi8vIGluc3RlYWQgb2YgdGhlIEVTNiBzcGVjIHZlcnNpb24sIHdlIGRpZG4ndCBpbXBsZW1lbnQgQEB0b1ByaW1pdGl2ZSBjYXNlXG4vLyBhbmQgdGhlIHNlY29uZCBhcmd1bWVudCAtIGZsYWcgLSBwcmVmZXJyZWQgdHlwZSBpcyBhIHN0cmluZ1xubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihpdCwgUyl7XG4gIGlmKCFpc09iamVjdChpdCkpcmV0dXJuIGl0O1xuICB2YXIgZm4sIHZhbDtcbiAgaWYoUyAmJiB0eXBlb2YgKGZuID0gaXQudG9TdHJpbmcpID09ICdmdW5jdGlvbicgJiYgIWlzT2JqZWN0KHZhbCA9IGZuLmNhbGwoaXQpKSlyZXR1cm4gdmFsO1xuICBpZih0eXBlb2YgKGZuID0gaXQudmFsdWVPZikgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIGlmKCFTICYmIHR5cGVvZiAoZm4gPSBpdC50b1N0cmluZykgPT0gJ2Z1bmN0aW9uJyAmJiAhaXNPYmplY3QodmFsID0gZm4uY2FsbChpdCkpKXJldHVybiB2YWw7XG4gIHRocm93IFR5cGVFcnJvcihcIkNhbid0IGNvbnZlcnQgb2JqZWN0IHRvIHByaW1pdGl2ZSB2YWx1ZVwiKTtcbn07IiwidmFyIGlkID0gMFxuICAsIHB4ID0gTWF0aC5yYW5kb20oKTtcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24oa2V5KXtcbiAgcmV0dXJuICdTeW1ib2woJy5jb25jYXQoa2V5ID09PSB1bmRlZmluZWQgPyAnJyA6IGtleSwgJylfJywgKCsraWQgKyBweCkudG9TdHJpbmcoMzYpKTtcbn07IiwidmFyIGdsb2JhbCAgICAgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJylcbiAgLCBjb3JlICAgICAgICAgICA9IHJlcXVpcmUoJy4vX2NvcmUnKVxuICAsIExJQlJBUlkgICAgICAgID0gcmVxdWlyZSgnLi9fbGlicmFyeScpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCBkZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpLmY7XG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKG5hbWUpe1xuICB2YXIgJFN5bWJvbCA9IGNvcmUuU3ltYm9sIHx8IChjb3JlLlN5bWJvbCA9IExJQlJBUlkgPyB7fSA6IGdsb2JhbC5TeW1ib2wgfHwge30pO1xuICBpZihuYW1lLmNoYXJBdCgwKSAhPSAnXycgJiYgIShuYW1lIGluICRTeW1ib2wpKWRlZmluZVByb3BlcnR5KCRTeW1ib2wsIG5hbWUsIHt2YWx1ZTogd2tzRXh0LmYobmFtZSl9KTtcbn07IiwiZXhwb3J0cy5mID0gcmVxdWlyZSgnLi9fd2tzJyk7IiwidmFyIHN0b3JlICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKSgnd2tzJylcbiAgLCB1aWQgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCBTeW1ib2wgICAgID0gcmVxdWlyZSgnLi9fZ2xvYmFsJykuU3ltYm9sXG4gICwgVVNFX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT0gJ2Z1bmN0aW9uJztcblxudmFyICRleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihuYW1lKXtcbiAgcmV0dXJuIHN0b3JlW25hbWVdIHx8IChzdG9yZVtuYW1lXSA9XG4gICAgVVNFX1NZTUJPTCAmJiBTeW1ib2xbbmFtZV0gfHwgKFVTRV9TWU1CT0wgPyBTeW1ib2wgOiB1aWQpKCdTeW1ib2wuJyArIG5hbWUpKTtcbn07XG5cbiRleHBvcnRzLnN0b3JlID0gc3RvcmU7IiwiJ3VzZSBzdHJpY3QnO1xudmFyIGFkZFRvVW5zY29wYWJsZXMgPSByZXF1aXJlKCcuL19hZGQtdG8tdW5zY29wYWJsZXMnKVxuICAsIHN0ZXAgICAgICAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyLXN0ZXAnKVxuICAsIEl0ZXJhdG9ycyAgICAgICAgPSByZXF1aXJlKCcuL19pdGVyYXRvcnMnKVxuICAsIHRvSU9iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0Jyk7XG5cbi8vIDIyLjEuMy40IEFycmF5LnByb3RvdHlwZS5lbnRyaWVzKClcbi8vIDIyLjEuMy4xMyBBcnJheS5wcm90b3R5cGUua2V5cygpXG4vLyAyMi4xLjMuMjkgQXJyYXkucHJvdG90eXBlLnZhbHVlcygpXG4vLyAyMi4xLjMuMzAgQXJyYXkucHJvdG90eXBlW0BAaXRlcmF0b3JdKClcbm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShBcnJheSwgJ0FycmF5JywgZnVuY3Rpb24oaXRlcmF0ZWQsIGtpbmQpe1xuICB0aGlzLl90ID0gdG9JT2JqZWN0KGl0ZXJhdGVkKTsgLy8gdGFyZ2V0XG4gIHRoaXMuX2kgPSAwOyAgICAgICAgICAgICAgICAgICAvLyBuZXh0IGluZGV4XG4gIHRoaXMuX2sgPSBraW5kOyAgICAgICAgICAgICAgICAvLyBraW5kXG4vLyAyMi4xLjUuMi4xICVBcnJheUl0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGtpbmQgID0gdGhpcy5fa1xuICAgICwgaW5kZXggPSB0aGlzLl9pKys7XG4gIGlmKCFPIHx8IGluZGV4ID49IE8ubGVuZ3RoKXtcbiAgICB0aGlzLl90ID0gdW5kZWZpbmVkO1xuICAgIHJldHVybiBzdGVwKDEpO1xuICB9XG4gIGlmKGtpbmQgPT0gJ2tleXMnICApcmV0dXJuIHN0ZXAoMCwgaW5kZXgpO1xuICBpZihraW5kID09ICd2YWx1ZXMnKXJldHVybiBzdGVwKDAsIE9baW5kZXhdKTtcbiAgcmV0dXJuIHN0ZXAoMCwgW2luZGV4LCBPW2luZGV4XV0pO1xufSwgJ3ZhbHVlcycpO1xuXG4vLyBhcmd1bWVudHNMaXN0W0BAaXRlcmF0b3JdIGlzICVBcnJheVByb3RvX3ZhbHVlcyUgKDkuNC40LjYsIDkuNC40LjcpXG5JdGVyYXRvcnMuQXJndW1lbnRzID0gSXRlcmF0b3JzLkFycmF5O1xuXG5hZGRUb1Vuc2NvcGFibGVzKCdrZXlzJyk7XG5hZGRUb1Vuc2NvcGFibGVzKCd2YWx1ZXMnKTtcbmFkZFRvVW5zY29wYWJsZXMoJ2VudHJpZXMnKTsiLCIvLyAyMC4xLjIuMyBOdW1iZXIuaXNJbnRlZ2VyKG51bWJlcilcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TLCAnTnVtYmVyJywge2lzSW50ZWdlcjogcmVxdWlyZSgnLi9faXMtaW50ZWdlcicpfSk7IiwiLy8gMTkuMS4zLjEgT2JqZWN0LmFzc2lnbih0YXJnZXQsIHNvdXJjZSlcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG5cbiRleHBvcnQoJGV4cG9ydC5TICsgJGV4cG9ydC5GLCAnT2JqZWN0Jywge2Fzc2lnbjogcmVxdWlyZSgnLi9fb2JqZWN0LWFzc2lnbicpfSk7IiwidmFyICRleHBvcnQgPSByZXF1aXJlKCcuL19leHBvcnQnKVxuLy8gMTkuMS4yLjIgLyAxNS4yLjMuNSBPYmplY3QuY3JlYXRlKE8gWywgUHJvcGVydGllc10pXG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtjcmVhdGU6IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKX0pOyIsInZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4vLyAxOS4xLjIuNCAvIDE1LjIuMy42IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhcmVxdWlyZSgnLi9fZGVzY3JpcHRvcnMnKSwgJ09iamVjdCcsIHtkZWZpbmVQcm9wZXJ0eTogcmVxdWlyZSgnLi9fb2JqZWN0LWRwJykuZn0pOyIsIi8vIDE5LjEuMi42IE9iamVjdC5nZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IoTywgUClcbnZhciB0b0lPYmplY3QgICAgICAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdG8taW9iamVjdCcpXG4gICwgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJykuZjtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3InLCBmdW5jdGlvbigpe1xuICByZXR1cm4gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKGl0LCBrZXkpe1xuICAgIHJldHVybiAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yKHRvSU9iamVjdChpdCksIGtleSk7XG4gIH07XG59KTsiLCIvLyAxOS4xLjIuOSBPYmplY3QuZ2V0UHJvdG90eXBlT2YoTylcbnZhciB0b09iamVjdCAgICAgICAgPSByZXF1aXJlKCcuL190by1vYmplY3QnKVxuICAsICRnZXRQcm90b3R5cGVPZiA9IHJlcXVpcmUoJy4vX29iamVjdC1ncG8nKTtcblxucmVxdWlyZSgnLi9fb2JqZWN0LXNhcCcpKCdnZXRQcm90b3R5cGVPZicsIGZ1bmN0aW9uKCl7XG4gIHJldHVybiBmdW5jdGlvbiBnZXRQcm90b3R5cGVPZihpdCl7XG4gICAgcmV0dXJuICRnZXRQcm90b3R5cGVPZih0b09iamVjdChpdCkpO1xuICB9O1xufSk7IiwiLy8gMTkuMS4zLjE5IE9iamVjdC5zZXRQcm90b3R5cGVPZihPLCBwcm90bylcbnZhciAkZXhwb3J0ID0gcmVxdWlyZSgnLi9fZXhwb3J0Jyk7XG4kZXhwb3J0KCRleHBvcnQuUywgJ09iamVjdCcsIHtzZXRQcm90b3R5cGVPZjogcmVxdWlyZSgnLi9fc2V0LXByb3RvJykuc2V0fSk7IiwiIiwiJ3VzZSBzdHJpY3QnO1xudmFyICRhdCAgPSByZXF1aXJlKCcuL19zdHJpbmctYXQnKSh0cnVlKTtcblxuLy8gMjEuMS4zLjI3IFN0cmluZy5wcm90b3R5cGVbQEBpdGVyYXRvcl0oKVxucmVxdWlyZSgnLi9faXRlci1kZWZpbmUnKShTdHJpbmcsICdTdHJpbmcnLCBmdW5jdGlvbihpdGVyYXRlZCl7XG4gIHRoaXMuX3QgPSBTdHJpbmcoaXRlcmF0ZWQpOyAvLyB0YXJnZXRcbiAgdGhpcy5faSA9IDA7ICAgICAgICAgICAgICAgIC8vIG5leHQgaW5kZXhcbi8vIDIxLjEuNS4yLjEgJVN0cmluZ0l0ZXJhdG9yUHJvdG90eXBlJS5uZXh0KClcbn0sIGZ1bmN0aW9uKCl7XG4gIHZhciBPICAgICA9IHRoaXMuX3RcbiAgICAsIGluZGV4ID0gdGhpcy5faVxuICAgICwgcG9pbnQ7XG4gIGlmKGluZGV4ID49IE8ubGVuZ3RoKXJldHVybiB7dmFsdWU6IHVuZGVmaW5lZCwgZG9uZTogdHJ1ZX07XG4gIHBvaW50ID0gJGF0KE8sIGluZGV4KTtcbiAgdGhpcy5faSArPSBwb2ludC5sZW5ndGg7XG4gIHJldHVybiB7dmFsdWU6IHBvaW50LCBkb25lOiBmYWxzZX07XG59KTsiLCIndXNlIHN0cmljdCc7XG4vLyBFQ01BU2NyaXB0IDYgc3ltYm9scyBzaGltXG52YXIgZ2xvYmFsICAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhhcyAgICAgICAgICAgID0gcmVxdWlyZSgnLi9faGFzJylcbiAgLCBERVNDUklQVE9SUyAgICA9IHJlcXVpcmUoJy4vX2Rlc2NyaXB0b3JzJylcbiAgLCAkZXhwb3J0ICAgICAgICA9IHJlcXVpcmUoJy4vX2V4cG9ydCcpXG4gICwgcmVkZWZpbmUgICAgICAgPSByZXF1aXJlKCcuL19yZWRlZmluZScpXG4gICwgTUVUQSAgICAgICAgICAgPSByZXF1aXJlKCcuL19tZXRhJykuS0VZXG4gICwgJGZhaWxzICAgICAgICAgPSByZXF1aXJlKCcuL19mYWlscycpXG4gICwgc2hhcmVkICAgICAgICAgPSByZXF1aXJlKCcuL19zaGFyZWQnKVxuICAsIHNldFRvU3RyaW5nVGFnID0gcmVxdWlyZSgnLi9fc2V0LXRvLXN0cmluZy10YWcnKVxuICAsIHVpZCAgICAgICAgICAgID0gcmVxdWlyZSgnLi9fdWlkJylcbiAgLCB3a3MgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX3drcycpXG4gICwgd2tzRXh0ICAgICAgICAgPSByZXF1aXJlKCcuL193a3MtZXh0JylcbiAgLCB3a3NEZWZpbmUgICAgICA9IHJlcXVpcmUoJy4vX3drcy1kZWZpbmUnKVxuICAsIGtleU9mICAgICAgICAgID0gcmVxdWlyZSgnLi9fa2V5b2YnKVxuICAsIGVudW1LZXlzICAgICAgID0gcmVxdWlyZSgnLi9fZW51bS1rZXlzJylcbiAgLCBpc0FycmF5ICAgICAgICA9IHJlcXVpcmUoJy4vX2lzLWFycmF5JylcbiAgLCBhbk9iamVjdCAgICAgICA9IHJlcXVpcmUoJy4vX2FuLW9iamVjdCcpXG4gICwgdG9JT2JqZWN0ICAgICAgPSByZXF1aXJlKCcuL190by1pb2JqZWN0JylcbiAgLCB0b1ByaW1pdGl2ZSAgICA9IHJlcXVpcmUoJy4vX3RvLXByaW1pdGl2ZScpXG4gICwgY3JlYXRlRGVzYyAgICAgPSByZXF1aXJlKCcuL19wcm9wZXJ0eS1kZXNjJylcbiAgLCBfY3JlYXRlICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1jcmVhdGUnKVxuICAsIGdPUE5FeHQgICAgICAgID0gcmVxdWlyZSgnLi9fb2JqZWN0LWdvcG4tZXh0JylcbiAgLCAkR09QRCAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1nb3BkJylcbiAgLCAkRFAgICAgICAgICAgICA9IHJlcXVpcmUoJy4vX29iamVjdC1kcCcpXG4gICwgJGtleXMgICAgICAgICAgPSByZXF1aXJlKCcuL19vYmplY3Qta2V5cycpXG4gICwgZ09QRCAgICAgICAgICAgPSAkR09QRC5mXG4gICwgZFAgICAgICAgICAgICAgPSAkRFAuZlxuICAsIGdPUE4gICAgICAgICAgID0gZ09QTkV4dC5mXG4gICwgJFN5bWJvbCAgICAgICAgPSBnbG9iYWwuU3ltYm9sXG4gICwgJEpTT04gICAgICAgICAgPSBnbG9iYWwuSlNPTlxuICAsIF9zdHJpbmdpZnkgICAgID0gJEpTT04gJiYgJEpTT04uc3RyaW5naWZ5XG4gICwgUFJPVE9UWVBFICAgICAgPSAncHJvdG90eXBlJ1xuICAsIEhJRERFTiAgICAgICAgID0gd2tzKCdfaGlkZGVuJylcbiAgLCBUT19QUklNSVRJVkUgICA9IHdrcygndG9QcmltaXRpdmUnKVxuICAsIGlzRW51bSAgICAgICAgID0ge30ucHJvcGVydHlJc0VudW1lcmFibGVcbiAgLCBTeW1ib2xSZWdpc3RyeSA9IHNoYXJlZCgnc3ltYm9sLXJlZ2lzdHJ5JylcbiAgLCBBbGxTeW1ib2xzICAgICA9IHNoYXJlZCgnc3ltYm9scycpXG4gICwgT1BTeW1ib2xzICAgICAgPSBzaGFyZWQoJ29wLXN5bWJvbHMnKVxuICAsIE9iamVjdFByb3RvICAgID0gT2JqZWN0W1BST1RPVFlQRV1cbiAgLCBVU0VfTkFUSVZFICAgICA9IHR5cGVvZiAkU3ltYm9sID09ICdmdW5jdGlvbidcbiAgLCBRT2JqZWN0ICAgICAgICA9IGdsb2JhbC5RT2JqZWN0O1xuLy8gRG9uJ3QgdXNlIHNldHRlcnMgaW4gUXQgU2NyaXB0LCBodHRwczovL2dpdGh1Yi5jb20vemxvaXJvY2svY29yZS1qcy9pc3N1ZXMvMTczXG52YXIgc2V0dGVyID0gIVFPYmplY3QgfHwgIVFPYmplY3RbUFJPVE9UWVBFXSB8fCAhUU9iamVjdFtQUk9UT1RZUEVdLmZpbmRDaGlsZDtcblxuLy8gZmFsbGJhY2sgZm9yIG9sZCBBbmRyb2lkLCBodHRwczovL2NvZGUuZ29vZ2xlLmNvbS9wL3Y4L2lzc3Vlcy9kZXRhaWw/aWQ9Njg3XG52YXIgc2V0U3ltYm9sRGVzYyA9IERFU0NSSVBUT1JTICYmICRmYWlscyhmdW5jdGlvbigpe1xuICByZXR1cm4gX2NyZWF0ZShkUCh7fSwgJ2EnLCB7XG4gICAgZ2V0OiBmdW5jdGlvbigpeyByZXR1cm4gZFAodGhpcywgJ2EnLCB7dmFsdWU6IDd9KS5hOyB9XG4gIH0pKS5hICE9IDc7XG59KSA/IGZ1bmN0aW9uKGl0LCBrZXksIEQpe1xuICB2YXIgcHJvdG9EZXNjID0gZ09QRChPYmplY3RQcm90bywga2V5KTtcbiAgaWYocHJvdG9EZXNjKWRlbGV0ZSBPYmplY3RQcm90b1trZXldO1xuICBkUChpdCwga2V5LCBEKTtcbiAgaWYocHJvdG9EZXNjICYmIGl0ICE9PSBPYmplY3RQcm90bylkUChPYmplY3RQcm90bywga2V5LCBwcm90b0Rlc2MpO1xufSA6IGRQO1xuXG52YXIgd3JhcCA9IGZ1bmN0aW9uKHRhZyl7XG4gIHZhciBzeW0gPSBBbGxTeW1ib2xzW3RhZ10gPSBfY3JlYXRlKCRTeW1ib2xbUFJPVE9UWVBFXSk7XG4gIHN5bS5fayA9IHRhZztcbiAgcmV0dXJuIHN5bTtcbn07XG5cbnZhciBpc1N5bWJvbCA9IFVTRV9OQVRJVkUgJiYgdHlwZW9mICRTeW1ib2wuaXRlcmF0b3IgPT0gJ3N5bWJvbCcgPyBmdW5jdGlvbihpdCl7XG4gIHJldHVybiB0eXBlb2YgaXQgPT0gJ3N5bWJvbCc7XG59IDogZnVuY3Rpb24oaXQpe1xuICByZXR1cm4gaXQgaW5zdGFuY2VvZiAkU3ltYm9sO1xufTtcblxudmFyICRkZWZpbmVQcm9wZXJ0eSA9IGZ1bmN0aW9uIGRlZmluZVByb3BlcnR5KGl0LCBrZXksIEQpe1xuICBpZihpdCA9PT0gT2JqZWN0UHJvdG8pJGRlZmluZVByb3BlcnR5KE9QU3ltYm9scywga2V5LCBEKTtcbiAgYW5PYmplY3QoaXQpO1xuICBrZXkgPSB0b1ByaW1pdGl2ZShrZXksIHRydWUpO1xuICBhbk9iamVjdChEKTtcbiAgaWYoaGFzKEFsbFN5bWJvbHMsIGtleSkpe1xuICAgIGlmKCFELmVudW1lcmFibGUpe1xuICAgICAgaWYoIWhhcyhpdCwgSElEREVOKSlkUChpdCwgSElEREVOLCBjcmVhdGVEZXNjKDEsIHt9KSk7XG4gICAgICBpdFtISURERU5dW2tleV0gPSB0cnVlO1xuICAgIH0gZWxzZSB7XG4gICAgICBpZihoYXMoaXQsIEhJRERFTikgJiYgaXRbSElEREVOXVtrZXldKWl0W0hJRERFTl1ba2V5XSA9IGZhbHNlO1xuICAgICAgRCA9IF9jcmVhdGUoRCwge2VudW1lcmFibGU6IGNyZWF0ZURlc2MoMCwgZmFsc2UpfSk7XG4gICAgfSByZXR1cm4gc2V0U3ltYm9sRGVzYyhpdCwga2V5LCBEKTtcbiAgfSByZXR1cm4gZFAoaXQsIGtleSwgRCk7XG59O1xudmFyICRkZWZpbmVQcm9wZXJ0aWVzID0gZnVuY3Rpb24gZGVmaW5lUHJvcGVydGllcyhpdCwgUCl7XG4gIGFuT2JqZWN0KGl0KTtcbiAgdmFyIGtleXMgPSBlbnVtS2V5cyhQID0gdG9JT2JqZWN0KFApKVxuICAgICwgaSAgICA9IDBcbiAgICAsIGwgPSBrZXlzLmxlbmd0aFxuICAgICwga2V5O1xuICB3aGlsZShsID4gaSkkZGVmaW5lUHJvcGVydHkoaXQsIGtleSA9IGtleXNbaSsrXSwgUFtrZXldKTtcbiAgcmV0dXJuIGl0O1xufTtcbnZhciAkY3JlYXRlID0gZnVuY3Rpb24gY3JlYXRlKGl0LCBQKXtcbiAgcmV0dXJuIFAgPT09IHVuZGVmaW5lZCA/IF9jcmVhdGUoaXQpIDogJGRlZmluZVByb3BlcnRpZXMoX2NyZWF0ZShpdCksIFApO1xufTtcbnZhciAkcHJvcGVydHlJc0VudW1lcmFibGUgPSBmdW5jdGlvbiBwcm9wZXJ0eUlzRW51bWVyYWJsZShrZXkpe1xuICB2YXIgRSA9IGlzRW51bS5jYWxsKHRoaXMsIGtleSA9IHRvUHJpbWl0aXZlKGtleSwgdHJ1ZSkpO1xuICBpZih0aGlzID09PSBPYmplY3RQcm90byAmJiBoYXMoQWxsU3ltYm9scywga2V5KSAmJiAhaGFzKE9QU3ltYm9scywga2V5KSlyZXR1cm4gZmFsc2U7XG4gIHJldHVybiBFIHx8ICFoYXModGhpcywga2V5KSB8fCAhaGFzKEFsbFN5bWJvbHMsIGtleSkgfHwgaGFzKHRoaXMsIEhJRERFTikgJiYgdGhpc1tISURERU5dW2tleV0gPyBFIDogdHJ1ZTtcbn07XG52YXIgJGdldE93blByb3BlcnR5RGVzY3JpcHRvciA9IGZ1bmN0aW9uIGdldE93blByb3BlcnR5RGVzY3JpcHRvcihpdCwga2V5KXtcbiAgaXQgID0gdG9JT2JqZWN0KGl0KTtcbiAga2V5ID0gdG9QcmltaXRpdmUoa2V5LCB0cnVlKTtcbiAgaWYoaXQgPT09IE9iamVjdFByb3RvICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICFoYXMoT1BTeW1ib2xzLCBrZXkpKXJldHVybjtcbiAgdmFyIEQgPSBnT1BEKGl0LCBrZXkpO1xuICBpZihEICYmIGhhcyhBbGxTeW1ib2xzLCBrZXkpICYmICEoaGFzKGl0LCBISURERU4pICYmIGl0W0hJRERFTl1ba2V5XSkpRC5lbnVtZXJhYmxlID0gdHJ1ZTtcbiAgcmV0dXJuIEQ7XG59O1xudmFyICRnZXRPd25Qcm9wZXJ0eU5hbWVzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlOYW1lcyhpdCl7XG4gIHZhciBuYW1lcyAgPSBnT1BOKHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKXtcbiAgICBpZighaGFzKEFsbFN5bWJvbHMsIGtleSA9IG5hbWVzW2krK10pICYmIGtleSAhPSBISURERU4gJiYga2V5ICE9IE1FVEEpcmVzdWx0LnB1c2goa2V5KTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcbnZhciAkZ2V0T3duUHJvcGVydHlTeW1ib2xzID0gZnVuY3Rpb24gZ2V0T3duUHJvcGVydHlTeW1ib2xzKGl0KXtcbiAgdmFyIElTX09QICA9IGl0ID09PSBPYmplY3RQcm90b1xuICAgICwgbmFtZXMgID0gZ09QTihJU19PUCA/IE9QU3ltYm9scyA6IHRvSU9iamVjdChpdCkpXG4gICAgLCByZXN1bHQgPSBbXVxuICAgICwgaSAgICAgID0gMFxuICAgICwga2V5O1xuICB3aGlsZShuYW1lcy5sZW5ndGggPiBpKXtcbiAgICBpZihoYXMoQWxsU3ltYm9scywga2V5ID0gbmFtZXNbaSsrXSkgJiYgKElTX09QID8gaGFzKE9iamVjdFByb3RvLCBrZXkpIDogdHJ1ZSkpcmVzdWx0LnB1c2goQWxsU3ltYm9sc1trZXldKTtcbiAgfSByZXR1cm4gcmVzdWx0O1xufTtcblxuLy8gMTkuNC4xLjEgU3ltYm9sKFtkZXNjcmlwdGlvbl0pXG5pZighVVNFX05BVElWRSl7XG4gICRTeW1ib2wgPSBmdW5jdGlvbiBTeW1ib2woKXtcbiAgICBpZih0aGlzIGluc3RhbmNlb2YgJFN5bWJvbCl0aHJvdyBUeXBlRXJyb3IoJ1N5bWJvbCBpcyBub3QgYSBjb25zdHJ1Y3RvciEnKTtcbiAgICB2YXIgdGFnID0gdWlkKGFyZ3VtZW50cy5sZW5ndGggPiAwID8gYXJndW1lbnRzWzBdIDogdW5kZWZpbmVkKTtcbiAgICB2YXIgJHNldCA9IGZ1bmN0aW9uKHZhbHVlKXtcbiAgICAgIGlmKHRoaXMgPT09IE9iamVjdFByb3RvKSRzZXQuY2FsbChPUFN5bWJvbHMsIHZhbHVlKTtcbiAgICAgIGlmKGhhcyh0aGlzLCBISURERU4pICYmIGhhcyh0aGlzW0hJRERFTl0sIHRhZykpdGhpc1tISURERU5dW3RhZ10gPSBmYWxzZTtcbiAgICAgIHNldFN5bWJvbERlc2ModGhpcywgdGFnLCBjcmVhdGVEZXNjKDEsIHZhbHVlKSk7XG4gICAgfTtcbiAgICBpZihERVNDUklQVE9SUyAmJiBzZXR0ZXIpc2V0U3ltYm9sRGVzYyhPYmplY3RQcm90bywgdGFnLCB7Y29uZmlndXJhYmxlOiB0cnVlLCBzZXQ6ICRzZXR9KTtcbiAgICByZXR1cm4gd3JhcCh0YWcpO1xuICB9O1xuICByZWRlZmluZSgkU3ltYm9sW1BST1RPVFlQRV0sICd0b1N0cmluZycsIGZ1bmN0aW9uIHRvU3RyaW5nKCl7XG4gICAgcmV0dXJuIHRoaXMuX2s7XG4gIH0pO1xuXG4gICRHT1BELmYgPSAkZ2V0T3duUHJvcGVydHlEZXNjcmlwdG9yO1xuICAkRFAuZiAgID0gJGRlZmluZVByb3BlcnR5O1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wbicpLmYgPSBnT1BORXh0LmYgPSAkZ2V0T3duUHJvcGVydHlOYW1lcztcbiAgcmVxdWlyZSgnLi9fb2JqZWN0LXBpZScpLmYgID0gJHByb3BlcnR5SXNFbnVtZXJhYmxlO1xuICByZXF1aXJlKCcuL19vYmplY3QtZ29wcycpLmYgPSAkZ2V0T3duUHJvcGVydHlTeW1ib2xzO1xuXG4gIGlmKERFU0NSSVBUT1JTICYmICFyZXF1aXJlKCcuL19saWJyYXJ5Jykpe1xuICAgIHJlZGVmaW5lKE9iamVjdFByb3RvLCAncHJvcGVydHlJc0VudW1lcmFibGUnLCAkcHJvcGVydHlJc0VudW1lcmFibGUsIHRydWUpO1xuICB9XG5cbiAgd2tzRXh0LmYgPSBmdW5jdGlvbihuYW1lKXtcbiAgICByZXR1cm4gd3JhcCh3a3MobmFtZSkpO1xuICB9XG59XG5cbiRleHBvcnQoJGV4cG9ydC5HICsgJGV4cG9ydC5XICsgJGV4cG9ydC5GICogIVVTRV9OQVRJVkUsIHtTeW1ib2w6ICRTeW1ib2x9KTtcblxuZm9yKHZhciBzeW1ib2xzID0gKFxuICAvLyAxOS40LjIuMiwgMTkuNC4yLjMsIDE5LjQuMi40LCAxOS40LjIuNiwgMTkuNC4yLjgsIDE5LjQuMi45LCAxOS40LjIuMTAsIDE5LjQuMi4xMSwgMTkuNC4yLjEyLCAxOS40LjIuMTMsIDE5LjQuMi4xNFxuICAnaGFzSW5zdGFuY2UsaXNDb25jYXRTcHJlYWRhYmxlLGl0ZXJhdG9yLG1hdGNoLHJlcGxhY2Usc2VhcmNoLHNwZWNpZXMsc3BsaXQsdG9QcmltaXRpdmUsdG9TdHJpbmdUYWcsdW5zY29wYWJsZXMnXG4pLnNwbGl0KCcsJyksIGkgPSAwOyBzeW1ib2xzLmxlbmd0aCA+IGk7ICl3a3Moc3ltYm9sc1tpKytdKTtcblxuZm9yKHZhciBzeW1ib2xzID0gJGtleXMod2tzLnN0b3JlKSwgaSA9IDA7IHN5bWJvbHMubGVuZ3RoID4gaTsgKXdrc0RlZmluZShzeW1ib2xzW2krK10pO1xuXG4kZXhwb3J0KCRleHBvcnQuUyArICRleHBvcnQuRiAqICFVU0VfTkFUSVZFLCAnU3ltYm9sJywge1xuICAvLyAxOS40LjIuMSBTeW1ib2wuZm9yKGtleSlcbiAgJ2Zvcic6IGZ1bmN0aW9uKGtleSl7XG4gICAgcmV0dXJuIGhhcyhTeW1ib2xSZWdpc3RyeSwga2V5ICs9ICcnKVxuICAgICAgPyBTeW1ib2xSZWdpc3RyeVtrZXldXG4gICAgICA6IFN5bWJvbFJlZ2lzdHJ5W2tleV0gPSAkU3ltYm9sKGtleSk7XG4gIH0sXG4gIC8vIDE5LjQuMi41IFN5bWJvbC5rZXlGb3Ioc3ltKVxuICBrZXlGb3I6IGZ1bmN0aW9uIGtleUZvcihrZXkpe1xuICAgIGlmKGlzU3ltYm9sKGtleSkpcmV0dXJuIGtleU9mKFN5bWJvbFJlZ2lzdHJ5LCBrZXkpO1xuICAgIHRocm93IFR5cGVFcnJvcihrZXkgKyAnIGlzIG5vdCBhIHN5bWJvbCEnKTtcbiAgfSxcbiAgdXNlU2V0dGVyOiBmdW5jdGlvbigpeyBzZXR0ZXIgPSB0cnVlOyB9LFxuICB1c2VTaW1wbGU6IGZ1bmN0aW9uKCl7IHNldHRlciA9IGZhbHNlOyB9XG59KTtcblxuJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAhVVNFX05BVElWRSwgJ09iamVjdCcsIHtcbiAgLy8gMTkuMS4yLjIgT2JqZWN0LmNyZWF0ZShPIFssIFByb3BlcnRpZXNdKVxuICBjcmVhdGU6ICRjcmVhdGUsXG4gIC8vIDE5LjEuMi40IE9iamVjdC5kZWZpbmVQcm9wZXJ0eShPLCBQLCBBdHRyaWJ1dGVzKVxuICBkZWZpbmVQcm9wZXJ0eTogJGRlZmluZVByb3BlcnR5LFxuICAvLyAxOS4xLjIuMyBPYmplY3QuZGVmaW5lUHJvcGVydGllcyhPLCBQcm9wZXJ0aWVzKVxuICBkZWZpbmVQcm9wZXJ0aWVzOiAkZGVmaW5lUHJvcGVydGllcyxcbiAgLy8gMTkuMS4yLjYgT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihPLCBQKVxuICBnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3I6ICRnZXRPd25Qcm9wZXJ0eURlc2NyaXB0b3IsXG4gIC8vIDE5LjEuMi43IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKE8pXG4gIGdldE93blByb3BlcnR5TmFtZXM6ICRnZXRPd25Qcm9wZXJ0eU5hbWVzLFxuICAvLyAxOS4xLjIuOCBPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKE8pXG4gIGdldE93blByb3BlcnR5U3ltYm9sczogJGdldE93blByb3BlcnR5U3ltYm9sc1xufSk7XG5cbi8vIDI0LjMuMiBKU09OLnN0cmluZ2lmeSh2YWx1ZSBbLCByZXBsYWNlciBbLCBzcGFjZV1dKVxuJEpTT04gJiYgJGV4cG9ydCgkZXhwb3J0LlMgKyAkZXhwb3J0LkYgKiAoIVVTRV9OQVRJVkUgfHwgJGZhaWxzKGZ1bmN0aW9uKCl7XG4gIHZhciBTID0gJFN5bWJvbCgpO1xuICAvLyBNUyBFZGdlIGNvbnZlcnRzIHN5bWJvbCB2YWx1ZXMgdG8gSlNPTiBhcyB7fVxuICAvLyBXZWJLaXQgY29udmVydHMgc3ltYm9sIHZhbHVlcyB0byBKU09OIGFzIG51bGxcbiAgLy8gVjggdGhyb3dzIG9uIGJveGVkIHN5bWJvbHNcbiAgcmV0dXJuIF9zdHJpbmdpZnkoW1NdKSAhPSAnW251bGxdJyB8fCBfc3RyaW5naWZ5KHthOiBTfSkgIT0gJ3t9JyB8fCBfc3RyaW5naWZ5KE9iamVjdChTKSkgIT0gJ3t9Jztcbn0pKSwgJ0pTT04nLCB7XG4gIHN0cmluZ2lmeTogZnVuY3Rpb24gc3RyaW5naWZ5KGl0KXtcbiAgICBpZihpdCA9PT0gdW5kZWZpbmVkIHx8IGlzU3ltYm9sKGl0KSlyZXR1cm47IC8vIElFOCByZXR1cm5zIHN0cmluZyBvbiB1bmRlZmluZWRcbiAgICB2YXIgYXJncyA9IFtpdF1cbiAgICAgICwgaSAgICA9IDFcbiAgICAgICwgcmVwbGFjZXIsICRyZXBsYWNlcjtcbiAgICB3aGlsZShhcmd1bWVudHMubGVuZ3RoID4gaSlhcmdzLnB1c2goYXJndW1lbnRzW2krK10pO1xuICAgIHJlcGxhY2VyID0gYXJnc1sxXTtcbiAgICBpZih0eXBlb2YgcmVwbGFjZXIgPT0gJ2Z1bmN0aW9uJykkcmVwbGFjZXIgPSByZXBsYWNlcjtcbiAgICBpZigkcmVwbGFjZXIgfHwgIWlzQXJyYXkocmVwbGFjZXIpKXJlcGxhY2VyID0gZnVuY3Rpb24oa2V5LCB2YWx1ZSl7XG4gICAgICBpZigkcmVwbGFjZXIpdmFsdWUgPSAkcmVwbGFjZXIuY2FsbCh0aGlzLCBrZXksIHZhbHVlKTtcbiAgICAgIGlmKCFpc1N5bWJvbCh2YWx1ZSkpcmV0dXJuIHZhbHVlO1xuICAgIH07XG4gICAgYXJnc1sxXSA9IHJlcGxhY2VyO1xuICAgIHJldHVybiBfc3RyaW5naWZ5LmFwcGx5KCRKU09OLCBhcmdzKTtcbiAgfVxufSk7XG5cbi8vIDE5LjQuMy40IFN5bWJvbC5wcm90b3R5cGVbQEB0b1ByaW1pdGl2ZV0oaGludClcbiRTeW1ib2xbUFJPVE9UWVBFXVtUT19QUklNSVRJVkVdIHx8IHJlcXVpcmUoJy4vX2hpZGUnKSgkU3ltYm9sW1BST1RPVFlQRV0sIFRPX1BSSU1JVElWRSwgJFN5bWJvbFtQUk9UT1RZUEVdLnZhbHVlT2YpO1xuLy8gMTkuNC4zLjUgU3ltYm9sLnByb3RvdHlwZVtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoJFN5bWJvbCwgJ1N5bWJvbCcpO1xuLy8gMjAuMi4xLjkgTWF0aFtAQHRvU3RyaW5nVGFnXVxuc2V0VG9TdHJpbmdUYWcoTWF0aCwgJ01hdGgnLCB0cnVlKTtcbi8vIDI0LjMuMyBKU09OW0BAdG9TdHJpbmdUYWddXG5zZXRUb1N0cmluZ1RhZyhnbG9iYWwuSlNPTiwgJ0pTT04nLCB0cnVlKTsiLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ2FzeW5jSXRlcmF0b3InKTsiLCJyZXF1aXJlKCcuL193a3MtZGVmaW5lJykoJ29ic2VydmFibGUnKTsiLCJyZXF1aXJlKCcuL2VzNi5hcnJheS5pdGVyYXRvcicpO1xudmFyIGdsb2JhbCAgICAgICAgPSByZXF1aXJlKCcuL19nbG9iYWwnKVxuICAsIGhpZGUgICAgICAgICAgPSByZXF1aXJlKCcuL19oaWRlJylcbiAgLCBJdGVyYXRvcnMgICAgID0gcmVxdWlyZSgnLi9faXRlcmF0b3JzJylcbiAgLCBUT19TVFJJTkdfVEFHID0gcmVxdWlyZSgnLi9fd2tzJykoJ3RvU3RyaW5nVGFnJyk7XG5cbmZvcih2YXIgY29sbGVjdGlvbnMgPSBbJ05vZGVMaXN0JywgJ0RPTVRva2VuTGlzdCcsICdNZWRpYUxpc3QnLCAnU3R5bGVTaGVldExpc3QnLCAnQ1NTUnVsZUxpc3QnXSwgaSA9IDA7IGkgPCA1OyBpKyspe1xuICB2YXIgTkFNRSAgICAgICA9IGNvbGxlY3Rpb25zW2ldXG4gICAgLCBDb2xsZWN0aW9uID0gZ2xvYmFsW05BTUVdXG4gICAgLCBwcm90byAgICAgID0gQ29sbGVjdGlvbiAmJiBDb2xsZWN0aW9uLnByb3RvdHlwZTtcbiAgaWYocHJvdG8gJiYgIXByb3RvW1RPX1NUUklOR19UQUddKWhpZGUocHJvdG8sIFRPX1NUUklOR19UQUcsIE5BTUUpO1xuICBJdGVyYXRvcnNbTkFNRV0gPSBJdGVyYXRvcnMuQXJyYXk7XG59IiwiY29uc3QgbWluID0gTWF0aC5taW47XG5jb25zdCBtYXggPSBNYXRoLm1heDtcblxuZnVuY3Rpb24gY2xpcCh2YWx1ZSwgbG93ZXIgPSAtSW5maW5pdHksIHVwcGVyID0gK0luZmluaXR5KSB7XG4gIHJldHVybiBtYXgobG93ZXIsIG1pbih1cHBlciwgdmFsdWUpKVxufVxuXG4vKipcbiAqIERpY3Rpb25uYXJ5IG9mIHRoZSBhdmFpbGFibGUgdHlwZXMuIEVhY2gga2V5IGNvcnJlc3BvbmQgdG8gdGhlIHR5cGUgb2YgdGhlXG4gKiBpbXBsZW1lbnRlZCBwYXJhbSB3aGlsZSB0aGUgY29ycmVzcG9uZGluZyBvYmplY3QgdmFsdWUgc2hvdWxkIHRoZVxuICoge0BsaW5rIGBwYXJhbURlZmluaXRpb25gfSBvZiB0aGUgZGVmaW5lZCB0eXBlLlxuICpcbiAqIHR5cGVkZWYge09iamVjdH0gcGFyYW1UZW1wbGF0ZXNcbiAqIEB0eXBlIHtPYmplY3Q8U3RyaW5nLCBwYXJhbVRlbXBsYXRlPn1cbiAqL1xuXG4vKipcbiAqIERlZmluaXRpb24gb2YgYSBwYXJhbWV0ZXIuIFRoZSBkZWZpbml0aW9uIHNob3VsZCBhdCBsZWFzdCBjb250YWluIHRoZSBlbnRyaWVzXG4gKiBgdHlwZWAgYW5kIGBkZWZhdWx0YC4gRXZlcnkgcGFyYW1ldGVyIGNhbiBhbHNvIGFjY2VwdCBvcHRpb25uYWwgY29uZmlndXJhdGlvblxuICogZW50cmllcyBgY29uc3RhbnRgIGFuZCBgbWV0YXNgLlxuICogQXZhaWxhYmxlIGRlZmluaXRpb25zIGFyZTpcbiAqIC0ge0BsaW5rIGJvb2xlYW5EZWZpbml0aW9ufVxuICogLSB7QGxpbmsgaW50ZWdlckRlZmluaXRpb259XG4gKiAtIHtAbGluayBmbG9hdERlZmluaXRpb259XG4gKiAtIHtAbGluayBzdHJpbmdEZWZpbml0aW9ufVxuICogLSB7QGxpbmsgZW51bURlZmluaXRpb259XG4gKlxuICogdHlwZWRlZiB7T2JqZWN0fSBwYXJhbURlZmluaXRpb25cbiAqIEBwcm9wZXJ0eSB7U3RyaW5nfSB0eXBlIC0gVHlwZSBvZiB0aGUgcGFyYW1ldGVyLlxuICogQHByb3BlcnR5IHtNaXhlZH0gZGVmYXVsdCAtIERlZmF1bHQgdmFsdWUgb2YgdGhlIHBhcmFtZXRlciBpZiBub1xuICogIGluaXRpYWxpemF0aW9uIHZhbHVlIGlzIHByb3ZpZGVkLlxuICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgY2FuIGJlIGNoYW5nZVxuICogIGFmdGVyIGl0cyBpbml0aWFsaXphdGlvbi5cbiAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9bnVsbF0gLSBBbnkgdXNlciBkZWZpbmVkIGRhdGEgYXNzb2NpYXRlZCB0byB0aGVcbiAqICBwYXJhbWV0ZXIgdGhhdCBjb3VscyBiZSB1c2VmdWxsIGluIHRoZSBhcHBsaWNhdGlvbi5cbiAqL1xuXG5leHBvcnQgZGVmYXVsdCB7XG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBib29sZWFuRGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J2Jvb2xlYW4nXSAtIERlZmluZSBhIGJvb2xlYW4gcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGRlZmF1bHQgLSBEZWZhdWx0IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGlzIGNvbnN0YW50LlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPXt9XSAtIE9wdGlvbm5hbCBtZXRhZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgYm9vbGVhbjoge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdib29sZWFuJylcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciBib29sZWFuIHBhcmFtIFwiJHtuYW1lfVwiOiAke3ZhbHVlfWApO1xuXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBpbnRlZ2VyRGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J2ludGVnZXInXSAtIERlZmluZSBhIGJvb2xlYW4gcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGRlZmF1bHQgLSBEZWZhdWx0IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW21pbj0tSW5maW5pdHldIC0gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFttYXg9K0luZmluaXR5XSAtIE1heGltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgaXMgY29uc3RhbnQuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9e31dIC0gT3B0aW9ubmFsIG1ldGFkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBpbnRlZ2VyOiB7XG4gICAgZGVmaW5pdGlvblRlbXBsYXRlOiBbJ2RlZmF1bHQnXSxcbiAgICB0eXBlQ2hlY2tGdW5jdGlvbih2YWx1ZSwgZGVmaW5pdGlvbiwgbmFtZSkge1xuICAgICAgaWYgKCEodHlwZW9mIHZhbHVlID09PSAnbnVtYmVyJyAmJiBNYXRoLmZsb29yKHZhbHVlKSA9PT0gdmFsdWUpKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yIGludGVnZXIgcGFyYW0gXCIke25hbWV9XCI6ICR7dmFsdWV9YCk7XG5cbiAgICAgIHJldHVybiBjbGlwKHZhbHVlLCBkZWZpbml0aW9uLm1pbiwgZGVmaW5pdGlvbi5tYXgpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gZmxvYXREZWZpbml0aW9uXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZT0nZmxvYXQnXSAtIERlZmluZSBhIGJvb2xlYW4gcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IGRlZmF1bHQgLSBEZWZhdWx0IHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW21pbj0tSW5maW5pdHldIC0gTWluaW11bSB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFttYXg9K0luZmluaXR5XSAtIE1heGltdW0gdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBbY29uc3RhbnQ9ZmFsc2VdIC0gRGVmaW5lIGlmIHRoZSBwYXJhbWV0ZXIgaXMgY29uc3RhbnQuXG4gICAqIEBwcm9wZXJ0eSB7T2JqZWN0fSBbbWV0YXM9e31dIC0gT3B0aW9ubmFsIG1ldGFkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBmbG9hdDoge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdudW1iZXInIHx8wqB2YWx1ZSAhPT0gdmFsdWUpIC8vIHJlamVjdCBOYU5cbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIHZhbHVlIGZvciBmbG9hdCBwYXJhbSBcIiR7bmFtZX1cIjogJHt2YWx1ZX1gKTtcblxuICAgICAgcmV0dXJuIGNsaXAodmFsdWUsIGRlZmluaXRpb24ubWluLCBkZWZpbml0aW9uLm1heCk7XG4gICAgfVxuICB9LFxuXG4gIC8qKlxuICAgKiBAdHlwZWRlZiB7T2JqZWN0fSBzdHJpbmdEZWZpbml0aW9uXG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBbdHlwZT0nc3RyaW5nJ10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFtjb25zdGFudD1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHBhcmFtZXRlciBpcyBjb25zdGFudC5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IFttZXRhcz17fV0gLSBPcHRpb25uYWwgbWV0YWRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHN0cmluZzoge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIGlmICh0eXBlb2YgdmFsdWUgIT09ICdzdHJpbmcnKVxuICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgdmFsdWUgZm9yIHN0cmluZyBwYXJhbSBcIiR7bmFtZX1cIjogJHt2YWx1ZX1gKTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gZW51bURlZmluaXRpb25cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IFt0eXBlPSdlbnVtJ10gLSBEZWZpbmUgYSBib29sZWFuIHBhcmFtZXRlci5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0FycmF5fSBsaXN0IC0gUG9zc2libGUgdmFsdWVzIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gW2NvbnN0YW50PWZhbHNlXSAtIERlZmluZSBpZiB0aGUgcGFyYW1ldGVyIGlzIGNvbnN0YW50LlxuICAgKiBAcHJvcGVydHkge09iamVjdH0gW21ldGFzPXt9XSAtIE9wdGlvbm5hbCBtZXRhZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cbiAgZW51bToge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0JywgJ2xpc3QnXSxcbiAgICB0eXBlQ2hlY2tGdW5jdGlvbih2YWx1ZSwgZGVmaW5pdGlvbiwgbmFtZSkge1xuICAgICAgaWYgKGRlZmluaXRpb24ubGlzdC5pbmRleE9mKHZhbHVlKSA9PT0gLTEpXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihgSW52YWxpZCB2YWx1ZSBmb3IgZW51bSBwYXJhbSBcIiR7bmFtZX1cIjogJHt2YWx1ZX1gKTtcblxuICAgICAgcmV0dXJuIHZhbHVlO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQHR5cGVkZWYge09iamVjdH0gYW55RGVmaW5pdGlvblxuICAgKiBAcHJvcGVydHkge1N0cmluZ30gW3R5cGU9J2VudW0nXSAtIERlZmluZSBhIHBhcmFtZXRlciBvZiBhbnkgdHlwZS5cbiAgICogQHByb3BlcnR5IHtCb29sZWFufSBkZWZhdWx0IC0gRGVmYXVsdCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcHJvcGVydHkge0Jvb2xlYW59IFtjb25zdGFudD1mYWxzZV0gLSBEZWZpbmUgaWYgdGhlIHBhcmFtZXRlciBpcyBjb25zdGFudC5cbiAgICogQHByb3BlcnR5IHtPYmplY3R9IFttZXRhcz17fV0gLSBPcHRpb25uYWwgbWV0YWRhdGEgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGFueToge1xuICAgIGRlZmluaXRpb25UZW1wbGF0ZTogWydkZWZhdWx0J10sXG4gICAgdHlwZUNoZWNrRnVuY3Rpb24odmFsdWUsIGRlZmluaXRpb24sIG5hbWUpIHtcbiAgICAgIC8vIG5vIGNoZWNrIGFzIGl0IGNhbiBoYXZlIGFueSB0eXBlLi4uXG4gICAgICByZXR1cm4gdmFsdWU7XG4gICAgfVxuICB9XG59XG4iLCJpbXBvcnQgcGFyYW1UZW1wbGF0ZXMgZnJvbSAnLi9wYXJhbVRlbXBsYXRlcyc7XG5cbi8qKlxuICogR2VuZXJpYyBjbGFzcyBmb3IgdHlwZWQgcGFyYW1ldGVycy5cbiAqXG4gKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAqIEBwYXJhbSB7QXJyYXl9IGRlZmluaXRpb25UZW1wbGF0ZSAtIExpc3Qgb2YgbWFuZGF0b3J5IGtleXMgaW4gdGhlIHBhcmFtXG4gKiAgZGVmaW5pdGlvbi5cbiAqIEBwYXJhbSB7RnVuY3Rpb259IHR5cGVDaGVja0Z1bmN0aW9uIC0gRnVuY3Rpb24gdG8gYmUgdXNlZCBpbiBvcmRlciB0byBjaGVja1xuICogIHRoZSB2YWx1ZSBhZ2FpbnN0IHRoZSBwYXJhbSBkZWZpbml0aW9uLlxuICogQHBhcmFtIHtPYmplY3R9IGRlZmluaXRpb24gLSBEZWZpbml0aW9uIG9mIHRoZSBwYXJhbWV0ZXIuXG4gKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIFZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gKiBAcHJpdmF0ZVxuICovXG5jbGFzcyBQYXJhbSB7XG4gIGNvbnN0cnVjdG9yKG5hbWUsIGRlZmluaXRpb25UZW1wbGF0ZSwgdHlwZUNoZWNrRnVuY3Rpb24sIGRlZmluaXRpb24sIHZhbHVlKSB7XG4gICAgZGVmaW5pdGlvblRlbXBsYXRlLmZvckVhY2goZnVuY3Rpb24oa2V5KSB7XG4gICAgICBpZiAoZGVmaW5pdGlvbi5oYXNPd25Qcm9wZXJ0eShrZXkpID09PSBmYWxzZSlcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGRlZmluaXRpb24gZm9yIHBhcmFtIFwiJHtuYW1lfVwiLCAke2tleX0gaXMgbm90IGRlZmluZWRgKTtcbiAgICB9KTtcblxuICAgIHRoaXMubmFtZSA9IG5hbWU7XG4gICAgdGhpcy50eXBlID0gZGVmaW5pdGlvbi50eXBlO1xuICAgIHRoaXMuZGVmaW5pdGlvbiA9IGRlZmluaXRpb247XG5cbiAgICBpZiAodGhpcy5kZWZpbml0aW9uLm51bGxhYmxlID09PSB0cnVlICYmIHZhbHVlID09PSBudWxsKVxuICAgICAgdGhpcy52YWx1ZSA9IG51bGw7XG4gICAgZWxzZVxuICAgICAgdGhpcy52YWx1ZSA9IHR5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCBkZWZpbml0aW9uLCBuYW1lKTtcbiAgICB0aGlzLl90eXBlQ2hlY2tGdW5jdGlvbiA9IHR5cGVDaGVja0Z1bmN0aW9uO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybnMgdGhlIGN1cnJlbnQgdmFsdWUuXG4gICAqIEByZXR1cm4ge01peGVkfVxuICAgKi9cbiAgZ2V0VmFsdWUoKSB7XG4gICAgcmV0dXJuIHRoaXMudmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogVXBkYXRlIHRoZSBjdXJyZW50IHZhbHVlLlxuICAgKiBAcGFyYW0ge01peGVkfSB2YWx1ZSAtIE5ldyB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJuIHtCb29sZWFufSAtIGB0cnVlYCBpZiB0aGUgcGFyYW0gaGFzIGJlZW4gdXBkYXRlZCwgZmFsc2Ugb3RoZXJ3aXNlXG4gICAqICAoZS5nLiBpZiB0aGUgcGFyYW1ldGVyIGFscmVhZHkgaGFkIHRoaXMgdmFsdWUpLlxuICAgKi9cbiAgc2V0VmFsdWUodmFsdWUpIHtcbiAgICBpZiAodGhpcy5kZWZpbml0aW9uLmNvbnN0YW50ID09PSB0cnVlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBJbnZhbGlkIGFzc2lnbmVtZW50IHRvIGNvbnN0YW50IHBhcmFtIFwiJHt0aGlzLm5hbWV9XCJgKTtcblxuICAgIGlmICghKHRoaXMuZGVmaW5pdGlvbi5udWxsYWJsZSA9PT0gdHJ1ZSAmJiB2YWx1ZSA9PT0gbnVsbCkpXG4gICAgICB2YWx1ZSA9IHRoaXMuX3R5cGVDaGVja0Z1bmN0aW9uKHZhbHVlLCB0aGlzLmRlZmluaXRpb24sIHRoaXMubmFtZSk7XG5cbiAgICBpZiAodGhpcy52YWx1ZSAhPT0gdmFsdWUpIHtcbiAgICAgIHRoaXMudmFsdWUgPSB2YWx1ZTtcbiAgICAgIHJldHVybiB0cnVlO1xuICAgIH1cblxuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG5cbi8qKlxuICogQmFnIG9mIHBhcmFtZXRlcnMuIE1haW4gaW50ZXJmYWNlIG9mIHRoZSBsaWJyYXJ5XG4gKi9cbmNsYXNzIFBhcmFtZXRlckJhZyB7XG4gIGNvbnN0cnVjdG9yKHBhcmFtcywgZGVmaW5pdGlvbnMpIHtcbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIHBhcmFtZXRlcnMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgUGFyYW0+fVxuICAgICAqIEBuYW1lIF9wYXJhbXNcbiAgICAgKiBAbWVtYmVyb2YgUGFyYW1ldGVyQmFnXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9wYXJhbXMgPSBwYXJhbXM7XG5cbiAgICAvKipcbiAgICAgKiBMaXN0IG9mIGRlZmluaXRpb25zIHdpdGggaW5pdCB2YWx1ZXMuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7T2JqZWN0PFN0cmluZywgcGFyYW1EZWZpbml0aW9uPn1cbiAgICAgKiBAbmFtZSBfZGVmaW5pdGlvbnNcbiAgICAgKiBAbWVtYmVyb2YgUGFyYW1ldGVyQmFnXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9kZWZpbml0aW9ucyA9IGRlZmluaXRpb25zO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBnbG9iYWwgbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHR5cGUge1NldH1cbiAgICAgKiBAbmFtZSBfZ2xvYmFsTGlzdGVuZXJzXG4gICAgICogQG1lbWJlcm9mIFBhcmFtZXRlckJhZ1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBwcml2YXRlXG4gICAgICovXG4gICAgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzID0gbmV3IFNldCgpO1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBwYXJhbXMgbGlzdGVuZXJzLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdDxTdHJpbmcsIFNldD59XG4gICAgICogQG5hbWUgX3BhcmFtc0xpc3RlbmVyc1xuICAgICAqIEBtZW1iZXJvZiBQYXJhbWV0ZXJCYWdcbiAgICAgKiBAaW5zdGFuY2VcbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX3BhcmFtc0xpc3RlbmVycyA9IHt9O1xuXG4gICAgLy8gaW5pdGlhbGl6ZSBlbXB0eSBTZXQgZm9yIGVhY2ggcGFyYW1cbiAgICBmb3IgKGxldCBuYW1lIGluIHBhcmFtcylcbiAgICAgIHRoaXMuX3BhcmFtc0xpc3RlbmVyc1tuYW1lXSA9IG5ldyBTZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGdpdmVuIGRlZmluaXRpb25zIGFsb25nIHdpdGggdGhlIGluaXRpYWxpemF0aW9uIHZhbHVlcy5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0RGVmaW5pdGlvbnMobmFtZSA9IG51bGwpIHtcbiAgICBpZiAobmFtZSAhPT0gbnVsbClcbiAgICAgIHJldHVybiB0aGlzLl9kZWZpbml0aW9uc1tuYW1lXTtcbiAgICBlbHNlXG4gICAgICByZXR1cm4gdGhpcy5fZGVmaW5pdGlvbnM7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSB2YWx1ZSBvZiB0aGUgZ2l2ZW4gcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHJldHVybiB7TWl4ZWR9IC0gVmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIGdldChuYW1lKSB7XG4gICAgaWYgKCF0aGlzLl9wYXJhbXNbbmFtZV0pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYENhbm5vdCByZWFkIHByb3BlcnR5IHZhbHVlIG9mIHVuZGVmaW5lZCBwYXJhbWV0ZXIgXCIke25hbWV9XCJgKTtcblxuICAgIHJldHVybiB0aGlzLl9wYXJhbXNbbmFtZV0udmFsdWU7XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSB2YWx1ZSBvZiBhIHBhcmFtZXRlci4gSWYgdGhlIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgaXMgdXBkYXRlZFxuICAgKiAoYWthIGlmIHByZXZpb3VzIHZhbHVlIGlzIGRpZmZlcmVudCBmcm9tIG5ldyB2YWx1ZSkgYWxsIHJlZ2lzdGVyZWRcbiAgICogY2FsbGJhY2tzIGFyZSByZWdpc3RlcmVkLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBWYWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcmV0dXJuIHtNaXhlZH0gLSBOZXcgdmFsdWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICovXG4gIHNldChuYW1lLCB2YWx1ZSkge1xuICAgIGNvbnN0IHBhcmFtID0gdGhpcy5fcGFyYW1zW25hbWVdO1xuICAgIGNvbnN0IHVwZGF0ZWQgPSBwYXJhbS5zZXRWYWx1ZSh2YWx1ZSk7XG4gICAgdmFsdWUgPSBwYXJhbS5nZXRWYWx1ZSgpO1xuXG4gICAgaWYgKHVwZGF0ZWQpIHtcbiAgICAgIGNvbnN0IG1ldGFzID0gcGFyYW0uZGVmaW5pdGlvbi5tZXRhcztcbiAgICAgIC8vIHRyaWdnZXIgZ2xvYmFsIGxpc3RlbmVyc1xuICAgICAgZm9yIChsZXQgbGlzdGVuZXIgb2YgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzKVxuICAgICAgICBsaXN0ZW5lcihuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgICAvLyB0cmlnZ2VyIHBhcmFtIGxpc3RlbmVyc1xuICAgICAgZm9yIChsZXQgbGlzdGVuZXIgb2YgdGhpcy5fcGFyYW1zTGlzdGVuZXJzW25hbWVdKVxuICAgICAgICBsaXN0ZW5lcih2YWx1ZSwgbWV0YXMpO1xuICAgIH1cblxuICAgIHJldHVybiB2YWx1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgaWYgdGhlIGBuYW1lYCBwYXJhbWV0ZXIgZXhpc3RzIG9yIG5vdC5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBOYW1lIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEByZXR1cm4ge0Jvb2xlYW59XG4gICAqL1xuICBoYXMobmFtZSkge1xuICAgIHJldHVybiAodGhpcy5fcGFyYW1zW25hbWVdKSA/IHRydWUgOiBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCBhIHBhcmFtZXRlciB0byBpdHMgaW5pdCB2YWx1ZS4gUmVzZXQgYWxsIHBhcmFtZXRlcnMgaWYgbm8gYXJndW1lbnQuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBbbmFtZT1udWxsXSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlciB0byByZXNldC5cbiAgICovXG4gIHJlc2V0KG5hbWUgPSBudWxsKSB7XG4gICAgaWYgKG5hbWUgIT09IG51bGwpXG4gICAgICB0aGlzLnNldChuYW1lLCBwYXJhbS5kZWZpbml0aW9uLmluaXRWYWx1ZSk7XG4gICAgZWxzZVxuICAgICAgT2JqZWN0LmtleXModGhpcy5fcGFyYW1zKS5mb3JFYWNoKChuYW1lKSA9PiB0aGlzLnJlc2V0KG5hbWUpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgUGFyYW1ldGVyQmFnfmxpc3RlbmVyQ2FsbGJhY2tcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBQYXJhbWV0ZXIgbmFtZS5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBVcGRhdGVkIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbbWV0YT1dIC0gR2l2ZW4gbWV0YSBkYXRhIG9mIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBBZGQgbGlzdGVuZXIgdG8gYWxsIHBhcmFtIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7UGFyYW1ldGVyQmFnfmxpc3RlbmVyQ2FsbGFja30gY2FsbGJhY2sgLSBMaXN0ZW5lciB0byByZWdpc3Rlci5cbiAgICovXG4gIGFkZExpc3RlbmVyKGNhbGxiYWNrKSB7XG4gICAgdGhpcy5fZ2xvYmFsTGlzdGVuZXJzLmFkZChjYWxsYmFjayk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIGxpc3RlbmVyIGZyb20gYWxsIHBhcmFtIGNoYW5nZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7UGFyYW1ldGVyQmFnfmxpc3RlbmVyQ2FsbGFja30gY2FsbGJhY2sgLSBMaXN0ZW5lciB0byByZW1vdmUuIElmXG4gICAqICBgbnVsbGAgcmVtb3ZlIGFsbCBsaXN0ZW5lcnMuXG4gICAqL1xuICByZW1vdmVMaXN0ZW5lcihjYWxsYmFjayA9IG51bGwpIHtcbiAgICBpZiAoY2FsbGJhY2sgPT09IG51bGwpXG4gICAgICB0aGlzLl9nbG9iYWxMaXN0ZW5lcnMuY2xlYXIoKTtcbiAgICBlbHNlXG4gICAgICB0aGlzLl9nbG9iYWxMaXN0ZW5lcnMuZGVsZXRlKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBAY2FsbGJhY2sgUGFyYW1ldGVyQmFnfnBhcmFtTGlzdGVuZXJDYWxsYWNrXG4gICAqIEBwYXJhbSB7TWl4ZWR9IHZhbHVlIC0gVXBkYXRlZCB2YWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gW21ldGE9XSAtIEdpdmVuIG1ldGEgZGF0YSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKi9cblxuICAvKipcbiAgICogQWRkIGxpc3RlbmVyIHRvIGEgZ2l2ZW4gcGFyYW0gdXBkYXRlcy5cbiAgICpcbiAgICogQHBhcmFtIHtTdHJpbmd9IG5hbWUgLSBQYXJhbWV0ZXIgbmFtZS5cbiAgICogQHBhcmFtIHtQYXJhbWV0ZXJCYWd+cGFyYW1MaXN0ZW5lckNhbGxhY2t9IGNhbGxiYWNrIC0gRnVuY3Rpb24gdG8gYXBwbHlcbiAgICogIHdoZW4gdGhlIHZhbHVlIG9mIHRoZSBwYXJhbWV0ZXIgY2hhbmdlcy5cbiAgICovXG4gIGFkZFBhcmFtTGlzdGVuZXIobmFtZSwgY2FsbGJhY2spIHtcbiAgICB0aGlzLl9wYXJhbXNMaXN0ZW5lcnNbbmFtZV0uYWRkKGNhbGxiYWNrKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZW1vdmUgbGlzdGVuZXIgZnJvbSBhIGdpdmVuIHBhcmFtIHVwZGF0ZXMuXG4gICAqXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBuYW1lIC0gUGFyYW1ldGVyIG5hbWUuXG4gICAqIEBwYXJhbSB7UGFyYW1ldGVyQmFnfnBhcmFtTGlzdGVuZXJDYWxsYWNrfSBjYWxsYmFjayAtIExpc3RlbmVyIHRvIHJlbW92ZS5cbiAgICogIElmIGBudWxsYCByZW1vdmUgYWxsIGxpc3RlbmVycy5cbiAgICovXG4gIHJlbW92ZVBhcmFtTGlzdGVuZXIobmFtZSwgY2FsbGJhY2sgPSBudWxsKSB7XG4gICAgaWYgKGNhbGxiYWNrID09PSBudWxsKVxuICAgICAgdGhpcy5fcGFyYW1zTGlzdGVuZXJzW25hbWVdLmNsZWFyKCk7XG4gICAgZWxzZVxuICAgICAgdGhpcy5fcGFyYW1zTGlzdGVuZXJzW25hbWVdLmRlbGV0ZShjYWxsYmFjayk7XG4gIH1cbn1cblxuLyoqXG4gKiBGYWN0b3J5IGZvciB0aGUgYFBhcmFtZXRlckJhZ2AgY2xhc3MuXG4gKlxuICogQHBhcmFtIHtPYmplY3Q8U3RyaW5nLCBwYXJhbURlZmluaXRpb24+fSBkZWZpbml0aW9ucyAtIE9iamVjdCBkZXNjcmliaW5nIHRoZVxuICogIHBhcmFtZXRlcnMuXG4gKiBAcGFyYW0ge09iamVjdDxTdHJpbmcsIE1peGVkPn0gdmFsdWVzIC0gSW5pdGlhbGl6YXRpb24gdmFsdWVzIGZvciB0aGVcbiAqICBwYXJhbWV0ZXJzLlxuICogQHJldHVybiB7UGFyYW1ldGVyQmFnfVxuICovXG5mdW5jdGlvbiBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCB2YWx1ZXMgPSB7fSkge1xuICBjb25zdCBwYXJhbXMgPSB7fTtcblxuICBmb3IgKGxldCBuYW1lIGluIHZhbHVlcykge1xuICAgIGlmIChkZWZpbml0aW9ucy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA9PT0gZmFsc2UpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcGFyYW0gXCIke25hbWV9XCJgKTtcbiAgfVxuXG4gIGZvciAobGV0IG5hbWUgaW4gZGVmaW5pdGlvbnMpIHtcbiAgICBpZiAocGFyYW1zLmhhc093blByb3BlcnR5KG5hbWUpID09PSB0cnVlKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKGBQYXJhbWV0ZXIgXCIke25hbWV9XCIgYWxyZWFkeSBkZWZpbmVkYCk7XG5cbiAgICBjb25zdCBkZWZpbml0aW9uID0gZGVmaW5pdGlvbnNbbmFtZV07XG5cbiAgICBpZiAoIXBhcmFtVGVtcGxhdGVzW2RlZmluaXRpb24udHlwZV0pXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYFVua25vd24gcGFyYW0gdHlwZSBcIiR7ZGVmaW5pdGlvbi50eXBlfVwiYCk7XG5cbiAgICBjb25zdCB7XG4gICAgICBkZWZpbml0aW9uVGVtcGxhdGUsXG4gICAgICB0eXBlQ2hlY2tGdW5jdGlvblxuICAgIH0gPSBwYXJhbVRlbXBsYXRlc1tkZWZpbml0aW9uLnR5cGVdO1xuXG4gICAgbGV0IHZhbHVlO1xuXG4gICAgaWYgKHZhbHVlcy5oYXNPd25Qcm9wZXJ0eShuYW1lKSA9PT0gdHJ1ZSlcbiAgICAgIHZhbHVlID0gdmFsdWVzW25hbWVdO1xuICAgIGVsc2VcbiAgICAgIHZhbHVlID0gZGVmaW5pdGlvbi5kZWZhdWx0O1xuXG4gICAgLy8gc3RvcmUgaW5pdCB2YWx1ZSBpbiBkZWZpbml0aW9uXG4gICAgZGVmaW5pdGlvbi5pbml0VmFsdWUgPSB2YWx1ZTtcblxuICAgIGlmICghdHlwZUNoZWNrRnVuY3Rpb24gfHzCoCFkZWZpbml0aW9uVGVtcGxhdGUpXG4gICAgICB0aHJvdyBuZXcgRXJyb3IoYEludmFsaWQgcGFyYW0gdHlwZSBkZWZpbml0aW9uIFwiJHtkZWZpbml0aW9uLnR5cGV9XCJgKTtcblxuICAgIHBhcmFtc1tuYW1lXSA9IG5ldyBQYXJhbShuYW1lLCBkZWZpbml0aW9uVGVtcGxhdGUsIHR5cGVDaGVja0Z1bmN0aW9uLCBkZWZpbml0aW9uLCB2YWx1ZSk7XG4gIH1cblxuICByZXR1cm4gbmV3IFBhcmFtZXRlckJhZyhwYXJhbXMsIGRlZmluaXRpb25zKTtcbn1cblxuLyoqXG4gKiBSZWdpc3RlciBhIG5ldyB0eXBlIGZvciB0aGUgYHBhcmFtZXRlcnNgIGZhY3RvcnkuXG4gKiBAcGFyYW0ge1N0cmluZ30gdHlwZU5hbWUgLSBWYWx1ZSB0aGF0IHdpbGwgYmUgYXZhaWxhYmxlIGFzIHRoZSBgdHlwZWAgb2YgYVxuICogIHBhcmFtIGRlZmluaXRpb24uXG4gKiBAcGFyYW0ge3BhcmFtZXRlckRlZmluaXRpb259IHBhcmFtZXRlckRlZmluaXRpb24gLSBPYmplY3QgZGVzY3JpYmluZyB0aGVcbiAqICBwYXJhbWV0ZXIuXG4gKi9cbnBhcmFtZXRlcnMuZGVmaW5lVHlwZSA9IGZ1bmN0aW9uKHR5cGVOYW1lLCBwYXJhbWV0ZXJEZWZpbml0aW9uKSB7XG4gIHBhcmFtVGVtcGxhdGVzW3R5cGVOYW1lXSA9IHBhcmFtZXRlckRlZmluaXRpb247XG59XG5cbmV4cG9ydCBkZWZhdWx0IHBhcmFtZXRlcnM7XG4iLCJpbXBvcnQgcGFyYW1ldGVycyBmcm9tICdwYXJhbWV0ZXJzJztcblxubGV0IGlkID0gMDtcblxuLyoqXG4gKiBCYXNlIGBsZm9gIGNsYXNzIHRvIGJlIGV4dGVuZGVkIGluIG9yZGVyIHRvIGNyZWF0ZSBuZXcgbm9kZXMuXG4gKlxuICogTm9kZXMgYXJlIGRpdmlkZWQgaW4gMyBjYXRlZ29yaWVzOlxuICogLSAqKmBzb3VyY2VgKiogYXJlIHJlc3BvbnNpYmxlIGZvciBhY3F1ZXJpbmcgYSBzaWduYWwgYW5kIGl0cyBwcm9wZXJ0aWVzXG4gKiAgIChmcmFtZVJhdGUsIGZyYW1lU2l6ZSwgZXRjLilcbiAqIC0gKipgc2lua2AqKiBhcmUgZW5kcG9pbnRzIG9mIHRoZSBncmFwaCwgc3VjaCBub2RlcyBjYW4gYmUgcmVjb3JkZXJzLFxuICogICB2aXN1YWxpemVycywgZXRjLlxuICogLSAqKmBvcGVyYXRvcmAqKiBhcmUgdXNlZCB0byBtYWtlIGNvbXB1dGF0aW9uIG9uIHRoZSBpbnB1dCBzaWduYWwgYW5kXG4gKiAgIGZvcndhcmQgdGhlIHJlc3VsdHMgYmVsb3cgaW4gdGhlIGdyYXBoLlxuICpcbiAqIEluIG1vc3QgY2FzZXMgdGhlIG1ldGhvZHMgdG8gb3ZlcnJpZGUgLyBleHRlbmQgYXJlOlxuICogLSB0aGUgKipgY29uc3RydWN0b3JgKiogdG8gZGVmaW5lIHRoZSBwYXJhbWV0ZXJzIG9mIHRoZSBuZXcgbGZvIG5vZGUuXG4gKiAtIHRoZSAqKmBwcm9jZXNzU3RyZWFtUGFyYW1zYCoqIG1ldGhvZCB0byBkZWZpbmUgaG93IHRoZSBub2RlIG1vZGlmeSB0aGVcbiAqICAgc3RyZWFtIGF0dHJpYnV0ZXMgKGUuZy4gYnkgY2hhbmdpbmcgdGhlIGZyYW1lIHNpemUpXG4gKiAtIHRoZSAqKmBwcm9jZXNze0ZyYW1lVHlwZX1gKiogbWV0aG9kIHRvIGRlZmluZSB0aGUgb3BlcmF0aW9ucyB0aGF0IHRoZVxuICogICBub2RlIGFwcGx5IG9uIHRoZSBzdHJlYW0uIFRoZSB0eXBlIG9mIGlucHV0IGEgbm9kZSBjYW4gaGFuZGxlIGlzIGRlZmluZVxuICogICBieSBpdHMgaW1wbGVtZW50ZWQgaW50ZXJmYWNlLCBpZiBpdCBpbXBsZW1lbnRzIGBwcm9jZXNzU2lnbmFsYCBhIHN0cmVhbVxuICogICB3aXRoIGBmcmFtZVR5cGUgPT09ICdzaWduYWwnYCBjYW4gYmUgcHJvY2Vzc2VkLCBgcHJvY2Vzc1ZlY3RvcmAgdG8gaGFuZGxlXG4gKiAgIGFuIGlucHV0IG9mIHR5cGUgYHZlY3RvcmAuXG4gKlxuICogPHNwYW4gY2xhc3M9XCJ3YXJuaW5nXCI+X1RoaXMgY2xhc3Mgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYWJzdHJhY3QgYW5kIG9ubHlcbiAqIGJlIHVzZWQgdG8gYmUgZXh0ZW5kZWQuXzwvc3Bhbj5cbiAqXG4gKlxuICogLy8gb3ZlcnZpZXcgb2YgdGhlIGJlaGF2aW9yIG9mIGEgbm9kZVxuICpcbiAqICoqcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKSoqXG4gKlxuICogYGJhc2VgIGNsYXNzIChkZWZhdWx0IGltcGxlbWVudGF0aW9uKVxuICogLSBjYWxsIGBwcmVwcm9jZXNzU3RyZWFtUGFyYW1zYFxuICogLSBjYWxsIGBwcm9wYWdhdGVTdHJlYW1QYXJhbXNgXG4gKlxuICogYGNoaWxkYCBjbGFzc1xuICogLSBjYWxsIGBwcmVwcm9jZXNzU3RyZWFtUGFyYW1zYFxuICogLSBvdmVycmlkZSBzb21lIG9mIHRoZSBpbmhlcml0ZWQgYHN0cmVhbVBhcmFtc2BcbiAqIC0gY3JlYXRlcyB0aGUgYW55IHJlbGF0ZWQgbG9naWMgYnVmZmVyc1xuICogLSBjYWxsIGBwcm9wYWdhdGVTdHJlYW1QYXJhbXNgXG4gKlxuICogX3Nob3VsZCBub3QgY2FsbCBgc3VwZXIucHJvY2Vzc1N0cmVhbVBhcmFtc2BfXG4gKlxuICogKipwcmVwYXJlU3RyZWFtUGFyYW1zKCkqKlxuICpcbiAqIC0gYXNzaWduIHByZXZTdHJlYW1QYXJhbXMgdG8gdGhpcy5zdHJlYW1QYXJhbXNcbiAqIC0gY2hlY2sgaWYgdGhlIGNsYXNzIGltcGxlbWVudHMgdGhlIGNvcnJlY3QgYHByb2Nlc3NJbnB1dGAgbWV0aG9kXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc1N0cmVhbVBhcmFtc2BfXG4gKlxuICogKipwcm9wYWdhdGVTdHJlYW1QYXJhbXMoKSoqXG4gKlxuICogLSBjcmVhdGVzIHRoZSBgZnJhbWVEYXRhYCBidWZmZXJcbiAqIC0gcHJvcGFnYXRlIGBzdHJlYW1QYXJhbXNgIHRvIGNoaWxkcmVuXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc1N0cmVhbVBhcmFtc2BfXG4gKlxuICogKipwcm9jZXNzRnJhbWUoKSoqXG4gKlxuICogYGJhc2VgIGNsYXNzIChkZWZhdWx0IGltcGxlbWVudGF0aW9uKVxuICogLSBjYWxsIGBwcmVwcm9jZXNzRnJhbWVgXG4gKiAtIGFzc2lnbiBmcmFtZVRpbWUgYW5kIGZyYW1lTWV0YWRhdGEgdG8gaWRlbnRpdHlcbiAqIC0gY2FsbCB0aGUgcHJvcGVyIGZ1bmN0aW9uIGFjY29yZGluZyB0byBpbnB1dFR5cGVcbiAqIC0gY2FsbCBgcHJvcGFnYXRlRnJhbWVgXG4gKlxuICogYGNoaWxkYCBjbGFzc1xuICogLSBjYWxsIGBwcmVwcm9jZXNzRnJhbWVgXG4gKiAtIGRvIHdoYXRldmVyIHlvdSB3YW50IHdpdGggaW5jb21taW5nIGZyYW1lXG4gKiAtIGNhbGwgYHByb3BhZ2F0ZUZyYW1lYFxuICpcbiAqIF9zaG91bGQgbm90IGNhbGwgYHN1cGVyLnByb2Nlc3NGcmFtZWBfXG4gKlxuICogKipwcmVwYXJlRnJhbWUoKSoqXG4gKlxuICogLSBpZiBgcmVpbml0YCBhbmQgdHJpZ2dlciBgcHJvY2Vzc1N0cmVhbVBhcmFtc2AgaWYgbmVlZGVkXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc0ZyYW1lYF9cbiAqXG4gKiAqKnByb3BhZ2F0ZUZyYW1lKCkqKlxuICpcbiAqIC0gcHJvcGFnYXRlIGZyYW1lIHRvIGNoaWxkcmVuXG4gKlxuICogX3Nob3VsZG4ndCBiZSBleHRlbmRlZCwgb25seSBjb25zdW1lZCBpbiBgcHJvY2Vzc0ZyYW1lYF9cbiAqXG4gKiBAbWVtYmVyb2YgbW9kdWxlOmNvbW1vbi5jb3JlXG4gKi9cbmNsYXNzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihkZWZpbml0aW9ucyA9IHt9LCBvcHRpb25zID0ge30pIHtcbiAgICB0aGlzLmNpZCA9IGlkKys7XG5cbiAgICAvKipcbiAgICAgKiBQYXJhbWV0ZXIgYmFnIGNvbnRhaW5pbmcgcGFyYW1ldGVyIGluc3RhbmNlcy5cbiAgICAgKlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQG5hbWUgcGFyYW1zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICovXG4gICAgdGhpcy5wYXJhbXMgPSBwYXJhbWV0ZXJzKGRlZmluaXRpb25zLCBvcHRpb25zKTtcbiAgICAvLyBsaXN0ZW4gZm9yIHBhcmFtIHVwZGF0ZXNcbiAgICB0aGlzLnBhcmFtcy5hZGRMaXN0ZW5lcih0aGlzLm9uUGFyYW1VcGRhdGUuYmluZCh0aGlzKSk7XG5cbiAgICAvKipcbiAgICAgKiBEZXNjcmlwdGlvbiBvZiB0aGUgc3RyZWFtIG91dHB1dCBvZiB0aGUgbm9kZS5cbiAgICAgKiBTZXQgdG8gYG51bGxgIHdoZW4gdGhlIG5vZGUgaXMgZGVzdHJveWVkLlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJvcGVydHkge051bWJlcn0gZnJhbWVTaXplIC0gRnJhbWUgc2l6ZSBhdCB0aGUgb3V0cHV0IG9mIHRoZSBub2RlLlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBmcmFtZVJhdGUgLSBGcmFtZSByYXRlIGF0IHRoZSBvdXRwdXQgb2YgdGhlIG5vZGUuXG4gICAgICogQHByb3BlcnR5IHtTdHJpbmd9IGZyYW1lVHlwZSAtIEZyYW1lIHR5cGUgYXQgdGhlIG91dHB1dCBvZiB0aGUgbm9kZSxcbiAgICAgKiAgcG9zc2libGUgdmFsdWVzIGFyZSBgc2lnbmFsYCwgYHZlY3RvcmAgb3IgYHNjYWxhcmAuXG4gICAgICogQHByb3BlcnR5IHtBcnJheXxTdHJpbmd9IGRlc2NyaXB0aW9uIC0gSWYgdHlwZSBpcyBgdmVjdG9yYCwgZGVzY3JpYmVcbiAgICAgKiAgdGhlIGRpbWVuc2lvbihzKSBvZiBvdXRwdXQgc3RyZWFtLlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzb3VyY2VTYW1wbGVSYXRlIC0gU2FtcGxlIHJhdGUgb2YgdGhlIHNvdXJjZSBvZiB0aGVcbiAgICAgKiAgZ3JhcGguIF9UaGUgdmFsdWUgc2hvdWxkIGJlIGRlZmluZWQgYnkgc291cmNlcyBhbmQgbmV2ZXIgbW9kaWZpZWRfLlxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBzb3VyY2VTYW1wbGVDb3VudCAtIE51bWJlciBvZiBjb25zZWN1dGl2ZSBkaXNjcmV0ZVxuICAgICAqICB0aW1lIHZhbHVlcyBjb250YWluZWQgaW4gdGhlIGRhdGEgZnJhbWUgb3V0cHV0IGJ5IHRoZSBzb3VyY2UuXG4gICAgICogIF9UaGUgdmFsdWUgc2hvdWxkIGJlIGRlZmluZWQgYnkgc291cmNlcyBhbmQgbmV2ZXIgbW9kaWZpZWRfLlxuICAgICAqXG4gICAgICogQG5hbWUgc3RyZWFtUGFyYW1zXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICovXG4gICAgdGhpcy5zdHJlYW1QYXJhbXMgPSB7XG4gICAgICBmcmFtZVR5cGU6IG51bGwsXG4gICAgICBmcmFtZVNpemU6IDEsXG4gICAgICBmcmFtZVJhdGU6IDAsXG4gICAgICBkZXNjcmlwdGlvbjogbnVsbCxcbiAgICAgIHNvdXJjZVNhbXBsZVJhdGU6IDAsXG4gICAgICBzb3VyY2VTYW1wbGVDb3VudDogbnVsbCxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogQ3VycmVudCBmcmFtZS4gVGhpcyBvYmplY3QgYW5kIGl0cyBkYXRhIGFyZSB1cGRhdGVkIGF0IGVhY2ggaW5jb21taW5nXG4gICAgICogZnJhbWUgd2l0aG91dCByZWFsbG9jYXRpbmcgbWVtb3J5LlxuICAgICAqXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAbmFtZSBmcmFtZVxuICAgICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSB0aW1lIC0gVGltZSBvZiB0aGUgY3VycmVudCBmcmFtZS5cbiAgICAgKiBAcHJvcGVydHkge0Zsb2F0MzJBcnJheX0gZGF0YSAtIERhdGEgb2YgdGhlIGN1cnJlbnQgZnJhbWUuXG4gICAgICogQHByb3BlcnR5IHtPYmplY3R9IG1ldGFkYXRhIC0gTWV0YWRhdGEgYXNzb2NpdGVkIHRvIHRoZSBjdXJyZW50IGZyYW1lLlxuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqL1xuICAgIHRoaXMuZnJhbWUgPSB7XG4gICAgICB0aW1lOiAwLFxuICAgICAgZGF0YTogbnVsbCxcbiAgICAgIG1ldGFkYXRhOiB7fSxcbiAgICB9O1xuXG4gICAgLyoqXG4gICAgICogTGlzdCBvZiBub2RlcyBjb25uZWN0ZWQgdG8gdGhlIG91cHV0IG9mIHRoZSBub2RlIChsb3dlciBpbiB0aGUgZ3JhcGgpLlxuICAgICAqIEF0IGVhY2ggZnJhbWUsIHRoZSBub2RlIGZvcndhcmQgaXRzIGBmcmFtZWAgdG8gdG8gYWxsIGl0cyBgbmV4dE9wc2AuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7QXJyYXk8QmFzZUxmbz59XG4gICAgICogQG5hbWUgbmV4dE9wc1xuICAgICAqIEBpbnN0YW5jZVxuICAgICAqIEBtZW1iZXJvZiBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmb1xuICAgICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI2Nvbm5lY3R9XG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZGlzY29ubmVjdH1cbiAgICAgKi9cbiAgICB0aGlzLm5leHRPcHMgPSBbXTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBub2RlIGZyb20gd2hpY2ggdGhlIG5vZGUgcmVjZWl2ZSB0aGUgZnJhbWVzICh1cHBlciBpbiB0aGUgZ3JhcGgpLlxuICAgICAqXG4gICAgICogQHR5cGUge0Jhc2VMZm99XG4gICAgICogQG5hbWUgcHJldk9wXG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jY29ubmVjdH1cbiAgICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNkaXNjb25uZWN0fVxuICAgICAqL1xuICAgIHRoaXMucHJldk9wID0gbnVsbDtcblxuICAgIC8qKlxuICAgICAqIElzIHNldCB0byB0cnVlIHdoZW4gYSBzdGF0aWMgcGFyYW1ldGVyIGlzIHVwZGF0ZWQuIE9uIHRoZSBuZXh0IGlucHV0XG4gICAgICogZnJhbWUgYWxsIHRoZSBzdWJncmFwaCBzdHJlYW1QYXJhbXMgc3RhcnRpbmcgZnJvbSB0aGlzIG5vZGUgd2lsbCBiZVxuICAgICAqIHVwZGF0ZWQuXG4gICAgICpcbiAgICAgKiBAdHlwZSB7Qm9vbGVhbn1cbiAgICAgKiBAbmFtZSBfcmVpbml0XG4gICAgICogQGluc3RhbmNlXG4gICAgICogQG1lbWJlcm9mIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvXG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9yZWluaXQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm5zIGFuIG9iamVjdCBkZXNjcmliaW5nIGVhY2ggYXZhaWxhYmxlIHBhcmFtZXRlciBvZiB0aGUgbm9kZS5cbiAgICpcbiAgICogQHJldHVybiB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0UGFyYW1zRGVzY3JpcHRpb24oKSB7XG4gICAgcmV0dXJuIHRoaXMucGFyYW1zLmdldERlZmluaXRpb25zKCk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXQgYWxsIHBhcmFtZXRlcnMgdG8gdGhlaXIgaW5pdGlhbCB2YWx1ZSAoYXMgZGVmaW5lZCBvbiBpbnN0YW50aWNhdGlvbilcbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jc3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcmVzZXRQYXJhbXMoKSB7XG4gICAgdGhpcy5wYXJhbXMucmVzZXQoKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGdW5jdGlvbiBjYWxsZWQgd2hlbiBhIHBhcmFtIGlzIHVwZGF0ZWQuIEJ5IGRlZmF1bHQgc2V0IHRoZSBgX3JlaW5pdGBcbiAgICogZmxhZyB0byBgdHJ1ZWAgaWYgdGhlIHBhcmFtIGlzIGBzdGF0aWNgIG9uZS4gVGhpcyBtZXRob2Qgc2hvdWxkIGJlXG4gICAqIGV4dGVuZGVkIHRvIGhhbmRsZSBwYXJ0aWN1bGFyIGxvZ2ljIGJvdW5kIHRvIGEgc3BlY2lmaWMgcGFyYW1ldGVyLlxuICAgKlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbmFtZSAtIE5hbWUgb2YgdGhlIHBhcmFtZXRlci5cbiAgICogQHBhcmFtIHtNaXhlZH0gdmFsdWUgLSBWYWx1ZSBvZiB0aGUgcGFyYW1ldGVyLlxuICAgKiBAcGFyYW0ge09iamVjdH0gbWV0YXMgLSBNZXRhZGF0YSBhc3NvY2lhdGVkIHRvIHRoZSBwYXJhbWV0ZXIuXG4gICAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyA9IHt9KSB7XG4gICAgaWYgKG1ldGFzLmtpbmQgPT09ICdzdGF0aWMnKVxuICAgICAgdGhpcy5fcmVpbml0ID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb25uZWN0IHRoZSBjdXJyZW50IG5vZGUgKGBwcmV2T3BgKSB0byBhbm90aGVyIG5vZGUgKGBuZXh0T3BgKS5cbiAgICogQSBnaXZlbiBub2RlIGNhbiBiZSBjb25uZWN0ZWQgdG8gc2V2ZXJhbCBvcGVyYXRvcnMgYW5kIHByb3BhZ2F0ZSB0aGVcbiAgICogc3RyZWFtIHRvIGVhY2ggb2YgdGhlbS5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlTGZvfSBuZXh0IC0gTmV4dCBvcGVyYXRvciBpbiB0aGUgZ3JhcGguXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jZGlzY29ubmVjdH1cbiAgICovXG4gIGNvbm5lY3QobmV4dCkge1xuICAgIGlmICghKG5leHQgaW5zdGFuY2VvZiBCYXNlTGZvKSlcbiAgICAgIHRocm93IG5ldyBFcnJvcignSW52YWxpZCBjb25uZWN0aW9uOiBjaGlsZCBub2RlIGlzIG5vdCBhbiBpbnN0YW5jZSBvZiBgQmFzZUxmb2AnKTtcblxuICAgIGlmICh0aGlzLnN0cmVhbVBhcmFtcyA9PT0gbnVsbCB8fG5leHQuc3RyZWFtUGFyYW1zID09PSBudWxsKVxuICAgICAgdGhyb3cgbmV3IEVycm9yKCdJbnZhbGlkIGNvbm5lY3Rpb246IGNhbm5vdCBjb25uZWN0IGEgZGVhZCBub2RlJyk7XG5cbiAgICB0aGlzLm5leHRPcHMucHVzaChuZXh0KTtcbiAgICBuZXh0LnByZXZPcCA9IHRoaXM7XG5cbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlICE9PSBudWxsKSAvLyBncmFwaCBoYXMgYWxyZWFkeSBiZWVuIHN0YXJ0ZWRcbiAgICAgIG5leHQucHJvY2Vzc1N0cmVhbVBhcmFtcyh0aGlzLnN0cmVhbVBhcmFtcyk7XG4gIH1cblxuICAvKipcbiAgICogUmVtb3ZlIHRoZSBnaXZlbiBvcGVyYXRvciBmcm9tIGl0cyBwcmV2aW91cyBvcGVyYXRvcnMnIGBuZXh0T3BzYC5cbiAgICpcbiAgICogQHBhcmFtIHtCYXNlTGZvfSBbbmV4dD1udWxsXSAtIFRoZSBvcGVyYXRvciB0byBkaXNjb25uZWN0IGZyb20gdGhlIGN1cnJlbnRcbiAgICogIG9wZXJhdG9yLiBJZiBgbnVsbGAgZGlzY29ubmVjdCBhbGwgdGhlIG5leHQgb3BlcmF0b3JzLlxuICAgKi9cbiAgZGlzY29ubmVjdChuZXh0ID0gbnVsbCkge1xuICAgIGlmIChuZXh0ID09PSBudWxsKSB7XG4gICAgICB0aGlzLm5leHRPcHMuZm9yRWFjaCgobmV4dCkgPT4gdGhpcy5kaXNjb25uZWN0KG5leHQpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgY29uc3QgaW5kZXggPSB0aGlzLm5leHRPcHMuaW5kZXhPZih0aGlzKTtcbiAgICAgIHRoaXMubmV4dE9wcy5zcGxpY2UoaW5kZXgsIDEpO1xuICAgICAgbmV4dC5wcmV2T3AgPSBudWxsO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBEZXN0cm95IGFsbCB0aGUgbm9kZXMgaW4gdGhlIHN1Yi1ncmFwaCBzdGFydGluZyBmcm9tIHRoZSBjdXJyZW50IG5vZGUuXG4gICAqIFdoZW4gZGV0cm95ZWQsIHRoZSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgbm9kZSBhcmUgc2V0IHRvIGBudWxsYCwgdGhlXG4gICAqIG9wZXJhdG9yIGlzIHRoZW4gY29uc2lkZXJlZCBhcyBgZGVhZGAgYW5kIGNhbm5vdCBiZSByZWNvbm5lY3RlZC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jY29ubmVjdH1cbiAgICovXG4gIGRlc3Ryb3koKSB7XG4gICAgLy8gZGVzdHJveSBhbGwgY2hpZHJlblxuICAgIGxldCBpbmRleCA9IHRoaXMubmV4dE9wcy5sZW5ndGg7XG5cbiAgICB3aGlsZSAoaW5kZXgtLSlcbiAgICAgIHRoaXMubmV4dE9wc1tpbmRleF0uZGVzdHJveSgpO1xuXG4gICAgLy8gZGlzY29ubmVjdCBpdHNlbGYgZnJvbSB0aGUgcHJldmlvdXMgb3BlcmF0b3JcbiAgICBpZiAodGhpcy5wcmV2T3ApXG4gICAgICB0aGlzLnByZXZPcC5kaXNjb25uZWN0KHRoaXMpO1xuXG4gICAgLy8gbWFyayB0aGUgb2JqZWN0IGFzIGRlYWRcbiAgICB0aGlzLnN0cmVhbVBhcmFtcyA9IG51bGw7XG4gIH1cblxuICAvKipcbiAgICogSGVscGVyIHRvIGluaXRpYWxpemUgdGhlIHN0cmVhbSBpbiBzdGFuZGFsb25lIG1vZGUuXG4gICAqXG4gICAqIEBwYXJhbSB7T2JqZWN0fSBbc3RyZWFtUGFyYW1zPXt9XSAtIFN0cmVhbSBwYXJhbWV0ZXJzIHRvIGJlIHVzZWQuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Jlc2V0U3RyZWFtfVxuICAgKi9cbiAgaW5pdFN0cmVhbShzdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJvY2Vzc1N0cmVhbVBhcmFtcyhzdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMucmVzZXRTdHJlYW0oKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldCB0aGUgYGZyYW1lLmRhdGFgIGJ1ZmZlciBieSBzZXR0aW5nIGFsbCBpdHMgdmFsdWVzIHRvIDAuXG4gICAqIEEgc291cmNlIG9wZXJhdG9yIHNob3VsZCBjYWxsIGBwcm9jZXNzU3RyZWFtUGFyYW1zYCBhbmQgYHJlc2V0U3RyZWFtYCB3aGVuXG4gICAqIHN0YXJ0ZWQsIGVhY2ggb2YgdGhlc2UgbWV0aG9kIHByb3BhZ2F0ZSB0aHJvdWdoIHRoZSBncmFwaCBhdXRvbWF0aWNhbHkuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NTdHJlYW1QYXJhbXN9XG4gICAqL1xuICByZXNldFN0cmVhbSgpIHtcbiAgICAvLyBidXR0b20gdXBcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE9wcy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLm5leHRPcHNbaV0ucmVzZXRTdHJlYW0oKTtcblxuICAgIC8vIG5vIGJ1ZmZlciBmb3IgYHNjYWxhcmAgdHlwZSBvciBzaW5rIG5vZGVcbiAgICBpZiAodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVUeXBlICE9PSAnc2NhbGFyJyAmJiB0aGlzLmZyYW1lLmRhdGEgIT09IG51bGwpXG4gICAgICB0aGlzLmZyYW1lLmRhdGEuZmlsbCgwKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBGaW5hbGl6ZSB0aGUgc3RyZWFtLiBBIHNvdXJjZSBub2RlIHNob3VsZCBjYWxsIHRoaXMgbWV0aG9kIHdoZW4gc3RvcHBlZCxcbiAgICogYGZpbmFsaXplU3RyZWFtYCBpcyBhdXRvbWF0aWNhbGx5IHByb3BhZ2F0ZWQgdGhyb3VnaHQgdGhlIGdyYXBoLlxuICAgKlxuICAgKiBAcGFyYW0ge051bWJlcn0gZW5kVGltZSAtIExvZ2ljYWwgdGltZSBhdCB3aGljaCB0aGUgZ3JhcGggaXMgc3RvcHBlZC5cbiAgICovXG4gIGZpbmFsaXplU3RyZWFtKGVuZFRpbWUpIHtcbiAgICBmb3IgKGxldCBpID0gMCwgbCA9IHRoaXMubmV4dE9wcy5sZW5ndGg7IGkgPCBsOyBpKyspXG4gICAgICB0aGlzLm5leHRPcHNbaV0uZmluYWxpemVTdHJlYW0oZW5kVGltZSk7XG4gIH1cblxuICAvKipcbiAgICogSW5pdGlhbGl6ZSBvciB1cGRhdGUgdGhlIG9wZXJhdG9yJ3MgYHN0cmVhbVBhcmFtc2AgYWNjb3JkaW5nIHRvIHRoZVxuICAgKiBwcmV2aW91cyBvcGVyYXRvcnMgYHN0cmVhbVBhcmFtc2AgdmFsdWVzLlxuICAgKlxuICAgKiBXaGVuIGltcGxlbWVudGluZyBhIG5ldyBvcGVyYXRvciB0aGlzIG1ldGhvZCBzaG91bGQ6XG4gICAqIDEuIGNhbGwgYHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtc2Agd2l0aCB0aGUgZ2l2ZW4gYHByZXZTdHJlYW1QYXJhbXNgXG4gICAqIDIuIG9wdGlvbm5hbGx5IGNoYW5nZSB2YWx1ZXMgdG8gYHRoaXMuc3RyZWFtUGFyYW1zYCBhY2NvcmRpbmcgdG8gdGhlXG4gICAqICAgIGxvZ2ljIHBlcmZvcm1lZCBieSB0aGUgb3BlcmF0b3IuXG4gICAqIDMuIG9wdGlvbm5hbGx5IGFsbG9jYXRlIG1lbW9yeSBmb3IgcmluZyBidWZmZXJzLCBldGMuXG4gICAqIDQuIGNhbGwgYHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zYCB0byB0cmlnZ2VyIHRoZSBtZXRob2Qgb24gdGhlIG5leHRcbiAgICogICAgb3BlcmF0b3JzIGluIHRoZSBncmFwaC5cbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IHByZXZTdHJlYW1QYXJhbXMgLSBgc3RyZWFtUGFyYW1zYCBvZiB0aGUgcHJldmlvdXMgb3BlcmF0b3IuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb3BhZ2F0ZVN0cmVhbVBhcmFtc31cbiAgICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKipcbiAgICogQ29tbW9uIGxvZ2ljIHRvIGRvIGF0IHRoZSBiZWdpbm5pbmcgb2YgdGhlIGBwcm9jZXNzU3RyZWFtUGFyYW1gLCBtdXN0IGJlXG4gICAqIGNhbGxlZCBhdCB0aGUgYmVnaW5uaW5nIG9mIGFueSBgcHJvY2Vzc1N0cmVhbVBhcmFtYCBpbXBsZW1lbnRhdGlvbi5cbiAgICpcbiAgICogVGhlIG1ldGhvZCBtYWlubHkgY2hlY2sgaWYgdGhlIGN1cnJlbnQgbm9kZSBpbXBsZW1lbnQgdGhlIGludGVyZmFjZSB0b1xuICAgKiBoYW5kbGUgdGhlIHR5cGUgb2YgZnJhbWUgcHJvcGFnYXRlZCBieSBpdCdzIHBhcmVudDpcbiAgICogLSB0byBoYW5kbGUgYSBgdmVjdG9yYCBmcmFtZSB0eXBlLCB0aGUgY2xhc3MgbXVzdCBpbXBsZW1lbnQgYHByb2Nlc3NWZWN0b3JgXG4gICAqIC0gdG8gaGFuZGxlIGEgYHNpZ25hbGAgZnJhbWUgdHlwZSwgdGhlIGNsYXNzIG11c3QgaW1wbGVtZW50IGBwcm9jZXNzU2lnbmFsYFxuICAgKiAtIGluIGNhc2Ugb2YgYSAnc2NhbGFyJyBmcmFtZSB0eXBlLCB0aGUgY2xhc3MgY2FuIGltcGxlbWVudCBhbnkgb2YgdGhlXG4gICAqIGZvbGxvd2luZyBieSBvcmRlciBvZiBwcmVmZXJlbmNlOiBgcHJvY2Vzc1NjYWxhcmAsIGBwcm9jZXNzVmVjdG9yYCxcbiAgICogYHByb2Nlc3NTaWduYWxgLlxuICAgKlxuICAgKiBAcGFyYW0ge09iamVjdH0gcHJldlN0cmVhbVBhcmFtcyAtIGBzdHJlYW1QYXJhbXNgIG9mIHRoZSBwcmV2aW91cyBvcGVyYXRvci5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvcGFnYXRlU3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICBPYmplY3QuYXNzaWduKHRoaXMuc3RyZWFtUGFyYW1zLCBwcmV2U3RyZWFtUGFyYW1zKTtcbiAgICBjb25zdCBwcmV2RnJhbWVUeXBlID0gcHJldlN0cmVhbVBhcmFtcy5mcmFtZVR5cGU7XG5cbiAgICBzd2l0Y2ggKHByZXZGcmFtZVR5cGUpIHtcbiAgICAgIGNhc2UgJ3NjYWxhcic6XG4gICAgICAgIGlmICh0aGlzLnByb2Nlc3NTY2FsYXIpXG4gICAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NTY2FsYXI7XG4gICAgICAgIGVsc2UgaWYgKHRoaXMucHJvY2Vzc1ZlY3RvcilcbiAgICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1ZlY3RvcjtcbiAgICAgICAgZWxzZSBpZiAodGhpcy5wcm9jZXNzU2lnbmFsKVxuICAgICAgICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uID0gdGhpcy5wcm9jZXNzU2lnbmFsO1xuICAgICAgICBlbHNlXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGAke3RoaXMuY29uc3RydWN0b3IubmFtZX0gLSBubyBcInByb2Nlc3NcIiBmdW5jdGlvbiBmb3VuZGApO1xuICAgICAgICBicmVhaztcbiAgICAgIGNhc2UgJ3ZlY3Rvcic6XG4gICAgICAgIGlmICghKCdwcm9jZXNzVmVjdG9yJyBpbiB0aGlzKSlcbiAgICAgICAgICB0aHJvdyBuZXcgRXJyb3IoYCR7dGhpcy5jb25zdHJ1Y3Rvci5uYW1lfSAtIFwicHJvY2Vzc1ZlY3RvclwiIGlzIG5vdCBkZWZpbmVkYCk7XG5cbiAgICAgICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24gPSB0aGlzLnByb2Nlc3NWZWN0b3I7XG4gICAgICAgIGJyZWFrO1xuICAgICAgY2FzZSAnc2lnbmFsJzpcbiAgICAgICAgaWYgKCEoJ3Byb2Nlc3NTaWduYWwnIGluIHRoaXMpKVxuICAgICAgICAgIHRocm93IG5ldyBFcnJvcihgJHt0aGlzLmNvbnN0cnVjdG9yLm5hbWV9IC0gXCJwcm9jZXNzU2lnbmFsXCIgaXMgbm90IGRlZmluZWRgKTtcblxuICAgICAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbiA9IHRoaXMucHJvY2Vzc1NpZ25hbDtcbiAgICAgICAgYnJlYWs7XG4gICAgICBkZWZhdWx0OlxuICAgICAgICAvLyBkZWZhdWx0cyB0byBwcm9jZXNzRnVuY3Rpb25cbiAgICAgICAgYnJlYWs7XG4gICAgfVxuICB9XG5cbiAgLyoqXG4gICAqIENyZWF0ZSB0aGUgYHRoaXMuZnJhbWUuZGF0YWAgYnVmZmVyIGFuZCBmb3J3YXJkIHRoZSBvcGVyYXRvcidzIGBzdHJlYW1QYXJhbWBcbiAgICogdG8gYWxsIGl0cyBuZXh0IG9wZXJhdG9ycywgbXVzdCBiZSBjYWxsZWQgYXQgdGhlIGVuZCBvZiBhbnlcbiAgICogYHByb2Nlc3NTdHJlYW1QYXJhbXNgIGltcGxlbWVudGF0aW9uLlxuICAgKlxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9jZXNzU3RyZWFtUGFyYW1zfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcmVwYXJlU3RyZWFtUGFyYW1zfVxuICAgKi9cbiAgcHJvcGFnYXRlU3RyZWFtUGFyYW1zKCkge1xuICAgIHRoaXMuZnJhbWUuZGF0YSA9IG5ldyBGbG9hdDMyQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcblxuICAgIGZvciAobGV0IGkgPSAwLCBsID0gdGhpcy5uZXh0T3BzLmxlbmd0aDsgaSA8IGw7IGkrKylcbiAgICAgIHRoaXMubmV4dE9wc1tpXS5wcm9jZXNzU3RyZWFtUGFyYW1zKHRoaXMuc3RyZWFtUGFyYW1zKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBEZWZpbmUgdGhlIHBhcnRpY3VsYXIgbG9naWMgdGhlIG9wZXJhdG9yIGFwcGxpZXMgdG8gdGhlIHN0cmVhbS5cbiAgICogQWNjb3JkaW5nIHRvIHRoZSBmcmFtZSB0eXBlIG9mIHRoZSBwcmV2aW91cyBub2RlLCB0aGUgbWV0aG9kIGNhbGxzIG9uZVxuICAgKiBvZiB0aGUgZm9sbG93aW5nIG1ldGhvZCBgcHJvY2Vzc1ZlY3RvcmAsIGBwcm9jZXNzU2lnbmFsYCBvciBgcHJvY2Vzc1NjYWxhcmBcbiAgICpcbiAgICogQHBhcmFtIHtPYmplY3R9IGZyYW1lIC0gRnJhbWUgKHRpbWUsIGRhdGEsIGFuZCBtZXRhZGF0YSkgYXMgZ2l2ZW4gYnkgdGhlXG4gICAqICBwcmV2aW91cyBvcGVyYXRvci4gVGhlIGluY29tbWluZyBmcmFtZSBzaG91bGQgbmV2ZXIgYmUgbW9kaWZpZWQgYnlcbiAgICogIHRoZSBvcGVyYXRvci5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJlcGFyZUZyYW1lfVxuICAgKiBAc2VlIHtAbGluayBtb2R1bGU6Y29tbW9uLmNvcmUuQmFzZUxmbyNwcm9wYWdhdGVGcmFtZX1cbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc1N0cmVhbVBhcmFtc31cbiAgICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKCk7XG5cbiAgICAvLyBmcmFtZVRpbWUgYW5kIGZyYW1lTWV0YWRhdGEgZGVmYXVsdHMgdG8gaWRlbnRpdHlcbiAgICB0aGlzLmZyYW1lLnRpbWUgPSBmcmFtZS50aW1lO1xuICAgIHRoaXMuZnJhbWUubWV0YWRhdGEgPSBmcmFtZS5tZXRhZGF0YTtcblxuICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKTtcbiAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gIH1cblxuICAvKipcbiAgICogUG9pbnRlciB0byB0aGUgbWV0aG9kIGNhbGxlZCBpbiBgcHJvY2Vzc0ZyYW1lYCBhY2NvcmRpbmcgdG8gdGhlXG4gICAqIGZyYW1lIHR5cGUgb2YgdGhlIHByZXZpb3VzIG9wZXJhdG9yLiBJcyBkeW5hbWljYWxseSBhc3NpZ25lZCBpblxuICAgKiBgcHJlcGFyZVN0cmVhbVBhcmFtc2AuXG4gICAqXG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3ByZXBhcmVTdHJlYW1QYXJhbXN9XG4gICAqIEBzZWUge0BsaW5rIG1vZHVsZTpjb21tb24uY29yZS5CYXNlTGZvI3Byb2Nlc3NGcmFtZX1cbiAgICovXG4gIHByb2Nlc3NGdW5jdGlvbihmcmFtZSkge1xuICAgIHRoaXMuZnJhbWUgPSBmcmFtZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBDb21tb24gbG9naWMgdG8gcGVyZm9ybSBhdCB0aGUgYmVnaW5uaW5nIG9mIHRoZSBgcHJvY2Vzc0ZyYW1lYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc0ZyYW1lfVxuICAgKi9cbiAgcHJlcGFyZUZyYW1lKCkge1xuICAgIGlmICh0aGlzLl9yZWluaXQgPT09IHRydWUpIHtcbiAgICAgIGNvbnN0IHN0cmVhbVBhcmFtcyA9IHRoaXMucHJldk9wICE9PSBudWxsID8gdGhpcy5wcmV2T3Auc3RyZWFtUGFyYW1zIDoge307XG4gICAgICB0aGlzLmluaXRTdHJlYW0oc3RyZWFtUGFyYW1zKTtcbiAgICAgIHRoaXMuX3JlaW5pdCA9IGZhbHNlO1xuICAgIH1cbiAgfVxuXG4gIC8qKlxuICAgKiBGb3J3YXJkIHRoZSBjdXJyZW50IGBmcmFtZWAgdG8gdGhlIG5leHQgb3BlcmF0b3JzLCBpcyBjYWxsZWQgYXQgdGhlIGVuZCBvZlxuICAgKiBgcHJvY2Vzc0ZyYW1lYC5cbiAgICpcbiAgICogQHNlZSB7QGxpbmsgbW9kdWxlOmNvbW1vbi5jb3JlLkJhc2VMZm8jcHJvY2Vzc0ZyYW1lfVxuICAgKi9cbiAgcHJvcGFnYXRlRnJhbWUoKSB7XG4gICAgZm9yIChsZXQgaSA9IDAsIGwgPSB0aGlzLm5leHRPcHMubGVuZ3RoOyBpIDwgbDsgaSsrKVxuICAgICAgdGhpcy5uZXh0T3BzW2ldLnByb2Nlc3NGcmFtZSh0aGlzLmZyYW1lKTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBCYXNlTGZvO1xuXG4iLCJpbXBvcnQgKiBhcyBnbW1VdGlscyBmcm9tICcuLi91dGlscy9nbW0tdXRpbHMnO1xuXG4vKipcbiAqIEdNTSBkZWNvZGVyIDxiciAvPlxuICogTG9hZHMgYSBtb2RlbCB0cmFpbmVkIGJ5IHRoZSBYTU0gbGlicmFyeSBhbmQgcHJvY2Vzc2VzIGFuIGlucHV0IHN0cmVhbSBvZiBmbG9hdCB2ZWN0b3JzIGluIHJlYWwtdGltZS5cbiAqIElmIHRoZSBtb2RlbCB3YXMgdHJhaW5lZCBmb3IgcmVncmVzc2lvbiwgb3V0cHV0cyBhbiBlc3RpbWF0aW9uIG9mIHRoZSBhc3NvY2lhdGVkIHByb2Nlc3MuXG4gKiBAY2xhc3NcbiAqL1xuXG5jbGFzcyBHbW1EZWNvZGVyIHtcblxuICAvKipcbiAgICogQHBhcmFtIHtOdW1iZXJ9IFt3aW5kb3dTaXplPTFdIC0gU2l6ZSBvZiB0aGUgbGlrZWxpaG9vZCBzbW9vdGhpbmcgd2luZG93LlxuICAgKi9cbiAgY29uc3RydWN0b3Iod2luZG93U2l6ZSA9IDEpIHtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtb2RlbCwgYXMgZ2VuZXJhdGVkIGJ5IFhNTSBmcm9tIGEgdHJhaW5pbmcgZGF0YSBzZXQuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX21vZGVsID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1vZGVsIHJlc3VsdHMsIGNvbnRhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2sgaW4gZmlsdGVyLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9tb2RlbFJlc3VsdHMgPSB1bmRlZmluZWQ7XG5cbiAgICAvKipcbiAgICAgKiBTaXplIG9mIHRoZSBsaWtlbGlob29kIHNtb290aGluZyB3aW5kb3cuXG4gICAgICogQHR5cGUge051bWJlcn1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX2xpa2VsaWhvb2RXaW5kb3cgPSB3aW5kb3dTaXplO1xuICB9XG5cbiAgLyoqXG4gICAqIENhbGxiYWNrIGhhbmRsaW5nIGVzdGltYXRpb24gcmVzdWx0cy5cbiAgICogQGNhbGxiYWNrIEdtbVJlc3VsdHNDYWxsYmFja1xuICAgKiBAcGFyYW0ge1N0cmluZ30gZXJyIC0gRGVzY3JpcHRpb24gb2YgYSBwb3RlbnRpYWwgZXJyb3IuXG4gICAqIEBwYXJhbSB7R21tUmVzdWx0c30gcmVzIC0gT2JqZWN0IGhvbGRpbmcgdGhlIGVzdGltYXRpb24gcmVzdWx0cy5cbiAgICovXG5cbiAgLyoqXG4gICAqIFJlc3VsdHMgb2YgdGhlIGZpbHRlcmluZyBwcm9jZXNzLlxuICAgKiBAdHlwZWRlZiBHbW1SZXN1bHRzXG4gICAqIEB0eXBlIHtPYmplY3R9XG4gICAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBsaWtlbGllc3QgLSBUaGUgbGlrZWxpZXN0IG1vZGVsJ3MgbGFiZWwuXG4gICAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsaWtlbGllc3RJbmRleCAtIFRoZSBsaWtlbGllc3QgbW9kZWwncyBpbmRleFxuICAgKiBAcHJvcGVydHkge0FycmF5Lm51bWJlcn0gbGlrZWxpaG9vZHMgLSBUaGUgYXJyYXkgb2YgYWxsIG1vZGVscycgc21vb3RoZWQgbm9ybWFsaXplZCBsaWtlbGlob29kcy5cbiAgICogQHByb3BlcnR5IHs/QXJyYXkubnVtYmVyfSBvdXRwdXRWYWx1ZXMgLSBJZiB0aGUgbW9kZWwgd2FzIHRyYWluZWQgd2l0aCByZWdyZXNzaW9uLCB0aGUgZXN0aW1hdGVkIGZsb2F0IHZlY3RvciBvdXRwdXQuXG4gICAqIEBwcm9wZXJ0eSB7P0FycmF5Lm51bWJlcn0gb3V0cHV0Q292YXJpYW5jZSAtIElmIHRoZSBtb2RlbCB3YXMgdHJhaW5lZCB3aXRoIHJlZ3Jlc3Npb24sIHRoZSBvdXRwdXQgY292YXJpYW5jZSBtYXRyaXguXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaGUgZGVjb2RpbmcgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7QXJyYXl9IG9ic2VydmF0aW9uIC0gQW4gaW5wdXQgZmxvYXQgdmVjdG9yIHRvIGJlIGVzdGltYXRlZC5cbiAgICogQHBhcmFtIHtHbW1SZXN1bHRzQ2FsbGJhY2t9IHJlc3VsdHNDYWxsYmFjayAtIFRoZSBjYWxsYmFjayBoYW5kbGluZyB0aGUgZXN0aW1hdGlvbiByZXN1bHRzLlxuICAgKi9cbiAgZmlsdGVyKG9ic2VydmF0aW9uLCByZXN1bHRzQ2FsbGJhY2spIHtcbiAgICBsZXQgZXJyID0gbnVsbDtcbiAgICBsZXQgcmVzID0gbnVsbDtcblxuICAgIGlmKHRoaXMuX21vZGVsID09PSB1bmRlZmluZWQpIHtcbiAgICAgIGNvbnNvbGUubG9nKFwibm8gbW9kZWwgbG9hZGVkXCIpO1xuICAgICAgcmV0dXJuO1xuICAgIH0gZWxzZSB7XG4gICAgICB0cnkge1xuICAgICAgICBnbW1VdGlscy5nbW1GaWx0ZXIob2JzZXJ2YXRpb24sIHRoaXMuX21vZGVsLCB0aGlzLl9tb2RlbFJlc3VsdHMpOyAgICAgICAgIFxuXG4gICAgICAgIGNvbnN0IGxpa2VsaWVzdCA9ICh0aGlzLl9tb2RlbFJlc3VsdHMubGlrZWxpZXN0ID4gLTEpXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMuX21vZGVsLm1vZGVsc1t0aGlzLl9tb2RlbFJlc3VsdHMubGlrZWxpZXN0XS5sYWJlbFxuICAgICAgICAgICAgICAgICAgICAgICAgOiAndW5rbm93bic7XG4gICAgICAgIGNvbnN0IGxpa2VsaWhvb2RzID0gdGhpcy5fbW9kZWxSZXN1bHRzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHMuc2xpY2UoMCk7XG4gICAgICAgIHJlcyA9IHtcbiAgICAgICAgICBsaWtlbGllc3Q6IGxpa2VsaWVzdCxcbiAgICAgICAgICBsaWtlbGllc3RJbmRleDogdGhpcy5fbW9kZWxSZXN1bHRzLmxpa2VsaWVzdCxcbiAgICAgICAgICBsaWtlbGlob29kczogbGlrZWxpaG9vZHNcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGFkZCByZWdyZXNzaW9uIHJlc3VsdHMgdG8gZ2xvYmFsIHJlc3VsdHMgaWYgYmltb2RhbCA6XG4gICAgICAgIGlmKHRoaXMuX21vZGVsLnNoYXJlZF9wYXJhbWV0ZXJzLmJpbW9kYWwpIHtcbiAgICAgICAgICByZXNbJ291dHB1dFZhbHVlcyddID0gdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF92YWx1ZXMuc2xpY2UoMCk7XG4gICAgICAgICAgcmVzWydvdXRwdXRDb3ZhcmlhbmNlJ11cbiAgICAgICAgICAgICAgPSB0aGlzLm1vZGVsUmVzdWx0cy5vdXRwdXRfY292YXJpYW5jZS5zbGljZSgwKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnIgPSAncHJvYmxlbSBvY2N1cmVkIGR1cmluZyBmaWx0ZXJpbmcgOiAnICsgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHRzQ2FsbGJhY2soZXJyLCByZXMpO1xuICB9XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT0gR0VUVEVSUyAvIFNFVFRFUlMgPT09PT09PT09PT09PT09PT09PT09PT09PT09PS8vXG5cbiAgLyoqXG4gICAqIExpa2VsaWhvb2Qgc21vb3RoaW5nIHdpbmRvdyBzaXplLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGxpa2VsaWhvb2RXaW5kb3coKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpa2VsaWhvb2RXaW5kb3c7XG4gIH1cblxuICBzZXQgbGlrZWxpaG9vZFdpbmRvdyhuZXdXaW5kb3dTaXplKSB7XG4gICAgdGhpcy5fbGlrZWxpaG9vZFdpbmRvdyA9IG5ld1dpbmRvd1NpemU7XG4gICAgaWYgKHRoaXMuX21vZGVsID09PSB1bmRlZmluZWQpIHJldHVybjtcblxuICAgIGNvbnN0IHJlcyA9IHRoaXMuX21vZGVsUmVzdWx0cy5zaW5nbGVDbGFzc01vZGVsUmVzdWx0cztcblxuICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLl9tb2RlbC5tb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc1tpXS5saWtlbGlob29kX2J1ZmZlciA9IG5ldyBBcnJheSh0aGlzLl9saWtlbGlob29kV2luZG93KTtcblxuICAgICAgZm9yIChsZXQgaj0wOyBqPHRoaXMuX2xpa2VsaWhvb2RXaW5kb3c7IGorKykge1xuICAgICAgICByZXMubGlrZWxpaG9vZF9idWZmZXJbal0gPSAxIC8gdGhpcy5fbGlrZWxpaG9vZFdpbmRvdztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1vZGVsIGdlbmVyYXRlZCBieSBYTU0uXG4gICAqIEl0IGlzIG1hbmRhdG9yeSBmb3IgdGhlIGNsYXNzIHRvIGhhdmUgYSBtb2RlbCBpbiBvcmRlciB0byBkbyBpdHMgam9iLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0IG1vZGVsKCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gSlNPTi5mcm9tU3RyaW5nKEpTT04uc3RyaW5naWZ5KHRoaXMuX21vZGVsKSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQgbW9kZWwobW9kZWwpIHtcbiAgICB0aGlzLl9zZXRNb2RlbChtb2RlbCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3NldE1vZGVsKG1vZGVsKSB7XG4gICAgdGhpcy5fbW9kZWwgPSB1bmRlZmluZWQ7XG4gICAgdGhpcy5fbW9kZWxSZXN1bHRzID0gdW5kZWZpbmVkO1xuXG4gICAgLy8gdGVzdCBpZiBtb2RlbCBpcyB2YWxpZCBoZXJlIChUT0RPIDogd3JpdGUgYSBiZXR0ZXIgdGVzdClcbiAgICBpZiAobW9kZWwubW9kZWxzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX21vZGVsID0gbW9kZWw7XG4gICAgICBjb25zdCBtID0gdGhpcy5fbW9kZWw7XG4gICAgICBjb25zdCBubW9kZWxzID0gbS5tb2RlbHMubGVuZ3RoO1xuXG4gICAgICB0aGlzLl9tb2RlbFJlc3VsdHMgPSB7XG4gICAgICAgIGluc3RhbnRfbGlrZWxpaG9vZHM6IG5ldyBBcnJheShubW9kZWxzKSxcbiAgICAgICAgc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIHNtb290aGVkX2xpa2VsaWhvb2RzOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIGluc3RhbnRfbm9ybWFsaXplZF9saWtlbGlob29kczogbmV3IEFycmF5KG5tb2RlbHMpLFxuICAgICAgICBzbW9vdGhlZF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIGxpa2VsaWVzdDogLTEsXG4gICAgICAgIHNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzOiBbXVxuICAgICAgfTtcblxuICAgICAgLy8gdGhlIGZvbGxvd2luZyB2YXJpYWJsZXMgYXJlIHVzZWQgZm9yIHJlZ3Jlc3Npb24gOlxuICAgICAgY29uc3QgcGFyYW1zID0gbS5zaGFyZWRfcGFyYW1ldGVycztcbiAgICAgIGNvbnN0IGRpbU91dCA9IHBhcmFtcy5kaW1lbnNpb24gLSBwYXJhbXMuZGltZW5zaW9uX2lucHV0O1xuICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF92YWx1ZXMgPSBuZXcgQXJyYXkoZGltT3V0KTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1PdXQ7IGkrKykge1xuICAgICAgICB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X3ZhbHVlc1tpXSA9IDAuMDtcbiAgICAgIH1cblxuICAgICAgbGV0IG91dENvdmFyU2l6ZTtcbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gICAgICBpZiAobS5jb25maWd1cmF0aW9uLmRlZmF1bHRfcGFyYW1ldGVycy5jb3ZhcmlhbmNlX21vZGUgPT0gMCkge1xuICAgICAgICBvdXRDb3ZhclNpemUgPSBkaW1PdXQgKiBkaW1PdXQ7XG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFnb25hbFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgb3V0Q292YXJTaXplID0gZGltT3V0O1xuICAgICAgfVxuICAgICAgXG4gICAgICB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X2NvdmFyaWFuY2UgPSBuZXcgQXJyYXkob3V0Q292YXJTaXplKTtcblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1PdXQ7IGkrKykge1xuICAgICAgICB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X2NvdmFyaWFuY2VbaV0gPSAwLjA7XG4gICAgICB9XG5cblxuICAgICAgZm9yKGxldCBpID0gMDsgaSA8IG5tb2RlbHM7IGkrKykge1xuXG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5pbnN0YW50X2xpa2VsaWhvb2RzW2ldID0gMDtcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLnNtb290aGVkX2xvZ19saWtlbGlob29kc1tpXSA9IDA7XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5zbW9vdGhlZF9saWtlbGlob29kc1tpXSA9IDA7XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5pbnN0YW50X25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gPSAwO1xuICAgICAgICB0aGlzLl9tb2RlbFJlc3VsdHMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSA9IDA7XG5cbiAgICAgICAgY29uc3QgcmVzID0ge1xuICAgICAgICAgIGluc3RhbnRfbGlrZWxpaG9vZDogMCxcbiAgICAgICAgICBsb2dfbGlrZWxpaG9vZDogMFxuICAgICAgICB9O1xuXG4gICAgICAgIHJlcy5saWtlbGlob29kX2J1ZmZlciA9IG5ldyBBcnJheSh0aGlzLl9saWtlbGlob29kV2luZG93KTtcblxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMuX2xpa2VsaWhvb2RXaW5kb3c7IGorKykge1xuICAgICAgICAgIHJlcy5saWtlbGlob29kX2J1ZmZlcltqXSA9IDEgLyB0aGlzLl9saWtlbGlob29kV2luZG93O1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICByZXMubGlrZWxpaG9vZF9idWZmZXJfaW5kZXggPSAwO1xuXG4gICAgICAgIC8vIHRoZSBmb2xsb3dpbmcgdmFyaWFibGVzIGFyZSB1c2VkIGZvciByZWdyZXNzaW9uIDpcbiAgICAgICAgcmVzLmJldGEgPSBuZXcgQXJyYXkobS5tb2RlbHNbaV0uY29tcG9uZW50cy5sZW5ndGgpO1xuXG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgcmVzLmJldGEubGVuZ3RoOyBqKyspIHtcbiAgICAgICAgICByZXMuYmV0YVtqXSA9IDEgLyByZXMuYmV0YS5sZW5ndGg7XG4gICAgICAgIH1cblxuICAgICAgICByZXMub3V0cHV0X3ZhbHVlcyA9IHRoaXMuX21vZGVsUmVzdWx0cy5vdXRwdXRfdmFsdWVzLnNsaWNlKDApO1xuICAgICAgICByZXMub3V0cHV0X2NvdmFyaWFuY2UgPSB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X2NvdmFyaWFuY2Uuc2xpY2UoMCk7XG5cbiAgICAgICAgLy8gbm93IGFkZCB0aGlzIHNpbmdsZU1vZGVsUmVzdWx0cyBvYmplY3RcbiAgICAgICAgLy8gdG8gdGhlIGdsb2JhbCBtb2RlbFJlc3VsdHMgb2JqZWN0IDpcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzLnB1c2gocmVzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudGx5IGVzdGltYXRlZCBsaWtlbGllc3QgbGFiZWwuXG4gICAqIEByZWFkb25seVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxpa2VsaWVzdExhYmVsKCkge1xuICAgIGlmICh0aGlzLl9tb2RlbFJlc3VsdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHRoaXMuX21vZGVsUmVzdWx0cy5saWtlbGllc3QgPiAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwubW9kZWxzW3RoaXMuX21vZGVsUmVzdWx0cy5saWtlbGllc3RdLmxhYmVsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJ3Vua25vd24nO1xuICB9XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBjbGFzc2VzIGNvbnRhaW5lZCBpbiB0aGUgbW9kZWwuXG4gICAqIEByZWFkb25seVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG5iQ2xhc3NlcygpIHtcbiAgICBpZih0aGlzLl9tb2RlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gdGhpcy5fbW9kZWwubW9kZWxzLmxlbmd0aDtcbiAgICB9XG4gICAgcmV0dXJuIDA7XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdtbURlY29kZXI7IiwiaW1wb3J0ICogYXMgaGhtbVV0aWxzIGZyb20gJy4uL3V0aWxzL2hobW0tdXRpbHMnO1xuXG4vKipcbiAqIEhpZXJhcmNoaWNhbCBITU0gZGVjb2RlciA8YnIgLz5cbiAqIExvYWRzIGEgbW9kZWwgdHJhaW5lZCBieSB0aGUgWE1NIGxpYnJhcnkgYW5kIHByb2Nlc3NlcyBhbiBpbnB1dCBzdHJlYW0gb2YgZmxvYXQgdmVjdG9ycyBpbiByZWFsLXRpbWUuXG4gKiBJZiB0aGUgbW9kZWwgd2FzIHRyYWluZWQgZm9yIHJlZ3Jlc3Npb24sIG91dHB1dHMgYW4gZXN0aW1hdGlvbiBvZiB0aGUgYXNzb2NpYXRlZCBwcm9jZXNzLlxuICogQGNsYXNzXG4gKi9cblxuY2xhc3MgSGhtbURlY29kZXIge1xuXG4gIC8qKlxuICAgKiBAcGFyYW0ge051bWJlcn0gW3dpbmRvd1NpemU9MV0gLSBTaXplIG9mIHRoZSBsaWtlbGlob29kIHNtb290aGluZyB3aW5kb3cuXG4gICAqL1xuICBjb25zdHJ1Y3Rvcih3aW5kb3dTaXplID0gMSkge1xuXG4gICAgLyoqXG4gICAgICogU2l6ZSBvZiB0aGUgbGlrZWxpaG9vZCBzbW9vdGhpbmcgd2luZG93LlxuICAgICAqIEB0eXBlIHtudW1iZXJ9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9saWtlbGlob29kV2luZG93ID0gd2luZG93U2l6ZTtcblxuICAgIC8qKlxuICAgICAqIFRoZSBtb2RlbCwgYXMgZ2VuZXJhdGVkIGJ5IFhNTSBmcm9tIGEgdHJhaW5pbmcgZGF0YSBzZXQuXG4gICAgICogQHR5cGUge09iamVjdH1cbiAgICAgKiBAcHJpdmF0ZVxuICAgICAqL1xuICAgIHRoaXMuX21vZGVsID0gdW5kZWZpbmVkO1xuXG4gICAgLyoqXG4gICAgICogVGhlIG1vZGVsIHJlc3VsdHMsIGNvbnRhaW5pbmcgaW50ZXJtZWRpYXRlIHJlc3VsdHMgdGhhdCB3aWxsIGJlIHBhc3NlZCB0byB0aGUgY2FsbGJhY2sgaW4gZmlsdGVyLlxuICAgICAqIEB0eXBlIHtPYmplY3R9XG4gICAgICogQHByaXZhdGVcbiAgICAgKi9cbiAgICB0aGlzLl9tb2RlbFJlc3VsdHMgPSB1bmRlZmluZWQ7XG4gIH1cblxuICAvKipcbiAgICogQ2FsbGJhY2sgaGFuZGxpbmcgZXN0aW1hdGlvbiByZXN1bHRzLlxuICAgKiBAY2FsbGJhY2sgSGhtbVJlc3VsdHNDYWxsYmFja1xuICAgKiBAcGFyYW0ge3N0cmluZ30gZXJyIC0gRGVzY3JpcHRpb24gb2YgYSBwb3RlbnRpYWwgZXJyb3IuXG4gICAqIEBwYXJhbSB7SGhtbVJlc3VsdHN9IHJlcyAtIE9iamVjdCBob2xkaW5nIHRoZSBlc3RpbWF0aW9uIHJlc3VsdHMuXG4gICAqL1xuXG4gIC8qKlxuICAgKiBSZXN1bHRzIG9mIHRoZSBmaWx0ZXJpbmcgcHJvY2Vzcy5cbiAgICogQHR5cGVkZWYgSGhtbVJlc3VsdHNcbiAgICogQHR5cGUge09iamVjdH1cbiAgICogQHByb3BlcnR5IHtTdHJpbmd9IGxpa2VsaWVzdCAtIFRoZSBsaWtlbGllc3QgbW9kZWwncyBsYWJlbC5cbiAgICogQHByb3BlcnR5IHtOdW1iZXJ9IGxpa2VsaWVzdEluZGV4IC0gVGhlIGxpa2VsaWVzdCBtb2RlbCdzIGluZGV4XG4gICAqIEBwcm9wZXJ0eSB7QXJyYXkubnVtYmVyfSBsaWtlbGlob29kcyAtIFRoZSBhcnJheSBvZiBhbGwgbW9kZWxzJyBzbW9vdGhlZCBub3JtYWxpemVkIGxpa2VsaWhvb2RzLlxuICAgKiBAcHJvcGVydHkge0FycmF5Lm51bWJlcn0gdGltZVByb2dyZXNzaW9ucyAtIFRoZSBhcnJheSBvZiBhbGwgbW9kZWxzJyBub3JtYWxpemVkIHRpbWUgcHJvZ3Jlc3Npb25zLlxuICAgKiBAcHJvcGVydHkge0FycmF5LkFycmF5Lm51bWJlcn0gYWxwaGFzIC0gVGhlIGFycmF5IG9mIGFsbCBtb2RlbHMnIHN0YXRlcyBsaWtlbGlob29kcyBhcnJheS5cbiAgICogQHByb3BlcnR5IHs/QXJyYXkubnVtYmVyfSBvdXRwdXRWYWx1ZXMgLSBJZiB0aGUgbW9kZWwgd2FzIHRyYWluZWQgd2l0aCByZWdyZXNzaW9uLCB0aGUgZXN0aW1hdGVkIGZsb2F0IHZlY3RvciBvdXRwdXQuXG4gICAqIEBwcm9wZXJ0eSB7P0FycmF5Lm51bWJlcn0gb3V0cHV0Q292YXJpYW5jZSAtIElmIHRoZSBtb2RlbCB3YXMgdHJhaW5lZCB3aXRoIHJlZ3Jlc3Npb24sIHRoZSBvdXRwdXQgY292YXJpYW5jZSBtYXRyaXguXG4gICAqL1xuXG4gIC8qKlxuICAgKiBUaGUgZGVjb2RpbmcgZnVuY3Rpb24uXG4gICAqIEBwYXJhbSB7QXJyYXkubnVtYmVyfSBvYnNlcnZhdGlvbiAtIEFuIGlucHV0IGZsb2F0IHZlY3RvciB0byBiZSBlc3RpbWF0ZWQuXG4gICAqIEBwYXJhbSB7SGhtbVJlc3VsdHNDYWxsYmFja30gcmVzdWx0c0NhbGxiYWNrIC0gVGhlIGNhbGxiYWNrIGhhbmRsaW5nIHRoZSBlc3RpbWF0aW9uIHJlc3VsdHMuXG4gICAqL1xuICBmaWx0ZXIob2JzZXJ2YXRpb24sIHJlc3VsdHNDYWxsYmFjaykge1xuICAgIGxldCBlcnIgPSBudWxsO1xuICAgIGxldCByZXMgPSBudWxsO1xuXG4gICAgaWYodGhpcy5fbW9kZWwgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyID0gJ25vIG1vZGVsIGxvYWRlZCB5ZXQnO1xuICAgIH0gZWxzZSB7XG4gICAgICAvL2NvbnNvbGUubG9nKG9ic2VydmF0aW9uKTtcbiAgICAgIC8vdGhpcy5fb2JzZXJ2YXRpb24gPSBvYnNlcnZhdGlvbjtcbiAgICAgIHRyeSB7XG4gICAgICAgIGhobW1VdGlscy5oaG1tRmlsdGVyKG9ic2VydmF0aW9uLCB0aGlzLl9tb2RlbCwgdGhpcy5fbW9kZWxSZXN1bHRzKTtcblxuICAgICAgICAvLyBjcmVhdGUgcmVzdWx0cyBvYmplY3QgZnJvbSByZWxldmFudCBtb2RlbFJlc3VsdHMgdmFsdWVzIDpcbiAgICAgICAgY29uc3QgbGlrZWxpZXN0ID0gKHRoaXMuX21vZGVsUmVzdWx0cy5saWtlbGllc3QgPiAtMSlcbiAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5fbW9kZWwubW9kZWxzW3RoaXMuX21vZGVsUmVzdWx0cy5saWtlbGllc3RdLmxhYmVsXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICd1bmtub3duJztcbiAgICAgICAgY29uc3QgbGlrZWxpaG9vZHMgPSB0aGlzLl9tb2RlbFJlc3VsdHMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kcy5zbGljZSgwKTtcbiAgICAgICAgcmVzID0ge1xuICAgICAgICAgIGxpa2VsaWVzdDogbGlrZWxpZXN0LFxuICAgICAgICAgIGxpa2VsaWVzdEluZGV4OiB0aGlzLl9tb2RlbFJlc3VsdHMubGlrZWxpZXN0LFxuICAgICAgICAgIGxpa2VsaWhvb2RzOiBsaWtlbGlob29kcyxcbiAgICAgICAgICB0aW1lUHJvZ3Jlc3Npb25zOiBuZXcgQXJyYXkodGhpcy5fbW9kZWwubW9kZWxzLmxlbmd0aCksXG4gICAgICAgICAgYWxwaGFzOiBuZXcgQXJyYXkodGhpcy5fbW9kZWwubW9kZWxzLmxlbmd0aClcbiAgICAgICAgfTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX21vZGVsLm1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICAgIHJlcy50aW1lUHJvZ3Jlc3Npb25zW2ldID0gdGhpcy5fbW9kZWxSZXN1bHRzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldLnByb2dyZXNzO1xuICAgICAgICAgIGlmICh0aGlzLl9tb2RlbC5jb25maWd1cmF0aW9uLmRlZmF1bHRfcGFyYW1ldGVycy5oaWVyYXJjaGljYWwpIHtcbiAgICAgICAgICAgIHJlcy5hbHBoYXNbaV1cbiAgICAgICAgICAgICAgPSB0aGlzLl9tb2RlbFJlc3VsdHMuc2luZ2xlQ2xhc3NIbW1Nb2RlbFJlc3VsdHNbaV0uYWxwaGFfaFswXTtcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgcmVzLmFscGhhc1tpXVxuICAgICAgICAgICAgICA9IHRoaXMuX21vZGVsUmVzdWx0cy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXS5hbHBoYVswXTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBpZiAodGhpcy5fbW9kZWwuc2hhcmVkX3BhcmFtZXRlcnMuYmltb2RhbCkge1xuICAgICAgICAgIHJlc1snb3V0cHV0VmFsdWVzJ10gPSB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X3ZhbHVlcy5zbGljZSgwKTtcbiAgICAgICAgICByZXNbJ291dHB1dENvdmFyaWFuY2UnXVxuICAgICAgICAgICAgICA9IHRoaXMuX21vZGVsUmVzdWx0cy5vdXRwdXRfY292YXJpYW5jZS5zbGljZSgwKTtcbiAgICAgICAgfVxuICAgICAgfSBjYXRjaCAoZSkge1xuICAgICAgICBlcnIgPSAncHJvYmxlbSBvY2N1cmVkIGR1cmluZyBmaWx0ZXJpbmcgOiAnICsgZTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXN1bHRzQ2FsbGJhY2soZXJyLCByZXMpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIGVzdGltYXRpb24gKHNob3J0Y3V0IGZvciByZWxvYWRpbmcgdGhlIG1vZGVsKS5cbiAgICovXG4gIHJlc2V0KCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9zZXRNb2RlbCh0aGlzLl9tb2RlbCk7XG4gICAgfVxuICB9XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PSBHRVRURVJTIC8gU0VUVEVSUyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PS8vXG5cbiAgLyoqXG4gICAqIExpa2VsaWhvb2Qgc21vb3RoaW5nIHdpbmRvdyBzaXplLlxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IGxpa2VsaWhvb2RXaW5kb3coKSB7XG4gICAgcmV0dXJuIHRoaXMuX2xpa2VsaWhvb2RXaW5kb3c7XG4gIH1cblxuICBzZXQgbGlrZWxpaG9vZFdpbmRvdyhuZXdXaW5kb3dTaXplKSB7XG4gICAgdGhpcy5fbGlrZWxpaG9vZFdpbmRvdyA9IG5ld1dpbmRvd1NpemU7XG5cbiAgICBpZiAodGhpcy5fbW9kZWwgPT09IHVuZGVmaW5lZCkgcmV0dXJuO1xuXG4gICAgY29uc3QgcmVzID0gdGhpcy5fbW9kZWxSZXN1bHRzLnNpbmdsZUNsYXNzTW9kZWxSZXN1bHRzO1xuICAgIFxuICAgIGZvciAobGV0IGk9MDsgaTx0aGlzLl9tb2RlbC5tb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIHJlc1tpXS5saWtlbGlob29kX2J1ZmZlciA9IG5ldyBBcnJheSh0aGlzLl9saWtlbGlob29kV2luZG93KTtcblxuICAgICAgZm9yIChsZXQgaj0wOyBqPHRoaXMuX2xpa2VsaWhvb2RXaW5kb3c7IGorKykge1xuICAgICAgICByZXMubGlrZWxpaG9vZF9idWZmZXJbal0gPSAxIC8gdGhpcy5fbGlrZWxpaG9vZFdpbmRvdztcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogVGhlIG1vZGVsIGdlbmVyYXRlZCBieSBYTU0uXG4gICAqIEl0IGlzIG1hbmRhdG9yeSBmb3IgdGhlIGNsYXNzIHRvIGhhdmUgYSBtb2RlbCBpbiBvcmRlciB0byBkbyBpdHMgam9iLlxuICAgKiBAdHlwZSB7T2JqZWN0fVxuICAgKi9cbiAgZ2V0IG1vZGVsKCkge1xuICAgIGlmICh0aGlzLl9tb2RlbCAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICByZXR1cm4gSlNPTi5mcm9tU3RyaW5nKEpTT04uc3RyaW5naWZ5KHRoaXMuX21vZGVsKSk7XG4gICAgfVxuICAgIHJldHVybiB1bmRlZmluZWQ7XG4gIH1cblxuICBzZXQgbW9kZWwobW9kZWwpIHtcbiAgICB0aGlzLl9zZXRNb2RlbChtb2RlbCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgX3NldE1vZGVsKG1vZGVsKSB7ICAgICAgXG5cbiAgICB0aGlzLl9tb2RlbCA9IHVuZGVmaW5lZDtcbiAgICB0aGlzLl9tb2RlbFJlc3VsdHMgPSB1bmRlZmluZWQ7XG5cbiAgICAvLyB0ZXN0IGlmIG1vZGVsIGlzIHZhbGlkIGhlcmUgKFRPRE8gOiB3cml0ZSBhIGJldHRlciB0ZXN0KVxuICAgIGlmIChtb2RlbC5tb2RlbHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fbW9kZWwgPSBtb2RlbDtcbiAgICAgIGNvbnN0IG0gPSB0aGlzLl9tb2RlbDtcbiAgICAgIGNvbnN0IG5tb2RlbHMgPSBtLm1vZGVscy5sZW5ndGg7XG5cbiAgICAgIHRoaXMuX21vZGVsUmVzdWx0cyA9IHtcbiAgICAgICAgaW5zdGFudF9saWtlbGlob29kczogbmV3IEFycmF5KG5tb2RlbHMpLFxuICAgICAgICBzbW9vdGhlZF9sb2dfbGlrZWxpaG9vZHM6IG5ldyBBcnJheShubW9kZWxzKSxcbiAgICAgICAgc21vb3RoZWRfbGlrZWxpaG9vZHM6IG5ldyBBcnJheShubW9kZWxzKSxcbiAgICAgICAgaW5zdGFudF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzOiBuZXcgQXJyYXkobm1vZGVscyksXG4gICAgICAgIHNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHM6IG5ldyBBcnJheShubW9kZWxzKSxcbiAgICAgICAgbGlrZWxpZXN0OiAtMSxcbiAgICAgICAgZnJvbnRpZXJfdjE6IG5ldyBBcnJheShubW9kZWxzKSxcbiAgICAgICAgZnJvbnRpZXJfdjI6IG5ldyBBcnJheShubW9kZWxzKSxcbiAgICAgICAgZm9yd2FyZF9pbml0aWFsaXplZDogZmFsc2UsXG4gICAgICAgIHNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzOiBbXVxuICAgICAgfTtcblxuICAgICAgY29uc3QgcGFyYW1zID0gbS5zaGFyZWRfcGFyYW1ldGVycztcbiAgICAgIGNvbnN0IGRpbU91dCA9IHBhcmFtcy5kaW1lbnNpb24gLSBwYXJhbXMuZGltZW5zaW9uX2lucHV0O1xuICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF92YWx1ZXMgPSBuZXcgQXJyYXkoZGltT3V0KTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZGltT3V0OyBpKyspIHtcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF92YWx1ZXNbaV0gPSAwLjA7XG4gICAgICB9XG5cbiAgICAgIGxldCBvdXRDb3ZhclNpemU7XG4gICAgICBpZiAobS5jb25maWd1cmF0aW9uLmRlZmF1bHRfcGFyYW1ldGVycy5jb3ZhcmlhbmNlX21vZGUgPT0gMCkgeyAvLy0tLS0gZnVsbFxuICAgICAgICBvdXRDb3ZhclNpemUgPSBkaW1PdXQgKiBkaW1PdXQ7XG4gICAgICB9IGVsc2UgeyAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFnb25hbFxuICAgICAgICBvdXRDb3ZhclNpemUgPSBkaW1PdXQ7XG4gICAgICB9XG4gICAgICBcbiAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5vdXRwdXRfY292YXJpYW5jZSA9IG5ldyBBcnJheShvdXRDb3ZhclNpemUpO1xuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGRpbU91dDsgaSsrKSB7XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5vdXRwdXRfY292YXJpYW5jZVtpXSA9IDAuMDtcbiAgICAgIH1cblxuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBubW9kZWxzOyBpKyspIHtcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLmluc3RhbnRfbGlrZWxpaG9vZHNbaV0gPSAwO1xuICAgICAgICB0aGlzLl9tb2RlbFJlc3VsdHMuc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzW2ldID0gMDtcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLnNtb290aGVkX2xpa2VsaWhvb2RzW2ldID0gMDtcbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLmluc3RhbnRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSA9IDA7XG4gICAgICAgIHRoaXMuX21vZGVsUmVzdWx0cy5zbW9vdGhlZF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzW2ldID0gMDtcblxuICAgICAgICBjb25zdCBuc3RhdGVzID0gbS5tb2RlbHNbaV0ucGFyYW1ldGVycy5zdGF0ZXM7XG5cbiAgICAgICAgY29uc3QgYWxwaGFfaCA9IG5ldyBBcnJheSgzKTtcbiAgICAgICAgZm9yIChsZXQgaj0wOyBqPDM7IGorKykge1xuICAgICAgICAgIGFscGhhX2hbal0gPSBuZXcgQXJyYXkobnN0YXRlcyk7XG4gICAgICAgICAgZm9yIChsZXQgaz0wOyBrPG5zdGF0ZXM7IGsrKykge1xuICAgICAgICAgICAgYWxwaGFfaFtqXVtrXSA9IDA7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBjb25zdCBhbHBoYSA9IG5ldyBBcnJheShuc3RhdGVzKTtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuc3RhdGVzOyBqKyspIHtcbiAgICAgICAgICBhbHBoYVtqXSA9IDA7XG4gICAgICAgIH1cblxuICAgICAgICBsZXQgbGlrZWxpaG9vZF9idWZmZXIgPSBuZXcgQXJyYXkodGhpcy5fbGlrZWxpaG9vZFdpbmRvdyk7XG4gICAgICAgIGZvciAobGV0IGogPSAwOyBqIDwgdGhpcy5fbGlrZWxpaG9vZFdpbmRvdzsgaisrKSB7XG4gICAgICAgICAgbGlrZWxpaG9vZF9idWZmZXJbal0gPSAwLjA7XG4gICAgICAgIH1cblxuICAgICAgICBjb25zdCBobW1SZXMgPSB7XG4gICAgICAgICAgaGllcmFyY2hpY2FsOiBtLmNvbmZpZ3VyYXRpb24uZGVmYXVsdF9wYXJhbWV0ZXJzLmhpZXJhcmNoaWNhbCxcbiAgICAgICAgICBpbnN0YW50X2xpa2VsaWhvb2Q6IDAsXG4gICAgICAgICAgbG9nX2xpa2VsaWhvb2Q6IDAsXG4gICAgICAgICAgLy8gZm9yIGNpcmN1bGFyIGJ1ZmZlciBpbXBsZW1lbnRhdGlvblxuICAgICAgICAgIC8vIChzZWUgaG1tVXBkYXRlUmVzdWx0cykgOlxuICAgICAgICAgIGxpa2VsaWhvb2RfYnVmZmVyOiBsaWtlbGlob29kX2J1ZmZlcixcbiAgICAgICAgICBsaWtlbGlob29kX2J1ZmZlcl9pbmRleDogMCxcbiAgICAgICAgICBwcm9ncmVzczogMCxcblxuICAgICAgICAgIGV4aXRfbGlrZWxpaG9vZDogMCxcbiAgICAgICAgICBleGl0X3JhdGlvOiAwLFxuXG4gICAgICAgICAgbGlrZWxpZXN0X3N0YXRlOiAtMSxcblxuICAgICAgICAgIC8vIGZvciBub24taGllcmFyY2hpY2FsIDpcbiAgICAgICAgICBwcmV2aW91c19hbHBoYTogYWxwaGEuc2xpY2UoMCksXG4gICAgICAgICAgYWxwaGE6IGFscGhhLFxuICAgICAgICAgIC8vIGZvciBoaWVyYXJjaGljYWwgOiAgICAgICBcbiAgICAgICAgICBhbHBoYV9oOiBhbHBoYV9oLFxuICAgICAgICAgIHByaW9yOiBuZXcgQXJyYXkobnN0YXRlcyksXG4gICAgICAgICAgdHJhbnNpdGlvbjogbmV3IEFycmF5KG5zdGF0ZXMpLFxuXG4gICAgICAgICAgLy8gdXNlZCBpbiBobW1VcGRhdGVBbHBoYVdpbmRvd1xuICAgICAgICAgIHdpbmRvd19taW5pbmRleDogMCxcbiAgICAgICAgICB3aW5kb3dfbWF4aW5kZXg6IDAsXG4gICAgICAgICAgd2luZG93X25vcm1hbGl6YXRpb25fY29uc3RhbnQ6IDAsXG5cbiAgICAgICAgICAvLyBmb3Igbm9uLWhpZXJhcmNoaWNhbCBtb2RlXG4gICAgICAgICAgZm9yd2FyZF9pbml0aWFsaXplZDogZmFsc2UsXG4gICAgICAgICAgXG4gICAgICAgICAgc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHM6IFtdICAvLyBha2Egc3RhdGVzXG4gICAgICAgIH07XG5cbiAgICAgICAgaG1tUmVzLm91dHB1dF92YWx1ZXMgPSB0aGlzLl9tb2RlbFJlc3VsdHMub3V0cHV0X3ZhbHVlcy5zbGljZSgwKTtcbiAgICAgICAgaG1tUmVzLm91dHB1dF9jb3ZhcmlhbmNlID0gdGhpcy5fbW9kZWxSZXN1bHRzLm91dHB1dF9jb3ZhcmlhbmNlLnNsaWNlKDApO1xuXG4gICAgICAgIC8vIGFkZCBITU0gc3RhdGVzIChHTU1zKVxuICAgICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5zdGF0ZXM7IGorKykge1xuICAgICAgICAgIGNvbnN0IGdtbVJlcyA9IHtcbiAgICAgICAgICAgIGluc3RhbnRfbGlrZWxpaG9vZDogMCxcbiAgICAgICAgICAgIGxvZ19saWtlbGlob29kOiAwXG4gICAgICAgICAgfTtcbiAgICAgICAgICBnbW1SZXMuYmV0YSA9IG5ldyBBcnJheSh0aGlzLl9tb2RlbC5tb2RlbHNbaV0ucGFyYW1ldGVycy5nYXVzc2lhbnMpO1xuICAgICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgZ21tUmVzLmJldGEubGVuZ3RoOyBrKyspIHtcbiAgICAgICAgICAgIGdtbVJlcy5iZXRhW2tdID0gMSAvIGdtbVJlcy5iZXRhLmxlbmd0aDtcbiAgICAgICAgICB9XG4gICAgICAgICAgZ21tUmVzLm91dHB1dF92YWx1ZXMgPSBobW1SZXMub3V0cHV0X3ZhbHVlcy5zbGljZSgwKTtcbiAgICAgICAgICBnbW1SZXMub3V0cHV0X2NvdmFyaWFuY2UgPSBobW1SZXMub3V0cHV0X2NvdmFyaWFuY2Uuc2xpY2UoMCk7XG5cbiAgICAgICAgICBobW1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHMucHVzaChnbW1SZXMpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5fbW9kZWxSZXN1bHRzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzLnB1c2goaG1tUmVzKTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvKipcbiAgICogQ3VycmVudGx5IGVzdGltYXRlZCBsaWtlbGllc3QgbGFiZWwuXG4gICAqIEByZWFkb25seVxuICAgKiBAdHlwZSB7U3RyaW5nfVxuICAgKi9cbiAgZ2V0IGxpa2VsaWVzdExhYmVsKCkge1xuICAgIGlmICh0aGlzLl9tb2RlbFJlc3VsdHMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgaWYgKHRoaXMuX21vZGVsUmVzdWx0cy5saWtlbGllc3QgPiAtMSkge1xuICAgICAgICByZXR1cm4gdGhpcy5fbW9kZWwubW9kZWxzW3RoaXMuX21vZGVsUmVzdWx0cy5saWtlbGllc3RdLmxhYmVsO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gJ3Vua25vd24nO1xuICB9XG5cbiAgLyoqXG4gICAqIE51bWJlciBvZiBjbGFzc2VzIGNvbnRhaW5lZCBpbiB0aGUgbW9kZWwuXG4gICAqIEByZWFkb25seVxuICAgKiBAdHlwZSB7TnVtYmVyfVxuICAgKi9cbiAgZ2V0IG5iQ2xhc3NlcygpIHtcbiAgICBpZiAodGhpcy5fbW9kZWwgIT09IHVuZGVmaW5lZCkge1xuICAgICAgcmV0dXJuIHRoaXMuX21vZGVsLm1vZGVscy5sZW5ndGg7XG4gICAgfVxuICAgIHJldHVybiAwO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBIaG1tRGVjb2RlcjsiLCJleHBvcnQgeyBkZWZhdWx0IGFzIEdtbURlY29kZXIgfSBmcm9tICcuL2dtbS9nbW0tZGVjb2Rlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIEhobW1EZWNvZGVyIH0gZnJvbSAnLi9oaG1tL2hobW0tZGVjb2Rlcic7XG5leHBvcnQgeyBkZWZhdWx0IGFzIFBocmFzZU1ha2VyIH0gZnJvbSAnLi9waHJhc2UveG1tLXBocmFzZSc7IiwiLyoqXG4gKiBYTU0gY29tcGF0aWJsZSBwaHJhc2UgYnVpbGRlciB1dGlsaXR5IDxiciAvPlxuICogQ2xhc3MgdG8gZWFzZSB0aGUgY3JlYXRpb24gb2YgWE1NIGNvbXBhdGlibGUgZGF0YSByZWNvcmRpbmdzLCBha2EgcGhyYXNlcy4gPGJyIC8+XG4gKiBQaHJhc2VzIGFyZSB0eXBpY2FsbHkgYXJyYXlzIChmbGF0dGVuZWQgbWF0cmljZXMpIG9mIHNpemUgTiAqIE0sXG4gKiBOIGJlaW5nIHRoZSBzaXplIG9mIGEgdmVjdG9yIGVsZW1lbnQsIGFuZCBNIHRoZSBsZW5ndGggb2YgdGhlIHBocmFzZSBpdHNlbGYsXG4gKiB3cmFwcGVkIHRvZ2V0aGVyIGluIGFuIG9iamVjdCB3aXRoIGEgZmV3IHNldHRpbmdzLlxuICogQGNsYXNzXG4gKi9cblxuY2xhc3MgUGhyYXNlTWFrZXIge1xuXHQvKipcblx0ICogWE1NIHBocmFzZSBjb25maWd1cmF0aW9uIG9iamVjdC5cblx0ICogQHR5cGVkZWYgWG1tUGhyYXNlQ29uZmlnXG5cdCAqIEB0eXBlIHtPYmplY3R9XG5cdCAqIEBuYW1lIFhtbVBocmFzZUNvbmZpZ1xuXHQgKiBAcHJvcGVydHkge0Jvb2xlYW59IGJpbW9kYWwgLSBJbmRpY2F0ZXMgd2V0aGVyIHBocmFzZSBkYXRhIHNob3VsZCBiZSBjb25zaWRlcmVkIGJpbW9kYWwuXG5cdCAqIElmIHRydWUsIHRoZSA8Y29kZT5kaW1lbnNpb25faW5wdXQ8L2NvZGU+IHByb3BlcnR5IHdpbGwgYmUgdGFrZW4gaW50byBhY2NvdW50LlxuXHQgKiBAcHJvcGVydHkge051bWJlcn0gZGltZW5zaW9uIC0gU2l6ZSBvZiBhIHBocmFzZSdzIHZlY3RvciBlbGVtZW50LlxuXHQgKiBAcHJvcGVydHkge051bWJlcn0gZGltZW5zaW9uX2lucHV0IC0gU2l6ZSBvZiB0aGUgcGFydCBvZiBhbiBpbnB1dCB2ZWN0b3IgZWxlbWVudCB0aGF0IHNob3VsZCBiZSB1c2VkIGZvciB0cmFpbmluZy5cblx0ICogVGhpcyBpbXBsaWVzIHRoYXQgdGhlIHJlc3Qgb2YgdGhlIHZlY3RvciAob2Ygc2l6ZSA8Y29kZT5kaW1lbnNpb24gLSBkaW1lbnNpb25faW5wdXQ8L2NvZGU+KVxuXHQgKiB3aWxsIGJlIHVzZWQgZm9yIHJlZ3Jlc3Npb24uIE9ubHkgdGFrZW4gaW50byBhY2NvdW50IGlmIDxjb2RlPmJpbW9kYWw8L2NvZGU+IGlzIHRydWUuXG5cdCAqIEBwcm9wZXJ0eSB7QXJyYXkuU3RyaW5nfSBjb2x1bW5fbmFtZXMgLSBBcnJheSBvZiBzdHJpbmcgaWRlbnRpZmllcnMgZGVzY3JpYmluZyBlYWNoIHNjYWxhciBvZiB0aGUgcGhyYXNlJ3MgdmVjdG9yIGVsZW1lbnRzLlxuXHQgKiBUeXBpY2FsbHkgb2Ygc2l6ZSA8Y29kZT5kaW1lbnNpb248L2NvZGU+LlxuXHQgKiBAcHJvcGVydHkge1N0cmluZ30gbGFiZWwgLSBUaGUgc3RyaW5nIGlkZW50aWZpZXIgb2YgdGhlIGNsYXNzIHRoZSBwaHJhc2UgYmVsb25ncyB0by5cblx0ICovXG5cblx0LyoqXG5cdCAqIEBwYXJhbSB7WG1tUGhyYXNlQ29uZmlnfSBvcHRpb25zIC0gRGVmYXVsdCBwaHJhc2UgY29uZmlndXJhdGlvbi5cblx0ICogQHNlZSB7QGxpbmsgY29uZmlnfS5cblx0ICovXG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdFx0Ymltb2RhbDogZmFsc2UsXG5cdFx0XHRkaW1lbnNpb246IDEsXG5cdFx0XHRkaW1lbnNpb25faW5wdXQ6IDAsXG5cdFx0XHRjb2x1bW5fbmFtZXM6IFsnJ10sXG5cdFx0XHRsYWJlbDogJydcblx0XHR9XG5cdFx0T2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG5cdFx0dGhpcy5fY29uZmlnID0ge307XG5cdFx0dGhpcy5fc2V0Q29uZmlnKG9wdGlvbnMpO1xuXG5cdFx0dGhpcy5yZXNldCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFhNTSBwaHJhc2UgY29uZmlndXJhdGlvbiBvYmplY3QuXG5cdCAqIE9ubHkgbGVnYWwgZmllbGRzIHdpbGwgYmUgY2hlY2tlZCBiZWZvcmUgYmVpbmcgYWRkZWQgdG8gdGhlIGNvbmZpZywgb3RoZXJzIHdpbGwgYmUgaWdub3JlZFxuXHQgKiBAdHlwZSB7WG1tUGhyYXNlQ29uZmlnfVxuXHQgKi9cblx0Z2V0IGNvbmZpZygpIHtcblx0XHRyZXR1cm4gdGhpcy5fY29uZmlnO1xuXHR9XG5cblx0c2V0IGNvbmZpZyhvcHRpb25zID0ge30pIHtcblx0XHR0aGlzLl9zZXRDb25maWcob3B0aW9ucyk7XG5cdH1cblxuXHQvKipcblx0ICogQSB2YWxpZCBYTU0gcGhyYXNlLCByZWFkeSB0byBiZSBwcm9jZXNzZWQgYnkgdGhlIFhNTSBsaWJyYXJ5LlxuXHQgKiBAdHlwZWRlZiBYbW1QaHJhc2Vcblx0ICogQHR5cGUge09iamVjdH1cblx0ICogQG5hbWUgWG1tUGhyYXNlXG5cdCAqIEBwcm9wZXJ0eSB7Qm9vbGVhbn0gYmltb2RhbCAtIEluZGljYXRlcyB3ZXRoZXIgcGhyYXNlIGRhdGEgc2hvdWxkIGJlIGNvbnNpZGVyZWQgYmltb2RhbC5cblx0ICogSWYgdHJ1ZSwgdGhlIDxjb2RlPmRpbWVuc2lvbl9pbnB1dDwvY29kZT4gcHJvcGVydHkgd2lsbCBiZSB0YWtlbiBpbnRvIGFjY291bnQuXG5cdCAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBkaW1lbnNpb24gLSBTaXplIG9mIGEgcGhyYXNlJ3MgdmVjdG9yIGVsZW1lbnQuXG5cdCAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBkaW1lbnNpb25faW5wdXQgLSBTaXplIG9mIHRoZSBwYXJ0IG9mIGFuIGlucHV0IHZlY3RvciBlbGVtZW50IHRoYXQgc2hvdWxkIGJlIHVzZWQgZm9yIHRyYWluaW5nLlxuXHQgKiBUaGlzIGltcGxpZXMgdGhhdCB0aGUgcmVzdCBvZiB0aGUgdmVjdG9yIChvZiBzaXplIDxjb2RlPmRpbWVuc2lvbiAtIGRpbWVuc2lvbl9pbnB1dDwvY29kZT4pXG5cdCAqIHdpbGwgYmUgdXNlZCBmb3IgcmVncmVzc2lvbi4gT25seSB0YWtlbiBpbnRvIGFjY291bnQgaWYgPGNvZGU+Ymltb2RhbDwvY29kZT4gaXMgdHJ1ZS5cblx0ICogQHByb3BlcnR5IHtBcnJheS5TdHJpbmd9IGNvbHVtbl9uYW1lcyAtIEFycmF5IG9mIHN0cmluZyBpZGVudGlmaWVycyBkZXNjcmliaW5nIGVhY2ggc2NhbGFyIG9mIHRoZSBwaHJhc2UncyB2ZWN0b3IgZWxlbWVudHMuXG5cdCAqIFR5cGljYWxseSBvZiBzaXplIDxjb2RlPmRpbWVuc2lvbjwvY29kZT4uXG5cdCAqIEBwcm9wZXJ0eSB7U3RyaW5nfSBsYWJlbCAtIFRoZSBzdHJpbmcgaWRlbnRpZmllciBvZiB0aGUgY2xhc3MgdGhlIHBocmFzZSBiZWxvbmdzIHRvLlxuXHQgKiBAcHJvcGVydHkge0FycmF5Lk51bWJlcn0gZGF0YSAtIFRoZSBwaHJhc2UncyBkYXRhLCBjb250YWluaW5nIGFsbCB0aGUgdmVjdG9ycyBmbGF0dGVuZWQgaW50byBhIHNpbmdsZSBvbmUuXG5cdCAqIE9ubHkgdGFrZW4gaW50byBhY2NvdW50IGlmIDxjb2RlPmJpbW9kYWw8L2NvZGU+IGlzIGZhbHNlLlxuXHQgKiBAcHJvcGVydHkge0FycmF5Lk51bWJlcn0gZGF0YV9pbnB1dCAtIFRoZSBwaHJhc2UncyBkYXRhIHdoaWNoIHdpbGwgYmUgdXNlZCBmb3IgdHJhaW5pbmcsIGZsYXR0ZW5lZCBpbnRvIGEgc2luZ2xlIHZlY3Rvci5cblx0ICogT25seSB0YWtlbiBpbnRvIGFjY291bnQgaWYgPGNvZGU+Ymltb2RhbDwvY29kZT4gaXMgdHJ1ZS5cblx0ICogQHByb3BlcnR5IHtBcnJheS5OdW1iZXJ9IGRhdGFfb3V0cHV0IC0gVGhlIHBocmFzZSdzIGRhdGEgd2hpY2ggd2lsbCBiZSB1c2VkIGZvciByZWdyZXNzaW9uLCBmbGF0dGVuZWQgaW50byBhIHNpbmdsZSB2ZWN0b3IuXG5cdCAqIE9ubHkgdGFrZW4gaW50byBhY2NvdW50IGlmIDxjb2RlPmJpbW9kYWw8L2NvZGU+IGlzIHRydWUuXG5cdCAqIEBwcm9wZXJ0eSB7TnVtYmVyfSBsZW5ndGggLSBUaGUgbGVuZ3RoIG9mIHRoZSBwaHJhc2UsIGUuZy4gb25lIG9mIHRoZSBmb2xsb3dpbmcgOlxuXHQgKiA8bGkgc3R5bGU9XCJsaXN0LXN0eWxlLXR5cGU6IG5vbmU7XCI+XG5cdCAqIDx1bD48Y29kZT5kYXRhLmxlbmd0aCAvIGRpbWVuc2lvbjwvY29kZT48L3VsPlxuXHQgKiA8dWw+PGNvZGU+ZGF0YV9pbnB1dC5sZW5ndGggLyBkaW1lbnNpb25faW5wdXQ8L2NvZGU+PC91bD5cblx0ICogPHVsPjxjb2RlPmRhdGFfb3V0cHV0Lmxlbmd0aCAvIGRpbWVuc2lvbl9vdXRwdXQ8L2NvZGU+PC91bD5cblx0ICogPC9saT5cblx0ICovXG5cblx0LyoqXG5cdCAqIEEgdmFsaWQgWE1NIHBocmFzZSwgcmVhZHkgdG8gYmUgcHJvY2Vzc2VkIGJ5IHRoZSBYTU0gbGlicmFyeS5cblx0ICogQHJlYWRvbmx5XG5cdCAqIEB0eXBlIHtYbW1QaHJhc2V9XG5cdCAqL1xuXHRnZXQgcGhyYXNlKCkge1xuXHRcdHJldHVybiB7XG5cdFx0XHRiaW1vZGFsOiB0aGlzLl9jb25maWcuYmltb2RhbCxcblx0XHRcdGNvbHVtbl9uYW1lczogdGhpcy5fY29uZmlnLmNvbHVtbl9uYW1lcyxcblx0XHRcdGRpbWVuc2lvbjogdGhpcy5fY29uZmlnLmRpbWVuc2lvbixcblx0XHRcdGRpbWVuc2lvbl9pbnB1dDogdGhpcy5fY29uZmlnLmRpbWVuc2lvbl9pbnB1dCxcblx0XHRcdGxhYmVsOiB0aGlzLl9jb25maWcubGFiZWwsXG5cdFx0XHRkYXRhOiB0aGlzLl9kYXRhLnNsaWNlKDApLFxuXHRcdFx0ZGF0YV9pbnB1dDogdGhpcy5fZGF0YV9pbi5zbGljZSgwKSxcblx0XHRcdGRhdGFfb3V0cHV0OiB0aGlzLl9kYXRhX291dC5zbGljZSgwKSxcblx0XHRcdGxlbmd0aDogdGhpcy5fY29uZmlnLmJpbW9kYWxcblx0XHRcdFx0XHRcdD9cdHRoaXMuX2RhdGFfaW4ubGVuZ3RoIC8gdGhpcy5fY29uZmlnLmRpbWVuc2lvbl9pbnB1dFxuXHRcdFx0XHRcdFx0OiB0aGlzLl9kYXRhLmxlbmd0aCAvIHRoaXMuX2NvbmZpZy5kaW1lbnNpb25cblx0XHR9O1xuXHR9XG5cblx0LyoqXG5cdCAqIEFwcGVuZCBhbiBvYnNlcnZhdGlvbiB2ZWN0b3IgdG8gdGhlIHBocmFzZSdzIGRhdGEuIE11c3QgYmUgb2YgbGVuZ3RoIDxjb2RlPmRpbWVuc2lvbjwvY29kZT4uXG5cdCAqIEBwYXJhbSB7QXJyYXkuTnVtYmVyfSBvYnMgLSBBbiBpbnB1dCB2ZWN0b3IsIGFrYSBvYnNlcnZhdGlvbi4gSWYgPGNvZGU+Ymltb2RhbDwvY29kZT4gaXMgdHJ1ZVxuXHQgKiBAdGhyb3dzIFdpbGwgdGhyb3cgYW4gZXJyb3IgaWYgdGhlIGlucHV0IHZlY3RvciBkb2Vzbid0IG1hdGNoIHRoZSBjb25maWcuXG5cdCAqL1xuXHRhZGRPYnNlcnZhdGlvbihvYnMpIHtcblx0XHRpZiAob2JzLmxlbmd0aCAhPT0gdGhpcy5fY29uZmlnLmRpbWVuc2lvbiB8fFxuXHRcdFx0XHQodHlwZW9mKG9icykgPT09ICdudW1iZXInICYmIHRoaXMuX2NvbmZpZy5kaW1lbnNpb24gIT09IDEpKSB7XG5cdFx0XHRjb25zb2xlLmVycm9yKFxuXHRcdFx0XHQnZXJyb3IgOiBpbmNvbWluZyBvYnNlcnZhdGlvbiBsZW5ndGggbm90IG1hdGNoaW5nIHdpdGggZGltZW5zaW9ucydcblx0XHRcdCk7XG5cdFx0XHR0aHJvdyAnQmFkVmVjdG9yU2l6ZUV4Y2VwdGlvbic7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0aWYgKHRoaXMuX2NvbmZpZy5iaW1vZGFsKSB7XG5cdFx0XHR0aGlzLl9kYXRhX2luID0gdGhpcy5fZGF0YV9pbi5jb25jYXQoXG5cdFx0XHRcdG9icy5zbGljZSgwLCB0aGlzLl9jb25maWcuZGltZW5zaW9uX2lucHV0KVxuXHRcdFx0KTtcblx0XHRcdHRoaXMuX2RhdGFfb3V0ID0gdGhpcy5fZGF0YV9vdXQuY29uY2F0KFxuXHRcdFx0XHRvYnMuc2xpY2UodGhpcy5fY29uZmlnLmRpbWVuc2lvbl9pbnB1dClcblx0XHRcdCk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdGlmIChBcnJheS5pc0FycmF5KG9icykpIHtcblx0XHRcdFx0dGhpcy5fZGF0YSA9IHRoaXMuX2RhdGEuY29uY2F0KG9icyk7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHR0aGlzLl9kYXRhLnB1c2gob2JzKTtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogQ2xlYXIgdGhlIHBocmFzZSdzIGRhdGEgc28gdGhhdCBhIG5ldyBvbmUgaXMgcmVhZHkgdG8gYmUgcmVjb3JkZWQuXG5cdCAqL1xuXHRyZXNldCgpIHtcblx0XHR0aGlzLl9kYXRhID0gW107XG5cdFx0dGhpcy5fZGF0YV9pbiA9IFtdO1xuXHRcdHRoaXMuX2RhdGFfb3V0ID0gW107XG5cdH1cblxuXHQvKiogQHByaXZhdGUgKi9cblx0X3NldENvbmZpZyhvcHRpb25zID0ge30pIHtcblx0XHRmb3IgKGxldCBwcm9wIGluIG9wdGlvbnMpIHtcblx0XHRcdGlmIChwcm9wID09PSAnYmltb2RhbCcgJiYgdHlwZW9mKG9wdGlvbnNbcHJvcF0pID09PSAnYm9vbGVhbicpIHtcblx0XHRcdFx0dGhpcy5fY29uZmlnW3Byb3BdID0gb3B0aW9uc1twcm9wXTtcblx0XHRcdH0gZWxzZSBpZiAocHJvcCA9PT0gJ2RpbWVuc2lvbicgJiYgTnVtYmVyLmlzSW50ZWdlcihvcHRpb25zW3Byb3BdKSkge1xuXHRcdFx0XHR0aGlzLl9jb25maWdbcHJvcF0gPSBvcHRpb25zW3Byb3BdO1xuXHRcdFx0fSBlbHNlIGlmIChwcm9wID09PSAnZGltZW5zaW9uX2lucHV0JyAmJiBOdW1iZXIuaXNJbnRlZ2VyKG9wdGlvbnNbcHJvcF0pKSB7XG5cdFx0XHRcdHRoaXMuX2NvbmZpZ1twcm9wXSA9IG9wdGlvbnNbcHJvcF07XG5cdFx0XHR9IGVsc2UgaWYgKHByb3AgPT09ICdjb2x1bW5fbmFtZXMnICYmIEFycmF5LmlzQXJyYXkob3B0aW9uc1twcm9wXSkpIHtcblx0XHRcdFx0dGhpcy5fY29uZmlnW3Byb3BdID0gb3B0aW9uc1twcm9wXS5zbGljZSgwKTtcblx0XHRcdH0gZWxzZSBpZiAocHJvcCA9PT0gJ2xhYmVsJyAmJiB0eXBlb2Yob3B0aW9uc1twcm9wXSkgPT09ICdzdHJpbmcnKSB7XG5cdFx0XHRcdHRoaXMuX2NvbmZpZ1twcm9wXSA9IG9wdGlvbnNbcHJvcF07XG5cdFx0XHR9XG5cdFx0fVx0XHRcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgUGhyYXNlTWFrZXI7IiwiLyoqXG4gKiAgZnVuY3Rpb25zIHVzZWQgZm9yIGRlY29kaW5nLCB0cmFuc2xhdGVkIGZyb20gWE1NXG4gKi9cblxuLy8gVE9ETyA6IHdyaXRlIG1ldGhvZHMgZm9yIGdlbmVyYXRpbmcgbW9kZWxSZXN1bHRzIG9iamVjdFxuXG4vLyBnZXQgdGhlIGludmVyc2VfY292YXJpYW5jZXMgbWF0cml4IG9mIGVhY2ggb2YgdGhlIEdNTSBjbGFzc2VzXG4vLyBmb3IgZWFjaCBpbnB1dCBkYXRhLCBjb21wdXRlIHRoZSBkaXN0YW5jZSBvZiB0aGUgZnJhbWUgdG8gZWFjaCBvZiB0aGUgR01Nc1xuLy8gd2l0aCB0aGUgZm9sbG93aW5nIGVxdWF0aW9ucyA6XG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLy8gYXMgaW4geG1tR2F1c3NpYW5EaXN0cmlidXRpb24uY3BwIC8vXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuXG4vLyBmcm9tIHhtbUdhdXNzaWFuRGlzdHJpYnV0aW9uOjpyZWdyZXNzaW9uXG5leHBvcnQgY29uc3QgZ21tQ29tcG9uZW50UmVncmVzc2lvbiA9IChvYnNJbiwgcHJlZGljdE91dCwgYykgPT4ge1xuLy8gZXhwb3J0IGNvbnN0IGdtbUNvbXBvbmVudFJlZ3Jlc3Npb24gPSAob2JzSW4sIHByZWRpY3RPdXQsIGNvbXBvbmVudCkgPT4ge1xuLy8gICBjb25zdCBjID0gY29tcG9uZW50O1xuICBjb25zdCBkaW0gPSBjLmRpbWVuc2lvbjtcbiAgY29uc3QgZGltSW4gPSBjLmRpbWVuc2lvbl9pbnB1dDtcbiAgY29uc3QgZGltT3V0ID0gZGltIC0gZGltSW47XG4gIC8vbGV0IHByZWRpY3RlZE91dCA9IFtdO1xuICBwcmVkaWN0T3V0ID0gbmV3IEFycmF5KGRpbU91dCk7XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gIGlmIChjLmNvdmFyaWFuY2VfbW9kZSA9PT0gMCkge1xuICAgIGZvciAobGV0IGQgPSAwOyBkIDwgZGltT3V0OyBkKyspIHtcbiAgICAgIHByZWRpY3RPdXRbZF0gPSBjLm1lYW5bZGltSW4gKyBkXTtcbiAgICAgIGZvciAobGV0IGUgPSAwOyBlIDwgZGltSW47IGUrKykge1xuICAgICAgICBsZXQgdG1wID0gMC4wO1xuICAgICAgICBmb3IgKGxldCBmID0gMDsgZiA8IGRpbUluOyBmKyspIHtcbiAgICAgICAgICB0bXAgKz0gYy5pbnZlcnNlX2NvdmFyaWFuY2VfaW5wdXRbZSAqIGRpbUluICsgZl0gKlxuICAgICAgICAgICAgICAgKG9ic0luW2ZdIC0gYy5tZWFuW2ZdKTtcbiAgICAgICAgfVxuICAgICAgICBwcmVkaWN0T3V0W2RdICs9IGMuY292YXJpYW5jZVsoZCArIGRpbUluKSAqIGRpbSArIGVdICogdG1wO1xuICAgICAgfVxuICAgIH1cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgZCA9IDA7IGQgPCBkaW1PdXQ7IGQrKykge1xuICAgICAgcHJlZGljdE91dFtkXSA9IGMuY292YXJpYW5jZVtkICsgZGltSW5dO1xuICAgIH1cbiAgfVxuICAvL3JldHVybiBwcmVkaWN0aW9uT3V0O1xufTtcblxuXG5leHBvcnQgY29uc3QgZ21tQ29tcG9uZW50TGlrZWxpaG9vZCA9IChvYnNJbiwgYykgPT4ge1xuLy8gZXhwb3J0IGNvbnN0IGdtbUNvbXBvbmVudExpa2VsaWhvb2QgPSAob2JzSW4sIGNvbXBvbmVudCkgPT4ge1xuLy8gICBjb25zdCBjID0gY29tcG9uZW50O1xuICAvLyBpZihjLmNvdmFyaWFuY2VfZGV0ZXJtaW5hbnQgPT09IDApIHtcbiAgLy8gIHJldHVybiB1bmRlZmluZWQ7XG4gIC8vIH1cbiAgbGV0IGV1Y2xpZGlhbkRpc3RhbmNlID0gMC4wO1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICBpZiAoYy5jb3ZhcmlhbmNlX21vZGUgPT09IDApIHtcbiAgICBmb3IgKGxldCBsID0gMDsgbCA8IGMuZGltZW5zaW9uOyBsKyspIHtcbiAgICAgIGxldCB0bXAgPSAwLjA7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IGMuZGltZW5zaW9uOyBrKyspIHtcbiAgICAgICAgdG1wICs9IGMuaW52ZXJzZV9jb3ZhcmlhbmNlW2wgKiBjLmRpbWVuc2lvbiArIGtdXG4gICAgICAgICAgKiAob2JzSW5ba10gLSBjLm1lYW5ba10pO1xuICAgICAgfVxuICAgICAgZXVjbGlkaWFuRGlzdGFuY2UgKz0gKG9ic0luW2xdIC0gYy5tZWFuW2xdKSAqIHRtcDtcbiAgICB9XG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFnb25hbFxuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGwgPSAwOyBsIDwgYy5kaW1lbnNpb247IGwrKykge1xuICAgICAgZXVjbGlkaWFuRGlzdGFuY2UgKz0gYy5pbnZlcnNlX2NvdmFyaWFuY2VbbF0gKlxuICAgICAgICAgICAgICAgICAob2JzSW5bbF0gLSBjLm1lYW5bbF0pICpcbiAgICAgICAgICAgICAgICAgKG9ic0luW2xdIC0gYy5tZWFuW2xdKTtcbiAgICB9XG4gIH1cblxuICBsZXQgcCA9IE1hdGguZXhwKC0wLjUgKiBldWNsaWRpYW5EaXN0YW5jZSkgL1xuICAgICAgTWF0aC5zcXJ0KFxuICAgICAgICBjLmNvdmFyaWFuY2VfZGV0ZXJtaW5hbnQgKlxuICAgICAgICBNYXRoLnBvdygyICogTWF0aC5QSSwgYy5kaW1lbnNpb24pXG4gICAgICApO1xuXG4gIGlmIChwIDwgMWUtMTgwIHx8IGlzTmFOKHApIHx8IGlzTmFOKE1hdGguYWJzKHApKSkge1xuICAgIHAgPSAxZS0xODA7XG4gIH1cbiAgcmV0dXJuIHA7XG59O1xuXG5cbmV4cG9ydCBjb25zdCBnbW1Db21wb25lbnRMaWtlbGlob29kSW5wdXQgPSAob2JzSW4sIGMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBnbW1Db21wb25lbnRMaWtlbGlob29kSW5wdXQgPSAob2JzSW4sIGNvbXBvbmVudCkgPT4ge1xuLy8gICBjb25zdCBjID0gY29tcG9uZW50O1xuICAvLyBpZihjLmNvdmFyaWFuY2VfZGV0ZXJtaW5hbnQgPT09IDApIHtcbiAgLy8gIHJldHVybiB1bmRlZmluZWQ7XG4gIC8vIH1cbiAgbGV0IGV1Y2xpZGlhbkRpc3RhbmNlID0gMC4wO1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZ1bGxcbiAgaWYgKGMuY292YXJpYW5jZV9tb2RlID09PSAwKSB7XG4gICAgZm9yIChsZXQgbCA9IDA7IGwgPCBjLmRpbWVuc2lvbl9pbnB1dDsgbCsrKSB7XG4gICAgICBsZXQgdG1wID0gMC4wO1xuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBjLmRpbWVuc2lvbl9pbnB1dDsgaysrKSB7XG4gICAgICAgIHRtcCArPSBjLmludmVyc2VfY292YXJpYW5jZV9pbnB1dFtsICogYy5kaW1lbnNpb25faW5wdXQgKyBrXSAqXG4gICAgICAgICAgICAgKG9ic0luW2tdIC0gYy5tZWFuW2tdKTtcbiAgICAgIH1cbiAgICAgIGV1Y2xpZGlhbkRpc3RhbmNlICs9IChvYnNJbltsXSAtIGMubWVhbltsXSkgKiB0bXA7XG4gICAgfVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBsID0gMDsgbCA8IGMuZGltZW5zaW9uX2lucHV0OyBsKyspIHtcbiAgICAgIC8vIG9yIHdvdWxkIGl0IGJlIGMuaW52ZXJzZV9jb3ZhcmlhbmNlX2lucHV0W2xdID9cbiAgICAgIC8vIHNvdW5kcyBsb2dpYyAuLi4gYnV0LCBhY2NvcmRpbmcgdG8gSnVsZXMgKGNmIGUtbWFpbCksXG4gICAgICAvLyBub3QgcmVhbGx5IGltcG9ydGFudC5cbiAgICAgIGV1Y2xpZGlhbkRpc3RhbmNlICs9IGMuaW52ZXJzZV9jb3ZhcmlhbmNlX2lucHV0W2xdICpcbiAgICAgICAgICAgICAgICAgKG9ic0luW2xdIC0gYy5tZWFuW2xdKSAqXG4gICAgICAgICAgICAgICAgIChvYnNJbltsXSAtIGMubWVhbltsXSk7XG4gICAgfVxuICB9XG5cbiAgbGV0IHAgPSBNYXRoLmV4cCgtMC41ICogZXVjbGlkaWFuRGlzdGFuY2UpIC9cbiAgICAgIE1hdGguc3FydChcbiAgICAgICAgYy5jb3ZhcmlhbmNlX2RldGVybWluYW50X2lucHV0ICpcbiAgICAgICAgTWF0aC5wb3coMiAqIE1hdGguUEksIGMuZGltZW5zaW9uX2lucHV0KVxuICAgICAgKTtcblxuICBpZiAocCA8IDFlLTE4MCB8fGlzTmFOKHApIHx8IGlzTmFOKE1hdGguYWJzKHApKSkge1xuICAgIHAgPSAxZS0xODA7XG4gIH1cbiAgcmV0dXJuIHA7XG59O1xuXG5cbmV4cG9ydCBjb25zdCBnbW1Db21wb25lbnRMaWtlbGlob29kQmltb2RhbCA9IChvYnNJbiwgb2JzT3V0LCBjKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgZ21tQ29tcG9uZW50TGlrZWxpaG9vZEJpbW9kYWwgPSAob2JzSW4sIG9ic091dCwgY29tcG9uZW50KSA9PiB7XG4vLyAgIGNvbnN0IGMgPSBjb21wb25lbnQ7XG4gIC8vIGlmKGMuY292YXJpYW5jZV9kZXRlcm1pbmFudCA9PT0gMCkge1xuICAvLyAgcmV0dXJuIHVuZGVmaW5lZDtcbiAgLy8gfVxuICBjb25zdCBkaW0gPSBjLmRpbWVuc2lvbjtcbiAgY29uc3QgZGltSW4gPSBjLmRpbWVuc2lvbl9pbnB1dDtcbiAgY29uc3QgZGltT3V0ID0gZGltIC0gZGltSW47XG4gIGxldCBldWNsaWRpYW5EaXN0YW5jZSA9IDAuMDtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZ1bGxcbiAgaWYgKGMuY292YXJpYW5jZV9tb2RlID09PSAwKSB7XG4gICAgZm9yIChsZXQgbCA9IDA7IGwgPCBkaW07IGwrKykge1xuICAgICAgbGV0IHRtcCA9IDAuMDtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgYy5kaW1lbnNpb25faW5wdXQ7IGsrKykge1xuICAgICAgICB0bXAgKz0gYy5pbnZlcnNlX2NvdmFyaWFuY2VbbCAqIGRpbSArIGtdICpcbiAgICAgICAgICAgICAob2JzSW5ba10gLSBjLm1lYW5ba10pO1xuICAgICAgfVxuICAgICAgZm9yIChsZXQgayA9ICAwOyBrIDwgZGltT3V0OyBrKyspIHtcbiAgICAgICAgdG1wICs9IGMuaW52ZXJzZV9jb3ZhcmlhbmNlW2wgKiBkaW0gKyBkaW1JbiArIGtdICpcbiAgICAgICAgICAgICAob2JzT3V0W2tdIC0gYy5tZWFuW2RpbUluICtrXSk7XG4gICAgICB9XG4gICAgICBpZiAobCA8IGRpbUluKSB7XG4gICAgICAgIGV1Y2xpZGlhbkRpc3RhbmNlICs9IChvYnNJbltsXSAtIGMubWVhbltsXSkgKiB0bXA7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBldWNsaWRpYW5EaXN0YW5jZSArPSAob2JzT3V0W2wgLSBkaW1Jbl0gLSBjLm1lYW5bbF0pICpcbiAgICAgICAgICAgICAgICAgICB0bXA7XG4gICAgICB9XG4gICAgfVxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBsID0gMDsgbCA8IGRpbUluOyBsKyspIHtcbiAgICAgIGV1Y2xpZGlhbkRpc3RhbmNlICs9IGMuaW52ZXJzZV9jb3ZhcmlhbmNlW2xdICpcbiAgICAgICAgICAgICAgICAgKG9ic0luW2xdIC0gYy5tZWFuW2xdKSAqXG4gICAgICAgICAgICAgICAgIChvYnNJbltsXSAtIGMubWVhbltsXSk7XG4gICAgfVxuICAgIGZvciAobGV0IGwgPSBjLmRpbWVuc2lvbl9pbnB1dDsgbCA8IGMuZGltZW5zaW9uOyBsKyspIHtcbiAgICAgIGxldCBzcSA9IChvYnNPdXRbbCAtIGRpbUluXSAtIGMubWVhbltsXSkgKlxuICAgICAgICAgICAob2JzT3V0W2wgLSBkaW1Jbl0gLSBjLm1lYW5bbF0pO1xuICAgICAgZXVjbGlkaWFuRGlzdGFuY2UgKz0gYy5pbnZlcnNlX2NvdmFyaWFuY2VbbF0gKiBzcTtcbiAgICB9XG4gIH1cblxuICBsZXQgcCA9IE1hdGguZXhwKC0wLjUgKiBldWNsaWRpYW5EaXN0YW5jZSkgL1xuICAgICAgTWF0aC5zcXJ0KFxuICAgICAgICBjLmNvdmFyaWFuY2VfZGV0ZXJtaW5hbnQgKlxuICAgICAgICBNYXRoLnBvdygyICogTWF0aC5QSSwgYy5kaW1lbnNpb24pXG4gICAgICApO1xuXG4gIGlmIChwIDwgMWUtMTgwIHx8IGlzTmFOKHApIHx8IGlzTmFOKE1hdGguYWJzKHApKSkge1xuICAgIHAgPSAxZS0xODA7XG4gIH1cbiAgcmV0dXJuIHA7XG59O1xuXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLy8gICAgYXMgaW4geG1tR21tU2luZ2xlQ2xhc3MuY3BwICAgIC8vXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZXhwb3J0IGNvbnN0IGdtbVJlZ3Jlc3Npb24gPSAob2JzSW4sIG0sIG1SZXMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBnbW1SZWdyZXNzaW9uID0gKG9ic0luLCBzaW5nbGVHbW0sIHNpbmdsZUdtbVJlcykgPT4ge1xuLy8gICBjb25zdCBtID0gc2luZ2xlR21tO1xuLy8gICBjb25zdCBtUmVzID0gc2luZ2xlR21tUmVzdWx0cztcblxuICBjb25zdCBkaW0gPSBtLmNvbXBvbmVudHNbMF0uZGltZW5zaW9uO1xuICBjb25zdCBkaW1JbiA9IG0uY29tcG9uZW50c1swXS5kaW1lbnNpb25faW5wdXQ7XG4gIGNvbnN0IGRpbU91dCA9IGRpbSAtIGRpbUluO1xuXG4gIG1SZXMub3V0cHV0X3ZhbHVlcyA9IG5ldyBBcnJheShkaW1PdXQpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IGRpbU91dDsgaSsrKSB7XG4gICAgbVJlcy5vdXRwdXRfdmFsdWVzW2ldID0gMC4wO1xuICB9XG5cbiAgbGV0IG91dENvdmFyU2l6ZTtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gIGlmIChtLnBhcmFtZXRlcnMuY292YXJpYW5jZV9tb2RlID09PSAwKSB7XG4gICAgb3V0Q292YXJTaXplID0gZGltT3V0ICogZGltT3V0O1xuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgfSBlbHNlIHtcbiAgICBvdXRDb3ZhclNpemUgPSBkaW1PdXQ7XG4gIH1cbiAgbVJlcy5vdXRwdXRfY292YXJpYW5jZSA9IG5ldyBBcnJheShvdXRDb3ZhclNpemUpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENvdmFyU2l6ZTsgaSsrKSB7XG4gICAgbVJlcy5vdXRwdXRfY292YXJpYW5jZVtpXSA9IDAuMDtcbiAgfVxuXG4gIC8qXG4gIC8vIHVzZWxlc3MgOiByZWluc3RhbmNpYXRlZCBpbiBnbW1Db21wb25lbnRSZWdyZXNzaW9uXG4gIGxldCB0bXBQcmVkaWN0ZWRPdXRwdXQgPSBuZXcgQXJyYXkoZGltT3V0KTtcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1PdXQ7IGkrKykge1xuICAgIHRtcFByZWRpY3RlZE91dHB1dFtpXSA9IDAuMDtcbiAgfVxuICAqL1xuICBsZXQgdG1wUHJlZGljdGVkT3V0cHV0O1xuXG4gIGZvciAobGV0IGMgPSAwOyBjIDwgbS5jb21wb25lbnRzLmxlbmd0aDsgYysrKSB7XG4gICAgZ21tQ29tcG9uZW50UmVncmVzc2lvbihcbiAgICAgIG9ic0luLCB0bXBQcmVkaWN0ZWRPdXRwdXQsIG0uY29tcG9uZW50c1tjXVxuICAgICk7XG4gICAgbGV0IHNxYmV0YSA9IG1SZXMuYmV0YVtjXSAqIG1SZXMuYmV0YVtjXTtcbiAgICBmb3IgKGxldCBkID0gMDsgZCA8IGRpbU91dDsgZCsrKSB7XG4gICAgICBtUmVzLm91dHB1dF92YWx1ZXNbZF0gKz0gbVJlcy5iZXRhW2NdICogdG1wUHJlZGljdGVkT3V0cHV0W2RdO1xuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZ1bGxcbiAgICAgIGlmIChtLnBhcmFtZXRlcnMuY292YXJpYW5jZV9tb2RlID09PSAwKSB7XG4gICAgICAgIGZvciAobGV0IGQyID0gMDsgZDIgPCBkaW1PdXQ7IGQyKyspIHtcbiAgICAgICAgICBsZXQgaW5kZXggPSBkICogZGltT3V0ICsgZDI7XG4gICAgICAgICAgbVJlcy5vdXRwdXRfY292YXJpYW5jZVtpbmRleF1cbiAgICAgICAgICAgICs9IHNxYmV0YSAqIG0uY29tcG9uZW50c1tjXS5vdXRwdXRfY292YXJpYW5jZVtpbmRleF07XG4gICAgICAgIH1cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2RdXG4gICAgICAgICAgKz0gc3FiZXRhICogbS5jb21wb25lbnRzW2NdLm91dHB1dF9jb3ZhcmlhbmNlW2RdO1xuICAgICAgfVxuICAgIH1cbiAgfVxufTtcblxuXG5leHBvcnQgY29uc3QgZ21tT2JzUHJvYiA9IChvYnNJbiwgc2luZ2xlR21tLCBjb21wb25lbnQgPSAtMSkgPT4ge1xuICBjb25zdCBjb2VmZnMgPSBzaW5nbGVHbW0ubWl4dHVyZV9jb2VmZnM7XG4gIC8vY29uc29sZS5sb2coY29lZmZzKTtcbiAgLy9pZihjb2VmZnMgPT09IHVuZGVmaW5lZCkgY29lZmZzID0gWzFdO1xuICBjb25zdCBjb21wb25lbnRzID0gc2luZ2xlR21tLmNvbXBvbmVudHM7XG4gIGxldCBwID0gMC4wO1xuXG4gIGlmIChjb21wb25lbnQgPCAwKSB7XG4gICAgZm9yIChsZXQgYyA9IDA7IGMgPCBjb21wb25lbnRzLmxlbmd0aDsgYysrKSB7XG4gICAgICBwICs9IGdtbU9ic1Byb2Iob2JzSW4sIHNpbmdsZUdtbSwgYyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHAgPSBjb2VmZnNbY29tcG9uZW50XSAqXG4gICAgICBnbW1Db21wb25lbnRMaWtlbGlob29kKG9ic0luLCBjb21wb25lbnRzW2NvbXBvbmVudF0pOyAgICAgICBcbiAgfVxuICByZXR1cm4gcDtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGdtbU9ic1Byb2JJbnB1dCA9IChvYnNJbiwgc2luZ2xlR21tLCBjb21wb25lbnQgPSAtMSkgPT4ge1xuICBjb25zdCBjb2VmZnMgPSBzaW5nbGVHbW0ubWl4dHVyZV9jb2VmZnM7XG4gIGNvbnN0IGNvbXBvbmVudHMgPSBzaW5nbGVHbW0uY29tcG9uZW50cztcbiAgbGV0IHAgPSAwLjA7XG5cbiAgaWYgKGNvbXBvbmVudCA8IDApIHtcbiAgICBmb3IobGV0IGMgPSAwOyBjIDwgY29tcG9uZW50cy5sZW5ndGg7IGMrKykge1xuICAgICAgcCArPSBnbW1PYnNQcm9iSW5wdXQob2JzSW4sIHNpbmdsZUdtbSwgYyk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHAgPSBjb2VmZnNbY29tcG9uZW50XSAqXG4gICAgICBnbW1Db21wb25lbnRMaWtlbGlob29kSW5wdXQob2JzSW4sIGNvbXBvbmVudHNbY29tcG9uZW50XSk7ICAgICAgXG4gIH1cbiAgcmV0dXJuIHA7XG59O1xuXG5cbmV4cG9ydCBjb25zdCBnbW1PYnNQcm9iQmltb2RhbCA9IChvYnNJbiwgb2JzT3V0LCBzaW5nbGVHbW0sIGNvbXBvbmVudCA9IC0xKSA9PiB7XG4gIGNvbnN0IGNvZWZmcyA9IHNpbmdsZUdtbS5taXh0dXJlX2NvZWZmcztcbiAgY29uc3QgY29tcG9uZW50cyA9IHNpbmdsZUdtbS5jb21wb25lbnRzO1xuICBsZXQgcCA9IDAuMDtcblxuICBpZiAoY29tcG9uZW50IDwgMCkge1xuICAgIGZvciAobGV0IGMgPSAwOyBjIDwgY29tcG9uZW50cy5sZW5ndGg7IGMrKykge1xuICAgICAgcCArPSBnbW1PYnNQcm9iQmltb2RhbChvYnNJbiwgb2JzT3V0LCBzaW5nbGVHbW0sIGMpO1xuICAgIH1cbiAgfSBlbHNlIHtcbiAgICBwID0gY29lZmZzW2NvbXBvbmVudF0gKlxuICAgICAgZ21tQ29tcG9uZW50TGlrZWxpaG9vZEJpbW9kYWwob2JzSW4sIG9ic091dCwgY29tcG9uZW50c1tjb21wb25lbnRdKTtcbiAgfVxuICByZXR1cm4gcDtcbn07XG5cblxuZXhwb3J0IGNvbnN0IGdtbUxpa2VsaWhvb2QgPSAob2JzSW4sIHNpbmdsZUdtbSwgc2luZ2xlR21tUmVzLCBvYnNPdXQgPSBbXSkgPT4ge1xuICBjb25zdCBjb2VmZnMgPSBzaW5nbGVHbW0ubWl4dHVyZV9jb2VmZnM7XG4gIGNvbnN0IGNvbXBvbmVudHMgPSBzaW5nbGVHbW0uY29tcG9uZW50cztcbiAgY29uc3QgbVJlcyA9IHNpbmdsZUdtbVJlcztcbiAgbGV0IGxpa2VsaWhvb2QgPSAwLjA7XG4gIFxuICBmb3IgKGxldCBjID0gMDsgYyA8IGNvbXBvbmVudHMubGVuZ3RoOyBjKyspIHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBiaW1vZGFsXG4gICAgaWYgKHNpbmdsZUNsYXNzR21tTW9kZWwuY29tcG9uZW50c1tjXS5iaW1vZGFsKSB7XG4gICAgICBpZiAob2JzT3V0Lmxlbmd0aCA9PT0gMCkge1xuICAgICAgICBtUmVzLmJldGFbY11cbiAgICAgICAgICA9IGdtbU9ic1Byb2JJbnB1dChvYnNJbiwgc2luZ2xlR21tLCBjKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1SZXMuYmV0YVtjXVxuICAgICAgICAgID0gZ21tT2JzUHJvYkJpbW9kYWwob2JzSW4sIG9ic091dCwgc2luZ2xlR21tLCBjKTtcbiAgICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHVuaW1vZGFsXG4gICAgfSBlbHNlIHtcbiAgICAgIG1SZXMuYmV0YVtjXSA9IGdtbU9ic1Byb2Iob2JzSW4sIHNpbmdsZUdtbSwgYyk7XG4gICAgfVxuICAgIGxpa2VsaWhvb2QgKz0gbVJlcy5iZXRhW2NdO1xuICB9XG4gIGZvciAobGV0IGMgPSAwOyBjIDwgY29lZmZzLmxlbmd0aDsgYysrKSB7XG4gICAgbVJlcy5iZXRhW2NdIC89IGxpa2VsaWhvb2Q7XG4gIH1cblxuICBtUmVzLmluc3RhbnRfbGlrZWxpaG9vZCA9IGxpa2VsaWhvb2Q7XG5cbiAgLy8gYXMgaW4geG1tOjpTaW5nbGVDbGFzc0dNTTo6dXBkYXRlUmVzdWx0cyA6XG4gIC8vIC0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAvL3Jlcy5saWtlbGlob29kX2J1ZmZlci51bnNoaWZ0KGxpa2VsaWhvb2QpO1xuICAvL3Jlcy5saWtlbGlob29kX2J1ZmZlci5sZW5ndGgtLTtcbiAgLy8gVEhJUyBJUyBCRVRURVIgKGNpcmN1bGFyIGJ1ZmZlcilcbiAgbVJlcy5saWtlbGlob29kX2J1ZmZlclttUmVzLmxpa2VsaWhvb2RfYnVmZmVyX2luZGV4XSA9IGxpa2VsaWhvb2Q7XG4gIG1SZXMubGlrZWxpaG9vZF9idWZmZXJfaW5kZXhcbiAgICA9IChtUmVzLmxpa2VsaWhvb2RfYnVmZmVyX2luZGV4ICsgMSkgJSBtUmVzLmxpa2VsaWhvb2RfYnVmZmVyLmxlbmd0aDtcbiAgLy8gc3VtIGFsbCBhcnJheSB2YWx1ZXMgOlxuICBtUmVzLmxvZ19saWtlbGlob29kID0gbVJlcy5saWtlbGlob29kX2J1ZmZlci5yZWR1Y2UoKGEsIGIpID0+IGEgKyBiLCAwKTtcbiAgbVJlcy5sb2dfbGlrZWxpaG9vZCAvPSBtUmVzLmxpa2VsaWhvb2RfYnVmZmVyLmxlbmd0aDtcblxuICByZXR1cm4gbGlrZWxpaG9vZDtcbn07XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vLyAgICAgICAgICBhcyBpbiB4bW1HbW0uY3BwICAgICAgICAgLy9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5leHBvcnQgY29uc3QgZ21tRmlsdGVyID0gKG9ic0luLCBnbW0sIGdtbVJlcykgPT4ge1xuICBsZXQgbGlrZWxpaG9vZHMgPSBbXTtcbiAgY29uc3QgbW9kZWxzID0gZ21tLm1vZGVscztcbiAgY29uc3QgbVJlcyA9IGdtbVJlcztcblxuICBsZXQgbWF4TG9nTGlrZWxpaG9vZCA9IDA7XG4gIGxldCBub3JtQ29uc3RJbnN0YW50ID0gMDtcbiAgbGV0IG5vcm1Db25zdFNtb290aGVkID0gMDtcblxuICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgIGxldCBzaW5nbGVSZXMgPSBtUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzW2ldO1xuICAgIG1SZXMuaW5zdGFudF9saWtlbGlob29kc1tpXVxuICAgICAgPSBnbW1MaWtlbGlob29kKG9ic0luLCBtb2RlbHNbaV0sIHNpbmdsZVJlcyk7XG5cbiAgICAvLyBhcyBpbiB4bW06OkdNTTo6dXBkYXRlUmVzdWx0cyA6XG4gICAgLy8gLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIG1SZXMuc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzW2ldID0gc2luZ2xlUmVzLmxvZ19saWtlbGlob29kO1xuICAgIG1SZXMuc21vb3RoZWRfbGlrZWxpaG9vZHNbaV1cbiAgICAgID0gTWF0aC5leHAobVJlcy5zbW9vdGhlZF9sb2dfbGlrZWxpaG9vZHNbaV0pO1xuICAgIG1SZXMuaW5zdGFudF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzW2ldID0gbVJlcy5pbnN0YW50X2xpa2VsaWhvb2RzW2ldO1xuICAgIG1SZXMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSA9IG1SZXMuc21vb3RoZWRfbGlrZWxpaG9vZHNbaV07XG5cbiAgICBub3JtQ29uc3RJbnN0YW50ICs9IG1SZXMuaW5zdGFudF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzW2ldO1xuICAgIG5vcm1Db25zdFNtb290aGVkICs9IG1SZXMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXTtcblxuICAgIGlmIChpID09IDAgfHwgbVJlcy5zbW9vdGhlZF9sb2dfbGlrZWxpaG9vZHNbaV0gPiBtYXhMb2dMaWtlbGlob29kKSB7XG4gICAgICBtYXhMb2dMaWtlbGlob29kID0gbVJlcy5zbW9vdGhlZF9sb2dfbGlrZWxpaG9vZHNbaV07XG4gICAgICBtUmVzLmxpa2VsaWVzdCA9IGk7XG4gICAgfVxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBtb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBtUmVzLmluc3RhbnRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSAvPSBub3JtQ29uc3RJbnN0YW50O1xuICAgIG1SZXMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSAvPSBub3JtQ29uc3RTbW9vdGhlZDtcbiAgfVxuXG4gIC8vIGlmIG1vZGVsIGlzIGJpbW9kYWwgOlxuICAvLyAtLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgY29uc3QgcGFyYW1zID0gZ21tLnNoYXJlZF9wYXJhbWV0ZXJzO1xuICBjb25zdCBjb25maWcgPSBnbW0uY29uZmlndXJhdGlvbjtcblxuICBpZiAocGFyYW1zLmJpbW9kYWwpIHtcbiAgICBsZXQgZGltID0gcGFyYW1zLmRpbWVuc2lvbjtcbiAgICBsZXQgZGltSW4gPSBwYXJhbXMuZGltZW5zaW9uX2lucHV0O1xuICAgIGxldCBkaW1PdXQgPSBkaW0gLSBkaW1JbjtcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBsaWtlbGllc3RcbiAgICBpZiAoY29uZmlnLm11bHRpQ2xhc3NfcmVncmVzc2lvbl9lc3RpbWF0b3IgPT09IDApIHtcbiAgICAgIG1SZXMub3V0cHV0X3ZhbHVlc1xuICAgICAgICA9IG1SZXMuc2luZ2xlQ2xhc3NNb2RlbFJlc3VsdHNbbVJlcy5saWtlbGllc3RdXG4gICAgICAgICAgICAub3V0cHV0X3ZhbHVlcztcbiAgICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2VcbiAgICAgICAgPSBtUmVzLnNpbmdsZUNsYXNzTW9kZWxSZXN1bHRzW21SZXMubGlrZWxpZXN0XVxuICAgICAgICAgICAgLm91dHB1dF9jb3ZhcmlhbmNlOyAgICAgICAgICAgXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gbWl4dHVyZVxuICAgIH0gZWxzZSB7XG4gICAgICAvLyB6ZXJvLWZpbGwgb3V0cHV0X3ZhbHVlcyBhbmQgb3V0cHV0X2NvdmFyaWFuY2VcbiAgICAgIG1SZXMub3V0cHV0X3ZhbHVlcyA9IG5ldyBBcnJheShkaW1PdXQpO1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkaW1PdXQ7IGkrKykge1xuICAgICAgICBtUmVzLm91dHB1dF92YWx1ZXNbaV0gPSAwLjA7XG4gICAgICB9XG5cbiAgICAgIGxldCBvdXRDb3ZhclNpemU7XG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICAgICAgaWYgKGNvbmZpZy5kZWZhdWx0X3BhcmFtZXRlcnMuY292YXJpYW5jZV9tb2RlID09IDApIHtcbiAgICAgICAgb3V0Q292YXJTaXplID0gZGltT3V0ICogZGltT3V0O1xuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG91dENvdmFyU2l6ZSA9IGRpbU91dDtcbiAgICAgIH1cbiAgICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2UgPSBuZXcgQXJyYXkob3V0Q292YXJTaXplKTtcbiAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgb3V0Q292YXJTaXplOyBpKyspIHtcbiAgICAgICAgbVJlcy5vdXRwdXRfY292YXJpYW5jZVtpXSA9IDAuMDtcbiAgICAgIH1cblxuICAgICAgLy8gY29tcHV0ZSB0aGUgYWN0dWFsIHZhbHVlcyA6XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICBsZXQgc21vb3RoTm9ybUxpa2VsaWhvb2RcbiAgICAgICAgICA9IG1SZXMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXTtcbiAgICAgICAgbGV0IHNpbmdsZVJlcyA9IG1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHNbaV07XG4gICAgICAgIGZvciAobGV0IGQgPSAwOyBkIDwgZGltT3V0OyBpKyspIHtcbiAgICAgICAgICBtUmVzLm91dHB1dF92YWx1ZXNbZF0gKz0gc21vb3RoTm9ybUxpa2VsaWhvb2QgKlxuICAgICAgICAgICAgICAgICAgICAgICBzaW5nbGVSZXMub3V0cHV0X3ZhbHVlc1tkXTtcbiAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gICAgICAgICAgaWYgKGNvbmZpZy5kZWZhdWx0X3BhcmFtZXRlcnMuY292YXJpYW5jZV9tb2RlID09PSAwKSB7XG4gICAgICAgICAgICBmb3IgKGxldCBkMiA9IDA7IGQyIDwgZGltT3V0OyBkMisrKSB7XG4gICAgICAgICAgICAgIGxldCBpbmRleCA9IGQgKiBkaW1PdXQgKyBkMjtcbiAgICAgICAgICAgICAgbVJlcy5vdXRwdXRfY292YXJpYW5jZVtpbmRleF1cbiAgICAgICAgICAgICAgICArPSBzbW9vdGhOb3JtTGlrZWxpaG9vZCAqXG4gICAgICAgICAgICAgICAgICAgc2luZ2xlUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2luZGV4XTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gICAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbZF1cbiAgICAgICAgICAgICAgKz0gc21vb3RoTm9ybUxpa2VsaWhvb2QgKlxuICAgICAgICAgICAgICAgICBzaW5nbGVSZXMub3V0cHV0X2NvdmFyaWFuY2VbZF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IC8qIGVuZCBpZihwYXJhbXMuYmltb2RhbCkgKi9cbn07XG4iLCJpbXBvcnQgKiBhcyBnbW1VdGlscyBmcm9tICcuL2dtbS11dGlscyc7XG5cbi8qKlxuICogIGZ1bmN0aW9ucyB1c2VkIGZvciBkZWNvZGluZywgdHJhbnNsYXRlZCBmcm9tIFhNTVxuICovXG5cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuLy8gICAgYXMgaW4geG1tSG1tU2luZ2xlQ2xhc3MuY3BwICAgIC8vXG4vLyA9PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gLy9cblxuZXhwb3J0IGNvbnN0IGhtbVJlZ3Jlc3Npb24gPSAob2JzSW4sIG0sIG1SZXMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBobW1SZWdyZXNzaW9uID0gKG9ic0luLCBobW0sIGhtbVJlcykgPT4ge1xuLy8gICBjb25zdCBtID0gaG1tO1xuLy8gICBjb25zdCBtUmVzID0gaG1tUmVzO1xuICBjb25zdCBkaW0gPSBtLnN0YXRlc1swXS5jb21wb25lbnRzWzBdLmRpbWVuc2lvbjtcbiAgY29uc3QgZGltSW4gPSBtLnN0YXRlc1swXS5jb21wb25lbnRzWzBdLmRpbWVuc2lvbl9pbnB1dDtcbiAgY29uc3QgZGltT3V0ID0gZGltIC0gZGltSW47XG5cbiAgbGV0IG91dENvdmFyU2l6ZTtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gIGlmIChtLnN0YXRlc1swXS5jb21wb25lbnRzWzBdLmNvdmFyaWFuY2VfbW9kZSA9PT0gMCkge1xuICAgIG91dENvdmFyU2l6ZSA9IGRpbU91dCAqIGRpbU91dDtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGRpYWdvbmFsXG4gIH0gZWxzZSB7XG4gICAgb3V0Q292YXJTaXplID0gZGltT3V0O1xuICB9XG5cbiAgbVJlcy5vdXRwdXRfdmFsdWVzID0gbmV3IEFycmF5KGRpbU91dCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgZGltT3V0OyBpKyspIHtcbiAgICBtUmVzLm91dHB1dF92YWx1ZXNbaV0gPSAwLjA7XG4gIH1cbiAgbVJlcy5vdXRwdXRfY292YXJpYW5jZSA9IG5ldyBBcnJheShvdXRDb3ZhclNpemUpO1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG91dENvdmFyU2l6ZTsgaSsrKSB7XG4gICAgbVJlcy5vdXRwdXRfY292YXJpYW5jZVtpXSA9IDAuMDtcbiAgfVxuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGxpa2VsaWVzdFxuICBpZiAobS5wYXJhbWV0ZXJzLnJlZ3Jlc3Npb25fZXN0aW1hdG9yID09PSAyKSB7XG4gICAgZ21tVXRpbHMuZ21tTGlrZWxpaG9vZChcbiAgICAgIG9ic0luLFxuICAgICAgbS5zdGF0ZXNbbVJlcy5saWtlbGllc3Rfc3RhdGVdLFxuICAgICAgbVJlcy5zaW5nbGVDbGFzc0dtbU1vZGVsUmVzdWx0c1ttUmVzLmxpa2VsaWVzdF9zdGF0ZV1cbiAgICApO1xuICAgIGdtbVV0aWxzLmdtbVJlZ3Jlc3Npb24oXG4gICAgICBvYnNJbixcbiAgICAgIG0uc3RhdGVzW21SZXMubGlrZWxpZXN0X3N0YXRlXSxcbiAgICAgIG1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHNbbVJlcy5saWtlbGllc3Rfc3RhdGVdXG4gICAgKTtcbiAgICBtUmVzLm91dHB1dF92YWx1ZXNcbiAgICAgID0gbS5zdGF0ZXNbbVJlcy5saWtlbGllc3Rfc3RhdGVdLm91dHB1dF92YWx1ZXMuc2xpY2UoMCk7XG4gICAgcmV0dXJuO1xuICB9XG5cbiAgY29uc3QgY2xpcE1pblN0YXRlID0gKG0ucGFyYW1ldGVycy5yZWdyZXNzaW9uX2VzdGltYXRvciA9PSAwKVxuICAgICAgICAgICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZ1bGxcbiAgICAgICAgICAgICAgICAgICAgPyAwXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB3aW5kb3dlZFxuICAgICAgICAgICAgICAgICAgICA6IG1SZXMud2luZG93X21pbmluZGV4O1xuXG4gIGNvbnN0IGNsaXBNYXhTdGF0ZSA9IChtLnBhcmFtZXRlcnMucmVncmVzc2lvbl9lc3RpbWF0b3IgPT0gMClcbiAgICAgICAgICAgICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gICAgICAgICAgICAgICAgICAgID8gbS5zdGF0ZXMubGVuZ3RoXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSB3aW5kb3dlZFxuICAgICAgICAgICAgICAgICAgICA6IG1SZXMud2luZG93X21heGluZGV4O1xuXG4gIGxldCBub3JtQ29uc3RhbnQgPSAobS5wYXJhbWV0ZXJzLnJlZ3Jlc3Npb25fZXN0aW1hdG9yID09IDApXG4gICAgICAgICAgICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICAgICAgICAgICAgICAgICAgICA/IDEuMFxuICAgICAgICAgICAgICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gd2luZG93ZWRcbiAgICAgICAgICAgICAgICAgICAgOiBtUmVzLndpbmRvd19ub3JtYWxpemF0aW9uX2NvbnN0YW50O1xuXG4gIGlmIChub3JtQ29uc3RhbnQgPD0gMC4wKSB7XG4gICAgbm9ybUNvbnN0YW50ID0gMS47XG4gIH1cblxuICBmb3IgKGxldCBpID0gY2xpcE1pblN0YXRlOyBpIDwgY2xpcE1heFN0YXRlOyBpKyspIHtcbiAgICBnbW1VdGlscy5nbW1MaWtlbGlob29kKFxuICAgICAgb2JzSW4sXG4gICAgICBtLnN0YXRlc1tpXSxcbiAgICAgIG1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHNbaV1cbiAgICApO1xuICAgIGdtbVV0aWxzLmdtbVJlZ3Jlc3Npb24oXG4gICAgICBvYnNJbixcbiAgICAgIG0uc3RhdGVzW2ldLFxuICAgICAgbVJlcy5zaW5nbGVDbGFzc0dtbU1vZGVsUmVzdWx0c1tpXVxuICAgICk7XG4gICAgY29uc3QgdG1wUHJlZGljdGVkT3V0cHV0XG4gICAgICA9IG1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHNbaV0ub3V0cHV0X3ZhbHVlcy5zbGljZSgwKTtcblxuICAgIGZvciAobGV0IGQgPSAwOyBkIDwgZGltT3V0OyBkKyspIHtcbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaGllcmFyY2hpY2FsXG4gICAgICBpZiAobVJlcy5oaWVyYXJjaGljYWwpIHtcbiAgICAgICAgbVJlcy5vdXRwdXRfdmFsdWVzW2RdXG4gICAgICAgICAgKz0gKG1SZXMuYWxwaGFfaFswXVtpXSArIG1SZXMuYWxwaGFfaFsxXVtpXSkgKlxuICAgICAgICAgICAgIHRtcFByZWRpY3RlZE91dHB1dFtkXSAvIG5vcm1Db25zdGFudDtcbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBmdWxsXG4gICAgICAgIGlmIChtLnBhcmFtZXRlcnMuY292YXJpYW5jZV9tb2RlID09PSAwKSB7XG4gICAgICAgICAgZm9yIChsZXQgZDIgPSAwOyBkMiA8IGRpbU91dDsgZDIrKykge1xuICAgICAgICAgICAgbVJlcy5vdXRwdXRfY292YXJpYW5jZVtkICogZGltT3V0ICsgZDJdXG4gICAgICAgICAgICAgICs9IChtUmVzLmFscGhhX2hbMF1baV0gKyBtUmVzLmFscGhhX2hbMV1baV0pICpcbiAgICAgICAgICAgICAgICAgKG1SZXMuYWxwaGFfaFswXVtpXSArIG1SZXMuYWxwaGFfaFsxXVtpXSkgKlxuICAgICAgICAgICAgICAgIG1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHNbaV1cbiAgICAgICAgICAgICAgICAgIC5vdXRwdXRfY292YXJpYW5jZVtkICogZGltT3V0ICsgZDJdIC9cbiAgICAgICAgICAgICAgICBub3JtQ29uc3RhbnQ7XG4gICAgICAgICAgfVxuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2RdXG4gICAgICAgICAgICArPSAobVJlcy5hbHBoYV9oWzBdW2ldICsgbVJlcy5hbHBoYV9oWzFdW2ldKSAqXG4gICAgICAgICAgICAgICAobVJlcy5hbHBoYV9oWzBdW2ldICsgbVJlcy5hbHBoYV9oWzFdW2ldKSAqXG4gICAgICAgICAgICAgIG1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHNbaV1cbiAgICAgICAgICAgICAgICAub3V0cHV0X2NvdmFyaWFuY2VbZF0gL1xuICAgICAgICAgICAgICBub3JtQ29uc3RhbnQ7XG4gICAgICAgIH1cbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBub24taGllcmFyY2hpY2FsXG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtUmVzLm91dHB1dF92YWx1ZXNbZF0gKz0gbVJlcy5hbHBoYVtpXSAqIFxuICAgICAgICAgICAgICAgICAgICAgdG1wUHJlZGljdGVkT3V0cHV0W2RdIC8gbm9ybUNvbnN0YW50O1xuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGZ1bGxcbiAgICAgICAgaWYgKG0ucGFyYW1ldGVycy5jb3ZhcmlhbmNlX21vZGUgPT09IDApIHtcbiAgICAgICAgICBmb3IgKGxldCBkMiA9IDA7IGQyIDwgZGltT3V0OyBkMisrKSB7XG4gICAgICAgICAgICBtUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2QgKiBkaW1PdXQgKyBkMl1cbiAgICAgICAgICAgICAgKz0gIG1SZXMuYWxwaGFbaV0gKiBtUmVzLmFscGhhW2ldICpcbiAgICAgICAgICAgICAgICBtUmVzLnNpbmdsZUNsYXNzR21tTW9kZWxSZXN1bHRzW2ldXG4gICAgICAgICAgICAgICAgICAub3V0cHV0X2NvdmFyaWFuY2VbZCAqIGRpbU91dCArIGQyXSAvXG4gICAgICAgICAgICAgICAgbm9ybUNvbnN0YW50O1xuICAgICAgICAgIH1cbiAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBkaWFnb25hbFxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbZF0gKz0gbVJlcy5hbHBoYVtpXSAqIG1SZXMuYWxwaGFbaV0gKlxuICAgICAgICAgICAgICAgICAgICAgICAgIG1SZXMuc2luZ2xlQ2xhc3NHbW1Nb2RlbFJlc3VsdHNcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIC5vdXRwdXRfY292YXJpYW5jZVtkXSAvXG4gICAgICAgICAgICAgICAgICAgICAgICAgbm9ybUNvbnN0YW50O1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5cbmV4cG9ydCBjb25zdCBobW1Gb3J3YXJkSW5pdCA9IChvYnNJbiwgbSwgbVJlcywgb2JzT3V0ID0gW10pID0+IHtcbi8vIGV4cG9ydCBjb25zdCBobW1Gb3J3YXJkSW5pdCA9IChvYnNJbiwgaG1tLCBobW1SZXMsIG9ic091dCA9IFtdKSA9PiB7XG4vLyAgIGNvbnN0IG0gPSBobW07XG4vLyAgIGNvbnN0IG1SZXMgPSBobW1SZXM7XG4gIGNvbnN0IG5zdGF0ZXMgPSBtLnBhcmFtZXRlcnMuc3RhdGVzO1xuICBsZXQgbm9ybUNvbnN0ID0gMC4wO1xuXG4gIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZXJnb2RpYyAgICAgICAgXG4gIGlmIChtLnBhcmFtZXRlcnMudHJhbnNpdGlvbl9tb2RlID09PSAwKSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBuc3RhdGVzOyBpKyspIHtcbiAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBiaW1vZGFsICAgICAgICBcbiAgICAgIGlmIChtLnN0YXRlc1tpXS5jb21wb25lbnRzWzBdLmJpbW9kYWwpIHtcbiAgICAgICAgaWYgKG9ic091dC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgbVJlcy5hbHBoYVtpXSA9IG0ucHJpb3JbaV0gKlxuICAgICAgICAgICAgICAgICAgZ21tVXRpbHMuZ21tT2JzUHJvYkJpbW9kYWwob2JzSW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNPdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLnN0YXRlc1tpXSk7XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgbVJlcy5hbHBoYVtpXSA9IG0ucHJpb3JbaV0gKlxuICAgICAgICAgICAgICAgICAgZ21tVXRpbHMuZ21tT2JzUHJvYklucHV0KG9ic0luLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0uc3RhdGVzW2ldKTtcbiAgICAgICAgfVxuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gdW5pbW9kYWwgICAgICAgIFxuICAgICAgfSBlbHNlIHtcbiAgICAgICAgbVJlcy5hbHBoYVtpXSA9IG0ucHJpb3JbaV0gKlxuICAgICAgICAgICAgICAgIGdtbVV0aWxzLmdtbU9ic1Byb2Iob2JzSW4sIG0uc3RhdGVzW2ldKTtcbiAgICAgIH1cbiAgICAgIG5vcm1Db25zdCArPSBtUmVzLmFscGhhW2ldO1xuICAgIH1cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBsZWZ0LXJpZ2h0ICAgICAgICBcbiAgfSBlbHNlIHtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IG1SZXMuYWxwaGEubGVuZ3RoOyBpKyspIHtcbiAgICAgIG1SZXMuYWxwaGFbaV0gPSAwLjA7XG4gICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGJpbW9kYWwgICAgICAgIFxuICAgIGlmIChtLnN0YXRlc1swXS5jb21wb25lbnRzWzBdLmJpbW9kYWwpIHtcbiAgICAgIGlmIChvYnNPdXQubGVuZ3RoID4gMCkge1xuICAgICAgICBtUmVzLmFscGhhWzBdID0gZ21tVXRpbHMuZ21tT2JzUHJvYkJpbW9kYWwob2JzSW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb2JzT3V0LFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0uc3RhdGVzWzBdKTtcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1SZXMuYWxwaGFbMF0gPSBnbW1VdGlscy5nbW1PYnNQcm9iSW5wdXQob2JzSW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0uc3RhdGVzWzBdKTtcbiAgICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHVuaW1vZGFsICAgICAgICBcbiAgICB9IGVsc2Uge1xuICAgICAgbVJlcy5hbHBoYVswXSA9IGdtbVV0aWxzLmdtbU9ic1Byb2Iob2JzSW4sIG0uc3RhdGVzWzBdKTtcbiAgICB9XG4gICAgbm9ybUNvbnN0ICs9IG1SZXMuYWxwaGFbMF07XG4gIH1cblxuICBpZiAobm9ybUNvbnN0ID4gMCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnN0YXRlczsgaSsrKSB7XG4gICAgICBtUmVzLmFscGhhW2ldIC89IG5vcm1Db25zdDtcbiAgICB9XG4gICAgcmV0dXJuICgxLjAgLyBub3JtQ29uc3QpO1xuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnN0YXRlczsgaSsrKSB7XG4gICAgICBtUmVzLmFscGhhW2ldID0gMS4wIC8gbnN0YXRlcztcbiAgICB9XG4gICAgcmV0dXJuIDEuMDtcbiAgfVxufTtcblxuXG5leHBvcnQgY29uc3QgaG1tRm9yd2FyZFVwZGF0ZSA9IChvYnNJbiwgbSwgbVJlcywgb2JzT3V0ID0gW10pID0+IHtcbi8vIGV4cG9ydCBjb25zdCBobW1Gb3J3YXJkVXBkYXRlID0gKG9ic0luLCBobW0sIGhtbVJlcywgb2JzT3V0ID0gW10pID0+IHtcbi8vICAgY29uc3QgbSA9IGhtbTtcbi8vICAgY29uc3QgbVJlcyA9IGhtbVJlcztcbiAgY29uc3QgbnN0YXRlcyA9IG0ucGFyYW1ldGVycy5zdGF0ZXM7XG4gIGxldCBub3JtQ29uc3QgPSAwLjA7XG5cbiAgbVJlcy5wcmV2aW91c19hbHBoYSA9IG1SZXMuYWxwaGEuc2xpY2UoMCk7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgbnN0YXRlczsgaSsrKSB7XG4gICAgbVJlcy5hbHBoYVtpXSA9IDA7XG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZXJnb2RpY1xuICAgIGlmIChtLnBhcmFtZXRlcnMudHJhbnNpdGlvbl9tb2RlID09PSAwKSB7XG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IG5zdGF0ZXM7IGorKykge1xuICAgICAgICBtUmVzLmFscGhhW2ldICs9IG1SZXMucHJldmlvdXNfYWxwaGFbal0gKlxuICAgICAgICAgICAgICAgICBtUmVzLnRyYW5zaXRpb25baiAqIG5zdGF0ZXMrIGldO1xuICAgICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGxlZnQtcmlnaHRcbiAgICB9IGVsc2Uge1xuICAgICAgbVJlcy5hbHBoYVtpXSArPSBtUmVzLnByZXZpb3VzX2FscGhhW2ldICogbVJlcy50cmFuc2l0aW9uW2kgKiAyXTtcbiAgICAgIGlmIChpID4gMCkge1xuICAgICAgICBtUmVzLmFscGhhW2ldICs9IG1SZXMucHJldmlvdXNfYWxwaGFbaSAtIDFdICpcbiAgICAgICAgICAgICAgICAgbVJlcy50cmFuc2l0aW9uWyhpIC0gMSkgKiAyICsgMV07XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtUmVzLmFscGhhWzBdICs9IG1SZXMucHJldmlvdXNfYWxwaGFbbnN0YXRlcyAtIDFdICpcbiAgICAgICAgICAgICAgICAgbVJlcy50cmFuc2l0aW9uW25zdGF0ZXMgKiAyIC0gMV07XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gYmltb2RhbCAgICAgICAgXG4gICAgaWYgKG0uc3RhdGVzW2ldLmNvbXBvbmVudHNbMF0uYmltb2RhbCkge1xuICAgICAgaWYgKG9ic091dC5sZW5ndGggPiAwKSB7XG4gICAgICAgIG1SZXMuYWxwaGFbaV0gKj0gZ21tVXRpbHMuZ21tT2JzUHJvYkJpbW9kYWwob2JzSW4sXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvYnNPdXQsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtLnN0YXRlc1tpXSk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBtUmVzLmFscGhhW2ldICo9IGdtbVV0aWxzLmdtbU9ic1Byb2JJbnB1dChvYnNJbixcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG0uc3RhdGVzW2ldKTtcbiAgICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIHVuaW1vZGFsICAgICAgICBcbiAgICB9IGVsc2Uge1xuICAgICAgbVJlcy5hbHBoYVtpXSAqPSBnbW1VdGlscy5nbW1PYnNQcm9iKG9ic0luLCBtLnN0YXRlc1tpXSk7XG4gICAgfVxuICAgIG5vcm1Db25zdCArPSBtUmVzLmFscGhhW2ldO1xuICB9XG5cbiAgaWYgKG5vcm1Db25zdCA+IDFlLTMwMCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgbnN0YXRlczsgaSsrKSB7XG4gICAgICBtUmVzLmFscGhhW2ldIC89IG5vcm1Db25zdDtcbiAgICB9XG4gICAgcmV0dXJuICgxLjAgLyBub3JtQ29uc3QpO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiAwLjA7XG4gIH1cbn07XG5cblxuZXhwb3J0IGNvbnN0IGhtbVVwZGF0ZUFscGhhV2luZG93ID0gKG0sIG1SZXMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBobW1VcGRhdGVBbHBoYVdpbmRvdyA9IChobW0sIGhtbVJlcykgPT4ge1xuLy8gICBjb25zdCBtID0gaG1tO1xuLy8gICBjb25zdCBtUmVzID0gaG1tUmVzO1xuICBjb25zdCBuc3RhdGVzID0gbS5wYXJhbWV0ZXJzLnN0YXRlcztcbiAgXG4gIG1SZXMubGlrZWxpZXN0X3N0YXRlID0gMDtcblxuICBsZXQgYmVzdF9hbHBoYTtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaGllcmFyY2hpY2FsXG4gIGlmIChtLnBhcmFtZXRlcnMuaGllcmFyY2hpY2FsKSB7XG4gICAgYmVzdF9hbHBoYSA9IG1SZXMuYWxwaGFfaFswXVswXSArIG1SZXMuYWxwaGFfaFsxXVswXTtcbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBub24taGllcmFyY2hpY2FsXG4gIH0gZWxzZSB7XG4gICAgYmVzdF9hbHBoYSA9IG1SZXMuYWxwaGFbMF07IFxuICB9XG5cbiAgZm9yIChsZXQgaSA9IDE7IGkgPCBuc3RhdGVzOyBpKyspIHtcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gaGllcmFyY2hpY2FsXG4gICAgaWYgKG0ucGFyYW1ldGVycy5oaWVyYXJjaGljYWwpIHtcbiAgICAgIGlmICgobVJlcy5hbHBoYV9oWzBdW2ldICsgbVJlcy5hbHBoYV9oWzFdW2ldKSA+IGJlc3RfYWxwaGEpIHtcbiAgICAgICAgYmVzdF9hbHBoYSA9IG1SZXMuYWxwaGFfaFswXVtpXSArIG1SZXMuYWxwaGFfaFsxXVtpXTtcbiAgICAgICAgbVJlcy5saWtlbGllc3Rfc3RhdGUgPSBpO1xuICAgICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIG5vbi1oaWVyYXJjaGljYWwgICAgICAgIFxuICAgIH0gZWxzZSB7XG4gICAgICBpZihtUmVzLmFscGhhW2ldID4gYmVzdF9hbHBoYSkge1xuICAgICAgICBiZXN0X2FscGhhID0gbVJlcy5hbHBoYVswXTtcbiAgICAgICAgbVJlcy5saWtlbGllc3Rfc3RhdGUgPSBpO1xuICAgICAgfVxuICAgIH1cbiAgfVxuXG4gIG1SZXMud2luZG93X21pbmluZGV4ID0gbVJlcy5saWtlbGllc3Rfc3RhdGUgLSBuc3RhdGVzIC8gMjtcbiAgbVJlcy53aW5kb3dfbWF4aW5kZXggPSBtUmVzLmxpa2VsaWVzdF9zdGF0ZSArIG5zdGF0ZXMgLyAyO1xuICBtUmVzLndpbmRvd19taW5pbmRleCA9IChtUmVzLndpbmRvd19taW5pbmRleCA+PSAwKVxuICAgICAgICAgICAgID8gbVJlcy53aW5kb3dfbWluaW5kZXhcbiAgICAgICAgICAgICA6IDA7XG4gIG1SZXMud2luZG93X21heGluZGV4ID0gKG1SZXMud2luZG93X21heGluZGV4IDw9IG5zdGF0ZXMpXG4gICAgICAgICAgICAgPyBtUmVzLndpbmRvd19tYXhpbmRleFxuICAgICAgICAgICAgIDogbnN0YXRlcztcbiAgbVJlcy53aW5kb3dfbm9ybWFsaXphdGlvbl9jb25zdGFudCA9IDA7XG4gIGZvciAobGV0IGkgPSBtUmVzLndpbmRvd19taW5pbmRleDsgaSA8IG1SZXMud2luZG93X21heGluZGV4OyBpKyspIHtcbiAgICBtUmVzLndpbmRvd19ub3JtYWxpemF0aW9uX2NvbnN0YW50XG4gICAgICArPSAobVJlcy5hbHBoYV9oWzBdW2ldICsgbVJlcy5hbHBoYV9oWzFdW2ldKTtcbiAgfVxufTtcblxuXG5leHBvcnQgY29uc3QgaG1tVXBkYXRlUmVzdWx0cyA9IChtLCBtUmVzKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgaG1tVXBkYXRlUmVzdWx0cyA9IChobW0sIGhtbVJlcykgPT4ge1xuLy8gICBjb25zdCBtID0gaG1tO1xuLy8gICBjb25zdCBtUmVzID0gaG1tUmVzO1xuXG4gIC8vIElTIFRISVMgQ09SUkVDVCAgPyBUT0RPIDogQ0hFQ0sgQUdBSU4gKHNlZW1zIHRvIGhhdmUgcHJlY2lzaW9uIGlzc3VlcylcbiAgLy8gQUhBICEgOiBOT1JNQUxMWSBMSUtFTElIT09EX0JVRkZFUiBJUyBDSVJDVUxBUiA6IElTIElUIFRIRSBDQVNFIEhFUkUgP1xuICAvLyBTSE9VTEQgSSBcIlBPUF9GUk9OVFwiID8gKHNlZW1zIHRoYXQgeWVzKVxuXG4gIC8vcmVzLmxpa2VsaWhvb2RfYnVmZmVyLnB1c2goTWF0aC5sb2cocmVzLmluc3RhbnRfbGlrZWxpaG9vZCkpO1xuXG4gIC8vIE5PVyBUSElTIElTIEJFVFRFUiAoU0hPVUxEIFdPUksgQVMgSU5URU5ERUQpXG4gIG1SZXMubGlrZWxpaG9vZF9idWZmZXJbbVJlcy5saWtlbGlob29kX2J1ZmZlcl9pbmRleF1cbiAgICA9IE1hdGgubG9nKG1SZXMuaW5zdGFudF9saWtlbGlob29kKTtcbiAgbVJlcy5saWtlbGlob29kX2J1ZmZlcl9pbmRleFxuICAgID0gKG1SZXMubGlrZWxpaG9vZF9idWZmZXJfaW5kZXggKyAxKSAlIG1SZXMubGlrZWxpaG9vZF9idWZmZXIubGVuZ3RoO1xuXG4gIG1SZXMubG9nX2xpa2VsaWhvb2QgPSAwO1xuICBjb25zdCBidWZTaXplID0gbVJlcy5saWtlbGlob29kX2J1ZmZlci5sZW5ndGg7XG4gIGZvciAobGV0IGkgPSAwOyBpIDwgYnVmU2l6ZTsgaSsrKSB7XG4gICAgbVJlcy5sb2dfbGlrZWxpaG9vZCArPSBtUmVzLmxpa2VsaWhvb2RfYnVmZmVyW2ldO1xuICB9XG4gIG1SZXMubG9nX2xpa2VsaWhvb2QgLz0gYnVmU2l6ZTtcblxuICBtUmVzLnByb2dyZXNzID0gMDtcbiAgZm9yIChsZXQgaSA9IG1SZXMud2luZG93X21pbmluZGV4OyBpIDwgbVJlcy53aW5kb3dfbWF4aW5kZXg7IGkrKykge1xuICAgIGlmIChtLnBhcmFtZXRlcnMuaGllcmFyY2hpY2FsKSB7IC8vIGhpZXJhcmNoaWNhbFxuICAgICAgbVJlcy5wcm9ncmVzc1xuICAgICAgICArPSAoXG4gICAgICAgICAgICBtUmVzLmFscGhhX2hbMF1baV0gK1xuICAgICAgICAgICAgbVJlcy5hbHBoYV9oWzFdW2ldICtcbiAgICAgICAgICAgIG1SZXMuYWxwaGFfaFsyXVtpXVxuICAgICAgICAgICkgKlxuICAgICAgICAgIGkgLyBtUmVzLndpbmRvd19ub3JtYWxpemF0aW9uX2NvbnN0YW50O1xuICAgIH0gZWxzZSB7IC8vIG5vbiBoaWVyYXJjaGljYWxcbiAgICAgIG1SZXMucHJvZ3Jlc3MgKz0gbVJlcy5hbHBoYVtpXSAqXG4gICAgICAgICAgICAgICBpIC8gbVJlcy53aW5kb3dfbm9ybWFsaXphdGlvbl9jb25zdGFudDtcbiAgICB9XG4gIH1cbiAgbVJlcy5wcm9ncmVzcyAvPSAobS5wYXJhbWV0ZXJzLnN0YXRlcyAtIDEpO1xufTtcblxuXG5leHBvcnQgY29uc3QgaG1tRmlsdGVyID0gKG9ic0luLCBtLCBtUmVzKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgaG1tRmlsdGVyID0gKG9ic0luLCBobW0sIGhtbVJlcykgPT4ge1xuLy8gICBjb25zdCBtID0gaG1tO1xuLy8gICBjb25zdCBtUmVzID0gaG1tUmVzO1xuICBsZXQgY3QgPSAwLjA7XG4gIGlmIChtUmVzLmZvcndhcmRfaW5pdGlhbGl6ZWQpIHtcbiAgICBjdCA9IGhtbUZvcndhcmRVcGRhdGUob2JzSW4sIG0sIG1SZXMpO1xuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbVJlcy5saWtlbGlob29kX2J1ZmZlci5sZW5ndGg7IGorKykge1xuICAgICAgbVJlcy5saWtlbGlob29kX2J1ZmZlcltqXSA9IDAuMDtcbiAgICB9XG4gICAgY3QgPSBobW1Gb3J3YXJkSW5pdChvYnNJbiwgbSwgbVJlcyk7XG4gICAgbVJlcy5mb3J3YXJkX2luaXRpYWxpemVkID0gdHJ1ZTtcbiAgfVxuXG4gIG1SZXMuaW5zdGFudF9saWtlbGlob29kID0gMS4wIC8gY3Q7XG4gIGhtbVVwZGF0ZUFscGhhV2luZG93KG0sIG1SZXMpO1xuICBobW1VcGRhdGVSZXN1bHRzKG0sIG1SZXMpO1xuXG4gIGlmIChtLnN0YXRlc1swXS5jb21wb25lbnRzWzBdLmJpbW9kYWwpIHtcbiAgICBobW1SZWdyZXNzaW9uKG9ic0luLCBtLCBtUmVzKTtcbiAgfVxuXG4gIHJldHVybiBtUmVzLmluc3RhbnRfbGlrZWxpaG9vZDtcbn07XG5cblxuLy8gPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IC8vXG4vLyAgIGFzIGluIHhtbUhpZXJhcmNoaWNhbEhtbS5jcHAgICAgLy9cbi8vID09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PSAvL1xuXG5leHBvcnQgY29uc3QgaGhtbUxpa2VsaWhvb2RBbHBoYSA9IChleGl0TnVtLCBsaWtlbGlob29kVmVjLCBobSwgaG1SZXMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBoaG1tTGlrZWxpaG9vZEFscGhhID0gKGV4aXROdW0sIGxpa2VsaWhvb2RWZWMsIGhobW0sIGhobW1SZXMpID0+IHtcbi8vICAgY29uc3QgbSA9IGhobW07XG4vLyAgIGNvbnN0IG1SZXMgPSBoaG1tUmVzO1xuXG4gIGlmIChleGl0TnVtIDwgMCkge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaG0ubW9kZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsaWtlbGlob29kVmVjW2ldID0gMDtcbiAgICAgIGZvciAobGV0IGV4aXQgPSAwOyBleGl0IDwgMzsgZXhpdCsrKSB7XG4gICAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaG0ubW9kZWxzW2ldLnBhcmFtZXRlcnMuc3RhdGVzOyBrKyspIHtcbiAgICAgICAgICBsaWtlbGlob29kVmVjW2ldXG4gICAgICAgICAgICArPSBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXS5hbHBoYV9oW2V4aXRdW2tdO1xuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaG0ubW9kZWxzLmxlbmd0aDsgaSsrKSB7XG4gICAgICBsaWtlbGlob29kVmVjW2ldID0gMDtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgaG0ubW9kZWxzW2ldLnBhcmFtZXRlcnMuc3RhdGVzOyBrKyspIHtcbiAgICAgICAgbGlrZWxpaG9vZFZlY1tpXVxuICAgICAgICAgICs9IGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldLmFscGhhX2hbZXhpdE51bV1ba107XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuXG5cbi8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gRk9SV0FSRCBJTklUXG5cbmV4cG9ydCBjb25zdCBoaG1tRm9yd2FyZEluaXQgPSAob2JzSW4sIGhtLCBobVJlcykgPT4ge1xuLy8gZXhwb3J0IGNvbnN0IGhobW1Gb3J3YXJkSW5pdCA9IChvYnNJbiwgaGhtbSwgaGhtbVJlcykgPT4ge1xuLy8gICBjb25zdCBobSA9IGhobW07XG4vLyAgIGNvbnN0IGhtUmVzID0gaGhtbVJlcztcbiAgbGV0IG5vcm1fY29uc3QgPSAwO1xuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gaW5pdGlhbGl6ZSBhbHBoYXNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBobS5tb2RlbHMubGVuZ3RoOyBpKyspIHtcblxuICAgIGNvbnN0IG0gPSBobS5tb2RlbHNbaV07XG4gICAgY29uc3QgbnN0YXRlcyA9IG0ucGFyYW1ldGVycy5zdGF0ZXM7XG4gICAgY29uc3QgbVJlcyA9IGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldO1xuXG4gICAgZm9yIChsZXQgaiA9IDA7IGogPCAzOyBqKyspIHtcbiAgICAgIG1SZXMuYWxwaGFfaFtqXSA9IG5ldyBBcnJheShuc3RhdGVzKTtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbnN0YXRlczsgaysrKSB7XG4gICAgICAgIG1SZXMuYWxwaGFfaFtqXVtrXSA9IDA7XG4gICAgICB9XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZXJnb2RpY1xuICAgIGlmIChtLnBhcmFtZXRlcnMudHJhbnNpdGlvbl9tb2RlID09IDApIHtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbnN0YXRlczsgaysrKSB7XG4gICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gYmltb2RhbFxuICAgICAgICBpZiAoaG0uc2hhcmVkX3BhcmFtZXRlcnMuYmltb2RhbCkge1xuICAgICAgICAgIG1SZXMuYWxwaGFfaFswXVtrXSA9IG0ucHJpb3Jba10gKlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGdtbVV0aWxzLmdtbU9ic1Byb2JJbnB1dChvYnNJbiwgbS5zdGF0ZXNba10pO1xuICAgICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gdW5pbW9kYWxcbiAgICAgICAgfSBlbHNlIHtcbiAgICAgICAgICBtUmVzLmFscGhhX2hbMF1ba10gPSBtLnByaW9yW2tdICpcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBnbW1VdGlscy5nbW1PYnNQcm9iKG9ic0luLCBtLnN0YXRlc1trXSk7XG4gICAgICAgIH1cbiAgICAgICAgbVJlcy5pbnN0YW50X2xpa2VsaWhvb2QgKz0gbVJlcy5hbHBoYV9oWzBdW2tdO1xuICAgICAgfVxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGxlZnQtcmlnaHRcbiAgICB9IGVsc2Uge1xuICAgICAgbVJlcy5hbHBoYV9oWzBdWzBdID0gaG0ucHJpb3JbaV07XG4gICAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gYmltb2RhbFxuICAgICAgaWYgKGhtLnNoYXJlZF9wYXJhbWV0ZXJzLmJpbW9kYWwpIHtcbiAgICAgICAgbVJlcy5hbHBoYV9oWzBdWzBdICo9IGdtbVV0aWxzLmdtbU9ic1Byb2JJbnB1dChvYnNJbiwgbS5zdGF0ZXNbMF0pO1xuICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gdW5pbW9kYWxcbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIG1SZXMuYWxwaGFfaFswXVswXSAqPSBnbW1VdGlscy5nbW1PYnNQcm9iKG9ic0luLCBtLnN0YXRlc1swXSk7XG4gICAgICB9XG4gICAgICBtUmVzLmluc3RhbnRfbGlrZWxpaG9vZCA9IG1SZXMuYWxwaGFfaFswXVswXTtcbiAgICB9XG4gICAgbm9ybV9jb25zdCArPSBtUmVzLmluc3RhbnRfbGlrZWxpaG9vZDtcbiAgfVxuXG4gIC8vPT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09IG5vcm1hbGl6ZSBhbHBoYXNcbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBobS5tb2RlbHMubGVuZ3RoOyBpKyspIHtcblxuICAgIGNvbnN0IG5zdGF0ZXMgPSBobS5tb2RlbHNbaV0ucGFyYW1ldGVycy5zdGF0ZXM7XG4gICAgZm9yIChsZXQgZSA9IDA7IGUgPCAzOyBlKyspIHtcbiAgICAgIGZvciAobGV0IGsgPSAwOyBrIDwgbnN0YXRlczsgaysrKSB7XG4gICAgICAgIGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldLmFscGhhX2hbZV1ba10gLz0gbm9ybV9jb25zdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICBobVJlcy5mb3J3YXJkX2luaXRpYWxpemVkID0gdHJ1ZTtcbn07XG5cblxuLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gRk9SV0FSRCBVUERBVEVcblxuZXhwb3J0IGNvbnN0IGhobW1Gb3J3YXJkVXBkYXRlID0gKG9ic0luLCBobSwgaG1SZXMpID0+IHtcbi8vIGV4cG9ydCBjb25zdCBoaG1tRm9yd2FyZFVwZGF0ZSA9IChvYnNJbiwgaGhtbSwgaGhtbVJlcykgPT4ge1xuLy8gICBjb25zdCBobSA9IGhobW07XG4vLyAgIGNvbnN0IGhtUmVzID0gaGhtbVJlcztcbiAgY29uc3Qgbm1vZGVscyA9IGhtLm1vZGVscy5sZW5ndGg7XG5cbiAgbGV0IG5vcm1fY29uc3QgPSAwO1xuICBsZXQgdG1wID0gMDtcbiAgbGV0IGZyb250OyAvLyBhcnJheVxuXG4gIGhobW1MaWtlbGlob29kQWxwaGEoMSwgaG1SZXMuZnJvbnRpZXJfdjEsIGhtLCBobVJlcyk7XG4gIGhobW1MaWtlbGlob29kQWxwaGEoMiwgaG1SZXMuZnJvbnRpZXJfdjIsIGhtLCBobVJlcyk7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBubW9kZWxzOyBpKyspIHtcblxuICAgIGNvbnN0IG0gPSBobS5tb2RlbHNbaV07XG4gICAgY29uc3QgbnN0YXRlcyA9IG0ucGFyYW1ldGVycy5zdGF0ZXM7XG4gICAgY29uc3QgbVJlcyA9IGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldO1xuICAgIFxuICAgIC8vPT09PT09PT09PT09PT09PT09PT09PT0gY29tcHV0ZSBmcm9udGllciB2YXJpYWJsZVxuICAgIGZyb250ID0gbmV3IEFycmF5KG5zdGF0ZXMpO1xuICAgIGZvciAobGV0IGogPSAwOyBqIDwgbnN0YXRlczsgaisrKSB7XG4gICAgICBmcm9udFtqXSA9IDA7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZXJnb2RpY1xuICAgIGlmIChtLnBhcmFtZXRlcnMudHJhbnNpdGlvbl9tb2RlID09IDApIHsgLy8gZXJnb2RpY1xuICAgICAgZm9yIChsZXQgayA9IDA7IGsgPCBuc3RhdGVzOyBrKyspIHtcbiAgICAgICAgZm9yIChsZXQgaiA9IDA7IGogPCBuc3RhdGVzOyBqKyspIHtcbiAgICAgICAgICBmcm9udFtrXSArPSBtLnRyYW5zaXRpb25baiAqIG5zdGF0ZXMgKyBrXSAvXG4gICAgICAgICAgICAgICAgKDEgLSBtLmV4aXRQcm9iYWJpbGl0aWVzW2pdKSAqXG4gICAgICAgICAgICAgICAgbVJlcy5hbHBoYV9oWzBdW2pdO1xuICAgICAgICB9XG4gICAgICAgIGZvciAobGV0IHNyY2kgPSAwOyBzcmNpIDwgbm1vZGVsczsgc3JjaSsrKSB7XG4gICAgICAgICAgZnJvbnRba10gKz0gbS5wcmlvcltrXSAqXG4gICAgICAgICAgICAgICAgKFxuICAgICAgICAgICAgICAgICAgaG1SZXMuZnJvbnRpZXJfdjFbc3JjaV0gKlxuICAgICAgICAgICAgICAgICAgaG0udHJhbnNpdGlvbltzcmNpXVtpXVxuICAgICAgICAgICAgICAgICAgKyBobVJlcy5mcm9udGllcl92MltzcmNpXSAqXG4gICAgICAgICAgICAgICAgICBobS5wcmlvcltpXVxuICAgICAgICAgICAgICAgICk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBsZWZ0LXJpZ2h0XG4gICAgfSBlbHNlIHtcbiAgICAgIC8vIGsgPT0gMCA6IGZpcnN0IHN0YXRlIG9mIHRoZSBwcmltaXRpdmVcbiAgICAgIGZyb250WzBdID0gbS50cmFuc2l0aW9uWzBdICogbVJlcy5hbHBoYV9oWzBdWzBdO1xuXG4gICAgICBmb3IgKGxldCBzcmNpID0gMDsgc3JjaSA8IG5tb2RlbHM7IHNyY2krKykge1xuICAgICAgICBmcm9udFswXSArPSBobVJlcy5mcm9udGllcl92MVtzcmNpXSAqXG4gICAgICAgICAgICAgIGhtLnRyYW5zaXRpb25bc3JjaV1baV1cbiAgICAgICAgICAgICAgKyBobVJlcy5mcm9udGllcl92MltzcmNpXSAqXG4gICAgICAgICAgICAgIGhtLnByaW9yW2ldO1xuICAgICAgfVxuXG4gICAgICAvLyBrID4gMCA6IHJlc3Qgb2YgdGhlIHByaW1pdGl2ZVxuICAgICAgZm9yIChsZXQgayA9IDE7IGsgPCBuc3RhdGVzOyBrKyspIHtcbiAgICAgICAgZnJvbnRba10gKz0gbS50cmFuc2l0aW9uW2sgKiAyXSAvXG4gICAgICAgICAgICAgICgxIC0gbS5leGl0UHJvYmFiaWxpdGllc1trXSkgKlxuICAgICAgICAgICAgICBtUmVzLmFscGhhX2hbMF1ba107XG4gICAgICAgIGZyb250W2tdICs9IG0udHJhbnNpdGlvblsoayAtIDEpICogMiArIDFdIC9cbiAgICAgICAgICAgICAgKDEgLSBtLmV4aXRQcm9iYWJpbGl0aWVzW2sgLSAxXSkgKlxuICAgICAgICAgICAgICBtUmVzLmFscGhhX2hbMF1bayAtIDFdO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBqID0gMDsgaiA8IDM7IGorKykge1xuICAgICAgICBmb3IgKGxldCBrID0gMDsgayA8IG5zdGF0ZXM7IGsrKykge1xuICAgICAgICAgIG1SZXMuYWxwaGFfaFtqXVtrXSA9IDA7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhmcm9udCk7XG5cbiAgICAvLz09PT09PT09PT09PT09PT09PT09PT09PT0gdXBkYXRlIGZvcndhcmQgdmFyaWFibGVcbiAgICBtUmVzLmV4aXRfbGlrZWxpaG9vZCA9IDA7XG4gICAgbVJlcy5pbnN0YW50X2xpa2VsaWhvb2QgPSAwO1xuXG4gICAgZm9yIChsZXQgayA9IDA7IGsgPCBuc3RhdGVzOyBrKyspIHtcbiAgICAgIGlmIChobS5zaGFyZWRfcGFyYW1ldGVycy5iaW1vZGFsKSB7XG4gICAgICAgIHRtcCA9IGdtbVV0aWxzLmdtbU9ic1Byb2JJbnB1dChvYnNJbiwgbS5zdGF0ZXNba10pICpcbiAgICAgICAgICAgIGZyb250W2tdO1xuICAgICAgfSBlbHNlIHtcbiAgICAgICAgdG1wID0gZ21tVXRpbHMuZ21tT2JzUHJvYihvYnNJbiwgbS5zdGF0ZXNba10pICogZnJvbnRba107XG4gICAgICB9XG5cbiAgICAgIG1SZXMuYWxwaGFfaFsyXVtrXSA9IGhtLmV4aXRfdHJhbnNpdGlvbltpXSAqXG4gICAgICAgICAgICAgICAgIG0uZXhpdFByb2JhYmlsaXRpZXNba10gKiB0bXA7XG4gICAgICBtUmVzLmFscGhhX2hbMV1ba10gPSAoMSAtIGhtLmV4aXRfdHJhbnNpdGlvbltpXSkgKlxuICAgICAgICAgICAgICAgICBtLmV4aXRQcm9iYWJpbGl0aWVzW2tdICogdG1wO1xuICAgICAgbVJlcy5hbHBoYV9oWzBdW2tdID0gKDEgLSBtLmV4aXRQcm9iYWJpbGl0aWVzW2tdKSAqIHRtcDtcblxuICAgICAgbVJlcy5leGl0X2xpa2VsaWhvb2QgKz0gbVJlcy5hbHBoYV9oWzFdW2tdICtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG1SZXMuYWxwaGFfaFsyXVtrXTtcbiAgICAgIG1SZXMuaW5zdGFudF9saWtlbGlob29kICs9IG1SZXMuYWxwaGFfaFswXVtrXSArXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBtUmVzLmFscGhhX2hbMV1ba10gK1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbVJlcy5hbHBoYV9oWzJdW2tdO1xuXG4gICAgICBub3JtX2NvbnN0ICs9IHRtcDtcbiAgICB9XG5cbiAgICBtUmVzLmV4aXRfcmF0aW8gPSBtUmVzLmV4aXRfbGlrZWxpaG9vZCAvIG1SZXMuaW5zdGFudF9saWtlbGlob29kO1xuICB9XG5cbiAgLy89PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT09PT0gbm9ybWFsaXplIGFscGhhc1xuICBmb3IgKGxldCBpID0gMDsgaSA8IG5tb2RlbHM7IGkrKykge1xuICAgIGZvciAobGV0IGUgPSAwOyBlIDwgMzsgZSsrKSB7XG4gICAgICBmb3IgKGxldCBrID0gMDsgayA8IGhtLm1vZGVsc1tpXS5wYXJhbWV0ZXJzLnN0YXRlczsgaysrKSB7XG4gICAgICAgIGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldLmFscGhhX2hbZV1ba10gLz0gbm9ybV9jb25zdDtcbiAgICAgIH1cbiAgICB9XG4gIH1cbn07XG5cblxuZXhwb3J0IGNvbnN0IGhobW1VcGRhdGVSZXN1bHRzID0gKGhtLCBobVJlcykgPT4ge1xuLy8gZXhwb3J0IGNvbnN0IGhobW1VcGRhdGVSZXN1bHRzID0gKGhobW0sIGhobW1SZXMpID0+IHtcbi8vICAgY29uc3QgaG0gPSBoaG1tO1xuLy8gICBjb25zdCBobVJlcyA9IGhobW1SZXM7XG5cbiAgbGV0IG1heGxvZ19saWtlbGlob29kID0gMDtcbiAgbGV0IG5vcm1jb25zdF9pbnN0YW50ID0gMDtcbiAgbGV0IG5vcm1jb25zdF9zbW9vdGhlZCA9IDA7XG5cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBobS5tb2RlbHMubGVuZ3RoOyBpKyspIHtcblxuICAgIGxldCBtUmVzID0gaG1SZXMuc2luZ2xlQ2xhc3NIbW1Nb2RlbFJlc3VsdHNbaV07XG5cbiAgICBobVJlcy5pbnN0YW50X2xpa2VsaWhvb2RzW2ldID0gbVJlcy5pbnN0YW50X2xpa2VsaWhvb2Q7XG4gICAgaG1SZXMuc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzW2ldID0gbVJlcy5sb2dfbGlrZWxpaG9vZDtcbiAgICBobVJlcy5zbW9vdGhlZF9saWtlbGlob29kc1tpXSA9IE1hdGguZXhwKGhtUmVzLnNtb290aGVkX2xvZ19saWtlbGlob29kc1tpXSk7XG5cbiAgICBobVJlcy5pbnN0YW50X25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gPSBobVJlcy5pbnN0YW50X2xpa2VsaWhvb2RzW2ldO1xuICAgIGhtUmVzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gPSBobVJlcy5zbW9vdGhlZF9saWtlbGlob29kc1tpXTtcblxuICAgIG5vcm1jb25zdF9pbnN0YW50ICAgKz0gaG1SZXMuaW5zdGFudF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzW2ldO1xuICAgIG5vcm1jb25zdF9zbW9vdGhlZCAgKz0gaG1SZXMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXTtcblxuICAgIGlmIChpID09IDAgfHwgaG1SZXMuc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzW2ldID4gbWF4bG9nX2xpa2VsaWhvb2QpIHtcbiAgICAgIG1heGxvZ19saWtlbGlob29kID0gaG1SZXMuc21vb3RoZWRfbG9nX2xpa2VsaWhvb2RzW2ldO1xuICAgICAgaG1SZXMubGlrZWxpZXN0ID0gaTtcbiAgICB9XG4gIH1cblxuICBmb3IgKGxldCBpID0gMDsgaSA8IGhtLm1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgIGhtUmVzLmluc3RhbnRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSAvPSBub3JtY29uc3RfaW5zdGFudDtcbiAgICBobVJlcy5zbW9vdGhlZF9ub3JtYWxpemVkX2xpa2VsaWhvb2RzW2ldIC89IG5vcm1jb25zdF9zbW9vdGhlZDtcbiAgfVxufTtcblxuXG5leHBvcnQgY29uc3QgaGhtbUZpbHRlciA9IChvYnNJbiwgaG0sIGhtUmVzKSA9PiB7XG4vLyBleHBvcnQgY29uc3QgaGhtbUZpbHRlciA9IChvYnNJbiwgaGhtbSwgaGhtbVJlcykgPT4ge1xuLy8gICBjb25zdCBobSA9IGhobW07XG4vLyAgIGNvbnN0IGhtUmVzID0gaGhtbVJlcztcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBoaWVyYXJjaGljYWxcbiAgaWYgKGhtLmNvbmZpZ3VyYXRpb24uZGVmYXVsdF9wYXJhbWV0ZXJzLmhpZXJhcmNoaWNhbCkge1xuICAgIGlmIChobVJlcy5mb3J3YXJkX2luaXRpYWxpemVkKSB7XG4gICAgICBoaG1tRm9yd2FyZFVwZGF0ZShvYnNJbiwgaG0sIGhtUmVzKTtcbiAgICB9IGVsc2Uge1xuICAgICAgaGhtbUZvcndhcmRJbml0KG9ic0luLCBobSwgaG1SZXMpO1xuICAgIH1cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLSBub24taGllcmFyY2hpY2FsXG4gIH0gZWxzZSB7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBobS5tb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGhtUmVzLmluc3RhbnRfbGlrZWxpaG9vZHNbaV0gPSBobW1GaWx0ZXIob2JzSW4sIGhtLCBobVJlcyk7XG4gICAgfVxuICB9XG5cbiAgLy8tLS0tLS0tLS0tLS0tLS0tLSBjb21wdXRlIHRpbWUgcHJvZ3Jlc3Npb25cbiAgZm9yIChsZXQgaSA9IDA7IGkgPCBobS5tb2RlbHMubGVuZ3RoOyBpKyspIHtcbiAgICBobW1VcGRhdGVBbHBoYVdpbmRvdyhcbiAgICAgIGhtLm1vZGVsc1tpXSxcbiAgICAgIGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldXG4gICAgKTtcbiAgICBobW1VcGRhdGVSZXN1bHRzKFxuICAgICAgaG0ubW9kZWxzW2ldLFxuICAgICAgaG1SZXMuc2luZ2xlQ2xhc3NIbW1Nb2RlbFJlc3VsdHNbaV1cbiAgICApO1xuICB9XG5cbiAgaGhtbVVwZGF0ZVJlc3VsdHMoaG0sIGhtUmVzKTtcblxuICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGJpbW9kYWxcbiAgaWYgKGhtLnNoYXJlZF9wYXJhbWV0ZXJzLmJpbW9kYWwpIHtcbiAgICBjb25zdCBkaW0gPSBobS5zaGFyZWRfcGFyYW1ldGVycy5kaW1lbnNpb247XG4gICAgY29uc3QgZGltSW4gPSBobS5zaGFyZWRfcGFyYW1ldGVycy5kaW1lbnNpb25faW5wdXQ7XG4gICAgY29uc3QgZGltT3V0ID0gZGltIC0gZGltSW47XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhtLm1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgaG1tUmVncmVzc2lvbihvYnNJbiwgaG0ubW9kZWxzW2ldLCBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXSk7XG4gICAgfVxuXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIGxpa2VsaWVzdFxuICAgIGlmIChobS5jb25maWd1cmF0aW9uLm11bHRpQ2xhc3NfcmVncmVzc2lvbl9lc3RpbWF0b3IgPT09IDApIHtcbiAgICAgIGhtUmVzLm91dHB1dF92YWx1ZXNcbiAgICAgICAgPSBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tobVJlcy5saWtlbGllc3RdXG4gICAgICAgICAgICAgICAub3V0cHV0X3ZhbHVlcy5zbGljZSgwKTtcbiAgICAgIGhtUmVzLm91dHB1dF9jb3ZhcmlhbmNlXG4gICAgICAgID0gaG1SZXMuc2luZ2xlQ2xhc3NIbW1Nb2RlbFJlc3VsdHNbaG1SZXMubGlrZWxpZXN0XVxuICAgICAgICAgICAgICAgLm91dHB1dF9jb3ZhcmlhbmNlLnNsaWNlKDApO1xuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tIG1peHR1cmVcbiAgICB9IGVsc2Uge1xuICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBobVJlcy5vdXRwdXRfdmFsdWVzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhtUmVzLm91dHB1dF92YWx1ZXNbaV0gPSAwLjA7XG4gICAgICB9XG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhtUmVzLm91dHB1dF9jb3ZhcmlhbmNlLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIGhtUmVzLm91dHB1dF9jb3ZhcmlhbmNlW2ldID0gMC4wO1xuICAgICAgfVxuXG4gICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGhtLm1vZGVscy5sZW5ndGg7IGkrKykge1xuICAgICAgICBmb3IgKGxldCBkID0gMDsgZCA8IGRpbU91dDsgZCsrKSB7XG4gICAgICAgICAgaG1SZXMub3V0cHV0X3ZhbHVlc1tkXVxuICAgICAgICAgICAgKz0gaG1SZXMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSAqXG4gICAgICAgICAgICAgICBobVJlcy5zaW5nbGVDbGFzc0htbU1vZGVsUmVzdWx0c1tpXS5vdXRwdXRfdmFsdWVzW2RdO1xuXG4gICAgICAgICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZnVsbFxuICAgICAgICAgIGlmIChobS5jb25maWd1cmF0aW9uLmNvdmFyaWFuY2VfbW9kZSA9PT0gMCkge1xuICAgICAgICAgICAgZm9yIChsZXQgZDIgPSAwOyBkMiA8IGRpbU91dDsgZDIgKyspIHtcbiAgICAgICAgICAgICAgaG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbZCAqIGRpbU91dCArIGQyXVxuICAgICAgICAgICAgICAgICs9IGhtUmVzLnNtb290aGVkX25vcm1hbGl6ZWRfbGlrZWxpaG9vZHNbaV0gKlxuICAgICAgICAgICAgICAgICAgIGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldXG4gICAgICAgICAgICAgICAgICAgIC5vdXRwdXRfY292YXJpYW5jZVtkICogZGltT3V0ICsgZDJdO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0gZGlhZ29uYWxcbiAgICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgICAgaG1SZXMub3V0cHV0X2NvdmFyaWFuY2VbZF1cbiAgICAgICAgICAgICAgKz0gaG1SZXMuc21vb3RoZWRfbm9ybWFsaXplZF9saWtlbGlob29kc1tpXSAqXG4gICAgICAgICAgICAgICAgIGhtUmVzLnNpbmdsZUNsYXNzSG1tTW9kZWxSZXN1bHRzW2ldXG4gICAgICAgICAgICAgICAgICAub3V0cHV0X2NvdmFyaWFuY2VbZF07XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59O1xuIl19
