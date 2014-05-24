Github Calendar JS
==================

Github contributions calendar using D3 and [Cal-heatmap](http://kamisama.github.io/cal-heatmap/v2)

### Install

1. Spin up a [Github Proxy](https://github.com/peterdemartini/github-proxy) on Heroku. This is used to avoid CORS errors.

2. Install jQuery, moment, d3, and Cal-heatmap.

### Example

    <!DOCTYPE html>
    <html lang="en">

        <head>
            <meta charset="utf-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1">
            <title>Github Calendar Test</title>

            <link href="cal-heatmap/cal-heatmap.css" rel="stylesheet">
        </head>

        <body>

            <h1>Github Calendar Test</h1>

            <div id="github-cal"></div>

            <script src="jquery/jquery.min.js"></script>
            <script src="moment/moment.js"></script>
            <script src="d3/d3.min.js"></script>
            <script src="cal-heatmap/cal-heatmap.min.js"></script>
            <script src="github-cal.js"></script>

            <script>
                $(document).ready(function(){
                    githubCal.init('#github-cal', {
                        proxy: [proxy url],
                        username: [github username]
                    });
                });
            </script>

        </body>

    </html>
