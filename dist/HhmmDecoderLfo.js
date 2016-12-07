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
  model: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'static' }
  },
  likelihoodWindow: {
    type: 'integer',
    default: 20,
    min: 1,
    max: 1e30
  },
  output: {
    type: 'enum',
    default: 'likelihoods',
    list: ['likelihoods', 'regression'],
    constant: true
  },
  callback: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'dynamic' }
  }
};

/**
 * Lfo class loading Hierarchical HMM models created by the xmm library to
 * process an input stream of vectors (models must have been trained from the
 * same input stream).
 * As the results of the classification / following / regression are more
 * complex than a simple vector, a callback function can be passed to the
 * constructor to handle them, or they can alternatively be queried via the
 * readonly filterResults property.
 * @class
 */

// import * as lfo from 'waves-lfo/client';

var HhmmDecoderLfo = function (_BaseLfo) {
  (0, _inherits3.default)(HhmmDecoderLfo, _BaseLfo);

  function HhmmDecoderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, HhmmDecoderLfo);

    var _this = (0, _possibleConstructorReturn3.default)(this, (HhmmDecoderLfo.__proto__ || (0, _getPrototypeOf2.default)(HhmmDecoderLfo)).call(this, definitions, options));

    _this._decoder = new _xmmClient.HhmmDecoder(_this.params.get('likelihoodWindow'));
    return _this;
  }

  /**
   * Resets the intermediate results of the estimation.
   */


  (0, _createClass3.default)(HhmmDecoderLfo, [{
    key: 'reset',
    value: function reset() {
      this._decoder.reset();
    }

    /** @private */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(HhmmDecoderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(HhmmDecoderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

      if (name === 'likelihoodWindow') {
        this._decoder.setLikelihoodWindow(value);
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.prepareStreamParams(prevStreamParams);

      this._decoder.setModel(this.params.get('model'));

      if (this.params.get('output') === 'likelihoods') {
        this.streamParams.frameSize = this._decoder.getNumberOfClasses();
      } else {
        // === 'regression'
        this.streamParams.frameSize = this._decoder.getRegressionVectorSize();
      }

      this.propagateStreamParams();
    }

    /** @private */

  }, {
    key: 'processVector',
    value: function processVector(frame) {
      var inArray = new Array(frame.data.length);
      for (var i = 0; i < inArray.length; i++) {
        inArray[i] = frame.data[i];
      }

      var res = this._decoder.filter(inArray);
      var callback = this.params.get('callback');
      var outData = void 0;
      if (this.params.get('output') === 'likelihoods') {
        outData = res.likelihoods;
      } else {
        outData = res.outputValues;
      }

      var data = this.frame.data;
      var frameSize = this.streamParams.frameSize;

      for (var _i = 0; _i < frameSize; _i++) {
        data[_i] = outData[_i];
      }

      if (callback) {
        callback(res);
      }
    }
  }]);
  return HhmmDecoderLfo;
}(_BaseLfo3.default);

;

exports.default = HhmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhobW1EZWNvZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwibW9kZWwiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwibWV0YXMiLCJraW5kIiwibGlrZWxpaG9vZFdpbmRvdyIsIm1pbiIsIm1heCIsIm91dHB1dCIsImxpc3QiLCJjb25zdGFudCIsImNhbGxiYWNrIiwiSGhtbURlY29kZXJMZm8iLCJvcHRpb25zIiwiX2RlY29kZXIiLCJwYXJhbXMiLCJnZXQiLCJyZXNldCIsIm5hbWUiLCJ2YWx1ZSIsInNldExpa2VsaWhvb2RXaW5kb3ciLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsInNldE1vZGVsIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwiZ2V0TnVtYmVyT2ZDbGFzc2VzIiwiZ2V0UmVncmVzc2lvblZlY3RvclNpemUiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmcmFtZSIsImluQXJyYXkiLCJBcnJheSIsImRhdGEiLCJsZW5ndGgiLCJpIiwicmVzIiwiZmlsdGVyIiwib3V0RGF0YSIsImxpa2VsaWhvb2RzIiwib3V0cHV0VmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBR0EsSUFBTUEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLEtBREQ7QUFFTEMsYUFBUyxJQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPLEVBQUVDLE1BQU0sUUFBUjtBQUpGLEdBRFc7QUFPbEJDLG9CQUFrQjtBQUNoQkwsVUFBTSxTQURVO0FBRWhCQyxhQUFTLEVBRk87QUFHaEJLLFNBQUssQ0FIVztBQUloQkMsU0FBSztBQUpXLEdBUEE7QUFhbEJDLFVBQVE7QUFDTlIsVUFBTSxNQURBO0FBRU5DLGFBQVMsYUFGSDtBQUdOUSxVQUFNLENBQUMsYUFBRCxFQUFnQixZQUFoQixDQUhBO0FBSU5DLGNBQVU7QUFKSixHQWJVO0FBbUJsQkMsWUFBVTtBQUNSWCxVQUFNLEtBREU7QUFFUkMsYUFBUyxJQUZEO0FBR1JDLGNBQVUsSUFIRjtBQUlSQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUpDO0FBbkJRLENBQXBCOztBQTRCQTs7Ozs7Ozs7Ozs7QUFoQ0E7O0lBMENNUSxjOzs7QUFDSiw0QkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxzSkFDbEJmLFdBRGtCLEVBQ0xlLE9BREs7O0FBR3hCLFVBQUtDLFFBQUwsR0FBZ0IsMkJBQWdCLE1BQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixrQkFBaEIsQ0FBaEIsQ0FBaEI7QUFId0I7QUFJekI7O0FBRUQ7Ozs7Ozs7NEJBR1E7QUFDTixXQUFLRixRQUFMLENBQWNHLEtBQWQ7QUFDRDs7QUFFRDs7OztrQ0FDY0MsSSxFQUFNQyxLLEVBQU9oQixLLEVBQU87QUFDaEMsMEpBQW9CZSxJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUNoQixLQUFqQzs7QUFFQSxVQUFJZSxTQUFTLGtCQUFiLEVBQWlDO0FBQy9CLGFBQUtKLFFBQUwsQ0FBY00sbUJBQWQsQ0FBa0NELEtBQWxDO0FBQ0Q7QUFDRjs7QUFFRDs7OzswQ0FDMkM7QUFBQSxVQUF2QkUsZ0JBQXVCLHVFQUFKLEVBQUk7O0FBQ3pDLFdBQUtDLG1CQUFMLENBQXlCRCxnQkFBekI7O0FBRUEsV0FBS1AsUUFBTCxDQUFjUyxRQUFkLENBQXVCLEtBQUtSLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixDQUF2Qjs7QUFFQSxVQUFJLEtBQUtELE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixNQUE4QixhQUFsQyxFQUFpRDtBQUMvQyxhQUFLUSxZQUFMLENBQWtCQyxTQUFsQixHQUE4QixLQUFLWCxRQUFMLENBQWNZLGtCQUFkLEVBQTlCO0FBQ0QsT0FGRCxNQUVPO0FBQUU7QUFDUCxhQUFLRixZQUFMLENBQWtCQyxTQUFsQixHQUE4QixLQUFLWCxRQUFMLENBQWNhLHVCQUFkLEVBQTlCO0FBQ0Q7O0FBRUQsV0FBS0MscUJBQUw7QUFDRDs7QUFFRDs7OztrQ0FDY0MsSyxFQUFPO0FBQ25CLFVBQU1DLFVBQVUsSUFBSUMsS0FBSixDQUFVRixNQUFNRyxJQUFOLENBQVdDLE1BQXJCLENBQWhCO0FBQ0EsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLFFBQVFHLE1BQTVCLEVBQW9DQyxHQUFwQyxFQUF5QztBQUN2Q0osZ0JBQVFJLENBQVIsSUFBYUwsTUFBTUcsSUFBTixDQUFXRSxDQUFYLENBQWI7QUFDRDs7QUFFRCxVQUFNQyxNQUFNLEtBQUtyQixRQUFMLENBQWNzQixNQUFkLENBQXFCTixPQUFyQixDQUFaO0FBQ0EsVUFBTW5CLFdBQVcsS0FBS0ksTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLENBQWpCO0FBQ0EsVUFBSXFCLGdCQUFKO0FBQ0EsVUFBSSxLQUFLdEIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DcUIsa0JBQVVGLElBQUlHLFdBQWQ7QUFDRCxPQUZELE1BRU87QUFDTEQsa0JBQVVGLElBQUlJLFlBQWQ7QUFDRDs7QUFFRCxVQUFNUCxPQUFPLEtBQUtILEtBQUwsQ0FBV0csSUFBeEI7QUFDQSxVQUFNUCxZQUFZLEtBQUtELFlBQUwsQ0FBa0JDLFNBQXBDOztBQUVBLFdBQUssSUFBSVMsS0FBSSxDQUFiLEVBQWdCQSxLQUFJVCxTQUFwQixFQUErQlMsSUFBL0IsRUFBb0M7QUFDbENGLGFBQUtFLEVBQUwsSUFBVUcsUUFBUUgsRUFBUixDQUFWO0FBQ0Q7O0FBRUQsVUFBSXZCLFFBQUosRUFBYztBQUNaQSxpQkFBU3dCLEdBQVQ7QUFDRDtBQUNGOzs7OztBQUNGOztrQkFFY3ZCLGMiLCJmaWxlIjoiSGhtbURlY29kZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG4vLyBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG5pbXBvcnQgeyBIaG1tRGVjb2RlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBtb2RlbDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSwgXG4gIGxpa2VsaWhvb2RXaW5kb3c6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjAsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWUzMCxcbiAgfSxcbiAgb3V0cHV0OiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGRlZmF1bHQ6ICdsaWtlbGlob29kcycsXG4gICAgbGlzdDogWydsaWtlbGlob29kcycsICdyZWdyZXNzaW9uJ10sXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfVxufTtcblxuXG4vKipcbiAqIExmbyBjbGFzcyBsb2FkaW5nIEhpZXJhcmNoaWNhbCBITU0gbW9kZWxzIGNyZWF0ZWQgYnkgdGhlIHhtbSBsaWJyYXJ5IHRvXG4gKiBwcm9jZXNzIGFuIGlucHV0IHN0cmVhbSBvZiB2ZWN0b3JzIChtb2RlbHMgbXVzdCBoYXZlIGJlZW4gdHJhaW5lZCBmcm9tIHRoZVxuICogc2FtZSBpbnB1dCBzdHJlYW0pLlxuICogQXMgdGhlIHJlc3VsdHMgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIC8gZm9sbG93aW5nIC8gcmVncmVzc2lvbiBhcmUgbW9yZVxuICogY29tcGxleCB0aGFuIGEgc2ltcGxlIHZlY3RvciwgYSBjYWxsYmFjayBmdW5jdGlvbiBjYW4gYmUgcGFzc2VkIHRvIHRoZVxuICogY29uc3RydWN0b3IgdG8gaGFuZGxlIHRoZW0sIG9yIHRoZXkgY2FuIGFsdGVybmF0aXZlbHkgYmUgcXVlcmllZCB2aWEgdGhlXG4gKiByZWFkb25seSBmaWx0ZXJSZXN1bHRzIHByb3BlcnR5LlxuICogQGNsYXNzXG4gKi9cbmNsYXNzIEhobW1EZWNvZGVyTGZvIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2RlY29kZXIgPSBuZXcgSGhtbURlY29kZXIodGhpcy5wYXJhbXMuZ2V0KCdsaWtlbGlob29kV2luZG93JykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIGVzdGltYXRpb24uXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9kZWNvZGVyLnJlc2V0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2xpa2VsaWhvb2RXaW5kb3cnKSB7XG4gICAgICB0aGlzLl9kZWNvZGVyLnNldExpa2VsaWhvb2RXaW5kb3codmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuX2RlY29kZXIuc2V0TW9kZWwodGhpcy5wYXJhbXMuZ2V0KCdtb2RlbCcpKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLmdldE51bWJlck9mQ2xhc3NlcygpO1xuICAgIH0gZWxzZSB7IC8vID09PSAncmVncmVzc2lvbidcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIuZ2V0UmVncmVzc2lvblZlY3RvclNpemUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICBjb25zdCBpbkFycmF5ID0gbmV3IEFycmF5KGZyYW1lLmRhdGEubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluQXJyYXlbaV0gPSBmcmFtZS5kYXRhW2ldO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcyA9IHRoaXMuX2RlY29kZXIuZmlsdGVyKGluQXJyYXkpO1xuICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdjYWxsYmFjaycpO1xuICAgIGxldCBvdXREYXRhO1xuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICBvdXREYXRhID0gcmVzLmxpa2VsaWhvb2RzO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXREYXRhID0gcmVzLm91dHB1dFZhbHVlcztcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGRhdGFbaV0gPSBvdXREYXRhW2ldO1xuICAgIH1cblxuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgY2FsbGJhY2socmVzKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEhobW1EZWNvZGVyTGZvOyJdfQ==