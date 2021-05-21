class WeekdayVisitorsController {
    constructor() {
        this.weekdayVisitorsRepository = new weekdayVisitorsRepository();

        $.get("views/weekdayVisitors.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the weekdayVisitors.html has been loaded
    setup(data) {
        //Load content into memory
        this.weekdayVisitorsView = $(data);

        //Change colour of navbar item
        $(".nav-item").removeClass("active");
        $(".weekdayVisitorsItem").addClass("active");

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.weekdayVisitorsView);
        this.getOptions()
    }

    //function to generate the options available to pick
    async getOptions() {

        //get options from datatbase
        let promiseYear = await this.weekdayVisitorsRepository.getyearOptions()
        let promiseLocation = await this.weekdayVisitorsRepository.getlocationOptions()

        let yearOptions = [];
        let locationOptions = [];

        //put all options in arrays
        for (let i = 0; i < promiseYear.length; i++) {
            yearOptions[i] = promiseYear[i].year
        }

        for (let i = 0; i < promiseLocation.length; i++) {
            locationOptions[i] = promiseLocation[i].location
        }


        var selectLocation = document.getElementById('locationOptions');
        var selectYear = document.getElementById('yearOptions');

        //add options to html
        for (let i = 0; i < yearOptions.length; i++) {
            var option = document.createElement('option');
            option.value = yearOptions[i];
            option.innerHTML = yearOptions[i];
            selectYear.appendChild(option);
        }

        for (let i = 0; i < locationOptions.length; i++) {
            option = document.createElement('option');
            option.value = locationOptions[i];
            option.innerHTML = locationOptions[i];
            selectLocation.appendChild(option);
        }


        //function to buildchart is called when button is pressed
        $(".options").change(async function () {

            //delete and then remake a new canvas element
            document.getElementById("canvasDiv").innerHTML = "";
            let weekDayCanvas = document.createElement('canvas')
            weekDayCanvas.setAttribute("id", "myChart")
            document.getElementById("canvasDiv").appendChild(weekDayCanvas);

            let average = [];
            let color = "#FF0000";
            let weekDayVisitorsRepository = new weekdayVisitorsRepository();

            //get chosen location and year
            const year = document.getElementById("yearOptions").value;
            const location = document.getElementById("locationOptions").value;

            let chartPromise = await weekDayVisitorsRepository.getWeekdayData(year, location)

                //add data to array
                average[0] = Math.round(chartPromise[0].average);
            average[1] = Math.round(chartPromise[1].average);
            average[2] = Math.round(chartPromise[2].average);
            average[3] = Math.round(chartPromise[3].average);
            average[4] = Math.round(chartPromise[4].average);
            average[5] = Math.round(chartPromise[5].average);
            average[6] = Math.round(chartPromise[6].average);

            //chart setup and config
            const labels = [
                'maandag',
                'dinsdag',
                'woensdag',
                'donderdag',
                'vrijdag',
                'zaterdag',
                'zondag'
            ];
            const data = {
                labels: labels,
                datasets: [{
                    label: location,
                    backgroundColor: color,
                    borderColor: color,
                    data: average,
                }]
            };

            const config = {
                type: 'bar',
                data,
                options: {}
            };




            //build chart
            let weekDayChart = new Chart(myChart, config)

            return false

        });


    }


}