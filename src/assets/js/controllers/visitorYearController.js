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

        //Change colour of navbar item
        $(".nav-item").removeClass("active");
        $(".visitorYearItem").addClass("active");

        this.buildYearChart()
    }

    /**
     * async function that builds the chart using chart.js
     */
    async buildYearChart() {

        try {
        let data = await this.visitorYearRepository.getYearData();
        let locations = [];
        let years = [];
        let visitors = [];

        //Puts locations in array
        for (let i = 0; i < data.length; i++) {
            locations[i] = data[i].location
            years[i] = data[i].year
            visitors[i] = data[i].amount
        }

        //Create random colours for each chart line
        var randomColorGenerator = function () {
            return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
        };

        //Create chart with data of one OBA location
        let myLineChart = new Chart($('#chartYear'), {
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
                datasets: [],
            }
        });

        //Add the data dynamically to the graph, the lines will be hidden in the graph
        for (let i = 0; i < locations.length; i += 5) {
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

        } catch(e) {
            //if unauthorized error show error to user
            if(e.code === 401) {
                this.visitorYear
                    .find(".error")
                    .html(e.reason);
            } else {
                console.log(e);
            }
        }
    }

    //Called when the visitorYear.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}