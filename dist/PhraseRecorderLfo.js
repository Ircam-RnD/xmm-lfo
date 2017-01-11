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

var _core = require('waves-lfo/core');

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
}(_core.BaseLfo);

exports.default = PhraseRecorderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBocmFzZVJlY29yZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiYmltb2RhbCIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJkaW1lbnNpb25JbnB1dCIsImNvbHVtbk5hbWVzIiwiUGhyYXNlUmVjb3JkZXJMZm8iLCJvcHRpb25zIiwiX3BocmFzZU1ha2VyIiwicGFyYW1zIiwiZ2V0IiwiX2lzU3RhcnRlZCIsImdldENvbmZpZyIsImxhYmVsIiwic2V0Q29uZmlnIiwiZ2V0UGhyYXNlIiwicmVzZXQiLCJuYW1lIiwidmFsdWUiLCJtZXRhcyIsImNvbmZpZyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwiZGltZW5zaW9uIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJpbkRhdGEiLCJkYXRhIiwib3V0RGF0YSIsImkiLCJpbkFycmF5IiwiQXJyYXkiLCJsZW5ndGgiLCJhZGRPYnNlcnZhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7O0FBRUE7Ozs7QUFFQSxJQUFNQSxjQUFjO0FBQ2xCQyxXQUFTO0FBQ1BDLFVBQU0sU0FEQztBQUVQQyxhQUFTLEtBRkY7QUFHUEMsY0FBVTtBQUhILEdBRFM7QUFNbEJDLGtCQUFnQjtBQUNkSCxVQUFNLFNBRFE7QUFFZEMsYUFBUyxDQUZLO0FBR2RDLGNBQVU7QUFISSxHQU5FO0FBV2xCRSxlQUFhO0FBQ1hKLFVBQU0sS0FESztBQUVYQyxhQUFTLENBQUMsRUFBRCxDQUZFO0FBR1hDLGNBQVU7QUFIQztBQVhLLENBQXBCOztBQWtCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUExQkE7O0lBOEJNRyxpQjs7O0FBQ0osK0JBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJO0FBQUE7O0FBQUEsNEpBQ2xCUixXQURrQixFQUNMUSxPQURLOztBQUd4QixVQUFLQyxZQUFMLEdBQW9CLDJCQUFnQjtBQUNsQ1IsZUFBUyxNQUFLUyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsU0FBaEIsQ0FEeUI7QUFFbENOLHNCQUFnQixNQUFLSyxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsZ0JBQWhCLENBRmtCO0FBR2xDTCxtQkFBYSxNQUFLSSxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsYUFBaEI7QUFIcUIsS0FBaEIsQ0FBcEI7O0FBTUEsVUFBS0MsVUFBTCxHQUFrQixLQUFsQjtBQVR3QjtBQVV6Qjs7QUFFRDs7Ozs7Ozs7cUNBSWlCO0FBQ2YsYUFBTyxLQUFLSCxZQUFMLENBQWtCSSxTQUFsQixHQUE4QixPQUE5QixDQUFQO0FBQ0Q7O0FBRUQ7Ozs7Ozs7bUNBSWVDLEssRUFBTztBQUNwQixXQUFLTCxZQUFMLENBQWtCTSxTQUFsQixDQUE0QixFQUFFRCxPQUFPQSxLQUFULEVBQTVCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7d0NBSW9CO0FBQ2xCLGFBQU8sS0FBS0wsWUFBTCxDQUFrQk8sU0FBbEIsRUFBUDtBQUNEOztBQUVEOzs7Ozs7NEJBR1E7QUFDTixXQUFLUCxZQUFMLENBQWtCUSxLQUFsQjtBQUNBLFdBQUtMLFVBQUwsR0FBa0IsSUFBbEI7QUFDRDs7QUFFRDs7Ozs7OzsyQkFJTztBQUNMLFdBQUtBLFVBQUwsR0FBa0IsS0FBbEI7QUFDRDs7QUFFRDs7OztrQ0FDY00sSSxFQUFNQyxLLEVBQU9DLEssRUFBTztBQUNoQyxnS0FBb0JGLElBQXBCLEVBQTBCQyxLQUExQixFQUFpQ0MsS0FBakM7O0FBRUEsVUFBTUMsU0FBUyxFQUFmO0FBQ0FBLGFBQU9ILElBQVAsSUFBZUMsS0FBZjtBQUNBLFdBQUtWLFlBQUwsQ0FBa0JNLFNBQWxCLENBQTRCTSxNQUE1QjtBQUNEOztBQUVEOzs7OzBDQUMyQztBQUFBLFVBQXZCQyxnQkFBdUIsdUVBQUosRUFBSTs7QUFDekMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxXQUFLYixZQUFMLENBQWtCTSxTQUFsQixDQUE0QixFQUFFUyxXQUFXLEtBQUtDLFlBQUwsQ0FBa0JDLFNBQS9CLEVBQTVCO0FBQ0EsV0FBS2pCLFlBQUwsQ0FBa0JRLEtBQWxCOztBQUVBLFdBQUtVLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBTztBQUNuQixVQUFJLENBQUMsS0FBS2hCLFVBQVYsRUFBc0I7QUFDcEI7QUFDRDs7QUFFRDtBQUNBLFVBQU1jLFlBQVksS0FBS0QsWUFBTCxDQUFrQkMsU0FBcEM7QUFDQSxVQUFNRyxTQUFTRCxNQUFNRSxJQUFyQjtBQUNBLFVBQU1DLFVBQVUsS0FBS0gsS0FBTCxDQUFXRSxJQUEzQjs7QUFFQSxXQUFLLElBQUlFLElBQUksQ0FBYixFQUFnQkEsSUFBSU4sU0FBcEIsRUFBK0JNLEdBQS9CLEVBQW9DO0FBQ2xDRCxnQkFBUUMsQ0FBUixJQUFhSCxPQUFPRyxDQUFQLENBQWI7QUFDRDtBQUNEOztBQUVBLFVBQU1DLFVBQVUsSUFBSUMsS0FBSixDQUFVLEtBQUtULFlBQUwsQ0FBa0JDLFNBQTVCLENBQWhCO0FBQ0EsV0FBSyxJQUFJTSxLQUFJLENBQWIsRUFBZ0JBLEtBQUlDLFFBQVFFLE1BQTVCLEVBQW9DSCxJQUFwQyxFQUF5QztBQUN2Q0MsZ0JBQVFELEVBQVIsSUFBYUgsT0FBT0csRUFBUCxDQUFiO0FBQ0Q7O0FBRUQsV0FBS3ZCLFlBQUwsQ0FBa0IyQixjQUFsQixDQUFpQ0gsT0FBakM7QUFDRDs7Ozs7a0JBR1kxQixpQiIsImZpbGUiOiJQaHJhc2VSZWNvcmRlckxmby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VMZm8gfSBmcm9tICd3YXZlcy1sZm8vY29yZSc7XG4vLyBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG5pbXBvcnQgeyBQaHJhc2VNYWtlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgYmltb2RhbDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZVxuICB9LFxuICBkaW1lbnNpb25JbnB1dDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlXG4gIH0sXG4gIGNvbHVtbk5hbWVzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogWycnXSxcbiAgICBjb25zdGFudDogdHJ1ZVxuICB9LFxufTtcblxuLy8gdW5jb21tZW50IHRoaXMgYW5kIGFkZCB0byBvdGhlciB4bW0tbGZvJ3Mgd2hlbiBsZm8gaXMgZXhwb3NlZCBpbiAvY29tbW9uIGFzIHdlbGxcbi8vIG9yIHVzZSBjbGllbnQgPyAoaXQncyB2ZXJ5IGxpa2VseSB0aGF0IHdlIHdvbid0IHJ1biB0aGVzZSBsZm8ncyBzZXJ2ZXItc2lkZSlcbi8vIGlmIChsZm8udmVyc2lvbiA8ICcxLjAuMCcpXG4vLyAgdGhyb3cgbmV3IEVycm9yKCcnKVxuXG4vKipcbiAqIExmbyBjbGFzcyB1c2luZyBQaHJhc2VNYWtlciBjbGFzcyBmcm9tIHhtbS1jbGllbnRcbiAqIHRvIHJlY29yZCBpbnB1dCBkYXRhIGFuZCBmb3JtYXQgaXQgZm9yIHhtbS1ub2RlLlxuICovXG5jbGFzcyBQaHJhc2VSZWNvcmRlckxmbyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9waHJhc2VNYWtlciA9IG5ldyBQaHJhc2VNYWtlcih7XG4gICAgICBiaW1vZGFsOiB0aGlzLnBhcmFtcy5nZXQoJ2JpbW9kYWwnKSxcbiAgICAgIGRpbWVuc2lvbklucHV0OiB0aGlzLnBhcmFtcy5nZXQoJ2RpbWVuc2lvbklucHV0JyksXG4gICAgICBjb2x1bW5OYW1lczogdGhpcy5wYXJhbXMuZ2V0KCdjb2x1bW5OYW1lcycpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGxhYmVsIG9mIHRoZSBsYXN0IC8gY3VycmVudGx5IGJlaW5nIHJlY29yZGVkIHBocmFzZS5cbiAgICogQHJldHVybnMge1N0cmluZ30uXG4gICAqL1xuICBnZXRQaHJhc2VMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGhyYXNlTWFrZXIuZ2V0Q29uZmlnKClbJ2xhYmVsJ107XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IGxhYmVsIG9mIHRoZSBsYXN0IC8gY3VycmVudGx5IGJlaW5nIHJlY29yZGVkIHBocmFzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gVGhlIGxhYmVsLlxuICAgKi9cbiAgc2V0UGhyYXNlTGFiZWwobGFiZWwpIHtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5zZXRDb25maWcoeyBsYWJlbDogbGFiZWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBsYXRlc3QgcmVjb3JkZWQgcGhyYXNlLlxuICAgKiBAcmV0dXJucyB7WG1tUGhyYXNlfVxuICAgKi9cbiAgZ2V0UmVjb3JkZWRQaHJhc2UoKSB7XG4gICAgcmV0dXJuIHRoaXMuX3BocmFzZU1ha2VyLmdldFBocmFzZSgpO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHJlY29yZGluZyBhIHBocmFzZSBmcm9tIHRoZSBpbnB1dCBzdHJlYW0uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5yZXNldCgpO1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCB0aGUgY3VycmVudCByZWNvcmRpbmcuXG4gICAqIChtYWtlcyB0aGUgcGhyYXNlIGF2YWlsYWJsZSB2aWEgPGNvZGU+Z2V0UmVjb3JkZWRQaHJhc2UoKTwvY29kZT4pLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IHt9O1xuICAgIGNvbmZpZ1tuYW1lXSA9IHZhbHVlO1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnNldENvbmZpZyhjb25maWcpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5fcGhyYXNlTWFrZXIuc2V0Q29uZmlnKHsgZGltZW5zaW9uOiB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgfSk7XG4gICAgdGhpcy5fcGhyYXNlTWFrZXIucmVzZXQoKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY29uc3QgeyBkYXRhIH0gPSBmcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgb3V0RGF0YVtpXSA9IGluRGF0YVtpXTtcbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhvdXREYXRhKTtcblxuICAgIGNvbnN0IGluQXJyYXkgPSBuZXcgQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluQXJyYXlbaV0gPSBpbkRhdGFbaV07XG4gICAgfVxuXG4gICAgdGhpcy5fcGhyYXNlTWFrZXIuYWRkT2JzZXJ2YXRpb24oaW5BcnJheSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgUGhyYXNlUmVjb3JkZXJMZm87Il19