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

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.weekdayVisitorsView);

        //Change colour of navbar item
        $(".btn-group-vertical").removeClass("active");
        $("#weekdaysub").addClass("active");

        $('title', window.parent.document).text('Bezoekers per weekdag')

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


        //add options to html
        for (let i = 0; i < yearOptions.length; i++) {
            $("#yearOptions").append("<option value =" + yearOptions[i] + ">" + yearOptions[i] + "</option>")
        }

        for (let i = 0; i < locationOptions.length; i++) {
            $("#locationOptions").append("<option value =" + "'" + locationOptions[i] + "'" + ">" + locationOptions[i] + "</option>");
        }


        //function to buildchart is called when selection is changed
        $(".options").change(async function () {
            $("#canvasdiv").empty()
            $("#canvasdiv").append("<canvas id = myChart></canvas>")


            let average = [];
            let color = "#FF0000";
            let weekDayVisitorsRepository = new weekdayVisitorsRepository();

            //get chosen location and year
            const year = $("#yearOptions").val();
            const location = $("#locationOptions").val();

            //check if an option is selected
            if(year == null || location == null){

            } else {
                let chartPromise = await weekDayVisitorsRepository.getWeekdayData(year, location)

                //check if there is a response
                if (chartPromise.length < 7){
                    alert("Geen data beschikbaar");
                } else {

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
                            label: (location + " (" + year + ")"),
                            backgroundColor: color,
                            borderColor: color,
                            data: average,
                        }]
                    };

                    const config = {
                        type: 'bar',
                        data,
                        options: {
                            scales: {
                                yAxes: [{
                                    scaleLabel: {
                                        display: true,
                                        labelString: 'gemiddeld aantal bezoekers'
                                    },
                                }]
                            }
                        }
                    };

                    //build chart
                    let weekDayChart = new Chart(myChart, config)
                }
            }





        });


    }

}