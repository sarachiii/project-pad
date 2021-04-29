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
        console.log(CHART);

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
                datasets: []
            }
        });

        //add the data dynamically to the graph
        for (let i = 0; i < locations.length; i += 5) {
            myLineChart.data.datasets.push({
                label: locations[i],
                backgroundColor: 'transparent',
                borderColor: 'green',
                borderWidth: 2,
                fill: false,
                data: [visitors[i], visitors[i + 1], visitors[i + 2], visitors[i + 3], visitors[i + 4]]
            });
        }
        myLineChart.update();
    }
}