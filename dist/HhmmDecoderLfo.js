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
 * Lfo class loading Hierarchical HMM models created by the XMM library to
 * process an input stream of vectors (models must have been trained from the
 * same input stream).
 * As the results of the classification / following / regression are more
 * complex than a simple vector, a callback function can be passed to the
 * constructor to handle them, or they can alternatively be queried via the
 * readonly filterResults property.
 * @class
 *
 * @param {Object} options - Override defaults.
 * @param {Object} [options.model=null] - A Hierarchical HMM model from the XMM library.
 * @param {Number} [options.likelihoodWindow=20] - Likelihood window size (smooths output).
 * @param {('likelihoods'|'regression')} [options.output='likelihoods'] - Which information to output.
 * @param {filterCallback} [options.callback=null]
 */

var HhmmDecoderLfo = function (_BaseLfo) {
  _inherits(HhmmDecoderLfo, _BaseLfo);

  function HhmmDecoderLfo() {
    var options = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, HhmmDecoderLfo);

    var _this = _possibleConstructorReturn(this, (HhmmDecoderLfo.__proto__ || Object.getPrototypeOf(HhmmDecoderLfo)).call(this, definitions, options));

    _this._decoder = new _xmmClient.HhmmDecoder(_this.params.get('likelihoodWindow'));
    return _this;
  }

  /**
   * Resets the intermediate results of the estimation.
   */


  _createClass(HhmmDecoderLfo, [{
    key: 'reset',
    value: function reset() {
      this._decoder.reset();
    }

    /** @private */

  }, {
    key: 'onParamUpdate',
    value: function onParamUpdate(name, value, metas) {
      _get(HhmmDecoderLfo.prototype.__proto__ || Object.getPrototypeOf(HhmmDecoderLfo.prototype), 'onParamUpdate', this).call(this, name, value, metas);

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

  return HhmmDecoderLfo;
}(_core.BaseLfo);

;

exports.default = HhmmDecoderLfo;
//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIkhobW1EZWNvZGVyTGZvLmpzIl0sIm5hbWVzIjpbImRlZmluaXRpb25zIiwibW9kZWwiLCJ0eXBlIiwiZGVmYXVsdCIsIm51bGxhYmxlIiwibWV0YXMiLCJraW5kIiwibGlrZWxpaG9vZFdpbmRvdyIsIm1pbiIsIm1heCIsIm91dHB1dCIsImxpc3QiLCJjb25zdGFudCIsImNhbGxiYWNrIiwiSGhtbURlY29kZXJMZm8iLCJvcHRpb25zIiwiX2RlY29kZXIiLCJwYXJhbXMiLCJnZXQiLCJyZXNldCIsIm5hbWUiLCJ2YWx1ZSIsInNldExpa2VsaWhvb2RXaW5kb3ciLCJwcmV2U3RyZWFtUGFyYW1zIiwicHJlcGFyZVN0cmVhbVBhcmFtcyIsInNldE1vZGVsIiwic3RyZWFtUGFyYW1zIiwiZnJhbWVTaXplIiwiZ2V0TnVtYmVyT2ZDbGFzc2VzIiwiZ2V0UmVncmVzc2lvblZlY3RvclNpemUiLCJwcm9wYWdhdGVTdHJlYW1QYXJhbXMiLCJmcmFtZSIsImluQXJyYXkiLCJBcnJheSIsImRhdGEiLCJsZW5ndGgiLCJpIiwicmVzIiwiZmlsdGVyIiwib3V0RGF0YSIsImxpa2VsaWhvb2RzIiwib3V0cHV0VmFsdWVzIl0sIm1hcHBpbmdzIjoiOzs7Ozs7Ozs7O0FBQUE7O0FBQ0E7Ozs7Ozs7O0FBRUEsSUFBTUEsY0FBYztBQUNsQkMsU0FBTztBQUNMQyxVQUFNLEtBREQ7QUFFTEMsYUFBUyxJQUZKO0FBR0xDLGNBQVUsSUFITDtBQUlMQyxXQUFPLEVBQUVDLE1BQU0sUUFBUjtBQUpGLEdBRFc7QUFPbEJDLG9CQUFrQjtBQUNoQkwsVUFBTSxTQURVO0FBRWhCQyxhQUFTLEVBRk87QUFHaEJLLFNBQUssQ0FIVztBQUloQkMsU0FBSztBQUpXLEdBUEE7QUFhbEJDLFVBQVE7QUFDTlIsVUFBTSxNQURBO0FBRU5DLGFBQVMsYUFGSDtBQUdOUSxVQUFNLENBQUMsYUFBRCxFQUFnQixZQUFoQixDQUhBO0FBSU5DLGNBQVU7QUFKSixHQWJVO0FBbUJsQkMsWUFBVTtBQUNSWCxVQUFNLEtBREU7QUFFUkMsYUFBUyxJQUZEO0FBR1JDLGNBQVUsSUFIRjtBQUlSQyxXQUFPLEVBQUVDLE1BQU0sU0FBUjtBQUpDO0FBbkJRLENBQXBCOztBQTJCQTs7Ozs7Ozs7Ozs7Ozs7Ozs7SUFnQk1RLGM7OztBQUNKLDRCQUEwQjtBQUFBLFFBQWRDLE9BQWMsdUVBQUosRUFBSTs7QUFBQTs7QUFBQSxnSUFDbEJmLFdBRGtCLEVBQ0xlLE9BREs7O0FBR3hCLFVBQUtDLFFBQUwsR0FBZ0IsMkJBQWdCLE1BQUtDLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixrQkFBaEIsQ0FBaEIsQ0FBaEI7QUFId0I7QUFJekI7O0FBRUQ7Ozs7Ozs7NEJBR1E7QUFDTixXQUFLRixRQUFMLENBQWNHLEtBQWQ7QUFDRDs7QUFFRDs7OztrQ0FDY0MsSSxFQUFNQyxLLEVBQU9oQixLLEVBQU87QUFDaEMsb0lBQW9CZSxJQUFwQixFQUEwQkMsS0FBMUIsRUFBaUNoQixLQUFqQzs7QUFFQSxVQUFJZSxTQUFTLGtCQUFiLEVBQWlDO0FBQy9CLGFBQUtKLFFBQUwsQ0FBY00sbUJBQWQsQ0FBa0NELEtBQWxDO0FBQ0Q7QUFDRjs7QUFFRDs7OzswQ0FDMkM7QUFBQSxVQUF2QkUsZ0JBQXVCLHVFQUFKLEVBQUk7O0FBQ3pDLFdBQUtDLG1CQUFMLENBQXlCRCxnQkFBekI7O0FBRUEsV0FBS1AsUUFBTCxDQUFjUyxRQUFkLENBQXVCLEtBQUtSLE1BQUwsQ0FBWUMsR0FBWixDQUFnQixPQUFoQixDQUF2Qjs7QUFFQSxVQUFJLEtBQUtELE1BQUwsQ0FBWUMsR0FBWixDQUFnQixRQUFoQixNQUE4QixhQUFsQyxFQUFpRDtBQUMvQyxhQUFLUSxZQUFMLENBQWtCQyxTQUFsQixHQUE4QixLQUFLWCxRQUFMLENBQWNZLGtCQUFkLEVBQTlCO0FBQ0QsT0FGRCxNQUVPO0FBQUU7QUFDUCxhQUFLRixZQUFMLENBQWtCQyxTQUFsQixHQUE4QixLQUFLWCxRQUFMLENBQWNhLHVCQUFkLEVBQTlCO0FBQ0Q7O0FBRUQsV0FBS0MscUJBQUw7QUFDRDs7QUFFRDs7OztrQ0FDY0MsSyxFQUFPO0FBQ25CLFVBQU1DLFVBQVUsSUFBSUMsS0FBSixDQUFVRixNQUFNRyxJQUFOLENBQVdDLE1BQXJCLENBQWhCO0FBQ0EsV0FBSyxJQUFJQyxJQUFJLENBQWIsRUFBZ0JBLElBQUlKLFFBQVFHLE1BQTVCLEVBQW9DQyxHQUFwQyxFQUF5QztBQUN2Q0osZ0JBQVFJLENBQVIsSUFBYUwsTUFBTUcsSUFBTixDQUFXRSxDQUFYLENBQWI7QUFDRDs7QUFFRCxVQUFNQyxNQUFNLEtBQUtyQixRQUFMLENBQWNzQixNQUFkLENBQXFCTixPQUFyQixDQUFaO0FBQ0EsVUFBTW5CLFdBQVcsS0FBS0ksTUFBTCxDQUFZQyxHQUFaLENBQWdCLFVBQWhCLENBQWpCO0FBQ0EsVUFBSXFCLGdCQUFKO0FBQ0EsVUFBSSxLQUFLdEIsTUFBTCxDQUFZQyxHQUFaLENBQWdCLFFBQWhCLE1BQThCLGFBQWxDLEVBQWlEO0FBQy9DcUIsa0JBQVVGLE1BQU1BLElBQUlHLFdBQVYsR0FBd0IsRUFBbEM7QUFDRCxPQUZELE1BRU87QUFDTEQsa0JBQVVGLE1BQU1BLElBQUlJLFlBQVYsR0FBeUIsRUFBbkM7QUFDRDs7QUFFRCxVQUFNUCxPQUFPLEtBQUtILEtBQUwsQ0FBV0csSUFBeEI7QUFDQSxVQUFNUCxZQUFZLEtBQUtELFlBQUwsQ0FBa0JDLFNBQXBDOztBQUVBLFdBQUssSUFBSVMsS0FBSSxDQUFiLEVBQWdCQSxLQUFJVCxTQUFwQixFQUErQlMsSUFBL0IsRUFBb0M7QUFDbENGLGFBQUtFLEVBQUwsSUFBVUcsUUFBUUgsRUFBUixDQUFWO0FBQ0Q7O0FBRUQsVUFBSXZCLFlBQVl3QixHQUFoQixFQUFxQjtBQUNuQnhCLGlCQUFTd0IsR0FBVDtBQUNEO0FBQ0Y7Ozs7OztBQUNGOztrQkFFY3ZCLGMiLCJmaWxlIjoiSGhtbURlY29kZXJMZm8uanMiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgeyBCYXNlTGZvIH0gZnJvbSAnd2F2ZXMtbGZvL2NvcmUnO1xuaW1wb3J0IHsgSGhtbURlY29kZXIgfSBmcm9tICd4bW0tY2xpZW50JztcblxuY29uc3QgZGVmaW5pdGlvbnMgPSB7XG4gIG1vZGVsOiB7XG4gICAgdHlwZTogJ2FueScsXG4gICAgZGVmYXVsdDogbnVsbCxcbiAgICBudWxsYWJsZTogdHJ1ZSxcbiAgICBtZXRhczogeyBraW5kOiAnc3RhdGljJyB9LFxuICB9LFxuICBsaWtlbGlob29kV2luZG93OiB7XG4gICAgdHlwZTogJ2ludGVnZXInLFxuICAgIGRlZmF1bHQ6IDIwLFxuICAgIG1pbjogMSxcbiAgICBtYXg6IDFlMzAsXG4gIH0sXG4gIG91dHB1dDoge1xuICAgIHR5cGU6ICdlbnVtJyxcbiAgICBkZWZhdWx0OiAnbGlrZWxpaG9vZHMnLFxuICAgIGxpc3Q6IFsnbGlrZWxpaG9vZHMnLCAncmVncmVzc2lvbiddLFxuICAgIGNvbnN0YW50OiB0cnVlLFxuICB9LFxuICBjYWxsYmFjazoge1xuICAgIHR5cGU6ICdhbnknLFxuICAgIGRlZmF1bHQ6IG51bGwsXG4gICAgbnVsbGFibGU6IHRydWUsXG4gICAgbWV0YXM6IHsga2luZDogJ2R5bmFtaWMnIH0sXG4gIH1cbn07XG5cbi8qKlxuICogTGZvIGNsYXNzIGxvYWRpbmcgSGllcmFyY2hpY2FsIEhNTSBtb2RlbHMgY3JlYXRlZCBieSB0aGUgWE1NIGxpYnJhcnkgdG9cbiAqIHByb2Nlc3MgYW4gaW5wdXQgc3RyZWFtIG9mIHZlY3RvcnMgKG1vZGVscyBtdXN0IGhhdmUgYmVlbiB0cmFpbmVkIGZyb20gdGhlXG4gKiBzYW1lIGlucHV0IHN0cmVhbSkuXG4gKiBBcyB0aGUgcmVzdWx0cyBvZiB0aGUgY2xhc3NpZmljYXRpb24gLyBmb2xsb3dpbmcgLyByZWdyZXNzaW9uIGFyZSBtb3JlXG4gKiBjb21wbGV4IHRoYW4gYSBzaW1wbGUgdmVjdG9yLCBhIGNhbGxiYWNrIGZ1bmN0aW9uIGNhbiBiZSBwYXNzZWQgdG8gdGhlXG4gKiBjb25zdHJ1Y3RvciB0byBoYW5kbGUgdGhlbSwgb3IgdGhleSBjYW4gYWx0ZXJuYXRpdmVseSBiZSBxdWVyaWVkIHZpYSB0aGVcbiAqIHJlYWRvbmx5IGZpbHRlclJlc3VsdHMgcHJvcGVydHkuXG4gKiBAY2xhc3NcbiAqXG4gKiBAcGFyYW0ge09iamVjdH0gb3B0aW9ucyAtIE92ZXJyaWRlIGRlZmF1bHRzLlxuICogQHBhcmFtIHtPYmplY3R9IFtvcHRpb25zLm1vZGVsPW51bGxdIC0gQSBIaWVyYXJjaGljYWwgSE1NIG1vZGVsIGZyb20gdGhlIFhNTSBsaWJyYXJ5LlxuICogQHBhcmFtIHtOdW1iZXJ9IFtvcHRpb25zLmxpa2VsaWhvb2RXaW5kb3c9MjBdIC0gTGlrZWxpaG9vZCB3aW5kb3cgc2l6ZSAoc21vb3RocyBvdXRwdXQpLlxuICogQHBhcmFtIHsoJ2xpa2VsaWhvb2RzJ3wncmVncmVzc2lvbicpfSBbb3B0aW9ucy5vdXRwdXQ9J2xpa2VsaWhvb2RzJ10gLSBXaGljaCBpbmZvcm1hdGlvbiB0byBvdXRwdXQuXG4gKiBAcGFyYW0ge2ZpbHRlckNhbGxiYWNrfSBbb3B0aW9ucy5jYWxsYmFjaz1udWxsXVxuICovXG5jbGFzcyBIaG1tRGVjb2RlckxmbyBleHRlbmRzIEJhc2VMZm8ge1xuICBjb25zdHJ1Y3RvcihvcHRpb25zID0ge30pIHtcbiAgICBzdXBlcihkZWZpbml0aW9ucywgb3B0aW9ucyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyID0gbmV3IEhobW1EZWNvZGVyKHRoaXMucGFyYW1zLmdldCgnbGlrZWxpaG9vZFdpbmRvdycpKTtcbiAgfVxuXG4gIC8qKlxuICAgKiBSZXNldHMgdGhlIGludGVybWVkaWF0ZSByZXN1bHRzIG9mIHRoZSBlc3RpbWF0aW9uLlxuICAgKi9cbiAgcmVzZXQoKSB7XG4gICAgdGhpcy5fZGVjb2Rlci5yZXNldCgpO1xuICB9XG5cbiAgLyoqIEBwcml2YXRlICovXG4gIG9uUGFyYW1VcGRhdGUobmFtZSwgdmFsdWUsIG1ldGFzKSB7XG4gICAgc3VwZXIub25QYXJhbVVwZGF0ZShuYW1lLCB2YWx1ZSwgbWV0YXMpO1xuXG4gICAgaWYgKG5hbWUgPT09ICdsaWtlbGlob29kV2luZG93Jykge1xuICAgICAgdGhpcy5fZGVjb2Rlci5zZXRMaWtlbGlob29kV2luZG93KHZhbHVlKTtcbiAgICB9XG4gIH1cblxuICAvKiogQHByaXZhdGUgKi9cbiAgcHJvY2Vzc1N0cmVhbVBhcmFtcyhwcmV2U3RyZWFtUGFyYW1zID0ge30pIHtcbiAgICB0aGlzLnByZXBhcmVTdHJlYW1QYXJhbXMocHJldlN0cmVhbVBhcmFtcyk7XG5cbiAgICB0aGlzLl9kZWNvZGVyLnNldE1vZGVsKHRoaXMucGFyYW1zLmdldCgnbW9kZWwnKSk7XG5cbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplID0gdGhpcy5fZGVjb2Rlci5nZXROdW1iZXJPZkNsYXNzZXMoKTtcbiAgICB9IGVsc2UgeyAvLyA9PT0gJ3JlZ3Jlc3Npb24nXG4gICAgICB0aGlzLnN0cmVhbVBhcmFtcy5mcmFtZVNpemUgPSB0aGlzLl9kZWNvZGVyLmdldFJlZ3Jlc3Npb25WZWN0b3JTaXplKCk7XG4gICAgfVxuXG4gICAgdGhpcy5wcm9wYWdhdGVTdHJlYW1QYXJhbXMoKTtcbiAgfVxuXG4gIC8qKiBAcHJpdmF0ZSAqL1xuICBwcm9jZXNzVmVjdG9yKGZyYW1lKSB7XG4gICAgY29uc3QgaW5BcnJheSA9IG5ldyBBcnJheShmcmFtZS5kYXRhLmxlbmd0aCk7XG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBpbkFycmF5Lmxlbmd0aDsgaSsrKSB7XG4gICAgICBpbkFycmF5W2ldID0gZnJhbWUuZGF0YVtpXTtcbiAgICB9XG5cbiAgICBjb25zdCByZXMgPSB0aGlzLl9kZWNvZGVyLmZpbHRlcihpbkFycmF5KTtcbiAgICBjb25zdCBjYWxsYmFjayA9IHRoaXMucGFyYW1zLmdldCgnY2FsbGJhY2snKTtcbiAgICBsZXQgb3V0RGF0YTtcbiAgICBpZiAodGhpcy5wYXJhbXMuZ2V0KCdvdXRwdXQnKSA9PT0gJ2xpa2VsaWhvb2RzJykge1xuICAgICAgb3V0RGF0YSA9IHJlcyA/IHJlcy5saWtlbGlob29kcyA6IFtdO1xuICAgIH0gZWxzZSB7XG4gICAgICBvdXREYXRhID0gcmVzID8gcmVzLm91dHB1dFZhbHVlcyA6IFtdO1xuICAgIH1cblxuICAgIGNvbnN0IGRhdGEgPSB0aGlzLmZyYW1lLmRhdGE7XG4gICAgY29uc3QgZnJhbWVTaXplID0gdGhpcy5zdHJlYW1QYXJhbXMuZnJhbWVTaXplO1xuXG4gICAgZm9yIChsZXQgaSA9IDA7IGkgPCBmcmFtZVNpemU7IGkrKykge1xuICAgICAgZGF0YVtpXSA9IG91dERhdGFbaV07XG4gICAgfVxuXG4gICAgaWYgKGNhbGxiYWNrICYmIHJlcykge1xuICAgICAgY2FsbGJhY2socmVzKTtcbiAgICB9XG4gIH1cbn07XG5cbmV4cG9ydCBkZWZhdWx0IEhobW1EZWNvZGVyTGZvO1xuIl19