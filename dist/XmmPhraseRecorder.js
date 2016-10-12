'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _getPrototypeOf = require('babel-runtime/core-js/object/get-prototype-of');

var _getPrototypeOf2 = _interopRequireDefault(_getPrototypeOf);

var _assign = require('babel-runtime/core-js/object/assign');

var _assign2 = _interopRequireDefault(_assign);

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

var _wavesLfo = require('waves-lfo');

var lfo = _interopRequireWildcard(_wavesLfo);

var _xmmClient = require('xmm-client');

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var XmmPhraseRecorder = function (_lfo$sinks$DataRecord) {
	(0, _inherits3.default)(XmmPhraseRecorder, _lfo$sinks$DataRecord);

	function XmmPhraseRecorder() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		(0, _classCallCheck3.default)(this, XmmPhraseRecorder);

		var defaults = {
			separateArrays: true,
			bimodal: false,
			dimension_input: 0,
			column_names: ['']
		};
		(0, _assign2.default)(defaults, options);
		//console.log('defaults : ' + defaults);

		var _this = (0, _possibleConstructorReturn3.default)(this, (XmmPhraseRecorder.__proto__ || (0, _getPrototypeOf2.default)(XmmPhraseRecorder)).call(this, defaults));

		_this._phraseMaker = new _xmmClient.PhraseMaker(_this.params);

		_this.updatePhrase = function (data) {
			for (var vecid in data.data) {
				var obs = [];
				for (var id in data.data[vecid]) {
					obs.push(data.data[vecid][id]);
				}
				//console.log(obs);
				_this._phraseMaker.addObservation(obs);
			}
			_this.retrieve().then(_this.updatePhrase.bind(_this)).catch(function (err) {
				return console.error(err.stack);
			});
		};

		_this.retrieve().then(_this.updatePhrase.bind(_this)).catch(function (err) {
			return console.error(err.stack);
		});
		return _this;
	}

	(0, _createClass3.default)(XmmPhraseRecorder, [{
		key: 'start',
		value: function start() {
			(0, _get3.default)(XmmPhraseRecorder.prototype.__proto__ || (0, _getPrototypeOf2.default)(XmmPhraseRecorder.prototype), 'start', this).call(this);
		}
	}, {
		key: 'stop',
		value: function stop() {
			(0, _get3.default)(XmmPhraseRecorder.prototype.__proto__ || (0, _getPrototypeOf2.default)(XmmPhraseRecorder.prototype), 'stop', this).call(this);
			this._phraseMaker.reset();
		}
	}, {
		key: 'initialize',
		value: function initialize() {
			var streamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			(0, _get3.default)(XmmPhraseRecorder.prototype.__proto__ || (0, _getPrototypeOf2.default)(XmmPhraseRecorder.prototype), 'initialize', this).call(this, streamParams);
			this._phraseMaker.config = { dimension: this.streamParams.frameSize };
			this._phraseMaker.reset();
		}
	}, {
		key: 'getRecordedPhrase',
		value: function getRecordedPhrase() {
			return this._phraseMaker.phrase;
		}
	}, {
		key: 'label',
		get: function get() {
			return this.phraseMaker.config.label;
		},
		set: function set(label) {
			this._phraseMaker.config = { label: label };
		}
	}]);
	return XmmPhraseRecorder;
}(lfo.sinks.DataRecorder);
//import PhraseMaker from './xmm-phrase';


