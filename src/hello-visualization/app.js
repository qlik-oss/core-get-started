/* eslint-disable max-len */
/* eslint-env browser */

import angular from 'angular';
import enigma from 'enigma.js';
/* import enigmaMixin from 'halyard.js/dist/halyard-enigma-mixin'; */
/* import qixSchema from 'enigma.js/schemas/3.2.json'; */
import template from './app.html';
import Scatterplot from './scatterplot';
// import Linechart from './linechart';
import 'babel-polyfill';

const schema = require('enigma.js/schemas/3.2.json');

angular.module('app', []).component('app', {
  bindings: {},
  controller: ['$scope', function Controller($scope) {
    $scope.dataSelected = false;
    $scope.showFooter = false;

    $scope.toggleFooter = () => {
      $scope.showFooter = !$scope.showFooter;
      if (!$scope.showFooter && $scope.dataSelected) {
        this.clearAllSelections();
      }
    };

    $scope.openGithub = () => {
      window.open('https://github.com/qlik-oss/core-get-started');
    };

    this.connected = false;
    this.painted = false;
    this.connecting = true;
    let app = null;
    let scatterplotObject = null;
    // const linechartObject = null;

    const select = (value) => {
      app.getField('Movie').then((field) => {
        field.select(value).then(() => {
          $scope.dataSelected = true;
          this.getMovieInfo().then(() => {
            $scope.showFooter = true;
          });
        });
      });
    };

    /* const scatterplotProperties = {
      qInfo: {
        qType: 'visualization',
        qId: '',
      },
      type: 'my-picasso-scatterplot',
      labels: true,
      qHyperCubeDef: {
        qDimensions: [{
          qDef: {
            qFieldDefs: ['Movie'],
            qSortCriterias: [{
              qSortByAscii: 1,
            }],
          },
        }],
        qMeasures: [{
          qDef: {
            qDef: '[Adjusted Costs]',
            qLabel: 'Adjusted cost ($)',
          },
          qSortBy: {
            qSortByNumeric: -1,
          },
        },
        {
          qDef: {
            qDef: '[imdbRating]',
            qLabel: 'imdb rating',
          },
        }],
        qInitialDataFetch: [{
          qTop: 0, qHeight: 50, qLeft: 0, qWidth: 3,
        }],
        qSuppressZero: false,
        qSuppressMissing: true,
      },
    };
 */
    const scatterplot = new Scatterplot();

    const paintScatterPlot = (layout) => {
      scatterplot.paintScatterplot(document.getElementById('chart-container-scatterplot'), layout, {
        select,
        clear: () => this.clearAllSelections(),
        hasSelected: $scope.dataSelected,
      });
      this.painted = true;
    };

    /* const linechartProperties = {
      qInfo: {
        qType: 'visualization',
        qId: '',
      },
      type: 'my-picasso-linechart',
      labels: true,
      qHyperCubeDef: {
        qDimensions: [{
          qDef: {
            qFieldDefs: ['Year'],
            qSortCriterias: [{
              qSortByAscii: 1,
            }],
          },
        }],
        qMeasures: [{
          qDef: {
            qDef: 'Sum([Adjusted Costs])',
            qLabel: 'Adjusted Costs in total ($)',
          },
          qSortBy: {
            qSortByNumeric: -1,
          },
        },
        ],
        qInitialDataFetch: [{
          qTop: 0, qHeight: 50, qLeft: 0, qWidth: 3,
        }],
        qSuppressZero: false,
        qSuppressMissing: false,
      },
    };
 */
    /*  const linechart = new Linechart();

    const paintLineChart = (layout) => {
      linechart.paintLinechart(document.getElementById('chart-container-linechart'), layout);
      this.painted = true;
    }; */

    this.generateGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // eslint-disable-next-line no-bitwise
      const r = Math.random() * 16 | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });

    this.$onInit = () => {
      // Add local data
      /*
      const filePathMovie = '/data/movies.csv';
      const tableMovie = new Halyard.Table(filePathMovie, {
        name: 'Movies',
        fields: [
          { src: 'Movie', name: 'Movie' },
          { src: 'Year', name: 'Year' },
          { src: 'Adjusted Costs', name: 'Adjusted Costs' },
          { src: 'Description', name: 'Description' },
          { src: 'Image', name: 'Image' },
        ],
        delimiter: ',',
      });
      halyard.addTable(tableMovie);
      */

      // Add web data
      (async () => {
        try {
          /*
        const data = await $http.get('https://gist.githubusercontent.com/carlioth/b86ede12e75b5756c9f34c0d65a22bb3/raw/e733b74c7c1c5494669b36893a31de5427b7b4fc/MovieInfo.csv');
        const table = new Halyard.Table(data.data, { name: 'MoviesInfo', delimiter: ';', characterSet: 'utf8' });
        halyard.addTable(table);

       const qix = await enigma.create(config).open(); // läg till try cath
        this.connected = true;
        this.connecting = false;
        const result = await qix.createSessionAppUsingHalyard(halyard); // lägg till try t
        app = result;
        await result.getAppLayout();
        scatterplotObject = await result.createSessionObject(scatterplotProperties); */
          const session = enigma.create({
            schema,
            url: 'ws://localhost:19076/app/testscript',
            createSocket: url => new WebSocket(url),
          });
          const qix = await session.open();
          const result = await qix.openDoc('testscript.qvf');
          app = result;
          await result.getAppLayout();
          console.log();
          scatterplotObject = await result.getObject('scatterplot');
          console.log(scatterplot);
          const updateScatterPlot = (async () => {
            const layout = await scatterplotObject.getLayout();
            paintScatterPlot(layout);
          });

          scatterplotObject.on('changed', updateScatterPlot);
          updateScatterPlot();


        /* linechartObject = await result.createSessionObject(linechartProperties);
        const linechartUpdate = (async () => {
          const layout = await linechartObject.getLayout();
          paintLineChart(layout);
        });

        linechartObject.on('changed', linechartUpdate);
        linechartUpdate(); */
        } catch (err) {
          alert(err); // TypeError: failed to fetch
        }
      })();
    };

    this.clearAllSelections = () => {
      if ($scope.dataSelected) {
        $scope.dataSelected = false;
        app.clearAll();
      }
      $scope.showFooter = false;
    };

    this.getMovieInfo = () => {
      const tableProperties = {
        qInfo: {
          qType: 'visualization',
          qId: '',
        },
        type: 'my-info-table',
        labels: true,
        qHyperCubeDef: {
          qDimensions: [{
            qDef: {
              qFieldDefs: ['Movie'],
            },
          },
          {
            qDef: {
              qFieldDefs: ['Image'],
            },
          },
          {
            qDef: {
              qFieldDefs: ['Year'],
            },
          },
          {
            qDef: {
              qFieldDefs: ['Genre'],
            },
          },
          {
            qDef: {
              qFieldDefs: ['Description'],
            },
          },
          ],
          qInitialDataFetch: [{
            qTop: 0, qHeight: 50, qLeft: 0, qWidth: 50,
          }],
          qSuppressZero: false,
          qSuppressMissing: true,
        },
      };
      return app.createSessionObject(tableProperties)
        .then(model => model.getLayout()
          .then((layout) => {
            Scatterplot.showDetails(layout);
          }));
    };
  }],
  template,
});

angular.bootstrap(document, ['app']);
