class VisitorYearController {
    constructor() {
        this.visitorYearRepository = new VisitorYearRepository();

        $.get("views/visitorYear.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the visitorYear.html has been loaded
    setup(data) {
        //Load the dashboard-content into memory
        this.visitorYear = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.visitorYear);

        this.buildYearChart()
    }

    //Called when the dashboard.html failed to load
    error() {
        $(".content").html("Failed to load the chart!");
    }

    /**
     * async function that builds the chart using chart.js
     */
    async buildYearChart() {
        let promise = await this.visitorYearRepository.getYearData();
        let locations = [];
        let years = [];
        let visitors = [];

        //Puts locations in array
        for (let i = 0; i < promise.length; i++) {
            locations[i] = promise[i].location
            years[i] = promise[i].year
            visitors[i] = promise[i].amount
        }

        //Builds chart in canvas element
        const CHART = document.getElementById('chartYear').getContext('2d');

        //Create random colours for each chart line
        var randomColorGenerator = function () {
            return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
        };

        //Create chart with data of one OBA location
        let myLineChart = new Chart(CHART, {
            type: 'line',
            options: {
                elements: {
                    line: {
                        tension: 0
                    }
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true
                        }
                    }]
                },
            },
            data: {
                labels: [years[0], years[1], years[2], years[3], years[4]],
                datasets: [
                    {
                        label: locations[0],
                        backgroundColor: 'transparent',
                        borderColor: 'purple',
                        borderWidth: 2,
                        fill: false,
                        data: [visitors[0], visitors[1], visitors[2], visitors[3], visitors[4]],
                    },
                ],
            }
        });

        //Add the data dynamically to the graph, the lines will be hidden in the graph
        for (let i = 5; i < locations.length; i += 5) {
            myLineChart.data.datasets.push({
                label: locations[i],
                backgroundColor: 'transparent',
                borderColor: randomColorGenerator(),
                borderWidth: 2,
                fill: false,
                data: [visitors[i], visitors[i + 1], visitors[i + 2], visitors[i + 3], visitors[i + 4]],
                hidden: true
            });
        }
        myLineChart.update();
    }
}