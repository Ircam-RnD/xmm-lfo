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
          }if (callback) callback(res);
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
}(_BaseLfo2.BaseLfo);

;

exports.default = GmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJHbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9kZWNvZGVyIiwicGFyYW1zIiwibmFtZSIsInZhbHVlIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJnZXQiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJuYkNsYXNzZXMiLCJyZWdyZXNzaW9uU2l6ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImZyYW1lIiwiZmlsdGVyIiwiZXJyIiwicmVzIiwicmVzRGF0YSIsImxpa2VsaWhvb2RzIiwiZGF0YSIsImkiLCJwcm9wYWdhdGVGcmFtZSIsInByZXBhcmVGcmFtZSIsInByb2Nlc3NGdW5jdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7QUFHQSxJQUFNQSxjQUFjO0FBQ2xCQyxTQUFPO0FBQ0xDLFVBQU0sS0FERDtBQUVMQyxhQUFTLElBRko7QUFHTEMsY0FBVSxJQUhMO0FBSUxDLFdBQU8sRUFBRUMsTUFBTSxRQUFSO0FBSkYsR0FEVztBQU9sQkMsb0JBQWtCO0FBQ2hCTCxVQUFNLFNBRFU7QUFFaEJDLGFBQVMsRUFGTztBQUdoQkssU0FBSyxDQUhXO0FBSWhCQyxTQUFLO0FBSlcsR0FQQTtBQWFsQkMsVUFBUTtBQUNOUixVQUFNLE1BREE7QUFFTkMsYUFBUyxhQUZIO0FBR05RLFVBQU0sQ0FBQyxhQUFELEVBQWdCLFlBQWhCLENBSEE7QUFJTkMsY0FBVTtBQUpKLEdBYlU7QUFvQmxCQyxZQUFVO0FBQ1JYLFVBQU0sS0FERTtBQUVSQyxhQUFTLElBRkQ7QUFHUkMsY0FBVSxJQUhGO0FBSVJDLFdBQU8sRUFBRUMsTUFBTSxTQUFSO0FBSkM7QUFwQlEsQ0FBcEI7O0FBNkJBOzs7Ozs7Ozs7Ozs7O0lBWU1RLGE7OztBQUNKLDJCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLG9KQUNsQmYsV0FEa0IsRUFDTGUsT0FESzs7QUFHeEIsVUFBS0MsUUFBTCxHQUFnQiwwQkFBZSxNQUFLQyxNQUFMLENBQVlWLGdCQUEzQixDQUFoQjtBQUh3QjtBQUl6Qjs7QUFFRDs7Ozs7a0NBQ2NXLEksRUFBTUMsSyxFQUFPZCxLLEVBQU87QUFDaEMsd0pBQW9CYSxJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUNkLEtBQWpDOztBQUVBLFVBQUlhLFNBQVMsa0JBQWIsRUFBaUM7QUFDL0IsYUFBS0YsUUFBTCxDQUFjVCxnQkFBZCxHQUFpQ1ksS0FBakM7QUFDRDtBQUNGOztBQUVEOzs7OzBDQUMyQztBQUFBLFVBQXZCQyxnQkFBdUIsdUVBQUosRUFBSTs7QUFDekMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxXQUFLSixRQUFMLENBQWNmLEtBQWQsR0FBc0IsS0FBS2dCLE1BQUwsQ0FBWUssR0FBWixDQUFnQixPQUFoQixDQUF0Qjs7QUFFQSxVQUFJLEtBQUtMLE1BQUwsQ0FBWUssR0FBWixDQUFnQixRQUFoQixNQUE4QixhQUFsQyxFQUFpRDtBQUMvQyxhQUFLQyxZQUFMLENBQWtCQyxTQUFsQixHQUE4QixLQUFLUixRQUFMLENBQWNTLFNBQTVDO0FBQ0QsT0FGRCxNQUVPO0FBQUU7QUFDUCxhQUFLRixZQUFMLENBQWtCQyxTQUFsQixHQUE4QixLQUFLUixRQUFMLENBQWNVLGNBQTVDO0FBQ0Q7O0FBRUQsV0FBS0MscUJBQUw7QUFDRDs7QUFFRDs7OztrQ0FDY0MsSyxFQUFPO0FBQUE7O0FBQ25CLFdBQUtaLFFBQUwsQ0FBY2EsTUFBZCxDQUFxQkQsS0FBckIsRUFBNEIsVUFBQ0UsR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDeEMsWUFBTWxCLFdBQVcsT0FBS0ksTUFBTCxDQUFZSyxHQUFaLENBQWdCLFVBQWhCLENBQWpCO0FBQ0EsWUFBTVUsVUFBVUQsSUFBSUUsV0FBcEI7QUFDQSxZQUFNQyxPQUFPLE9BQUtOLEtBQUwsQ0FBV00sSUFBeEI7QUFDQSxZQUFNVixZQUFZLE9BQUtELFlBQUwsQ0FBa0JDLFNBQXBDOztBQUVBLFlBQUlNLE9BQU8sSUFBWCxFQUFpQjtBQUNmLGVBQUssSUFBSUssSUFBSSxDQUFiLEVBQWdCQSxJQUFJWCxTQUFwQixFQUErQlcsR0FBL0I7QUFDRUQsaUJBQUtDLENBQUwsSUFBVUgsUUFBUUcsQ0FBUixDQUFWO0FBREYsV0FHQSxJQUFJdEIsUUFBSixFQUNFQSxTQUFTa0IsR0FBVDtBQUNIOztBQUVELGVBQUtLLGNBQUw7QUFDRCxPQWZEO0FBZ0JEOztBQUVEOzs7O2lDQUNhUixLLEVBQU87QUFDbEIsV0FBS1MsWUFBTCxDQUFrQlQsS0FBbEI7QUFDQSxXQUFLVSxlQUFMLENBQXFCVixLQUFyQjtBQUNEOzs7OztBQUNGOztrQkFFY2QsYSIsImZpbGUiOiJHbW1EZWNvZGVyTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUxmbyB9IGZyb20gJ3dhdmVzLWxmby9jb21tb24vY29yZS9CYXNlTGZvJztcbmltcG9ydCB7IEdtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbW9kZWw6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sIFxuICBsaWtlbGlob29kV2luZG93OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIwLFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDFlMzAsXG4gIH0sXG4gIG91dHB1dDoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbGlrZWxpaG9vZHMnLFxuICAgIGxpc3Q6IFsnbGlrZWxpaG9vZHMnLCAncmVncmVzc2lvbiddLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICAgIC8vIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfVxufTtcblxuXG4vKipcbiAqIExmbyBjbGFzcyBsb2FkaW5nIEdNTSBtb2RlbHMgY3JlYXRlZCBieSB0aGUgeG1tIGxpYnJhcnkgdG8gcHJvY2VzcyBhbiBpbnB1dFxuICogc3RyZWFtIG9mIHZlY3RvcnMgKG1vZGVscyBtdXN0IGhhdmUgYmVlbiB0cmFpbmVkIGZyb20gdGhlIHNhbWUgaW5wdXQgc3RyZWFtKS5cbiAqIEFzIHRoZSByZXN1bHRzIG9mIHRoZSBjbGFzc2lmaWNhdGlvbiAvIHJlZ3Jlc3Npb24gYXJlIG1vcmUgY29tcGxleCB0aGFuIGFcbiAqIHNpbXBsZSB2ZWN0b3IsIGEgY2FsbGJhY2sgZnVuY3Rpb24gY2FuIGJlIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IgdG8gaGFuZGxlXG4gKiB0aGVtLCBvciB0aGV5IGNhbiBhbHRlcm5hdGl2ZWx5IGJlIHF1ZXJpZWQgdmlhIHRoZSByZWFkb25seSBmaWx0ZXJSZXN1bHRzXG4gKiBwcm9wZXJ0eS5cbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHRzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm1vZGVsPW51bGxdIC0gTW9kZWwgY29tbWluZyBmcm9tIC4uLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLmxpa2VsaWhvb2RXaW5kb3c9MjBdIC0gTnVtYmVyIG9mIGxpbGlrZWxpaG9vZFxuICovXG5jbGFzcyBHbW1EZWNvZGVyTGZvIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2RlY29kZXIgPSBuZXcgR21tRGVjb2Rlcih0aGlzLnBhcmFtcy5saWtlbGlob29kV2luZG93KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGlmIChuYW1lID09PSAnbGlrZWxpaG9vZFdpbmRvdycpIHtcbiAgICAgIHRoaXMuX2RlY29kZXIubGlrZWxpaG9vZFdpbmRvdyA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuX2RlY29kZXIubW9kZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ21vZGVsJyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5uYkNsYXNzZXM7XG4gICAgfSBlbHNlIHsgLy8gPT09ICdyZWdyZXNzaW9uJ1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5yZWdyZXNzaW9uU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICB0aGlzLl9kZWNvZGVyLmZpbHRlcihmcmFtZSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcbiAgICAgIGNvbnN0IHJlc0RhdGEgPSByZXMubGlrZWxpaG9vZHM7XG4gICAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgICBpZiAoZXJyID09IG51bGwpIHtcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykgXG4gICAgICAgICAgZGF0YVtpXSA9IHJlc0RhdGFbaV07XG4gICAgICAgIFxuICAgICAgICBpZiAoY2FsbGJhY2spIFxuICAgICAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZShmcmFtZSk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHbW1EZWNvZGVyTGZvOyJdfQ==