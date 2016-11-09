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
        if (err === null) {
          var callback = _this2.params.get('callback');
          var resData = res.likelihoods;
          var data = _this2.frame.data;
          var frameSize = _this2.streamParams.frameSize;

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhobW1EZWNvZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwibW9kZWwiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwibWV0YXMiLCJraW5kIiwibGlrZWxpaG9vZFdpbmRvdyIsIm1pbiIsIm1heCIsIm91dHB1dCIsImxpc3QiLCJjb25zdGFudCIsImNhbGxiYWNrIiwiSGhtbURlY29kZXJMZm8iLCJvcHRpb25zIiwiX2RlY29kZXIiLCJwYXJhbXMiLCJyZXNldCIsIm5hbWUiLCJ2YWx1ZSIsInNldExpa2VsaWhvb2RXaW5kb3ciLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsImdldCIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsIm5iQ2xhc3NlcyIsInJlZ3Jlc3Npb25TaXplIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJmaWx0ZXIiLCJlcnIiLCJyZXMiLCJyZXNEYXRhIiwibGlrZWxpaG9vZHMiLCJkYXRhIiwiaSIsInByb3BhZ2F0ZUZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUNBOzs7O0FBR0EsSUFBTUEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLEtBREQ7QUFFTEMsYUFBUyxJQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPLEVBQUVDLE1BQU0sUUFBUjtBQUpGLEdBRFc7QUFPbEJDLG9CQUFrQjtBQUNoQkwsVUFBTSxTQURVO0FBRWhCQyxhQUFTLEVBRk87QUFHaEJLLFNBQUssQ0FIVztBQUloQkMsU0FBSztBQUpXLEdBUEE7QUFhbEJDLFVBQVE7QUFDTlIsVUFBTSxNQURBO0FBRU5DLGFBQVMsYUFGSDtBQUdOUSxVQUFNLENBQUMsYUFBRCxFQUFnQixZQUFoQixDQUhBO0FBSU5DLGNBQVU7QUFKSixHQWJVO0FBbUJsQkMsWUFBVTtBQUNSWCxVQUFNLEtBREU7QUFFUkMsYUFBUyxJQUZEO0FBR1JDLGNBQVUsSUFIRjtBQUlSQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUpDO0FBbkJRLENBQXBCOztBQTRCQTs7Ozs7Ozs7Ozs7SUFVTVEsYzs7O0FBQ0osNEJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsc0pBQ2xCZixXQURrQixFQUNMZSxPQURLOztBQUd4QixVQUFLQyxRQUFMLEdBQWdCLDJCQUFnQixNQUFLQyxNQUFMLENBQVlWLGdCQUE1QixDQUFoQjtBQUh3QjtBQUl6Qjs7QUFFRDs7Ozs7Ozs0QkFHUTtBQUNOLFdBQUtTLFFBQUwsQ0FBY0UsS0FBZDtBQUNEOztBQUVEOzs7O2tDQUNjQyxJLEVBQU1DLEssRUFBT2YsSyxFQUFPO0FBQ2hDLDBKQUFvQmMsSUFBcEIsRUFBMEJDLEtBQTFCLEVBQWlDZixLQUFqQzs7QUFFQSxVQUFJYyxTQUFTLGtCQUFiLEVBQWlDO0FBQy9CLGFBQUtILFFBQUwsQ0FBY0ssbUJBQWQsQ0FBa0NELEtBQWxDO0FBQ0Q7QUFDRjs7QUFFRDs7OzswQ0FDMkM7QUFBQSxVQUF2QkUsZ0JBQXVCLHVFQUFKLEVBQUk7O0FBQ3pDLFdBQUtDLG1CQUFMLENBQXlCRCxnQkFBekI7O0FBRUEsV0FBS04sUUFBTCxDQUFjZixLQUFkLEdBQXNCLEtBQUtnQixNQUFMLENBQVlPLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBdEI7O0FBRUEsVUFBSSxLQUFLUCxNQUFMLENBQVlPLEdBQVosQ0FBZ0IsUUFBaEIsTUFBOEIsYUFBbEMsRUFBaUQ7QUFDL0MsYUFBS0MsWUFBTCxDQUFrQkMsU0FBbEIsR0FBOEIsS0FBS1YsUUFBTCxDQUFjVyxTQUE1QztBQUNELE9BRkQsTUFFTztBQUFFO0FBQ1AsYUFBS0YsWUFBTCxDQUFrQkMsU0FBbEIsR0FBOEIsS0FBS1YsUUFBTCxDQUFjWSxjQUE1QztBQUNEOztBQUVELFdBQUtDLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBTztBQUFBOztBQUNuQixXQUFLZCxRQUFMLENBQWNlLE1BQWQsQ0FBcUJELEtBQXJCLEVBQTRCLFVBQUNFLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3hDLFlBQUlELFFBQVEsSUFBWixFQUFrQjtBQUNoQixjQUFNbkIsV0FBVyxPQUFLSSxNQUFMLENBQVlPLEdBQVosQ0FBZ0IsVUFBaEIsQ0FBakI7QUFDQSxjQUFNVSxVQUFVRCxJQUFJRSxXQUFwQjtBQUNBLGNBQU1DLE9BQU8sT0FBS04sS0FBTCxDQUFXTSxJQUF4QjtBQUNBLGNBQU1WLFlBQVksT0FBS0QsWUFBTCxDQUFrQkMsU0FBcEM7O0FBRUEsZUFBSyxJQUFJVyxJQUFJLENBQWIsRUFBZ0JBLElBQUlYLFNBQXBCLEVBQStCVyxHQUEvQixFQUFvQztBQUNsQ0QsaUJBQUtDLENBQUwsSUFBVUgsUUFBUUcsQ0FBUixDQUFWO0FBQ0Q7O0FBRUQsY0FBSXhCLFFBQUosRUFBYztBQUNaQSxxQkFBU29CLEdBQVQ7QUFDRDtBQUNGOztBQUVELGVBQUtLLGNBQUw7QUFDRCxPQWpCRDtBQWtCRDs7QUFFRDs7OztpQ0FDYVIsSyxFQUFPO0FBQ2xCLFdBQUtTLFlBQUwsQ0FBa0JULEtBQWxCO0FBQ0EsV0FBS1UsZUFBTCxDQUFxQlYsS0FBckI7QUFDRDs7Ozs7QUFDRjs7a0JBRWNoQixjIiwiZmlsZSI6IkhobW1EZWNvZGVyTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbi9jb3JlL0Jhc2VMZm8nO1xuaW1wb3J0IHsgSGhtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbW9kZWw6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sIFxuICBsaWtlbGlob29kV2luZG93OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIwLFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDFlMzAsXG4gIH0sXG4gIG91dHB1dDoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbGlrZWxpaG9vZHMnLFxuICAgIGxpc3Q6IFsnbGlrZWxpaG9vZHMnLCAncmVncmVzc2lvbiddLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cblxuLyoqXG4gKiBMZm8gY2xhc3MgbG9hZGluZyBIaWVyYXJjaGljYWwgSE1NIG1vZGVscyBjcmVhdGVkIGJ5IHRoZSB4bW0gbGlicmFyeSB0b1xuICogcHJvY2VzcyBhbiBpbnB1dCBzdHJlYW0gb2YgdmVjdG9ycyAobW9kZWxzIG11c3QgaGF2ZSBiZWVuIHRyYWluZWQgZnJvbSB0aGVcbiAqIHNhbWUgaW5wdXQgc3RyZWFtKS5cbiAqIEFzIHRoZSByZXN1bHRzIG9mIHRoZSBjbGFzc2lmaWNhdGlvbiAvIGZvbGxvd2luZyAvIHJlZ3Jlc3Npb24gYXJlIG1vcmVcbiAqIGNvbXBsZXggdGhhbiBhIHNpbXBsZSB2ZWN0b3IsIGEgY2FsbGJhY2sgZnVuY3Rpb24gY2FuIGJlIHBhc3NlZCB0byB0aGVcbiAqIGNvbnN0cnVjdG9yIHRvIGhhbmRsZSB0aGVtLCBvciB0aGV5IGNhbiBhbHRlcm5hdGl2ZWx5IGJlIHF1ZXJpZWQgdmlhIHRoZVxuICogcmVhZG9ubHkgZmlsdGVyUmVzdWx0cyBwcm9wZXJ0eS5cbiAqIEBjbGFzc1xuICovXG5jbGFzcyBIaG1tRGVjb2RlckxmbyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyID0gbmV3IEhobW1EZWNvZGVyKHRoaXMucGFyYW1zLmxpa2VsaWhvb2RXaW5kb3cpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIGVzdGltYXRpb24uXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9kZWNvZGVyLnJlc2V0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2xpa2VsaWhvb2RXaW5kb3cnKSB7XG4gICAgICB0aGlzLl9kZWNvZGVyLnNldExpa2VsaWhvb2RXaW5kb3codmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuX2RlY29kZXIubW9kZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ21vZGVsJyk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5uYkNsYXNzZXM7XG4gICAgfSBlbHNlIHsgLy8gPT09ICdyZWdyZXNzaW9uJ1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5yZWdyZXNzaW9uU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICB0aGlzLl9kZWNvZGVyLmZpbHRlcihmcmFtZSwgKGVyciwgcmVzKSA9PiB7XG4gICAgICBpZiAoZXJyID09PSBudWxsKSB7XG4gICAgICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdjYWxsYmFjaycpO1xuICAgICAgICBjb25zdCByZXNEYXRhID0gcmVzLmxpa2VsaWhvb2RzO1xuICAgICAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgICAgIGRhdGFbaV0gPSByZXNEYXRhW2ldO1xuICAgICAgICB9XG4gICAgICAgIFxuICAgICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgICAgICBjYWxsYmFjayhyZXMpO1xuICAgICAgICB9XG4gICAgICB9XG5cbiAgICAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgICB9KTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzRnJhbWUoZnJhbWUpIHtcbiAgICB0aGlzLnByZXBhcmVGcmFtZShmcmFtZSk7XG4gICAgdGhpcy5wcm9jZXNzRnVuY3Rpb24oZnJhbWUpO1xuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBIaG1tRGVjb2RlckxmbzsiXX0=