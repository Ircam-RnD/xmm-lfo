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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJHbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9kZWNvZGVyIiwicGFyYW1zIiwibmFtZSIsInZhbHVlIiwicHJldlN0cmVhbVBhcmFtcyIsInByZXBhcmVTdHJlYW1QYXJhbXMiLCJnZXQiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJuYkNsYXNzZXMiLCJyZWdyZXNzaW9uU2l6ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImZyYW1lIiwiZmlsdGVyIiwiZXJyIiwicmVzIiwicmVzRGF0YSIsImxpa2VsaWhvb2RzIiwiZGF0YSIsImkiLCJwcm9wYWdhdGVGcmFtZSIsInByZXBhcmVGcmFtZSIsInByb2Nlc3NGdW5jdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFDQTs7OztBQUdBLElBQU1BLGNBQWM7QUFDbEJDLFNBQU87QUFDTEMsVUFBTSxLQUREO0FBRUxDLGFBQVMsSUFGSjtBQUdMQyxjQUFVLElBSEw7QUFJTEMsV0FBTyxFQUFFQyxNQUFNLFFBQVI7QUFKRixHQURXO0FBT2xCQyxvQkFBa0I7QUFDaEJMLFVBQU0sU0FEVTtBQUVoQkMsYUFBUyxFQUZPO0FBR2hCSyxTQUFLLENBSFc7QUFJaEJDLFNBQUs7QUFKVyxHQVBBO0FBYWxCQyxVQUFRO0FBQ05SLFVBQU0sTUFEQTtBQUVOQyxhQUFTLGFBRkg7QUFHTlEsVUFBTSxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsQ0FIQTtBQUlOQyxjQUFVO0FBSkosR0FiVTtBQW1CbEJDLFlBQVU7QUFDUlgsVUFBTSxLQURFO0FBRVJDLGFBQVMsSUFGRDtBQUdSQyxjQUFVLElBSEY7QUFJUkMsV0FBTyxFQUFFQyxNQUFNLFNBQVI7QUFKQztBQW5CUSxDQUFwQjs7QUE0QkE7Ozs7Ozs7Ozs7Ozs7SUFZTVEsYTs7O0FBQ0osMkJBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsb0pBQ2xCZixXQURrQixFQUNMZSxPQURLOztBQUd4QixVQUFLQyxRQUFMLEdBQWdCLDBCQUFlLE1BQUtDLE1BQUwsQ0FBWVYsZ0JBQTNCLENBQWhCO0FBSHdCO0FBSXpCOztBQUVEOzs7OztrQ0FDY1csSSxFQUFNQyxLLEVBQU9kLEssRUFBTztBQUNoQyx3SkFBb0JhLElBQXBCLEVBQTBCQyxLQUExQixFQUFpQ2QsS0FBakM7O0FBRUEsVUFBSWEsU0FBUyxrQkFBYixFQUFpQztBQUMvQixhQUFLRixRQUFMLENBQWNULGdCQUFkLEdBQWlDWSxLQUFqQztBQUNEO0FBQ0Y7O0FBRUQ7Ozs7MENBQzJDO0FBQUEsVUFBdkJDLGdCQUF1Qix1RUFBSixFQUFJOztBQUN6QyxXQUFLQyxtQkFBTCxDQUF5QkQsZ0JBQXpCOztBQUVBLFdBQUtKLFFBQUwsQ0FBY2YsS0FBZCxHQUFzQixLQUFLZ0IsTUFBTCxDQUFZSyxHQUFaLENBQWdCLE9BQWhCLENBQXRCOztBQUVBLFVBQUksS0FBS0wsTUFBTCxDQUFZSyxHQUFaLENBQWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DLGFBQUtDLFlBQUwsQ0FBa0JDLFNBQWxCLEdBQThCLEtBQUtSLFFBQUwsQ0FBY1MsU0FBNUM7QUFDRCxPQUZELE1BRU87QUFBRTtBQUNQLGFBQUtGLFlBQUwsQ0FBa0JDLFNBQWxCLEdBQThCLEtBQUtSLFFBQUwsQ0FBY1UsY0FBNUM7QUFDRDs7QUFFRCxXQUFLQyxxQkFBTDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFBQTs7QUFDbkIsV0FBS1osUUFBTCxDQUFjYSxNQUFkLENBQXFCRCxLQUFyQixFQUE0QixVQUFDRSxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUN4QyxZQUFNbEIsV0FBVyxPQUFLSSxNQUFMLENBQVlLLEdBQVosQ0FBZ0IsVUFBaEIsQ0FBakI7QUFDQSxZQUFNVSxVQUFVRCxJQUFJRSxXQUFwQjtBQUNBLFlBQU1DLE9BQU8sT0FBS04sS0FBTCxDQUFXTSxJQUF4QjtBQUNBLFlBQU1WLFlBQVksT0FBS0QsWUFBTCxDQUFrQkMsU0FBcEM7O0FBRUEsWUFBSU0sT0FBTyxJQUFYLEVBQWlCO0FBQ2YsZUFBSyxJQUFJSyxJQUFJLENBQWIsRUFBZ0JBLElBQUlYLFNBQXBCLEVBQStCVyxHQUEvQixFQUFvQztBQUNsQ0QsaUJBQUtDLENBQUwsSUFBVUgsUUFBUUcsQ0FBUixDQUFWO0FBQ0Q7O0FBRUQsY0FBSXRCLFFBQUosRUFBYztBQUNaQSxxQkFBU2tCLEdBQVQ7QUFDRDtBQUNGOztBQUVELGVBQUtLLGNBQUw7QUFDRCxPQWpCRDtBQWtCRDs7QUFFRDs7OztpQ0FDYVIsSyxFQUFPO0FBQ2xCLFdBQUtTLFlBQUwsQ0FBa0JULEtBQWxCO0FBQ0EsV0FBS1UsZUFBTCxDQUFxQlYsS0FBckI7QUFDRDs7Ozs7QUFDRjs7a0JBRWNkLGEiLCJmaWxlIjoiR21tRGVjb2Rlckxmby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24vY29yZS9CYXNlTGZvJztcbmltcG9ydCB7IEdtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbW9kZWw6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sIFxuICBsaWtlbGlob29kV2luZG93OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIwLFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDFlMzAsXG4gIH0sXG4gIG91dHB1dDoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbGlrZWxpaG9vZHMnLFxuICAgIGxpc3Q6IFsnbGlrZWxpaG9vZHMnLCAncmVncmVzc2lvbiddLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cblxuLyoqXG4gKiBMZm8gY2xhc3MgbG9hZGluZyBHTU0gbW9kZWxzIGNyZWF0ZWQgYnkgdGhlIHhtbSBsaWJyYXJ5IHRvIHByb2Nlc3MgYW4gaW5wdXRcbiAqIHN0cmVhbSBvZiB2ZWN0b3JzIChtb2RlbHMgbXVzdCBoYXZlIGJlZW4gdHJhaW5lZCBmcm9tIHRoZSBzYW1lIGlucHV0IHN0cmVhbSkuXG4gKiBBcyB0aGUgcmVzdWx0cyBvZiB0aGUgY2xhc3NpZmljYXRpb24gLyByZWdyZXNzaW9uIGFyZSBtb3JlIGNvbXBsZXggdGhhbiBhXG4gKiBzaW1wbGUgdmVjdG9yLCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbiBiZSBwYXNzZWQgdG8gdGhlIGNvbnN0cnVjdG9yIHRvIGhhbmRsZVxuICogdGhlbSwgb3IgdGhleSBjYW4gYWx0ZXJuYXRpdmVseSBiZSBxdWVyaWVkIHZpYSB0aGUgcmVhZG9ubHkgZmlsdGVyUmVzdWx0c1xuICogcHJvcGVydHkuXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0cy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5tb2RlbD1udWxsXSAtIE1vZGVsIGNvbW1pbmcgZnJvbSAuLi5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5saWtlbGlob29kV2luZG93PTIwXSAtIE51bWJlciBvZiBsaWxpa2VsaWhvb2RcbiAqL1xuY2xhc3MgR21tRGVjb2RlckxmbyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyID0gbmV3IEdtbURlY29kZXIodGhpcy5wYXJhbXMubGlrZWxpaG9vZFdpbmRvdyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2xpa2VsaWhvb2RXaW5kb3cnKSB7XG4gICAgICB0aGlzLl9kZWNvZGVyLmxpa2VsaWhvb2RXaW5kb3cgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyLm1vZGVsID0gdGhpcy5wYXJhbXMuZ2V0KCdtb2RlbCcpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIubmJDbGFzc2VzO1xuICAgIH0gZWxzZSB7IC8vID09PSAncmVncmVzc2lvbidcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIucmVncmVzc2lvblNpemU7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgdGhpcy5fZGVjb2Rlci5maWx0ZXIoZnJhbWUsIChlcnIsIHJlcykgPT4ge1xuICAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG4gICAgICBjb25zdCByZXNEYXRhID0gcmVzLmxpa2VsaWhvb2RzO1xuICAgICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgICAgaWYgKGVyciA9PSBudWxsKSB7XG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgICAgICBkYXRhW2ldID0gcmVzRGF0YVtpXTtcbiAgICAgICAgfVxuICAgICAgICBcbiAgICAgICAgaWYgKGNhbGxiYWNrKSB7XG4gICAgICAgICAgY2FsbGJhY2socmVzKTtcbiAgICAgICAgfVxuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BhZ2F0ZUZyYW1lKCk7XG4gICAgfSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc0ZyYW1lKGZyYW1lKSB7XG4gICAgdGhpcy5wcmVwYXJlRnJhbWUoZnJhbWUpO1xuICAgIHRoaXMucHJvY2Vzc0Z1bmN0aW9uKGZyYW1lKTtcbiAgfVxufTtcblxuZXhwb3J0IGRlZmF1bHQgR21tRGVjb2RlckxmbzsiXX0=