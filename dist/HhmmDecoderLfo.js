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

var _inherits2 = require('babel-runtime/helpers/inherits');

var _inherits3 = _interopRequireDefault(_inherits2);

var _wavesLfo = require('waves-lfo');

var lfo = _interopRequireWildcard(_wavesLfo);

var _assert = require('assert');

var _assert2 = _interopRequireDefault(_assert);

var _xmmClient = require('xmm-client');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var HhmmDecoderLfo = function (_lfo$core$BaseLfo) {
	(0, _inherits3.default)(HhmmDecoderLfo, _lfo$core$BaseLfo);

	function HhmmDecoderLfo() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		(0, _classCallCheck3.default)(this, HhmmDecoderLfo);

		var defaults = {
			model: undefined,
			likelihoodWindow: 1,
			ctx: undefined,
			callback: undefined
		};

		var _this = (0, _possibleConstructorReturn3.default)(this, (HhmmDecoderLfo.__proto__ || (0, _getPrototypeOf2.default)(HhmmDecoderLfo)).call(this, defaults, options));

		_this._decoder = new _xmmClient.HhmmDecoder(_this.params.likelihoodWindow);
		_this._results = null;
		_this._callback = _this.params.callback;
		//console.log(this._callback);
		return _this;
	}

	(0, _createClass3.default)(HhmmDecoderLfo, [{
		key: 'process',
		value: function process(time, frame, metaData) {
			var _this2 = this;

			this.time = time;
			this.metaData = metaData;
			this._decoder.filter(frame, function (err, res) {
				//assert.equal(null, err);
				if (err == null) {
					_this2._results = res;
					for (var i = 0; i < _this2._decoder.nbClasses; i++) {
						_this2.outFrame[i] = res.likelihoods[i];
					}
					if (_this2._callback) {
						_this2._callback(res);
					}
				} else {
					console.error(err);
				}

				_this2.output();
			});
		}
	}, {
		key: 'model',
		set: function set(model) {
			this._decoder.model = model;
			this.initialize({ frameSize: this._decoder.nbClasses });
		}
	}, {
		key: 'likelihoodWindow',
		set: function set(windowSize) {
			this._decoder.likelihoodWindow = windowSize;
		}
	}, {
		key: 'filterResults',
		get: function get() {
			return this._results;
		}
	}]);
	return HhmmDecoderLfo;
}(lfo.core.BaseLfo);

;

