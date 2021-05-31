class WeekdayVisitorsController {
    constructor() {
        this.weekdayVisitorsRepository = new weekdayVisitorsRepository();

        $.get("views/weekdayVisitors.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());

        $.get("views/submenu.html")
            .done((data) => this.setupSubmenu(data))
            .fail(() => this.error());
    }

    setupSubmenu(data){
        this.submenuView = $(data);
        $("#submenu").append(this.submenuView);

        //Change view with submenu
        $("#locationsub").on('click', () => {
            new ObaLocationController();
        });
        $("#yearsub").on('click', () => {
            new VisitorYearController();
        });
        $("#differencesub").on('click', () => {
            new DifferenceYearsController();
        });
        $("#weekdaysub").on('click', () => {
            new WeekdayVisitorsController();
        });
    }

    //Called when the weekdayVisitors.html has been loaded
    setup(data) {
        //Load content into memory
        this.weekdayVisitorsView = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.weekdayVisitorsView);

        $('title', window.parent.document).text('Bezoekers per weekdag')

        this.getOptions()
    }

    //Called when weekdayVisitors.html failed to load
    error() {
        $(".content").html("Failed to load the chart!");
    }

    //function to generate the options available to pick
    async getOptions() {

        const DAYSAMOUNT = 7;
        const FONTSIZE = 16;

        //get options from datatbase
        let promiseYear = await this.weekdayVisitorsRepository.getyearOptions()
        let promiseLocation = await this.weekdayVisitorsRepository.getlocationOptions()

        let yearOptions = [];
        let locationOptions = [];

        //put all options in arrays
        for (let i = 0; i < promiseYear.length; i++) {
            yearOptions[i] = promiseYear[i].year
        }

        for (let i = 0; i < promiseLocation.length; i++) {
            locationOptions[i] = promiseLocation[i].location
        }


        //add options to html
        for (let i = 0; i < yearOptions.length; i++) {
            $("#yearOptions").append("<option value =" + yearOptions[i] + ">" + yearOptions[i] + "</option>")
        }

        for (let i = 0; i < locationOptions.length; i++) {
            $("#locationOptions").append("<option value =" + "'" + locationOptions[i] + "'" + ">" + locationOptions[i] + "</option>");
        }


        //function to buildchart is called when selection is changed
        $(".options").change(async function () {
            $("#canvasdiv").empty()
            $("#canvasdiv").append("<canvas id = weekdayCanvas style='height: 700px'></canvas>")


            let average = [];
            let color = "#FF0000";
            let weekDayVisitorsRepository = new weekdayVisitorsRepository();

            //get chosen location and year
            const year = $("#yearOptions").val();
            const location = $("#locationOptions").val();

            //check if an option is selected
            if (year != null && location != null) {

                let chartPromise = await weekDayVisitorsRepository.getWeekdayData(year, location)

                //check if there is a response thats 7 days long
                if (chartPromise.length != DAYSAMOUNT) {
                    alert("Geen data beschikbaar");
                } else {

                    //add data to array
                    for (let i = 0; i < DAYSAMOUNT; i++) {
                        average[i] = Math.round(chartPromise[i].average);
                    }

                    //chart setup and config
                    const labels = [
                        'maandag',
                        'dinsdag',
                        'woensdag',
                        'donderdag',
                        'vrijdag',
                        'zaterdag',
                        'zondag'
                    ];
                    const data = {
                        labels: labels,
                        datasets: [{
                            label: (location + " (" + year + ")"),
                            backgroundColor: color,
                            borderColor: color,
                            data: average,
                        }]
                    };

                    const config = {
                        type: 'bar',
                        data,
                        options: {
                            responsive: true,
                            maintainAspectRatio: false,
                            scales: {
                                yAxes: [{
                                    ticks: {
                                        fontSize: FONTSIZE
                                    },
                                    scaleLabel: {
                                        fontSize: FONTSIZE,
                                        display: true,
                                        labelString: 'gemiddeld aantal bezoekers'
                                    },
                                }],

                                xAxes: [{
                                    ticks: {
                                        fontSize: FONTSIZE
                                    }
                                }]
                            }
                        }
                    };

                    //build chart
                    new Chart(weekdayCanvas, config)
                }
            }

        });
    }
}