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
        $(".btn-group-vertical").removeClass("active");
        $("#yearsub").addClass("active");

        this.getData();
    }

    //Called when the visitorYear.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }

    async getData() {

        //get data from database
        let data = await this.visitorYearRepository.getYearData();
        let uniqueLocationsData = await this.visitorYearRepository.getAllLocations();
        let uniqueYearsData = await this.visitorYearRepository.getUniqueYears();

        //create arrays for the data
        let locations = [];
        let years = [];
        let visitors = [];
        let selectedLocations = [];
        let uniqueYears = [];

        //fill arrays with data
        for (let i = 0; i < data.length; i++) {
            locations[i] = data[i].location
            years[i] = data[i].year
            visitors[i] = data[i].amount
        }

        //fill the dropdown menu with data
        for (let i = 0; i < uniqueLocationsData.length; i++) {
            const option = $(".option").first().clone().removeClass("d-none").text(uniqueLocationsData[i].location).val(i)
            $("#selectbox").append(option)
        }

        //fill array with unique years
        for (let i = 0; i < uniqueYearsData.length; i++) {
            uniqueYears[i] = uniqueYearsData[i].year
        }

        //Create chart
        let yearChart = new Chart($('.chartInYears'), {
            type: 'bar',
            data: {
                labels: uniqueYears,
                datasets: [],
            },
            options: {
                responsive: true,
                legend: {
                    position: 'left',
                },
            },
        });

        //Click function for multiselector
        $('#selectbox').change(function () {

            $('.btn.btn-danger.btn-sm.d-none').removeClass('d-none'); //Show remove button
            $(this).children('option:selected').attr("disabled", true); //Prevent double clicking on item

            //Empty array
            selectedLocations.length = 0;

            //Fill array with selected items from dropdown menu
            selectedLocations.push($('#selectbox :selected').val() * uniqueYears.length);

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
                        visitors[selectedLocations[i] + 4], visitors[selectedLocations[i] + 5]],
                    hidden: false
                });
                yearChart.update();
            }
        });

        //Delete graph and make a new one
        $('.btn.btn-danger.btn-sm').click(function () {
            removeChart();
            selectedLocations = []; //empty array
        });

        $(".btn.btn-danger.btn-sm").on('click', () => {
                $.get("views/visitorYear.html")
                    .done((data) => this.setup(data))
                    .fail(() => this.error());
            }
        );
        //Change view with submenu
        $("#locationsub").on('click', () => {
            new ObaLocationController();
        });
        $("#differencesub").on('click', () => {
            new differenceYearsController();
        });
        $("#weekdaysub").on('click', () => {
            new WeekdayVisitorsController();
        });
        $("#districtsub").on('click', () => {
            new BusyDistrictController();
        });
    }
}

function removeChart() {
    $('.btn.btn-danger.btn-sm').addClass('d-none'); //hide button
    $('#selectbox').children('option').removeAttr('disabled'); //make all options clickable again
    $('#selectbox').children('option:selected').prop("selected", false); //deselect last choice
    $("#canvasdiv").empty();
}
