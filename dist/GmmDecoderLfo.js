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

// import * as lfo from 'waves-lfo/client';

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

      var inArray = new Array(frame.data.length);
      for (var i = 0; i < inArray.length; i++) {
        inArray[i] = frame.data[i];
      }

      this._decoder.filter(inArray, function (err, res) {
        if (err === null) {
          var callback = _this2.params.get('callback');

          var resData = void 0;
          if (_this2.params.get('output') === 'likelihoods') {
            resData = res.likelihoods;
          } else {
            resData = res.regression; // this is not implemented in xmm-client !!!
          }

          var data = _this2.frame.data;
          var frameSize = _this2.streamParams.frameSize;

          for (var _i = 0; _i < frameSize; _i++) {
            data[_i] = resData[_i];
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

exports.default = GmmDecoderLfo;
;

// export default GmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJHbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9kZWNvZGVyIiwicGFyYW1zIiwibmFtZSIsInZhbHVlIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJnZXQiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJuYkNsYXNzZXMiLCJyZWdyZXNzaW9uU2l6ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImZyYW1lIiwiaW5BcnJheSIsIkFycmF5IiwiZGF0YSIsImxlbmd0aCIsImkiLCJmaWx0ZXIiLCJlcnIiLCJyZXMiLCJyZXNEYXRhIiwibGlrZWxpaG9vZHMiLCJyZWdyZXNzaW9uIiwicHJvcGFnYXRlRnJhbWUiLCJwcmVwYXJlRnJhbWUiLCJwcm9jZXNzRnVuY3Rpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFHQSxJQUFNQSxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sS0FERDtBQUVMQyxhQUFTLElBRko7QUFHTEMsY0FBVSxJQUhMO0FBSUxDLFdBQU8sRUFBRUMsTUFBTSxRQUFSO0FBSkYsR0FEVztBQU9sQkMsb0JBQWtCO0FBQ2hCTCxVQUFNLFNBRFU7QUFFaEJDLGFBQVMsRUFGTztBQUdoQkssU0FBSyxDQUhXO0FBSWhCQyxTQUFLO0FBSlcsR0FQQTtBQWFsQkMsVUFBUTtBQUNOUixVQUFNLE1BREE7QUFFTkMsYUFBUyxhQUZIO0FBR05RLFVBQU0sQ0FBQyxhQUFELEVBQWdCLFlBQWhCLENBSEE7QUFJTkMsY0FBVTtBQUpKLEdBYlU7QUFtQmxCQyxZ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c0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbi9jb3JlL0Jhc2VMZm8nO1xuLy8gaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuaW1wb3J0IHsgR21tRGVjb2RlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBtb2RlbDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSwgXG4gIGxpa2VsaWhvb2RXaW5kb3c6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjAsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWUzMCxcbiAgfSxcbiAgb3V0cHV0OiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGRlZmF1bHQ6ICdsaWtlbGlob29kcycsXG4gICAgbGlzdDogWydsaWtlbGlob29kcycsICdyZWdyZXNzaW9uJ10sXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfVxufTtcblxuXG4vKipcbiAqIExmbyBjbGFzcyBsb2FkaW5nIEdNTSBtb2RlbHMgY3JlYXRlZCBieSB0aGUgeG1tIGxpYnJhcnkgdG8gcHJvY2VzcyBhbiBpbnB1dFxuICogc3RyZWFtIG9mIHZlY3RvcnMgKG1vZGVscyBtdXN0IGhhdmUgYmVlbiB0cmFpbmVkIGZyb20gdGhlIHNhbWUgaW5wdXQgc3RyZWFtKS5cbiAqIEFzIHRoZSByZXN1bHRzIG9mIHRoZSBjbGFzc2lmaWNhdGlvbiAvIHJlZ3Jlc3Npb24gYXJlIG1vcmUgY29tcGxleCB0aGFuIGFcbiAqIHNpbXBsZSB2ZWN0b3IsIGEgY2FsbGJhY2sgZnVuY3Rpb24gY2FuIGJlIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IgdG8gaGFuZGxlXG4gKiB0aGVtLCBvciB0aGV5IGNhbiBhbHRlcm5hdGl2ZWx5IGJlIHF1ZXJpZWQgdmlhIHRoZSByZWFkb25seSBmaWx0ZXJSZXN1bHRzXG4gKiBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHRzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm1vZGVsPW51bGxdIC0gTW9kZWwgY29tbWluZyBmcm9tIC4uLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmxpa2VsaWhvb2RXaW5kb3c9MjBdIC0gTnVtYmVyIG9mIGxpbGlrZWxpaG9vZFxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBHbW1EZWNvZGVyTGZvIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2RlY29kZXIgPSBuZXcgR21tRGVjb2Rlcih0aGlzLnBhcmFtcy5saWtlbGlob29kV2luZG93KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGlmIChuYW1lID09PSAnbGlrZWxpaG9vZFdpbmRvdycpIHtcbiAgICAgIHRoaXMuX2RlY29kZXIubGlrZWxpaG9vZFdpbmRvdyA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuX2RlY29kZXIubW9kZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ21vZGVsJyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5uYkNsYXNzZXM7XG4gICAgfSBlbHNlIHsgLy8gPT09ICdyZWdyZXNzaW9uJ1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5yZWdyZXNzaW9uU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICBjb25zdCBpbkFycmF5ID0gbmV3IEFycmF5KGZyYW1lLmRhdGEubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluQXJyYXlbaV0gPSBmcmFtZS5kYXRhW2ldO1xuICAgIH1cblxuICAgIHRoaXMuX2RlY29kZXIuZmlsdGVyKGluQXJyYXksIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVyciA9PT0gbnVsbCkge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcblxuICAgICAgICBsZXQgcmVzRGF0YTtcbiAgICAgICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgICAgICByZXNEYXRhID0gcmVzLmxpa2VsaWhvb2RzO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHJlc0RhdGEgPSByZXMucmVncmVzc2lvbjsgLy8gdGhpcyBpcyBub3QgaW1wbGVtZW50ZWQgaW4geG1tLWNsaWVudCAhISFcbiAgICAgICAgfVxuXG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICAgICAgZGF0YVtpXSA9IHJlc0RhdGFbaV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKGZyYW1lKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gIH1cbn07XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEdtbURlY29kZXJMZm87Il19