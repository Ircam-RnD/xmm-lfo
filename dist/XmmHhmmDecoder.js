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

var XmmHhmmDecoder = function (_lfo$core$BaseLfo) {
	(0, _inherits3.default)(XmmHhmmDecoder, _lfo$core$BaseLfo);

	function XmmHhmmDecoder() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		(0, _classCallCheck3.default)(this, XmmHhmmDecoder);

		var defaults = {
			model: undefined,
			likelihoodWindow: 1,
			ctx: undefined,
			callback: undefined
		};

		var _this = (0, _possibleConstructorReturn3.default)(this, (XmmHhmmDecoder.__proto__ || (0, _getPrototypeOf2.default)(XmmHhmmDecoder)).call(this, defaults, options));

		_this._decoder = new _xmmClient.HhmmDecoder(_this.params.likelihoodWindow);
		_this._results = null;
		_this._callback = _this.params.callback;
		//console.log(this._callback);
		return _this;
	}

	(0, _createClass3.default)(XmmHhmmDecoder, [{
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
	return XmmHhmmDecoder;
}(lfo.core.BaseLfo);

exports.default = XmmHhmmDecoder;
;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlhtbUhobW1EZWNvZGVyLmpzIl0sIm5hbWVzIjpbImxmbyIsIlhtbUhobW1EZWNvZGVyIiwib3B0aW9ucyIsImRlZmF1bHRzIiwibW9kZWwiLCJ1bmRlZmluZWQiLCJsaWtlbGlob29kV2luZG93IiwiY3R4IiwiY2FsbGJhY2siLCJfZGVjb2RlciIsInBhcmFtcyIsIl9yZXN1bHRzIiwiX2NhbGxiYWNrIiwidGltZSIsImZyYW1lIiwibWV0YURhdGEiLCJmaWx0ZXIiLCJlcnIiLCJyZXMiLCJpIiwibmJDbGFzc2VzIiwib3V0RnJhbWUiLCJsaWtlbGlob29kcyIsImNvbnNvbGUiLCJlcnJvciIsIm91dHB1dCIsImluaXRpYWxpemUiLCJmcmFtZVNpemUiLCJ3aW5kb3dTaXplIiwiY29yZSIsIkJhc2VMZm8iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEc7O0FBQ1o7Ozs7QUFDQTs7Ozs7O0lBRXFCQyxjOzs7QUFDcEIsMkJBQTBCO0FBQUEsTUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQ3pCLE1BQU1DLFdBQVc7QUFDaEJDLFVBQU9DLFNBRFM7QUFFaEJDLHFCQUFrQixDQUZGO0FBR2hCQyxRQUFLRixTQUhXO0FBSWhCRyxhQUFVSDtBQUpNLEdBQWpCOztBQUR5QixvSkFPbkJGLFFBUG1CLEVBT1RELE9BUFM7O0FBUXpCLFFBQUtPLFFBQUwsR0FBZ0IsMkJBQWdCLE1BQUtDLE1BQUwsQ0FBWUosZ0JBQTVCLENBQWhCO0FBQ0EsUUFBS0ssUUFBTCxHQUFnQixJQUFoQjtBQUNBLFFBQUtDLFNBQUwsR0FBaUIsTUFBS0YsTUFBTCxDQUFZRixRQUE3QjtBQUNBO0FBWHlCO0FBWXpCOzs7OzBCQUVPSyxJLEVBQU1DLEssRUFBT0MsUSxFQUFVO0FBQUE7O0FBQzlCLFFBQUtGLElBQUwsR0FBWUEsSUFBWjtBQUNBLFFBQUtFLFFBQUwsR0FBZ0JBLFFBQWhCO0FBQ0EsUUFBS04sUUFBTCxDQUFjTyxNQUFkLENBQXFCRixLQUFyQixFQUE0QixVQUFDRyxHQUFELEVBQU1DLEdBQU4sRUFBYztBQUN6QztBQUNBLFFBQUlELE9BQU8sSUFBWCxFQUFpQjtBQUNoQixZQUFLTixRQUFMLEdBQWdCTyxHQUFoQjtBQUNBLFVBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJLE9BQUtWLFFBQUwsQ0FBY1csU0FBbEMsRUFBNkNELEdBQTdDLEVBQWtEO0FBQ2pELGFBQUtFLFFBQUwsQ0FBY0YsQ0FBZCxJQUFtQkQsSUFBSUksV0FBSixDQUFnQkgsQ0FBaEIsQ0FBbkI7QUFDQTtBQUNELFNBQUksT0FBS1AsU0FBVCxFQUFvQjtBQUNuQixhQUFLQSxTQUFMLENBQWVNLEdBQWY7QUFDQTtBQUNELEtBUkQsTUFRTztBQUNOSyxhQUFRQyxLQUFSLENBQWNQLEdBQWQ7QUFDQTs7QUFFRCxXQUFLUSxNQUFMO0FBQ0EsSUFmRDtBQWdCQTs7O29CQUVTckIsSyxFQUFPO0FBQ2hCLFFBQUtLLFFBQUwsQ0FBY0wsS0FBZCxHQUFzQkEsS0FBdEI7QUFDQSxRQUFLc0IsVUFBTCxDQUFnQixFQUFFQyxXQUFXLEtBQUtsQixRQUFMLENBQWNXLFNBQTNCLEVBQWhCO0FBQ0E7OztvQkFFb0JRLFUsRUFBWTtBQUNoQyxRQUFLbkIsUUFBTCxDQUFjSCxnQkFBZCxHQUFpQ3NCLFVBQWpDO0FBQ0E7OztzQkFFbUI7QUFDbkIsVUFBTyxLQUFLakIsUUFBWjtBQUNBOzs7RUEvQzBDWCxJQUFJNkIsSUFBSixDQUFTQyxPOztrQkFBaEM3QixjO0FBZ0RwQiIsImZpbGUiOiJYbW1IaG1tRGVjb2Rlci5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8nO1xuaW1wb3J0IGFzc2VydCBmcm9tICdhc3NlcnQnO1xuaW1wb3J0IHsgSGhtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWG1tSGhtbURlY29kZXIgZXh0ZW5kcyBsZm8uY29yZS5CYXNlTGZvIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0Y29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0XHRtb2RlbDogdW5kZWZpbmVkLFxuXHRcdFx0bGlrZWxpaG9vZFdpbmRvdzogMSxcblx0XHRcdGN0eDogdW5kZWZpbmVkLFxuXHRcdFx0Y2FsbGJhY2s6IHVuZGVmaW5lZFxuXHRcdH1cblx0XHRzdXBlcihkZWZhdWx0cywgb3B0aW9ucyk7XG5cdFx0dGhpcy5fZGVjb2RlciA9IG5ldyBIaG1tRGVjb2Rlcih0aGlzLnBhcmFtcy5saWtlbGlob29kV2luZG93KTtcblx0XHR0aGlzLl9yZXN1bHRzID0gbnVsbDtcblx0XHR0aGlzLl9jYWxsYmFjayA9IHRoaXMucGFyYW1zLmNhbGxiYWNrO1xuXHRcdC8vY29uc29sZS5sb2codGhpcy5fY2FsbGJhY2spO1xuXHR9XG5cblx0cHJvY2Vzcyh0aW1lLCBmcmFtZSwgbWV0YURhdGEpIHtcblx0XHR0aGlzLnRpbWUgPSB0aW1lO1xuXHRcdHRoaXMubWV0YURhdGEgPSBtZXRhRGF0YTtcblx0XHR0aGlzLl9kZWNvZGVyLmZpbHRlcihmcmFtZSwgKGVyciwgcmVzKSA9PiB7XG5cdFx0XHQvL2Fzc2VydC5lcXVhbChudWxsLCBlcnIpO1xuXHRcdFx0aWYgKGVyciA9PSBudWxsKSB7XG5cdFx0XHRcdHRoaXMuX3Jlc3VsdHMgPSByZXM7XG5cdFx0XHRcdGZvciAobGV0IGkgPSAwOyBpIDwgdGhpcy5fZGVjb2Rlci5uYkNsYXNzZXM7IGkrKykge1xuXHRcdFx0XHRcdHRoaXMub3V0RnJhbWVbaV0gPSByZXMubGlrZWxpaG9vZHNbaV07XG5cdFx0XHRcdH1cblx0XHRcdFx0aWYgKHRoaXMuX2NhbGxiYWNrKSB7XG5cdFx0XHRcdFx0dGhpcy5fY2FsbGJhY2socmVzKTtcblx0XHRcdFx0fVxuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0Y29uc29sZS5lcnJvcihlcnIpO1xuXHRcdFx0fVxuXG5cdFx0XHR0aGlzLm91dHB1dCgpO1xuXHRcdH0pO1xuXHR9XG5cblx0c2V0IG1vZGVsKG1vZGVsKSB7XG5cdFx0dGhpcy5fZGVjb2Rlci5tb2RlbCA9IG1vZGVsO1xuXHRcdHRoaXMuaW5pdGlhbGl6ZSh7IGZyYW1lU2l6ZTogdGhpcy5fZGVjb2Rlci5uYkNsYXNzZXMgfSk7XG5cdH1cblxuXHRzZXQgbGlrZWxpaG9vZFdpbmRvdyh3aW5kb3dTaXplKSB7XG5cdFx0dGhpcy5fZGVjb2Rlci5saWtlbGlob29kV2luZG93ID0gd2luZG93U2l6ZTtcblx0fVxuXG5cdGdldCBmaWx0ZXJSZXN1bHRzKCkge1xuXHRcdHJldHVybiB0aGlzLl9yZXN1bHRzO1xuXHR9XG59OyJdfQ==