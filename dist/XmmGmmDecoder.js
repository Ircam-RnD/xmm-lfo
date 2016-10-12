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

var _xmmClient = require('xmm-client');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XmmGmmDecoder = function (_lfo$core$BaseLfo) {
	(0, _inherits3.default)(XmmGmmDecoder, _lfo$core$BaseLfo);

	function XmmGmmDecoder() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		(0, _classCallCheck3.default)(this, XmmGmmDecoder);

		var defaults = {
			model: undefined,
			likelihoodWindow: 1,
			callback: undefined
		};

		var _this = (0, _possibleConstructorReturn3.default)(this, (XmmGmmDecoder.__proto__ || (0, _getPrototypeOf2.default)(XmmGmmDecoder)).call(this, defaults, options));

		_this._decoder = new _xmmClient.GmmDecoder(_this.params.likelihoodWindow);
		_this._results = null;
		_this._callback = _this.params.callback;
		return _this;
	}

	(0, _createClass3.default)(XmmGmmDecoder, [{
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
	return XmmGmmDecoder;
}(lfo.core.BaseLfo);
//import assert from 'assert';


exports.default = XmmGmmDecoder;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlhtbUdtbURlY29kZXIuanMiXSwibmFtZXMiOlsibGZvIiwiWG1tR21tRGVjb2RlciIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsIm1vZGVsIiwidW5kZWZpbmVkIiwibGlrZWxpaG9vZFdpbmRvdyIsImNhbGxiYWNrIiwiX2RlY29kZXIiLCJwYXJhbXMiLCJfcmVzdWx0cyIsIl9jYWxsYmFjayIsInRpbWUiLCJmcmFtZSIsIm1ldGFEYXRhIiwiZmlsdGVyIiwiZXJyIiwicmVzIiwiaSIsIm5iQ2xhc3NlcyIsIm91dEZyYW1lIiwibGlrZWxpaG9vZHMiLCJvdXRwdXQiLCJpbml0aWFsaXplIiwiZnJhbWVTaXplIiwid2luZG93U2l6ZSIsImNvcmUiLCJCYXNlTGZvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxHOztBQUVaOzs7Ozs7SUFFcUJDLGE7OztBQUNwQiwwQkFBMEI7QUFBQSxNQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDekIsTUFBTUMsV0FBVztBQUNoQkMsVUFBT0MsU0FEUztBQUVoQkMscUJBQWtCLENBRkY7QUFHaEJDLGFBQVVGO0FBSE0sR0FBakI7O0FBRHlCLGtKQU1uQkYsUUFObUIsRUFNVEQsT0FOUzs7QUFPekIsUUFBS00sUUFBTCxHQUFnQiwwQkFBZSxNQUFLQyxNQUFMLENBQVlILGdCQUEzQixDQUFoQjtBQUNBLFFBQUtJLFFBQUwsR0FBZ0IsSUFBaEI7QUFDQSxRQUFLQyxTQUFMLEdBQWlCLE1BQUtGLE1BQUwsQ0FBWUYsUUFBN0I7QUFUeUI7QUFVekI7Ozs7MEJBRU9LLEksRUFBTUMsSyxFQUFPQyxRLEVBQVU7QUFBQTs7QUFDOUIsUUFBS0YsSUFBTCxHQUFZQSxJQUFaO0FBQ0EsUUFBS0UsUUFBTCxHQUFnQkEsUUFBaEI7QUFDQSxRQUFLTixRQUFMLENBQWNPLE1BQWQsQ0FBcUJGLEtBQXJCLEVBQTRCLFVBQUNHLEdBQUQsRUFBTUMsR0FBTixFQUFjO0FBQ3pDO0FBQ0EsUUFBSUQsT0FBTyxJQUFYLEVBQWlCO0FBQ2hCLFlBQUtOLFFBQUwsR0FBZ0JPLEdBQWhCO0FBQ0EsVUFBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUksT0FBS1YsUUFBTCxDQUFjVyxTQUFsQyxFQUE2Q0QsR0FBN0MsRUFBa0Q7QUFDakQsYUFBS0UsUUFBTCxDQUFjRixDQUFkLElBQW1CRCxJQUFJSSxXQUFKLENBQWdCSCxDQUFoQixDQUFuQjtBQUNBO0FBQ0QsU0FBSSxPQUFLUCxTQUFULEVBQW9CO0FBQ25CLGFBQUtBLFNBQUwsQ0FBZU0sR0FBZjtBQUNBO0FBQ0Q7QUFDRCxXQUFLSyxNQUFMO0FBQ0EsSUFaRDtBQWFBOzs7b0JBRVNsQixLLEVBQU87QUFDaEIsUUFBS0ksUUFBTCxDQUFjSixLQUFkLEdBQXNCQSxLQUF0QjtBQUNBLFFBQUttQixVQUFMLENBQWdCLEVBQUVDLFdBQVcsS0FBS2hCLFFBQUwsQ0FBY1csU0FBM0IsRUFBaEI7QUFDQTs7O29CQUVvQk0sVSxFQUFZO0FBQ2hDLFFBQUtqQixRQUFMLENBQWNGLGdCQUFkLEdBQWlDbUIsVUFBakM7QUFDQTs7O3NCQUVtQjtBQUNuQixVQUFPLEtBQUtmLFFBQVo7QUFDQTs7O0VBMUN5Q1YsSUFBSTBCLElBQUosQ0FBU0MsTztBQUhwRDs7O2tCQUdxQjFCLGE7QUEyQ3BCIiwiZmlsZSI6IlhtbUdtbURlY29kZXIuanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvJztcbi8vaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuaW1wb3J0IHsgR21tRGVjb2RlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBYbW1HbW1EZWNvZGVyIGV4dGVuZHMgbGZvLmNvcmUuQmFzZUxmbyB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdFx0bW9kZWw6IHVuZGVmaW5lZCxcblx0XHRcdGxpa2VsaWhvb2RXaW5kb3c6IDEsXG5cdFx0XHRjYWxsYmFjazogdW5kZWZpbmVkXG5cdFx0fTtcblx0XHRzdXBlcihkZWZhdWx0cywgb3B0aW9ucyk7XG5cdFx0dGhpcy5fZGVjb2RlciA9IG5ldyBHbW1EZWNvZGVyKHRoaXMucGFyYW1zLmxpa2VsaWhvb2RXaW5kb3cpO1xuXHRcdHRoaXMuX3Jlc3VsdHMgPSBudWxsO1xuXHRcdHRoaXMuX2NhbGxiYWNrID0gdGhpcy5wYXJhbXMuY2FsbGJhY2s7XG5cdH1cblxuXHRwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuXHRcdHRoaXMudGltZSA9IHRpbWU7XG5cdFx0dGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXHRcdHRoaXMuX2RlY29kZXIuZmlsdGVyKGZyYW1lLCAoZXJyLCByZXMpID0+IHtcblx0XHRcdC8vYXNzZXJ0LmVxdWFsKG51bGwsIGVycik7XG5cdFx0XHRpZiAoZXJyID09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5fcmVzdWx0cyA9IHJlcztcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9kZWNvZGVyLm5iQ2xhc3NlczsgaSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5vdXRGcmFtZVtpXSA9IHJlcy5saWtlbGlob29kc1tpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy5fY2FsbGJhY2spIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhyZXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLm91dHB1dCgpO1xuXHRcdH0pO1xuXHR9XG5cblx0c2V0IG1vZGVsKG1vZGVsKSB7XG5cdFx0dGhpcy5fZGVjb2Rlci5tb2RlbCA9IG1vZGVsO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZSh7IGZyYW1lU2l6ZTogdGhpcy5fZGVjb2Rlci5uYkNsYXNzZXMgfSk7XG5cdH1cblxuXHRzZXQgbGlrZWxpaG9vZFdpbmRvdyh3aW5kb3dTaXplKSB7XG5cdFx0dGhpcy5fZGVjb2Rlci5saWtlbGlob29kV2luZG93ID0gd2luZG93U2l6ZTtcblx0fVxuXG5cdGdldCBmaWx0ZXJSZXN1bHRzKCkge1xuXHRcdHJldHVybiB0aGlzLl9yZXN1bHRzO1xuXHR9XG59OyJdfQ==