/**
 * Created with IntelliJ IDEA.
 * User: myyong
 * Date: 19/12/2014
 * Time: 21:29
 * To change this template use File | Settings | File Templates.
 */

var timelineModule = angular.module('Optimise.timeline',[]);


timelineModule.directive('timelineEntry', function() {
    return {
        restrict: 'AE',
        replace: 'true',
        controller: 'timelineCtrl',
        templateUrl:'scripts/js/timeline/timeline.html'
    };
});


timelineModule.directive('timeline', function() {
    function display($scope, element) {

        d3.selectAll('svg').remove();

        var data = $scope.randomData
            , lanes = data.lanes
            , items = data.items
            , now = new Date();

        var d = document,
            e = d.documentElement,
            g = d3.select(element[0]),
            windowX = e.clientWidth || g.clientWidth,
            windowY = e.clientHeight|| g.clientHeight;

        var margin = {top: 30, right: 50, bottom: 10, left: 140}
            , width = (0.8*windowX) - margin.left - margin.right
            , height = (0.8*windowY) - margin.top - margin.bottom
            , miniHeight = lanes.length * 12 + 50
            , mainHeight = height - miniHeight - 150;

        var chart = d3.select(element[0]).append('svg:svg')
            .attr('width', width + margin.right + margin.left)
            .attr('height', height + margin.top + margin.bottom)
            .attr('class', 'chart');


        var x = d3.time.scale()
            .domain([d3.time.week(d3.min(items, function(d) { return d.start; })),
                d3.max(items, function(d) { return d.end; })])
            .range([0, width]);
        var x1 = d3.time.scale().range([0, width]);
        var x2 = d3.time.scale()
            .domain([d3.time.week(d3.min(items, function(d) { return d.start; })),
                d3.max(items, function(d) { return d.end; })])
            .range([0, width]);

        var ext = d3.extent(lanes, function(d) { return d.id; });
        var y1 = d3.scale.linear().domain([ext[0], ext[1] + 1]).range([0, mainHeight]);
        var y2 = d3.scale.linear().domain([ext[0], ext[1] + 1]).range([0, miniHeight]);

        chart.append('defs').append('clipPath')
            .attr('id', 'clip')
            .append('rect')
            .attr('width', width)
            .attr('height', mainHeight);

        var main = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', width)
            .attr('height', mainHeight)
            .attr('class', 'main');

        var mini = chart.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (mainHeight + 60) + ')')
            .attr('width', width)
            .attr('height', miniHeight)
            .attr('class', 'mini');

        // draw the lanes for the main chart
        main.append('g').selectAll('.laneLines')
            .data(lanes)
            .enter().append('line')
            .attr('x1', 0)
            .attr('y1', function(d) { return d3.round(y1(d.id)) + 0.5; })
            .attr('x2', width)
            .attr('y2', function(d) { return d3.round(y1(d.id)) + 0.5; })
            .attr('stroke', function(d) { return d.label == '' ? 'red' : 'lightgray'; });

        main.append('g').selectAll('.laneLegends')
            .data(lanes)
            .enter().append('rect')
            .attr('x', -130 )
            .attr('y', function(d) { return y1(d.id +.5); })
            .attr('width',10)
            .attr('height',10)
            .attr('fill', function(d) {

                switch (d.label){
                case 'Treatments':
                    return d3.rgb(31,128,50);
                case 'Visits':
                    return d3.rgb(31,76,76);
                case 'Relapses':
                    return d3.rgb(140,0,0);
                case ('EP'):
                    return d3.rgb(79,132,190);
                case ('Lab'):
                    return d3.rgb(79,132,190);
                case ('Serology'):
                    return d3.rgb(79,132,190);
                case ('MRI'):
                    return d3.rgb(79,132,190);
                case ('CSF'):
                    return d3.rgb(79,132,190);
                case 'EDSS':
                    return d3.rgb(10,29,98);
                case 'MSQOL':
                    return d3.rgb(10,29,98);
                default:
                    return 'grey';
                }
            })
            .attr('class', 'laneLegend');

        main.append('g').selectAll('.laneText')
            .data(lanes)
            .enter().append('text')
            .text(function(d) { return d.label; })
            .style('fill', function(d) {
                switch (d.label){
                case 'Treatments':
                    return d3.rgb(31,128,50);
                case 'Visits':
                    return d3.rgb(31,76,76);
                case 'Relapses':
                    return d3.rgb(140,0,0);
                case ('EP'):
                    return d3.rgb(79,132,190);
                case ('Lab'):
                    return d3.rgb(79,132,190);
                case ('Serology'):
                    return d3.rgb(79,132,190);
                case ('MRI'):
                    return d3.rgb(79,132,190);
                case ('CSF'):
                    return d3.rgb(79,132,190);
                case 'EDSS':
                    return d3.rgb(10,29,98);
                case 'MSQOL':
                    return d3.rgb(10,29,98);
                default:
                    return 'grey';
                }
            })
            .attr('x', -110)
            .attr('y', function(d) { return y1(d.id + .5); })
            .attr('dy', '1.5ex')
            .attr('text-anchor', 'start')
            .style('font-weight', function (){
                return 'normal';
            })
            .style('font-size', function (){
                return '100%';
            })
            .attr('class', 'laneText');


        // draw the lanes for the mini chart
        mini.append('g').selectAll('.laneLines')
            .data(lanes)
            .enter().append('line')
            .attr('x1', 0)
            .attr('y1', function(d) { return d3.round(y2(d.id)) + 0.5; })
            .attr('x2', width)
            .attr('y2', function(d) { return d3.round(y2(d.id)) + 0.5; })
            .attr('stroke', function(d) { return d.label === '' ? 'white' : 'lightgray'; });

        mini.append('g').selectAll('.laneLegends')
            .data(lanes)
            .enter().append('rect')
            .attr('x', -130 )
            .attr('y', function(d) { return y2(d.id +.25); })
            .attr('width',5)
            .attr('height',5)
            .attr('fill', function(d) {
                switch (d.label){
                case 'Treatments':
                    return d3.rgb(31,128,50);
                case 'Visits':
                    return d3.rgb(31,76,76);
                case 'Relapses':
                    return d3.rgb(140,0,0);
                case ('EP'):
                    return d3.rgb(79,132,190);
                case ('Lab'):
                    return d3.rgb(79,132,190);
                case ('MRI'):
                    return d3.rgb(79,132,190);
                case ('CSF'):
                    return d3.rgb(79,132,190);
                case 'EDSS':
                    return d3.rgb(10,29,98);
                case 'MSQOL':
                    return d3.rgb(10,29,98);
                default:
                    return 'grey';
                }
            })
            .attr('class', 'laneLegend');

        mini.append('g').selectAll('.laneText')
            .data(lanes)
            .enter().append('text')
            .text(function(d) { return d.label; })
            .attr('x', -110)
            .attr('y', function(d) { return y2(d.id + .5); })
            .attr('dy', '.5ex')
            .attr('text-anchor', 'start')
            .attr('class', 'laneText');

        // draw the x axis
        var xDateAxis = d3.svg.axis()
            .scale(x)
            .orient('bottom')
            //.ticks(d3.time.monday, (x.domain()[1] - x.domain()[0]) > 15552e6 ? 7 : 1)
            .ticks(d3.time.years, 1)
            .tickFormat(d3.time.format('%Y'))
            .tickSize(6, 0, 0);

        var x1DateAxis = d3.svg.axis()
            .scale(x1)
            .orient('bottom')
            .ticks(d3.time.days, 1)
        //            .tickFormat(d3.time.format('%a %d'))
            .tickFormat('')
            .tickSize(1, 0, 0);

        var xMonthAxis = d3.svg.axis()
            .scale(x)
            .orient('top')
            //.ticks(d3.time.months, (x.domain()[1] - x.domain()[0]) > 15552e6 ? 3 : 1)
            .ticks(d3.time.months, 3)
            .tickFormat(d3.time.format('%b'))
            .tickSize(15, 0, 0);

        var x1MonthAxis = d3.svg.axis()
            .scale(x1)
            .orient('top')
            .ticks(d3.time.weeks, 1)
            .tickFormat(d3.time.format('%b - Week %W'))
            .tickFormat(d3.time.format('%b %y'))
            .tickSize(15, 0, 0);

        // middle Mon 15 Tues 16
        main.append('g')
            .attr('transform', 'translate(0,' + mainHeight + ')')
            .attr('class', 'main axis date')
            .call(x1DateAxis);

        // Top Dec Week 50
        main.append('g')
            .attr('transform', 'translate(0,0.5)')
            .attr('class', 'main axis month')
            .call(x1MonthAxis)
            .selectAll('text')
            .attr('dx', 5)
            .attr('dy', 12);


        // bottom dates
        mini.append('g')
            .attr('transform', 'translate(0,' + miniHeight + ')')
            .attr('class', 'axis date')
            .call(xDateAxis);

        mini.append('g')
            .attr('transform', 'translate(0,0.5)')
            .attr('class', 'axis month')
            .call(xMonthAxis)
            .selectAll('text')
            .attr('dx', 5)
            .attr('dy', 12);

        // draw a line representing today's date
        main.append('line')
            .attr('y1', 0)
            .attr('y2', mainHeight)
            .attr('class', 'main todayLine')
            .attr('clip-path', 'url(#clip)');

        mini.append('line')
            .attr('x1', x(now) + 0.5)
            .attr('y1', 0)
            .attr('x2', x(now) + 0.5)
            .attr('y2', miniHeight)
            .attr('class', 'todayLine');

        function getLaneHeight() {
            return mainHeight/lanes.length;
        }

        var l = 0;
        var i = 0;
        var aDatum = null;

        /* draw EDSS line chart here */
        var edssYLane = [];
        var edssItems = [];

        for (l = 0; l < lanes.length; l++) {
            if (lanes[l].label == 'EDSS')
            {
                edssYLane.push(lanes[l]);
                for (i = 0; i < items.length; i++) {
                    if (items[i].lane == lanes[l].id) {
                        aDatum = {x: items[i].start, y:parseInt(items[i].value)};
                        edssItems.push(aDatum);
                    }
                }
            }
        }

        var edssYRange = d3.scale.linear().range([9/10*getLaneHeight(),0]).domain([0,10]);

        var edssYAxis = d3.svg.axis()
            .scale(edssYRange)
            .tickSize(1)
            .ticks(2)
            .orient('left')
            .tickSubdivide(false);

        main.append('g').selectAll('.edssYAxis')
            .data(edssYLane)
            .enter().append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 10.0) + ')';
                //return d3.round(y1(d.id)) + 0.5;
            })
            .call(edssYAxis);

        var edssFunc = d3.svg.line()
            .x(function (d) {
                var result = x2(d.x);
                if (result < 0)
                    return 0;
                else
                    return result;
            })
            .y(function (d) {
                return edssYRange(d.y);
            });

        main.append('svg:path')
            .attr('d', edssFunc(edssItems))
            //.style("stroke-dasharray", ("3, 3"))
            .attr('stroke', d3.rgb(0,0,140))
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('id','edssLineChart');

        main.select('#edssLineChart')
            .data(edssYLane)
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 5.0) + ')';
            });

        /* draw PDDS line chart here */
        var pddsYLane = [];
        var pddsItems = [];

        for (l = 0; l < lanes.length; l++) {
            if (lanes[l].label == 'PDDS') {
                pddsYLane.push(lanes[l]);
                for (i = 0; i < items.length; i++) {
                    if (items[i].lane == lanes[l].id) {
                        aDatum = {x: items[i].start, y:parseInt(items[i].value)};
                        pddsItems.push(aDatum);
                    }
                }
            }
        }

        var pddsYRange = d3.scale.linear().range([9/10*getLaneHeight(),0]).domain([0,8]);

        var pddsYAxis = d3.svg.axis()
            .scale(pddsYRange)
            .tickSize(1)
            .ticks(2)
            .orient('left')
            .tickSubdivide(false);

        main.append('g').selectAll('.pddsYAxis')
            .data(pddsYLane)
            .enter().append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 10.0) + ')';
                //return d3.round(y1(d.id)) + 0.5;
            })
            .call(pddsYAxis);

        var pddsFunc = d3.svg.line()
            .x(function (d) {
                var result = x2(d.x);
                if (result < 0)
                    return 0;
                else
                    return result;
            })
            .y(function (d) {
                return pddsYRange(d.y);
            });

        main.append('svg:path')
            .attr('d', pddsFunc(pddsItems))
            //.style("stroke-dasharray", ("3, 3"))
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('id','pddsLineChart');

        main.select('#pddsLineChart')
            .data(pddsYLane)
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 5.0) + ')';
            });


        /* draw VAS line chart here */
        var vasYLane = [];
        var vasItems = [];

        for (l = 0; l < lanes.length; l++) {
            if (lanes[l].label == 'VAS') {
                vasYLane.push(lanes[l]);
                for (i = 0; i < items.length; i++) {
                    if (items[i].lane == lanes[l].id) {
                        aDatum = {x: items[i].start, y:parseInt(items[i].value)};
                        vasItems.push(aDatum);
                    }
                }
            }
        }

        var vasYRange = d3.scale.linear().range([9/10*getLaneHeight(),0]).domain([0,10]);

        var vasYAxis = d3.svg.axis()
            .scale(vasYRange)
            .tickSize(1)
            .ticks(2)
            .orient('left')
            .tickSubdivide(false);

        main.append('g').selectAll('.vasYAxis')
            .data(vasYLane)
            .enter().append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 10.0) + ')';
                //return d3.round(y1(d.id)) + 0.5;
            })
            .call(vasYAxis);

        var vasFunc = d3.svg.line()
            .x(function (d) {
                var result = x2(d.x);
                if (result < 0)
                    return 0;
                else
                    return result;
            })
            .y(function (d) {
                return vasYRange(d.y);
            });

        main.append('svg:path')
            .attr('d', vasFunc(vasItems))
            //.style("stroke-dasharray", ("3, 3"))
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('id','vasLineChart');

        main.select('#vasLineChart')
            .data(vasYLane)
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 5.0) + ')';
            });

        var phcDatum = null;
        var mhcDatum = null;

        /* draw MSQOL line chart here */
        var msqolYLane = [];
        var msqol_Phc_Items = [];
        var msqol_Mhc_Items = [];

        for (l = 0; l < lanes.length; l++) {
            if (lanes[l].label == 'MSQOL')
            {
                msqolYLane.push(lanes[l]);
                for (i = 0; i < items.length; i++) {
                    if (items[i].lane == lanes[l].id) {
                        phcDatum = {x: items[i].start, y:parseInt(items[i].value.phc)};
                        msqol_Phc_Items.push(phcDatum);

                        mhcDatum = {x: items[i].start, y:parseInt(items[i].value.mhc)};
                        msqol_Mhc_Items.push(mhcDatum);
                    }
                }
            }
        }

        var msqolYRange = d3.scale.linear().range([9/10*getLaneHeight(),0]).domain([0,100]);

        var msqolYAxis = d3.svg.axis()
            .scale(msqolYRange)
            .tickSize(1)
            .ticks(2)
            .orient('left')
            .tickSubdivide(false);

        main.append('g').selectAll('.msqolYAxis')
            .data(msqolYLane)
            .enter().append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 5.0) + ')';
                //return d3.round(y1(d.id)) + 0.5;
            })
            .call(msqolYAxis);

        var msqolFunc = d3.svg.line()
            .x(function (d) {
                var result = x2(d.x);
                if (result < 0)
                    return 0;
                else
                    return result;
            })
            .y(function (d) {
                return msqolYRange(d.y);
            });

        main.append('svg:path')
            .attr('d', msqolFunc(msqol_Phc_Items))
            .style('stroke-dasharray', ('3, 3'))
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('id','msqol_Phc_LineChart');

        main.append('svg:path')
            .attr('d', msqolFunc(msqol_Mhc_Items))
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('id','msqol_Mhc_LineChart');

        main.select('#msqol_Mhc_LineChart')
            .data(msqolYLane)
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 0.5) + ')';
            });



        /* draw PROMIS line chart here */
        var promisYLane = [];
        var promis_Phc_Items = [];
        var promis_Mhc_Items = [];

        for (l = 0; l < lanes.length; l++) {
            if (lanes[l].label == 'PROMIS')
            {
                promisYLane.push(lanes[l]);
                for (i = 0; i < items.length; i++) {
                    if (items[i].lane == lanes[l].id) {
                        phcDatum = {x: items[i].start, y:parseInt(items[i].value.phc)};
                        promis_Phc_Items.push(phcDatum);

                        mhcDatum = {x: items[i].start, y:parseInt(items[i].value.mhc)};
                        promis_Mhc_Items.push(mhcDatum);
                    }
                }
            }
        }

        var promisYRange = d3.scale.linear().range([9/10*getLaneHeight(),0]).domain([4,20]);

        var promisYAxis = d3.svg.axis()
            .scale(promisYRange)
            .tickSize(1)
            .ticks(2)
            .orient('left')
            .tickSubdivide(false);

        main.append('g').selectAll('.promisYAxis')
            .data(promisYLane)
            .enter().append('svg:g')
            .attr('class', 'x axis')
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 5.0) + ')';
                //return d3.round(y1(d.id)) + 0.5;
            })
            .call(promisYAxis);

        var promisFunc = d3.svg.line()
            .x(function (d) {
                var result = x2(d.x);
                if (result < 0)
                    return 0;
                else
                    return result;
            })
            .y(function (d) {
                return promisYRange(d.y);
            });

        main.append('svg:path')
            .attr('d', promisFunc(promis_Phc_Items))
            .style('stroke-dasharray', ('3, 3'))
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('id','promis_Phc_LineChart');

        main.append('svg:path')
            .attr('d', promisFunc(promis_Mhc_Items))
            .attr('stroke', 'grey')
            .attr('stroke-width', 1)
            .attr('fill', 'none')
            .attr('id','promis_Mhc_LineChart');

        main.select('#promis_Mhc_LineChart')
            .data(promisYLane)
            .attr('transform', function (d) {
                return 'translate(0,' + (d3.round(y1(d.id)) + 0.5) + ')';
            });


        // draw the items
        var itemRects = main.append('g')
            .attr('clip-path', 'url(#clip)');

        mini.append('g').selectAll('miniItems')
            .data(getPaths(items))
            .enter().append('path')
            .attr('class', function(d) { return 'miniItem ' + d.class; })
            .attr('d', function(d) { return d.path; });

        // invisible hit area to move around the selection window
        mini.append('rect')
            .attr('pointer-events', 'painted')
            .attr('width', width)
            .attr('height', miniHeight)
            .attr('visibility', 'hidden')
            .on('mouseup', moveBrush);

        // draw the selection area
        var brush = d3.svg.brush()
            .x(x)
            //.extent([d3.time.monday(now),d3.time.saturday.ceil(now)])
            .extent([d3.time.week(d3.min(items, function(d) { return d.start; })),
                d3.max(items, function(d) { return d.end; })])
            .on('brush', redraw);

        mini.append('g')
            .attr('class', 'x brush')
            .call(brush)
            .selectAll('rect')
            .attr('y', 1)
            .attr('height', miniHeight - 1);

        mini.selectAll('rect.background').remove();

        redraw();

        function redraw () {

            var rects, labels
                , minExtent = d3.time.day(brush.extent()[0])
                , maxExtent = d3.time.day(brush.extent()[1])
                , visItems = items.filter(function (d) { return d.start < maxExtent && d.end > minExtent;});

            mini.select('.brush').call(brush.extent([minExtent, maxExtent]));

            x1.domain([minExtent, maxExtent]);
            x2.domain([minExtent, maxExtent]);

            x1DateAxis.ticks(d3.time.week, 5).tickFormat('');
            x1MonthAxis.ticks(d3.time.month, 3).tickFormat(d3.time.format('%b %y'));

            if ((maxExtent - minExtent) > (1.577e+10)) {  // 6 months
                x1DateAxis.ticks(d3.time.week, 5).tickFormat('');
                //                x1DateAxis.ticks(d3.time.week, 5).tickFormat(d3.time.format('%d'))
                //x1MonthAxis.ticks(d3.time.mondays, 1).tickFormat(d3.time.format('%b - Wk %W'))
                x1MonthAxis.ticks(d3.time.month, 6).tickFormat(d3.time.format('%b %Y'));

            } else if ((maxExtent - minExtent) > (1.051e+10)) {  // 4 months
                x1DateAxis.ticks(d3.time.week, 5).tickFormat('');
                x1MonthAxis.ticks(d3.time.month, 3).tickFormat(d3.time.format('%b %Y'));

            } else if ((maxExtent - minExtent) > (7.884e+9)) {  // 3 months
                x1DateAxis.ticks(d3.time.week, 5).tickFormat('');
                x1MonthAxis.ticks(d3.time.month, 1).tickFormat(d3.time.format('%b %Y'));
            }
            else if ((maxExtent - minExtent) > 2.628e+9) {
                x1DateAxis.ticks(d3.time.week, 5).tickFormat('');
                x1MonthAxis.ticks(d3.time.week, 4).tickFormat(d3.time.format('%d %b %Y'));
            }
            else {
                x1DateAxis.ticks(d3.time.week, 5).tickFormat('');
                x1MonthAxis.ticks(d3.time.days, 5).tickFormat(d3.time.format('%d %b %Y'));
            }

            // shift the today line
            main.select('.main.todayLine')
                .attr('x1', x1(now) + 0.5)
                .attr('x2', x1(now) + 0.5);

            // update the axis
            main.select('.main.axis.date').call(x1DateAxis);
            main.select('.main.axis.month').call(x1MonthAxis)
                .selectAll('text')
                .attr('dx', 5)
                .attr('dy', 12);

            // upate the item rects
            rects = itemRects.selectAll('rect')
                .data(visItems.filter(function (d) {
                    return (d.domain == 'EX');}), function (d) {
                    return d.id;})
                .attr('x', function(d) { return x1(d.start); })
                .attr('width', function(d) { return (x1(d.end) - x1(d.start)); });

            rects.enter().append('rect')
                .attr('x', function(d) { return x1(d.start); })
                .attr('y', function(d) { return y1(d.lane) + .5 * y1(1) + 0.0; })
                .attr('width', function(d) { return (x1(d.end) - x1(d.start)); })
                .attr('height', function() { return .4 * y1(1); })
                .attr('class', function(d) {
                    return 'mainItem ' + d.domain; });



            var squares = itemRects.selectAll('squares')
                .data(visItems.filter(function (d) {
                    return (d.domain == 'SV');}), function (d) {
                    return d.id;})
                .attr('x', function(d) { return x1(d.start); });
                //.attr('width', function(d) { return (150); });

            squares.enter().append('rect')
                .attr('x', function(d) { return x1(d.start); })
                .attr('y', function(d) { return y1(d.lane) + .5 * y1(1) + 0.0; })
                .attr('width', function() { return .2 * y1(1); })
                .attr('height', function() { return .2 * y1(1);})
                .style('fill', function() { return d3.rgb(31,76,76);})
                .attr('class', function(d) {
                    return 'mainItem ' + d.domain; });

            squares.exit().remove();
            rects.exit().remove();

            var triangle = itemRects.selectAll('path')
                .data(visItems.filter(function (d) {return d.domain == 'LB';}), function (d) {
                    return d.id;
                })
                .attr('transform', function(d) {
                    var y = y1(d.lane) + 0.4 * y1(1) + 0.5;
                    var x = x1(d.start);
                    return 'translate('+x+','+y+')';});

            triangle.enter().append('path')
                .attr('d', d3.svg.symbol()
                    .type( function() {
                        return 'cross';}))
                .style('fill', 'steelblue')
                .attr('transform', function(d) {
                    var y = y1(d.lane) + 0.4 * y1(1) + 0.5;
                    var x = x1(d.start);
                    return 'translate('+x+','+y+')';})
                .attr('class', function(d) { return 'mainItem ' + d.class; });

            triangle.exit().remove();

            var circs = itemRects.selectAll('circle')
                .data(visItems.filter(function (d) {return d.domain == 'CE';}), function (d) {
                    return d.id;
                })
                .attr('cx', function(d) { return x1(d.start); });

            circs.enter().append('circle')
                .on('click', function(d) {
                    var elementId = '#'+d.url;
                    angular.element('#relapseID').trigger('click');
                    angular.element(elementId).trigger('click');
                })
                .attr('cx', function(d) { return x1(d.start); })
                .attr('cy', function(d) { return y1(d.lane) + .4 * y1(1) + 0.5; })
                .attr('r', function(d) {
                    if(d.desc == 'Mild')
                        return .05 * y1(1);
                    else if (d.desc =='Moderate')
                        return .1 * y1(1);
                    else
                        return .2 * y1(1); })
                .attr('class', function(d) {
                    return 'mainItem ' + d.class; });

            circs.exit().remove();

            // update the item labels
            labels = itemRects.selectAll('text')
                .data(visItems.filter(function (d) {
                    return ((d.domain == 'EX')||(d.domain == 'QS')||(d.domain == 'LB'));
                }), function (d) {return d.id;})
                .attr('x', function(d) { return x1(Math.max(d.start, minExtent)) + 2 ; });

            labels.enter().append('text')
                .text(function (d) {return d.desc;})
                .attr('x', function(d) { return x1(Math.max(d.start, minExtent)) + 2 ; })
                .attr('y', function(d) {
                    if (d.domain == 'QS') {
                        return y1(d.lane) + edssYRange(d.value);
                    }
                    else
                        return y1(d.lane) + .4 * y1(1) + 0.5;
                })
                .attr('fill', function(d) {
                    switch (d.domain){
                    case 'EX':
                        return d3.rgb(31,128,50);
                    case 'CE':
                        return d3.rgb(140,0,0);
                    case 'LB':
                        return d3.rgb(79,132,190);
                    case 'QS':
                        return d3.rgb(10,29,98);
                    default:
                        return 'grey';
                    }
                })
                .attr('text-anchor', 'start')
                .attr('class', 'itemLabel');

            labels.exit().remove();

            var edssChart = main.select('#edssLineChart');

            if (edssYLane != null){
                edssChart.data(edssYLane)
                    .attr('d', edssFunc(edssItems))
                    .attr('transform', function (d) {
                        return 'translate(0,' + (d3.round(y1(d.id)) + 0.5) + ')';
                    });
            }

            var vasChart = main.select('#vasLineChart');

            if (vasYLane != null){
                vasChart.data(vasYLane)
                    .attr('d', vasFunc(vasItems))
                    .attr('transform', function (d) {
                        return 'translate(0,' + (d3.round(y1(d.id)) + 0.5) + ')';
                    });
            }

            var pddsChart = main.select('#pddsLineChart');

            if (pddsYLane != null){
                pddsChart.data(pddsYLane)
                    .attr('d', pddsFunc(pddsItems))
                    .attr('transform', function (d) {
                        return 'translate(0,' + (d3.round(y1(d.id)) + 0.5) + ')';
                    });
            }

            var msqol_Phc_Chart = main.select('#msqol_Phc_LineChart');

            if (msqolYLane != null){
                msqol_Phc_Chart.data(msqolYLane)
                    .attr('d', msqolFunc(msqol_Phc_Items))
                    .attr('transform', function (d) {
                        return 'translate(0,' + (d3.round(y1(d.id)) + 0.5) + ')';
                    });
            }

            var msqol_Mhc_Chart = main.select('#msqol_Mhc_LineChart');

            if (msqolYLane != null){
                msqol_Mhc_Chart.data(msqolYLane)
                    .attr('d', msqolFunc(msqol_Mhc_Items))
                    .attr('transform', function (d) {
                        return 'translate(0,' + (d3.round(y1(d.id)) + 0.5) + ')';
                    });
            }


            var promis_Phc_Chart = main.select('#promis_Phc_LineChart');

            if (promisYLane != null){
                promis_Phc_Chart.data(promisYLane)
                    .attr('d', promisFunc(promis_Phc_Items))
                    .attr('transform', function (d) {
                        return 'translate(0,' + (d3.round(y1(d.id)) + 0.5) + ')';
                    });
            }

            var promis_Mhc_Chart = main.select('#promis_Mhc_LineChart');

            if (promisYLane != null){
                promis_Mhc_Chart.data(promisYLane)
                    .attr('d', promisFunc(promis_Mhc_Items))
                    .attr('transform', function (d) {
                        return 'translate(0,' + (d3.round(y1(d.id)) + 0.5) + ')';
                    });
            }
        }

        function moveBrush () {
            var origin = d3.mouse(this)
                , point = x.invert(origin[0])
                , halfExtent = (brush.extent()[1].getTime() - brush.extent()[0].getTime()) / 2
                , start = new Date(point.getTime() - halfExtent)
                , end = new Date(point.getTime() + halfExtent);

            brush.extent([start,end]);
            redraw();
        }

        function getPaths(items) {
            var paths = {}, d, offset = .5 * y2(1) + 0.5, result = [];
            for (var i = 0; i < items.length; i++) {
                d = items[i];
                if (!paths[d.class])
                    paths[d.class] = '';
                paths[d.class] += ['M',x(d.start),(y2(d.lane) + offset),'H',x(d.end)].join(' ');
            }
            for (var className in paths) {
                result.push({class: className, path: paths[className]});
            }
            return result;
        }
    }
    function clearDisplay() {
        d3.selectAll('svg').remove();
    }

    return {
        restrict:'E',
        controller: 'timelineCtrl',
        link: function ($scope, element){

            $scope.$watch('randomData', function(){

                if (($scope.randomData != null)&&($scope.randomData.lanes.length > 0)) {
                    display($scope, element);
                }
                else {
                    clearDisplay();
                }
            }, true);
        }
    };
});

