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

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.obaLocationView);

        $('title', window.parent.document).text('Filter en vergelijk locaties');

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
        let locations = await this.obaLocationRepository.getAllLocations(district["id"]);
        $(".districtsAndLocations").find(".visitorstext").addClass("d-none")
        $(".moveDistrictsToHere").empty();

        const DISTRICTDIV = $(".districts.d-none").first().clone().removeClass("d-none");
        $(".moveDistrictsToHere").append(DISTRICTDIV);

        const CHOSENDISTRICT = $(".locationsOfADistrict.d-none").removeClass("d-none");
        CHOSENDISTRICT.find(".districtText").text(district["name"]);

        for (let i = 0; i < locations.length; i++) {
            const lOCATIONCARD = $(".locationCard.d-none").first().clone().removeClass("d-none");

            lOCATIONCARD.find(".locationImage").attr("src", locations[i]["image"]);
            lOCATIONCARD.find(".locationName").text(locations[i]["location_name"]);
            lOCATIONCARD.find(".locationAddress").text(locations[i]["address"]);
            if (locations[i]["visitor_data"] === "data not available") {
                lOCATIONCARD.find(".dataAvailable").addClass("text-red-500").text("Gegevens niet beschikbaar");
                lOCATIONCARD.prop("disabled", true);
            }

            lOCATIONCARD.on('click', () => this.selectDate(locations[i]));
            DISTRICTDIV.append(lOCATIONCARD);
        }

        $(".districtsAndLocations").on('click', '.goBackToDistricts', () => {
            this.showAllDistricts()
        });
    }

    //Shows dropdown menu with different date options
    async selectDate(location) {
        let place1 = "chartAndButtonsDiv1";
        let place2 = "chartAndButtonsDiv2";
        let placeNumber1 = 1;
        let placeNumber2 = 2;
        let allDate = await this.obaLocationRepository.getAllDate();

        let removeChartButton = $(".close.d-none").first().clone().removeClass("d-none");
        let dateDropdown = $(".dateDropdown.dropdown.d-none").first().clone().removeClass("d-none");
        let buttons = $(".buttons.d-none").first().clone().removeClass("d-none");

        if ($('.chartAndButtonsDiv1').children().length <= 0) {
            buttons.append(removeChartButton, dateDropdown);
            $(".chartAndButtonsDiv1").append(buttons);
            //this.fillDateDropdown(location, DATEDROPDOWN, "chartAndButtonsDiv");
            let div = "chartAndButtonsDiv1";

            for (let i = 0; i < allDate.length; i++) {
                const DATES = dateDropdown.find(".dateDropdown-item.d-none").first().clone().removeClass("d-none");

                DATES.text(allDate[i]["name"]);
                DATES.attr(`data-id`, i);

                dateDropdown.find(".dateDropdown-menu").append(DATES);

                dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + i + '"]', function () {
                    console.log(allDate[i]["name"]);
                });
            }

            this.showChart(location["location_name"], "", [], [], "", "-", "", place1, placeNumber1);

            $('.chartAndButtonsDiv1').find(".buttons").find(".close").click(function () {
                $(".chart" + placeNumber1).find(".choseDateChart" + placeNumber1).removeAttr('id');
                $(".chartAndButtonsDiv1").find(".chart" + placeNumber1).remove();
                $(".chartAndButtonsDiv1").find(".buttons").find(".weekOrMonthDropdown" + placeNumber1).remove();
                $(".chartAndButtonsDiv1").find(".buttons").find(".yearDropdown" + placeNumber1).remove();
                $(".chartAndButtonsDiv1").find(".buttons").find(".quarterDropdown" + placeNumber1).remove();
                $(".chartAndButtonsDiv1").find(".buttons").find(".dateDropdown" + placeNumber1).remove();
                $(".chartAndButtonsDiv1").find(".buttons").find(".close").remove();
                $(".chartAndButtonsDiv1").find(".buttons").remove();

            });

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 0 + '"]', () =>
                this.disableButton(allDate, 0) &&
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[0]["name"]) &&
                this.selectYear(location, "week", div, 1));

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 1 + '"]', () =>
                this.disableButton(allDate, 1) &&
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[1]["name"])
                && this.selectYear(location, "month", div, 1));

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 2 + '"]', () =>
                this.disableButton(allDate, 2) &&
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[2]["name"])
                && this.selectYear(location, "quarter", div, 1));

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 3 + '"]', () =>
                this.disableButton(allDate, 3) &&
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[3]["name"])
                && this.selectYear(location, "year", div, 1));


        } else if ($('.chartAndButtonsDiv2').children().length <= 0) {
            buttons.append(removeChartButton, dateDropdown);
            $(".chartAndButtonsDiv2").append(buttons);
            let div = "chartAndButtonsDiv2";
            for (let i = 0; i < allDate.length; i++) {
                const DATES = dateDropdown.find(".dateDropdown-item.d-none").first().clone().removeClass("d-none");

                DATES.text(allDate[i]["name"]);
                DATES.attr(`data-id`, i);

                dateDropdown.find(".dateDropdown-menu").append(DATES);

                dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + i + '"]', function () {
                    console.log(allDate[i]["name"]);
                });
            }

            this.showChart(location["location_name"], "", [], [], "", "-", "", place2, placeNumber2);

            $('.chartAndButtonsDiv2').find(".buttons").find(".close").click(function () {
                $(".chart" + placeNumber2).find(".choseDateChart" + placeNumber2).removeAttr('id');
                $(".chartAndButtonsDiv2").find(".chart" + placeNumber2).remove();
                $(".chartAndButtonsDiv2").find(".buttons").find(".weekOrMonthDropdown" + placeNumber2).remove();
                $(".chartAndButtonsDiv2").find(".buttons").find(".yearDropdown" + placeNumber2).remove();
                $(".chartAndButtonsDiv2").find(".buttons").find(".quarterDropdown" + placeNumber2).remove();
                $(".chartAndButtonsDiv2").find(".buttons").find(".close").remove();
                $(".chartAndButtonsDiv2").find(".buttons").remove();

            });

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 0 + '"]', () =>
                this.disableButton(allDate, 0) &&
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[0]["name"]) &&
                this.selectYear(location, "week", div, 2));

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 1 + '"]', () =>
                this.disableButton(allDate, 1) &&
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[1]["name"])
                && this.selectYear(location, "month", div, 2));

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 2 + '"]', () =>
                this.disableButton(allDate, 2) &&
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[2]["name"])
                && this.selectYear(location, "quarter", div, 2));

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 3 + '"]', () =>
                this.disableButton(allDate, 3) &&
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[3]["name"])
                && this.selectYear(location, "year", div, 2));

            //   this.fillDateDropdown(location, DATEDROPDOWN, "chartAndButtonsDiv2");
        } else {
            alert("Het maximum aantal grafieken (2) is bereikt.\nHaal een grafiek weg om een nieuwe grafiek " +
                "toe te voegen");
            console.log("Het maximum aantal grafieken (2) is bereikt.")
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
                const YEARS = yearDropdown.find(".yearDropdown-item.d-none").first().clone().removeClass("d-none");
                YEARS.text(allYears[i]["year"]).attr(`data-id`, i);
                yearDropdown.find(".yearDropdown-menu").append(YEARS);
            }

            yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                yearDropdown.find(".btn.btn-secondary").text("Jaar: " + allYears[i]["year"]));

            switch (type) {
                case "year":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.getYearData(location, allYears[i]["year"], allMonthsOfAYear, place, placeNumber));
                    break;
                case "quarter":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.selectDropdown(location, allYears[i]["year"], place, placeNumber, "quarterDropdown", "quarter"));
                    //(location, year, place, placeNumber, className, type, allMonthsOfAYear)
                    break;
                case "month":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.selectDropdown(location, allYears[i]["year"], place, placeNumber, "weekOrMonthDropdown", "month", allMonthsOfAYear));
                    break;
                case "week":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.selectDropdown(location, allYears[i]["year"], place, placeNumber, "weekOrMonthDropdown", "week"));
                    break;
            }
        }
    }

    async fillWeekDropdown(location, year, place, placeNumber, weekDropdown) {
        let allWeeksOfAYear = await this.obaLocationRepository.getAllWeeksOfAYear(location["alias_name"], year);
        console.log(allWeeksOfAYear)
        weekDropdown.find(".btn.btn-secondary").text("Week");

        for (let i = 0; i < allWeeksOfAYear.length; i++) {
            //Checks if the visitor data of every week of a year is null
            if (allWeeksOfAYear[i]["visitors"] !== 0) {
                const WEEKS = weekDropdown.find(".weekOrMonthDropdown-item.d-none").first().clone().removeClass("d-none");
                WEEKS.text(allWeeksOfAYear[i]["week"]).attr(`data-id`, i);
                weekDropdown.find(".weekOrMonthDropdown-menu").append(WEEKS);
            }

            weekDropdown.find(".weekOrMonthDropdown-menu").on('click', '.weekOrMonthDropdown-item[data-id="' + i + '"]', () =>
                weekDropdown.find(".btn.btn-secondary").text("Week: " + allWeeksOfAYear[i]["week"]) &&
                this.getWeekData(location, year, allWeeksOfAYear[i]["week"], place, placeNumber));
        }
    }

    //Shows chosen date dropdown
    async selectDropdown(location, year, place, placeNumber, className, type, allMonthsOfAYear) {
        $(".chartAndButtonsDiv" + placeNumber).find(".buttons").find("." + className + placeNumber).remove();
        let dropdown = $("." + className + placeNumber).first().clone().removeClass("d-none");
        $(".chartAndButtonsDiv" + placeNumber).find(".buttons").append(dropdown);
        switch(type){
            case "quarter":
                this.fillQuarterDropdown(location, year, place, placeNumber, dropdown);
                break;
            case "month":
                this.fillMonthDropdown(location, year, allMonthsOfAYear, place, placeNumber, dropdown);
                break;
            case "week":
                this.fillWeekDropdown(location, year, place, placeNumber, dropdown);
                break;        }


    }

    // async selectMonth(location, year, place, placeNumber, allMonthsOfAYear) {
    //     $(".chartAndButtonsDiv" + placeNumber).find(".buttons").find(".weekOrMonthDropdown" + placeNumber).remove();
    //     const monthDropdown = $(".weekOrMonthDropdown" + placeNumber).first().clone().removeClass("d-none");
    //     monthDropdown.find(".btn.btn-secondary").text("Maand");
    //     $(".chartAndButtonsDiv" + placeNumber).find(".buttons").append(monthDropdown);
    //     this.fillMonthDropdown(location, year, allMonthsOfAYear, place, placeNumber, monthDropdown);
    // }
    //
    // async selectQuarter(location, year, place, placeNumber) {
    //     $(".chartAndButtonsDiv" + placeNumber).find(".buttons").find(".quarterDropdown" + placeNumber).remove();
    //     const quarterDropdown = $(".quarterDropdown" + placeNumber).first().clone().removeClass("d-none");
    //     $(".chartAndButtonsDiv" + placeNumber).find(".buttons").append(quarterDropdown);
    //     this.fillQuarterDropdown(location, year, place, placeNumber, quarterDropdown);
    // }
    //
    async selectYear(location, type, place, placeNumber) {
        this.removePickDateButton(place, placeNumber);
        const yearDropdown = $(".yearDropdown" + placeNumber).first().clone().removeClass("d-none");
        $(".chartAndButtonsDiv" + placeNumber).find(".buttons").append(yearDropdown);
        this.fillYearDropdown(location, type, place, placeNumber, yearDropdown);
    }

    async fillQuarterDropdown(location, year, place, placeNumber, quarterDropdown) {
        let quarters = await this.obaLocationRepository.getAllQuarterOfAYear();
        console.log(quarters);

        for (let i = 0; i < quarters.length; i++) {
            let quarterText = quarterDropdown.find(".quarterDropdown-item.d-none").first().clone().removeClass("d-none");
            quarterText.text(quarters[i]["name"]).attr(`data-id`, i);
            quarterDropdown.find(".quarterDropdown-menu").append(quarterText);

            quarterDropdown.find(".quarterDropdown-menu").on('click', '.quarterDropdown-item[data-id="' + i + '"]', () =>
                quarterDropdown.find(".btn.btn-secondary").text(quarters[i]["name"].substring(0, quarters[i]["name"].indexOf(':'))) &&
                this.getQuarterData(location, year, i, quarters[i]["name"], place, placeNumber));
        }
    }

    async fillMonthDropdown(location, year, allMonthsOfAYear, place, placeNumber, monthDropdown) {
        monthDropdown.find(".btn.btn-secondary").text("Week");
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
                const MONTHS = monthDropdown.find(".weekOrMonthDropdown-item.d-none").first().clone().removeClass("d-none");
                MONTHS.text(allMonthsOfAYear[i]["name"]);
                MONTHS.attr(`data-id`, i);

                monthDropdown.find(".weekOrMonthDropdown-menu").append(MONTHS);
            }

            monthDropdown.find(".weekOrMonthDropdown-menu").on('click', '.weekOrMonthDropdown-item[data-id="' + i + '"]', () =>
                monthDropdown.find(".btn.btn-secondary").text("Maand: " + allMonthsOfAYear[i]["name"]) &&
                this.getMonthData(location, year, allMonthsOfAYear[i]["name"], place, placeNumber));
        }
    }

    async getWeekData(location, year, chosenWeek, place, placeNumber) {
        let days = [];
        let weekData = [];
        let color = [];
        let week = await this.obaLocationRepository.getChosenWeek(location["alias_name"], year, chosenWeek);

        for (let i = 0; i < week.length; i++) {
            days[i] = week[i]["weekday"];
            weekData[i] = week[i]["visitors"];
            color = 'rgb(255, 100, 0)';
        }

        this.showChart(location["location_name"], days, weekData, color, year, "dagen", "week: " + chosenWeek + " van ", place, placeNumber);
        console.log(week);
    }

    async getQuarterData(location, year, numberOfChosenQuarter, chosenQuarterName, place, placeNumber) {
        let chosenQuarter;
        let weeks = [];
        let quarterData = [];
        let color = [];

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
            color = 'rgb(0, 100, 200)';

        }
        console.log(chosenQuarter);

        this.showChart(location["location_name"], weeks, quarterData, color, year, "weken", chosenQuarterName + " ", place, placeNumber);

    }

    async getMonthData(location, year, month, place, placeNumber) {
        console.log(year, location, month);
        let days = [];
        let monthData = [];
        let color = [];
        let visitorDataAllDaysOfMonth = await this.obaLocationRepository.getChosenMonth(location["alias_name"], year, month);

        for (let i = 0; i < visitorDataAllDaysOfMonth.length; i++) {
            days[i] = visitorDataAllDaysOfMonth[i]["day"];
            monthData[i] = visitorDataAllDaysOfMonth[i]["visitors"];
            color = 'rgb(160,0,120)';
        }

        console.log(visitorDataAllDaysOfMonth);
        console.log(days);

        this.showChart(location["location_name"], days, monthData, color, year, "dagen", month + " ", place, placeNumber);

    }

    async getYearData(location, year, allMonths, place, placeNumber) {
        console.log(year, location);
        let months = [];
        let yearData = [];
        let color = [];

        let visitorsYear = await this.obaLocationRepository.getChosenYear(location["alias_name"], year);
        console.log(visitorsYear);

        for (let i = 0; i < visitorsYear.length; i++) {
            months[i] = allMonths[i]["name"];
            yearData[i] = visitorsYear[i]["amount"];
            color = 'rgb(0,155,150)';
        }


        this.showChart(location["location_name"], months, yearData, color, year, "maanden", "", place, placeNumber);
    }

    async showChart(location, label, data, color, year, labelType, type, place, placeNumber) {
        this.removeChart(place, placeNumber);

        const CHARTDIV = $(".chart" + placeNumber).first().clone().removeClass("d-none");
        const CHART = $(".choseDateChart" + placeNumber).first().clone().removeClass("d-none").attr('id', 'choseDateChart' + placeNumber);
        $("." + place).append(CHARTDIV.append(CHART));

        new Chart($('#choseDateChart' + placeNumber), {
            type: 'bar',
            data: {
                labels: label,
                datasets: [{
                    label: "OBA " + location + " bezoekers",
                    backgroundColor: color,
                    data: data,
                }]
            },
            options: {
                legend: {display: false},
                title: {
                    display: true,
                    text: 'OBA ' + location + ' bezoekers ' + type + year
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

    //IS NIET MEER NODIG DENK IK
//Enables all buttons first and then disable the button that is clicked
    async disableButton(allDate, id) {
        // for (let i = 0; i < allDate.length; i++) {
        //     $(".dateDropdown.dropdown").find('.dateDropdown-item[data-id="' + i + '"]').attr("disabled", false);
        // }
        // $(".dateDropdown.dropdown").find('.dateDropdown-item[data-id="' + id + '"]').attr("disabled", true);
    }

//Removes chart and the chart id
    removeChart(place, placeNumber) {
        $(".chart" + placeNumber).find(".choseDateChart" + placeNumber).removeAttr('id');
        $("." + place).find(".chart" + placeNumber).remove();
    }

    //                $(".canvasdiv").empty();

//Checks if an date dropdown is still in a div and removes it
    removePickDateButton(place, placeNumber) {
        $("." + place).find(".buttons").find(".weekOrMonthDropdown" + placeNumber).remove();
        $("." + place).find(".buttons").find(".yearDropdown" + placeNumber).remove();
        $("." + place).find(".buttons").find(".quarterDropdown" + placeNumber).remove();
    }

//Called when the obaLocation.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}