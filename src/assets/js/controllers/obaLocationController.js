class ObaLocationController {
    constructor() {
        this.obaLocationRepository = new ObaLocationRepository();

        $.get("views/obaLocation.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the obaLocation.html has been loaded
    setup(data) {
        //Load content into memory
        this.obaLocationView = $(data);

        //Change colour of navbar item
        $(".nav-item").removeClass("active");
        $(".obaLocationItem").addClass("active");

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.obaLocationView);
        this.showAllDistricts();
        this.showWeekChart();
    }


    async showAllDistricts() {
        let districts = await this.obaLocationRepository.getDistricts();
        console.log(districts);

        for (let i = 0; i < districts.length; i++) {
            const divClone = $(".districtName.d-none").first().clone().removeClass("d-none");

            divClone.find(".district").text(districts[i]["name"]);
            divClone.find('.district').attr(`data-id`, i);
            divClone.find(".viewLocations").text(">>");
            divClone.find('.viewLocations').attr(`data-id`, i);

            $(".districts").append(divClone);

            $(".districts").on('click', '.district[data-id="' + i + '"]', function () {
                console.log(districts[i]["name"]);
            });

            $(".districts").on('click', '.viewLocations[data-id="' + i + '"]', (event) =>
                this.viewLocations(event, districts[i]));
        }
    }

    async viewLocations(event, district) {
        event.preventDefault();
        $(".districts").empty();

        let locations = await this.obaLocationRepository.getAllLocations(district["id"]);
        console.log(locations);

        $(".obalocationsDiv").find(".visitorstext").addClass("d-none")
        const chosenDistrict = $(".textdiv.d-none").removeClass("d-none");
        chosenDistrict.find(".goBackToDistricts");
        chosenDistrict.find(".districtText").removeClass("ml-3").text(district["name"]);


        for (let i = 0; i < locations.length; i++) {
            const locationCard = $(".locationCard.d-none").first().clone().removeClass("d-none");

            locationCard.find(".locationImage").attr("src", locations[i]["image"]);
            locationCard.find(".locationName").text(locations[i]["location_name"]);
            locationCard.find(".locationAddress").text(locations[i]["address"]);
            if (locations[i]["visitor_data"] === "data available") {
                locationCard.find(".dataAvailable").text("Gegevens beschikbaar");
            } else {
                locationCard.find(".dataAvailable").addClass("text-red-500").text("Gegevens niet beschikbaar");
                locationCard.prop("disabled", true);
            }

            locationCard.on('click', () => this.selectDate(locations[i]));

            $(".districts").append(locationCard);
        }

        $(".obalocationsDiv").on('click', '.goBackToDistricts', () => {
                $.get("views/obaLocation.html")
                    .done((data) => this.setup(data))
                    .fail(() => this.error());
            }
        );
    }

    //Shows dropdown menu with different date options
    async selectDate(location) {
        $(".dateDropdown-menu").empty();
        $(".chartAndButtonsDiv").empty();
        $(".yearDropdown").addClass("d-none");
        const dateDropdown = $(".dateDropdown.dropdown.d-none").first().clone().removeClass("d-none");
        $(".chartAndButtonsDiv").append(dateDropdown);

        let allDate = await this.obaLocationRepository.getAllDate();
        console.log(allDate);
        for (let i = 0; i < allDate.length; i++) {
            const dates = dateDropdown.find(".dateDropdown-item.d-none").first().clone().removeClass("d-none");

            dates.text(allDate[i]["name"]);
            dates.attr(`data-id`, i);

            dateDropdown.find(".dateDropdown-menu").append(dates);

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + i + '"]', function () {
                console.log(allDate[i]["name"]);
            });
        }

        dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 3 + '"]', () =>
            dateDropdown.find('.dateDropdown-item[data-id="' + 3 + '"]').attr("disabled", true) &&
            this.selectYear(location));
    }

    //Shows dropdown menu with year options
    async selectYear(location) {
        //Removes display-none, so that it is shown on the screen
        const yearDropdown = $("#yearDropdown").first().clone().removeClass("d-none");
        $(".chartAndButtonsDiv").append(yearDropdown);



        let allYears = await this.obaLocationRepository.getAllYears();
        console.log(allYears);

        for (let i = 0; i < allYears.length; i++) {
            const years = yearDropdown.find(".yearDropdown-item.d-none").first().clone().removeClass("d-none");

            years.text(allYears[i]["year"]);
            years.attr(`data-id`, i);

            yearDropdown.find(".yearDropdown-menu").append(years);

            yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                this.showYearChart(allYears[i]["year"], location));
        }
    }

    async showYearChart(year, location) {
        console.log(year, location);

        //Chart color
        let color = [];
        let borderColor = [];

        for (let i = 0; i < 12; i++) {
            color = 'rgba(75, 192, 192, 0.5)';
            borderColor = 'rgb(75, 192, 192)';
        }

        //get all months in a year to display in chart
        let months = [];
        let getAllMonths = await this.obaLocationRepository.getAllMonths();
        for (let i = 0; i < getAllMonths.length; i++) {
            months[i] = getAllMonths[i]["name"];
        }

        let monthData = [];
        let visitorDataYear = await this.obaLocationRepository.getChosenYear(location["alias_name"], year);
        for (let i = 0; i < visitorDataYear.length; i++) {
            monthData[i] = visitorDataYear[i]["SUM(`visitors`)"];
        }

        console.log(visitorDataYear);

        $(".chart").find(".allMonthsOfAYearChart").removeAttr('id');
        $(".chartAndButtonsDiv").find(".chart").remove();

        const chartDiv = $(".chart").first().clone().removeClass("d-none");
        const monthsChart = $(".allMonthsOfAYearChart").first().clone()
            .removeClass("d-none").attr('id', 'allMonthsOfAYearChart'); //id blijft gelden over verwijderde element
        chartDiv.append(monthsChart);
        $(".chartAndButtonsDiv").append(chartDiv)


        new Chart(document.getElementById('allMonthsOfAYearChart'), {
            type: 'bar',
            data: {
                labels: months,
                datasets: [{
                    label: "OBA bezoekers",
                    backgroundColor: color,
                    borderColor: borderColor,
                    borderWidth: 2,
                    data: monthData,
                }]
            },
            options: {
                legend: {display: false},
                title: {
                    display: true,
                    text: 'OBA bezoekers over ' + year
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                }

            }
        });
    }

    async showWeekChart() {
        let week = await this.obaLocationRepository.getChosenWeek("OBA Indische buurt", 5, 2019);
        console.log(week);
        new Chart(document.getElementById("weekChart"), {
            type: 'bar',
            data: {
                labels: ["Maandag", "Dinsdag", "Woensdag", "Donderdag", "Vrijdag", "Zaterdag", "Zondag"],
                datasets: [{
                    label: "OBA bezoekers",
                    backgroundColor: [
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(255, 205, 86, 0.5)',
                        'rgba(255, 205, 86, 0.5)',

                        // 'rgba(255, 99, 132, 0.5)',
                        // 'rgba(255, 159, 64, 0.5)',
                        // 'rgba(255, 205, 86, 0.5)',
                        // 'rgba(75, 192, 192, 0.5)',
                        // 'rgba(54, 162, 235, 0.5)',
                        // 'rgba(153, 102, 255, 0.5)',
                        // 'rgba(201, 203, 207, 0.5)'
                    ],
                    borderColor: [
                        'rgb(255, 205, 86)',
                        'rgb(255, 205, 86)',
                        'rgb(255, 205, 86)',
                        'rgb(255, 205, 86)',
                        'rgb(255, 205, 86)',
                        'rgb(255, 205, 86)',
                        'rgb(255, 205, 86)',

                        // 'rgb(255, 99, 132)',
                        // 'rgb(255, 159, 64)',
                        // 'rgb(255, 205, 86)',
                        // 'rgb(75, 192, 192)',
                        // 'rgb(54, 162, 235)',
                        // 'rgb(153, 102, 255)',
                        // 'rgb(201, 203, 207)'
                    ],
                    borderWidth: 2,
                    data: [week[0]["visitors"], week[1]["visitors"], week[2]["visitors"], week[3]["visitors"],
                        week[4]["visitors"], week[5]["visitors"], week[6]["visitors"]],
                }]
            },
            options: {
                legend: {display: false},
                title: {
                    display: true,
                    text: 'OBA bezoekers over (geselecteerde week hier...)'
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                }

            }
        });
    }

    //Called when the login.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}
