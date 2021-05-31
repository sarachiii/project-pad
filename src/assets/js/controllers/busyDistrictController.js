class BusyDistrictController {
    constructor() {
        this.busyDistrictRepository = new BusyDistrictRepository();

        $.get("views/busyDistrict.html")
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

        let promiseDistrict = await this.busyDistrictRepository.getDistricts();
        let promiseMonths = await this.busyDistrictRepository.getMonths();

        let locations = [];
        let visitors = [];
        let totalAmount = [];
        let colors = [];
        let months = [];
        let districts = [];

        //Puts months in array
        for (let i = 0; i < promiseMonths.length; i++) {
            months[i] = promiseMonths[i].name
        }

        //Puts districts in array
        for (let i = 0; i < promiseDistrict.length; i++) {
            districts[i] = promiseDistrict[i].name
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
        let districtChart = document.getElementById('districtChart').getContext('2d');

        let massPopChart = new Chart(districtChart, {
            type: 'horizontalBar',
            data: {
                labels: months,
                datasets: [{
                    label: 'Drukte',
                    data: districts,
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
                            max: 100
                        }
                    }]
                }
            }
        });
    }
}