class differenceYearsController {
    constructor() {
        this.differenceYearsRepository = new DifferenceYearsRepository();

        $.get("views/differenceYears.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the visitorYear.html has been loaded
    setup(data) {
        //Load the dashboard-content into memory
        this.differenceYears = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.differenceYears);


        //Change colour of navbar item
        $(".btn-group-vertical").removeClass("active");
        $("#differencesub").addClass("active");

        this.buildYearChart()
    }

    //Called when the dashboard.html failed to load
    error() {
        $(".content").html("Failed to load the chart!");
    }

    // === include 'setup' then 'config' above ===
    async buildYearChart() {
        //Change view with submenu
        $("#locationsub").on('click', () => {
            new ObaLocationController();
        });
        $("#yearsub").on('click', () => {
            new VisitorYearController();
        });
        $("#weekdaysub").on('click', () => {
            new WeekdayVisitorsController();
        });
        $("#districtsub").on('click', () => {
            new BusyDistrictController();
        });

        try {

             let data = await this.differenceYearsRepository.getdifferenceyears();
              let years = [];
              let visitors = [];
            console.log(data);
               //Puts locations in array
            for (let i = 0; i < data.length; i++) {
                  years[i] = data[i].year
            visitors[i] = data[i].amount
             }


            // const dataPercentage = {

            //visitors 1 - visitors 0 / visitors 0 * 100

            let year2016 = Math.round((visitors[1] - visitors[0])/visitors[0] * 100);
            let year2017 = Math.round((visitors[2] - visitors[1])/visitors[1] * 100);
            let year2018 = Math.round((visitors[3] - visitors[2])/visitors[2] * 100);
            let year2019 = Math.round((visitors[4] - visitors[3])/visitors[3] * 100);
            let year2020 = Math.round((visitors[5] - visitors[4])/visitors[4] * 100);

            console.log(year2016)
            console.log(year2017)
            console.log(year2018)
            console.log(year2019)
            console.log(year2020)

            let percentage = [year2016, year2017, year2018, year2019, year2020];

            // const dataPercentage = {


            new Chart($('#chartYear'), {
                type: 'bar',
                data: {
                    //labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    labels: years,
                    datasets: [{
                        label: "OBA bezoekers",
                        backgroundColor: 'rgb(255, 99, 132, 0.4)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        data: percentage,
                        //data: [visitors[0], visitors[1], visitors[2], visitors[3], visitors[4], visitors[5]],
                    }]
                },
                options: {
                    legend: {display: false},
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
            });

            //   }
        } catch
            (e) {
            //if unauthorized error show error to user
            if (e.code === 401) {
                this.differenceYears
                    .find(".error")
                    .html(e.reason);
            } else {
                console.log(e);
            }
        }
    }
}

