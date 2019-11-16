var clockGroup, fields, formatHour, formatMinute, formatSecond, height, offSetX, offSetY, pi, render, scaleHours, scaleSecsMins, vis, width;

var radius = 80;
var tickLength = 10;
var circleDegree = 360;

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function clockToRad(clock, direction) {
  var unit = circleDegree / 24;
  var degree = direction > 0 ? unit * clock : unit * clock - circleDegree;
  return degToRad(degree);
}

function getCoordFromCircle(deg, cx, cy, r) {
  var rad = degToRad(deg);
  var x = cx + r * Math.cos(rad);
  var y = cy + r * Math.sin(rad);
  return [x, y];
}

function splitDegrees(num) {
  var angle = circleDegree / num;
  var degrees = [];

  for (var ang = 0; ang < circleDegree; ang += angle) {
    degrees.push(ang);
  }

  return degrees;
}


width = 400;
height = 200;
offSetX = 100;
offSetY = 100;
pi = Math.PI;

vis = d3.selectAll(".chart")
  .append("svg:svg")
  .attr("width", width)
  .attr("height", height);

clockGroup = vis.append("svg:g")
  .attr("transform", "translate(" + offSetX + "," + offSetY + ")");

var cubes = [
  // start, inverse flag, end, inverse flag, color
  [22, -1, 4, 1, '#deb881', 'tidur malam'],
  [4, 1, 5, 1, '#42dee1', 'subuhan'],
  [5, 1, 6, 1, '#ffad87', 'olahraga / cuci'],
  [6, 1, 7, 1, '#eef5b2', 'mandi & makan'],
  [7, 1, 12, 1, '#6decb9', 'kerja'],
  [12, 1, 13, 1, '#42dee1', 'dzuhuran'],
  [13, 1, 16, 1, '#6decb9', 'kerja'],
  [16, 1, 17, 1, '#eef5b2', 'pulang kerja'],
  [17, 1, 18.20, 1, '#42dee1', 'maghriban'],
  [18.20, 1, 19, 1, '#eef5b2', 'mandi & makan'],
  [19, 1, 19.20, 1, '#42dee1', 'isyaan'],
  [19.20, 1, 21, 1, '#9852f9', 'belajar'],
  [21, 1, 22, 1, '#71a95a', 'family time'],
];

var legend = d3.select("#legend");
var svg_cy = 30;

for(var i = 0; i < cubes.length; i++) {
  var cube = cubes[i];

  var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(clockToRad(cube[0], cube[1]))
      .endAngle(clockToRad(cube[2], cube[3]));

  // fill clock
  clockGroup.append('path')
    .attr('d', arc)
    .style('fill', cube[4]);

  svg_cy = svg_cy + 30;

  legend.append("circle")
    .attr("cx",200)
    .attr("cy",svg_cy) // inc
    .attr("r", 6)
    .style("fill", cube[4]);

  legend.append("text")
    .attr("x", 220)
    .attr("y", svg_cy) //
    .text(cube[5] + " (" + cube[0] + "⤳" + cube[2] + ") " )
    .style("font-size", "15px")
    .attr("alignment-baseline","middle");
}

// draw tick
clockGroup.append('g')
  .attr('class', 'ticks')
  .selectAll('path')
  .data(splitDegrees(24))
  .enter()
  .append('path')
  .attr('d', function(d) {
    var coord = {
      outer: getCoordFromCircle(d, 0, 0, radius),
      inner: getCoordFromCircle(d, 0, 0, radius - tickLength)
    };
    return 'M' + coord.outer[0] + ' ' + coord.outer[1] + 'L' + coord.inner[0] + ' ' + coord.inner[1] + 'Z';
  })
  .attr('stroke', '#212121');


// credits
// https://www.d3-graph-gallery.com/graph/custom_legend.html
// https://stackoverflow.com/questions/38155793/d3-js-pie-chart-clock
// https://colorhunt.co/palette/156488

// TODO
// 1) tick label
