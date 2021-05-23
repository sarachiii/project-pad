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

        const DISTRICTS = $(".districts.d-none").first().clone().removeClass("d-none");
        $(".moveDistrictsToHere").append(DISTRICTS);

        let districtsData = await this.obaLocationRepository.getDistricts();

        for (let i = 0; i < districtsData.length; i++) {
            const DISTRICTSANDLOCATIONS = $(".districtName.d-none").first().clone().removeClass("d-none");

            DISTRICTSANDLOCATIONS.find(".district").text(districtsData[i]["name"]).attr(`data-id`, i);
            DISTRICTSANDLOCATIONS.find(".viewLocations").text(">>").attr(`data-id`, i);

            DISTRICTS.append(DISTRICTSANDLOCATIONS);

            DISTRICTS.on('click', '.district[data-id="' + i + '"]', function () {
                console.log(districtsData[i]["name"]);
            });

            DISTRICTS.on('click', '.viewLocations[data-id="' + i + '"]', (event) =>
                this.viewLocations(event, districtsData[i]));
        }
    }

    async viewLocations(event, district) {
        event.preventDefault();
        $(".moveDistrictsToHere").empty();
        const DISTRICTDIV = $(".districts.d-none").first().clone().removeClass("d-none");
        $(".moveDistrictsToHere").append(DISTRICTDIV);

        let locations = await this.obaLocationRepository.getAllLocations(district["id"]);
        console.log(locations);

        $(".districtsAndLocations").find(".visitorstext").addClass("d-none")
        const CHOSENDISTRICT = $(".locationsOfADistrict.d-none").removeClass("d-none");
        CHOSENDISTRICT.find(".goBackToDistricts");
        CHOSENDISTRICT.find(".districtText").removeClass("ml-3").text(district["name"]);


        for (let i = 0; i < locations.length; i++) {
            const lOCATIONCARD = $(".locationCard.d-none").first().clone().removeClass("d-none");

            lOCATIONCARD.find(".locationImage").attr("src", locations[i]["image"]);
            lOCATIONCARD.find(".locationName").text(locations[i]["location_name"]);
            lOCATIONCARD.find(".locationAddress").text(locations[i]["address"]);
            if (locations[i]["visitor_data"] === "data available") {
                lOCATIONCARD.find(".dataAvailable").text("Gegevens beschikbaar");
            } else {
                lOCATIONCARD.find(".dataAvailable").addClass("text-red-500").text("Gegevens niet beschikbaar");
                lOCATIONCARD.prop("disabled", true);
            }


            lOCATIONCARD.on('click', function () {
                console.log(locations[i]["location_name"]);
            });

            lOCATIONCARD.on('click', () => this.selectDate(locations[i]) &&
                $("#locationName").text(locations[i]["location_name"]));

            DISTRICTDIV.append(lOCATIONCARD);
        }

        $(".districtsAndLocations").on('click', '.goBackToDistricts', () => {
            this.showAllDistricts()
        });
    }

    //Shows dropdown menu with different date options
    async selectDate(location) {
        let allDate = await this.obaLocationRepository.getAllDate();

        for (let i = 0; i < allDate.length; i++) {
            if ($('.chartAndButtonsDiv').children().length > 0) {
                ($('.chartAndButtonsDiv').find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + i + '"]',
                    function () {
                        $(".chartAndButtonsDiv").find(".buttons").find(".weekDropdown").remove();
                        $(".chartAndButtonsDiv").find(".buttons").find(".yearDropdown").remove();
                        $(".chartAndButtonsDiv").find(".buttons").find(".monthOrQuarterDropdown").remove();
                        $('.chartAndButtonsDiv').empty();
                    }));
            }
            if ($('.chartAndButtonsDiv' + 2).children().length > 0) {
                ($('.chartAndButtonsDiv' + 2).find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + i + '"]',
                    function () {
                        $(".chartAndButtonsDiv" + 2).find(".buttons").find(".weekDropdown").remove();
                        $(".chartAndButtonsDiv" + 2).find(".buttons").find(".yearDropdown").remove();
                        $(".chartAndButtonsDiv" + 2).find(".buttons").find(".monthOrQuarterDropdown").remove();
                        $('.chartAndButtonsDiv' + 2).empty();
                    }));
            }
        }

        let DATEDROPDOWN = $(".dateDropdown.dropdown.d-none").first().clone().removeClass("d-none");
        let BUTTONS = $(".buttons.d-none").first().clone().removeClass("d-none");

        if ($('.chartAndButtonsDiv').children().length <= 0) {
            BUTTONS.append(DATEDROPDOWN);
            $(".chartAndButtonsDiv").append(BUTTONS);
            //this.fillDateDropdown(location, DATEDROPDOWN, "chartAndButtonsDiv");
            let div = "chartAndButtonsDiv";

            for (let i = 0; i < allDate.length; i++) {
                const DATES = DATEDROPDOWN.find(".dateDropdown-item.d-none").first().clone().removeClass("d-none");

                DATES.text(allDate[i]["name"]);
                DATES.attr(`data-id`, i);

                DATEDROPDOWN.find(".dateDropdown-menu").append(DATES);

                DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + i + '"]', function () {
                    console.log(allDate[i]["name"]);
                });
            }

            DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 0 + '"]', () =>
                this.disableButton(allDate, 0) &&
                DATEDROPDOWN.find(".btn.btn-secondary").text("Periode: " + allDate[0]["name"]) &&
                this.selectYear(location, "week", div, 1));

            DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 1 + '"]', () =>
                this.disableButton(allDate, 1) &&
                DATEDROPDOWN.find(".btn.btn-secondary").text("Periode: " + allDate[1]["name"])
                && this.selectYear(location, "month", div, 1));

            DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 2 + '"]', () =>
                this.disableButton(allDate, 2) &&
                DATEDROPDOWN.find(".btn.btn-secondary").text("Periode: " + allDate[2]["name"])
                && this.selectYear(location, "quarter", div, 1));

            DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 3 + '"]', () =>
                this.disableButton(allDate, 3) &&
                DATEDROPDOWN.find(".btn.btn-secondary").text("Periode: " + allDate[3]["name"])
                && this.selectYear(location, "year", div, 1));


        } else if ($('.chartAndButtonsDiv2').children().length <= 0) {
            BUTTONS.append(DATEDROPDOWN);
            $(".chartAndButtonsDiv2").append(BUTTONS);
            let div = "chartAndButtonsDiv2";
            for (let i = 0; i < allDate.length; i++) {
                const DATES = DATEDROPDOWN.find(".dateDropdown-item.d-none").first().clone().removeClass("d-none");

                DATES.text(allDate[i]["name"]);
                DATES.attr(`data-id`, i);

                DATEDROPDOWN.find(".dateDropdown-menu").append(DATES);

                DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + i + '"]', function () {
                    console.log(allDate[i]["name"]);
                });
            }

            DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 0 + '"]', () =>
                this.disableButton(allDate, 0) &&
                DATEDROPDOWN.find(".btn.btn-secondary").text("Periode: " + allDate[0]["name"]) &&
                this.selectYear(location, "week", div, 2));

            DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 1 + '"]', () =>
                this.disableButton(allDate, 1) &&
                DATEDROPDOWN.find(".btn.btn-secondary").text("Periode: " + allDate[1]["name"])
                && this.selectYear(location, "month", div, 2));

            DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 2 + '"]', () =>
                this.disableButton(allDate, 2) &&
                DATEDROPDOWN.find(".btn.btn-secondary").text("Periode: " + allDate[2]["name"])
                && this.selectYear(location, "quarter", div, 2));

            DATEDROPDOWN.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 3 + '"]', () =>
                this.disableButton(allDate, 3) &&
                DATEDROPDOWN.find(".btn.btn-secondary").text("Periode: " + allDate[3]["name"])
                && this.selectYear(location, "year", div, 2));

            //   this.fillDateDropdown(location, DATEDROPDOWN, "chartAndButtonsDiv2");
        } else {
            console.log("Het maximum aantal grafieken (2) is bereikt.")
        }
    }

    //Shows dropdown menu with year options
    async selectYear(location, type, place, placeNumber) {

        let YEARDROPDOWN1 = $(".yearDropdown1").first().clone().removeClass("d-none");
        let YEARDROPDOWN2 = $(".yearDropdown2").first().clone().removeClass("d-none");

        if (place === "chartAndButtonsDiv") {
            this.removePickDateButton(place, placeNumber);
            this.removeChart(place);
            console.log(place);
            YEARDROPDOWN1 = $(".yearDropdown1").first().clone().removeClass("d-none");
            $(".chartAndButtonsDiv").find(".buttons").append(YEARDROPDOWN1);

            this.fillYearDropdown(location, type, place, 1, YEARDROPDOWN1);

        } else if (place === "chartAndButtonsDiv2") {
            console.log(place);
            this.removePickDateButton(place,placeNumber);
            this.removeChart(place);
            YEARDROPDOWN2 = $(".yearDropdown2").first().clone().removeClass("d-none");
            $(".chartAndButtonsDiv2").find(".buttons").append(YEARDROPDOWN2);
            this.fillYearDropdown(location, type, place, 2, YEARDROPDOWN2);
        } else {
            console.log("nopeee")
        }

    }

    async fillYearDropdown(location, type, place, placeNumber, yearDropdown) {
        let allYears = await this.obaLocationRepository.getAllYears(location["alias_name"]);

        for (let i = 0; i < allYears.length; i++) {
            let allMonthsOfAYear = await this.obaLocationRepository.getAllMonthsOfAYear(); //Verplaatsen?!!!
            let visitorDataYear = await this.obaLocationRepository.getChosenYear(location["alias_name"], allYears[i]["year"]);
            //Checks if the visitor data of every month of a year is null
            let checkIfYearDataIsEmpty = 0;
            for (let j = 0; j < visitorDataYear.length; j++) {
                if (visitorDataYear[j]["amount"] === 0) {
                    checkIfYearDataIsEmpty++;
                }
            }

            if (checkIfYearDataIsEmpty < visitorDataYear.length) {
                const YEARS = yearDropdown.find(".yearDropdown-item" + placeNumber + ".d-none").first().clone().removeClass("d-none");
                YEARS.text(allYears[i]["year"]).attr(`data-id`, i);
                yearDropdown.find(".yearDropdown-menu" + placeNumber).append(YEARS);
            }

            yearDropdown.find(".yearDropdown-menu" + placeNumber + "").on('click', '.yearDropdown-item' + placeNumber + '[data-id="' + i + '"]', () =>
                yearDropdown.find(".btn.btn-secondary." + placeNumber).text("Jaar: " + allYears[i]["year"]));

            switch (type) {
                case "year":
                    yearDropdown.find(".yearDropdown-menu" + placeNumber).on('click', '.yearDropdown-item' + placeNumber + '[data-id="' + i + '"]', () =>
                        this.getYearData(location, allYears[i]["year"], allMonthsOfAYear, place, placeNumber));
                    break;
                case "quarter":
                    yearDropdown.find(".yearDropdown-menu" + placeNumber).on('click', '.yearDropdown-item' + placeNumber + '[data-id="' + i + '"]', () =>
                        this.selectQuarter(location, allYears[i]["year"], place, placeNumber));
                    break;
                case "month":
                    yearDropdown.find(".yearDropdown-menu" + placeNumber).on('click', '.yearDropdown-item' + placeNumber + '[data-id="' + i + '"]', () =>
                        this.selectMonth(location, allYears[i]["year"], allMonthsOfAYear, place, placeNumber));
                    break;
                case "week":
                    yearDropdown.find(".yearDropdown-menu" + placeNumber).on('click', '.yearDropdown-item' + placeNumber + '[data-id="' + i + '"]', () =>
                        this.selectWeek(location, allYears[i]["year"], place, placeNumber));
                    break;
            }
        }
    }

    async selectWeek(location, year, place, placeNumber) {
        this.removeChart(place, placeNumber);
        $(".chartAndButtonsDiv").find(".buttons").find(".weekDropdown").remove();
        const WEEKDROPDOWN = $(".weekDropdown").first().clone().removeClass("d-none");
        WEEKDROPDOWN.find(".btn.btn-secondary").text("Week");
        $(".chartAndButtonsDiv").find(".buttons").append(WEEKDROPDOWN);

        let allWeeksOfAYear = await this.obaLocationRepository.getAllWeeksOfAYear(location["alias_name"], year);
        console.log(allWeeksOfAYear)
        for (let i = 0; i < allWeeksOfAYear.length; i++) {
            //Checks if the visitor data of every week of a year is null
            if (allWeeksOfAYear[i]["visitors"] !== 0) {
                const WEEKS = WEEKDROPDOWN.find(".weekDropdown-item.d-none").first().clone().removeClass("d-none");
                WEEKS.text(allWeeksOfAYear[i]["week"]).attr(`data-id`, i);
                WEEKDROPDOWN.find(".weekDropdown-menu").append(WEEKS);
            }


            WEEKDROPDOWN.find(".weekDropdown-menu").on('click', '.weekDropdown-item[data-id="' + i + '"]', () =>
                WEEKDROPDOWN.find(".btn.btn-secondary").text("Week: " + allWeeksOfAYear[i]["week"]) &&
                this.getWeekData(location, year, allWeeksOfAYear[i]["week"]));
        }
    }

    async selectQuarter(location, year, place, placeNumber) {
        this.removeChart(place, placeNumber);
        $(".chartAndButtonsDiv").find(".buttons").find(".monthOrQuarterDropdown").remove();
        const QUARTERDROPDOWN = $(".monthOrQuarterDropdown").first().clone().removeClass("d-none");
        QUARTERDROPDOWN.find(".btn.btn-secondary").text("Kwartaal");
        $(".chartAndButtonsDiv").find(".buttons").append(QUARTERDROPDOWN);

        let quarters = await this.obaLocationRepository.getAllQuarterOfAYear();
        console.log(quarters);

        for (let i = 0; i < quarters.length; i++) {
            let quarterText = QUARTERDROPDOWN.find(".monthOrQuarterDropdown-item.d-none").first().clone().removeClass("d-none");
            quarterText.text(quarters[i]["name"]).attr(`data-id`, i);
            QUARTERDROPDOWN.find(".monthOrQuarterDropdown-menu").append(quarterText);

            QUARTERDROPDOWN.find(".monthOrQuarterDropdown-menu").on('click', '.monthOrQuarterDropdown-item[data-id="' + i + '"]', () =>
                QUARTERDROPDOWN.find(".btn.btn-secondary").text(quarters[i]["name"].substring(0, quarters[i]["name"].indexOf(':'))) &&
                this.getQuarterData(location, year, i, quarters[i]["name"]));
        }
    }

    async selectMonth(location, year, allMonthsOfAYear, place, placeNumber) {
        this.removeChart(place, placeNumber);
        $(".chartAndButtonsDiv").find(".buttons").find(".monthOrQuarterDropdown").remove();
        const MONTHDROPDOWN = $(".monthOrQuarterDropdown").first().clone().removeClass("d-none");
        MONTHDROPDOWN.find(".btn.btn-secondary").text("Maand");
        $(".chartAndButtonsDiv").find(".buttons").append(MONTHDROPDOWN);


        for (let i = 0; i < allMonthsOfAYear.length; i++) {
            let visitorDataMonth = await this.obaLocationRepository.getAllMonths(location["alias_name"], year, allMonthsOfAYear[i]["name"]);
            console.log(visitorDataMonth);
            //Checks if the visitor data of every month of a year is null
            let checkIfMonthDataIsEmpty = 0;
            for (let j = 0; j < visitorDataMonth.length; j++) {
                if (visitorDataMonth[j]["amount"] === 0) {
                    checkIfMonthDataIsEmpty++;
                }
            }

            if (checkIfMonthDataIsEmpty < visitorDataMonth.length) {
                const MONTHS = MONTHDROPDOWN.find(".monthOrQuarterDropdown-item.d-none").first().clone().removeClass("d-none");
                MONTHS.text(allMonthsOfAYear[i]["name"]);
                MONTHS.attr(`data-id`, i);

                MONTHDROPDOWN.find(".monthOrQuarterDropdown-menu").append(MONTHS);
            }

            MONTHDROPDOWN.find(".monthOrQuarterDropdown-menu").on('click', '.monthOrQuarterDropdown-item[data-id="' + i + '"]', () =>
                MONTHDROPDOWN.find(".btn.btn-secondary").text("Maand: " + allMonthsOfAYear[i]["name"]) && this.getMonthData(location, year, allMonthsOfAYear[i]["name"]));
        }
    }

    async getWeekData(location, year, chosenWeek) {
        let days = [];
        let weekData = [];
        let color = [];
        let borderColor = [];
        let week = await this.obaLocationRepository.getChosenWeek(location["alias_name"], year, chosenWeek);

        for (let i = 0; i < week.length; i++) {
            days[i] = week[i]["weekday"];
            weekData[i] = week[i]["visitors"];
            color = 'rgba(255, 205, 86, 0.5)';
            borderColor = 'rgb(255, 205, 86)';

        }

        this.showChart(days, weekData, color, borderColor, year, "dagen", "week: " + chosenWeek + " van ");
        console.log(week);
    }

    async getQuarterData(location, year, numberOfChosenQuarter, chosenQuarterName) {
        let chosenQuarter;
        let weeks = [];
        let quarterData = [];
        let color = [];
        let borderColor = [];

        switch (numberOfChosenQuarter) {
            case 0:
                chosenQuarter = await this.obaLocationRepository.getFirstQuarter(location["alias_name"], year);
                break;
            case 1:
                chosenQuarter = await this.obaLocationRepository.getSecondQuarter(location["alias_name"], year);
                break;
            case 2:
                chosenQuarter = await this.obaLocationRepository.getThirdQuarter(location["alias_name"], year);
                break;
            case 3:
                chosenQuarter = await this.obaLocationRepository.getFourthQuarter(location["alias_name"], year);
                break;
        }

        for (let i = 0; i < chosenQuarter.length; i++) {
            weeks[i] = chosenQuarter[i]["week"];
            quarterData[i] = chosenQuarter[i]["amount"];
            color = 'rgba(255, 99, 132, 0.5)';
            borderColor = 'rgb(255, 99, 132)';

        }
        console.log(chosenQuarter);

        this.showChart(weeks, quarterData, color, borderColor, year, "weken", chosenQuarterName + " ");

    }

    async getMonthData(location, year, month) {
        console.log(year, location, month);
        let days = [];
        let monthData = [];
        let color = [];
        let borderColor = [];
        let visitorDataAllDaysOfMonth = await this.obaLocationRepository.getChosenMonth(location["alias_name"], year, month);

        for (let i = 0; i < visitorDataAllDaysOfMonth.length; i++) {
            days[i] = visitorDataAllDaysOfMonth[i]["day"];
            monthData[i] = visitorDataAllDaysOfMonth[i]["visitors"];
            color = 'rgba(255, 159, 64, 0.5)';
            borderColor = 'rgb(255, 159, 64)';
        }

        console.log(visitorDataAllDaysOfMonth);
        console.log(days);

        this.showChart(days, monthData, color, borderColor, year, "dagen", month + " ");

    }

    async getYearData(location, year, allMonths, place, placeNumber) {
        console.log(year, location);
        let months = [];
        let yearData = [];
        let color = [];
        let borderColor = [];
        let visitorsYear = await this.obaLocationRepository.getChosenYear(location["alias_name"], year);
        let dataVisitorsYear = [visitorsYear[4], visitorsYear[3], visitorsYear[7], visitorsYear[0], visitorsYear[8],
            visitorsYear[6], visitorsYear[5], visitorsYear[1], visitorsYear[11], visitorsYear[10], visitorsYear[9], visitorsYear[2]];

        console.log(dataVisitorsYear);

        for (let i = 0; i < visitorsYear.length; i++) {
            months[i] = allMonths[i]["name"];
            yearData[i] = dataVisitorsYear[i]["amount"];
            color = 'rgba(75, 192, 192, 0.5)';
            borderColor = 'rgb(75, 192, 192)';
        }


        this.showChart(months, yearData, color, borderColor, year, "maanden", "", place, placeNumber);
    }

    async showChart(label, data, color, borderColor, year, labelType, type, place, placeNumber) {
        this.removeChart(place, placeNumber);

        const CHARTDIV = $(".chart" + placeNumber).first().clone().removeClass("d-none");
        const CHART = $(".choseDateChart" + placeNumber).first().clone().removeClass("d-none").attr('id', 'choseDateChart' + placeNumber);
        $("." + place).append(CHARTDIV.append(CHART));

        new Chart($('#choseDateChart' + placeNumber), {
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
                    text: 'OBA bezoekers ' + type + year
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
    removeChart(place, placeNumber) {
        $(".chart" + placeNumber).find(".choseDateChart" + placeNumber).removeAttr('id');
        $("." + place).find(".chart" + placeNumber).remove();
    }

//Checks if an date dropdown is still in a div and removes it
    removePickDateButton(place,placeNumber) {
        console.log(place);
        $("." + place).find(".buttons").find(".weekDropdown").remove();
        $("." + place).find(".buttons").find(".yearDropdown" + placeNumber).remove(); // placenumber!!
        $("." + place).find(".buttons").find(".monthOrQuarterDropdown").remove();
    }

//Called when the obaLocation.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}
