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
  model: {
    type: 'any',
    default: null,
    nullable: true,
    metas: { kind: 'static' } },
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
    metas: { kind: 'dynamic' } }
};

/**
 * Callback handling the full filtering results.
 * @callback filterCallback
 * @param {Object} res - An object containing the filtering results.
 */

/**
 * Lfo class loading GMM models created by the XMM library to process an input
 * stream of vectors (models must have been trained from the same input stream).
 * As the results of the classification / regression are more complex than a
 * simple vector, a callback function can be passed to the constructor to handle
 * them.
 * @class
 *
 * @param {Object} options - Override defaults.
 * @param {Object} [options.model=null] - A GMM model from the XMM library.
 * @param {Number} [options.likelihoodWindow=20] - Likelihood window size (smooths output).
 * @param {('likelihoods'|'regression')} [options.output='likelihoods'] - Which information to output.
 * @param {filterCallback} [options.callback=null]
 */

var GmmDecoderLfo = function (_BaseLfo) {
  (0, _inherits3.default)(GmmDecoderLfo, _BaseLfo);

  function GmmDecoderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    (0, _classCallCheck3.default)(this, GmmDecoderLfo);

    var _this = (0, _possibleConstructorReturn3.default)(this, (GmmDecoderLfo.__proto__ || (0, _getPrototypeOf2.default)(GmmDecoderLfo)).call(this, definitions, options));

    _this._decoder = new _xmmClient.GmmDecoder(_this.params.get('likelihoodWindow'));
    return _this;
  }

  /** @private */


  (0, _createClass3.default)(GmmDecoderLfo, [{
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      (0, _get3.default)(GmmDecoderLfo.prototype.__proto__ || (0, _getPrototypeOf2.default)(GmmDecoderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

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
  return GmmDecoderLfo;
}(_core.BaseLfo);

;

exports.default = GmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkdtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJHbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9kZWNvZGVyIiwicGFyYW1zIiwiZ2V0IiwibmFtZSIsInZhbHVlIiwic2V0TGlrZWxpaG9vZFdpbmRvdyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic2V0TW9kZWwiLCJzdHJlYW1QYXJhbXMiLCJmcmFtZVNpemUiLCJnZXROdW1iZXJPZkNsYXNzZXMiLCJnZXRSZWdyZXNzaW9uVmVjdG9yU2l6ZSIsInByb3BhZ2F0ZVN0cmVhbVBhcmFtcyIsImZyYW1lIiwiaW5BcnJheSIsIkFycmF5IiwiZGF0YSIsImxlbmd0aCIsImkiLCJyZXMiLCJmaWx0ZXIiLCJvdXREYXRhIiwibGlrZWxpaG9vZHMiLCJvdXRwdXRWYWx1ZXMiXSwibWFwcGluZ3MiOiI7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztBQUNBOzs7O0FBRUEsSUFBTUEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLEtBREQ7QUFFTEMsYUFBUyxJQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPLEVBQUVDLE1BQU0sUUFBUixFQUpGLEVBRFc7QUFPbEJDLG9CQUFrQjtBQUNoQkwsVUFBTSxTQURVO0FBRWhCQyxhQUFTLEVBRk87QUFHaEJLLFNBQUssQ0FIVztBQUloQkMsU0FBSztBQUpXLEdBUEE7QUFhbEJDLFVBQVE7QUFDTlIsVUFBTSxNQURBO0FBRU5DLGFBQVMsYUFGSDtBQUdOUSxVQUFNLENBQUMsYUFBRCxFQUFnQixZQUFoQixDQUhBO0FBSU5DLGNBQVU7QUFKSixHQWJVO0FBbUJsQkMsWUFBVTtBQUNSWCxVQUFNLEtBREU7QUFFUkMsYUFBUyxJQUZEO0FBR1JDLGNBQVUsSUFIRjtBQUlSQyxXQUFPLEVBQUVDLE1BQU0sU0FBUixFQUpDO0FBbkJRLENBQXBCOztBQTJCQTs7Ozs7O0FBTUE7Ozs7Ozs7Ozs7Ozs7OztJQWNNUSxhOzs7QUFDSiwyQkFBMEI7QUFBQSxRQUFkQyxPQUFjLHVFQUFKLEVBQUk7QUFBQTs7QUFBQSxvSkFDbEJmLFdBRGtCLEVBQ0xlLE9BREs7O0FBR3hCLFVBQUtDLFFBQUwsR0FBZ0IsMEJBQWUsTUFBS0MsTUFBTCxDQUFZQyxHQUFaLENBQWdCLGtCQUFoQixDQUFmLENBQWhCO0FBSHdCO0FBSXpCOztBQUVEOzs7OztrQ0FDY0MsSSxFQUFNQyxLLEVBQU9mLEssRUFBTztBQUNoQyx3SkFBb0JjLElBQXBCLEVBQTBCQyxLQUExQixFQUFpQ2YsS0FBakM7O0FBRUEsVUFBSWMsU0FBUyxrQkFBYixFQUFpQztBQUMvQixhQUFLSCxRQUFMLENBQWNLLG1CQUFkLENBQWtDRCxLQUFsQztBQUNEO0FBQ0Y7O0FBRUQ7Ozs7MENBQzJDO0FBQUEsVUFBdkJFLGdCQUF1Qix1RUFBSixFQUFJOztBQUN6QyxXQUFLQyxtQkFBTCxDQUF5QkQsZ0JBQXpCOztBQUVBLFdBQUtOLFFBQUwsQ0FBY1EsUUFBZCxDQUF1QixLQUFLUCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsT0FBaEIsQ0FBdkI7O0FBRUEsVUFBSSxLQUFLRCxNQUFMLENBQVlDLEdBQVosQ0FBZ0IsUUFBaEIsTUFBOEIsYUFBbEMsRUFBaUQ7QUFDL0MsYUFBS08sWUFBTCxDQUFrQkMsU0FBbEIsR0FBOEIsS0FBS1YsUUFBTCxDQUFjVyxrQkFBZCxFQUE5QjtBQUNELE9BRkQsTUFFTztBQUFFO0FBQ1AsYUFBS0YsWUFBTCxDQUFrQkMsU0FBbEIsR0FBOEIsS0FBS1YsUUFBTCxDQUFjWSx1QkFBZCxFQUE5QjtBQUNEOztBQUVELFdBQUtDLHFCQUFMO0FBQ0Q7O0FBRUQ7Ozs7a0NBQ2NDLEssRUFBTztBQUNuQixVQUFNQyxVQUFVLElBQUlDLEtBQUosQ0FBVUYsTUFBTUcsSUFBTixDQUFXQyxNQUFyQixDQUFoQjtBQUNBLFdBQUssSUFBSUMsSUFBSSxDQUFiLEVBQWdCQSxJQUFJSixRQUFRRyxNQUE1QixFQUFvQ0MsR0FBcEMsRUFBeUM7QUFDdkNKLGdCQUFRSSxDQUFSLElBQWFMLE1BQU1HLElBQU4sQ0FBV0UsQ0FBWCxDQUFiO0FBQ0Q7O0FBRUQsVUFBTUMsTUFBTSxLQUFLcEIsUUFBTCxDQUFjcUIsTUFBZCxDQUFxQk4sT0FBckIsQ0FBWjtBQUNBLFVBQU1sQixXQUFXLEtBQUtJLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixVQUFoQixDQUFqQjtBQUNBLFVBQUlvQixnQkFBSjtBQUNBLFVBQUksS0FBS3JCLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixNQUE4QixhQUFsQyxFQUFpRDtBQUMvQ29CLGtCQUFVRixJQUFJRyxXQUFkO0FBQ0QsT0FGRCxNQUVPO0FBQ0xELGtCQUFVRixJQUFJSSxZQUFkO0FBQ0Q7O0FBRUQsVUFBTVAsT0FBTyxLQUFLSCxLQUFMLENBQVdHLElBQXhCO0FBQ0EsVUFBTVAsWUFBWSxLQUFLRCxZQUFMLENBQWtCQyxTQUFwQzs7QUFFQSxXQUFLLElBQUlTLEtBQUksQ0FBYixFQUFnQkEsS0FBSVQsU0FBcEIsRUFBK0JTLElBQS9CLEVBQW9DO0FBQ2xDRixhQUFLRSxFQUFMLElBQVVHLFFBQVFILEVBQVIsQ0FBVjtBQUNEOztBQUVELFVBQUl0QixRQUFKLEVBQWM7QUFDWkEsaUJBQVN1QixHQUFUO0FBQ0Q7QUFDRjs7Ozs7QUFDRjs7a0JBRWN0QixhIiwiZmlsZSI6IkdtbURlY29kZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlTGZvIH0gZnJvbSAnd2F2ZXMtbGZvL2NvcmUnO1xuaW1wb3J0IHsgR21tRGVjb2RlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbW9kZWw6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sIC8vIHRyaWdzIHRoZSBjYWxsIHRvIHByb2Nlc3NTdHJlYW1QYXJhbXMgaWYgY2hhbmdlZC5cbiAgfSwgXG4gIGxpa2VsaWhvb2RXaW5kb3c6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjAsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWUzMCxcbiAgfSxcbiAgb3V0cHV0OiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGRlZmF1bHQ6ICdsaWtlbGlob29kcycsXG4gICAgbGlzdDogWydsaWtlbGlob29kcycsICdyZWdyZXNzaW9uJ10sXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSwgLy8gZG9lc24ndCB0cmlnZ2VyIHByb2Nlc3NTdHJlYW1QYXJhbXMsIGhhcyB0byBiZSBjaGVjay5cbiAgfVxufTtcblxuLyoqXG4gKiBDYWxsYmFjayBoYW5kbGluZyB0aGUgZnVsbCBmaWx0ZXJpbmcgcmVzdWx0cy5cbiAqIEBjYWxsYmFjayBmaWx0ZXJDYWxsYmFja1xuICogQHBhcmFtIHtPYmplY3R9IHJlcyAtIEFuIG9iamVjdCBjb250YWluaW5nIHRoZSBmaWx0ZXJpbmcgcmVzdWx0cy5cbiAqL1xuXG4vKipcbiAqIExmbyBjbGFzcyBsb2FkaW5nIEdNTSBtb2RlbHMgY3JlYXRlZCBieSB0aGUgWE1NIGxpYnJhcnkgdG8gcHJvY2VzcyBhbiBpbnB1dFxuICogc3RyZWFtIG9mIHZlY3RvcnMgKG1vZGVscyBtdXN0IGhhdmUgYmVlbiB0cmFpbmVkIGZyb20gdGhlIHNhbWUgaW5wdXQgc3RyZWFtKS5cbiAqIEFzIHRoZSByZXN1bHRzIG9mIHRoZSBjbGFzc2lmaWNhdGlvbiAvIHJlZ3Jlc3Npb24gYXJlIG1vcmUgY29tcGxleCB0aGFuIGFcbiAqIHNpbXBsZSB2ZWN0b3IsIGEgY2FsbGJhY2sgZnVuY3Rpb24gY2FuIGJlIHBhc3NlZCB0byB0aGUgY29uc3RydWN0b3IgdG8gaGFuZGxlXG4gKiB0aGVtLlxuICogQGNsYXNzXG4gKlxuICogQHBhcmFtIHtPYmplY3R9IG9wdGlvbnMgLSBPdmVycmlkZSBkZWZhdWx0cy5cbiAqIEBwYXJhbSB7T2JqZWN0fSBbb3B0aW9ucy5tb2RlbD1udWxsXSAtIEEgR01NIG1vZGVsIGZyb20gdGhlIFhNTSBsaWJyYXJ5LlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmxpa2VsaWhvb2RXaW5kb3c9MjBdIC0gTGlrZWxpaG9vZCB3aW5kb3cgc2l6ZSAoc21vb3RocyBvdXRwdXQpLlxuICogQHBhcmFtIHsoJ2xpa2VsaWhvb2RzJ3wncmVncmVzc2lvbicpfSBbb3B0aW9ucy5vdXRwdXQ9J2xpa2VsaWhvb2RzJ10gLSBXaGljaCBpbmZvcm1hdGlvbiB0byBvdXRwdXQuXG4gKiBAcGFyYW0ge2ZpbHRlckNhbGxiYWNrfSBbb3B0aW9ucy5jYWxsYmFjaz1udWxsXVxuICovXG5jbGFzcyBHbW1EZWNvZGVyTGZvIGV4dGVuZHMgQmFzZUxmbyB7XG4gIGNvbnN0cnVjdG9yKG9wdGlvbnMgPSB7fSkge1xuICAgIHN1cGVyKGRlZmluaXRpb25zLCBvcHRpb25zKTtcblxuICAgIHRoaXMuX2RlY29kZXIgPSBuZXcgR21tRGVjb2Rlcih0aGlzLnBhcmFtcy5nZXQoJ2xpa2VsaWhvb2RXaW5kb3cnKSk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgb25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpIHtcbiAgICBzdXBlci5vblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcyk7XG5cbiAgICBpZiAobmFtZSA9PT0gJ2xpa2VsaWhvb2RXaW5kb3cnKSB7XG4gICAgICB0aGlzLl9kZWNvZGVyLnNldExpa2VsaWhvb2RXaW5kb3codmFsdWUpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuX2RlY29kZXIuc2V0TW9kZWwodGhpcy5wYXJhbXMuZ2V0KCdtb2RlbCcpKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLmdldE51bWJlck9mQ2xhc3NlcygpO1xuICAgIH0gZWxzZSB7IC8vID09PSAncmVncmVzc2lvbidcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIuZ2V0UmVncmVzc2lvblZlY3RvclNpemUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICBjb25zdCBpbkFycmF5ID0gbmV3IEFycmF5KGZyYW1lLmRhdGEubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluQXJyYXlbaV0gPSBmcmFtZS5kYXRhW2ldO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcyA9IHRoaXMuX2RlY29kZXIuZmlsdGVyKGluQXJyYXkpO1xuICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdjYWxsYmFjaycpO1xuICAgIGxldCBvdXREYXRhO1xuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICBvdXREYXRhID0gcmVzLmxpa2VsaWhvb2RzO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXREYXRhID0gcmVzLm91dHB1dFZhbHVlcztcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGRhdGFbaV0gPSBvdXREYXRhW2ldO1xuICAgIH1cbiAgICBcbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBHbW1EZWNvZGVyTGZvOyJdfQ==