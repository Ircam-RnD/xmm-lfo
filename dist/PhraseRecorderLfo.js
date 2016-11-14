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
  bimodal: {
    type: 'boolean',
    default: false,
    constant: true
  },
  dimensionInput: {
    type: 'integer',
    default: 0,
    constant: true
  },
  columnNames: {
    type: 'any',
    default: [''],
    constant: true
  }
};

// uncomment this and add to other xmm-lfo's when lfo is exposed in /common as well
// or use client ? (it's very likely that we won't run these lfo's server-side)
// if (lfo.version < '1.0.0')
//  throw new Error('')

/**
 * Lfo class using PhraseMaker class from xmm-client
 * to record input data and format it for xmm-node.
 */

// import * as lfo from 'waves-lfo/client';

var PhraseRecorderLfo = function (_BaseLfo) {
  (0, _inherits3.default)(PhraseRecorderLfo, _BaseLfo);

  function PhraseRecorderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, PhraseRecorderLfo);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PhraseRecorderLfo.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorderLfo)).call(this, definitions, options));

    _this._phraseMaker = new _xmmClient.PhraseMaker({
      bimodal: _this.params.get('bimodal'),
      dimensionInput: _this.params.get('dimensionInput'),
      columnNames: _this.params.get('columnNames')
    });

    _this._isStarted = false;
    return _this;
  }

  /**
   * Get the current label of the last / currently being recorded phrase.
   * @returns {String}.
   */


  (0, _createClass3.default)(PhraseRecorderLfo, [{
    key: 'getPhraseLabel',
    value: function getPhraseLabel() {
      return this._phraseMaker.getConfig()['label'];
    }

    /**
     * Set the current label of the last / currently being recorded phrase.
     * @param {String} label - The label.
     */

  }, {
    key: 'setPhraseLabel',
    value: function setPhraseLabel(label) {
      this._phraseMaker.setConfig({ label: label });
    }

    /**
     * Return the latest recorded phrase.
     * @returns {XmmPhrase}
     */

  }, {
    key: 'getRecordedPhrase',
    value: function getRecordedPhrase() {
      // this.stop();
      console.log(this._phraseMaker.phrase);
      return this._phraseMaker.phrase;
    }

    /**
     * Start recording a phrase from the input stream.
     */

  }, {
    key: 'start',
    value: function start() {
      this._phraseMaker.reset();
      this._isStarted = true;
    }

    /**
     * Stop the current recording.
     * (makes the phrase available via <code>getRecordedPhrase()</code>).
     */

  }, {
    key: 'stop',
    value: function stop() {
      this._isStarted = false;
    }

    /** @private */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(PhraseRecorderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      var config = {};
      config[name] = value;
      this._phraseMaker.setConfig(config);
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.prepareStreamParams(prevStreamParams);

      this._phraseMaker.setConfig({ dimension: this.streamParams.frameSize });
      this._phraseMaker.reset();

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      if (!this._isStarted) {
        return;
      }

      // const { data } = frame;
      var frameSize = this.streamParams.frameSize;
      var inData = frame.data;
      var outData = this.frame.data;

      for (var i = 0; i < frameSize; i++) {
        outData[i] = inData[i];
      }
      //console.log(outData);

      var inArray = new Array(this.streamParams.frameSize);
      for (var _i = 0; _i < inArray.length; _i++) {
        inArray[_i] = inData[_i];
      }

      this._phraseMaker.addObservation(inArray);
    }
  }]);
  return PhraseRecorderLfo;
}(_BaseLfo3.default);

