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
 * Lfo class loading any model (GMM or HHMM) created by the xmm library and
 * automatically instantiating the corresponding decoder internally to
 * process an input stream of vectors (models must have been trained from the
 * same input stream).
 * As the results of the classification / following / regression are more
 * complex than a simple vector, a callback function can be passed to the
 * constructor to handle them.
 * @class
 *
 * @param {Object} options - Override defaults.
 * @param {Object} [options.model=null] - Any model from the XMM library.
 * @param {Number} [options.likelihoodWindow=20] - Likelihood window size (smooths output).
 * @param {('likelihoods'|'regression')} [options.output='likelihoods'] - Which information to output.
 * @param {filterCallback} [options.callback=null]
*/

var XmmDecoderLfo = function (_BaseLfo) {
  _inherits(XmmDecoderLfo, _BaseLfo);

  function XmmDecoderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, XmmDecoderLfo);

    var _this = _possibleConstructorReturn(this, (XmmDecoderLfo.__proto__ || Object.getPrototypeOf(XmmDecoderLfo)).call(this, definitions, options));

    _this._modelType = 'hhmm';
    _this._decoder = new _xmmClient.HhmmDecoder(_this.params.get('likelihoodWindow'));
    return _this;
  }

  /**
   * Resets the intermediate results of the estimation if the model is a HHMM.
   */


  _createClass(XmmDecoderLfo, [{
    key: 'reset',
    value: function reset() {
      if (this._modelType === 'hhmm') {
        this._decoder.reset();
      }
    }

    /** @private */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      _get(XmmDecoderLfo.prototype.__proto__ || Object.getPrototypeOf(XmmDecoderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

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

      var model = this.params.get('model');
      var states = model ? model.configuration.default_parameters.states : null;

      if (states !== null && states !== undefined) {
        this._modelType = 'hhmm';
        this._decoder = new _xmmClient.HhmmDecoder(this.params.get('likelihoodWindow'));
      } else {
        this._modelType = 'gmm';
        this._decoder = new _xmmClient.GmmDecoder(this.params.get('likelihoodWindow'));
      }

      this._decoder.setModel(model);

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
        outData = res ? res.likelihoods : [];
      } else {
        outData = res ? res.outputValues : [];
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

  return XmmDecoderLfo;
}(_core.BaseLfo);

;

exports.default = XmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlhtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJYbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9tb2RlbFR5cGUiLCJfZGVjb2RlciIsInBhcmFtcyIsImdldCIsInJlc2V0IiwibmFtZSIsInZhbHVlIiwic2V0TGlrZWxpaG9vZFdpbmRvdyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic3RhdGVzIiwiY29uZmlndXJhdGlvbiIsImRlZmF1bHRfcGFyYW1ldGVycyIsInVuZGVmaW5lZCIsInNldE1vZGVsIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwiZ2V0TnVtYmVyT2ZDbGFzc2VzIiwiZ2V0UmVncmVzc2lvblZlY3RvclNpemUiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmcmFtZSIsImluQXJyYXkiLCJBcnJheSIsImRhdGEiLCJsZW5ndGgiLCJpIiwicmVzIiwiZmlsdGVyIiwib3V0RGF0YSIsImxpa2VsaWhvb2RzIiwib3V0cHV0VmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O0FBR0EsSUFBTUEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLEtBREQ7QUFFTEMsYUFBUyxJQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPLEVBQUVDLE1BQU0sUUFBUjtBQUpGLEdBRFc7QUFPbEJDLG9CQUFrQjtBQUNoQkwsVUFBTSxTQURVO0FBRWhCQyxhQUFTLEVBRk87QUFHaEJLLFNBQUssQ0FIVztBQUloQkMsU0FBSztBQUpXLEdBUEE7QUFhbEJDLFVBQVE7QUFDTlIsVUFBTSxNQURBO0FBRU5DLGFBQVMsYUFGSDtBQUdOUSxVQUFN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QWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DeUIsa0JBQVVGLE1BQU1BLElBQUlHLFdBQVYsR0FBd0IsRUFBbEM7QUFDRCxPQUZELE1BRU87QUFDTEQsa0JBQVVGLE1BQU1BLElBQUlJLFlBQVYsR0FBeUIsRUFBbkM7QUFDRDs7QUFFRCxVQUFNUCxPQUFPLEtBQUtILEtBQUwsQ0FBV0csSUFBeEI7QUFDQSxVQUFNUCxZQUFZLEtBQUtELFlBQUwsQ0FBa0JDLFNBQXBDOztBQUVBLFdBQUssSUFBSVMsS0FBSSxDQUFiLEVBQWdCQSxLQUFJVCxTQUFwQixFQUErQlMsSUFBL0IsRUFBb0M7QUFDbENGLGFBQUtFLEVBQUwsSUFBVUcsUUFBUUgsRUFBUixDQUFWO0FBQ0Q7O0FBRUQsVUFBSTVCLFFBQUosRUFBYztBQUNaQSxpQkFBUzZCLEdBQVQ7QUFDRDtBQUNGOzs7Ozs7QUFDRjs7a0JBRWM1QixhIiwiZmlsZSI6IlhtbURlY29kZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlTGZvIH0gZnJvbSAnd2F2ZXMtbGZvL2NvcmUnO1xuaW1wb3J0IHsgR21tRGVjb2RlciwgSGhtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuXG5jb25zdCBkZWZpbml0aW9ucyA9IHtcbiAgbW9kZWw6IHtcbiAgICB0eXBlOiAnYW55JyxcbiAgICBkZWZhdWx0OiBudWxsLFxuICAgIG51bGxhYmxlOiB0cnVlLFxuICAgIG1ldGFzOiB7IGtpbmQ6ICdzdGF0aWMnIH0sXG4gIH0sIFxuICBsaWtlbGlob29kV2luZG93OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIwLFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDFlMzAsXG4gIH0sXG4gIG91dHB1dDoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbGlrZWxpaG9vZHMnLFxuICAgIGxpc3Q6IFsnbGlrZWxpaG9vZHMnLCAncmVncmVzc2lvbiddLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cbi8qKlxuICogTGZvIGNsYXNzIGxvYWRpbmcgYW55IG1vZGVsIChHTU0gb3IgSEhNTSkgY3JlYXRlZCBieSB0aGUgeG1tIGxpYnJhcnkgYW5kXG4gKiBhdXRvbWF0aWNhbGx5IGluc3RhbnRpYXRpbmcgdGhlIGNvcnJlc3BvbmRpbmcgZGVjb2RlciBpbnRlcm5hbGx5IHRvXG4gKiBwcm9jZXNzIGFuIGlucHV0IHN0cmVhbSBvZiB2ZWN0b3JzIChtb2RlbHMgbXVzdCBoYXZlIGJlZW4gdHJhaW5lZCBmcm9tIHRoZVxuICogc2FtZSBpbnB1dCBzdHJlYW0pLlxuICogQXMgdGhlIHJlc3VsdHMgb2YgdGhlIGNsYXNzaWZpY2F0aW9uIC8gZm9sbG93aW5nIC8gcmVncmVzc2lvbiBhcmUgbW9yZVxuICogY29tcGxleCB0aGFuIGEgc2ltcGxlIHZlY3RvciwgYSBjYWxsYmFjayBmdW5jdGlvbiBjYW4gYmUgcGFzc2VkIHRvIHRoZVxuICogY29uc3RydWN0b3IgdG8gaGFuZGxlIHRoZW0uXG4gKiBAY2xhc3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHRzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm1vZGVsPW51bGxdIC0gQW55IG1vZGVsIGZyb20gdGhlIFhNTSBsaWJyYXJ5LlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmxpa2VsaWhvb2RXaW5kb3c9MjBdIC0gTGlrZWxpaG9vZCB3aW5kb3cgc2l6ZSAoc21vb3RocyBvdXRwdXQpLlxuICogQHBhcmFtIHsoJ2xpa2VsaWhvb2RzJ3wncmVncmVzc2lvbicpfSBbb3B0aW9ucy5vdXRwdXQ9J2xpa2VsaWhvb2RzJ10gLSBXaGljaCBpbmZvcm1hdGlvbiB0byBvdXRwdXQuXG4gKiBAcGFyYW0ge2ZpbHRlckNhbGxiYWNrfSBbb3B0aW9ucy5jYWxsYmFjaz1udWxsXVxuKi9cbmNsYXNzIFhtbURlY29kZXJMZm8gZXh0ZW5kcyBCYXNlTGZvIHtcbiAgY29uc3RydWN0b3Iob3B0aW9ucyA9IHt9KSB7XG4gICAgc3VwZXIoZGVmaW5pdGlvbnMsIG9wdGlvbnMpO1xuXG4gICAgdGhpcy5fbW9kZWxUeXBlID0gJ2hobW0nO1xuICAgIHRoaXMuX2RlY29kZXIgPSBuZXcgSGhtbURlY29kZXIodGhpcy5wYXJhbXMuZ2V0KCdsaWtlbGlob29kV2luZG93JykpO1xuICB9XG5cbiAgLyoqXG4gICAqIFJlc2V0cyB0aGUgaW50ZXJtZWRpYXRlIHJlc3VsdHMgb2YgdGhlIGVzdGltYXRpb24gaWYgdGhlIG1vZGVsIGlzIGEgSEhNTS5cbiAgICovXG4gIHJlc2V0KCkge1xuICAgIGlmICh0aGlzLl9tb2RlbFR5cGUgPT09ICdoaG1tJykge1xuICAgICAgdGhpcy5fZGVjb2Rlci5yZXNldCgpO1xuICAgIH1cbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBvblBhcmFtVXBkYXRlKG5hbWUsIHZhbHVlLCBtZXRhcykge1xuICAgIHN1cGVyLm9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKTtcblxuICAgIGlmIChuYW1lID09PSAnbGlrZWxpaG9vZFdpbmRvdycpIHtcbiAgICAgIHRoaXMuX2RlY29kZXIuc2V0TGlrZWxpaG9vZFdpbmRvdyh2YWx1ZSk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyA9IHt9KSB7XG4gICAgdGhpcy5wcmVwYXJlU3RyZWFtUGFyYW1zKHByZXZTdHJlYW1QYXJhbXMpO1xuXG4gICAgY29uc3QgbW9kZWwgPSB0aGlzLnBhcmFtcy5nZXQoJ21vZGVsJyk7XG4gICAgY29uc3Qgc3RhdGVzID0gbW9kZWwgPyBtb2RlbC5jb25maWd1cmF0aW9uLmRlZmF1bHRfcGFyYW1ldGVycy5zdGF0ZXMgOiBudWxsO1xuXG4gICAgaWYgKHN0YXRlcyAhPT0gbnVsbCAmJiBzdGF0ZXMgIT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhpcy5fbW9kZWxUeXBlID0gJ2hobW0nO1xuICAgICAgdGhpcy5fZGVjb2RlciA9IG5ldyBIaG1tRGVjb2Rlcih0aGlzLnBhcmFtcy5nZXQoJ2xpa2VsaWhvb2RXaW5kb3cnKSk7XG4gICAgfSBlbHNlIHtcbiAgICAgIHRoaXMuX21vZGVsVHlwZSA9ICdnbW0nO1xuICAgICAgdGhpcy5fZGVjb2RlciA9IG5ldyBHbW1EZWNvZGVyKHRoaXMucGFyYW1zLmdldCgnbGlrZWxpaG9vZFdpbmRvdycpKTtcbiAgICB9XG5cbiAgICB0aGlzLl9kZWNvZGVyLnNldE1vZGVsKG1vZGVsKTtcblxuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLmdldE51bWJlck9mQ2xhc3NlcygpO1xuICAgIH0gZWxzZSB7IC8vID09PSAncmVncmVzc2lvbidcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIuZ2V0UmVncmVzc2lvblZlY3RvclNpemUoKTtcbiAgICB9XG5cbiAgICB0aGlzLnByb3BhZ2F0ZVN0cmVhbVBhcmFtcygpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIHByb2Nlc3NWZWN0b3IoZnJhbWUpIHtcbiAgICBjb25zdCBpbkFycmF5ID0gbmV3IEFycmF5KGZyYW1lLmRhdGEubGVuZ3RoKTtcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGluQXJyYXkubGVuZ3RoOyBpKyspIHtcbiAgICAgIGluQXJyYXlbaV0gPSBmcmFtZS5kYXRhW2ldO1xuICAgIH1cblxuICAgIGNvbnN0IHJlcyA9IHRoaXMuX2RlY29kZXIuZmlsdGVyKGluQXJyYXkpO1xuICAgIGNvbnN0IGNhbGxiYWNrID0gdGhpcy5wYXJhbXMuZ2V0KCdjYWxsYmFjaycpO1xuICAgIGxldCBvdXREYXRhO1xuICAgIGlmICh0aGlzLnBhcmFtcy5nZXQoJ291dHB1dCcpID09PSAnbGlrZWxpaG9vZHMnKSB7XG4gICAgICBvdXREYXRhID0gcmVzID8gcmVzLmxpa2VsaWhvb2RzIDogW107XG4gICAgfSBlbHNlIHtcbiAgICAgIG91dERhdGEgPSByZXMgPyByZXMub3V0cHV0VmFsdWVzIDogW107XG4gICAgfVxuXG4gICAgY29uc3QgZGF0YSA9IHRoaXMuZnJhbWUuZGF0YTtcbiAgICBjb25zdCBmcmFtZVNpemUgPSB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemU7XG5cbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGZyYW1lU2l6ZTsgaSsrKSB7XG4gICAgICBkYXRhW2ldID0gb3V0RGF0YVtpXTtcbiAgICB9XG5cbiAgICBpZiAoY2FsbGJhY2spIHtcbiAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBYbW1EZWNvZGVyTGZvOyJdfQ==