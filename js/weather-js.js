
mapboxgl.accessToken = mapToken;
var lat;
var long;

geocode('San Antonio, TX', mapToken).then(function(SATX) {
    lat = SATX[1];
    long = SATX[0];
    var mapOptions = {
        container: 'map',
        style: 'mapbox://styles/nicksosa456/cjy4jqvee3on21cpbz0jzctnc',
        zoom: 10,
        center: SATX
    };

    var weather = function(lat, long){
        $.get("https://cors-anywhere.herokuapp.com/https://api.darksky.net/forecast/"+darkSkyToken+"/"+lat+","+long).done(function(data) {
            console.log(data);
            for (var x = 0; x <=2; x++) {
                cycleDays(data, x);
            }}).fail(function(jqXhr, status, error) {
            console.log("Response status: " + status);
            console.log("Error object: " + error);
        });
    };

    weather(lat, long);

    var map = new mapboxgl.Map(mapOptions);

    var marker = new mapboxgl.Marker()
        .setLngLat(SATX)
        .setDraggable(true)
        .addTo(map);

    function onDragEnd() {
        var lnglat = marker.getLngLat();
        lat = lnglat.lat;
        long = lnglat.lng;
        weather(lat, long);
    }
    marker.on('dragend', onDragEnd);

    var geocoder = new MapboxGeocoder({ // Initialize the geocoder
        accessToken: mapboxgl.accessToken, // Set the access token
        mapboxgl: mapboxgl // Set the mapbox-gl instance
    });

    // Add the geocoder to the map
    map.addControl(geocoder);
    geocoder.on('result', function(e) {
        lat = e.result.geometry.coordinates[1];
        long = e.result.geometry.coordinates[0];
        weather(lat, long);
    });
    map.addControl(new mapboxgl.NavigationControl());
});

var icons = [
    {
        icon: "clear-day",
        name: "Sunny",
        summary: "Clear, sunny day",
        url: "icons/weather-color/SVG/500/sun.svg"
    },
    {
        icon: "clear-night",
        name: "Clear",
        summary: "Clear night sky",
        url: "icons/weather-color/SVG/500/moon.svg"
    },
    {
        icon: "rain",
        name: "Rain",
        summary: "Rainy day",
        url: "icons/weather-color/SVG/500/rain.svg"
    },
    {
        icon: "snow",
        name: "Snow",
        summary: "Snowfall today",
        url: "icons/weather-color/SVG/500/snow.svg"
    },
    {
        icon: "sleet",
        name: "Sleet",
        summary: "Sleet today",
        url: "icons/weather-color/SVG/500/hail.svg"
    },
    {
        icon: "wind",
        name: "Windy",
        summary: "High winds",
        url: "icons/weather-color/SVG/500/windy.svg"
    },
    {
        icon: "fog",
        name: "Foggy",
        summary: "Foggy day",
        url: "icons/weather-color/SVG/500/fog.svg"
    },
    {
        icon: "cloudy",
        name: "Cloudy",
        summary: "Cloudy day",
        url: "icons/weather-color/SVG/500/cloudy.svg"
    },
    {
        icon: "partly-cloudy-day",
        name: "Cloudy",
        summary: "Partly cloudy",
        url: "icons/weather-color/SVG/500/cloudy-day.svg"
    },
    {
        icon: "partly-cloudy-night",
        name: "Cloudy",
        summary: "Partly Cloudy",
        url: "icons/weather-color/SVG/500/cloudy-night.svg"
    }
];

var cycleDays = function(data, index){
    var day = $(".day"+index);
    var name;
    var icon;
    var summary;
    var temp = "F";
    var buildHTML = function (w, i) {
        var tempHigh = w.daily.data[i].temperatureHigh;
        var tempLow = w.daily.data[i].temperatureLow;
        var weatherType = function(){
            icons.forEach(function (ele) {
                if (w.daily.data[i].icon === ele.icon){
                    name = ele.name;
                    summary = ele.summary;
                    icon = ele.url;
                }
            });
        };
        weatherType();
        $('.imgDegree').click(function () {
            if (temp === 'F') {
                temp = 'C';
                $(this).removeClass('fahrenheit');
                $(this).addClass('celsius');
                tempHigh = ((tempHigh - 32) * (5/9) );
                tempLow= ((tempLow - 32) * (5/9) );
            } else if (temp === 'C') {
                temp = 'F';
                $(this).removeClass('celsius');
                $(this).addClass('fahrenheit');
                tempHigh = ((tempHigh * (9/5) ) + 32);
                tempLow = ((tempLow * (9/5) ) + 32);
            }
            $('.temp').html("<p class='temp is-size-1'>"+Math.round(tempHigh)+"º/"
                +Math.round(tempLow)+"º</p>")
        });
        day.html('');
        day.append("<p class='temp is-size-1'>"+Math.round(tempHigh)+"º/"
            +Math.round(tempLow)+"º</p>"
            +"\n <img class='weather-icon' src='"+icon+"' alt=''> \n"+"<p><span class='large-font'>"+name+":</span> "+summary
            +"</p>\n<p><span class='large-font'>Humidity:</span> "+ Math.round(w.daily.data[i].humidity*100)
            +"</p>\n<p><span class='large-font'>Wind:</span> "+w.daily.data[i].windSpeed
            +"</p>\n<p><span class='large-font'>Pressure:</span> "+w.daily.data[i].pressure+"</p>");
    };
    buildHTML(data, index);
};