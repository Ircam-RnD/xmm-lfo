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

var PhraseRecorder = function (_BaseLfo) {
  (0, _inherits3.default)(PhraseRecorder, _BaseLfo);

  function PhraseRecorder() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, PhraseRecorder);

    var _this = (0, _possibleConstructorReturn3.default)(this, (PhraseRecorder.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorder)).call(this, definitions, options));

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


  (0, _createClass3.default)(PhraseRecorder, [{
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
      return this._phraseMaker.getPhrase();
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
      (0, _get3.default)(PhraseRecorder.prototype.__proto__ || (0, _getPrototypeOf2.default)(PhraseRecorder.prototype), 'onParamUpdate', this).call(this, name, value, metas);

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

      this._phraseMaker.addObservation(inData);
    }
  }]);
  return PhraseRecorder;
}(_BaseLfo2.BaseLfo);

exports.default = PhraseRecorderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBocmFzZVJlY29yZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiYmltb2RhbCIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJkaW1lbnNpb25JbnB1dCIsImNvbHVtbk5hbWVzIiwiUGhyYXNlUmVjb3JkZXIiLCJvcHRpb25zIiwiX3BocmFzZU1ha2VyIiwicGFyYW1zIiwiZ2V0IiwiX2lzU3RhcnRlZCIsImdldENvbmZpZyIsImxhYmVsIiwic2V0Q29uZmlnIiwiZ2V0UGhyYXNlIiwicmVzZXQiLCJuYW1lIiwidmFsdWUiLCJtZXRhcyIsImNvbmZpZyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwiZGltZW5zaW9uIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJpbkRhdGEiLCJkYXRhIiwib3V0RGF0YSIsImkiLCJhZGRPYnNlcnZhdGlvbiIsIlBocmFzZVJlY29yZGVyTGZvIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7QUFDQTs7OztBQUVBLElBQU1BLGNBQWM7QUFDbEJDLFdBQVM7QUFDUEMsVUFBTSxTQURDO0FBRVBDLGFBQVMsS0FGRjtBQUdQQyxjQUFVO0FBSEgsR0FEUztBQU1sQkMsa0JBQWdCO0FBQ2RILFVBQU0sU0FEUTtBQUVkQyxhQUFTLENBRks7QUFHZEMsY0FBVTtBQUhJLEdBTkU7QUFXbEJFLGVBQWE7QUFDWEosVUFBTSxLQURLO0FBRVhDLGFBQVMsQ0FBQyxFQUFELENBRkU7QUFHWEMsY0FBVTtBQUhDO0FBWEssQ0FBcEI7O0FBa0JBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7OztJQUlNRyxjOzs7QUFDSiw0QkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxzSkFDbEJSLFdBRGtCLEVBQ0xRLE9BREs7O0FBR3hCLFVBQUtDLFlBQUwsR0FBb0IsMkJBQWdCO0FBQ2xDUixlQUFTLE1BQUtTLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixTQUFoQixDQUR5QjtBQUVsQ04sc0JBQWdCLE1BQUtLLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixnQkFBaEIsQ0FGa0I7QUFHbENMLG1CQUFhLE1BQUtJLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixhQUFoQjtBQUhxQixLQUFoQixDQUFwQjs7QUFNQSxVQUFLQyxVQUFMLEdBQWtCLEtBQWxCO0FBVHdCO0FBVXpCOztBQUVEOzs7Ozs7OztxQ0FJaUI7QUFDZixhQUFPLEtBQUtILFlBQUwsQ0FBa0JJLFNBQWxCLEdBQThCLE9BQTlCLENBQVA7QUFDRDs7QUFFRDs7Ozs7OzttQ0FJZUMsSyxFQUFPO0FBQ3BCLFdBQUtMLFlBQUwsQ0FBa0JNLFNBQWxCLENBQTRCLEVBQUVELE9BQU9BLEtBQVQsRUFBNUI7QUFDRDs7QUFFRDs7Ozs7Ozt3Q0FJb0I7QUFDbEI7QUFDQSxhQUFPLEtBQUtMLFlBQUwsQ0FBa0JPLFNBQWxCLEVBQVA7QUFDRDs7QUFFRDs7Ozs7OzRCQUdRO0FBQ04sV0FBS1AsWUFBTCxDQUFrQlEsS0FBbEI7QUFDQSxXQUFLTCxVQUFMLEdBQWtCLElBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7MkJBSU87QUFDTCxXQUFLQSxVQUFMLEdBQWtCLEtBQWxCO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NNLEksRUFBTUMsSyxFQUFPQyxLLEVBQU87QUFDaEMsMEpBQW9CRixJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUNDLEtBQWpDOztBQUVBLFVBQU1DLFNBQVMsRUFBZjtBQUNBQSxhQUFPSCxJQUFQLElBQWVDLEtBQWY7QUFDQSxXQUFLVixZQUFMLENBQWtCTSxTQUFsQixDQUE0Qk0sTUFBNUI7QUFDRDs7QUFFRDs7OzswQ0FDMkM7QUFBQSxVQUF2QkMsZ0JBQXVCLHVFQUFKLEVBQUk7O0FBQ3pDLFdBQUtDLG1CQUFMLENBQXlCRCxnQkFBekI7O0FBRUEsV0FBS2IsWUFBTCxDQUFrQk0sU0FBbEIsQ0FBNEIsRUFBRVMsV0FBVyxLQUFLQyxZQUFMLENBQWtCQyxTQUEvQixFQUE1QjtBQUNBLFdBQUtqQixZQUFMLENBQWtCUSxLQUFsQjs7QUFFQSxXQUFLVSxxQkFBTDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFDbkIsVUFBSSxDQUFDLEtBQUtoQixVQUFWLEVBQXNCO0FBQ3BCO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFNYyxZQUFZLEtBQUtELFlBQUwsQ0FBa0JDLFNBQXBDO0FBQ0EsVUFBTUcsU0FBU0QsTUFBTUUsSUFBckI7QUFDQSxVQUFNQyxVQUFVLEtBQUtILEtBQUwsQ0FBV0UsSUFBM0I7O0FBRUEsV0FBSyxJQUFJRSxJQUFJLENBQWIsRUFBZ0JBLElBQUlOLFNBQXBCLEVBQStCTSxHQUEvQixFQUFvQztBQUNsQ0QsZ0JBQVFDLENBQVIsSUFBYUgsT0FBT0csQ0FBUCxDQUFiO0FBQ0Q7O0FBRUQsV0FBS3ZCLFlBQUwsQ0FBa0J3QixjQUFsQixDQUFpQ0osTUFBakM7QUFDRDs7Ozs7a0JBR1lLLGlCIiwiZmlsZSI6IlBocmFzZVJlY29yZGVyTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUxmbyB9IGZyb20gJ3dhdmVzLWxmby9jb21tb24vY29yZS9CYXNlTGZvJztcbmltcG9ydCB7IFBocmFzZU1ha2VyIH0gZnJvbSAneG1tLWNsaWVudCc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBiaW1vZGFsOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlXG4gIH0sXG4gIGRpbWVuc2lvbklucHV0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWVcbiAgfSxcbiAgY29sdW1uTmFtZXM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBbJyddLFxuICAgIGNvbnN0YW50OiB0cnVlXG4gIH0sXG59O1xuXG4vLyB1bmNvbW1lbnQgdGhpcyBhbmQgYWRkIHRvIG90aGVyIHhtbS1sZm8ncyB3aGVuIGxmbyBpcyBleHBvc2VkIGluIC9jb21tb24gYXMgd2VsbFxuLy8gb3IgdXNlIGNsaWVudCA/IChpdCdzIHZlcnkgbGlrZWx5IHRoYXQgd2Ugd29uJ3QgcnVuIHRoZXNlIGxmbydzIHNlcnZlci1zaWRlKVxuLy8gaWYgKGxmby52ZXJzaW9uIDwgJzEuMC4wJylcbi8vICB0aHJvdyBuZXcgRXJyb3IoJycpXG5cbi8qKlxuICogTGZvIGNsYXNzIHVzaW5nIFBocmFzZU1ha2VyIGNsYXNzIGZyb20geG1tLWNsaWVudFxuICogdG8gcmVjb3JkIGlucHV0IGRhdGEgYW5kIGZvcm1hdCBpdCBmb3IgeG1tLW5vZGUuXG4gKi9cbmNsYXNzIFBocmFzZVJlY29yZGVyIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3BocmFzZU1ha2VyID0gbmV3IFBocmFzZU1ha2VyKHtcbiAgICAgIGJpbW9kYWw6IHRoaXMucGFyYW1zLmdldCgnYmltb2RhbCcpLFxuICAgICAgZGltZW5zaW9uSW5wdXQ6IHRoaXMucGFyYW1zLmdldCgnZGltZW5zaW9uSW5wdXQnKSxcbiAgICAgIGNvbHVtbk5hbWVzOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbHVtbk5hbWVzJyksXG4gICAgfSk7XG5cbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgbGFiZWwgb2YgdGhlIGxhc3QgLyBjdXJyZW50bHkgYmVpbmcgcmVjb3JkZWQgcGhyYXNlLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfS5cbiAgICovXG4gIGdldFBocmFzZUxhYmVsKCkge1xuICAgIHJldHVybiB0aGlzLl9waHJhc2VNYWtlci5nZXRDb25maWcoKVsnbGFiZWwnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgbGFiZWwgb2YgdGhlIGxhc3QgLyBjdXJyZW50bHkgYmVpbmcgcmVjb3JkZWQgcGhyYXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBUaGUgbGFiZWwuXG4gICAqL1xuICBzZXRQaHJhc2VMYWJlbChsYWJlbCkge1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnNldENvbmZpZyh7IGxhYmVsOiBsYWJlbCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGxhdGVzdCByZWNvcmRlZCBwaHJhc2UuXG4gICAqIEByZXR1cm5zIHtYbW1QaHJhc2V9XG4gICAqL1xuICBnZXRSZWNvcmRlZFBocmFzZSgpIHtcbiAgICAvLyB0aGlzLnN0b3AoKTtcbiAgICByZXR1cm4gdGhpcy5fcGhyYXNlTWFrZXIuZ2V0UGhyYXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgcmVjb3JkaW5nIGEgcGhyYXNlIGZyb20gdGhlIGlucHV0IHN0cmVhbS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnJlc2V0KCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBjdXJyZW50IHJlY29yZGluZy5cbiAgICogKG1ha2VzIHRoZSBwaHJhc2UgYXZhaWxhYmxlIHZpYSA8Y29kZT5nZXRSZWNvcmRlZFBocmFzZSgpPC9jb2RlPikuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgY29uc3QgY29uZmlnID0ge307XG4gICAgY29uZmlnW25hbWVdID0gdmFsdWU7XG4gICAgdGhpcy5fcGhyYXNlTWFrZXIuc2V0Q29uZmlnKGNvbmZpZyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLl9waHJhc2VNYWtlci5zZXRDb25maWcoeyBkaW1lbnNpb246IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSB9KTtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5yZXNldCgpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgaWYgKCF0aGlzLl9pc1N0YXJ0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjb25zdCB7IGRhdGEgfSA9IGZyYW1lO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBpbkRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBvdXREYXRhW2ldID0gaW5EYXRhW2ldO1xuICAgIH1cblxuICAgIHRoaXMuX3BocmFzZU1ha2VyLmFkZE9ic2VydmF0aW9uKGluRGF0YSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGhyYXNlUmVjb3JkZXJMZm87Il19