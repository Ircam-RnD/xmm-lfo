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
}(_BaseLfo2.BaseLfo);

;

exports.default = HhmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhobW1EZWNvZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwibW9kZWwiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwibWV0YXMiLCJraW5kIiwibGlrZWxpaG9vZFdpbmRvdyIsIm1pbiIsIm1heCIsIm91dHB1dCIsImxpc3QiLCJjb25zdGFudCIsImNhbGxiYWNrIiwiSGhtbURlY29kZXJMZm8iLCJvcHRpb25zIiwiX2RlY29kZXIiLCJwYXJhbXMiLCJyZXNldCIsIm5hbWUiLCJ2YWx1ZSIsInNldExpa2VsaWhvb2RXaW5kb3ciLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsImdldCIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsIm5iQ2xhc3NlcyIsInJlZ3Jlc3Npb25TaXplIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJmaWx0ZXIiLCJlcnIiLCJyZXMiLCJyZXNEYXRhIiwibGlrZWxpaG9vZHMiLCJkYXRhIiwiaSIsInByb3BhZ2F0ZUZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUdBLElBQU1BLGNBQWM7QUFDbEJDLFNBQU87QUFDTEMsVUFBTSxLQUREO0FBRUxDLGFBQVMsSUFGSjtBQUdMQyxjQUFVLElBSEw7QUFJTEMsV0FBTyxFQUFFQyxNQUFNLFFBQVI7QUFKRixHQURXO0FBT2xCQyxvQkFBa0I7QUFDaEJMLFVBQU0sU0FEVTtBQUVoQkMsYUFBUyxFQUZPO0FBR2hCSyxTQUFLLENBSFc7QUFJaEJDLFNBQUs7QUFKVyxHQVBBO0FBYWxCQyxVQUFRO0FBQ05SLFVBQU0sTUFEQTtBQUVOQyxhQUFTLGFBRkg7QUFHTlEsVUFBTSxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsQ0FIQTtBQUlOQyxjQUFVO0FBSkosR0FiVTtBQW1CbEJDLFlBQVU7QUFDUlgsVUFBTSxLQURFO0FBRVJDLGFBQVMsSUFGRDtBQUdSQyxjQUFVLElBSEY7QUFJUkMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFKQztBQW5CUSxDQUFwQjs7QUE0QkE7Ozs7Ozs7Ozs7O0lBVU1RLGM7OztBQUNKLDRCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUFBLHNKQUNsQmYsV0FEa0IsRUFDTGUsT0FESzs7QUFHeEIsVUFBS0MsUUFBTCxHQUFnQiwyQkFBZ0IsTUFBS0MsTUFBTCxDQUFZVixnQkFBNUIsQ0FBaEI7QUFId0I7QUFJekI7O0FBRUQ7Ozs7Ozs7NEJBR1E7QUFDTixXQUFLUyxRQUFMLENBQWNFLEtBQWQ7QUFDRDs7QUFFRDs7OztrQ0FDY0MsSSxFQUFNQyxLLEVBQU9mLEssRUFBTztBQUNoQywwSkFBb0JjLElBQXBCLEVBQTBCQyxLQUExQixFQUFpQ2YsS0FBakM7O0FBRUEsVUFBSWMsU0FBUyxrQkFBYixFQUFpQztBQUMvQixhQUFLSCxRQUFMLENBQWNLLG1CQUFkLENBQWtDRCxLQUFsQztBQUNEO0FBQ0Y7O0FBRUQ7Ozs7MENBQzJDO0FBQUEsVUFBdkJFLGdCQUF1Qix1RUFBSixFQUFJOztBQUN6QyxXQUFLQyxtQkFBTCxDQUF5QkQsZ0JBQXpCOztBQUVBLFdBQUtOLFFBQUwsQ0FBY2YsS0FBZCxHQUFzQixLQUFLZ0IsTUFBTCxDQUFZTyxHQUFaLENBQWdCLE9BQWhCLENBQXRCOztBQUVBLFVBQUksS0FBS1AsTUFBTCxDQUFZTyxHQUFaLENBQWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DLGFBQUtDLFlBQUwsQ0FBa0JDLFNBQWxCLEdBQThCLEtBQUtWLFFBQUwsQ0FBY1csU0FBNUM7QUFDRCxPQUZELE1BRU87QUFBRTtBQUNQLGFBQUtGLFlBQUwsQ0FBa0JDLFNBQWxCLEdBQThCLEtBQUtWLFFBQUwsQ0FBY1ksY0FBNUM7QUFDRDs7QUFFRCxXQUFLQyxxQkFBTDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFBQTs7QUFDbkIsV0FBS2QsUUFBTCxDQUFjZSxNQUFkLENBQXFCRCxLQUFyQixFQUE0QixVQUFDRSxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUN4QyxZQUFNcEIsV0FBVyxPQUFLSSxNQUFMLENBQVlPLEdBQVosQ0FBZ0IsVUFBaEIsQ0FBakI7QUFDQSxZQUFNVSxVQUFVRCxJQUFJRSxXQUFwQjtBQUNBLFlBQU1DLE9BQU8sT0FBS04sS0FBTCxDQUFXTSxJQUF4QjtBQUNBLFlBQU1WLFlBQVksT0FBS0QsWUFBTCxDQUFrQkMsU0FBcEM7O0FBRUEsWUFBSU0sT0FBTyxJQUFYLEVBQWlCO0FBQ2YsZUFBSyxJQUFJSyxJQUFJLENBQWIsRUFBZ0JBLElBQUlYLFNBQXBCLEVBQStCVyxHQUEvQixFQUFvQztBQUNsQ0QsaUJBQUtDLENBQUwsSUFBVUgsUUFBUUcsQ0FBUixDQUFWO0FBQ0Q7O0FBRUQsY0FBSXhCLFFBQUosRUFBYztBQUNaQSxxQkFBU29CLEdBQVQ7QUFDRDtBQUNGOztBQUVELGVBQUtLLGNBQUw7QUFDRCxPQWpCRDtBQWtCRDs7QUFFRDs7OztpQ0FDYVIsSyxFQUFPO0FBQ2xCLFdBQUtTLFlBQUwsQ0FBa0JULEtBQWxCO0FBQ0EsV0FBS1UsZUFBTCxDQUFxQlYsS0FBckI7QUFDRDs7Ozs7QUFDRjs7a0JBRWNoQixjIiwiZmlsZSI6IkhobW1EZWNvZGVyTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUxmbyB9IGZyb20gJ3dhdmVzLWxmby9jb21tb24vY29yZS9CYXNlTGZvJztcbmltcG9ydCB7IEhobW1EZWNvZGVyIH0gZnJvbSAneG1tLWNsaWVudCc7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIG1vZGVsOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LCBcbiAgbGlrZWxpaG9vZFdpbmRvdzoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyMCxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAxZTMwLFxuICB9LFxuICBvdXRwdXQ6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ2xpa2VsaWhvb2RzJyxcbiAgICBsaXN0OiBbJ2xpa2VsaWhvb2RzJywgJ3JlZ3Jlc3Npb24nXSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59O1xuXG5cbi8qKlxuICogTGZvIGNsYXNzIGxvYWRpbmcgSGllcmFyY2hpY2FsIEhNTSBtb2RlbHMgY3JlYXRlZCBieSB0aGUgeG1tIGxpYnJhcnkgdG9cbiAqIHByb2Nlc3MgYW4gaW5wdXQgc3RyZWFtIG9mIHZlY3RvcnMgKG1vZGVscyBtdXN0IGhhdmUgYmVlbiB0cmFpbmVkIGZyb20gdGhlXG4gKiBzYW1lIGlucHV0IHN0cmVhbSkuXG4gKiBBcyB0aGUgcmVzdWx0cyBvZiB0aGUgY2xhc3NpZmljYXRpb24gLyBmb2xsb3dpbmcgLyByZWdyZXNzaW9uIGFyZSBtb3JlXG4gKiBjb21wbGV4IHRoYW4gYSBzaW1wbGUgdmVjdG9yLCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbiBiZSBwYXNzZWQgdG8gdGhlXG4gKiBjb25zdHJ1Y3RvciB0byBoYW5kbGUgdGhlbSwgb3IgdGhleSBjYW4gYWx0ZXJuYXRpdmVseSBiZSBxdWVyaWVkIHZpYSB0aGVcbiAqIHJlYWRvbmx5IGZpbHRlclJlc3VsdHMgcHJvcGVydHkuXG4gKiBAY2xhc3NcbiAqL1xuY2xhc3MgSGhtbURlY29kZXJMZm8gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fZGVjb2RlciA9IG5ldyBIaG1tRGVjb2Rlcih0aGlzLnBhcmFtcy5saWtlbGlob29kV2luZG93KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGludGVybWVkaWF0ZSByZXN1bHRzIG9mIHRoZSBlc3RpbWF0aW9uLlxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fZGVjb2Rlci5yZXNldCgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgaWYgKG5hbWUgPT09ICdsaWtlbGlob29kV2luZG93Jykge1xuICAgICAgdGhpcy5fZGVjb2Rlci5zZXRMaWtlbGlob29kV2luZG93KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyLm1vZGVsID0gdGhpcy5wYXJhbXMuZ2V0KCdtb2RlbCcpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIubmJDbGFzc2VzO1xuICAgIH0gZWxzZSB7IC8vID09PSAncmVncmVzc2lvbidcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIucmVncmVzc2lvblNpemU7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgdGhpcy5fZGVjb2Rlci5maWx0ZXIoZnJhbWUsIChlcnIsIHJlcykgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG4gICAgICBjb25zdCByZXNEYXRhID0gcmVzLmxpa2VsaWhvb2RzO1xuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgICAgICBkYXRhW2ldID0gcmVzRGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoZnJhbWUpO1xuICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgSGhtbURlY29kZXJMZm87Il19