'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = require('waves-lfo/core');

var _xmmClient = require('xmm-client');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var GmmDecoderLfo = function (_BaseLfo) {
  _inherits(GmmDecoderLfo, _BaseLfo);

  function GmmDecoderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, GmmDecoderLfo);

    var _this = _possibleConstructorReturn(this, (GmmDecoderLfo.__proto__ || Object.getPrototypeOf(GmmDecoderLfo)).call(this, definitions, options));

    _this._decoder = new _xmmClient.GmmDecoder(_this.params.get('likelihoodWindow'));
    return _this;
  }

  /** @private */


  _createClass(GmmDecoderLfo, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      _get(GmmDecoderLfo.prototype.__proto__ || Object.getPrototypeOf(GmmDecoderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

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
}(_core.BaseLfo);

;

exports.default = GmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJHbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9kZWNvZGVyIiwicGFyYW1zIiwiZ2V0IiwibmFtZSIsInZhbHVlIiwic2V0TGlrZWxpaG9vZFdpbmRvdyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic2V0TW9kZWwiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJnZXROdW1iZXJPZkNsYXNzZXMiLCJnZXRSZWdyZXNzaW9uVmVjdG9yU2l6ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImZyYW1lIiwiaW5BcnJheSIsIkFycmF5IiwiZGF0YSIsImxlbmd0aCIsImkiLCJyZXMiLCJmaWx0ZXIiLCJvdXREYXRhIiwibGlrZWxpaG9vZHMiLCJvdXRwdXRWYWx1ZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7Ozs7Ozs7QUFHQSxJQUFNQSxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sS0FERDtBQUVMQyxhQUFTLElBRko7QUFHTEMsY0FBVSxJQUhMO0FBSUxDLFdBQU8sRUFBRUMsTUFBTSxRQUFSLEVBSkYsRUFEVztBQU9sQkMsb0JBQWtCO0FBQ2hCTCxVQUFNLFNBRFU7QUFFaEJDLGFBQVMsRUFGTztBQUdoQkssU0FBSyxDQUhXO0FBSWhCQyxTQUFLO0FBSlcsR0FQQTtBQWFsQkMsVUFBUTtBQUNOUixVQUFNLE1BREE7QUFFTkMsYUFBUyxhQUZIO0FBR05RLFVBQU0sQ0FBQyxhQUFELEVBQWdCLFlBQWhCLENBSEE7QUFJTkMsY0FBVTtBQUpKLEdBYlU7QUFtQmxCQyxZQUFVO0FBQ1JYLFVBQU0sS0FERTtBQUVSQyxhQUFTLElBRkQ7QUFHUkMsY0FBVSxJQUhGO0FBSVJDLFdBQU8sRUFBRUMsTUFBTSxTQUFSLEVBSkM7QUFuQlEsQ0FBcEI7O0FBNEJBOzs7Ozs7Ozs7Ozs7O0lBWU1RLGE7OztBQUNKLDJCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSw4SEFDbEJmLFdBRGtCLEVBQ0xlLE9BREs7O0FBR3hCLFVBQUtDLFFBQUwsR0FBZ0IsMEJBQWUsTUFBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLGtCQUFoQixDQUFmLENBQWhCO0FBSHdCO0FBSXpCOztBQUVEOzs7OztrQ0FDY0MsSSxFQUFNQyxLLEVBQU9mLEssRUFBTztBQUNoQyxrSUFBb0JjLElBQXBCLEVBQTBCQyxLQUExQixFQUFpQ2YsS0FBakM7O0FBRUEsVUFBSWMsU0FBUyxrQkFBYixFQUFpQztBQUMvQixhQUFLSCxRQUFMLENBQWNLLG1CQUFkLENBQWtDRCxLQUFsQztBQUNEO0FBQ0Y7O0FBRUQ7Ozs7MENBQzJDO0FBQUEsVUFBdkJFLGdCQUF1Qix1RUFBSixFQUFJOztBQUN6QyxXQUFLQyxtQkFBTCxDQUF5QkQsZ0JBQXpCOztBQUVBLFdBQUtOLFFBQUwsQ0FBY1EsUUFBZCxDQUF1QixLQUFLUCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBdkI7O0FBRUEsVUFBSSxLQUFLRCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsTUFBOEIsYUFBbEMsRUFBaUQ7QUFDL0MsYUFBS08sWUFBTCxDQUFrQkMsU0FBbEIsR0FBOEIsS0FBS1YsUUFBTCxDQUFjVyxrQkFBZCxFQUE5QjtBQUNELE9BRkQsTUFFTztBQUFFO0FBQ1AsYUFBS0YsWUFBTCxDQUFrQkMsU0FBbEIsR0FBOEIsS0FBS1YsUUFBTCxDQUFjWSx1QkFBZCxFQUE5QjtBQUNEOztBQUVELFdBQUtDLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBTztBQUNuQixVQUFNQyxVQUFVLElBQUlDLEtBQUosQ0FBVUYsTUFBTUcsSUFBTixDQUFXQyxNQUFyQixDQUFoQjtBQUNBLFdBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixRQUFRRyxNQUE1QixFQUFvQ0MsR0FBcEMsRUFBeUM7QUFDdkNKLGdCQUFRSSxDQUFSLElBQWFMLE1BQU1HLElBQU4sQ0FBV0UsQ0FBWCxDQUFiO0FBQ0Q7O0FBRUQsVUFBTUMsTUFBTSxLQUFLcEIsUUFBTCxDQUFjcUIsTUFBZCxDQUFxQk4sT0FBckIsQ0FBWjtBQUNBLFVBQU1sQixXQUFXLEtBQUtJLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixVQUFoQixDQUFqQjtBQUNBLFVBQUlvQixnQkFBSjtBQUNBLFVBQUksS0FBS3JCLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixNQUE4QixhQUFsQyxFQUFpRDtBQUMvQ29CLGtCQUFVRixJQUFJRyxXQUFkO0FBQ0QsT0FGRCxNQUVPO0FBQ0xELGtCQUFVRixJQUFJSSxZQUFkO0FBQ0Q7O0FBRUQsVUFBTVAsT0FBTyxLQUFLSCxLQUFMLENBQVdHLElBQXhCO0FBQ0EsVUFBTVAsWUFBWSxLQUFLRCxZQUFMLENBQWtCQyxTQUFwQzs7QUFFQSxXQUFLLElBQUlTLEtBQUksQ0FBYixFQUFnQkEsS0FBSVQsU0FBcEIsRUFBK0JTLElBQS9CLEVBQW9DO0FBQ2xDRixhQUFLRSxFQUFMLElBQVVHLFFBQVFILEVBQVIsQ0FBVjtBQUNEOztBQUVELFVBQUl0QixRQUFKLEVBQWM7QUFDWkEsaUJBQVN1QixHQUFUO0FBQ0Q7QUFDRjs7Ozs7O0FBQ0Y7O2tCQUVjdEIsYSIsImZpbGUiOiJHbW1EZWNvZGVyTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUxmbyB9IGZyb20gJ3dhdmVzLWxmby9jb3JlJztcbmltcG9ydCB7IEdtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbW9kZWw6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sIC8vIHRyaWdzIHRoZSBjYWxsIHRvIHByb2Nlc3NTdHJlYW1QYXJhbXMgaWYgY2hhbmdlZC5cbiAgfSxcbiAgbGlrZWxpaG9vZFdpbmRvdzoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyMCxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAxZTMwLFxuICB9LFxuICBvdXRwdXQ6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ2xpa2VsaWhvb2RzJyxcbiAgICBsaXN0OiBbJ2xpa2VsaWhvb2RzJywgJ3JlZ3Jlc3Npb24nXSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LCAvLyBkb2Vzbid0IHRyaWdnZXIgcHJvY2Vzc1N0cmVhbVBhcmFtcywgaGFzIHRvIGJlIGNoZWNrLlxuICB9XG59O1xuXG5cbi8qKlxuICogTGZvIGNsYXNzIGxvYWRpbmcgR01NIG1vZGVscyBjcmVhdGVkIGJ5IHRoZSB4bW0gbGlicmFyeSB0byBwcm9jZXNzIGFuIGlucHV0XG4gKiBzdHJlYW0gb2YgdmVjdG9ycyAobW9kZWxzIG11c3QgaGF2ZSBiZWVuIHRyYWluZWQgZnJvbSB0aGUgc2FtZSBpbnB1dCBzdHJlYW0pLlxuICogQXMgdGhlIHJlc3VsdHMgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIC8gcmVncmVzc2lvbiBhcmUgbW9yZSBjb21wbGV4IHRoYW4gYVxuICogc2ltcGxlIHZlY3RvciwgYSBjYWxsYmFjayBmdW5jdGlvbiBjYW4gYmUgcGFzc2VkIHRvIHRoZSBjb25zdHJ1Y3RvciB0byBoYW5kbGVcbiAqIHRoZW0sIG9yIHRoZXkgY2FuIGFsdGVybmF0aXZlbHkgYmUgcXVlcmllZCB2aWEgdGhlIHJlYWRvbmx5IGZpbHRlclJlc3VsdHNcbiAqIHByb3BlcnR5LlxuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdHMuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubW9kZWw9bnVsbF0gLSBNb2RlbCBjb21taW5nIGZyb20gLi4uXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubGlrZWxpaG9vZFdpbmRvdz0yMF0gLSBOdW1iZXIgb2YgbGlsaWtlbGlob29kXG4gKi9cbmNsYXNzIEdtbURlY29kZXJMZm8gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fZGVjb2RlciA9IG5ldyBHbW1EZWNvZGVyKHRoaXMucGFyYW1zLmdldCgnbGlrZWxpaG9vZFdpbmRvdycpKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGlmIChuYW1lID09PSAnbGlrZWxpaG9vZFdpbmRvdycpIHtcbiAgICAgIHRoaXMuX2RlY29kZXIuc2V0TGlrZWxpaG9vZFdpbmRvdyh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5fZGVjb2Rlci5zZXRNb2RlbCh0aGlzLnBhcmFtcy5nZXQoJ21vZGVsJykpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIuZ2V0TnVtYmVyT2ZDbGFzc2VzKCk7XG4gICAgfSBlbHNlIHsgLy8gPT09ICdyZWdyZXNzaW9uJ1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5nZXRSZWdyZXNzaW9uVmVjdG9yU2l6ZSgpO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGNvbnN0IGluQXJyYXkgPSBuZXcgQXJyYXkoZnJhbWUuZGF0YS5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaW5BcnJheVtpXSA9IGZyYW1lLmRhdGFbaV07XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5fZGVjb2Rlci5maWx0ZXIoaW5BcnJheSk7XG4gICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG4gICAgbGV0IG91dERhdGE7XG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIG91dERhdGEgPSByZXMubGlrZWxpaG9vZHM7XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dERhdGEgPSByZXMub3V0cHV0VmFsdWVzO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgZGF0YVtpXSA9IG91dERhdGFbaV07XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICBjYWxsYmFjayhyZXMpO1xuICAgIH1cbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgR21tRGVjb2RlckxmbztcbiJdfQ==