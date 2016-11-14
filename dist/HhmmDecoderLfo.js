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
      var _this2 = this;

      var inArray = new Array(frame.data.length);
      for (var i = 0; i < inArray.length; i++) {
        inArray[i] = frame.data[i];
      }

      this._decoder.filter(inArray, function (err, res) {
        if (err === null) {
          var callback = _this2.params.get('callback');
          // let resData;
          // if (this.params.get('output') === 'likelihoods') {
          //   resData = res.likelihoods;
          // } else { // === 'regression'
          //   resData = res.outputValues;
          // }
          var resData = res.likelihoods;
          var data = _this2.frame.data;
          var frameSize = _this2.streamParams.frameSize;

          for (var _i = 0; _i < frameSize; _i++) {
            data[_i] = resData[_i];
          }

          if (callback) {
            callback(res);
          }
        }

        _this2.propagateFrame();
      });
    }

    /** @private */

  }, {
    key: 'processFrame',
    value: function processFrame(frame) {
      this.prepareFrame(frame);
      this.processFunction(frame);
    }
  }]);
  return HhmmDecoderLfo;
}(_BaseLfo3.default);

exports.default = HhmmDecoderLfo;
;

// export default HhmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhobW1EZWNvZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwibW9kZWwiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwibWV0YXMiLCJraW5kIiwibGlrZWxpaG9vZFdpbmRvdyIsIm1pbiIsIm1heCIsIm91dHB1dCIsImxpc3QiLCJjb25zdGFudCIsImNhbGxiYWNrIiwiSGhtbURlY29kZXJMZm8iLCJvcHRpb25zIiwiX2RlY29kZXIiLCJwYXJhbXMiLCJnZXQiLCJyZXNldCIsIm5hbWUiLCJ2YWx1ZSIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwiY29uc29sZSIsImxvZyIsInN0cmVhbVBhcmFtcyIsImZyYW1lU2l6ZSIsIm5iQ2xhc3NlcyIsInJlZ3Jlc3Npb25TaXplIiwicHJvcGFnYXRlU3RyZWFtUGFyYW1zIiwiZnJhbWUiLCJpbkFycmF5IiwiQXJyYXkiLCJkYXRhIiwibGVuZ3RoIiwiaSIsImZpbHRlciIsImVyciIsInJlcyIsInJlc0RhdGEiLCJsaWtlbGlob29kcyIsInByb3BhZ2F0ZUZyYW1lIiwicHJlcGFyZUZyYW1lIiwicHJvY2Vzc0Z1bmN0aW9uIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUFBQTs7OztBQUVBOzs7O0FBR0EsSUFBTUEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLEtBREQ7QUFFTEMsYUFBUyxJQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPLEVBQUVDLE1BQU0sUUFBUjtBQUpGLEdBRFc7QUFPbEJDLG9CQUFrQjtBQUNoQkwsVUFBTSxTQURVO0FBRWhCQyxhQUFTLEVBRk87QUFHaEJLLFNBQUssQ0FIVztBQUloQkMsU0FBSztBQUpXLEdBUEE7QUFhbEJDLFVBQVE7QUFDTlIsVUFBTSxNQURBO0FBRU5DLGFBQVMsYUFGSDtBQUdOUSxVQUFNLENBQUMsYUFBRCxFQUFnQixZQUFoQixDQUhBO0FBSU5DLGNBQVU7QUFKSixH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aG1tRGVjb2Rlckxmby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCBCYXNlTGZvIGZyb20gJ3dhdmVzLWxmby9jb21tb24vY29yZS9CYXNlTGZvJztcbi8vIGltcG9ydCAqIGFzIGxmbyBmcm9tICd3YXZlcy1sZm8vY2xpZW50JztcbmltcG9ydCB7IEhobW1EZWNvZGVyIH0gZnJvbSAneG1tLWNsaWVudCc7XG5cblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIG1vZGVsOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LCBcbiAgbGlrZWxpaG9vZFdpbmRvdzoge1xuICAgIHR5cGU6ICdpbnRlZ2VyJyxcbiAgICBkZWZhdWx0OiAyMCxcbiAgICBtaW46IDEsXG4gICAgbWF4OiAxZTMwLFxuICB9LFxuICBvdXRwdXQ6IHtcbiAgICB0eXBlOiAnZW51bScsXG4gICAgZGVmYXVsdDogJ2xpa2VsaWhvb2RzJyxcbiAgICBsaXN0OiBbJ2xpa2VsaWhvb2RzJywgJ3JlZ3Jlc3Npb24nXSxcbiAgICBjb25zdGFudDogdHJ1ZSxcbiAgfSxcbiAgY2FsbGJhY2s6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdkeW5hbWljJyB9LFxuICB9XG59O1xuXG5cbi8qKlxuICogTGZvIGNsYXNzIGxvYWRpbmcgSGllcmFyY2hpY2FsIEhNTSBtb2RlbHMgY3JlYXRlZCBieSB0aGUgeG1tIGxpYnJhcnkgdG9cbiAqIHByb2Nlc3MgYW4gaW5wdXQgc3RyZWFtIG9mIHZlY3RvcnMgKG1vZGVscyBtdXN0IGhhdmUgYmVlbiB0cmFpbmVkIGZyb20gdGhlXG4gKiBzYW1lIGlucHV0IHN0cmVhbSkuXG4gKiBBcyB0aGUgcmVzdWx0cyBvZiB0aGUgY2xhc3NpZmljYXRpb24gLyBmb2xsb3dpbmcgLyByZWdyZXNzaW9uIGFyZSBtb3JlXG4gKiBjb21wbGV4IHRoYW4gYSBzaW1wbGUgdmVjdG9yLCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbiBiZSBwYXNzZWQgdG8gdGhlXG4gKiBjb25zdHJ1Y3RvciB0byBoYW5kbGUgdGhlbSwgb3IgdGhleSBjYW4gYWx0ZXJuYXRpdmVseSBiZSBxdWVyaWVkIHZpYSB0aGVcbiAqIHJlYWRvbmx5IGZpbHRlclJlc3VsdHMgcHJvcGVydHkuXG4gKiBAY2xhc3NcbiAqL1xuZXhwb3J0IGRlZmF1bHQgY2xhc3MgSGhtbURlY29kZXJMZm8gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fZGVjb2RlciA9IG5ldyBIaG1tRGVjb2Rlcih0aGlzLnBhcmFtcy5nZXQoJ2xpa2VsaWhvb2RXaW5kb3cnKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBpbnRlcm1lZGlhdGUgcmVzdWx0cyBvZiB0aGUgZXN0aW1hdGlvbi5cbiAgICovXG4gIHJlc2V0KCkge1xuICAgIHRoaXMuX2RlY29kZXIucmVzZXQoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGlmIChuYW1lID09PSAnbGlrZWxpaG9vZFdpbmRvdycpIHtcbiAgICAgIHRoaXMuX2RlY29kZXIubGlrZWxpaG9vZFdpbmRvdyA9IHZhbHVlO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMgPSB7fSkge1xuICAgIHRoaXMucHJlcGFyZVN0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zKTtcblxuICAgIHRoaXMuX2RlY29kZXIubW9kZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ21vZGVsJyk7XG4gICAgY29uc29sZS5sb2codGhpcy5fZGVjb2Rlci5tb2RlbCk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5uYkNsYXNzZXM7XG4gICAgfSBlbHNlIHsgLy8gPT09ICdyZWdyZXNzaW9uJ1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5yZWdyZXNzaW9uU2l6ZTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICBjb25zdCBpbkFycmF5ID0gbmV3IEFycmF5KGZyYW1lLmRhdGEubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluQXJyYXlbaV0gPSBmcmFtZS5kYXRhW2ldO1xuICAgIH1cblxuICAgIHRoaXMuX2RlY29kZXIuZmlsdGVyKGluQXJyYXksIChlcnIsIHJlcykgPT4ge1xuICAgICAgaWYgKGVyciA9PT0gbnVsbCkge1xuICAgICAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcbiAgICAgICAgLy8gbGV0IHJlc0RhdGE7XG4gICAgICAgIC8vIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICAgIC8vICAgcmVzRGF0YSA9IHJlcy5saWtlbGlob29kcztcbiAgICAgICAgLy8gfSBlbHNlIHsgLy8gPT09ICdyZWdyZXNzaW9uJ1xuICAgICAgICAvLyAgIHJlc0RhdGEgPSByZXMub3V0cHV0VmFsdWVzO1xuICAgICAgICAvLyB9XG4gICAgICAgIGNvbnN0IHJlc0RhdGEgPSByZXMubGlrZWxpaG9vZHM7XG4gICAgICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgICAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICAgICAgZGF0YVtpXSA9IHJlc0RhdGFbaV07XG4gICAgICAgIH1cbiAgICAgICAgXG4gICAgICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgICAgIH1cbiAgICAgIH1cblxuICAgICAgdGhpcy5wcm9wYWdhdGVGcmFtZSgpO1xuICAgIH0pO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NGcmFtZShmcmFtZSkge1xuICAgIHRoaXMucHJlcGFyZUZyYW1lKGZyYW1lKTtcbiAgICB0aGlzLnByb2Nlc3NGdW5jdGlvbihmcmFtZSk7XG4gIH1cbn07XG5cbi8vIGV4cG9ydCBkZWZhdWx0IEhobW1EZWNvZGVyTGZvOyJdfQ==