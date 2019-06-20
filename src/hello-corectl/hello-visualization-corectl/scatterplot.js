/* eslint-env browser */
/* eslint import/extensions:0 */

import picasso from 'picasso.js';
import picassoQ from 'picasso-plugin-q';

picasso.use(picassoQ);

export default class Scatterplot {
  constructor() {
    this.axisPainted = false;
    this.pic = null;
  }

  paintScatterplot(element, layout, selectionAPI) {
    if (!(layout.qHyperCube
      && layout.qHyperCube.qDataPages
      && layout.qHyperCube.qDataPages[0]
      && layout.qHyperCube.qDataPages[0].qMatrix)
    ) {
      return;
    }
    if (selectionAPI.hasSelected) {
      return; // keep selected chart state
    }
    const settings = {
      collections: [
        {
          key: 'coll',
          data: {
            extract: {
              field: 'qDimensionInfo/0',
              props: {
                movie: { value: v => v.qText },
                cost: { field: 'qMeasureInfo/0' },
                rating: { field: 'qMeasureInfo/1' },
              },
            },
          },
        },
      ],
      scales: {
        x: { data: { field: 'qMeasureInfo/1' }, expand: 0.1 },
        y: { data: { field: 'qMeasureInfo/0' }, expand: 0.1, invert: true },
      },
      components: [
        {
          key: 'xaxis',
          type: 'axis',
          scale: 'x',
          dock: 'bottom',
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
          key: 'points',
          type: 'point',
          data: { collection: 'coll' },
          brush: {
            trigger: [{
              on: 'tap',
              action: 'set',
              data: ['movie'],
              propagation: 'stop',
              contexts: ['highlight'],
            }, {
              on: 'over',
              action: 'set',
              data: ['movie'],
              propagation: 'stop',
              contexts: ['tooltip'],
            }],
            consume: [{
              context: 'highlight',
              style: {
                inactive: {
                  fill: 'rgba(109, 232, 193, 0.3)',
                },
              },
            }, {
              context: 'tooltip',
            }],
          },
          settings: {
            x: { scale: 'x', ref: 'rating' },
            y: { scale: 'y', ref: 'cost' },
            size: 0.4,
            opacity: 0.8,
            fill: 'rgba(109, 232, 193, 1.0)',
          },
        },
      ],
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

      this.pic.brush('highlight').on('update', (added) => {
        if (added[0]) {
          selectionAPI.select(added[0].values[0]);
        } else {
          this.pic.brush('highlight').end();
          selectionAPI.clear();
        }
      });
      this.pic.brush('tooltip').on('update', (added) => {
        if (added.length) {
          const s = this.pic.getAffectedShapes('tooltip')[0];
          const rect = s.element.getBoundingClientRect();
          const p = {
            x: s.bounds.x + s.bounds.width + rect.x + 5,
            y: s.bounds.y + (s.bounds.height / 2) + (rect.y - 28),
          };
          Scatterplot.showTooltip(s.data.movie.value, p);
        } else {
          Scatterplot.hideTooltip();
        }
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

  static showDetails(layout) {
    if (!(layout.qHyperCube
      && layout.qHyperCube.qDataPages
      && layout.qHyperCube.qDataPages[0]
      && layout.qHyperCube.qDataPages[0].qMatrix)
    ) {
      return;
    }

    const data = layout.qHyperCube.qDataPages[0].qMatrix.map(item => ({
      movie: item[0].qText,
      image: item[1].qText,
      year: item[2].qText,
      genre: item[3].qText,
      description: item[4].qText,
    }));

    const image = document.getElementsByClassName('movie-image')[0];
    image.src = data[0].image;

    const title = document.getElementsByClassName('movie-title')[0];
    title.innerHTML = data[0].movie;

    const year = document.getElementsByClassName('movie-year')[0];
    year.innerHTML = data[0].year;

    const genre = document.getElementsByClassName('movie-genre')[0];
    genre.innerHTML = data[0].genre;

    const description = document.getElementsByClassName('movie-description')[0];
    description.innerHTML = data[0].description;
  }

  static hideTooltip() {
    const elements = document.getElementsByClassName('tooltip');
    if (elements[0]) {
      document.body.removeChild(elements[0]);
    }
  }

  static showTooltip(text, point) {
    Scatterplot.hideTooltip();
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
