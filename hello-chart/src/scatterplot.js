/* eslint-env browser*/
/* eslint import/extensions:0 */

import * as d3 from 'd3';

export default class Scatterplot {

  constructor() {
    this.axisPainted = false;
  }

  paintScatterplot(element, layout, select) {
    if (!(layout.qHyperCube &&
      layout.qHyperCube.qDataPages &&
      layout.qHyperCube.qDataPages[0] &&
      layout.qHyperCube.qDataPages[0].qMatrix)
    ) {
      return;
    }

    const data = layout.qHyperCube.qDataPages[0].qMatrix.map(item => ({
      movie: item[0].qText,
      cost: item[1].qNum,
      rating: item[2].qNum,
    }));

    const measureLabels = layout.qHyperCube.qMeasureInfo.map(item =>
      item.qFallbackTitle,
    );

    const width = element.offsetWidth;
    const height = element.offsetHeight;

    const padding = 20;
    const formatValue = d3.format('.2s');

    const chart = d3.select(element.querySelector('svg'));
    chart.attr('width', width);
    chart.attr('height', height);
    chart.selectAll('.dot').remove();

    if (!this.axisPainted) {
      const xScale = d3.scaleLinear();
      xScale.range([padding, width - (padding * 2)]);
      xScale.domain([4, 10]);

      const xAxis = d3.axisBottom(xScale);

      const yScale = d3.scaleLinear();
      yScale.range([height - padding, 0]);
      yScale.domain([d3.min(data, d => d.cost - 5000000), d3.max(data, d => d.cost) + 5000000]);

      const yAxis = d3.axisRight(yScale);
      yAxis.tickFormat(d => formatValue(d));

      // x-axis
      chart.append('g')
        .attr('class', 'x axis')
        .attr('transform', `translate(0,${height - padding})`)
        .call(xAxis)
        .append('text')
        .attr('class', 'label')
        .attr('x', width - (padding * 2))
        .attr('y', -6)
        .text(measureLabels[1]);

      // y-axis
      chart.append('g')
        .attr('class', 'y axis')
        .attr('transform', `translate(${padding}, 0)`)
        .call(yAxis)
        .append('text')
        .attr('class', 'label')
        .attr('transform', 'rotate(-90)')
        .attr('y', 0)
        .attr('dy', '-.71em')
        .text(measureLabels[0]);

      this.axisPainted = true;

      const xValue = d => d.rating;
      this.xMap = d => xScale(xValue(d));
      const yValue = d => d.cost;
      this.yMap = d => yScale(yValue(d));
    }
    chart.selectAll('.dot')
      .data(data)
      .enter().append('circle')
      .attr('class', 'dot')
      .attr('r', 5)
      .attr('cx', this.xMap)
      .attr('cy', this.yMap)
      .on('mouseover', (d) => {
        const event = d3.event;
        const text = d.movie;
        const point = {
          y: event.pageY - 28,
          x: event.pageX + 5,
        };
        this.showTooltip(text, point);
      })
      .on('mouseout', this.hideTooltip)
      .on('click', (d) => {
        this.hideTooltip();
        d3.event.stopPropagation();
        select(d.movie);
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
