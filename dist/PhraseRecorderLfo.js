'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _get = function get(object, property, receiver) { if (object === null) object = Function.prototype; var desc = Object.getOwnPropertyDescriptor(object, property); if (desc === undefined) { var parent = Object.getPrototypeOf(object); if (parent === null) { return undefined; } else { return get(parent, property, receiver); } } else if ("value" in desc) { return desc.value; } else { var getter = desc.get; if (getter === undefined) { return undefined; } return getter.call(receiver); } };

var _core = require('waves-lfo/core');

var _xmmClient = require('xmm-client');

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

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

var PhraseRecorderLfo = function (_BaseLfo) {
  _inherits(PhraseRecorderLfo, _BaseLfo);

  function PhraseRecorderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, PhraseRecorderLfo);

    var _this = _possibleConstructorReturn(this, (PhraseRecorderLfo.__proto__ || Object.getPrototypeOf(PhraseRecorderLfo)).call(this, definitions, options));

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


  _createClass(PhraseRecorderLfo, [{
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
      _get(PhraseRecorderLfo.prototype.__proto__ || Object.getPrototypeOf(PhraseRecorderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

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
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlBocmFzZVJlY29yZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwiYmltb2RhbCIsInR5cGUiLCJkZWZhdWx0IiwiY29uc3RhbnQiLCJkaW1lbnNpb25JbnB1dCIsImNvbHVtbk5hbWVzIiwiUGhyYXNlUmVjb3JkZXJMZm8iLCJvcHRpb25zIiwiX3BocmFzZU1ha2VyIiwicGFyYW1zIiwiZ2V0IiwiX2lzU3RhcnRlZCIsImdldENvbmZpZyIsImxhYmVsIiwic2V0Q29uZmlnIiwiZ2V0UGhyYXNlIiwicmVzZXQiLCJuYW1lIiwidmFsdWUiLCJtZXRhcyIsImNvbmZpZyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwiZGltZW5zaW9uIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJpbkRhdGEiLCJkYXRhIiwib3V0RGF0YSIsImkiLCJpbkFycmF5IiwiQXJyYXkiLCJsZW5ndGgiLCJhZGRPYnNlcnZhdGlvbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7Ozs7OztBQUVBLElBQU1BLGNBQWM7QUFDbEJDLFdBQVM7QUFDUEMsVUFBTSxTQURDO0FBRVBDLGFBQVMsS0FGRjtBQUdQQyxjQUFVO0FBSEgsR0FEUztBQU1sQkMsa0JBQWdCO0FBQ2RILFVBQU0sU0FEUTtBQUVkQyxhQUFTLENBRks7QUFHZEMsY0FBVTtBQUhJLEdBTkU7QUFXbEJFLGVBQWE7QUFDWEosVUFBTSxLQURLO0FBRVhDLGFBQVMsQ0FBQyxFQUFELENBRkU7QUFHWEMsY0FBVTtBQUhDO0FBWEssQ0FBcEI7O0FBa0JBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOzs7OztJQUlNRyxpQjs7O0FBQ0osK0JBQTBCO0FBQUEsUUFBZEMsT0FBYyx1RUFBSixFQUFJOztBQUFBOztBQUFBLHNJQUNsQlIsV0FEa0IsRUFDTFEsT0FESzs7QUFHeEIsVUFBS0MsWUFBTCxHQUFvQiwyQkFBZ0I7QUFDbENSLGVBQVMsTUFBS1MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFNBQWhCLENBRHlCO0FBRWxDTixzQkFBZ0IsTUFBS0ssTUFBTCxDQUFZQyxHQUFaLENBQWdCLGdCQUFoQixDQUZrQjtBQUdsQ0wsbUJBQWEsTUFBS0ksTUFBTCxDQUFZQyxHQUFaLENBQWdCLGFBQWhCO0FBSHFCLEtBQWhCLENBQXBCOztBQU1BLFVBQUtDLFVBQUwsR0FBa0IsS0FBbEI7QUFUd0I7QUFVekI7O0FBRUQ7Ozs7Ozs7O3FDQUlpQjtBQUNmLGFBQU8sS0FBS0gsWUFBTCxDQUFrQkksU0FBbEIsR0FBOEIsT0FBOUIsQ0FBUDtBQUNEOztBQUVEOzs7Ozs7O21DQUllQyxLLEVBQU87QUFDcEIsV0FBS0wsWUFBTCxDQUFrQk0sU0FBbEIsQ0FBNEIsRUFBRUQsT0FBT0EsS0FBVCxFQUE1QjtBQUNEOztBQUVEOzs7Ozs7O3dDQUlvQjtBQUNsQixhQUFPLEtBQUtMLFlBQUwsQ0FBa0JPLFNBQWxCLEVBQVA7QUFDRDs7QUFFRDs7Ozs7OzRCQUdRO0FBQ04sV0FBS1AsWUFBTCxDQUFrQlEsS0FBbEI7QUFDQSxXQUFLTCxVQUFMLEdBQWtCLElBQWxCO0FBQ0Q7O0FBRUQ7Ozs7Ozs7MkJBSU87QUFDTCxXQUFLQSxVQUFMLEdBQWtCLEtBQWxCO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NNLEksRUFBTUMsSyxFQUFPQyxLLEVBQU87QUFDaEMsMElBQW9CRixJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUNDLEtBQWpDOztBQUVBLFVBQU1DLFNBQVMsRUFBZjtBQUNBQSxhQUFPSCxJQUFQLElBQWVDLEtBQWY7QUFDQSxXQUFLVixZQUFMLENBQWtCTSxTQUFsQixDQUE0Qk0sTUFBNUI7QUFDRDs7QUFFRDs7OzswQ0FDMkM7QUFBQSxVQUF2QkMsZ0JBQXVCLHVFQUFKLEVBQUk7O0FBQ3pDLFdBQUtDLG1CQUFMLENBQXlCRCxnQkFBekI7O0FBRUEsV0FBS2IsWUFBTCxDQUFrQk0sU0FBbEIsQ0FBNEIsRUFBRVMsV0FBVyxLQUFLQyxZQUFMLENBQWtCQyxTQUEvQixFQUE1QjtBQUNBLFdBQUtqQixZQUFMLENBQWtCUSxLQUFsQjs7QUFFQSxXQUFLVSxxQkFBTDtBQUNEOztBQUVEOzs7O2tDQUNjQyxLLEVBQU87QUFDbkIsVUFBSSxDQUFDLEtBQUtoQixVQUFWLEVBQXNCO0FBQ3BCO0FBQ0Q7O0FBRUQ7QUFDQSxVQUFNYyxZQUFZLEtBQUtELFlBQUwsQ0FBa0JDLFNBQXBDO0FBQ0EsVUFBTUcsU0FBU0QsTUFBTUUsSUFBckI7QUFDQSxVQUFNQyxVQUFVLEtBQUtILEtBQUwsQ0FBV0UsSUFBM0I7O0FBRUEsV0FBSyxJQUFJRSxJQUFJLENBQWIsRUFBZ0JBLElBQUlOLFNBQXBCLEVBQStCTSxHQUEvQixFQUFvQztBQUNsQ0QsZ0JBQVFDLENBQVIsSUFBYUgsT0FBT0csQ0FBUCxDQUFiO0FBQ0Q7QUFDRDs7QUFFQSxVQUFNQyxVQUFVLElBQUlDLEtBQUosQ0FBVSxLQUFLVCxZQUFMLENBQWtCQyxTQUE1QixDQUFoQjtBQUNBLFdBQUssSUFBSU0sS0FBSSxDQUFiLEVBQWdCQSxLQUFJQyxRQUFRRSxNQUE1QixFQUFvQ0gsSUFBcEMsRUFBeUM7QUFDdkNDLGdCQUFRRCxFQUFSLElBQWFILE9BQU9HLEVBQVAsQ0FBYjtBQUNEOztBQUVELFdBQUt2QixZQUFMLENBQWtCMkIsY0FBbEIsQ0FBaUNILE9BQWpDO0FBQ0Q7Ozs7OztrQkFHWTFCLGlCIiwiZmlsZSI6IlBocmFzZVJlY29yZGVyTGZvLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHsgQmFzZUxmbyB9IGZyb20gJ3dhdmVzLWxmby9jb3JlJztcbmltcG9ydCB7IFBocmFzZU1ha2VyIH0gZnJvbSAneG1tLWNsaWVudCc7XG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBiaW1vZGFsOiB7XG4gICAgdHlwZTogJ2Jvb2xlYW4nLFxuICAgIGRlZmF1bHQ6IGZhbHNlLFxuICAgIGNvbnN0YW50OiB0cnVlXG4gIH0sXG4gIGRpbWVuc2lvbklucHV0OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDAsXG4gICAgY29uc3RhbnQ6IHRydWVcbiAgfSxcbiAgY29sdW1uTmFtZXM6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBbJyddLFxuICAgIGNvbnN0YW50OiB0cnVlXG4gIH0sXG59O1xuXG4vLyB1bmNvbW1lbnQgdGhpcyBhbmQgYWRkIHRvIG90aGVyIHhtbS1sZm8ncyB3aGVuIGxmbyBpcyBleHBvc2VkIGluIC9jb21tb24gYXMgd2VsbFxuLy8gb3IgdXNlIGNsaWVudCA/IChpdCdzIHZlcnkgbGlrZWx5IHRoYXQgd2Ugd29uJ3QgcnVuIHRoZXNlIGxmbydzIHNlcnZlci1zaWRlKVxuLy8gaWYgKGxmby52ZXJzaW9uIDwgJzEuMC4wJylcbi8vICB0aHJvdyBuZXcgRXJyb3IoJycpXG5cbi8qKlxuICogTGZvIGNsYXNzIHVzaW5nIFBocmFzZU1ha2VyIGNsYXNzIGZyb20geG1tLWNsaWVudFxuICogdG8gcmVjb3JkIGlucHV0IGRhdGEgYW5kIGZvcm1hdCBpdCBmb3IgeG1tLW5vZGUuXG4gKi9cbmNsYXNzIFBocmFzZVJlY29yZGVyTGZvIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX3BocmFzZU1ha2VyID0gbmV3IFBocmFzZU1ha2VyKHtcbiAgICAgIGJpbW9kYWw6IHRoaXMucGFyYW1zLmdldCgnYmltb2RhbCcpLFxuICAgICAgZGltZW5zaW9uSW5wdXQ6IHRoaXMucGFyYW1zLmdldCgnZGltZW5zaW9uSW5wdXQnKSxcbiAgICAgIGNvbHVtbk5hbWVzOiB0aGlzLnBhcmFtcy5nZXQoJ2NvbHVtbk5hbWVzJyksXG4gICAgfSk7XG5cbiAgICB0aGlzLl9pc1N0YXJ0ZWQgPSBmYWxzZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBHZXQgdGhlIGN1cnJlbnQgbGFiZWwgb2YgdGhlIGxhc3QgLyBjdXJyZW50bHkgYmVpbmcgcmVjb3JkZWQgcGhyYXNlLlxuICAgKiBAcmV0dXJucyB7U3RyaW5nfS5cbiAgICovXG4gIGdldFBocmFzZUxhYmVsKCkge1xuICAgIHJldHVybiB0aGlzLl9waHJhc2VNYWtlci5nZXRDb25maWcoKVsnbGFiZWwnXTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTZXQgdGhlIGN1cnJlbnQgbGFiZWwgb2YgdGhlIGxhc3QgLyBjdXJyZW50bHkgYmVpbmcgcmVjb3JkZWQgcGhyYXNlLlxuICAgKiBAcGFyYW0ge1N0cmluZ30gbGFiZWwgLSBUaGUgbGFiZWwuXG4gICAqL1xuICBzZXRQaHJhc2VMYWJlbChsYWJlbCkge1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnNldENvbmZpZyh7IGxhYmVsOiBsYWJlbCB9KTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXR1cm4gdGhlIGxhdGVzdCByZWNvcmRlZCBwaHJhc2UuXG4gICAqIEByZXR1cm5zIHtYbW1QaHJhc2V9XG4gICAqL1xuICBnZXRSZWNvcmRlZFBocmFzZSgpIHtcbiAgICByZXR1cm4gdGhpcy5fcGhyYXNlTWFrZXIuZ2V0UGhyYXNlKCk7XG4gIH1cblxuICAvKipcbiAgICogU3RhcnQgcmVjb3JkaW5nIGEgcGhyYXNlIGZyb20gdGhlIGlucHV0IHN0cmVhbS5cbiAgICovXG4gIHN0YXJ0KCkge1xuICAgIHRoaXMuX3BocmFzZU1ha2VyLnJlc2V0KCk7XG4gICAgdGhpcy5faXNTdGFydGVkID0gdHJ1ZTtcbiAgfVxuXG4gIC8qKlxuICAgKiBTdG9wIHRoZSBjdXJyZW50IHJlY29yZGluZy5cbiAgICogKG1ha2VzIHRoZSBwaHJhc2UgYXZhaWxhYmxlIHZpYSA8Y29kZT5nZXRSZWNvcmRlZFBocmFzZSgpPC9jb2RlPikuXG4gICAqL1xuICBzdG9wKCkge1xuICAgIHRoaXMuX2lzU3RhcnRlZCA9IGZhbHNlO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgY29uc3QgY29uZmlnID0ge307XG4gICAgY29uZmlnW25hbWVdID0gdmFsdWU7XG4gICAgdGhpcy5fcGhyYXNlTWFrZXIuc2V0Q29uZmlnKGNvbmZpZyk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLl9waHJhc2VNYWtlci5zZXRDb25maWcoeyBkaW1lbnNpb246IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSB9KTtcbiAgICB0aGlzLl9waHJhc2VNYWtlci5yZXNldCgpO1xuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgaWYgKCF0aGlzLl9pc1N0YXJ0ZWQpIHtcbiAgICAgIHJldHVybjtcbiAgICB9XG5cbiAgICAvLyBjb25zdCB7IGRhdGEgfSA9IGZyYW1lO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcbiAgICBjb25zdCBpbkRhdGEgPSBmcmFtZS5kYXRhO1xuICAgIGNvbnN0IG91dERhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBvdXREYXRhW2ldID0gaW5EYXRhW2ldO1xuICAgIH1cbiAgICAvL2NvbnNvbGUubG9nKG91dERhdGEpO1xuXG4gICAgY29uc3QgaW5BcnJheSA9IG5ldyBBcnJheSh0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaW5BcnJheVtpXSA9IGluRGF0YVtpXTtcbiAgICB9XG5cbiAgICB0aGlzLl9waHJhc2VNYWtlci5hZGRPYnNlcnZhdGlvbihpbkFycmF5KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBQaHJhc2VSZWNvcmRlckxmbztcbiJdfQ==