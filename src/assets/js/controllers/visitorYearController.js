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

        document.title = "Bezoekers per locatie in jaren"

        this.getData()

    }

    async getData() {

        try {
            //get data from database
            let data = await this.visitorYearRepository.getYearData();
            let allLocations = await this.visitorYearRepository.getAllLocations();

            //create empty arrays for the data
            let distinctLocations = [];
            let locations = [];
            let years = [];
            let visitors = [];
            let selectedLocations = [];

            //fill arrays with data
            for (let i = 0; i < data.length; i++) {
                locations[i] = data[i].location
                years[i] = data[i].year
                visitors[i] = data[i].amount
            }

            //fill the dropdown menu with data
            for (let i = 0; i < allLocations.length; i++) {
                distinctLocations[i] = allLocations[i].location;
                const option = $(".option").first().clone().removeClass("d-none").text(distinctLocations[i]).val(i);
                $("#selectbox").append(option);
            }

            //Create canvas for chart
            removeChart();
            const yearChartCopy = $(".chartInYears").first().clone().removeClass("d-none").attr('id', 'chartInYears');
            $("#canvasdiv").append(yearChartCopy);


            //setup graph
            const config = {
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
            };
            let yearChart = new Chart($('#chartInYears'), config)

            //Click function for multiselector
            $('#selectbox').click(function () {
                $('button').removeClass('d-none'); //Show remove button
                $(this).children('option:selected').attr("disabled", true); //Prevent double clicking on item


                //Fill array with selected items from dropdown menu
                selectedLocations.length = 0;
                selectedLocations.push($('#selectbox :selected').val() * 5);

                //Create random colours for each chart bar
                var randomColorGenerator = function () {
                    return '#' + (Math.random().toString(16) + '0000000').slice(2, 8);
                };

                //Add the selected data dynamically to the graph
                for (let i = 0; i < selectedLocations.length; i++) {
                    yearChart.data.datasets.push({
                        label: locations[selectedLocations[i]],
                        backgroundColor: randomColorGenerator(),
                        borderWidth: 2,
                        data: [visitors[selectedLocations[i]], visitors[selectedLocations[i] + 1],
                            visitors[selectedLocations[i] + 2], visitors[selectedLocations[i] + 3],
                            visitors[selectedLocations[i] + 4]],
                        hidden: false
                    });
                    yearChart.update();
                }
            });

            //Delete graph and make a new one
            $('button').click(function () {
                deleteGraph();
                removeChart();
                selectedLocations = []; //empty array
            });

            $("button").on('click', () => {
                    $.get("views/visitorYear.html")
                        .done((data) => this.setup(data))
                        .fail(() => this.error());
                }
            );

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

function deleteGraph() {
    $('button').addClass('d-none'); //hide button
    $('#selectbox').children('option').removeAttr('disabled'); //make all options clickable again
    $('#selectbox').children('option:selected').prop("selected", false); //deselect last choice
}

function removeChart() {
    $("#canvasdiv").find(".chartInYears").removeAttr('id');
    $("#canvasdiv").find(".chartInYears").remove();
    $("#canvasdiv").empty();

}
