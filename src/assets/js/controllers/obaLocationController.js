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

        this.showAllDistricts();
    }


    async showAllDistricts() {
        $(".districts").empty();

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

            locationCard.on('click', function () {
                console.log(locations[i]);
            });
            $(".districts").append(locationCard);
        }
        $(".obalocationsDiv").on('click', '.goBackToDistricts', () => {
                $.get("views/obaLocation.html")
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
