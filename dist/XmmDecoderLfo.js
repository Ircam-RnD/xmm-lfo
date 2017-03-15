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

var _core = require('waves-lfo/core');

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
 * Callback handling the full filtering results.
 * @callback filterCallback
 * @param {Object} res - An object containing the filtering results.
 */

/**
 * Lfo class loading any model (GMM or HHMM) created by the xmm library and
 * automatically instantiating the corresponding decoder internally to
 * process an input stream of vectors (models must have been trained from the
 * same input stream).
 * As the results of the classification / following / regression are more
 * complex than a simple vector, a callback function can be passed to the
 * constructor to handle them.
 * @class
 *
 * @param {Object} options - Override defaults.
 * @param {Object} [options.model=null] - Any model from the XMM library.
 * @param {Number} [options.likelihoodWindow=20] - Likelihood window size (smooths output).
 * @param {('likelihoods'|'regression')} [options.output='likelihoods'] - Which information to output.
 * @param {filterCallback} [options.callback=null]
*/

var XmmDecoderLfo = function (_BaseLfo) {
  (0, _inherits3.default)(XmmDecoderLfo, _BaseLfo);

  function XmmDecoderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, XmmDecoderLfo);

    var _this = (0, _possibleConstructorReturn3.default)(this, (XmmDecoderLfo.__proto__ || (0, _getPrototypeOf2.default)(XmmDecoderLfo)).call(this, definitions, options));

    _this._modelType = 'hhmm';
    _this._decoder = new _xmmClient.HhmmDecoder(_this.params.get('likelihoodWindow'));
    return _this;
  }

  /**
   * Resets the intermediate results of the estimation if the model is a HHMM.
   */


  (0, _createClass3.default)(XmmDecoderLfo, [{
    key: 'reset',
    value: function reset() {
      if (this._modelType === 'hhmm') {
        this._decoder.reset();
      }
    }

    /** @private */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(XmmDecoderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(XmmDecoderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

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

      var model = this.params.get('model');
      var states = model.configuration.default_parameters.states;

      if (states !== null && states !== undefined) {
        this._modelType = 'hhmm';
        this._decoder = new _xmmClient.HhmmDecoder(this.params.get('likelihoodWindow'));
      } else {
        this._modelType = 'gmm';
        this._decoder = new _xmmClient.GmmDecoder(this.params.get('likelihoodWindow'));
      }

      this._decoder.setModel(model);

      if (this.params.get('output') === 'likelihoods') {
        this.streamParams.frameSize = this._decoder.getNumberOfClasses();
      } else {
        // === 'regression'
        this.streamParams.frameSize = this._decoder.getRegressionVectorSize();
      }

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      var inArray = new Array(frame.data.length);
      for (var i = 0; i < inArray.length; i++) {
        inArray[i] = frame.data[i];
      }

      var res = this._decoder.filter(inArray);
      var callback = this.params.get('callback');
      var outData = void 0;
      if (this.params.get('output') === 'likelihoods') {
        outData = res.likelihoods;
      } else {
        outData = res.outputValues;
      }

      var data = this.frame.data;
      var frameSize = this.streamParams.frameSize;

      for (var _i = 0; _i < frameSize; _i++) {
        data[_i] = outData[_i];
      }

      if (callback) {
        callback(res);
      }
    }
  }]);
  return XmmDecoderLfo;
}(_core.BaseLfo);

;