exports.default = PhraseRecorderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBocmFzZVJlY29yZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiYmltb2RhbCIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJkaW1lbnNpb25JbnB1dCIsImNvbHVtbk5hbWVzIiwiUGhyYXNlUmVjb3JkZXJMZm8iLCJvcHRpb25zIiwiX3BocmFzZU1ha2VyIiwicGFyYW1zIiwiZ2V0IiwiX2lzU3RhcnRlZCIsImdldENvbmZpZyIsImxhYmVsIiwic2V0Q29uZmlnIiwiY29uc29sZSIsImxvZyIsInBocmFzZSIsInJlc2V0IiwibmFtZSIsInZhbHVlIiwibWV0YXMiLCJjb25maWciLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsImRpbWVuc2lvbiIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImZyYW1lIiwiaW5EYXRhIiwiZGF0YSIsIm91dERhdGEiLCJpIiwiaW5BcnJheSIsIkFycmF5IiwibGVuZ3RoIiwiYWRkT2JzZXJ2YXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFFQSxJQUFNQSxjQUFjO0FBQ2xCQyxXQUFTO0FBQ1BDLFVBQU0sU0FEQztBQUVQQyxhQUFTLEtBRkY7QUFHUEMsY0FBVTtBQUhILEdBRFM7QUFNbEJDLGtCQUFnQjtBQUNkSCxVQUFNLFNBRFE7QUFFZEMsYUFBUyxDQUZLO0FBR2RDLGNBQVU7QUFISSxHQU5FO0FBV2xCRSxlQUFhO0FBQ1hKLFVBQU0sS0FESztBQUVYQyxhQUFTLENBQUMsRUFBRCxDQUZFO0FBR1hDLGNBQVU7QUFIQztBQVhLLENBQXBCOztBQWtCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUExQkE7O0lBOEJNRyxpQjs7O0FBQ0osK0JBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsNEpBQ2xCUixXQURrQixFQUNMUSxPQURLOztBQUd4QixVQUFLQyxZQUFMLEdBQW9CLDJCQUFnQjtBQUNsQ1IsZUFBUyxNQUFLUyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsU0FBaEIsQ0FEeUI7QUFFbENOLHNCQUFnQixNQUFLSyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsZ0JBQWhCLENBRmtCO0FBR2xDTCxtQkFBYSxNQUFLSSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsYUFBaEI7QUFIcUIsS0FBaEIsQ0FBcEI7O0FBTUEsVUFBS0MsVUFBTCxHQUFrQixLQUFsQjtBQVR3QjtBQVV6Qjs7QUFFRDs7Ozs7Ozs7cUNBSWlCO0FBQ2YsYUFBTyxLQUFLSCxZQUFMLENBQWtCSSxTQUFsQixHQUE4QixPQUE5QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7bUNBSWVDLEssRUFBTztBQUNwQixXQUFLTCxZQUFMLENBQWtCTSxTQUFsQixDQUE0QixFQUFFRCxPQUFPQSxLQUFULEVBQTVCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7d0NBSW9CO0FBQ2xCO0FBQ0FFLGNBQVFDLEdBQVIsQ0FBWSxLQUFLUixZQUFMLENBQWtCUyxNQUE5QjtBQUNBLGFBQU8sS0FBS1QsWUFBTCxDQUFrQlMsTUFBekI7QUFDRDs7QUFFRDs7Ozs7OzRCQUdRO0FBQ04sV0FBS1QsWUFBTCxDQUFrQlUsS0FBbEI7QUFDQSxXQUFLUCxVQUFMLEdBQWtCLElBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7MkJBSU87QUFDTCxXQUFLQSxVQUFMLEdBQWtCLEtBQWxCO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NRLEksRUFBTUMsSyxFQUFPQyxLLEVBQU87QUFDaEMsZ0tBQW9CRixJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUNDLEtBQWpDOztBQUVBLFVBQU1DLFNBQVMsRUFBZjtBQUNBQSxhQUFPSCxJQUFQLElBQWVDLEtBQWY7QUFDQSxXQUFLWixZQUFMLENBQWtCTSxTQUFsQixDQUE0QlEsTUFBNUI7QUFDRDs7QUFFRDs7OzswQ0FDMkM7QUFBQSxVQUF2QkMsZ0JBQXVCLHVFQUFKLEVBQUk7O0FBQ3pDLFdBQUtDLG1CQUFMLENBQXlCRCxnQkFBekI7O0FBRUEsV0FBS2YsWUFBTCxDQUFrQk0sU0FBbEIsQ0FBNEIsRUFBRVcsV0FBVyxLQUFLQyxZQUFMLENBQWtCQyxTQUEvQixFQUE1QjtBQUNBLFdBQUtuQixZQUFMLENBQWtCVSxLQUFsQjs7QUFFQSxXQUFLVSxxQkFBTDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFDbkIsVUFBSSxDQUFDLEtBQUtsQixVQUFWLEVBQXNCO0FBQ3BCO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFNZ0IsWUFBWSxLQUFLRCxZQUFMLENBQWtCQyxTQUFwQztBQUNBLFVBQU1HLFNBQVNELE1BQU1FLElBQXJCO0FBQ0EsVUFBTUMsVUFBVSxLQUFLSCxLQUFMLENBQVdFLElBQTNCOztBQUVBLFdBQUssSUFBSUUsSUFBSSxDQUFiLEVBQWdCQSxJQUFJTixTQUFwQixFQUErQk0sR0FBL0IsRUFBb0M7QUFDbENELGdCQUFRQyxDQUFSLElBQWFILE9BQU9HLENBQVAsQ0FBYjtBQUNEO0FBQ0Q7O0FBRUEsVUFBTUMsVUFBVSxJQUFJQyxLQUFKLENBQVUsS0FBS1QsWUFBTCxDQUFrQkMsU0FBNUIsQ0FBaEI7QUFDQSxXQUFLLElBQUlNLEtBQUksQ0FBYixFQUFnQkEsS0FBSUMsUUFBUUUsTUFBNUIsRUFBb0NILElBQXBDLEVBQXlDO0FBQ3ZDQyxnQkFBUUQsRUFBUixJQUFhSCxPQUFPRyxFQUFQLENBQWI7QUFDRDs7QUFFRCxXQUFLekIsWUFBTCxDQUFrQjZCLGNBQWxCLENBQWlDSCxPQUFqQztBQUNEOzs7OztrQkFHWTVCLGlCIiwiZmlsZSI6IlBocmFzZVJlY29yZGVyTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJhc2VMZm8gZnJvbSAnd2F2ZXMtbGZvL2NvbW1vbi9jb3JlL0Jhc2VMZm8nO1xuLy8gaW1wb3J0ICogYXMgbGZvIGZyb20gJ3dhdmVzLWxmby9jbGllbnQnO1xuaW1wb3J0IHsgUGhyYXNlTWFrZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIGJpbW9kYWw6IHtcbiAgICB0eXBlOiAnYm9vbGVhbicsXG4gICAgZGVmYXVsdDogZmFsc2UsXG4gICAgY29uc3RhbnQ6IHRydWVcbiAgfSxcbiAgZGltZW5zaW9uSW5wdXQ6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMCxcbiAgICBjb25zdGFudDogdHJ1ZVxuICB9LFxuICBjb2x1bW5OYW1lczoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IFsnJ10sXG4gICAgY29uc3RhbnQ6IHRydWVcbiAgfSxcbn07XG5cbi8vIHVuY29tbWVudCB0aGlzIGFuZCBhZGQgdG8gb3RoZXIgeG1tLWxmbydzIHdoZW4gbGZvIGlzIGV4cG9zZWQgaW4gL2NvbW1vbiBhcyB3ZWxsXG4vLyBvciB1c2UgY2xpZW50ID8gKGl0J3MgdmVyeSBsaWtlbHkgdGhhdCB3ZSB3b24ndCBydW4gdGhlc2UgbGZvJ3Mgc2VydmVyLXNpZGUpXG4vLyBpZiAobGZvLnZlcnNpb24gPCAnMS4wLjAnKVxuLy8gIHRocm93IG5ldyBFcnJvcignJylcblxuLyoqXG4gKiBMZm8gY2xhc3MgdXNpbmcgUGhyYXNlTWFrZXIgY2xhc3MgZnJvbSB4bW0tY2xpZW50XG4gKiB0byByZWNvcmQgaW5wdXQgZGF0YSBhbmQgZm9ybWF0IGl0IGZvciB4bW0tbm9kZS5cbiAqL1xuY2xhc3MgUGhyYXNlUmVjb3JkZXJMZm8gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fcGhyYXNlTWFrZXIgPSBuZXcgUGhyYXNlTWFrZXIoe1xuICAgICAgYmltb2RhbDogdGhpcy5wYXJhbXMuZ2V0KCdiaW1vZGFsJyksXG4gICAgICBkaW1lbnNpb25JbnB1dDogdGhpcy5wYXJhbXMuZ2V0KCdkaW1lbnNpb25JbnB1dCcpLFxuICAgICAgY29sdW1uTmFtZXM6IHRoaXMucGFyYW1zLmdldCgnY29sdW1uTmFtZXMnKSxcbiAgICB9KTtcblxuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqXG4gICAqIEdldCB0aGUgY3VycmVudCBsYWJlbCBvZiB0aGUgbGFzdCAvIGN1cnJlbnRseSBiZWluZyByZWNvcmRlZCBwaHJhc2UuXG4gICAqIEByZXR1cm5zIHtTdHJpbmd9LlxuICAgKi9cbiAgZ2V0UGhyYXNlTGFiZWwoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BocmFzZU1ha2VyLmdldENvbmZpZygpWydsYWJlbCddO1xuICB9XG5cbiAgLyoqXG4gICAqIFNldCB0aGUgY3VycmVudCBsYWJlbCBvZiB0aGUgbGFzdCAvIGN1cnJlbnRseSBiZWluZyByZWNvcmRlZCBwaHJhc2UuXG4gICAqIEBwYXJhbSB7U3RyaW5nfSBsYWJlbCAtIFRoZSBsYWJlbC5cbiAgICovXG4gIHNldFBocmFzZUxhYmVsKGxhYmVsKSB7XG4gICAgdGhpcy5fcGhyYXNlTWFrZXIuc2V0Q29uZmlnKHsgbGFiZWw6IGxhYmVsIH0pO1xuICB9XG5cbiAgLyoqXG4gICAqIFJldHVybiB0aGUgbGF0ZXN0IHJlY29yZGVkIHBocmFzZS5cbiAgICogQHJldHVybnMge1htbVBocmFzZX1cbiAgICovXG4gIGdldFJlY29yZGVkUGhyYXNlKCkge1xuICAgIC8vIHRoaXMuc3RvcCgpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuX3BocmFzZU1ha2VyLnBocmFzZSk7XG4gICAgcmV0dXJuIHRoaXMuX3BocmFzZU1ha2VyLnBocmFzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdGFydCByZWNvcmRpbmcgYSBwaHJhc2UgZnJvbSB0aGUgaW5wdXQgc3RyZWFtLlxuICAgKi9cbiAgc3RhcnQoKSB7XG4gICAgdGhpcy5fcGhyYXNlTWFrZXIucmVzZXQoKTtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSB0cnVlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0b3AgdGhlIGN1cnJlbnQgcmVjb3JkaW5nLlxuICAgKiAobWFrZXMgdGhlIHBocmFzZSBhdmFpbGFibGUgdmlhIDxjb2RlPmdldFJlY29yZGVkUGhyYXNlKCk8L2NvZGU+KS5cbiAgICovXG4gIHN0b3AoKSB7XG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBjb25zdCBjb25maWcgPSB7fTtcbiAgICBjb25maWdbbmFtZV0gPSB2YWx1ZTtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5zZXRDb25maWcoY29uZmlnKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuX3BocmFzZU1ha2VyLnNldENvbmZpZyh7IGRpbWVuc2lvbjogdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplIH0pO1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnJlc2V0KCk7XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICBpZiAoIXRoaXMuX2lzU3RhcnRlZCkge1xuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIC8vIGNvbnN0IHsgZGF0YSB9ID0gZnJhbWU7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuICAgIGNvbnN0IGluRGF0YSA9IGZyYW1lLmRhdGE7XG4gICAgY29uc3Qgb3V0RGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIG91dERhdGFbaV0gPSBpbkRhdGFbaV07XG4gICAgfVxuICAgIC8vY29uc29sZS5sb2cob3V0RGF0YSk7XG5cbiAgICBjb25zdCBpbkFycmF5ID0gbmV3IEFycmF5KHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbkFycmF5W2ldID0gaW5EYXRhW2ldO1xuICAgIH1cblxuICAgIHRoaXMuX3BocmFzZU1ha2VyLmFkZE9ic2VydmF0aW9uKGluQXJyYXkpO1xuICB9XG59XG5cbmV4cG9ydCBkZWZhdWx0IFBocmFzZVJlY29yZGVyTGZvOyJdfQ==