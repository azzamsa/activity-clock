var clockGroup, fields, formatHour, formatMinute, formatSecond, height, offSetX, offSetY, pi, render, scaleHours, scaleSecsMins, vis, width;

var clockRadius = 180; // clock SVG Size #editable
var tickLength = 13;
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


// !(use `clockRadius + n` so we only change the value in `clockRadius`)
width = clockRadius + 290; // clock svg width #editable
height = clockRadius + 280; // clock svg height #editable
offSetX = clockRadius + 50; // clock svg offset location #editable
offSetY = clockRadius + 70; // clock svg offset location #editable
pi = Math.PI;

vis = d3.selectAll(".chart")
  .append("svg:svg")
  .attr("width", width)
  .attr("height", height);

clockGroup = vis.append("svg:g")
  .attr("transform", "translate(" + offSetX + "," + offSetY + ")");

// # activities section #editable
var activities = [
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

var svg_cy = 50; // legend y position

for(var i = 0; i < activities.length; i++) {
  var activity = activities[i];

  var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(clockRadius)
      .startAngle(clockToRad(activity[0], activity[1]))
      .endAngle(clockToRad(activity[2], activity[3]));

  // fill clock
  clockGroup.append('path')
    .attr('d', arc)
    .style('fill', activity[4]);

  svg_cy = svg_cy + 30;

  legend.append("circle")
    .attr("cx",20)
    .attr("cy",svg_cy) // inc
    .attr("r", 10) // circle size
    .style("fill", activity[4]);

  legend.append("text")
    .attr("x", 45)
    .attr("y", svg_cy + 5) //
    .text(activity[5] + " (" + activity[0] + "⤳" + activity[2] + ") " )
    .style("font-size", "20px")
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
      outer: getCoordFromCircle(d, 0, 0, clockRadius),
      inner: getCoordFromCircle(d, 0, 0, clockRadius - tickLength)
    };
    return 'M' + coord.outer[0] + ' ' + coord.outer[1] + 'L' + coord.inner[0] + ' ' + coord.inner[1] + 'Z';
  })
  .attr('stroke-width', '0.5%')
  .attr('stroke', '#212121');


hourLabelRadius = clockRadius + 20;
hourLabelYOffset = 7;
radians = 0.0174532925;
hourScaleDomain = 22; // 11: for 12 hour / 22: for 24 hour #editable
hourLabelRange = 24; // 12 / 24 #editable

var hourScale = d3.scale.linear()
    .range([0,330])
    .domain([0,hourScaleDomain]);

// create hour label
clockGroup.selectAll('.hour-label')
   // start, max, inc
  .data(d3.range(1, hourLabelRange + 1))
  .enter()
  .append('text')
  .attr('class', 'hour-label')
  .attr('text-anchor','middle')
  .attr('x',function(d){
    return hourLabelRadius*Math.sin(hourScale(d)*radians);
  })
  .attr('y',function(d){
    return -hourLabelRadius*Math.cos(hourScale(d)*radians) + hourLabelYOffset;
  })
  .text(function(d){
    return d;
  });
