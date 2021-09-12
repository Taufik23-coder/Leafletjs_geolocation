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

// Adding Scale and Zoom Control and Full Screen
const skala = L.control.scale({
  position: 'bottomleft',
  metric: true,
}).addTo(map);

map.zoomControl.setPosition('topleft')

// full screen mozilla---fail
var mapId = document.getElementById('map');
function fullScreen() {
  mapId.full-screen-api.unprefix.enabled();
};

// Map Coordinate Mouseover
map.on('mousemove', function (e){
  console.log(e)
  $('.coordinate').html(`Lat: '${e.latlng.lat} Lng: ${e.latlng.lng}`)
});





// ====================
// Leaflet Draw Control
// ====================
// Default Control

// var options = {
//     position: 'topleft', // toolbar position, options are 'topleft', 'topright', 'bottomleft', 'bottomright'
//     drawMarker: true, // adds button to draw markers
//     drawPolyline: true, // adds button to draw a polyline
//     drawRectangle: true, // adds button to draw a rectangle
//     drawPolygon: true, // adds button to draw a polygon
//     drawCircle: true, // adds button to draw a cricle
//     cutPolygon: true, // adds button to cut a hole in a polygon
//     editMode: true, // adds button to toggle edit mode for all layers
//     removalMode: true, // adds a button to remove layers
//   };

//   map.pm.addControls(options);

// optional options for line style during draw. These are the defaults
var options = {
    // snapping
    snappable: true,
    snapDistance: 20,
  
    // self intersection
    allowSelfIntersection: true,
  
    // the lines between coordinates/markers
    templineStyle: {
      color: 'red',
    },
  
    // the line from the last marker to the mouse cursor
    hintlineStyle: {
      color: 'red',
      dashArray: [5, 5],
    },
  
    // show a marker at the cursor
    cursorMarker: false,
  
    // finish drawing on double click
    // DEPRECATED: use finishOn: 'dblclick' instead
    finishOnDoubleClick: false,
  
    // specify type of layer event to finish the drawn shape
    // example events: 'mouseout', 'dblclick', 'contextmenu'
    // List: http://leafletjs.com/reference-1.2.0.html#interactive-layer-click
    finishOn: 'contextmenu',
  
    // custom marker style (only for Marker draw)
    markerStyle: {
      opacity: 0.5,
      draggable: true,
    },
  };
  
  // enable drawing mode for shape - e.g. Poly, Line, etc
  map.pm.enableDraw('Poly', options);
  map.pm.enableDraw('Rectangle', options);
  map.pm.enableDraw('Line', options);
  map.pm.enableDraw('Marker', options);
  map.pm.enableDraw('Circle', options);
  
  // get array of all available shapes
  map.pm.Draw.getShapes();
  
  // listen to when drawing mode gets enabled
  map.on('pm:drawstart', function(e) {
    e.shape; // the name of the shape being drawn (i.e. 'Circle')
    e.workingLayer; // the leaflet layer displayed while drawing
  });
  
  // disable drawing mode
  map.pm.disableDraw('Poly');
  
  // listen to when drawing mode gets disabled
  map.on('pm:drawend', function(e) {
    e.shape; // the name of the shape being drawn (i.e. 'Circle')
  });
  
  // listen to when a new layer is created
  map.on('pm:create', function(e) {
    e.shape; // the name of the shape being drawn (i.e. 'Circle')
    e.layer; // the leaflet layer created
  });
  
  // listen to vertexes being added to the workingLayer (works only on polylines & polygons)
  map.on('pm:drawstart', function(e) {
    var layer = e.workingLayer;
    layer.on('pm:vertexadded', function(e) {
      // e includes the new vertex, it's marker
      // the index in the coordinates array
      // the working layer and shape
    });
  
    // check self intersection
    layer.pm.hasSelfIntersection();
  });
  
  // listen to the center of a circle being added
  map.on('pm:drawstart', function(e) {
    var circle = e.workingLayer;
  
    // this fires only for circles
    circle.on('pm:centerplaced', function(e) {
      console.log(e);
    });
  });
  
  // listen to when the center of a circle is moved
  map.on('pm:create', function(e) {
    var circle = e.layer;
  
    // this fires only for circles
    circle.on('pm:centerplaced', function(e) {
      console.log(e);
    });
  });

  map.pm.addControls(options);

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
    navigator.geolocation.getCurrentPosition(getPosition)
    // var geoStream = setInterval(()=>{
    //     navigator.geolocation.getCurrentPosition(getPosition)
    // }, 5000);
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

    // Measure Control
L.control.measure({
   primaryLengthUnit: 'meters', 
   secondaryLengthUnit: 'kilometers',
   primaryAreaUnit: 'hectares',
   secondaryAreaUnit: undefined 
  }).addTo(map);

// Geocoder
var geocoder = L.Control.geocoder({
  defaultMarkGeocode: false
})
  .on('markgeocode', function(e) {
    var bbox = e.geocode.bbox;
    var poly = L.polygon([
      bbox.getSouthEast(),
      bbox.getNorthEast(),
      bbox.getNorthWest(),
      bbox.getSouthWest()
    ]).addTo(map);
    map.fitBounds(poly.getBounds());
  })

  L.Control.geocoder().addTo(map);

  // Zoom to Layer
  $('.zoomToLyr').click(function(){
    map.setView([-7.7956,110.3695], 10);
  })

  // Leaflet locate 
  L.control.locate({
    position:'topright'
  }).addTo(map);