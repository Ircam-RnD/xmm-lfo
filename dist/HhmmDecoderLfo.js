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
        this._decoder.likelihoodWindow = value;
      }
    }

    /** @private */

  }, {
    key: 'processStreamParams',
    value: function processStreamParams() {
      var prevStreamParams = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

      this.prepareStreamParams(prevStreamParams);

      this._decoder.model = this.params.get('model');
      console.log(this._decoder.model);

      if (this.params.get('output') === 'likelihoods') {
        this.streamParams.frameSize = this._decoder.nbClasses;
      } else {
        // === 'regression'
        this.streamParams.frameSize = this._decoder.regressionSize;
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

      // this._decoder.filter(inArray, (err, res) => {
      //   if (err === null) {
      //     const callback = this.params.get('callback');
      //     // let resData;
      //     // if (this.params.get('output') === 'likelihoods') {
      //     //   resData = res.likelihoods;
      //     // } else { // === 'regression'
      //     //   resData = res.outputValues;
      //     // }
      //     const resData = res.likelihoods;
      //     const data = this.frame.data;
      //     const frameSize = this.streamParams.frameSize;

      //     for (let i = 0; i < frameSize; i++) {
      //       data[i] = resData[i];
      //     }

      //     if (callback) {
      //       callback(res);
      //     }
      //   }

      //   this.propagateFrame();
      // });
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

    /** @private */
    // processFrame(frame) {
    //   this.prepareFrame(frame);
    //   this.processFunction(frame);
    // }

  }]);
  return HhmmDecoderLfo;
}(_BaseLfo3.default);

;