exports.default = XmmPhraseRecorder;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlhtbVBocmFzZVJlY29yZGVyLmpzIl0sIm5hbWVzIjpbImxmbyIsIlhtbVBocmFzZVJlY29yZGVyIiwib3B0aW9ucyIsImRlZmF1bHRzIiwic2VwYXJhdGVBcnJheXMiLCJiaW1vZGFsIiwiZGltZW5zaW9uX2lucHV0IiwiY29sdW1uX25hbWVzIiwiX3BocmFzZU1ha2VyIiwicGFyYW1zIiwidXBkYXRlUGhyYXNlIiwiZGF0YSIsInZlY2lkIiwib2JzIiwiaWQiLCJwdXNoIiwiYWRkT2JzZXJ2YXRpb24iLCJyZXRyaWV2ZSIsInRoZW4iLCJiaW5kIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsInJlc2V0Iiwic3RyZWFtUGFyYW1zIiwiY29uZmlnIiwiZGltZW5zaW9uIiwiZnJhbWVTaXplIiwicGhyYXNlIiwicGhyYXNlTWFrZXIiLCJsYWJlbCIsInNpbmtzIiwiRGF0YVJlY29yZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEc7O0FBRVo7Ozs7OztJQUVxQkMsaUI7OztBQUNwQiw4QkFBMEI7QUFBQSxNQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFDekIsTUFBTUMsV0FBVztBQUNoQkMsbUJBQWdCLElBREE7QUFFaEJDLFlBQVMsS0FGTztBQUdoQkMsb0JBQWlCLENBSEQ7QUFJaEJDLGlCQUFjLENBQUMsRUFBRDtBQUpFLEdBQWpCO0FBTUEsd0JBQWNKLFFBQWQsRUFBd0JELE9BQXhCO0FBQ0E7O0FBUnlCLDBKQVNuQkMsUUFUbUI7O0FBV3pCLFFBQUtLLFlBQUwsR0FBb0IsMkJBQWdCLE1BQUtDLE1BQXJCLENBQXBCOztBQUVBLFFBQUtDLFlBQUwsR0FBcUIsVUFBQ0MsSUFBRCxFQUFVO0FBQzlCLFFBQUssSUFBSUMsS0FBVCxJQUFrQkQsS0FBS0EsSUFBdkIsRUFBNkI7QUFDNUIsUUFBTUUsTUFBTSxFQUFaO0FBQ0EsU0FBSyxJQUFJQyxFQUFULElBQWVILEtBQUtBLElBQUwsQ0FBVUMsS0FBVixDQUFmLEVBQWlDO0FBQ2hDQyxTQUFJRSxJQUFKLENBQVNKLEtBQUtBLElBQUwsQ0FBVUMsS0FBVixFQUFpQkUsRUFBakIsQ0FBVDtBQUNBO0FBQ0Q7QUFDQSxVQUFLTixZQUFMLENBQWtCUSxjQUFsQixDQUFpQ0gsR0FBakM7QUFDQTtBQUNELFNBQUtJLFFBQUwsR0FDRUMsSUFERixDQUNPLE1BQUtSLFlBQUwsQ0FBa0JTLElBQWxCLE9BRFAsRUFFRUMsS0FGRixDQUVRLFVBQUNDLEdBQUQ7QUFBQSxXQUFTQyxRQUFRQyxLQUFSLENBQWNGLElBQUlHLEtBQWxCLENBQVQ7QUFBQSxJQUZSO0FBR0EsR0FaRDs7QUFjQSxRQUFLUCxRQUFMLEdBQ0VDLElBREYsQ0FDTyxNQUFLUixZQUFMLENBQWtCUyxJQUFsQixPQURQLEVBRUVDLEtBRkYsQ0FFUSxVQUFDQyxHQUFEO0FBQUEsVUFBU0MsUUFBUUMsS0FBUixDQUFjRixJQUFJRyxLQUFsQixDQUFUO0FBQUEsR0FGUjtBQTNCeUI7QUE4QnpCOzs7OzBCQVVPO0FBQ1A7QUFDQTs7O3lCQUVNO0FBQ047QUFDQSxRQUFLaEIsWUFBTCxDQUFrQmlCLEtBQWxCO0FBQ0E7OzsrQkFFNkI7QUFBQSxPQUFuQkMsWUFBbUIsdUVBQUosRUFBSTs7QUFDN0IsMEpBQWlCQSxZQUFqQjtBQUNBLFFBQUtsQixZQUFMLENBQWtCbUIsTUFBbEIsR0FBMkIsRUFBRUMsV0FBVyxLQUFLRixZQUFMLENBQWtCRyxTQUEvQixFQUEzQjtBQUNBLFFBQUtyQixZQUFMLENBQWtCaUIsS0FBbEI7QUFDQTs7O3NDQUVtQjtBQUNuQixVQUFPLEtBQUtqQixZQUFMLENBQWtCc0IsTUFBekI7QUFDQTs7O3NCQXpCVztBQUNYLFVBQU8sS0FBS0MsV0FBTCxDQUFpQkosTUFBakIsQ0FBd0JLLEtBQS9CO0FBQ0EsRztvQkFFU0EsSyxFQUFPO0FBQ2hCLFFBQUt4QixZQUFMLENBQWtCbUIsTUFBbEIsR0FBMkIsRUFBRUssT0FBT0EsS0FBVCxFQUEzQjtBQUNBOzs7RUF2QzZDaEMsSUFBSWlDLEtBQUosQ0FBVUMsWTtBQUh6RDs7O2tCQUdxQmpDLGlCIiwiZmlsZSI6IlhtbVBocmFzZVJlY29yZGVyLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmbyc7XG4vL2ltcG9ydCBQaHJhc2VNYWtlciBmcm9tICcuL3htbS1waHJhc2UnO1xuaW1wb3J0IHsgUGhyYXNlTWFrZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgWG1tUGhyYXNlUmVjb3JkZXIgZXh0ZW5kcyBsZm8uc2lua3MuRGF0YVJlY29yZGVyIHtcblx0Y29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG5cdFx0Y29uc3QgZGVmYXVsdHMgPSB7XG5cdFx0XHRzZXBhcmF0ZUFycmF5czogdHJ1ZSxcblx0XHRcdGJpbW9kYWw6IGZhbHNlLFxuXHRcdFx0ZGltZW5zaW9uX2lucHV0OiAwLFxuXHRcdFx0Y29sdW1uX25hbWVzOiBbJyddXG5cdFx0fVxuXHRcdE9iamVjdC5hc3NpZ24oZGVmYXVsdHMsIG9wdGlvbnMpO1xuXHRcdC8vY29uc29sZS5sb2coJ2RlZmF1bHRzIDogJyArIGRlZmF1bHRzKTtcblx0XHRzdXBlcihkZWZhdWx0cyk7XG5cblx0XHR0aGlzLl9waHJhc2VNYWtlciA9IG5ldyBQaHJhc2VNYWtlcih0aGlzLnBhcmFtcyk7XG5cblx0XHR0aGlzLnVwZGF0ZVBocmFzZSA9ICgoZGF0YSkgPT4ge1xuXHRcdFx0Zm9yIChsZXQgdmVjaWQgaW4gZGF0YS5kYXRhKSB7XG5cdFx0XHRcdGNvbnN0IG9icyA9IFtdO1xuXHRcdFx0XHRmb3IgKGxldCBpZCBpbiBkYXRhLmRhdGFbdmVjaWRdKSB7XG5cdFx0XHRcdFx0b2JzLnB1c2goZGF0YS5kYXRhW3ZlY2lkXVtpZF0pO1xuXHRcdFx0XHR9XG5cdFx0XHRcdC8vY29uc29sZS5sb2cob2JzKTtcblx0XHRcdFx0dGhpcy5fcGhyYXNlTWFrZXIuYWRkT2JzZXJ2YXRpb24ob2JzKTtcblx0XHRcdH1cblx0XHRcdHRoaXMucmV0cmlldmUoKVxuXHRcdFx0XHQudGhlbih0aGlzLnVwZGF0ZVBocmFzZS5iaW5kKHRoaXMpKVxuXHRcdFx0XHQuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcblx0XHR9KTtcblxuXHRcdHRoaXMucmV0cmlldmUoKVxuXHRcdFx0LnRoZW4odGhpcy51cGRhdGVQaHJhc2UuYmluZCh0aGlzKSlcblx0XHRcdC5jYXRjaCgoZXJyKSA9PiBjb25zb2xlLmVycm9yKGVyci5zdGFjaykpO1xuXHR9XG5cblx0Z2V0IGxhYmVsKCkge1xuXHRcdHJldHVybiB0aGlzLnBocmFzZU1ha2VyLmNvbmZpZy5sYWJlbDtcblx0fVxuXG5cdHNldCBsYWJlbChsYWJlbCkge1xuXHRcdHRoaXMuX3BocmFzZU1ha2VyLmNvbmZpZyA9IHsgbGFiZWw6IGxhYmVsIH07XG5cdH1cblxuXHRzdGFydCgpIHtcblx0XHRzdXBlci5zdGFydCgpO1xuXHR9XG5cblx0c3RvcCgpIHtcblx0XHRzdXBlci5zdG9wKCk7XG5cdFx0dGhpcy5fcGhyYXNlTWFrZXIucmVzZXQoKTtcblx0fVxuXG5cdGluaXRpYWxpemUoc3RyZWFtUGFyYW1zID0ge30pIHtcblx0XHRzdXBlci5pbml0aWFsaXplKHN0cmVhbVBhcmFtcyk7XG5cdFx0dGhpcy5fcGhyYXNlTWFrZXIuY29uZmlnID0geyBkaW1lbnNpb246IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSB9O1xuXHRcdHRoaXMuX3BocmFzZU1ha2VyLnJlc2V0KCk7XG5cdH1cblxuXHRnZXRSZWNvcmRlZFBocmFzZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fcGhyYXNlTWFrZXIucGhyYXNlO1xuXHR9XG59Il19