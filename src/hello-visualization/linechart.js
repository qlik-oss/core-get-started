/* eslint-env browser */
/* eslint import/extensions:0 */

import picasso from 'picasso.js';
import picassoQ from 'picasso-plugin-q';

picasso.use(picassoQ);

export default class Linechart {
  constructor() {
    this.axisPainted = false;
    this.pic = null;
  }

  paintLinechart(element, layout) {
    if (!(layout.qHyperCube
      && layout.qHyperCube.qDataPages
      && layout.qHyperCube.qDataPages[0]
      && layout.qHyperCube.qDataPages[0].qMatrix)
    ) {
      return;
    }
    const settings = {
      collections: [
        {
          key: 'coll',
          data: {
            extract: {
              field: 'qDimensionInfo/0',
              value: v => v.qNum,
              props: {
                movie: { value: v => v.qText },
                movieCount: { field: 'qMeasureInfo/0' },
              },
            },
          },
        },
      ],
      scales: {
        x: { data: { field: 'qDimensionInfo/0' }, expand: 0.05, type: 'linear' },
        y: { data: { field: 'qMeasureInfo/0' }, expand: 0.1, invert: true },
      },
      components: [
        {
          key: 'xaxis',
          type: 'axis',
          scale: 'x',
          dock: 'bottom',
          formatter: {
            type: 'd3-number',
          },
          settings: { labels: { fill: '#f2f2f2' } },

        },
        {
          key: 'yaxis',
          type: 'axis',
          scale: 'y',
          dock: 'left',
          settings: { labels: { fill: '#f2f2f2' } },
        },

        {
          key: 'xtitle',
          type: 'text',
          scale: 'x',
          dock: 'bottom',
          style: {
            text: { fill: '#f2f2f2' },
          },
        },
        {
          key: 'ytitle',
          type: 'text',
          scale: 'y',
          dock: 'left',
          style: {
            text: { fill: '#f2f2f2' },
          },
        },
        {
          key: 'lines',
          type: 'line',
          data: { collection: 'coll' },

          settings: {

            coordinates: {
              major: { scale: 'x' },
              minor: { scale: 'y', ref: 'movieCount' },
            },
            layers: {
              line: {},
            },
          },
        }],
    };

    if (!this.pic) {
      this.pic = picasso.chart({
        element,
        data: [{
          type: 'q',
          key: 'qHyperCube',
          data: layout.qHyperCube,
        }],
        settings,
      });
    } else {
      this.pic.update({
        data: [{
          type: 'q',
          key: 'qHyperCube',
          data: layout.qHyperCube,
        }],
        settings,
      });
    }
  }

  static hideTooltip() {
    const elements = document.getElementsByClassName('tooltip');
    if (elements[0]) {
      document.body.removeChild(elements[0]);
    }
  }

  static showTooltip(text, point) {
    const currentTooltip = document.createElement('div');
    currentTooltip.appendChild(document.createTextNode(text));
    currentTooltip.style.position = 'absolute';
    currentTooltip.style.top = '-99999px';
    currentTooltip.style.left = '-99999px';
    currentTooltip.classList.add('tooltip');

    document.body.appendChild(currentTooltip);

    // Reposition the tooltip
    currentTooltip.style.top = `${point.y}px`;
    currentTooltip.style.left = `${(point.x + 5)}px`;
  }
}
