/* eslint-env browser */

import angular from 'angular';
import enigma from 'enigma.js';
import enigmaMixin from 'halyard.js/dist/halyard-enigma-mixin';
import qixSchema from 'enigma.js/schemas/3.2.json';
import template from './app.html';
import Scatterplot from './scatterplot';
import Linechart from './linechart';
import 'babel-polyfill';

angular.module('app', []).component('app', {
  bindings: {},
  controller: ['$scope', '$q', function Controller($scope, $q) {
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
    let linechartObject = null;

    const select = async (value) => {
      const field = await app.getField('Movie');
      field.select(value);
      $scope.dataSelected = true;
      const layout = await this.getMovieInfo();
      Scatterplot.showDetails(layout);
      $scope.showFooter = true;
      $scope.$digest();
    };

    const scatterplot = new Scatterplot();
    const paintScatterPlot = (layout) => {
      scatterplot.paintScatterplot(document.getElementById('chart-container-scatterplot'), layout, {
        select,
        clear: () => this.clearAllSelections(),
        hasSelected: $scope.dataSelected,
      });
      this.painted = true;
    };


    const linechart = new Linechart();

    const paintLineChart = (layout) => {
      linechart.paintLinechart(document.getElementById('chart-container-linechart'), layout);
      this.painted = true;
    };

    this.generateGUID = () => 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
      // eslint-disable-next-line no-bitwise
      const r = Math.random() * 16 | 0;
      // eslint-disable-next-line no-bitwise
      const v = c === 'x' ? r : ((r & 0x3) | 0x8);
      return v.toString(16);
    });

    this.$onInit = () => {
      const config = {
        Promise: $q,
        schema: qixSchema,
        mixins: enigmaMixin,
        url: `ws://${window.location.hostname}:19076/app/${this.generateGUID()}`,
      };


      // Add web data
      (async () => {
        let qix;
        try {
          qix = await enigma.create(config).open();
          this.connected = true;
          this.connecting = false;
        } catch (error) {
          this.error = 'Could not connect to QIX Engine';
          this.connecting = false;
        }
        this.connected = true;
        this.connecting = false;
        try {
          app = await qix.openDoc('testscript.qvf');
        } catch (error) {
          this.error = 'Could not create session app';
          this.connected = false;
          this.connecting = false;
        }

        scatterplotObject = await app.getObject('scatterPlot');
        const updateScatterPlot = (async () => {
          const layout = await scatterplotObject.getLayout();
          paintScatterPlot(layout);
        });

        scatterplotObject.on('changed', updateScatterPlot);
        updateScatterPlot();

        linechartObject = await app.getObject('lineChart');
        const linechartUpdate = (async () => {
          const layout = await linechartObject.getLayout();
          paintLineChart(layout);
        });

        linechartObject.on('changed', linechartUpdate);
        linechartUpdate();
      })();
    };

    this.clearAllSelections = () => {
      if ($scope.dataSelected) {
        $scope.dataSelected = false;
        app.clearAll();
      }
      $scope.showFooter = false;
    };

    this.getMovieInfo = async () => {
      const model = await app.getObject('tableProperties');
      return model.getLayout();
    };
  }],
  template,
});

angular.bootstrap(document, ['app']);
