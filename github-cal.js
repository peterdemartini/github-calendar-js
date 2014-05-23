'use strict';

window.githubCal = (function (global, $, d3) {

    var obj = {
        selector: '#github-cal',
        options: {
            margin : {
                top: 50,
                right: 0,
                bottom: 100,
                left: 30
            },
            width : 960,
            height: 300,
            // Ordered from less to more contributions
            colors: [
                '#eee',
                '#d6e685',
                '#8cc665',
                '#44a340',
                '#1e6823'
            ],
            days: [
                'Mo',
                'Tu',
                'We',
                'Th',
                'Fr',
                'Sa',
                'Su'
            ],
            months: [
                'Jan',
                'Feb',
                'Mar',
                'Apr',
                'May',
                'Jun',
                'Jul',
                'Aug',
                'Sep',
                'Oct',
                'Nov',
                'Dec'
            ],
            buckets: 5,
            username : 'peterdemartini'
        },
        data: [],
        setOptions: function (opts) {
            obj.options = $.extend(obj.options, opts);

            obj.options.width = obj.options.width - obj.options.margin.left - obj.options.margin.right;
            obj.options.height = obj.options.height - obj.options.margin.top - obj.options.margin.bottom;

            obj.options.gridSize = 30;
            obj.options.legendElementWidth = obj.options.gridSize;
        },
        init: function (selector, opts) {
            obj.selector = selector;
            obj.setOptions(opts || {});
            obj.getData(function(data){
                data = data.map(function(d){
                    var date = new Date(d[0]);
                    return {
                        day : date.getDay(),
                        month : date.getMonth(),
                        value : d[1]
                    };
                });

                obj.data = data;
                obj.generate();
            });

        },
        getData: function (cb) {
            $.get('http://stormy-sea-4131.herokuapp.com/contributions/' + obj.options.username, cb);
        },
        generate: function () {
            var colorScale = d3.scale.quantile()
                .domain([0, obj.options.buckets - 1, d3.max(obj.data, function (d) {
                    return d.value;
                })])
                .range(obj.options.colors);

            var svg = d3.select(obj.selector).append('svg')
                .attr('width', obj.options.width + obj.options.margin.left + obj.options.margin.right)
                .attr('height', obj.options.height + obj.options.margin.top + obj.options.margin.bottom)
                .append('g')
                .attr('transform', 'translate(' + obj.options.margin.left + ',' + obj.options.margin.top + ')');

            svg.selectAll('.dayLabel')
                .data(obj.options.days)
                .enter().append('text')
                .text(function (d) {
                    return d;
                })
                .attr('x', 0)
                .attr('y', function (d, i) {
                    return i * obj.options.gridSize;
                })
                .style('text-anchor', 'end')
                .attr('transform', 'translate(-6,' + obj.options.gridSize / 1.5 + ')')
                .attr('class', function (d, i) {
                    return ((i >= 0 && i <= 4) ? 'dayLabel mono axis axis-workweek' : 'dayLabel mono axis');
                });

            svg.selectAll('.monthLabel')
                .data(obj.options.months)
                .enter().append('text')
                .text(function (d) {
                    return d;
                })
                .attr('x', function (d, i) {
                    return i * obj.options.gridSize;
                })
                .attr('y', 0)
                .style('text-anchor', 'middle')
                .attr('transform', 'translate(' + obj.options.gridSize / 2 + ', -6)')
                .attr('class', function (d, i) {
                    return ((i >= 7 && i <= 16) ? 'monthLabel mono axis axis-worktime' : 'monthLabel mono axis');
                });

            var heatMap = svg.selectAll('.month')
                .data(obj.data)
                .enter().append('rect')
                .attr('x', function (d) {
                    return d.month  * obj.options.gridSize;
                })
                .attr('y', function (d) {
                    return d.day * obj.options.gridSize;
                })
                .attr('rx', 4)
                .attr('ry', 4)
                .attr('class', 'month bordered')
                .attr('width', obj.options.gridSize)
                .attr('height', obj.options.gridSize)
                .style('fill', obj.options.colors[0]);

            heatMap.transition().duration(1000)
                .style('fill', function (d) {
                    return colorScale(d.value);
                });

            heatMap.append('title').text(function (d) {
                return d.value;
            });

            var legend = svg.selectAll('.legend')
                .data([0].concat(colorScale.quantiles()), function (d) {
                    return d;
                })
                .enter().append('g')
                .attr('class', 'legend');

            legend.append('rect')
                .attr('x', function (d, i) {
                    return obj.options.legendElementWidth * i;
                })
                .attr('y', obj.options.height)
                .attr('width', obj.options.legendElementWidth)
                .attr('height', obj.options.gridSize / 2)
                .style('fill', function (d, i) {
                    return obj.options.colors[i];
                });

            legend.append('text')
                .attr('class', 'mono')
                .text(function (d) {
                    return '≥ ' + Math.round(d);
                })
                .attr('x', function (d, i) {
                    return obj.options.legendElementWidth * i;
                })
                .attr('y', obj.options.height + obj.options.gridSize);
        }
    };

    var publicAPI = {
        init: obj.init,
        update: obj.generate
    };

    return publicAPI;
})(window, jQuery, d3);
