window.onload=function(){

  var clockGroup, fields, formatHour, formatMinute, formatSecond, height, offSetX, offSetY, pi, render, scaleHours, scaleSecsMins, vis, width;


  var fromClock = 9;
  var toClock = 6;

  var radius = 80;
  var tickLength = 10;
  var circleDegree = 360;

  function degToRad(degrees) {
    return degrees * Math.PI / 180;
  }

  function clockToRad(clock, direction) {
    var unit = circleDegree / 12;
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

  activity_color = "orange"

  vis = d3.selectAll(".chart")
    .append("svg:svg")
    .attr("width", width)
    .attr("height", height);

  clockGroup = vis.append("svg:g")
    .attr("transform", "translate(" + offSetX + "," + offSetY + ")");

  var arc = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(clockToRad(9, 1))
      .endAngle(clockToRad(10, 1));

  var arc2 = d3.svg.arc()
      .innerRadius(0)
      .outerRadius(radius)
      .startAngle(clockToRad(10, 1))
      .endAngle(clockToRad(11, 1));

  //fill lingkaran lingkaran
  clockGroup.append('path')
    .attr('d', arc)
    .style('fill', activity_color);

  clockGroup.append('path')
    .attr('d', arc2)
    .style('fill', 'red');


  // gambar tick
  clockGroup.append('g')
    .attr('class', 'ticks')
    .selectAll('path')
    .data(splitDegrees(12))
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


};
