/* eslint-env browser*/
/* eslint import/extensions:0 */

//import picasso from '@qlik/picasso';

export default class Scatterplot {

  constructor() {
    this.axisPainted = false;
  }

  paintScatterplot(element, layout, model, movieInfoFn) {
    const data = {
      type: 'q',
      data: layout,
    };
    const axisColor = '#fff';
    const chart = picasso.chart({
      element,
      data,
      settings: {
        scales: {
          x: { source: '/qHyperCube/qMeasureInfo/0', expand: [0.05] },
          y: { source: '/qHyperCube/qMeasureInfo/1', expand: [0.05], invert: true }
        },
        components:[{
          scale: 'y',
          type: 'axis',
          dock: 'left',
          settings: {
            line: {
              stroke: axisColor
            },
            labels: {
              fill: axisColor
            }
          }
        }, {
          type: 'axis',
          scale: 'x',
          dock: 'bottom',
          settings: {
            line: {
              stroke: axisColor
            },
            labels: {
              fill: axisColor
            }
          }
        },{
          type: 'point-marker',
          data: {
            mapTo: {
              x: { source: '/qHyperCube/qMeasureInfo/0' },
              y: { source: '/qHyperCube/qMeasureInfo/1' },
              elemNo: { source: '/qHyperCube/qDimensionInfo/0', property: 'id' }
            },
            groupBy: {
              source: '/qHyperCube/qDimensionInfo/0', attribute: '$index'
            }
          },
          brush: {
            trigger: [{
              on: 'tap',
              contexts: ['highlight'],
              data: ['elemNo']
            }],
            consume: [{
              context: 'highlight',
              data: ['elemNo'],
              style: {
                inactive: {
                  opacity: 0.3
                }
              }
            }]
          },
          settings: {
            x: { scale: 'x' },
            y: { scale: 'y' },
            size: 0.4,
            fill: '#6de8c1'
          }
        }]
      }
    });
    chart.brush('highlight').on('update', function (added, removed) {
      if (added.length + removed.length < 1) {
        return;
      }
      var selections = picassoQ.qBrushHelper(chart.brush('highlight'));
      model[selections[0].method].apply(model, selections[0].params).then((() => {
        movieInfoFn();
      }));
    });
  }

  showDetails(layout) {
    if (!(layout.qHyperCube &&
      layout.qHyperCube.qDataPages &&
      layout.qHyperCube.qDataPages[0] &&
      layout.qHyperCube.qDataPages[0].qMatrix)
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

  hideTooltip() {
    const elements = document.getElementsByClassName('tooltip');
    if (elements[0]) {
      document.body.removeChild(elements[0]);
    }
  }

  showTooltip(text, point) {
    this.hideTooltip();
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
