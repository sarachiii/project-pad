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


            new Chart($('#chartYear'), {
                type: 'line',
                data: {
                    //labels: [0, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100],
                    labels: years,
                    datasets: [{
                        label: "OBA bezoekers",
                        backgroundColor: 'rgb(255, 99, 132, 0.4)',
                        borderColor: 'rgb(255, 99, 132)',
                        borderWidth: 2,
                        data: visitors,
                        // data: [visitors[i], visitors[i + 1], visitors[i + 2], visitors[i + 3], visitors[i + 4]],
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

