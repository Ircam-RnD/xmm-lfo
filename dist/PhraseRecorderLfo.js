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

// export default PhraseRecorderLfo;


exports.default = PhraseRecorderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBocmFzZVJlY29yZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiYmltb2RhbCIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJkaW1lbnNpb25JbnB1dCIsImNvbHVtbk5hbWVzIiwiUGhyYXNlUmVjb3JkZXJMZm8iLCJvcHRpb25zIiwiX3BocmFzZU1ha2VyIiwicGFyYW1zIiwiZ2V0IiwiX2lzU3RhcnRlZCIsImdldENvbmZpZyIsImxhYmVsIiwic2V0Q29uZmlnIiwiY29uc29sZSIsImxvZyIsInBocmFzZSIsInJlc2V0IiwibmFtZSIsInZhbHVlIiwibWV0YXMiLCJjb25maWciLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsImRpbWVuc2lvbiIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImZyYW1lIiwiaW5EYXRhIiwiZGF0YSIsIm91dERhdGEiLCJpIiwiaW5BcnJheSIsIkFycmF5IiwibGVuZ3RoIiwiYWRkT2JzZXJ2YXRpb24iXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOzs7O0FBRUE7Ozs7QUFFQSxJQUFNQSxjQUFjO0FBQ2xCQyxXQUFTO0FBQ1BDLFVBQU0sU0FEQztBQUVQQyxhQUFTLEtBRkY7QUFHUEMsY0FBVTtBQUhILEdBRFM7QUFNbEJDLGtCQUFnQjtBQUNkSCxVQUFNLFNBRFE7QUFFZEMsYUFBUyxDQUZLO0FBR2RDLGNBQVU7QUFISSxHQU5FO0FBV2xCRSxlQUFhO0FBQ1hKLFVBQU0sS0FESztBQUVYQyxhQUFTLENBQUMsRUFBRCxDQUZFO0FBR1hDLGNBQVU7QUFIQztBQVhLLENBQXBCOztBQWtCQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7Ozs7QUExQkE7O0lBOEJxQkcsaUI7OztBQUNuQiwrQkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSw0SkFDbEJSLFdBRGtCLEVBQ0xRLE9BREs7O0FBR3hCLFVBQUtDLFlBQUwsR0FBb0IsMkJBQWdCO0FBQ2xDUixlQUFTLE1BQUtTLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixTQUFoQixDQUR5QjtBQUVsQ04sc0JBQWdCLE1BQUtLLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixnQkFBaEIsQ0FGa0I7QUFHbENMLG1CQUFhLE1BQUtJLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixhQUFoQjtBQUhxQixLQUFoQixDQUFwQjs7QUFNQSxVQUFLQyxVQUFMLEdBQWtCLEtBQWxCO0FBVHdCO0FBVXpCOztBQUVEOzs7Ozs7OztxQ0FJaUI7QUFDZixhQUFPLEtBQUtILFlBQUwsQ0FBa0JJLFNBQWxCLEdBQThCLE9BQTlCLENBQVA7QUFDRDs7QUFFRDs7Ozs7OzttQ0FJZUMsSyxFQUFPO0FBQ3BCLFdBQUtMLFlBQUwsQ0FBa0JNLFNBQWxCLENBQTRCLEVBQUVELE9BQU9BLEtBQVQsRUFBNUI7QUFDRDs7QUFFRDs7Ozs7Ozt3Q0FJb0I7QUFDbEI7QUFDQUUsY0FBUUMsR0FBUixDQUFZLEtBQUtSLFlBQUwsQ0FBa0JTLE1BQTlCO0FBQ0EsYUFBTyxLQUFLVCxZQUFMLENBQWtCUyxNQUF6QjtBQUNEOztBQUVEOzs7Ozs7NEJBR1E7QUFDTixXQUFLVCxZQUFMLENBQWtCVSxLQUFsQjtBQUNBLFdBQUtQLFVBQUwsR0FBa0IsSUFBbEI7QUFDRDs7QUFFRDs7Ozs7OzsyQkFJTztBQUNMLFdBQUtBLFVBQUwsR0FBa0IsS0FBbEI7QUFDRDs7QUFFRDs7OztrQ0FDY1EsSSxFQUFNQyxLLEVBQU9DLEssRUFBTztBQUNoQyxnS0FBb0JGLElBQXBCLEVBQTBCQyxLQUExQixFQUFpQ0MsS0FBakM7O0FBRUEsVUFBTUMsU0FBUyxFQUFmO0FBQ0FBLGFBQU9ILElBQVAsSUFBZUMsS0FBZjtBQUNBLFdBQUtaLFlBQUwsQ0FBa0JNLFNBQWxCLENBQTRCUSxNQUE1QjtBQUNEOztBQUVEOzs7OzBDQUMyQztBQUFBLFVBQXZCQyxnQkFBdUIsdUVBQUosRUFBSTs7QUFDekMsV0FBS0MsbUJBQUwsQ0FBeUJELGdCQUF6Qjs7QUFFQSxXQUFLZixZQUFMLENBQWtCTSxTQUFsQixDQUE0QixFQUFFVyxXQUFXLEtBQUtDLFlBQUwsQ0FBa0JDLFNBQS9CLEVBQTVCO0FBQ0EsV0FBS25CLFlBQUwsQ0FBa0JVLEtBQWxCOztBQUVBLFdBQUtVLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBTztBQUNuQixVQUFJLENBQUMsS0FBS2xCLFVBQVYsRUFBc0I7QUFDcEI7QUFDRDs7QUFFRDtBQUNBLFVBQU1nQixZQUFZLEtBQUtELFlBQUwsQ0FBa0JDLFNBQXBDO0FBQ0EsVUFBTUcsU0FBU0QsTUFBTUUsSUFBckI7QUFDQSxVQUFNQyxVQUFVLEtBQUtILEtBQUwsQ0FBV0UsSUFBM0I7O0FBRUEsV0FBSyxJQUFJRSxJQUFJLENBQWIsRUFBZ0JBLElBQUlOLFNBQXBCLEVBQStCTSxHQUEvQixFQUFvQztBQUNsQ0QsZ0JBQVFDLENBQVIsSUFBYUgsT0FBT0csQ0FBUCxDQUFiO0FBQ0Q7QUFDRDs7QUFFQSxVQUFNQyxVQUFVLElBQUlDLEtBQUosQ0FBVSxLQUFLVCxZQUFMLENBQWtCQyxTQUE1QixDQUFoQjtBQUNBLFdBQUssSUFBSU0sS0FBSSxDQUFiLEVBQWdCQSxLQUFJQyxRQUFRRSxNQUE1QixFQUFvQ0gsSUFBcEMsRUFBeUM7QUFDdkNDLGdCQUFRRCxFQUFSLElBQWFILE9BQU9HLEVBQVAsQ0FBYjtBQUNEOztBQUVELFdBQUt6QixZQUFMLENBQWtCNkIsY0FBbEIsQ0FBaUNILE9BQWpDO0FBQ0Q7Ozs7O0FBR0g7OztrQkFuR3FCNUIsaUIiLCJmaWxlIjoiUGhyYXNlUmVjb3JkZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG4vLyBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG5pbXBvcnQgeyBQaHJhc2VNYWtlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgYmltb2RhbDoge1xuICAgIHR5cGU6ICdib29sZWFuJyxcbiAgICBkZWZhdWx0OiBmYWxzZSxcbiAgICBjb25zdGFudDogdHJ1ZVxuICB9LFxuICBkaW1lbnNpb25JbnB1dDoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAwLFxuICAgIGNvbnN0YW50OiB0cnVlXG4gIH0sXG4gIGNvbHVtbk5hbWVzOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogWycnXSxcbiAgICBjb25zdGFudDogdHJ1ZVxuICB9LFxufTtcblxuLy8gdW5jb21tZW50IHRoaXMgYW5kIGFkZCB0byBvdGhlciB4bW0tbGZvJ3Mgd2hlbiBsZm8gaXMgZXhwb3NlZCBpbiAvY29tbW9uIGFzIHdlbGxcbi8vIG9yIHVzZSBjbGllbnQgPyAoaXQncyB2ZXJ5IGxpa2VseSB0aGF0IHdlIHdvbid0IHJ1biB0aGVzZSBsZm8ncyBzZXJ2ZXItc2lkZSlcbi8vIGlmIChsZm8udmVyc2lvbiA8ICcxLjAuMCcpXG4vLyAgdGhyb3cgbmV3IEVycm9yKCcnKVxuXG4vKipcbiAqIExmbyBjbGFzcyB1c2luZyBQaHJhc2VNYWtlciBjbGFzcyBmcm9tIHhtbS1jbGllbnRcbiAqIHRvIHJlY29yZCBpbnB1dCBkYXRhIGFuZCBmb3JtYXQgaXQgZm9yIHhtbS1ub2RlLlxuICovXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBQaHJhc2VSZWNvcmRlckxmbyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9waHJhc2VNYWtlciA9IG5ldyBQaHJhc2VNYWtlcih7XG4gICAgICBiaW1vZGFsOiB0aGlzLnBhcmFtcy5nZXQoJ2JpbW9kYWwnKSxcbiAgICAgIGRpbWVuc2lvbklucHV0OiB0aGlzLnBhcmFtcy5nZXQoJ2RpbWVuc2lvbklucHV0JyksXG4gICAgICBjb2x1bW5OYW1lczogdGhpcy5wYXJhbXMuZ2V0KCdjb2x1bW5OYW1lcycpLFxuICAgIH0pO1xuXG4gICAgdGhpcy5faXNTdGFydGVkID0gZmFsc2U7XG4gIH1cblxuICAvKipcbiAgICogR2V0IHRoZSBjdXJyZW50IGxhYmVsIG9mIHRoZSBsYXN0IC8gY3VycmVudGx5IGJlaW5nIHJlY29yZGVkIHBocmFzZS5cbiAgICogQHJldHVybnMge1N0cmluZ30uXG4gICAqL1xuICBnZXRQaHJhc2VMYWJlbCgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGhyYXNlTWFrZXIuZ2V0Q29uZmlnKClbJ2xhYmVsJ107XG4gIH1cblxuICAvKipcbiAgICogU2V0IHRoZSBjdXJyZW50IGxhYmVsIG9mIHRoZSBsYXN0IC8gY3VycmVudGx5IGJlaW5nIHJlY29yZGVkIHBocmFzZS5cbiAgICogQHBhcmFtIHtTdHJpbmd9IGxhYmVsIC0gVGhlIGxhYmVsLlxuICAgKi9cbiAgc2V0UGhyYXNlTGFiZWwobGFiZWwpIHtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5zZXRDb25maWcoeyBsYWJlbDogbGFiZWwgfSk7XG4gIH1cblxuICAvKipcbiAgICogUmV0dXJuIHRoZSBsYXRlc3QgcmVjb3JkZWQgcGhyYXNlLlxuICAgKiBAcmV0dXJucyB7WG1tUGhyYXNlfVxuICAgKi9cbiAgZ2V0UmVjb3JkZWRQaHJhc2UoKSB7XG4gICAgLy8gdGhpcy5zdG9wKCk7XG4gICAgY29uc29sZS5sb2codGhpcy5fcGhyYXNlTWFrZXIucGhyYXNlKTtcbiAgICByZXR1cm4gdGhpcy5fcGhyYXNlTWFrZXIucGhyYXNlO1xuICB9XG5cbiAgLyoqXG4gICAqIFN0YXJ0IHJlY29yZGluZyBhIHBocmFzZSBmcm9tIHRoZSBpbnB1dCBzdHJlYW0uXG4gICAqL1xuICBzdGFydCgpIHtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5yZXNldCgpO1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IHRydWU7XG4gIH1cblxuICAvKipcbiAgICogU3RvcCB0aGUgY3VycmVudCByZWNvcmRpbmcuXG4gICAqIChtYWtlcyB0aGUgcGhyYXNlIGF2YWlsYWJsZSB2aWEgPGNvZGU+Z2V0UmVjb3JkZWRQaHJhc2UoKTwvY29kZT4pLlxuICAgKi9cbiAgc3RvcCgpIHtcbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGNvbnN0IGNvbmZpZyA9IHt9O1xuICAgIGNvbmZpZ1tuYW1lXSA9IHZhbHVlO1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnNldENvbmZpZyhjb25maWcpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgdGhpcy5fcGhyYXNlTWFrZXIuc2V0Q29uZmlnKHsgZGltZW5zaW9uOiB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgfSk7XG4gICAgdGhpcy5fcGhyYXNlTWFrZXIucmVzZXQoKTtcblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGlmICghdGhpcy5faXNTdGFydGVkKSB7XG4gICAgICByZXR1cm47XG4gICAgfVxuXG4gICAgLy8gY29uc3QgeyBkYXRhIH0gPSBmcmFtZTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG4gICAgY29uc3QgaW5EYXRhID0gZnJhbWUuZGF0YTtcbiAgICBjb25zdCBvdXREYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgb3V0RGF0YVtpXSA9IGluRGF0YVtpXTtcbiAgICB9XG4gICAgLy9jb25zb2xlLmxvZyhvdXREYXRhKTtcblxuICAgIGNvbnN0IGluQXJyYXkgPSBuZXcgQXJyYXkodGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluQXJyYXlbaV0gPSBpbkRhdGFbaV07XG4gICAgfVxuXG4gICAgdGhpcy5fcGhyYXNlTWFrZXIuYWRkT2JzZXJ2YXRpb24oaW5BcnJheSk7XG4gIH1cbn1cblxuLy8gZXhwb3J0IGRlZmF1bHQgUGhyYXNlUmVjb3JkZXJMZm87Il19