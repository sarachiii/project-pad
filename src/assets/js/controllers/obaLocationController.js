class ObaLocationController {
    constructor() {
        this.obaLocationRepository = new ObaLocationRepository();

        $.get("views/locationsNavigationBar.html")
            .done((data) => this.setup(data))
            .fail(() => this.error());
    }

    //Called when the locationsNavigationBar.html has been loaded
    setup(data) {
        //Load content into memory
        this.obaLocationView = $(data);

        //Empty the content-div and add the resulting view to the page
        $(".content").empty().append(this.obaLocationView);

        this.showAllDistricts(event);
    }


    async showAllDistricts(event) {
        event.preventDefault();
        $(".districts").empty();

        let districts = await this.obaLocationRepository.getDistricts();
        console.log(districts);

        const title = $(".textdiv.d-none").first().clone().removeClass("d-none");
        title.find(".goBackToDistricts").addClass("d-none");
        title.appendTo(".districts");

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
                this.viewLocations(event, districts[i]["name"]));
        }
    }


    async viewLocations(event, district) {
        event.preventDefault();
        $(".districts").empty();

        let locations = await this.obaLocationRepository.getAllLocations(district);
        console.log(locations);

        const chosenDistrict = $(".textdiv.d-none").first().clone().removeClass("d-none");
        chosenDistrict.find(".goBackToDistricts").removeClass("d-none");
        chosenDistrict.find(".visitorstext").removeClass("ml-3").text(district);

        chosenDistrict.appendTo(".districts");

        for (let i = 0; i < locations.length; i++) {
            const locationCard = $(".locationCard.d-none").first().clone().removeClass("d-none");

            locationCard.find(".locationImage").attr("src", locations[i]["image"]);
            locationCard.find(".locationName").text(locations[i]["location_name"]);
            locationCard.find(".locationAddress").text(locations[i]["adres"]);
            if (locations[i]["visitor_data"] === "data available") {
                locationCard.find(".dataAvailable").text("Gegevens beschikbaar");
            } else {
                locationCard.find(".dataAvailable").addClass("text-red-500").text("Gegevens niet beschikbaar");
            }

            locationCard.on('click', function () {
                console.log(locations[i]["location_name"]);
            });
            $(".districts").append(locationCard);
        }
        $(".districts").on('click', '.goBackToDistricts', (event) => {
            $.get("views/locationsNavigationBar.html")
                .done((data) => this.setup(data))
                .fail(() => this.error());
            }
        );

    }

    //Called when the login.html failed to load
    error() {
        $(".content").html("Failed to load content!");
    }
}
