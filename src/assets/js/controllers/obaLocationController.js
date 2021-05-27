/**
 * Responsible for handling the actions happening on the obaLocations view
 *
 * @author Nazlıcan Eren
 */
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

    //Called when the obaLocation.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }

    //Shows all districts
    async showAllDistricts() {
        let districtsData = await this.obaLocationRepository.getDistricts();

        $(".moveDistrictsToHere").empty();
        $(".districtsAndLocations").find(".visitorstext").removeClass("d-none")
        $(".districtsAndLocations").find(".locationsOfADistrict").addClass("d-none")

        const districts = $(".districts.d-none").first().clone().removeClass("d-none");
        $(".moveDistrictsToHere").append(districts);

        for (let i = 0; i < districtsData.length; i++) {
            const districtsAndLocations = $(".districtName.d-none").first().clone().removeClass("d-none");

            districtsAndLocations.find(".district").text(districtsData[i]["name"]).attr(`data-id`, i);
            districtsAndLocations.find(".viewLocations").attr(`data-id`, i);
            districts.append(districtsAndLocations);

            districts.on('click', '.viewLocations[data-id="' + i + '"]', () =>
                this.viewLocations(districtsData[i]));
        }
    }

    //Shows all locations of a district
    async viewLocations(district) {
        let locations = await this.obaLocationRepository.getAllLocations(district["id"]);
        $(".districtsAndLocations").find(".visitorstext").addClass("d-none")
        $(".moveDistrictsToHere").empty();

        const districtDiv = $(".districts.d-none").first().clone().removeClass("d-none");
        $(".moveDistrictsToHere").append(districtDiv);

        const chosenDistrict = $(".locationsOfADistrict.d-none").removeClass("d-none");
        chosenDistrict.find(".districtText").text(district["name"]);

        for (let i = 0; i < locations.length; i++) {
            const locationCard = $(".locationCard.d-none").first().clone().removeClass("d-none");

            locationCard.find(".locationImage").attr("src", locations[i]["image"]);
            locationCard.find(".locationName").text(locations[i]["location_name"]);
            locationCard.find(".locationAddress").text(locations[i]["address"]);
            if (locations[i]["visitor_data"] === "data not available") {
                locationCard.find(".dataAvailable").addClass("text-red-500").text("Gegevens niet beschikbaar");
                locationCard.prop("disabled", true);
            }

            locationCard.on('click', () => this.selectDate(locations[i]));
            districtDiv.append(locationCard);
        }

        $(".districtsAndLocations").on('click', '.goBackToDistricts', () => {
            this.showAllDistricts()
        });
    }

    //Shows dropdown menu with different date options
    async selectDate(location) {
        let place;
        let placeNumber;
        let allDate = await this.obaLocationRepository.getAllDate();
        let removeChartButton = $(".close.d-none").first().clone().removeClass("d-none");
        let dateDropdown = $(".dateDropdown.dropdown.d-none").first().clone().removeClass("d-none");
        let buttons = $(".buttons.d-none").first().clone().removeClass("d-none");

        if ($('.chartAndButtonsDiv1').children().length <= 0) {
            place = "chartAndButtonsDiv1";
            placeNumber = 1;
        } else if ($('.chartAndButtonsDiv2').children().length <= 0) {
            place = "chartAndButtonsDiv2";
            placeNumber = 2;
        } else {
            alert("Het maximum aantal grafieken (2) is bereikt.\nHaal een grafiek weg om een nieuwe grafiek " +
                "toe te voegen.");
        }

        //Adds options to date dropdown and shows empty chart with remove button
        if ($('.chartAndButtonsDiv1').children().length <= 0 || $('.chartAndButtonsDiv2').children().length <= 0) {
            buttons.append(removeChartButton, dateDropdown);
            $("." + place).append(buttons);
            for (let i = 0; i < allDate.length; i++) {
                const DATES = dateDropdown.find(".dateDropdown-item.d-none").first().clone().removeClass("d-none");

                DATES.text(allDate[i]["name"]);
                DATES.attr(`data-id`, i);

                dateDropdown.find(".dateDropdown-menu").append(DATES);

                dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + i + '"]', function () {
                    console.log(allDate[i]["name"]);
                });
            }

            //Shows empty chart with location name
            this.showChart(location["location_name"], "", [], [], "", "-", "", place, placeNumber);

            //Removes everything from the place of the chart when clicked
            $("." + place).find(".buttons").find(".close").click(function () {
                $("." + place).empty()
            });

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 0 + '"]', () =>
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[0]["name"]) &&
                this.selectYear(location, "week", place, placeNumber));

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 1 + '"]', () =>
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[1]["name"])
                && this.selectYear(location, "month", place, placeNumber));

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 2 + '"]', () =>
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[2]["name"])
                && this.selectYear(location, "quarter", place, placeNumber));

            dateDropdown.find(".dateDropdown-menu").on('click', '.dateDropdown-item[data-id="' + 3 + '"]', () =>
                dateDropdown.find(".btn.btn-secondary").text("Periode: " + allDate[3]["name"])
                && this.selectYear(location, "year", place, placeNumber));
        }
    }

    //Creates year dropdown
    async selectYear(location, type, place, placeNumber) {
        $("." + place).find(".buttons").find(".weekOrMonthDropdown" + placeNumber).remove();
        $("." + place).find(".buttons").find(".yearDropdown" + placeNumber).remove();
        $("." + place).find(".buttons").find(".quarterDropdown" + placeNumber).remove();
        const yearDropdown = $(".yearDropdown" + placeNumber).first().clone().removeClass("d-none");
        $(".chartAndButtonsDiv" + placeNumber).find(".buttons").append(yearDropdown);
        this.fillYearDropdown(location, type, place, placeNumber, yearDropdown);
    }

    //Fills the year dropdown with years
    async fillYearDropdown(location, type, place, placeNumber, yearDropdown) {
        let allYears = await this.obaLocationRepository.getAllYears(location["alias_name"]);

        for (let i = 0; i < allYears.length; i++) {
            let allMonthsOfAYear = await this.obaLocationRepository.getAllMonthsOfAYear();
            let visitorDataYear = await this.obaLocationRepository.getChosenYear(location["alias_name"], allYears[i]["year"]);

            //Checks if the visitor data of a year is null
            let checkIfYearDataIsEmpty = 0;
            for (let j = 0; j < visitorDataYear.length; j++) {
                if (visitorDataYear[j]["visitors"] === 0) {
                    checkIfYearDataIsEmpty++;
                }
            }

            //Adds year data to the dropdown
            if (checkIfYearDataIsEmpty < visitorDataYear.length) {
                const YEARS = yearDropdown.find(".yearDropdown-item.d-none").first().clone().removeClass("d-none");
                YEARS.text(allYears[i]["year"]).attr(`data-id`, i);
                yearDropdown.find(".yearDropdown-menu").append(YEARS);
            }

            //Change dropdown text to chosen year
            yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                yearDropdown.find(".btn.btn-secondary").text("Jaar: " + allYears[i]["year"]));

            //Calls the right function when a year is selected, type is here the chosen date in the date dropdown
            switch (type) {
                case "year":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.getData(location, allYears[i]["year"], allMonthsOfAYear, place, placeNumber, type));
                    break;
                case "quarter":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.selectDropdown(location, allYears[i]["year"], place, placeNumber, "quarterDropdown", type));
                    break;
                case "month":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.selectDropdown(location, allYears[i]["year"], place, placeNumber, "weekOrMonthDropdown", type, allMonthsOfAYear));
                    break;
                case "week":
                    yearDropdown.find(".yearDropdown-menu").on('click', '.yearDropdown-item[data-id="' + i + '"]', () =>
                        this.selectDropdown(location, allYears[i]["year"], place, placeNumber, "weekOrMonthDropdown", type));
                    break;
            }
        }
    }

    //Shows chosen date dropdown
    async selectDropdown(location, year, place, placeNumber, className, type, allMonthsOfAYear) {
        $(".chartAndButtonsDiv" + placeNumber).find(".buttons").find("." + className + placeNumber).remove();
        let dropdown = $("." + className + placeNumber).first().clone().removeClass("d-none");
        $(".chartAndButtonsDiv" + placeNumber).find(".buttons").append(dropdown);
        switch (type) {
            case "quarter":
                this.fillQuarterDropdown(location, year, place, placeNumber, dropdown, type);
                break;
            case "month":
                this.fillMonthDropdown(location, year, place, placeNumber, dropdown, type, allMonthsOfAYear);
                break;
            case "week":
                this.fillWeekDropdown(location, year, place, placeNumber, dropdown, type);
                break;
        }
    }

    async fillWeekDropdown(location, year, place, placeNumber, weekDropdown, type) {
        weekDropdown.find(".btn.btn-secondary").text("Week");
        let allWeeksOfAYear = await this.obaLocationRepository.getAllWeeksOfAYear(location["alias_name"], year);
        console.log(allWeeksOfAYear)

        for (let i = 0; i < allWeeksOfAYear.length; i++) {
            //Checks if the visitor data of every week of a year is null
            if (allWeeksOfAYear[i]["visitors"] !== 0) {
                const WEEKS = weekDropdown.find(".weekOrMonthDropdown-item.d-none").first().clone().removeClass("d-none");
                WEEKS.text(allWeeksOfAYear[i]["week"]).attr(`data-id`, i);
                weekDropdown.find(".weekOrMonthDropdown-menu").append(WEEKS);
            }

            weekDropdown.find(".weekOrMonthDropdown-menu").on('click', '.weekOrMonthDropdown-item[data-id="' + i + '"]', () =>
                weekDropdown.find(".btn.btn-secondary").text("Week: " + allWeeksOfAYear[i]["week"]) &&
                this.getData(location, year, allWeeksOfAYear[i]["week"], place, placeNumber, type));
        }
    }

    async fillMonthDropdown(location, year, place, placeNumber, monthDropdown, type, allMonthsOfAYear) {
        monthDropdown.find(".btn.btn-secondary").text("Maand");
        for (let i = 0; i < allMonthsOfAYear.length; i++) {
            let visitorDataMonth = await this.obaLocationRepository.getDataOfMonth(location["alias_name"], year, allMonthsOfAYear[i]["name"]);

            //Checks if the visitor data of every month of a year is null
            let checkIfMonthDataIsEmpty = 0;
            for (let j = 0; j < visitorDataMonth.length; j++) {
                if (visitorDataMonth[j]["visitors"] === 0) {
                    checkIfMonthDataIsEmpty++;
                }
            }

            if (checkIfMonthDataIsEmpty < visitorDataMonth.length) {
                const months = monthDropdown.find(".weekOrMonthDropdown-item.d-none").first().clone().removeClass("d-none");
                months.text(allMonthsOfAYear[i]["name"]);
                months.attr(`data-id`, i);
                monthDropdown.find(".weekOrMonthDropdown-menu").append(months);
            }

            monthDropdown.find(".weekOrMonthDropdown-menu").on('click', '.weekOrMonthDropdown-item[data-id="' + i + '"]', () =>
                monthDropdown.find(".btn.btn-secondary").text("Maand: " + allMonthsOfAYear[i]["name"]) &&
                this.getData(location, year, allMonthsOfAYear[i]["name"], place, placeNumber, type));
        }
    }

    async fillQuarterDropdown(location, year, place, placeNumber, quarterDropdown, type) {
        let quarters = await this.obaLocationRepository.getAllQuarterOfAYear();
        console.log(quarters);

        for (let i = 0; i < quarters.length; i++) {
            let quarterText = quarterDropdown.find(".quarterDropdown-item.d-none").first().clone().removeClass("d-none");
            quarterText.text(quarters[i]["name"]).attr(`data-id`, i);
            quarterDropdown.find(".quarterDropdown-menu").append(quarterText);

            quarterDropdown.find(".quarterDropdown-menu").on('click', '.quarterDropdown-item[data-id="' + i + '"]', () =>
                quarterDropdown.find(".btn.btn-secondary").text(quarters[i]["name"].substring(0, quarters[i]["name"].indexOf(':'))) &&
                this.getData(location, year, "", place, placeNumber, type, i, quarters[i]["name"]));
        }
    }

    async getData(location, year, chosenDate, place, placeNumber, type, numberOfChosenQuarter, chosenQuarterName) {
        let chosenQuarter;
        let labels = [];
        let data = [];
        let color = [];
        switch (type) {
            case "year":
                let visitorsYear = await this.obaLocationRepository.getChosenYear(location["alias_name"], year);
                console.log(visitorsYear);
                for (let i = 0; i < visitorsYear.length; i++) {
                    labels[i] = chosenDate[i]["name"];
                    data[i] = visitorsYear[i]["visitors"];
                    color = 'rgb(0,155,150)';
                }
                this.showChart(location["location_name"], labels, data, color, year, "maanden", "", place, placeNumber);
                break;
            case "quarter":
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
                console.log(chosenQuarter);
                for (let i = 0; i < chosenQuarter.length; i++) {
                    labels[i] = chosenQuarter[i]["week"];
                    data[i] = chosenQuarter[i]["visitors"];
                    color = 'rgb(0, 100, 200)';
                }
                this.showChart(location["location_name"], labels, data, color, year, "weken", chosenQuarterName + " ", place, placeNumber);
                break;
            case "month":
                let visitorDataAllDaysOfMonth = await this.obaLocationRepository.getChosenMonth(location["alias_name"], year, chosenDate);
                console.log(visitorDataAllDaysOfMonth);
                for (let i = 0; i < visitorDataAllDaysOfMonth.length; i++) {
                    labels[i] = visitorDataAllDaysOfMonth[i]["day"];
                    data[i] = visitorDataAllDaysOfMonth[i]["visitors"];
                    color = 'rgb(160,0,120)';
                }
                this.showChart(location["location_name"], labels, data, color, year, "dagen", chosenDate + " ", place, placeNumber);
                break;
            case "week":
                let week = await this.obaLocationRepository.getChosenWeek(location["alias_name"], year, chosenDate);
                console.log(week);
                for (let i = 0; i < week.length; i++) {
                    labels[i] = week[i]["weekday"];
                    data[i] = week[i]["visitors"];
                    color = 'rgb(255, 100, 0)';
                }
                this.showChart(location["location_name"], labels, data, color, year, "dagen", "week: " + chosenDate + " van ", place, placeNumber);
                break;
        }
    }

    //Create and shows chart
    showChart(location, labels, data, color, year, labelType, type, place, placeNumber) {
        $(".chart" + placeNumber).find(".choseDateChart" + placeNumber).removeAttr('id');
        $("." + place).find(".chart" + placeNumber).remove();
        const CHARTDIV = $(".chart" + placeNumber).first().clone().removeClass("d-none");
        const CHART = $(".choseDateChart" + placeNumber).first().clone().removeClass("d-none").attr('id', 'choseDateChart' + placeNumber);
        $("." + place).append(CHARTDIV.append(CHART));

        new Chart($('#choseDateChart' + placeNumber), {
            type: 'bar',
            data: {
                labels: labels,
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
}