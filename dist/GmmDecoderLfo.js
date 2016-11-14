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
      var inArray = new Array(frame.data.length);
      for (var i = 0; i < inArray.length; i++) {
        inArray[i] = frame.data[i];
      }

      // this._decoder.filter(inArray, (err, res) => {
      //   if (err === null) {
      //     const callback = this.params.get('callback');

      //     let resData;
      //     if (this.params.get('output') === 'likelihoods') {
      //       resData = res.likelihoods;
      //     } else {
      //       resData = res.regression; // this is not implemented in xmm-client !!!
      //     }

      //     const data = this.frame.data;
      //     const frameSize = this.streamParams.frameSize;

      //     for (let i = 0; i < frameSize; i++) {
      //       data[i] = resData[i];
      //     }

      //     if (callback) {
      //       callback(res);
      //     }
      //   }

      //   this.propagateFrame();
      // });

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

    /** @private */
    // processFrame(frame) {
    //   this.prepareFrame(frame);
    //   this.processFunction(frame);
    // }

  }]);
  return GmmDecoderLfo;
}(_BaseLfo3.default);

;

exports.default = GmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJHbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9kZWNvZGVyIiwicGFyYW1zIiwibmFtZSIsInZhbHVlIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJnZXQiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJuYkNsYXNzZXMiLCJyZWdyZXNzaW9uU2l6ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImZyYW1lIiwiaW5BcnJheSIsIkFycmF5IiwiZGF0YSIsImxlbmd0aCIsImkiLCJyZXMiLCJmaWx0ZXIiLCJvdXREYXRhIiwibGlrZWxpaG9vZHMiLCJvdXRwdXRWYWx1ZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFHQSxJQUFNQSxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sS0FERDtBQUVMQyxhQUFTLElBRko7QUFHTEMsY0FBVSxJQUhMO0FBSUxDLFdBQU8sRUFBRUMsTUFBTSxRQUFSO0FBSkYsR0FEVztBQU9sQkMsb0JBQWtCO0FBQ2hCTCxVQUFNLFNBRFU7QUFFaEJDLGFBQVMsRUFGTztBQUdoQkssU0FBSyxDQUhXO0FBSWhCQyxTQUFLO0FBSlcsR0FQQTtBQWFsQkMsVUFBUTtBQUNOUixVQUFNLE1BREE7QUFFTkMsYUFBUyxhQUZIO0FBR05RLFVBQU0sQ0FBQyxhQUFELEVBQWdCLFlBQWhCLENBSEE7QUFJTkMsY0FBVTtBQUpKLEdBYlU7QUFtQmxCQyxZQUFVO0FBQ1JYLFVBQU0sS0FERTtBQUVSQyxhQUFTLElBRkQ7QUFHUkMsY0FBVSxJQUhGO0FBSVJDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSkM7QUFuQlEsQ0FBcEI7O0FBNEJBOzs7Ozs7Ozs7Ozs7O0FBaENBOztJQTRDTVEsYTs7O0FBQ0osMkJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsb0pBQ2xCZixXQURrQixFQUNMZSxPQURLOztBQUd4QixVQUFLQyxRQUFMLEdBQWdCLDBCQUFlLE1BQUtDLE1BQUwsQ0FBWVYsZ0JBQTNCLENBQWhCO0FBSHdCO0FBSXpCOztBQUVEOzs7OztrQ0FDY1csSSxFQUFNQyxLLEVBQU9kLEssRUFBTztBQUNoQyx3SkFBb0JhLElBQXBCLEVBQTBCQyxLQUExQixFQUFpQ2QsS0FBakM7O0FBRUEsVUFBSWEsU0FBUyxrQkFBYixFQUFpQztBQUMvQixhQUFLRixRQUFMLENBQWNULGdCQUFkLEdBQWlDWSxLQUFqQztBQUNEO0FBQ0Y7O0FBRUQ7Ozs7MENBQzJDO0FBQUEsVUFBdkJDLGdCQUF1Qix1RUFBSixFQUFJOztBQUN6QyxXQUFLQyxtQkFBTCxDQUF5QkQsZ0JBQXpCOztBQUVBLFdBQUtKLFFBQUwsQ0FBY2YsS0FBZCxHQUFzQixLQUFLZ0IsTUFBTCxDQUFZSyxHQUFaLENBQWdCLE9BQWhCLENBQXRCOztBQUVBLFVBQUksS0FBS0wsTUFBTCxDQUFZSyxHQUFaLENBQWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DLGFBQUtDLFlBQUwsQ0FBa0JDLFNBQWxCLEdBQThCLEtBQUtSLFFBQUwsQ0FBY1MsU0FBNUM7QUFDRCxPQUZELE1BRU87QUFBRTtBQUNQLGFBQUtGLFlBQUwsQ0FBa0JDLFNBQWxCLEdBQThCLEtBQUtSLFFBQUwsQ0FBY1UsY0FBNUM7QUFDRDs7QUFFRCxXQUFLQyxxQkFBTDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFDbkIsVUFBTUMsVUFBVSxJQUFJQyxLQUFKLENBQVVGLE1BQU1HLElBQU4sQ0FBV0MsTUFBckIsQ0FBaEI7QUFDQSxXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUosUUFBUUcsTUFBNUIsRUFBb0NDLEdBQXBDLEVBQXlDO0FBQ3ZDSixnQkFBUUksQ0FBUixJQUFhTCxNQUFNRyxJQUFOLENBQVdFLENBQVgsQ0FBYjtBQUNEOztBQUVEO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQSxVQUFNQyxNQUFNLEtBQUtsQixRQUFMLENBQWNtQixNQUFkLENBQXFCTixPQUFyQixDQUFaO0FBQ0EsVUFBTWhCLFdBQVcsS0FBS0ksTUFBTCxDQUFZSyxHQUFaLENBQWdCLFVBQWhCLENBQWpCO0FBQ0EsVUFBSWMsZ0JBQUo7QUFDQSxVQUFJLEtBQUtuQixNQUFMLENBQVlLLEdBQVosQ0FBZ0IsUUFBaEIsTUFBOEIsYUFBbEMsRUFBaUQ7QUFDL0NjLGtCQUFVRixJQUFJRyxXQUFkO0FBQ0QsT0FGRCxNQUVPO0FBQ0xELGtCQUFVRixJQUFJSSxZQUFkO0FBQ0Q7O0FBRUQsVUFBTVAsT0FBTyxLQUFLSCxLQUFMLENBQVdHLElBQXhCO0FBQ0EsVUFBTVAsWUFBWSxLQUFLRCxZQUFMLENBQWtCQyxTQUFwQzs7QUFFQSxXQUFLLElBQUlTLEtBQUksQ0FBYixFQUFnQkEsS0FBSVQsU0FBcEIsRUFBK0JTLElBQS9CLEVBQW9DO0FBQ2xDRixhQUFLRSxFQUFMLElBQVVHLFFBQVFILEVBQVIsQ0FBVjtBQUNEOztBQUVELFVBQUlwQixRQUFKLEVBQWM7QUFDWkEsaUJBQVNxQixHQUFUO0FBQ0Q7QUFDRjs7QUFFRDtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7Ozs7QUFDRDs7a0JBRWNwQixhIiwiZmlsZSI6IkdtbURlY29kZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG4vLyBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG5pbXBvcnQgeyBHbW1EZWNvZGVyIH0gZnJvbSAneG1tLWNsaWVudCc7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIG1vZGVsOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LCBcbiAgbGlrZWxpaG9vZFdpbmRvdzoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyMCxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAxZTMwLFxuICB9LFxuICBvdXRwdXQ6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ2xpa2VsaWhvb2RzJyxcbiAgICBsaXN0OiBbJ2xpa2VsaWhvb2RzJywgJ3JlZ3Jlc3Npb24nXSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59O1xuXG5cbi8qKlxuICogTGZvIGNsYXNzIGxvYWRpbmcgR01NIG1vZGVscyBjcmVhdGVkIGJ5IHRoZSB4bW0gbGlicmFyeSB0byBwcm9jZXNzIGFuIGlucHV0XG4gKiBzdHJlYW0gb2YgdmVjdG9ycyAobW9kZWxzIG11c3QgaGF2ZSBiZWVuIHRyYWluZWQgZnJvbSB0aGUgc2FtZSBpbnB1dCBzdHJlYW0pLlxuICogQXMgdGhlIHJlc3VsdHMgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIC8gcmVncmVzc2lvbiBhcmUgbW9yZSBjb21wbGV4IHRoYW4gYVxuICogc2ltcGxlIHZlY3RvciwgYSBjYWxsYmFjayBmdW5jdGlvbiBjYW4gYmUgcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3RvciB0byBoYW5kbGVcbiAqIHRoZW0sIG9yIHRoZXkgY2FuIGFsdGVybmF0aXZlbHkgYmUgcXVlcmllZCB2aWEgdGhlIHJlYWRvbmx5IGZpbHRlclJlc3VsdHNcbiAqIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdHMuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubW9kZWw9bnVsbF0gLSBNb2RlbCBjb21taW5nIGZyb20gLi4uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubGlrZWxpaG9vZFdpbmRvdz0yMF0gLSBOdW1iZXIgb2YgbGlsaWtlbGlob29kXG4gKi9cbmNsYXNzIEdtbURlY29kZXJMZm8gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fZGVjb2RlciA9IG5ldyBHbW1EZWNvZGVyKHRoaXMucGFyYW1zLmxpa2VsaWhvb2RXaW5kb3cpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgaWYgKG5hbWUgPT09ICdsaWtlbGlob29kV2luZG93Jykge1xuICAgICAgdGhpcy5fZGVjb2Rlci5saWtlbGlob29kV2luZG93ID0gdmFsdWU7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5fZGVjb2Rlci5tb2RlbCA9IHRoaXMucGFyYW1zLmdldCgnbW9kZWwnKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLm5iQ2xhc3NlcztcbiAgICB9IGVsc2UgeyAvLyA9PT0gJ3JlZ3Jlc3Npb24nXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLnJlZ3Jlc3Npb25TaXplO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGNvbnN0IGluQXJyYXkgPSBuZXcgQXJyYXkoZnJhbWUuZGF0YS5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaW5BcnJheVtpXSA9IGZyYW1lLmRhdGFbaV07XG4gICAgfVxuXG4gICAgLy8gdGhpcy5fZGVjb2Rlci5maWx0ZXIoaW5BcnJheSwgKGVyciwgcmVzKSA9PiB7XG4gICAgLy8gICBpZiAoZXJyID09PSBudWxsKSB7XG4gICAgLy8gICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdjYWxsYmFjaycpO1xuXG4gICAgLy8gICAgIGxldCByZXNEYXRhO1xuICAgIC8vICAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgIC8vICAgICAgIHJlc0RhdGEgPSByZXMubGlrZWxpaG9vZHM7XG4gICAgLy8gICAgIH0gZWxzZSB7XG4gICAgLy8gICAgICAgcmVzRGF0YSA9IHJlcy5yZWdyZXNzaW9uOyAvLyB0aGlzIGlzIG5vdCBpbXBsZW1lbnRlZCBpbiB4bW0tY2xpZW50ICEhIVxuICAgIC8vICAgICB9XG5cbiAgICAvLyAgICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICAvLyAgICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgLy8gICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAvLyAgICAgICBkYXRhW2ldID0gcmVzRGF0YVtpXTtcbiAgICAvLyAgICAgfVxuICAgICAgICBcbiAgICAvLyAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgLy8gICAgICAgY2FsbGJhY2socmVzKTtcbiAgICAvLyAgICAgfVxuICAgIC8vICAgfVxuXG4gICAgLy8gICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gICAgLy8gfSk7XG5cbiAgICBjb25zdCByZXMgPSB0aGlzLl9kZWNvZGVyLmZpbHRlcihpbkFycmF5KTtcbiAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcbiAgICBsZXQgb3V0RGF0YTtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgb3V0RGF0YSA9IHJlcy5saWtlbGlob29kcztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0RGF0YSA9IHJlcy5vdXRwdXRWYWx1ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBkYXRhW2ldID0gb3V0RGF0YVtpXTtcbiAgICB9XG4gICAgXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhyZXMpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICAvLyBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgLy8gICB0aGlzLnByZXBhcmVGcmFtZShmcmFtZSk7XG4gIC8vICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICAvLyB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHbW1EZWNvZGVyTGZvOyJdfQ==