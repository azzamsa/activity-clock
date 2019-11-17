var clockGroup, fields, formatHour, formatMinute, formatSecond, height, offSetX, offSetY, pi, render, scaleHours, scaleSecsMins, vis, width;

var clockRadius = 180; // clock SVG Size #editable
var tickLength = 13;
var circleDegree = 360;

function degToRad(degrees) {
  return degrees * Math.PI / 180;
}

function clockToRad(clock, direction, timeMode) {
  var unit = circleDegree / timeMode;
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


var colors = ['#36b5b0', '#9dd8c8', '#f09595', '#fcf5b0', '#f4efd3', '#cccccc', '#9656a1',
              '#ff9d76', '#51eaea', '#c3f0ca', '#ffc0ad', '#6decb9', '#ffad87', '#e3b04b',
              '#f1d6ab', '#df42d1', '#eadea6', '#494ca2', '#c6cbef', '#f66767', '#c0ffb3'];


var usedColors = [];

function generateRandomColor() {
  var randomNum = Math.floor(Math.random() * 20);
  var randomColor = colors[randomNum];

  if (usedColors.includes( randomColor ) ) {
    if (usedColors.length == colors.length) {
      usedColors = []; // clear all used colors
    } else {
      return generateRandomColor();
    }
    console.log('same!');
  }
  usedColors.push(randomColor);
  return randomColor;
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


var legend = d3.select("#legend");
var svg_cy = 50; // legend y position

function makeClock(activities, timeMode) {

  timeMode = parseInt(timeMode);

  for(var i = 0; i < activities.length; i++) {

    var activity = activities[i];

    var startTime = parseInt(activity[0].value);
    var endTime = parseInt(activity[1].value);
    var activityName = activity[2].value;
    var colorTime = activity[3].value;
    var startTimeFlag = 1;
    var endTimeFlag = 1;

    if (colorTime == ""){
      colorTime = generateRandomColor();
    }

    if (startTime > endTime){
      startTimeFlag = -1;
    }

    var arc = d3.svg.arc()
        .innerRadius(0)
        .outerRadius(clockRadius)
        .startAngle(clockToRad(startTime, startTimeFlag, timeMode))
        .endAngle(clockToRad(endTime, endTimeFlag, timeMode));

    // fill clock
    clockGroup.append('path')
      .attr('d', arc)
      .style('fill', colorTime);

    svg_cy = svg_cy + 30;

    legend.append("circle")
      .attr("cx",20)
      .attr("cy",svg_cy) // inc
      .attr("r", 10) // circle size
      .style("fill", colorTime);

    legend.append("text")
      .attr("x", 45)
      .attr("y", svg_cy + 5) //
      .text(activityName + " (" + startTime + "➜" + endTime + ") " )
      .style("font-size", "20px")
      .attr("alignment-baseline","middle");
  }
  drawClock(timeMode);
}

function drawClock(timeMode){

  // draw tick
  clockGroup.append('g')
    .attr('class', 'ticks')
    .selectAll('path')
    .data(splitDegrees(timeMode))
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
  hourLabelRange = timeMode; // 12 / 24 #editable

  if (timeMode == 24){
    hourScaleDomain = 22;
  } else {
    hourScaleDomain = 11;
  }

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

}