exports.default = HhmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhobW1EZWNvZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwibW9kZWwiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwibWV0YXMiLCJraW5kIiwibGlrZWxpaG9vZFdpbmRvdyIsIm1pbiIsIm1heCIsIm91dHB1dCIsImxpc3QiLCJjb25zdGFudCIsImNhbGxiYWNrIiwiSGhtbURlY29kZXJMZm8iLCJvcHRpb25zIiwiX2RlY29kZXIiLCJwYXJhbXMiLCJnZXQiLCJyZXNldCIsIm5hbWUiLCJ2YWx1ZSIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwiY29uc29sZSIsImxvZyIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsIm5iQ2xhc3NlcyIsInJlZ3Jlc3Npb25TaXplIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJpbkFycmF5IiwiQXJyYXkiLCJkYXRhIiwibGVuZ3RoIiwiaSIsInJlcyIsImZpbHRlciIsIm91dERhdGEiLCJsaWtlbGlob29kcyIsIm91dHB1dFZhbHVlcyJdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUE7Ozs7QUFFQTs7OztBQUdBLElBQU1BLGNBQWM7QUFDbEJDLFNBQU87QUFDTEMsVUFBTSxLQUREO0FBRUxDLGFBQVMsSUFGSjtBQUdMQyxjQUFVLElBSEw7QUFJTEMsV0FBTyxFQUFFQyxNQUFNLFFBQVI7QUFKRixHQURXO0FBT2xCQyxvQkFBa0I7QUFDaEJMLFVBQU0sU0FEVTtBQUVoQkMsYUFBUyxFQUZPO0FBR2hCSyxTQUFLLENBSFc7QUFJaEJDLFNBQUs7QUFKVyxHQVBBO0FBYWxCQyxVQUFRO0FBQ05SLFVBQU0sTUFEQTtBQUVOQyxhQUFTLGFBRkg7QUFHTlEsVUFBTSxDQUFDLGFBQUQsRUFBZ0IsWUFBaEIsQ0FIQTtBQUlOQyxjQUFVO0FBSkosR0FiVTtBQW1CbEJDLFlBQVU7QUFDUlgsVUFBTSxLQURFO0FBRVJDLGFB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SGhtbURlY29kZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmFzZUxmbyBmcm9tICd3YXZlcy1sZm8vY29tbW9uL2NvcmUvQmFzZUxmbyc7XG4vLyBpbXBvcnQgKiBhcyBsZm8gZnJvbSAnd2F2ZXMtbGZvL2NsaWVudCc7XG5pbXBvcnQgeyBIaG1tRGVjb2RlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBtb2RlbDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSwgXG4gIGxpa2VsaWhvb2RXaW5kb3c6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjAsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWUzMCxcbiAgfSxcbiAgb3V0cHV0OiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGRlZmF1bHQ6ICdsaWtlbGlob29kcycsXG4gICAgbGlzdDogWydsaWtlbGlob29kcycsICdyZWdyZXNzaW9uJ10sXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfVxufTtcblxuXG4vKipcbiAqIExmbyBjbGFzcyBsb2FkaW5nIEhpZXJhcmNoaWNhbCBITU0gbW9kZWxzIGNyZWF0ZWQgYnkgdGhlIHhtbSBsaWJyYXJ5IHRvXG4gKiBwcm9jZXNzIGFuIGlucHV0IHN0cmVhbSBvZiB2ZWN0b3JzIChtb2RlbHMgbXVzdCBoYXZlIGJlZW4gdHJhaW5lZCBmcm9tIHRoZVxuICogc2FtZSBpbnB1dCBzdHJlYW0pLlxuICogQXMgdGhlIHJlc3VsdHMgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIC8gZm9sbG93aW5nIC8gcmVncmVzc2lvbiBhcmUgbW9yZVxuICogY29tcGxleCB0aGFuIGEgc2ltcGxlIHZlY3RvciwgYSBjYWxsYmFjayBmdW5jdGlvbiBjYW4gYmUgcGFzc2VkIHRvIHRoZVxuICogY29uc3RydWN0b3IgdG8gaGFuZGxlIHRoZW0sIG9yIHRoZXkgY2FuIGFsdGVybmF0aXZlbHkgYmUgcXVlcmllZCB2aWEgdGhlXG4gKiByZWFkb25seSBmaWx0ZXJSZXN1bHRzIHByb3BlcnR5LlxuICogQGNsYXNzXG4gKi9cbmNsYXNzIEhobW1EZWNvZGVyTGZvIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2RlY29kZXIgPSBuZXcgSGhtbURlY29kZXIodGhpcy5wYXJhbXMuZ2V0KCdsaWtlbGlob29kV2luZG93JykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIGVzdGltYXRpb24uXG4gICAqL1xuICByZXNldCgpIHtcbiAgICB0aGlzLl9kZWNvZGVyLnJlc2V0KCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2xpa2VsaWhvb2RXaW5kb3cnKSB7XG4gICAgICB0aGlzLl9kZWNvZGVyLmxpa2VsaWhvb2RXaW5kb3cgPSB2YWx1ZTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyLm1vZGVsID0gdGhpcy5wYXJhbXMuZ2V0KCdtb2RlbCcpO1xuICAgIGNvbnNvbGUubG9nKHRoaXMuX2RlY29kZXIubW9kZWwpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIubmJDbGFzc2VzO1xuICAgIH0gZWxzZSB7IC8vID09PSAncmVncmVzc2lvbidcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIucmVncmVzc2lvblNpemU7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgY29uc3QgaW5BcnJheSA9IG5ldyBBcnJheShmcmFtZS5kYXRhLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbkFycmF5W2ldID0gZnJhbWUuZGF0YVtpXTtcbiAgICB9XG5cbiAgICAvLyB0aGlzLl9kZWNvZGVyLmZpbHRlcihpbkFycmF5LCAoZXJyLCByZXMpID0+IHtcbiAgICAvLyAgIGlmIChlcnIgPT09IG51bGwpIHtcbiAgICAvLyAgICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG4gICAgLy8gICAgIC8vIGxldCByZXNEYXRhO1xuICAgIC8vICAgICAvLyBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgIC8vICAgICAvLyAgIHJlc0RhdGEgPSByZXMubGlrZWxpaG9vZHM7XG4gICAgLy8gICAgIC8vIH0gZWxzZSB7IC8vID09PSAncmVncmVzc2lvbidcbiAgICAvLyAgICAgLy8gICByZXNEYXRhID0gcmVzLm91dHB1dFZhbHVlcztcbiAgICAvLyAgICAgLy8gfVxuICAgIC8vICAgICBjb25zdCByZXNEYXRhID0gcmVzLmxpa2VsaWhvb2RzO1xuICAgIC8vICAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIC8vICAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICAvLyAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgIC8vICAgICAgIGRhdGFbaV0gPSByZXNEYXRhW2ldO1xuICAgIC8vICAgICB9XG4gICAgICAgIFxuICAgIC8vICAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAvLyAgICAgICBjYWxsYmFjayhyZXMpO1xuICAgIC8vICAgICB9XG4gICAgLy8gICB9XG5cbiAgICAvLyAgIHRoaXMucHJvcGFnYXRlRnJhbWUoKTtcbiAgICAvLyB9KTtcbiAgICBjb25zdCByZXMgPSB0aGlzLl9kZWNvZGVyLmZpbHRlcihpbkFycmF5KTtcbiAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcbiAgICBsZXQgb3V0RGF0YTtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgb3V0RGF0YSA9IHJlcy5saWtlbGlob29kcztcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0RGF0YSA9IHJlcy5vdXRwdXRWYWx1ZXM7XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBkYXRhW2ldID0gb3V0RGF0YVtpXTtcbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIC8vIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAvLyAgIHRoaXMucHJlcGFyZUZyYW1lKGZyYW1lKTtcbiAgLy8gICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gIC8vIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEhobW1EZWNvZGVyTGZvOyJdfQ==