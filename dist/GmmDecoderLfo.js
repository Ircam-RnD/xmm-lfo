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

var GmmDecoderLfo = function (_lfo$core$BaseLfo) {
	(0, _inherits3.default)(GmmDecoderLfo, _lfo$core$BaseLfo);

	function GmmDecoderLfo() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		(0, _classCallCheck3.default)(this, GmmDecoderLfo);

		var defaults = {
			model: undefined,
			likelihoodWindow: 1,
			callback: undefined
		};

		var _this = (0, _possibleConstructorReturn3.default)(this, (GmmDecoderLfo.__proto__ || (0, _getPrototypeOf2.default)(GmmDecoderLfo)).call(this, defaults, options));

		_this._decoder = new _xmmClient.GmmDecoder(_this.params.likelihoodWindow);
		_this._results = null;
		_this._callback = _this.params.callback;
		return _this;
	}

	(0, _createClass3.default)(GmmDecoderLfo, [{
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
	return GmmDecoderLfo;
}(lfo.core.BaseLfo);
//import assert from 'assert';


;

exports.default = GmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsibGZvIiwiR21tRGVjb2RlckxmbyIsIm9wdGlvbnMiLCJkZWZhdWx0cyIsIm1vZGVsIiwidW5kZWZpbmVkIiwibGlrZWxpaG9vZFdpbmRvdyIsImNhbGxiYWNrIiwiX2RlY29kZXIiLCJwYXJhbXMiLCJfcmVzdWx0cyIsIl9jYWxsYmFjayIsInRpbWUiLCJmcmFtZSIsIm1ldGFEYXRhIiwiZmlsdGVyIiwiZXJyIiwicmVzIiwiaSIsIm5iQ2xhc3NlcyIsIm91dEZyYW1lIiwibGlrZWxpaG9vZHMiLCJvdXRwdXQiLCJpbml0aWFsaXplIiwiZnJhbWVTaXplIiwid2luZG93U2l6ZSIsImNvcmUiLCJCYXNlTGZvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUFZQSxHOztBQUVaOzs7Ozs7SUFFTUMsYTs7O0FBQ0wsMEJBQTBCO0FBQUEsTUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQ3pCLE1BQU1DLFdBQVc7QUFDaEJDLFVBQU9DLFNBRFM7QUFFaEJDLHFCQUFrQixDQUZGO0FBR2hCQyxhQUFVRjtBQUhNLEdBQWpCOztBQUR5QixrSkFNbkJGLFFBTm1CLEVBTVRELE9BTlM7O0FBT3pCLFFBQUtNLFFBQUwsR0FBZ0IsMEJBQWUsTUFBS0MsTUFBTCxDQUFZSCxnQkFBM0IsQ0FBaEI7QUFDQSxRQUFLSSxRQUFMLEdBQWdCLElBQWhCO0FBQ0EsUUFBS0MsU0FBTCxHQUFpQixNQUFLRixNQUFMLENBQVlGLFFBQTdCO0FBVHlCO0FBVXpCOzs7OzBCQUVPSyxJLEVBQU1DLEssRUFBT0MsUSxFQUFVO0FBQUE7O0FBQzlCLFFBQUtGLElBQUwsR0FBWUEsSUFBWjtBQUNBLFFBQUtFLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsUUFBS04sUUFBTCxDQUFjTyxNQUFkLENBQXFCRixLQUFyQixFQUE0QixVQUFDRyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUN6QztBQUNBLFFBQUlELE9BQU8sSUFBWCxFQUFpQjtBQUNoQixZQUFLTixRQUFMLEdBQWdCTyxHQUFoQjtBQUNBLFVBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLE9BQUtWLFFBQUwsQ0FBY1csU0FBbEMsRUFBNkNELEdBQTdDLEVBQWtEO0FBQ2pELGFBQUtFLFFBQUwsQ0FBY0YsQ0FBZCxJQUFtQkQsSUFBSUksV0FBSixDQUFnQkgsQ0FBaEIsQ0FBbkI7QUFDQTtBQUNELFNBQUksT0FBS1AsU0FBVCxFQUFvQjtBQUNuQixhQUFLQSxTQUFMLENBQWVNLEdBQWY7QUFDQTtBQUNEO0FBQ0QsV0FBS0ssTUFBTDtBQUNBLElBWkQ7QUFhQTs7O29CQUVTbEIsSyxFQUFPO0FBQ2hCLFFBQUtJLFFBQUwsQ0FBY0osS0FBZCxHQUFzQkEsS0FBdEI7QUFDQSxRQUFLbUIsVUFBTCxDQUFnQixFQUFFQyxXQUFXLEtBQUtoQixRQUFMLENBQWNXLFNBQTNCLEVBQWhCO0FBQ0E7OztvQkFFb0JNLFUsRUFBWTtBQUNoQyxRQUFLakIsUUFBTCxDQUFjRixnQkFBZCxHQUFpQ21CLFVBQWpDO0FBQ0E7OztzQkFFbUI7QUFDbkIsVUFBTyxLQUFLZixRQUFaO0FBQ0E7OztFQTFDMEJWLElBQUkwQixJQUFKLENBQVNDLE87QUFIckM7OztBQThDQzs7a0JBRWMxQixhIiwiZmlsZSI6IkdtbURlY29kZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvJztcbi8vaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuaW1wb3J0IHsgR21tRGVjb2RlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5jbGFzcyBHbW1EZWNvZGVyTGZvIGV4dGVuZHMgbGZvLmNvcmUuQmFzZUxmbyB7XG5cdGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuXHRcdGNvbnN0IGRlZmF1bHRzID0ge1xuXHRcdFx0bW9kZWw6IHVuZGVmaW5lZCxcblx0XHRcdGxpa2VsaWhvb2RXaW5kb3c6IDEsXG5cdFx0XHRjYWxsYmFjazogdW5kZWZpbmVkXG5cdFx0fTtcblx0XHRzdXBlcihkZWZhdWx0cywgb3B0aW9ucyk7XG5cdFx0dGhpcy5fZGVjb2RlciA9IG5ldyBHbW1EZWNvZGVyKHRoaXMucGFyYW1zLmxpa2VsaWhvb2RXaW5kb3cpO1xuXHRcdHRoaXMuX3Jlc3VsdHMgPSBudWxsO1xuXHRcdHRoaXMuX2NhbGxiYWNrID0gdGhpcy5wYXJhbXMuY2FsbGJhY2s7XG5cdH1cblxuXHRwcm9jZXNzKHRpbWUsIGZyYW1lLCBtZXRhRGF0YSkge1xuXHRcdHRoaXMudGltZSA9IHRpbWU7XG5cdFx0dGhpcy5tZXRhRGF0YSA9IG1ldGFEYXRhO1xuXHRcdHRoaXMuX2RlY29kZXIuZmlsdGVyKGZyYW1lLCAoZXJyLCByZXMpID0+IHtcblx0XHRcdC8vYXNzZXJ0LmVxdWFsKG51bGwsIGVycik7XG5cdFx0XHRpZiAoZXJyID09IG51bGwpIHtcblx0XHRcdFx0dGhpcy5fcmVzdWx0cyA9IHJlcztcblx0XHRcdFx0Zm9yIChsZXQgaSA9IDA7IGkgPCB0aGlzLl9kZWNvZGVyLm5iQ2xhc3NlczsgaSsrKSB7XG5cdFx0XHRcdFx0dGhpcy5vdXRGcmFtZVtpXSA9IHJlcy5saWtlbGlob29kc1tpXTtcblx0XHRcdFx0fVxuXHRcdFx0XHRpZiAodGhpcy5fY2FsbGJhY2spIHtcblx0XHRcdFx0XHR0aGlzLl9jYWxsYmFjayhyZXMpO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0XHR0aGlzLm91dHB1dCgpO1xuXHRcdH0pO1xuXHR9XG5cblx0c2V0IG1vZGVsKG1vZGVsKSB7XG5cdFx0dGhpcy5fZGVjb2Rlci5tb2RlbCA9IG1vZGVsO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZSh7IGZyYW1lU2l6ZTogdGhpcy5fZGVjb2Rlci5uYkNsYXNzZXMgfSk7XG5cdH1cblxuXHRzZXQgbGlrZWxpaG9vZFdpbmRvdyh3aW5kb3dTaXplKSB7XG5cdFx0dGhpcy5fZGVjb2Rlci5saWtlbGlob29kV2luZG93ID0gd2luZG93U2l6ZTtcblx0fVxuXG5cdGdldCBmaWx0ZXJSZXN1bHRzKCkge1xuXHRcdHJldHVybiB0aGlzLl9yZXN1bHRzO1xuXHR9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHbW1EZWNvZGVyTGZvOyJdfQ==