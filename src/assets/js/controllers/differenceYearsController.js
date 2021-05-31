class DifferenceYearsController {
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

        this.buildYearChart()
    }

    //Called when the dashboard.html failed to load
    error() {
        $(".content").html("Failed to load the chart!");
    }

    // === include 'setup' then 'config' above ===
    async buildYearChart() {

        try {

            let data = await this.differenceYearsRepository.getdifferenceyears();
            let years = [];
            let visitors = [];

            for (let i = 0; i < data.length; i++) {
                visitors[i] = data[i].amount
            }

            for (let i = 0; i < data.length - 1; i++) {
                years[i] = data[i + 1].year
            }

            let year2016 = Math.round((visitors[1] - visitors[0]) / visitors[0] * 100);
            let year2017 = Math.round((visitors[2] - visitors[1]) / visitors[1] * 100);
            let year2018 = Math.round((visitors[3] - visitors[2]) / visitors[2] * 100);
            let year2019 = Math.round((visitors[4] - visitors[3]) / visitors[3] * 100);
            let year2020 = Math.round((visitors[5] - visitors[4]) / visitors[4] * 100);

            let percentage = [year2016, year2017, year2018, year2019, year2020];

            new Chart($('#chartYear'), {
                type: 'bar',
                data: {
                    labels: years,
                    datasets: [{
                        label: "Toename/afname t.o.v vorig jaar ",
                        backgroundColor: '#FF0000',
                        borderWidth: 2,
                        data: percentage,
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
                            },
                            scaleLabel: {
                                display: true,
                                labelString: 'In percentages'
                            },
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
            }
        }
    }
}

