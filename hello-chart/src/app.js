/* eslint-env browser*/
/* eslint import/no-unresolved:0, import/extensions:0 */
/* eslint no-bitwise:0 */

import Halyard from 'halyard.js';
import angular from 'angular';
import enigma from 'enigma.js';
import enigmaMixin from 'halyard.js/dist/halyard-enigma-mixin';
import qixSchema from 'json!../node_modules/enigma.js/schemas/qix/3.2/schema.json';
import template from 'raw!./app.html';
import Scatterplot from './scatterplot';

const halyard = new Halyard();

angular.module('app', []).component('app', {
  bindings: {},
  controller: ['$scope', '$q', '$http', function Controller($scope, $q, $http) {
    $scope.dataSelected = false;
    $scope.showInfo = false;

    $scope.toggleFooter = () => {
      if ($scope.dataSelected) {
        this.clearAllSelections();
      } else {
        $scope.dataSelected = true;
      }
    };

    $scope.openGithub = () => {
      window.open('https://github.com/qlik-ea/qlik-elastic-tutorial');
    };

    this.connected = false;
    this.painted = false;
    this.connecting = true;

    let object = null;
    let app = null;

    const select = (value) => {
      app.getField('Movie').then((field) => {
        field.select(value).then(() => {
          this.getMovieInfo();
        });
      });
    };

    const scatterplot = new Scatterplot(select);

    const paintChart = (layout) => {
      scatterplot.paintScatterplot(document.getElementById('chart-container'), layout, select);
      this.painted = true;
    };

    this.generateGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      const r = Math.random() * 16 | 0;
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });

    this.$onInit = () => {
      const config = {
        Promise: $q,
        schema: qixSchema,
        mixins: enigmaMixin,
        session: {
          port: '9076',
          secure: false,
          identity: this.generateGUID(),
        },
      };

      // Add local data
      const filePathMovie = '/data/movies.csv';
      const tableMovie = new Halyard.Table(filePathMovie, {
        name: 'Movies',
        fields: [{ src: 'Movie', name: 'Movie' }, { src: 'Year', name: 'Year' },
        { src: 'Adjusted Costs', name: 'Adjusted Costs' }, { src: 'Description', name: 'Description' }, { src: 'Image', name: 'Image' }],
        delimiter: ',',
      });
      halyard.addTable(tableMovie);

      // Add web data
      $http.get('https://gist.githubusercontent.com/carlioth/b86ede12e75b5756c9f34c0d65a22bb3/raw/e733b74c7c1c5494669b36893a31de5427b7b4fc/MovieInfo.csv')
        .then((data) => {
          const table = new Halyard.Table(data.data, { name: 'MoviesInfo', delimiter: ';', characterSet: 'utf8' });
          halyard.addTable(table);
        })
        .then(() => {
          enigma.getService('qix', config).then((qix) => {
            this.connected = true;
            this.connecting = false;
            qix.global.createSessionAppUsingHalyard(halyard).then((result) => {
              app = result;
              result.getAppLayout()
                .then(() => {
                  const scatterplotProperties = {
                    qInfo: {
                      qType: 'visualization',
                      qId: '',
                    },
                    type: 'my-d3-scatterplot',
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
                      qInitialDataFetch: [{ qTop: 0, qHeight: 50, qLeft: 0, qWidth: 3 }],
                      qSuppressZero: false,
                      qSuppressMissing: true,
                    },
                  };
                  result.createSessionObject(scatterplotProperties).then((model) => {
                    object = model;

                    const update = () => object.getLayout().then((layout) => {
                      paintChart(layout);
                    });

                    object.on('changed', update);
                    update();
                  });
                });
            }, () => {
              this.error = 'Could not create session app';
              this.connected = false;
              this.connecting = false;
            });
          }, () => {
            this.error = 'Could not connect to QIX Engine';
            this.connecting = false;
          });
        });
    };

    this.clearAllSelections = () => {
      if ($scope.dataSelected) {
        $scope.showInfo = false;
        $scope.dataSelected = false;
        app.clearAll();
      }
    };

    this.getMovieInfo = () => {
      const tableProperties = {
        qInfo: {
          qType: 'visualization',
          qId: '',
        },
        type: 'my-d3-table',
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
          qInitialDataFetch: [{ qTop: 0, qHeight: 50, qLeft: 0, qWidth: 50 }],
          qSuppressZero: false,
          qSuppressMissing: true,
        },
      };
      app.createSessionObject(tableProperties).then((model) => {
        model.getLayout().then((layout) => {
          if ($scope.dataSelected) {
            this.clearAllSelections();
          } else {
            $scope.dataSelected = true;
            $scope.showInfo = true;
            scatterplot.showDetails(layout);
          }
        });
      });
    };
  }],
  template,
});

angular.bootstrap(document, ['app']);