exports.default = HhmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhobW1EZWNvZGVyTGZvLmpzIl0sIm5hbWVzIjpbImxmbyIsIkhobW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsImRlZmF1bHRzIiwibW9kZWwiLCJ1bmRlZmluZWQiLCJsaWtlbGlob29kV2luZG93IiwiY3R4IiwiY2FsbGJhY2siLCJfZGVjb2RlciIsInBhcmFtcyIsIl9yZXN1bHRzIiwiX2NhbGxiYWNrIiwidGltZSIsImZyYW1lIiwibWV0YURhdGEiLCJmaWx0ZXIiLCJlcnIiLCJyZXMiLCJpIiwibmJDbGFzc2VzIiwib3V0RnJhbWUiLCJsaWtlbGlob29kcyIsImNvbnNvbGUiLCJlcnJvciIsIm91dHB1dCIsImluaXRpYWxpemUiLCJmcmFtZVNpemUiLCJ3aW5kb3dTaXplIiwiY29yZSIsIkJhc2VMZm8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEc7O0FBQ1o7Ozs7QUFDQTs7Ozs7O0lBRU1DLGM7OztBQUNMLDJCQUEwQjtBQUFBLE1BQWRDLE9BQWMsdUVBQUosRUFBSTtBQUFBOztBQUN6QixNQUFNQyxXQUFXO0FBQ2hCQyxVQUFPQyxTQURTO0FBRWhCQyxxQkFBa0IsQ0FGRjtBQUdoQkMsUUFBS0YsU0FIVztBQUloQkcsYUFBVUg7QUFKTSxHQUFqQjs7QUFEeUIsb0pBT25CRixRQVBtQixFQU9URCxPQVBTOztBQVF6QixRQUFLTyxRQUFMLEdBQWdCLDJCQUFnQixNQUFLQyxNQUFMLENBQVlKLGdCQUE1QixDQUFoQjtBQUNBLFFBQUtLLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLE1BQUtGLE1BQUwsQ0FBWUYsUUFBN0I7QUFDQTtBQVh5QjtBQVl6Qjs7OzswQkFFT0ssSSxFQUFNQyxLLEVBQU9DLFEsRUFBVTtBQUFBOztBQUM5QixRQUFLRixJQUFMLEdBQVlBLElBQVo7QUFDQSxRQUFLRSxRQUFMLEdBQWdCQSxRQUFoQjtBQUNBLFFBQUtOLFFBQUwsQ0FBY08sTUFBZCxDQUFxQkYsS0FBckIsRUFBNEIsVUFBQ0csR0FBRCxFQUFNQyxHQUFOLEVBQWM7QUFDekM7QUFDQSxRQUFJRCxPQUFPLElBQVgsRUFBaUI7QUFDaEIsWUFBS04sUUFBTCxHQUFnQk8sR0FBaEI7QUFDQSxVQUFLLElBQUlDLElBQUksQ0FBYixFQUFnQkEsSUFBSSxPQUFLVixRQUFMLENBQWNXLFNBQWxDLEVBQTZDRCxHQUE3QyxFQUFrRDtBQUNqRCxhQUFLRSxRQUFMLENBQWNGLENBQWQsSUFBbUJELElBQUlJLFdBQUosQ0FBZ0JILENBQWhCLENBQW5CO0FBQ0E7QUFDRCxTQUFJLE9BQUtQLFNBQVQsRUFBb0I7QUFDbkIsYUFBS0EsU0FBTCxDQUFlTSxHQUFmO0FBQ0E7QUFDRCxLQVJELE1BUU87QUFDTkssYUFBUUMsS0FBUixDQUFjUCxHQUFkO0FBQ0E7O0FBRUQsV0FBS1EsTUFBTDtBQUNBLElBZkQ7QUFnQkE7OztvQkFFU3JCLEssRUFBTztBQUNoQixRQUFLSyxRQUFMLENBQWNMLEtBQWQsR0FBc0JBLEtBQXRCO0FBQ0EsUUFBS3NCLFVBQUwsQ0FBZ0IsRUFBRUMsV0FBVyxLQUFLbEIsUUFBTCxDQUFjVyxTQUEzQixFQUFoQjtBQUNBOzs7b0JBRW9CUSxVLEVBQVk7QUFDaEMsUUFBS25CLFFBQUwsQ0FBY0gsZ0JBQWQsR0FBaUNzQixVQUFqQztBQUNBOzs7c0JBRW1CO0FBQ25CLFVBQU8sS0FBS2pCLFFBQVo7QUFDQTs7O0VBL0MyQlgsSUFBSTZCLElBQUosQ0FBU0MsTzs7QUFnRHJDOztrQkFFYzdCLGMiLCJmaWxlIjoiSGhtbURlY29kZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvJztcbmltcG9ydCBhc3NlcnQgZnJvbSAnYXNzZXJ0JztcbmltcG9ydCB7IEhobW1EZWNvZGVyIH0gZnJvbSAneG1tLWNsaWVudCc7XG5cbmNsYXNzIEhobW1EZWNvZGVyTGZvIGV4dGVuZHMgbGZvLmNvcmUuQmFzZUxmbyB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdFx0bW9kZWw6IHVuZGVmaW5lZCxcblx0XHRcdGxpa2VsaWhvb2RXaW5kb3c6IDEsXG5cdFx0XHRjdHg6IHVuZGVmaW5lZCxcblx0XHRcdGNhbGxiYWNrOiB1bmRlZmluZWRcblx0XHR9XG5cdFx0c3VwZXIoZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRcdHRoaXMuX2RlY29kZXIgPSBuZXcgSGhtbURlY29kZXIodGhpcy5wYXJhbXMubGlrZWxpaG9vZFdpbmRvdyk7XG5cdFx0dGhpcy5fcmVzdWx0cyA9IG51bGw7XG5cdFx0dGhpcy5fY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5jYWxsYmFjaztcblx0XHQvL2NvbnNvbGUubG9nKHRoaXMuX2NhbGxiYWNrKTtcblx0fVxuXG5cdHByb2Nlc3ModGltZSwgZnJhbWUsIG1ldGFEYXRhKSB7XG5cdFx0dGhpcy50aW1lID0gdGltZTtcblx0XHR0aGlzLm1ldGFEYXRhID0gbWV0YURhdGE7XG5cdFx0dGhpcy5fZGVjb2Rlci5maWx0ZXIoZnJhbWUsIChlcnIsIHJlcykgPT4ge1xuXHRcdFx0Ly9hc3NlcnQuZXF1YWwobnVsbCwgZXJyKTtcblx0XHRcdGlmIChlcnIgPT0gbnVsbCkge1xuXHRcdFx0XHR0aGlzLl9yZXN1bHRzID0gcmVzO1xuXHRcdFx0XHRmb3IgKGxldCBpID0gMDsgaSA8IHRoaXMuX2RlY29kZXIubmJDbGFzc2VzOyBpKyspIHtcblx0XHRcdFx0XHR0aGlzLm91dEZyYW1lW2ldID0gcmVzLmxpa2VsaWhvb2RzW2ldO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGlmICh0aGlzLl9jYWxsYmFjaykge1xuXHRcdFx0XHRcdHRoaXMuX2NhbGxiYWNrKHJlcyk7XG5cdFx0XHRcdH1cblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyKTtcblx0XHRcdH1cblxuXHRcdFx0dGhpcy5vdXRwdXQoKTtcblx0XHR9KTtcblx0fVxuXG5cdHNldCBtb2RlbChtb2RlbCkge1xuXHRcdHRoaXMuX2RlY29kZXIubW9kZWwgPSBtb2RlbDtcblx0XHR0aGlzLmluaXRpYWxpemUoeyBmcmFtZVNpemU6IHRoaXMuX2RlY29kZXIubmJDbGFzc2VzIH0pO1xuXHR9XG5cblx0c2V0IGxpa2VsaWhvb2RXaW5kb3cod2luZG93U2l6ZSkge1xuXHRcdHRoaXMuX2RlY29kZXIubGlrZWxpaG9vZFdpbmRvdyA9IHdpbmRvd1NpemU7XG5cdH1cblxuXHRnZXQgZmlsdGVyUmVzdWx0cygpIHtcblx0XHRyZXR1cm4gdGhpcy5fcmVzdWx0cztcblx0fVxufTtcblxuZXhwb3J0IGRlZmF1bHQgSGhtbURlY29kZXJMZm87Il19