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
        let amount = [];

        //Puts locations in array
        for (let i = 0; i < promise.length; i++) {
            locations[i] = promise[i].location
            years[i] = promise[i].year
            amount[i] = promise[i].visitors
        }


        //Builds chart in canvas element
        let chart = document.getElementById('chartYear').getContext('2d');

        let myChart = new Chart(chart, {
            type: 'line',
            data: {
                labels: locations,
                datasets: [{
                    label: 'Drukte per jaar',
                    data: amount,
                }]
            },
            options: {
                plugins: {
                    title: {
                        text: 'Chart.js Time Scale',
                        display: true
                    }
                },
                scales: {
                    x: {
                        type: 'time',
                        time: {
                            unit: 'year'
                        }
                    },
                    y: {
                        title: {
                            display: true,
                            text: 'value'
                        }
                    }
                },
            },
        });
    }
}