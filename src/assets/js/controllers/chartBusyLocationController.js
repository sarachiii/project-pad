class chartBusyLocationController {
    constructor() {
        this.chartBusyLocationRepository = new chartBusyLocationRepository();

        $.get("views/busyLocations.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the busyLocations.html has been loaded
    setup(data) {
        //Load the dashboard-content into memory
        this.busyLocations = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.busyLocations);

        this.test()
    }

    //Called when the dashboard.html failed to load
    error() {
        $(".content").html("Failed to load the chart!");
    }

    async test() {
        let promise = await this.chartBusyLocationRepository.get();



        let locations = [];
        let amount = [];
        let totalAmount = [];
        let colors = [];

        for (let i = 0; i < promise.length; i++) {
            locations[i] = promise[i].Location
        }

        for (let i = 0; i < promise.length; i++) {
            amount[i] = promise[i].Amount
        }

        for (let i = 0; i < promise.length; i++) {
            totalAmount[i] = promise[i].TotalAmount
        }

        let percentage = [];
        let maxValue = 100;

        for (let i = 0; i < locations.length; i++) {
            percentage[i] = Math.round((amount[i] / totalAmount[i]) * maxValue)

            if(percentage[i] <= 33) {
                colors[i] = 'rgba(0, 255, 0)'
            } else if (percentage[i] <= 66) {
                colors[i] = 'rgba(255, 150, 0)'
            } else if (percentage[i] <= 100) {
                colors[i] = 'rgba(255, 0, 0)'
            }

        }

        let myChart = document.getElementById('myChart').getContext('2d');

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
                        ticks: {
                            beginAtZero: true,
                            max: maxValue
                        }
                    }]
                }
            }
        });
    }
}