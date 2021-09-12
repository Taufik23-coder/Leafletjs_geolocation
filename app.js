console.log('Geolocation Leaflet')
// Map SetView
const map = L.map('map').setView([-7.7956,110.3695], 10);

// Basemap
const osm = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(map);

const googleStreets = L.tileLayer('http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}',{
    maxZoom: 20,
    subdomains:['mt0','mt1','mt2','mt3']
});

// Adding Scale and Zoom Control
const skala = L.control.scale().addTo(map);



// Marker
const firstMarker = L.marker([-7.7956,110.3695]).addTo(map)
    .bindPopup('A pretty CSS3 popup.<br> Easily customizable.')
    ;
// Marker JSON
    var pointGeojson = new L.geoJson.ajax('./data/point.geojson');


// Geolocation
if(!navigator.geolocation){console.log('Your browser doesnt support geolocation')
}
else {
    var geoStream = setInterval(()=>{
        navigator.geolocation.getCurrentPosition(getPosition)
    }, 5000);
}
// Stop streaming GeoLocation
document.getElementById('stop-stream').onclick = function() {
    clearInterval(geoStream)
};


var myIcon = L.icon({
    iconUrl: './icon/red_pin.png',
    iconSize: [38, 40],

});
// Deklarasi tambahan dari set Interval untuk mnghilangkan jejak sebelumnya
var marker, circle;

function getPosition(position) {
        // console.log(position)
        const lat = position.coords.latitude;
        const long = position.coords.longitude;
        const accuracy = position.coords.accuracy;

// Remove Layer Geolocation sebelumnya
if(marker){
    map.removeLayer(marker)
};

if(circle){
    map.removeLayer(circle)
};

        marker = L.marker([lat, long], {icon: myIcon});
        circle = L.circle([lat, long], {radius: 200});


        
        const realTimePosition = L.featureGroup([marker, circle]).addTo(map).bindPopup('<h3> Your Position</h3> <p> '+ lat + "\n" + long +"\n" +'<p>your accuracy is '+ accuracy).openPopup();
        // menunjukkan lokasi real time position kita secara detail
        map.fitBounds(realTimePosition.getBounds());

        console.log('This your position '+ lat + long +'and your accuracy is '+ accuracy)
    };


// Layer Control
    var baseMaps = {
        'OSM': osm,
        'Google Street': googleStreets,
        
    };
    
    var overlayMaps = {
        'FirstMarker': firstMarker,
        'PointGeoJS': pointGeojson,
    };
    
    L.control.layers(baseMaps, overlayMaps,{
        collapsed: true
    }).addTo(map);