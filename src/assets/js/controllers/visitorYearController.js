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
            let myChart;

            //Put all data in arrays
            for (let i = 0; i < data.length; i++) {
                locations[i] = data[i].location
                years[i] = data[i].year
                visitors[i] = data[i].amount
            }

            //Create random colours for each chart bar
            var randomColorGenerator = function () {
                return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
            };

            createChart();

            //Create chart
            function createChart()
            {
                myChart = new Chart($('#chartYear'), {
                    type: 'bar',
                    data: {
                        labels: [years[0], years[1], years[2], years[3], years[4]],
                        datasets: [],
                    },
                    options: {
                        responsive: true,
                        legend: {
                            position: 'left',
                        },
                    },
                });
            }

            //Get checkbox values
            let selectedLocations = [];

            $('#selectbox').click(function () {

                //reset chart
                myChart.destroy();
                createChart();

                //Reset data in chart
                // myChart.data.labels.pop();
                // myChart.data.datasets.forEach((dataset) => {
                //     dataset.data.pop();
                // });
                // myChart.update();

                //Fill array with selected items from dropdown menu
                $('#selectbox :selected').each(function (i, sel) {
                    selectedLocations.push($(sel).val() * 5);
                });
                console.log(selectedLocations);

                //Add the selected data dynamically to the graph
                for (let i = 0; i < selectedLocations.length; i++) {
                    myChart.data.datasets.push({
                        label: locations[selectedLocations[i]],
                        backgroundColor: randomColorGenerator(),
                        borderWidth: 2,
                        data: [visitors[selectedLocations[i]], visitors[selectedLocations[i] + 1], visitors[selectedLocations[i] + 2],
                            visitors[selectedLocations[i] + 3], visitors[selectedLocations[i] + 4]],
                        hidden: false
                    });
                    myChart.update();
                    selectedLocations = []; //Empty array
                }
            });
        } catch (e) {
            //if unauthorized error show error to user
            if (e.code === 401) {
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