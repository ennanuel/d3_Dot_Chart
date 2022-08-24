const body = d3.select('#graph');

const title = body
  .append('div')
  .attr('id', 'title');

const tooltip = body
  .append('div')
  .attr('id', 'tooltip')

title
  .append('h1')
  .text('Doping In Professional Bicycle Racing');

title
  .append('p')
  .text('35 fastest times by Alpe d\'Heuz');

const w = 800;
const h = 400;

const svg = body
   .append('div')
   .attr('id', 'svg')
   .append('svg')
   .attr('width', w + 100)
   .attr('height', h + 100);

svg
  .append('text')
  .attr('id', 'text')
  .attr('transform', 'rotate(-90)')
  .attr('y', 18)
  .attr('x', -200)
  .text('Time in Minutes')

const url = 'https://raw.githubusercontent.com/FreeCodeCamp/ProjectReferenceData/master/cyclist-data.json';


d3.json(url)
  .then(data => {
  
    const years = data.map(elem => elem.Year + '-01');
    const dates = years.map(elem => new Date(elem))
    
    let maxYr = new Date('2018-01');
    let minYr = new Date('1992-01')
  
    const xScale = d3.scaleTime()
        .domain([minYr, maxYr])
        .range([0, w]);
  
    const xAxis = d3.axisBottom().scale(xScale);
  
    svg
      .append('g')
      .call(xAxis)
      .attr('id', 'x-axis')
      .style('transform', 'translate(60px, 410px)')
  
    const time = data.map(elem => elem.Time.split(':'))
    const newTime = time.map( elem => new Date(1970, 0, 1, 0, elem[0], elem[1]) );
  
    const maxTime = d3.max(newTime);
    maxTime.setSeconds(maxTime.getSeconds() + 9);
    
    const yScale = d3.scaleTime()
        .domain([d3.min(newTime), maxTime])
        .range([h, 0]);
  
    const yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));
    
    svg
      .append('g')
      .call(yAxis)
      .attr('id', 'y-axis')
      .style('transform', 'translate(60px, 10px)')
  
    svg
      .selectAll('.dot')
      .data(data)
      .enter()
      .append('circle')
      .attr('class', 'dot')
      .attr('r', 6)
      .style('transform', 'translate(60px, 10px)')
      .attr('cx', (d, i) => xScale(dates[i]) )
      .attr('cy', (d, i) => yScale(newTime[i]))
      .attr('data-name', (d, i) => data[i].Name)
      .attr('data-country', (d, i) => data[i].Nationality)
      .attr('data-year', (d, i) => data[i].Year)
      .attr('data-time', (d, i) => data[i].Time)
      .attr('data-clean', (d, i) => data[i].Doping)
      .attr('fill', d => d.Doping.length > 0? '#0066cc': 'orange')
      .on('mouseenter', e => {
        const dta = e.target.dataset;
        const cx = +e.target.getAttribute('cx'),
              cy = +e.target.getAttribute('cy');
        let clean = dta.clean.length > 0?
          '<br><br>' +dta.clean: ''
      
        tooltip
          .style('left', 300 + cx + 'px')
          .style('top', (70 + cy) + 'px')
      
        tooltip
            .transition()
            .duration(300)
            .style('opacity', 0.8);
        
        tooltip
            .html(
          dta.name +': '
          +dta.country +'<br>'
          +'Year: ' +dta.year
          +', Time: ' +dta.time
          +clean
        )
    })
    .on('mouseleave', () => {
      tooltip
        .transition()
        .duration(300)
        .style('opacity', 0)
        .end()
        .then( () => {
        tooltip
          .style('top', '-1000px')
      })
    })
  
  
})
