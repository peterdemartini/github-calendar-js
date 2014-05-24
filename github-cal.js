'use strict';

window.githubCal = (function (global, $, moment, CalHeatMap) {

    var obj = {
        id: 'github-cal',
        options: {
            proxy: 'http://stormy-sea-4131.herokuapp.com',
            username: 'peterdemartini'
        },
        data: [],
        legend: [10, 20, 30, 40],
        setOptions: function (opts) {
            obj.options = $.extend(obj.options, opts);
        },
        init: function (itemSelector, opts) {
            obj.itemSelector = itemSelector;
            obj.setOptions(opts || {});
            obj.getData(function (res) {
                var data = {},
                    min = 0,
                    max = 0;
                res.forEach(function (d) {
                    var date = moment(d[0], 'YYYY/MM/DD').unix();
                    var value = d[1];
                    if(value < min){
                        min = value;
                    }
                    if(value > max){
                        max = value;
                    }
                    if(value){
                        if(data[date])
                            data[date] += value;
                        else
                            data[date] = value;
                    }
                });

                var per =  Math.floor(max / obj.legend.length); //23 / 4 = 5
                var inc = 0;
                for(var x = 0; x < obj.legend.length; x++){
                    obj.legend[x] = inc = inc + per;
                }
                obj.data = data;
                obj.generate();
            });

        },
        getData: function (cb) {
            $.get(obj.options.proxy + '/contributions/' + obj.options.username, cb);
        },
        generate: function () {
            var calendar = new CalHeatMap();
            calendar.init({
                data: obj.data,
                start: moment().subtract('months', 11).toDate(),
                end: new Date(),
                itemSelector: obj.itemSelector,
                domain: 'month',
                subDomain: 'day',
                range: 12,
                scale: [2, 4, 6, 8, 10],
                legend : obj.legend,
                format: {
                    date: function (date) {
                        return moment(date).format('LL');
                    },
                    legend: null,
                }
            });
        }
    };

    var publicAPI = {
        init: obj.init,
        update: obj.generate
    };

    return publicAPI;
})(window, jQuery, moment, CalHeatMap);
