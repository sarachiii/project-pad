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

        this.getData()

    }

    /**
     * async function that builds the chart using chart.js
     */
    // async buildYearChart() {
    //
    //     try {
    //         let data = await this.visitorYearRepository.getYearData();
    //         let locations = [];
    //         let years = [];
    //         let visitors = [];
    //         let myChart;
    //
    //         //Put all data in arrays
    //         for (let i = 0; i < data.length; i++) {
    //             locations[i] = data[i].location
    //             years[i] = data[i].year
    //             visitors[i] = data[i].amount
    //         }
    //
    //         //Create random colours for each chart bar
    //         var randomColorGenerator = function () {
    //             return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
    //         };
    //
    //         //Call createChart method
    //         createChart();
    //
    //         //Create chart
    //         function createChart()
    //         {
    //             myChart = new Chart($('#chartInYears'), {
    //                 type: 'bar',
    //                 data: {
    //                     labels: [years[0], years[1], years[2], years[3], years[4]],
    //                     datasets: [],
    //                 },
    //                 options: {
    //                     responsive: true,
    //                     legend: {
    //                         position: 'left',
    //                     },
    //                 },
    //             });
    //         }
    //
    //         //Make array to store selected checkbox values
    //         let selectedLocations = [];
    //
    //         //Click event of checkbox
    //         $('#selectbox').click(function () {
    //
    //             //reset chart
    //             myChart.destroy();
    //             createChart();
    //
    //             //Reset data in chart
    //             // myChart.data.labels.pop();
    //             // myChart.data.datasets.forEach((dataset) => {
    //             //     dataset.data.pop();
    //             // });
    //             // myChart.update();
    //
    //             //Fill array with selected items from dropdown menu
    //             $('#selectbox :selected').each(function (i, sel) {
    //                 selectedLocations.push($(sel).val() * 5);
    //             });
    //             console.log(selectedLocations);
    //
    //             //Add the selected data dynamically to the graph
    //             for (let i = 0; i < selectedLocations.length; i++) {
    //                 myChart.data.datasets.push({
    //                     label: locations[selectedLocations[i]],
    //                     backgroundColor: randomColorGenerator(),
    //                     borderWidth: 2,
    //                     data: [visitors[selectedLocations[i]], visitors[selectedLocations[i] + 1],
    //                         visitors[selectedLocations[i] + 2], visitors[selectedLocations[i] + 3],
    //                         visitors[selectedLocations[i] + 4]],
    //                     hidden: false
    //                 });
    //                 myChart.update();
    //                 selectedLocations = []; //Empty array
    //             }
    //         });
    //     } catch (e) {
    //         //if unauthorized error show error to user
    //         if (e.code === 401) {
    //             this.visitorYear
    //                 .find(".error")
    //                 .html(e.reason);
    //         } else {
    //             console.log(e);
    //         }
    //     }
    // }
    async getData() {

        try {
            let data = await this.visitorYearRepository.getYearData();
            let allLocations = await this.visitorYearRepository.getAllLocations();

            let distinctLocations = [];
            let locations = [];
            let years = [];
            let visitors = [];

            //Put all data in arrays
            for (let i = 0; i < data.length; i++) {
                locations[i] = data[i].location
                years[i] = data[i].year
                visitors[i] = data[i].amount
            }

            for (let i = 0; i < allLocations.length; i++) {
                distinctLocations[i] = allLocations[i].location;
                const option = $(".option").first().clone().removeClass("d-none").text(distinctLocations[i]).val(i);
                $("#selectbox").append(option);
            }

            await this.showChart(locations, years, visitors);

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

    async showChart(locations, label, visitors) {
        this.removeChart();

        const CHART = $(".chartInYears").first().clone().removeClass("d-none").attr('id', 'chartInYears');
        $(".chartContainer").append(CHART);

        let chartInYears = new Chart($('#chartInYears'), {
            type: 'bar',
            data: {
                labels: [label[0], label[1], label[2], label[3], label[4]],
                datasets: [],
            },
            options: {
                responsive: true,
                legend: {
                    position: 'left',
                },
            },
        });

        //Make array to store selected checkbox values
        let selectedLocations = [];

        //Click event of checkbox
        $('#selectbox').click(function () {

            $('button').removeClass('d-none'); //Show remove button
            $(this).children('option:selected').attr("disabled", true); //Prevent double clicking on item

            //Fill array with selected items from dropdown menu
            $('#selectbox :selected').each(function (i, sel) {
                selectedLocations.push($(sel).val() * 5);
            });

            //Create random colours for each chart bar
            var randomColorGenerator = function () {
                return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
            };

            //Add the selected data dynamically to the graph
            for (let i = 0; i < selectedLocations.length; i++) {
                chartInYears.data.datasets.push({
                    label: locations[selectedLocations[i]],
                    backgroundColor: randomColorGenerator(),
                    borderWidth: 2,
                    data: [visitors[selectedLocations[i]], visitors[selectedLocations[i] + 1],
                        visitors[selectedLocations[i] + 2], visitors[selectedLocations[i] + 3],
                        visitors[selectedLocations[i] + 4]],
                    hidden: false
                });
                chartInYears.update();
                selectedLocations = []; //Empty array
            }
        });
    }

    //Removes chart and the chart id
    removeChart() {
        $(".chartInYears").removeAttr('id');
        $(".chartContainer").find(".chartInYears").remove();
    }

    //Called when the visitorYear.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}