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
    }


    async showAllDistricts() {
        $(".moveDistrictsToHere").empty();
        $(".districtsAndLocations").find(".visitorstext").removeClass("d-none")
        $(".districtsAndLocations").find(".locationsOfADistrict").addClass("d-none")

        const district = $(".districts.d-none").first().clone().removeClass("d-none");
        $(".moveDistrictsToHere").append(district);

        let districtsData = await this.obaLocationRepository.getDistricts();

        for (let i = 0; i < districtsData.length; i++) {
            const districtNameAndViewLocations = $(".districtName.d-none").first().clone().removeClass("d-none");

            districtNameAndViewLocations.find(".district").text(districtsData[i]["name"]);
            districtNameAndViewLocations.find('.district').attr(`data-id`, i);
            districtNameAndViewLocations.find(".viewLocations").text(">>");
            districtNameAndViewLocations.find('.viewLocations').attr(`data-id`, i);

            district.append(districtNameAndViewLocations);

            district.on('click', '.district[data-id="' + i + '"]', function () {
                console.log(districtsData[i]["name"]);
            });

            district.on('click', '.viewLocations[data-id="' + i + '"]', (event) =>
                this.viewLocations(event, districtsData[i]));
        }
    }

    async viewLocations(event, district) {
        event.preventDefault();
        $(".moveDistrictsToHere").empty();
        const districtDiv = $(".districts.d-none").first().clone().removeClass("d-none");
        $(".moveDistrictsToHere").append(districtDiv);

        let locations = await this.obaLocationRepository.getAllLocations(district["id"]);
        console.log(locations);

        $(".districtsAndLocations").find(".visitorstext").addClass("d-none")
        const chosenDistrict = $(".locationsOfADistrict.d-none").removeClass("d-none");
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

            locationCard.on('click', () => this.selectDate(locations[i]) &&
                $("#locationName").text(locations[i]["location_name"]));

            districtDiv.append(locationCard);
        }

        $(".districtsAndLocations").on('click', '.goBackToDistricts', () => {
            this.showAllDistricts()
        });
    }

    //Shows dropdown menu with different date options
    async selectDate(location) {
        $(".chartAndButtonsDiv").empty();
        const dateDropdown = $(".dateDropdown.dropdown.d-none").first().clone().removeClass("d-none");
        $(".chartAndButtonsDiv").append(dateDropdown);

        let allDate = await this.obaLocationRepository.getAllDate();
        for (let i = 0; i < allDate.length; i++) {
            const dates = dateDropdown.find(".dateDropdown-item.d-none").first().clone().removeClass("d-none");

            dates.text(allDate[i]["name"]);
            dates.attr(`data-id`, i);

            dateDropdown.find(".dateDropdown-menu").append(dates);

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + i + '"]', function () {
                console.log(allDate[i]["name"]);
            });
        }

        dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 1 + '"]', () =>
            this.disableButton(allDate, 1) && this.selectYear(location, "month"));

        dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 3 + '"]', () =>
            this.disableButton(allDate, 3) && this.selectYear(location, "year"));
    }

    //Shows dropdown menu with year options
    async selectYear(location, type) {
        this.removePickDateButton();
        this.removeChart();

        const yearDropdown = $(".yearDropdown").first().clone().removeClass("d-none");
        $(".chartAndButtonsDiv").append(yearDropdown);

        let allYears = await this.obaLocationRepository.getAllYears(location["alias_name"]);

        for (let i = 0; i < allYears.length; i++) {
            let visitorDataYear = await this.obaLocationRepository.getChosenYear(location["alias_name"], allYears[i]["year"]);

            //Checks if the visitor data of every month of a year is null
            let checkIfYearDataIsEmpty = 0;
            for (let j = 0; j < visitorDataYear.length; j++) {
                if (visitorDataYear[j]["amount"] === 0) {
                    checkIfYearDataIsEmpty++;
                }
            }

            if (checkIfYearDataIsEmpty < visitorDataYear.length) {
                const years = yearDropdown.find(".yearDropdown-item.d-none").first().clone().removeClass("d-none");
                years.text(allYears[i]["year"]);
                years.attr(`data-id`, i);

                yearDropdown.find(".yearDropdown-menu").append(years);
            }

            let allMonthsOfAYear = await this.obaLocationRepository.getAllMonthsOfAYear();

            switch (type) {
                case "year":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.getYearData(location, allYears[i]["year"], allMonthsOfAYear));
                    break;

                case "month":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.selectMonth(location, allYears[i]["year"], allMonthsOfAYear));
                    break;
            }

        }
    }

    async selectMonth(location, year, allMonthsOfAYear) {
        this.removeChart();
        $(".chartAndButtonsDiv").find(".monthOrQuarterDropdown").remove();
        const monthDropdown = $(".monthOrQuarterDropdown").first().clone().removeClass("d-none");
        $(".chartAndButtonsDiv").append(monthDropdown);

        for (let i = 0; i < allMonthsOfAYear.length; i++) {
            let visitorDataMonth = await this.obaLocationRepository.getAllMonths(location["alias_name"], year, allMonthsOfAYear[i]["name"]);
            //Checks if the visitor data of every month of a year is null
            let checkIfMonthDataIsEmpty = 0;
            for (let j = 0; j < visitorDataMonth.length; j++) {
                if (visitorDataMonth[j]["amount"] === 0) {
                    checkIfMonthDataIsEmpty++;
                }
            }

            if (checkIfMonthDataIsEmpty < visitorDataMonth.length) {
                const months = monthDropdown.find(".monthOrQuarterDropdown-item.d-none").first().clone().removeClass("d-none");
                months.text(allMonthsOfAYear[i]["name"]);
                months.attr(`data-id`, i);

                monthDropdown.find(".monthOrQuarterDropdown-menu").append(months);
            }

            monthDropdown.find(".monthOrQuarterDropdown-menu").on('click', '.monthOrQuarterDropdown-item[data-id="' + i + '"]', () =>
                this.getMonthData(location, year, allMonthsOfAYear[i]["name"]));
        }
    }

    async getMonthData(location, year, month) {
        console.log(year, month, location);
        let visitorDataAllDaysOfMonth = await this.obaLocationRepository.getChosenMonth(location["alias_name"], year, month);
        let days = [];
        let monthData = [];
        let color = []; // class attribute?
        let borderColor = []; // class attribute?

        for (let i = 0; i < visitorDataAllDaysOfMonth.length; i++) {
            days[i] = visitorDataAllDaysOfMonth[i]["day"];
            monthData[i] = visitorDataAllDaysOfMonth[i]["visitors"];
            color = 'rgba(255, 159, 64, 0.5)';
            borderColor = 'rgb(255, 159, 64)';
        }

        console.log(visitorDataAllDaysOfMonth);
        console.log(days);

        this.showYearChart(days, monthData, color, borderColor, year, "dagen", month + " ");

    }

    async getYearData(location, year, allMonths) {
        console.log(year, location);
        let visitorsYear = await this.obaLocationRepository.getChosenYear(location["alias_name"], year);
        let months = [];
        let yearData = [];
        let color = []; // class attribute?
        let borderColor = []; // class attribute?

        for (let i = 0; i < visitorsYear.length; i++) {
            months[i] = allMonths[i]["name"];
            yearData[i] = visitorsYear[i]["amount"];
            color = 'rgba(75, 192, 192, 0.5)';
            borderColor = 'rgb(75, 192, 192)';
        }

        console.log(visitorsYear);

        this.showYearChart(months, yearData, color, borderColor, year, "maanden", "");
    }

    async showYearChart(label, data, color, borderColor, year, labelType, type) {
        this.removeChart();

        const chartDiv = $(".chart").first().clone().removeClass("d-none");
        const chart = $(".choseDateChart").first().clone().removeClass("d-none").attr('id', 'choseDateChart');
        $(".chartAndButtonsDiv").append(chartDiv.append(chart));

        new Chart(document.getElementById('choseDateChart'), {
            type: 'bar',
            data: {
                labels: label,
                datasets: [{
                    label: "OBA bezoekers",
                    backgroundColor: color,
                    borderColor: borderColor,
                    borderWidth: 2,
                    data: data,
                }]
            },
            options: {
                legend: {display: false},
                title: {
                    display: true,
                    text: 'OBA bezoekers: ' + type + year
                },
                scales: {
                    xAxes: [{
                        scaleLabel: {
                            display: true,
                            labelString: 'Bezoekersaantal in ' + labelType
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                        }
                    }]
                }

            }
        });
    }

    //Enables all buttons first and then disable the button that is clicked
    async disableButton(allDate, id) {
        for (let i = 0; i < allDate.length; i++) {
            $(".dateDropdown.dropdown").find('.dateDropdown-item[data-id="' + i + '"]').attr("disabled", false);
        }
        $(".dateDropdown.dropdown").find('.dateDropdown-item[data-id="' + id + '"]').attr("disabled", true);
    }

    //Removes chart and the chart id
    removeChart() {
        $(".chart").find(".choseDateChart").removeAttr('id');
        $(".chartAndButtonsDiv").find(".chart").remove();
    }

    //Checks if an date dropdown is still in a div and removes it
    removePickDateButton() {
        $(".chartAndButtonsDiv").find(".yearDropdown").remove();
        $(".chartAndButtonsDiv").find(".monthOrQuarterDropdown").remove();
    }


    //                 label: "OBA bezoekers",
    //                 backgroundColor: [
    //                     'rgba(255, 205, 86, 0.5)',
    //                     'rgba(255, 205, 86, 0.5)',
    //                     'rgba(255, 205, 86, 0.5)',
    //                     'rgba(255, 205, 86, 0.5)',
    //                     'rgba(255, 205, 86, 0.5)',
    //                     'rgba(255, 205, 86, 0.5)',
    //                     'rgba(255, 205, 86, 0.5)',
    //
    //                     // 'rgba(255, 99, 132, 0.5)',
    //                     // 'rgba(255, 159, 64, 0.5)',
    //                     // 'rgba(255, 205, 86, 0.5)',
    //                     // 'rgba(75, 192, 192, 0.5)',
    //                     // 'rgba(54, 162, 235, 0.5)',
    //                     // 'rgba(153, 102, 255, 0.5)',
    //                     // 'rgba(201, 203, 207, 0.5)'
    //                 ],
    //                 borderColor: [
    //                     'rgb(255, 205, 86)',
    //                     'rgb(255, 205, 86)',
    //                     'rgb(255, 205, 86)',
    //                     'rgb(255, 205, 86)',
    //                     'rgb(255, 205, 86)',
    //                     'rgb(255, 205, 86)',
    //                     'rgb(255, 205, 86)',
    //
    //                     // 'rgb(255, 99, 132)',
    //                     // 'rgb(255, 159, 64)',
    //                     // 'rgb(255, 205, 86)',
    //                     // 'rgb(75, 192, 192)',
    //                     // 'rgb(54, 162, 235)',
    //                     // 'rgb(153, 102, 255)',
    //                     // 'rgb(201, 203, 207)'
    //                 ],

    //Called when the login.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}
