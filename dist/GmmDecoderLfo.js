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
    metas: { kind: 'static' } },
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
    metas: { kind: 'dynamic' } }
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

    _this._decoder = new _xmmClient.GmmDecoder(_this.params.get('likelihoodWindow'));
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(GmmDecoderLfo, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(GmmDecoderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(GmmDecoderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

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

      this._decoder.setModel(this.params.get('model'));

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
  return GmmDecoderLfo;
}(_BaseLfo3.default);

;

exports.default = GmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJHbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9kZWNvZGVyIiwicGFyYW1zIiwiZ2V0IiwibmFtZSIsInZhbHVlIiwic2V0TGlrZWxpaG9vZFdpbmRvdyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic2V0TW9kZWwiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJnZXROdW1iZXJPZkNsYXNzZXMiLCJnZXRSZWdyZXNzaW9uVmVjdG9yU2l6ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImZyYW1lIiwiaW5BcnJheSIsIkFycmF5IiwiZGF0YSIsImxlbmd0aCIsImkiLCJyZXMiLCJmaWx0ZXIiLCJvdXREYXRhIiwibGlrZWxpaG9vZHMiLCJvdXRwdXRWYWx1ZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFHQSxJQUFNQSxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sS0FERDtBQUVMQyxhQUFTLElBRko7QUFHTEMsY0FBVSxJQUhMO0FBSUxDLFdBQU8sRUFBRUMsTUFBTSxRQUFSLEVBSkYsRUFEVztBQU9sQkMsb0JBQWtCO0FBQ2hCTCxVQUFNLFNBRFU7QUFFaEJDLGFBQVMsRUFGTztBQUdoQkssU0FBSyxDQUhXO0FBSWhCQyxTQUFLO0FBSlcsR0FQQTtBQWFsQkMsVUFBUTtBQUNOUixVQUFNLE1BREE7QUFFTkMsYUFBUyxhQUZIO0FBR05RLFVBQU0sQ0FBQyxhQUFELEVBQWdCLFlBQWhCLENBSEE7QUFJTkMsY0FBVTtBQUpKLEdBYlU7QUFtQmxCQyxZQUFVO0FBQ1JYLFVBQU0sS0FERTtBQUVSQyxhQUFTLElBRkQ7QUFHUkMsY0FBVSxJQUhGO0FBSVJDLFdBQU8sRUFBRUMsTUFBTSxTQUFSLEVBSkM7QUFuQlEsQ0FBcEI7O0FBNEJBOzs7Ozs7Ozs7Ozs7O0FBaENBOztJQTRDTVEsYTs7O0FBQ0osMkJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsb0pBQ2xCZixXQURrQixFQUNMZSxPQURLOztBQUd4QixVQUFLQyxRQUFMLEdBQWdCLDBCQUFlLE1BQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixrQkFBaEIsQ0FBZixDQUFoQjtBQUh3QjtBQUl6Qjs7QUFFRDs7Ozs7a0NBQ2NDLEksRUFBTUMsSyxFQUFPZixLLEVBQU87QUFDaEMsd0pBQW9CYyxJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUNmLEtBQWpDOztBQUVBLFVBQUljLFNBQVMsa0JBQWIsRUFBaUM7QUFDL0IsYUFBS0gsUUFBTCxDQUFjSyxtQkFBZCxDQUFrQ0QsS0FBbEM7QUFDRDtBQUNGOztBQUVEOzs7OzBDQUMyQztBQUFBLFVBQXZCRSxnQkFBdUIsdUVBQUosRUFBSTs7QUFDekMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxXQUFLTixRQUFMLENBQWNRLFFBQWQsQ0FBdUIsS0FBS1AsTUFBTCxDQUFZQyxHQUFaLENBQWdCLE9BQWhCLENBQXZCOztBQUVBLFVBQUksS0FBS0QsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DLGFBQUtPLFlBQUwsQ0FBa0JDLFNBQWxCLEdBQThCLEtBQUtWLFFBQUwsQ0FBY1csa0JBQWQsRUFBOUI7QUFDRCxPQUZELE1BRU87QUFBRTtBQUNQLGFBQUtGLFlBQUwsQ0FBa0JDLFNBQWxCLEdBQThCLEtBQUtWLFFBQUwsQ0FBY1ksdUJBQWQsRUFBOUI7QUFDRDs7QUFFRCxXQUFLQyxxQkFBTDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFDbkIsVUFBTUMsVUFBVSxJQUFJQyxLQUFKLENBQVVGLE1BQU1HLElBQU4sQ0FBV0MsTUFBckIsQ0FBaEI7QUFDQSxXQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSUosUUFBUUcsTUFBNUIsRUFBb0NDLEdBQXBDLEVBQXlDO0FBQ3ZDSixnQkFBUUksQ0FBUixJQUFhTCxNQUFNRyxJQUFOLENBQVdFLENBQVgsQ0FBYjtBQUNEOztBQUVELFVBQU1DLE1BQU0sS0FBS3BCLFFBQUwsQ0FBY3FCLE1BQWQsQ0FBcUJOLE9BQXJCLENBQVo7QUFDQSxVQUFNbEIsV0FBVyxLQUFLSSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsVUFBaEIsQ0FBakI7QUFDQSxVQUFJb0IsZ0JBQUo7QUFDQSxVQUFJLEtBQUtyQixNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsTUFBOEIsYUFBbEMsRUFBaUQ7QUFDL0NvQixrQkFBVUYsSUFBSUcsV0FBZDtBQUNELE9BRkQsTUFFTztBQUNMRCxrQkFBVUYsSUFBSUksWUFBZDtBQUNEOztBQUVELFVBQU1QLE9BQU8sS0FBS0gsS0FBTCxDQUFXRyxJQUF4QjtBQUNBLFVBQU1QLFlBQVksS0FBS0QsWUFBTCxDQUFrQkMsU0FBcEM7O0FBRUEsV0FBSyxJQUFJUyxLQUFJLENBQWIsRUFBZ0JBLEtBQUlULFNBQXBCLEVBQStCUyxJQUEvQixFQUFvQztBQUNsQ0YsYUFBS0UsRUFBTCxJQUFVRyxRQUFRSCxFQUFSLENBQVY7QUFDRDs7QUFFRCxVQUFJdEIsUUFBSixFQUFjO0FBQ1pBLGlCQUFTdUIsR0FBVDtBQUNEO0FBQ0Y7Ozs7O0FBQ0Y7O2tCQUVjdEIsYSIsImZpbGUiOiJHbW1EZWNvZGVyTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbi9jb3JlL0Jhc2VMZm8nO1xuLy8gaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuaW1wb3J0IHsgR21tRGVjb2RlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBtb2RlbDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSwgLy8gdHJpZ3MgdGhlIGNhbGwgdG8gcHJvY2Vzc1N0cmVhbVBhcmFtcyBpZiBjaGFuZ2VkLlxuICB9LCBcbiAgbGlrZWxpaG9vZFdpbmRvdzoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyMCxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAxZTMwLFxuICB9LFxuICBvdXRwdXQ6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ2xpa2VsaWhvb2RzJyxcbiAgICBsaXN0OiBbJ2xpa2VsaWhvb2RzJywgJ3JlZ3Jlc3Npb24nXSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LCAvLyBkb2Vzbid0IHRyaWdnZXIgcHJvY2Vzc1N0cmVhbVBhcmFtcywgaGFzIHRvIGJlIGNoZWNrLlxuICB9XG59O1xuXG5cbi8qKlxuICogTGZvIGNsYXNzIGxvYWRpbmcgR01NIG1vZGVscyBjcmVhdGVkIGJ5IHRoZSB4bW0gbGlicmFyeSB0byBwcm9jZXNzIGFuIGlucHV0XG4gKiBzdHJlYW0gb2YgdmVjdG9ycyAobW9kZWxzIG11c3QgaGF2ZSBiZWVuIHRyYWluZWQgZnJvbSB0aGUgc2FtZSBpbnB1dCBzdHJlYW0pLlxuICogQXMgdGhlIHJlc3VsdHMgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIC8gcmVncmVzc2lvbiBhcmUgbW9yZSBjb21wbGV4IHRoYW4gYVxuICogc2ltcGxlIHZlY3RvciwgYSBjYWxsYmFjayBmdW5jdGlvbiBjYW4gYmUgcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3RvciB0byBoYW5kbGVcbiAqIHRoZW0sIG9yIHRoZXkgY2FuIGFsdGVybmF0aXZlbHkgYmUgcXVlcmllZCB2aWEgdGhlIHJlYWRvbmx5IGZpbHRlclJlc3VsdHNcbiAqIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdHMuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubW9kZWw9bnVsbF0gLSBNb2RlbCBjb21taW5nIGZyb20gLi4uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubGlrZWxpaG9vZFdpbmRvdz0yMF0gLSBOdW1iZXIgb2YgbGlsaWtlbGlob29kXG4gKi9cbmNsYXNzIEdtbURlY29kZXJMZm8gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fZGVjb2RlciA9IG5ldyBHbW1EZWNvZGVyKHRoaXMucGFyYW1zLmdldCgnbGlrZWxpaG9vZFdpbmRvdycpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGlmIChuYW1lID09PSAnbGlrZWxpaG9vZFdpbmRvdycpIHtcbiAgICAgIHRoaXMuX2RlY29kZXIuc2V0TGlrZWxpaG9vZFdpbmRvdyh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5fZGVjb2Rlci5zZXRNb2RlbCh0aGlzLnBhcmFtcy5nZXQoJ21vZGVsJykpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIuZ2V0TnVtYmVyT2ZDbGFzc2VzKCk7XG4gICAgfSBlbHNlIHsgLy8gPT09ICdyZWdyZXNzaW9uJ1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5nZXRSZWdyZXNzaW9uVmVjdG9yU2l6ZSgpO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGNvbnN0IGluQXJyYXkgPSBuZXcgQXJyYXkoZnJhbWUuZGF0YS5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaW5BcnJheVtpXSA9IGZyYW1lLmRhdGFbaV07XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5fZGVjb2Rlci5maWx0ZXIoaW5BcnJheSk7XG4gICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG4gICAgbGV0IG91dERhdGE7XG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIG91dERhdGEgPSByZXMubGlrZWxpaG9vZHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dERhdGEgPSByZXMub3V0cHV0VmFsdWVzO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgZGF0YVtpXSA9IG91dERhdGFbaV07XG4gICAgfVxuICAgIFxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2socmVzKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEdtbURlY29kZXJMZm87Il19