exports.default = XmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlhtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJYbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9tb2RlbFR5cGUiLCJfZGVjb2RlciIsInBhcmFtcyIsImdldCIsInJlc2V0IiwibmFtZSIsInZhbHVlIiwic2V0TGlrZWxpaG9vZFdpbmRvdyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic3RhdGVzIiwiY29uZmlndXJhdGlvbiIsImRlZmF1bHRfcGFyYW1ldGVycyIsInVuZGVmaW5lZCIsInNldE1vZGVsIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwiZ2V0TnVtYmVyT2ZDbGFzc2VzIiwiZ2V0UmVncmVzc2lvblZlY3RvclNpemUiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmcmFtZSIsImluQXJyYXkiLCJBcnJheSIsImRhdGEiLCJsZW5ndGgiLCJpIiwicmVzIiwiZmlsdGVyIiwib3V0RGF0YSIsImxpa2VsaWhvb2RzIiwib3V0cHV0VmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUdBLElBQU1BLGNBQWM7QUFDbEJDLFNBQU87QUFDTEMsVUFBTSxLQUREO0FBRUxDLGFBQVMsSUFGSjtBQUdMQyxjQUFVLElBSEw7QUFJTEMsV0FBTyxFQUFFQyxNQUFNLFFBQVI7QUFKRixHQURXO0FBT2xCQyxvQkFBa0I7QUFDaEJMLFVBQU0sU0FEVTtBQUVoQkMsYUFBUyxFQUZPO0FBR2hCSyxTQUFLLENBSFc7QUFJaEJDLFNBQUs7QUFKVyxHQVBBO0FBYWxCQyxVQUFRO0FBQ05SLFVBQU0sTUFEQTtBQUVOQyxhQUFT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R0FBWixDQUFnQixRQUFoQixNQUE4QixhQUFsQyxFQUFpRDtBQUMvQ3lCLGtCQUFVRixJQUFJRyxXQUFkO0FBQ0QsT0FGRCxNQUVPO0FBQ0xELGtCQUFVRixJQUFJSSxZQUFkO0FBQ0Q7O0FBRUQsVUFBTVAsT0FBTyxLQUFLSCxLQUFMLENBQVdHLElBQXhCO0FBQ0EsVUFBTVAsWUFBWSxLQUFLRCxZQUFMLENBQWtCQyxTQUFwQzs7QUFFQSxXQUFLLElBQUlTLEtBQUksQ0FBYixFQUFnQkEsS0FBSVQsU0FBcEIsRUFBK0JTLElBQS9CLEVBQW9DO0FBQ2xDRixhQUFLRSxFQUFMLElBQVVHLFFBQVFILEVBQVIsQ0FBVjtBQUNEOztBQUVELFVBQUk1QixRQUFKLEVBQWM7QUFDWkEsaUJBQVM2QixHQUFUO0FBQ0Q7QUFDRjs7Ozs7QUFDRjs7a0JBRWM1QixhIiwiZmlsZSI6IlhtbURlY29kZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlTGZvIH0gZnJvbSAnd2F2ZXMtbGZvL2NvcmUnO1xuaW1wb3J0IHsgR21tRGVjb2RlciwgSGhtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbW9kZWw6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sIFxuICBsaWtlbGlob29kV2luZG93OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIwLFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDFlMzAsXG4gIH0sXG4gIG91dHB1dDoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbGlrZWxpaG9vZHMnLFxuICAgIGxpc3Q6IFsnbGlrZWxpaG9vZHMnLCAncmVncmVzc2lvbiddLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cblxuLyoqXG4gKiBDYWxsYmFjayBoYW5kbGluZyB0aGUgZnVsbCBmaWx0ZXJpbmcgcmVzdWx0cy5cbiAqIEBjYWxsYmFjayBmaWx0ZXJDYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IHJlcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBmaWx0ZXJpbmcgcmVzdWx0cy5cbiAqL1xuXG4vKipcbiAqIExmbyBjbGFzcyBsb2FkaW5nIGFueSBtb2RlbCAoR01NIG9yIEhITU0pIGNyZWF0ZWQgYnkgdGhlIHhtbSBsaWJyYXJ5IGFuZFxuICogYXV0b21hdGljYWxseSBpbnN0YW50aWF0aW5nIHRoZSBjb3JyZXNwb25kaW5nIGRlY29kZXIgaW50ZXJuYWxseSB0b1xuICogcHJvY2VzcyBhbiBpbnB1dCBzdHJlYW0gb2YgdmVjdG9ycyAobW9kZWxzIG11c3QgaGF2ZSBiZWVuIHRyYWluZWQgZnJvbSB0aGVcbiAqIHNhbWUgaW5wdXQgc3RyZWFtKS5cbiAqIEFzIHRoZSByZXN1bHRzIG9mIHRoZSBjbGFzc2lmaWNhdGlvbiAvIGZvbGxvd2luZyAvIHJlZ3Jlc3Npb24gYXJlIG1vcmVcbiAqIGNvbXBsZXggdGhhbiBhIHNpbXBsZSB2ZWN0b3IsIGEgY2FsbGJhY2sgZnVuY3Rpb24gY2FuIGJlIHBhc3NlZCB0byB0aGVcbiAqIGNvbnN0cnVjdG9yIHRvIGhhbmRsZSB0aGVtLlxuICogQGNsYXNzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0cy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5tb2RlbD1udWxsXSAtIEFueSBtb2RlbCBmcm9tIHRoZSBYTU0gbGlicmFyeS5cbiAqIEBwYXJhbSB7TnVtYmVyfSBbb3B0aW9ucy5saWtlbGlob29kV2luZG93PTIwXSAtIExpa2VsaWhvb2Qgd2luZG93IHNpemUgKHNtb290aHMgb3V0cHV0KS5cbiAqIEBwYXJhbSB7KCdsaWtlbGlob29kcyd8J3JlZ3Jlc3Npb24nKX0gW29wdGlvbnMub3V0cHV0PSdsaWtlbGlob29kcyddIC0gV2hpY2ggaW5mb3JtYXRpb24gdG8gb3V0cHV0LlxuICogQHBhcmFtIHtmaWx0ZXJDYWxsYmFja30gW29wdGlvbnMuY2FsbGJhY2s9bnVsbF1cbiovXG5jbGFzcyBYbW1EZWNvZGVyTGZvIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX21vZGVsVHlwZSA9ICdoaG1tJztcbiAgICB0aGlzLl9kZWNvZGVyID0gbmV3IEhobW1EZWNvZGVyKHRoaXMucGFyYW1zLmdldCgnbGlrZWxpaG9vZFdpbmRvdycpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGludGVybWVkaWF0ZSByZXN1bHRzIG9mIHRoZSBlc3RpbWF0aW9uIGlmIHRoZSBtb2RlbCBpcyBhIEhITU0uXG4gICAqL1xuICByZXNldCgpIHtcbiAgICBpZiAodGhpcy5fbW9kZWxUeXBlID09PSAnaGhtbScpIHtcbiAgICAgIHRoaXMuX2RlY29kZXIucmVzZXQoKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2xpa2VsaWhvb2RXaW5kb3cnKSB7XG4gICAgICB0aGlzLl9kZWNvZGVyLnNldExpa2VsaWhvb2RXaW5kb3codmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIGNvbnN0IG1vZGVsID0gdGhpcy5wYXJhbXMuZ2V0KCdtb2RlbCcpO1xuICAgIGNvbnN0IHN0YXRlcyA9IG1vZGVsLmNvbmZpZ3VyYXRpb24uZGVmYXVsdF9wYXJhbWV0ZXJzLnN0YXRlcztcblxuICAgIGlmIChzdGF0ZXMgIT09IG51bGwgJiYgc3RhdGVzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgIHRoaXMuX21vZGVsVHlwZSA9ICdoaG1tJztcbiAgICAgIHRoaXMuX2RlY29kZXIgPSBuZXcgSGhtbURlY29kZXIodGhpcy5wYXJhbXMuZ2V0KCdsaWtlbGlob29kV2luZG93JykpO1xuICAgIH0gZWxzZSB7XG4gICAgICB0aGlzLl9tb2RlbFR5cGUgPSAnZ21tJztcbiAgICAgIHRoaXMuX2RlY29kZXIgPSBuZXcgR21tRGVjb2Rlcih0aGlzLnBhcmFtcy5nZXQoJ2xpa2VsaWhvb2RXaW5kb3cnKSk7XG4gICAgfVxuXG4gICAgdGhpcy5fZGVjb2Rlci5zZXRNb2RlbChtb2RlbCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5nZXROdW1iZXJPZkNsYXNzZXMoKTtcbiAgICB9IGVsc2UgeyAvLyA9PT0gJ3JlZ3Jlc3Npb24nXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLmdldFJlZ3Jlc3Npb25WZWN0b3JTaXplKCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgY29uc3QgaW5BcnJheSA9IG5ldyBBcnJheShmcmFtZS5kYXRhLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbkFycmF5W2ldID0gZnJhbWUuZGF0YVtpXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXMgPSB0aGlzLl9kZWNvZGVyLmZpbHRlcihpbkFycmF5KTtcbiAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcbiAgICBsZXQgb3V0RGF0YTtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgb3V0RGF0YSA9IHJlcy5saWtlbGlob29kcztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0RGF0YSA9IHJlcy5vdXRwdXRWYWx1ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBkYXRhW2ldID0gb3V0RGF0YVtpXTtcbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBYbW1EZWNvZGVyTGZvOyJdfQ==