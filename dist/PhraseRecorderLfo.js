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

/**
 * Lfo class extending lfo.sinks.DataRecorder, using PhraseMaker from xmm-client
 * to format the input data for xmm-node.
 * @class
 */
var PhraseRecorderLfo = function (_lfo$sinks$DataRecord) {
	(0, _inherits3.default)(PhraseRecorderLfo, _lfo$sinks$DataRecord);

	function PhraseRecorderLfo() {
		var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
		(0, _classCallCheck3.default)(this, PhraseRecorderLfo);

		var defaults = {
			separateArrays: true,
			bimodal: false,
			dimension_input: 0,
			column_names: ['']
		};
		(0, _assign2.default)(defaults, options);

		var _this = (0, _possibleConstructorReturn3.default)(this, (PhraseRecorderLfo.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorderLfo)).call(this, defaults));

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

	/**
  * The current label of the last / currently being recorded phrase.
  * @type {String}
  */


	(0, _createClass3.default)(PhraseRecorderLfo, [{
		key: 'start',
		value: function start() {
			(0, _get3.default)(PhraseRecorderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorderLfo.prototype), 'start', this).call(this);
		}
	}, {
		key: 'stop',
		value: function stop() {
			(0, _get3.default)(PhraseRecorderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorderLfo.prototype), 'stop', this).call(this);
			this._phraseMaker.reset();
		}

		/** @private */

	}, {
		key: 'initialize',
		value: function initialize() {
			var streamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

			(0, _get3.default)(PhraseRecorderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorderLfo.prototype), 'initialize', this).call(this, streamParams);
			this._phraseMaker.config = { dimension: this.streamParams.frameSize };
			this._phraseMaker.reset();
		}

		/**
   * Returns the latest recorded phrase.
   */

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
	return PhraseRecorderLfo;
}(lfo.sinks.DataRecorder);

