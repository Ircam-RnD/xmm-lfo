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

      if (callback && res) {
        callback(res);
      }
    }
  }]);

  return XmmDecoderLfo;
}(_core.BaseLfo);

;

exports.default = XmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIlhtbURlY29kZXJMZm8uanMiXSwibmFtZXMiOlsiZGVmaW5pdGlvbnMiLCJtb2RlbCIsInR5cGUiLCJkZWZhdWx0IiwibnVsbGFibGUiLCJtZXRhcyIsImtpbmQiLCJsaWtlbGlob29kV2luZG93IiwibWluIiwibWF4Iiwib3V0cHV0IiwibGlzdCIsImNvbnN0YW50IiwiY2FsbGJhY2siLCJYbW1EZWNvZGVyTGZvIiwib3B0aW9ucyIsIl9tb2RlbFR5cGUiLCJfZGVjb2RlciIsInBhcmFtcyIsImdldCIsInJlc2V0IiwibmFtZSIsInZhbHVlIiwic2V0TGlrZWxpaG9vZFdpbmRvdyIsInByZXZTdHJlYW1QYXJhbXMiLCJwcmVwYXJlU3RyZWFtUGFyYW1zIiwic3RhdGVzIiwiY29uZmlndXJhdGlvbiIsImRlZmF1bHRfcGFyYW1ldGVycyIsInVuZGVmaW5lZCIsInNldE1vZGVsIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwiZ2V0TnVtYmVyT2ZDbGFzc2VzIiwiZ2V0UmVncmVzc2lvblZlY3RvclNpemUiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmcmFtZSIsImluQXJyYXkiLCJBcnJheSIsImRhdGEiLCJsZW5ndGgiLCJpIiwicmVzIiwiZmlsdGVyIiwib3V0RGF0YSIsImxpa2VsaWhvb2RzIiwib3V0cHV0VmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O0FBR0EsSUFBTUEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLEtBREQ7QUFFTEMsYUFBUyxJQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPLEVBQUVDLE1BQU0sUUFBUjtBQUpGLEdBRFc7QUFPbEJDLG9CQUFrQjtBQUNoQkwsVUFBTSxTQURVO0FBRWhCQyxhQUFTLEVBRk87QUFHaEJLLFNBQUssQ0FIVztBQUloQkMsU0FBSztBQUpXLEdBUEE7QUFhbEJDLFVBQVE7QUFDTlIsVUFBTSxNQURBO0FBRU5DLGFBQVMsYUFGSDtBQUdOUSxVQUFN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QWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DeUIsa0JBQVVGLE1BQU1BLElBQUlHLFdBQVYsR0FBd0IsRUFBbEM7QUFDRCxPQUZELE1BRU87QUFDTEQsa0JBQVVGLE1BQU1BLElBQUlJLFlBQVYsR0FBeUIsRUFBbkM7QUFDRDs7QUFFRCxVQUFNUCxPQUFPLEtBQUtILEtBQUwsQ0FBV0csSUFBeEI7QUFDQSxVQUFNUCxZQUFZLEtBQUtELFlBQUwsQ0FBa0JDLFNBQXBDOztBQUVBLFdBQUssSUFBSVMsS0FBSSxDQUFiLEVBQWdCQSxLQUFJVCxTQUFwQixFQUErQlMsSUFBL0IsRUFBb0M7QUFDbENGLGFBQUtFLEVBQUwsSUFBVUcsUUFBUUgsRUFBUixDQUFWO0FBQ0Q7O0FBRUQsVUFBSTVCLFlBQVk2QixHQUFoQixFQUFxQjtBQUNuQjdCLGlCQUFTNkIsR0FBVDtBQUNEO0FBQ0Y7Ozs7OztBQUNGOztrQkFFYzVCLGEiLCJmaWxlIjoiWG1tRGVjb2Rlckxmby5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCB7IEJhc2VMZm8gfSBmcm9tICd3YXZlcy1sZm8vY29yZSc7XG5pbXBvcnQgeyBHbW1EZWNvZGVyLCBIaG1tRGVjb2RlciB9IGZyb20gJ3htbS1jbGllbnQnO1xuXG5cbmNvbnN0IGRlZmluaXRpb25zID0ge1xuICBtb2RlbDoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ3N0YXRpYycgfSxcbiAgfSwgXG4gIGxpa2VsaWhvb2RXaW5kb3c6IHtcbiAgICB0eXBlOiAnaW50ZWdlcicsXG4gICAgZGVmYXVsdDogMjAsXG4gICAgbWluOiAxLFxuICAgIG1heDogMWUzMCxcbiAgfSxcbiAgb3V0cHV0OiB7XG4gICAgdHlwZTogJ2VudW0nLFxuICAgIGRlZmF1bHQ6ICdsaWtlbGlob29kcycsXG4gICAgbGlzdDogWydsaWtlbGlob29kcycsICdyZWdyZXNzaW9uJ10sXG4gICAgY29uc3RhbnQ6IHRydWUsXG4gIH0sXG4gIGNhbGxiYWNrOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnZHluYW1pYycgfSxcbiAgfVxufTtcblxuLyoqXG4gKiBMZm8gY2xhc3MgbG9hZGluZyBhbnkgbW9kZWwgKEdNTSBvciBISE1NKSBjcmVhdGVkIGJ5IHRoZSB4bW0gbGlicmFyeSBhbmRcbiAqIGF1dG9tYXRpY2FsbHkgaW5zdGFudGlhdGluZyB0aGUgY29ycmVzcG9uZGluZyBkZWNvZGVyIGludGVybmFsbHkgdG9cbiAqIHByb2Nlc3MgYW4gaW5wdXQgc3RyZWFtIG9mIHZlY3RvcnMgKG1vZGVscyBtdXN0IGhhdmUgYmVlbiB0cmFpbmVkIGZyb20gdGhlXG4gKiBzYW1lIGlucHV0IHN0cmVhbSkuXG4gKiBBcyB0aGUgcmVzdWx0cyBvZiB0aGUgY2xhc3NpZmljYXRpb24gLyBmb2xsb3dpbmcgLyByZWdyZXNzaW9uIGFyZSBtb3JlXG4gKiBjb21wbGV4IHRoYW4gYSBzaW1wbGUgdmVjdG9yLCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbiBiZSBwYXNzZWQgdG8gdGhlXG4gKiBjb25zdHJ1Y3RvciB0byBoYW5kbGUgdGhlbS5cbiAqIEBjbGFzc1xuICpcbiAqIEBwYXJhbSB7T2JqZWN0fSBvcHRpb25zIC0gT3ZlcnJpZGUgZGVmYXVsdHMuXG4gKiBAcGFyYW0ge09iamVjdH0gW29wdGlvbnMubW9kZWw9bnVsbF0gLSBBbnkgbW9kZWwgZnJvbSB0aGUgWE1NIGxpYnJhcnkuXG4gKiBAcGFyYW0ge051bWJlcn0gW29wdGlvbnMubGlrZWxpaG9vZFdpbmRvdz0yMF0gLSBMaWtlbGlob29kIHdpbmRvdyBzaXplIChzbW9vdGhzIG91dHB1dCkuXG4gKiBAcGFyYW0geygnbGlrZWxpaG9vZHMnfCdyZWdyZXNzaW9uJyl9IFtvcHRpb25zLm91dHB1dD0nbGlrZWxpaG9vZHMnXSAtIFdoaWNoIGluZm9ybWF0aW9uIHRvIG91dHB1dC5cbiAqIEBwYXJhbSB7ZmlsdGVyQ2FsbGJhY2t9IFtvcHRpb25zLmNhbGxiYWNrPW51bGxdXG4qL1xuY2xhc3MgWG1tRGVjb2RlckxmbyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9tb2RlbFR5cGUgPSAnaGhtbSc7XG4gICAgdGhpcy5fZGVjb2RlciA9IG5ldyBIaG1tRGVjb2Rlcih0aGlzLnBhcmFtcy5nZXQoJ2xpa2VsaWhvb2RXaW5kb3cnKSk7XG4gIH1cblxuICAvKipcbiAgICogUmVzZXRzIHRoZSBpbnRlcm1lZGlhdGUgcmVzdWx0cyBvZiB0aGUgZXN0aW1hdGlvbiBpZiB0aGUgbW9kZWwgaXMgYSBISE1NLlxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgaWYgKHRoaXMuX21vZGVsVHlwZSA9PT0gJ2hobW0nKSB7XG4gICAgICB0aGlzLl9kZWNvZGVyLnJlc2V0KCk7XG4gICAgfVxuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgaWYgKG5hbWUgPT09ICdsaWtlbGlob29kV2luZG93Jykge1xuICAgICAgdGhpcy5fZGVjb2Rlci5zZXRMaWtlbGlob29kV2luZG93KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICBjb25zdCBtb2RlbCA9IHRoaXMucGFyYW1zLmdldCgnbW9kZWwnKTtcbiAgICBjb25zdCBzdGF0ZXMgPSBtb2RlbCA/IG1vZGVsLmNvbmZpZ3VyYXRpb24uZGVmYXVsdF9wYXJhbWV0ZXJzLnN0YXRlcyA6IG51bGw7XG5cbiAgICBpZiAoc3RhdGVzICE9PSBudWxsICYmIHN0YXRlcyAhPT0gdW5kZWZpbmVkKSB7XG4gICAgICB0aGlzLl9tb2RlbFR5cGUgPSAnaGhtbSc7XG4gICAgICB0aGlzLl9kZWNvZGVyID0gbmV3IEhobW1EZWNvZGVyKHRoaXMucGFyYW1zLmdldCgnbGlrZWxpaG9vZFdpbmRvdycpKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdGhpcy5fbW9kZWxUeXBlID0gJ2dtbSc7XG4gICAgICB0aGlzLl9kZWNvZGVyID0gbmV3IEdtbURlY29kZXIodGhpcy5wYXJhbXMuZ2V0KCdsaWtlbGlob29kV2luZG93JykpO1xuICAgIH1cblxuICAgIHRoaXMuX2RlY29kZXIuc2V0TW9kZWwobW9kZWwpO1xuXG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZSA9IHRoaXMuX2RlY29kZXIuZ2V0TnVtYmVyT2ZDbGFzc2VzKCk7XG4gICAgfSBlbHNlIHsgLy8gPT09ICdyZWdyZXNzaW9uJ1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5nZXRSZWdyZXNzaW9uVmVjdG9yU2l6ZSgpO1xuICAgIH1cblxuICAgIHRoaXMucHJvcGFnYXRlU3RyZWFtUGFyYW1zKCk7XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1ZlY3RvcihmcmFtZSkge1xuICAgIGNvbnN0IGluQXJyYXkgPSBuZXcgQXJyYXkoZnJhbWUuZGF0YS5sZW5ndGgpO1xuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5BcnJheS5sZW5ndGg7IGkrKykge1xuICAgICAgaW5BcnJheVtpXSA9IGZyYW1lLmRhdGFbaV07XG4gICAgfVxuXG4gICAgY29uc3QgcmVzID0gdGhpcy5fZGVjb2Rlci5maWx0ZXIoaW5BcnJheSk7XG4gICAgY29uc3QgY2FsbGJhY2sgPSB0aGlzLnBhcmFtcy5nZXQoJ2NhbGxiYWNrJyk7XG4gICAgbGV0IG91dERhdGE7XG4gICAgaWYgKHRoaXMucGFyYW1zLmdldCgnb3V0cHV0JykgPT09ICdsaWtlbGlob29kcycpIHtcbiAgICAgIG91dERhdGEgPSByZXMgPyByZXMubGlrZWxpaG9vZHMgOiBbXTtcbiAgICB9IGVsc2Uge1xuICAgICAgb3V0RGF0YSA9IHJlcyA/IHJlcy5vdXRwdXRWYWx1ZXMgOiBbXTtcbiAgICB9XG5cbiAgICBjb25zdCBkYXRhID0gdGhpcy5mcmFtZS5kYXRhO1xuICAgIGNvbnN0IGZyYW1lU2l6ZSA9IHRoaXMuc3RyZWFtUGFyYW1zLmZyYW1lU2l6ZTtcblxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZnJhbWVTaXplOyBpKyspIHtcbiAgICAgIGRhdGFbaV0gPSBvdXREYXRhW2ldO1xuICAgIH1cblxuICAgIGlmIChjYWxsYmFjayAmJiByZXMpIHtcbiAgICAgIGNhbGxiYWNrKHJlcyk7XG4gICAgfVxuICB9XG59O1xuXG5leHBvcnQgZGVmYXVsdCBYbW1EZWNvZGVyTGZvOyJdfQ==