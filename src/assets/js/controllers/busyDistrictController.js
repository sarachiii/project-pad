class BusyDistrictController {
    constructor() {
        this.busyDistrictRepository = new BusyDistrictRepository();

        $.get("views/busyDistrict.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the busyDistrict.html has been loaded
    setup(data) {
        //Load the dashboard-content into memory
        this.busyDistricts = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.busyDistricts);

        this.buildChart()
    }

    //Called when the dashboard.html failed to load
    error() {
        $(".content").html("Failed to load the chart!");
    }

    /**
     * async function that builds the chart using chart.js
     */
    async buildChart() {
        let promise = await this.busyDistrictRepository.getDistricts();

        let locations = [];
        let visitors = [];
        let totalAmount = [];
        let colors = [];

        //Puts locations in array
        for (let i = 0; i < promise.length; i++) {
            locations[i] = promise[i].Location
        }

        //Puts amount of people in array
        for (let i = 0; i < promise.length; i++) {
            visitors[i] = promise[i].Amount
        }

        //Puts total amount of people in array
        for (let i = 0; i < promise.length; i++) {
            totalAmount[i] = promise[i].TotalAmount
        }

        let percentage = [];
        const MAXVALUE = 100;

        //calculates percentage and assigns it a color
        for (let i = 0; i < locations.length; i++) {

            if (amount[i] >= totalAmount[i]){
                percentage[i] = MAXVALUE;
            } else {
                percentage[i] = Math.round((amount[i] / totalAmount[i]) * MAXVALUE)
            }

            if(percentage[i] <= 33) {
                colors[i] = 'rgba(0, 255, 0)'
            } else if (percentage[i] <= 66) {
                colors[i] = 'rgba(255, 150, 0)'
            } else if (percentage[i] <= 100) {
                colors[i] = 'rgba(255, 0, 0)'
            }

        }

        //Builds chart in canvas element
        let myChart = document.getElementById('districtGraph').getContext('2d');

        let massPopChart = new Chart(myChart, {
            type: 'horizontalBar',
            data: {
                labels: locations,
                datasets: [{
                    label: 'Drukte',
                    data: percentage,
                    backgroundColor: colors
                }]
            },
            options: {
                legend: {
                    display: false
                },
                maintainAspectRatio: false,
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'huidige drukte in %'
                        },
                        ticks: {
                            callback: function(value) {
                                return value + "%"
                            },
                            beginAtZero: true,
                            max: MAXVALUE
                        }
                    }]
                }
            }
        });
    }
}