exports.default = PhraseRecorderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBocmFzZVJlY29yZGVyTGZvLmpzIl0sIm5hbWVzIjpbImxmbyIsIlBocmFzZVJlY29yZGVyTGZvIiwib3B0aW9ucyIsImRlZmF1bHRzIiwic2VwYXJhdGVBcnJheXMiLCJiaW1vZGFsIiwiZGltZW5zaW9uX2lucHV0IiwiY29sdW1uX25hbWVzIiwiX3BocmFzZU1ha2VyIiwicGFyYW1zIiwidXBkYXRlUGhyYXNlIiwiZGF0YSIsInZlY2lkIiwib2JzIiwiaWQiLCJwdXNoIiwiYWRkT2JzZXJ2YXRpb24iLCJyZXRyaWV2ZSIsInRoZW4iLCJiaW5kIiwiY2F0Y2giLCJlcnIiLCJjb25zb2xlIiwiZXJyb3IiLCJzdGFjayIsInJlc2V0Iiwic3RyZWFtUGFyYW1zIiwiY29uZmlnIiwiZGltZW5zaW9uIiwiZnJhbWVTaXplIiwicGhyYXNlIiwicGhyYXNlTWFrZXIiLCJsYWJlbCIsInNpbmtzIiwiRGF0YVJlY29yZGVyIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0lBQVlBLEc7O0FBQ1o7Ozs7OztBQUVBOzs7OztJQUtNQyxpQjs7O0FBQ0wsOEJBQTBCO0FBQUEsTUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQ3pCLE1BQU1DLFdBQVc7QUFDaEJDLG1CQUFnQixJQURBO0FBRWhCQyxZQUFTLEtBRk87QUFHaEJDLG9CQUFpQixDQUhEO0FBSWhCQyxpQkFBYyxDQUFDLEVBQUQ7QUFKRSxHQUFqQjtBQU1BLHdCQUFjSixRQUFkLEVBQXdCRCxPQUF4Qjs7QUFQeUIsMEpBUW5CQyxRQVJtQjs7QUFVekIsUUFBS0ssWUFBTCxHQUFvQiwyQkFBZ0IsTUFBS0MsTUFBckIsQ0FBcEI7O0FBRUEsUUFBS0MsWUFBTCxHQUFxQixVQUFDQyxJQUFELEVBQVU7QUFDOUIsUUFBSyxJQUFJQyxLQUFULElBQWtCRCxLQUFLQSxJQUF2QixFQUE2QjtBQUM1QixRQUFNRSxNQUFNLEVBQVo7QUFDQSxTQUFLLElBQUlDLEVBQVQsSUFBZUgsS0FBS0EsSUFBTCxDQUFVQyxLQUFWLENBQWYsRUFBaUM7QUFDaENDLFNBQUlFLElBQUosQ0FBU0osS0FBS0EsSUFBTCxDQUFVQyxLQUFWLEVBQWlCRSxFQUFqQixDQUFUO0FBQ0E7QUFDRDtBQUNBLFVBQUtOLFlBQUwsQ0FBa0JRLGNBQWxCLENBQWlDSCxHQUFqQztBQUNBO0FBQ0QsU0FBS0ksUUFBTCxHQUNFQyxJQURGLENBQ08sTUFBS1IsWUFBTCxDQUFrQlMsSUFBbEIsT0FEUCxFQUVFQyxLQUZGLENBRVEsVUFBQ0MsR0FBRDtBQUFBLFdBQVNDLFFBQVFDLEtBQVIsQ0FBY0YsSUFBSUcsS0FBbEIsQ0FBVDtBQUFBLElBRlI7QUFHQSxHQVpEOztBQWNBLFFBQUtQLFFBQUwsR0FDRUMsSUFERixDQUNPLE1BQUtSLFlBQUwsQ0FBa0JTLElBQWxCLE9BRFAsRUFFRUMsS0FGRixDQUVRLFVBQUNDLEdBQUQ7QUFBQSxVQUFTQyxRQUFRQyxLQUFSLENBQWNGLElBQUlHLEtBQWxCLENBQVQ7QUFBQSxHQUZSO0FBMUJ5QjtBQTZCekI7O0FBRUQ7Ozs7Ozs7OzBCQVlRO0FBQ1A7QUFDQTs7O3lCQUVNO0FBQ047QUFDQSxRQUFLaEIsWUFBTCxDQUFrQmlCLEtBQWxCO0FBQ0E7O0FBRUQ7Ozs7K0JBQzhCO0FBQUEsT0FBbkJDLFlBQW1CLHVFQUFKLEVBQUk7O0FBQzdCLDBKQUFpQkEsWUFBakI7QUFDQSxRQUFLbEIsWUFBTCxDQUFrQm1CLE1BQWxCLEdBQTJCLEVBQUVDLFdBQVcsS0FBS0YsWUFBTCxDQUFrQkcsU0FBL0IsRUFBM0I7QUFDQSxRQUFLckIsWUFBTCxDQUFrQmlCLEtBQWxCO0FBQ0E7O0FBRUQ7Ozs7OztzQ0FHb0I7QUFDbkIsVUFBTyxLQUFLakIsWUFBTCxDQUFrQnNCLE1BQXpCO0FBQ0E7OztzQkE3Qlc7QUFDWCxVQUFPLEtBQUtDLFdBQUwsQ0FBaUJKLE1BQWpCLENBQXdCSyxLQUEvQjtBQUNBLEc7b0JBRVNBLEssRUFBTztBQUNoQixRQUFLeEIsWUFBTCxDQUFrQm1CLE1BQWxCLEdBQTJCLEVBQUVLLE9BQU9BLEtBQVQsRUFBM0I7QUFDQTs7O0VBMUM4QmhDLElBQUlpQyxLQUFKLENBQVVDLFk7O2tCQW9FM0JqQyxpQiIsImZpbGUiOiJQaHJhc2VSZWNvcmRlckxmby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8nO1xuaW1wb3J0IHsgUGhyYXNlTWFrZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuLyoqXG4gKiBMZm8gY2xhc3MgZXh0ZW5kaW5nIGxmby5zaW5rcy5EYXRhUmVjb3JkZXIsIHVzaW5nIFBocmFzZU1ha2VyIGZyb20geG1tLWNsaWVudFxuICogdG8gZm9ybWF0IHRoZSBpbnB1dCBkYXRhIGZvciB4bW0tbm9kZS5cbiAqIEBjbGFzc1xuICovXG5jbGFzcyBQaHJhc2VSZWNvcmRlckxmbyBleHRlbmRzIGxmby5zaW5rcy5EYXRhUmVjb3JkZXIge1xuXHRjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcblx0XHRjb25zdCBkZWZhdWx0cyA9IHtcblx0XHRcdHNlcGFyYXRlQXJyYXlzOiB0cnVlLFxuXHRcdFx0Ymltb2RhbDogZmFsc2UsXG5cdFx0XHRkaW1lbnNpb25faW5wdXQ6IDAsXG5cdFx0XHRjb2x1bW5fbmFtZXM6IFsnJ11cblx0XHR9XG5cdFx0T2JqZWN0LmFzc2lnbihkZWZhdWx0cywgb3B0aW9ucyk7XG5cdFx0c3VwZXIoZGVmYXVsdHMpO1xuXG5cdFx0dGhpcy5fcGhyYXNlTWFrZXIgPSBuZXcgUGhyYXNlTWFrZXIodGhpcy5wYXJhbXMpO1xuXG5cdFx0dGhpcy51cGRhdGVQaHJhc2UgPSAoKGRhdGEpID0+IHtcblx0XHRcdGZvciAobGV0IHZlY2lkIGluIGRhdGEuZGF0YSkge1xuXHRcdFx0XHRjb25zdCBvYnMgPSBbXTtcblx0XHRcdFx0Zm9yIChsZXQgaWQgaW4gZGF0YS5kYXRhW3ZlY2lkXSkge1xuXHRcdFx0XHRcdG9icy5wdXNoKGRhdGEuZGF0YVt2ZWNpZF1baWRdKTtcblx0XHRcdFx0fVxuXHRcdFx0XHQvL2NvbnNvbGUubG9nKG9icyk7XG5cdFx0XHRcdHRoaXMuX3BocmFzZU1ha2VyLmFkZE9ic2VydmF0aW9uKG9icyk7XG5cdFx0XHR9XG5cdFx0XHR0aGlzLnJldHJpZXZlKClcblx0XHRcdFx0LnRoZW4odGhpcy51cGRhdGVQaHJhc2UuYmluZCh0aGlzKSlcblx0XHRcdFx0LmNhdGNoKChlcnIpID0+IGNvbnNvbGUuZXJyb3IoZXJyLnN0YWNrKSk7XG5cdFx0fSk7XG5cblx0XHR0aGlzLnJldHJpZXZlKClcblx0XHRcdC50aGVuKHRoaXMudXBkYXRlUGhyYXNlLmJpbmQodGhpcykpXG5cdFx0XHQuY2F0Y2goKGVycikgPT4gY29uc29sZS5lcnJvcihlcnIuc3RhY2spKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBUaGUgY3VycmVudCBsYWJlbCBvZiB0aGUgbGFzdCAvIGN1cnJlbnRseSBiZWluZyByZWNvcmRlZCBwaHJhc2UuXG5cdCAqIEB0eXBlIHtTdHJpbmd9XG5cdCAqL1xuXHRnZXQgbGFiZWwoKSB7XG5cdFx0cmV0dXJuIHRoaXMucGhyYXNlTWFrZXIuY29uZmlnLmxhYmVsO1xuXHR9XG5cblx0c2V0IGxhYmVsKGxhYmVsKSB7XG5cdFx0dGhpcy5fcGhyYXNlTWFrZXIuY29uZmlnID0geyBsYWJlbDogbGFiZWwgfTtcblx0fVxuXG5cdHN0YXJ0KCkge1xuXHRcdHN1cGVyLnN0YXJ0KCk7XG5cdH1cblxuXHRzdG9wKCkge1xuXHRcdHN1cGVyLnN0b3AoKTtcblx0XHR0aGlzLl9waHJhc2VNYWtlci5yZXNldCgpO1xuXHR9XG5cblx0LyoqIEBwcml2YXRlICovXG5cdGluaXRpYWxpemUoc3RyZWFtUGFyYW1zID0ge30pIHtcblx0XHRzdXBlci5pbml0aWFsaXplKHN0cmVhbVBhcmFtcyk7XG5cdFx0dGhpcy5fcGhyYXNlTWFrZXIuY29uZmlnID0geyBkaW1lbnNpb246IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSB9O1xuXHRcdHRoaXMuX3BocmFzZU1ha2VyLnJlc2V0KCk7XG5cdH1cblxuXHQvKipcblx0ICogUmV0dXJucyB0aGUgbGF0ZXN0IHJlY29yZGVkIHBocmFzZS5cblx0ICovXG5cdGdldFJlY29yZGVkUGhyYXNlKCkge1xuXHRcdHJldHVybiB0aGlzLl9waHJhc2VNYWtlci5waHJhc2U7XG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGhyYXNlUmVjb3JkZXJMZm87Il19