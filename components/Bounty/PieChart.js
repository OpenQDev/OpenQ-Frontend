import React, { useEffect } from 'react';
import * as d3 from 'd3';

const PieChart = ({ payoutSchedule }) => {
  const drawChart = () => {
    const data = payoutSchedule.map((e) => parseInt(e));
    const margin = { top: 36, right: 30, bottom: 30, left: 30 };
    const width = 280 - margin.left - margin.right;
    const height = 280 - margin.top - margin.bottom;
    const color = d3
      .scaleOrdinal()
      .domain(data.map((d) => d))
      .range(
        data.map((_, i) => {
          const saturation = i % 2 ? 84 - i : 84 - i + 1;
          const lightness = !(i % 2) ? 48 + i : 48 + i - 1;
          const hue = 400 - i * 67;
          return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
        })
      );
    d3.select('#pie-container>svg').remove();
    const svg = d3
      .select('#pie-container')
      .append('svg')
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom)
      .append('g')
      .attr('transform', 'translate(' + width / 2 + ',' + height / 2 + ')');
    const pie = d3
      .pie()
      .sort(null)
      .value((d) => d);
    const arc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(Math.min(width, height) / 2 - 1)
      .cornerRadius(0);
    const arcs = pie(data);

    const arcLabel = function () {
      const radius = (Math.min(width, height) / 2) * 0.7;
      return d3.arc().innerRadius(radius).outerRadius(radius);
    };
    svg
      .append('g')
      .attr('stroke', 'white')
      .selectAll('path')
      .data(arcs)
      .enter()
      .append('path')
      .attr('fill', (d) => color(d))
      .attr('d', arc)
      .append('title')
      .text((d) => `${d}%`);

    svg
      .append('g')
      .attr('font-size', 12)
      .attr('text-anchor', 'middle')
      .selectAll('text')
      .data(arcs)
      .enter()
      .append('text')
      .attr('transform', (d) => {
        return `translate(${arcLabel().centroid(d)})`;
      })
      .call((text) =>
        text
          .append('tspan')
          .attr('y', '-0.4em')
          .attr('font-weight', 'bold')
          .text((_, index) => `Tier ${index + 1}`)
          .call((text) =>
            text
              .append('tspan')
              .attr('x', 0)
              .attr('y', '0.7em')
              .attr('fill-opacity', 0.7)
              .text((d) => {
                return d.data.toString().concat('%');
              })
          )
      );
  };

  useEffect(() => {
    drawChart();
  }, [payoutSchedule]);

  return (
    <li className='border-web-gray border-b py-3'>
      <div id='pie-container'></div>
    </li>
  );
};

export default PieChart;
