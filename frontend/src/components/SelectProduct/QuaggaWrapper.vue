<template>
  <div id="interactive" class="viewport scanner">
    <video />
    <canvas class="drawingBuffer" />
  </div>
</template>

<script>
import Quagga from 'quagga';

export default {
  name: 'QuaggaScanner',
  props: {
    onDetected: {
      type: Function,
      default(result) {
        console.log('detected: ', result);
      },
    },
    readerTypes: {
      type: Array,
      default: () => ['code_128_reader'],
    },
    readerSize: {
      type: Object,
      default: () => ({
        width: 640,
        height: 480,
      }),
      validator: o => typeof o.width === 'number' && typeof o.height === 'number',
    },
    aspectRatio: {
      type: Object,
      default: () => ({
        min: 1,
        max: 2,
      }),
      validator: o => typeof o.min === 'number' && typeof o.max === 'number',
    },
    resizer: {
      type: Function,
      default: () => {},
    },
  },
  data() {
    return {
      quaggaState: {
        inputStream: {
          type: 'LiveStream',
          constraints: {
            width: { min: this.readerSize.width },
            height: { min: this.readerSize.height },
            facingMode: 'environment',
            aspectRatio: { min: 1, max: 2 },
          },
        },
        locator: {
          patchSize: 'medium',
          halfSample: true,
        },
        numOfWorkers: 2,
        frequency: 10,
        decoder: {
          readers: this.readerTypes,
        },
        locate: true,
      },
      resized: false,
    };
  },
  mounted() {
    // eslint-disable-next-line consistent-return
    Quagga.init(this.quaggaState, (err) => {
      if (err) {
        return console.error(err);
      }
      Quagga.start();
    });
    Quagga.onDetected(this.onDetected);
    Quagga.onProcessed(this.onProcessed);
  },
  destroyed() {
    Quagga.stop();
  },
  methods: {
    onProcessed(result) {
      if (!this.resized) {
        this.$props.resizer();
        this.resized = true;
      }
      const drawingCtx = Quagga.canvas.ctx.overlay;
      const drawingCanvas = Quagga.canvas.dom.overlay;

      if (result) {
        if (result.boxes) {
          drawingCtx.clearRect(
            0,
            0,
            parseInt(drawingCanvas.getAttribute('width'), 10),
            parseInt(drawingCanvas.getAttribute('height'), 10),
          );
          result.boxes
            .filter(box => box !== result.box)
            .forEach((box) => {
              Quagga.ImageDebug.drawPath(box, { x: 0, y: 1 }, drawingCtx, {
                color: 'green',
                lineWidth: 2,
              });
            });
        }
        if (result.box) {
          Quagga.ImageDebug.drawPath(result.box, { x: 0, y: 1 }, drawingCtx, {
            color: '#00F',
            lineWidth: 2,
          });
        }

        if (result.codeResult && result.codeResult.code) {
          Quagga.ImageDebug.drawPath(
            result.line,
            { x: 'x', y: 'y' },
            drawingCtx,
            { color: 'red', lineWidth: 3 },
          );
        }
      }
    },
  },
};
</script>

<style scoped>
.viewport {
  position: relative;
}

.viewport canvas,
.viewport video {
  position: absolute;
  left: 0;
  top: 0;
}
</style>