timelineModule.factory('patientEvents', function(exposures,
    clinicalEvents,
    adverseEventService,
    laboratoryTestResults,
    immunogenicitySpecimenAssessments,
    nervousSystemFindings,
    procedures,
    questionnaires, morphologyServices, subjectVisits){

    var getPatientEvents = function(dataToView) {
        var addToLane = function (chart, item) {
            var name = item.lane;

            if (!chart.lanes[name])
                chart.lanes[name] = [];

            var lane = chart.lanes[name];

            var sublane = 0;
            while(isOverlapping(item, lane[sublane]))
                sublane++;

            if (!lane[sublane]) {
                lane[sublane] = [];
            }

            lane[sublane].push(item);
        };

        var isOverlapping = function(item, lane) {
            if (lane) {
                for (var i = 0; i < lane.length; i++) {
                    var t = lane[i];
                    if (item.start < t.end && item.end > t.start) {
                        return true;
                    }
                }
            }
            return false;
        };

        var parseData = function (data) {
            var i = 0, length = data.length;
            var chart = { lanes: {} };

            for (i; i < length; i++) {
                var item = data[i];
                addToLane(chart, item);
            }

            return collapseLanes(chart);
        };

        var collapseLanes = function (chart) {
            var lanes = [], items = [], laneId = 0;

            for (var laneName in chart.lanes) {
                var lane = chart.lanes[laneName];

                for (var i = 0; i < lane.length; i++) {
                    var subLane = lane[i];

                    lanes.push({
                        id: laneId,
                        label: i === 0 ? laneName : ''
                    });

                    for (var j = 0; j < subLane.length; j++) {
                        var item = subLane[j];

                        items.push({
                            id: item.id,
                            lane: laneId,
                            start: item.start,
                            end: item.end,
                            //class: item.end > now ? 'future' : 'past',
                            class: item.domain,
                            desc: item.desc,
                            domain: item.domain,
                            value: item.value,
                            url: item.url
                        });
                    }

                    laneId++;
                }
            }

            return {lanes: lanes, items: items};
        };

        var generateWorkItems = function () {

            var data = [];
            //var laneNames = ["MS Specific", "Symptomatic", "Non-Pharma", "Relapses", "Medical Conditions", "MRI", "CSF","Evoked Potantials", "Lab Tests"]

            if (dataToView.indexOf('Treatments') > -1)
                getTreatments(data);

            if (dataToView.indexOf('Visits') > -1)
                getVisits(data);

            if (dataToView.indexOf('Tests') > -1)
                getTests(data);

            if (dataToView.indexOf('Relapses') > -1)
                getRelapses(data);

            if (dataToView.indexOf('EDSS') > -1)
                getEDSS(data);

            if (dataToView.indexOf('MSQOL') > -1)
                getMSQOL54(data);

            if (dataToView.indexOf('PDDS') > -1)
                getPDDS(data);

            if (dataToView.indexOf('VAS') > -1)
                getVAS(data);

            if (dataToView.indexOf('PROMIS') > -1)
                getPROMIS(data);

            if (dataToView.indexOf('LesionVolume') > -1)
                getLesionVolume(data);

            consolidateItemID(data);
            return data;
        };

        return parseData(generateWorkItems());
    };


    var consolidateItemID = function(data) {
        for (var i = 0; i < data.length; i++){
            data[i].id = i;
            data[i].name = 'work item '+i;
        }
    };

    var getTests = function (data) {

        var findUniqueCollectionDates = function(labResults, assessmentResults) {
            var uniqueDates = [];

            var collectionDateExists = function (uniqueDates, aDate) {
                for (var d = 0; d < uniqueDates.length; d++) {
                    if (uniqueDates[d].DOMAIN=='IS'){
                        if (aDate.toDateString==uniqueDates[d].ISDTC.toDateString()) {
                            return true;
                        }
                    }
                    else if (uniqueDates[d].DOMAIN=='LB'){
                        if (aDate.toDateString==uniqueDates[d].LBDTC.toDateString()) {
                            return true;
                        }
                    }
                }
                return false;
            };

            for (var l = 0; l < labResults.length; l++) {
                if (!collectionDateExists(uniqueDates, labResults[l].LBDTC)) {
                    uniqueDates.push(labResults[l]);
                }
            }
            for (var a = 0; a < assessmentResults.length; a++) {
                if (!collectionDateExists(uniqueDates, assessmentResults[a].ISDTC)) {
                    uniqueDates.push(assessmentResults[a]);
                }
            }
            return uniqueDates;
        };

        var labResults = laboratoryTestResults.getUniqueDates();
        var assessmentResults = immunogenicitySpecimenAssessments.getUniqueDates();
        var vepFindings = nervousSystemFindings.getUniqueDates();
        var labCollectionDates = findUniqueCollectionDates(labResults, assessmentResults);

        var images = procedures.getProcedureDates('MRI');
        var csfTests = procedures.getProcedureDates('Lumbar Puncture');
        var events = vepFindings.concat(labCollectionDates).concat(images).concat(csfTests);

        for (var t = 0; t < events.length; t++) {
            var workItem = null;
            var stdtc = null;
            var endtc = null;
            switch (events[t].DOMAIN) {
            case 'IS':
                stdtc = events[t].ISDTC;
                endtc = new Date(stdtc);
                endtc.setDate(stdtc.getDate()+1);
                workItem = {
                    id: '',
                    name: 'work item ' + '',
                    lane: 'Serology',
                    start: stdtc,
                    end: endtc,
                    desc: '',
                    domain: 'LB',
                    value: ''
                };
                break;
            case 'LB':
                stdtc = events[t].LBDTC;
                endtc = new Date(stdtc);
                endtc.setDate(stdtc.getDate()+1);
                workItem = {
                    id: '',
                    name: 'work item ' + '',
                    lane: 'Lab',
                    start: stdtc,
                    end: endtc,
                    //desc: events[t].displayLabel,
                    desc: '',
                    domain: 'LB',
                    value: ''
                };
                break;
            case 'NV':
                stdtc = events[t].NVDTC;
                endtc = new Date(stdtc);
                endtc.setDate(stdtc.getDate()+1);
                workItem = {
                    id: '',
                    name: 'work item ' + '',
                    lane: 'EP',
                    start: stdtc,
                    end: endtc,
                    desc: '',
                    domain: 'LB',
                    value: ''
                };
                break;
            case 'PR':
                stdtc = events[t].PRSTDTC;
                endtc = new Date(stdtc);
                endtc.setDate(stdtc.getDate()+1);
                var result='';
                var laneName = '';
                if (events[t].PRTRT=='MRI') {
                    laneName = 'MRI';
                    var MO = morphologyServices.getFindingByDateTest(events[t].PRSTDTC, 'Lesion volume');
                    if (MO != null) {
                        result = MO.MOORRES;
                    }
                }
                else if (events[t].PRTRT=='Lumbar Puncture') {
                    laneName = 'CSF';
                }
                workItem = {
                    id: '',
                    name: 'work item ' + '',
                    lane: laneName,
                    start: stdtc,
                    end: endtc,
                    desc: result,
                    domain: 'LB',
                    value: ''
                };
                break;
            }

            if (workItem!=null)
                data.push(workItem);
        }
    };

    var getTreatments = function (data) {
        var events = exposures.getExposures();

        for (var t = 0; t < events.length; t++) {
            if (events[t].EXCAT == 'Disease Modifying'){
                var endtc;
                if ((events[t].EXENDTC==null)||(events[t].EXENDTC==''))
                {
                    endtc=exposures.getExposuresForTimeLine();

                }
                else
                {
                    endtc = events[t].EXENDTC;
                }

                var workItem = {
                    id: '',
                    name: 'work item ' + '',
                    lane: 'Treatments',
                    start: events[t].EXSTDTC,
                    end: endtc,
                    desc: events[t].displayLabel,
                    domain: 'EX',
                    value: ''
                };
                data.push(workItem);
            }
        }
    };

    var getEDSS = function (data) {
        var edss = questionnaires.getEDSSScores();

        for (var t = 0; t < edss.length; t++) {
            var stdtc = edss[t].QSDTC;
            var endtc = new Date(stdtc);
            endtc.setDate(stdtc.getDate()+1);

            var workItem = {
                id: '',
                name: 'work item ' + '',
                lane: 'EDSS',
                start: stdtc,
                end: endtc,
                desc: edss[t].QSSTRESC,
                domain: 'QS',
                value: edss[t].QSSTRESC
            };

            data.push(workItem);

        }
    };

    var getPDDS = function (data) {
        var pdds = questionnaires.getPDDSScores();

        for (var t = 0; t < pdds.length; t++) {
            var stdtc = pdds[t].QSDTC;
            var endtc = new Date(stdtc);
            endtc.setDate(stdtc.getDate()+1);

            var workItem = {
                id: '',
                name: 'work item ' + '',
                lane: 'PDDS',
                start: stdtc,
                end: endtc,
                desc: pdds[t].QSSTRESC,
                domain: 'QS',
                value: pdds[t].QSSTRESC
            };

            data.push(workItem);
        }
    };

    var getVAS = function (data) {
        var vas = questionnaires.getVASScores();

        for (var t = 0; t < vas.length; t++) {
            var stdtc = vas[t].QSDTC;
            var endtc = new Date(stdtc);
            endtc.setDate(stdtc.getDate()+1);

            var workItem = {
                id: '',
                name: 'work item ' + '',
                lane: 'VAS',
                start: stdtc,
                end: endtc,
                desc: vas[t].QSSTRESC,
                domain: 'QS',
                value: vas[t].QSSTRESC
            };

            data.push(workItem);
        }
    };

    var getMSQOL54 = function(data) {
        var healthComposites = questionnaires.getMSQOL54();
        for (var t = 0; t < healthComposites.phc.length; t++) {
            var stdtc = healthComposites.phc[t].QSDTC;
            var endtc = new Date(stdtc);
            endtc.setDate(stdtc.getDate()+1);

            var workItem = {
                id: '',
                name: 'work item ' + '',
                lane: 'MSQOL',
                start: stdtc,
                end: endtc,
                desc: healthComposites.phc[t].QSSTRESC+', '+ healthComposites.mhc[t].QSSTRESC,
                domain: 'QS',
                value: {phc: healthComposites.phc[t].QSSTRESC, mhc: healthComposites.mhc[t].QSSTRESC}
            };
            data.push(workItem);
        }
    };

    var getPROMIS = function(data) {
        var healthComposites = questionnaires.getPROMIS();
        for (var t = 0; t < healthComposites.phc.length; t++) {
            var stdtc = healthComposites.phc[t].QSDTC;
            var endtc = new Date(stdtc);
            endtc.setDate(stdtc.getDate()+1);
            var workItem = {
                id: '',
                name: 'work item ' + '',
                lane: 'PROMIS',
                start: stdtc,
                end: endtc,
                desc: healthComposites.phc[t].QSSTRESC+', '+ healthComposites.mhc[t].QSSTRESC,
                domain: 'QS',
                value: {phc: healthComposites.phc[t].QSSTRESC, mhc: healthComposites.mhc[t].QSSTRESC}
            };
            data.push(workItem);
        }
    };

    var getVisits = function (data) {
        var visits = subjectVisits.getSubjectVisits();
        for (var t = 0; t < visits.length; t++) {
            var stdtc = visits[t].SVSTDTC;
            var endtc = new Date(stdtc);
            endtc.setDate(stdtc.getDate()+1);
            var workItem = {
                id: '',
                name: 'work item ' + '',
                lane: 'Visits',
                start: stdtc,
                end: endtc,
                desc: visits[t].displayLabel,
                domain: 'SV',
                value: '',
                url: visits[t].DOMAIN+'-'+t
            };
            data.push(workItem);
        }
    };

    var getRelapses = function (data) {
        var events = clinicalEvents.getUniqueDatesFromCategory('MS Relapse');
        for (var t = 0; t < events.length; t++) {

            var stdtc = events[t].CESTDTC;
            var endtc = new Date(stdtc);
            endtc.setDate(stdtc.getDate()+1);
            var workItem = {
                id: '',
                name: 'work item ' + '',
                lane: 'Relapses',
                start: stdtc,
                end: endtc,
                desc: events[t].displayLabel,
                domain: 'CE',
                value: '',
                url: events[t].DOMAIN+'-'+t
            };
            data.push(workItem);
        }
    };

    var getLesionVolume = function (data) {
        var lesions = morphologyServices.getFindingByTest('Lesion volume');
        for (var t = 0; t < lesions.length; t++) {

            var stdtc = lesions[t].MODTC;
            var endtc = new Date(stdtc);
            endtc.setDate(stdtc.getDate()+1);
            var workItem = {
                id: '',
                name: 'work item ' + '',
                lane: 'Lesion Volume (ml)',
                start: stdtc,
                end: endtc,
                desc: lesions[t].MOORRES,
                domain: 'MO',
                value: lesions[t].MOORRES,
                url: ''
            };
            data.push(workItem);
        }
    };

    return {
        getPatientEvents: getPatientEvents
    };
});


timelineModule.controller('timelineCtrl', function ($rootScope, $scope, patientEvents, viewService) {

    $scope.showThisContent = function() {
        if (viewService.getView().Section=='Timeline'){
            $scope.randomData = patientEvents.getPatientEvents($scope.dataToView);
            return true;
        }
        else
            return false;
    };

    $scope.dataToView = ['Treatments', 'Visits', 'Relapses', 'EDSS'];
    //$scope.dataToView = ['MSQOL', 'PDDS', 'VAS', 'PROMIS', 'LesionVolume'];

    $rootScope.toggleTimelineData = function(dataToViewName) {
        // check if is in line
        var indexOfData = $scope.dataToView.indexOf(dataToViewName);

        // if data is already shown
        if (indexOfData == -1) {
            $scope.dataToView.push(dataToViewName);
        }
        else {
            $scope.dataToView.splice(indexOfData, 1);
        }
        $scope.randomData = patientEvents.getPatientEvents($scope.dataToView);
    };

    $scope.includeInTimeline = function(dataType) {
        if ($scope.dataToView.indexOf(dataType) == -1) {
            return false;
        }
        return true;
    };
});
