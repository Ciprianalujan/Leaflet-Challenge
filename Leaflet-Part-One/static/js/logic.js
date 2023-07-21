// fetch the earthquake data for the past 7 days (all week)
d3.json("https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson").then(function(data) {
    //console log the data
    console.log(data.features);
    createFeatures(data.features);
})

// set colors based on depth of earthquakes
function getColor(depth) {
    return depth > 90 ? '#0e6251':
           depth > 70 ? '#117864':
           depth > 50 ? '#17a589':
           depth > 30 ? '#1abc9c':
           depth > 10 ? '#48c9b0':
                        '#a3e4d7';
};

function createFeatures(earthquakeData) {
    function onEachFeature(feature, layer) {
      layer.bindPopup("<h3>" + feature.properties.place + "</h3><h3>Magnitude: " + feature.properties.mag + "</h3><h3>Depth (km): " + feature.geometry.coordinates[2] + "</h3>" + `<hr><p>${new Date(feature.properties.time)}</p></hr>`);
    }
  
    let earthquakes = L.geoJson(earthquakeData, {
        pointToLayer: function (feature, latlng) {
            let size = feature.properties;
            let color = feature.geometry;
            let depth = color.coordinates[2];
            if(depth <= 10) {
                return L.circleMarker(latlng, {
                    radius: size.mag*5,
                    color: 'black',
                    fillColor: getColor(depth),
                    fillOpacity: 100,
                    })
            } else if (depth > 10 && depth <= 30) {
                return L.circleMarker(latlng, {
                    radius: size.mag*5,
                    color: 'black',
                    fillColor: getColor(depth),
                    fillOpacity: 100,
                    })      
            } else if (depth > 30 && depth <= 50) {
                return L.circleMarker(latlng, {
                    radius: size.mag*5,
                    color: 'black',
                    fillColor: getColor(depth),
                    fillOpacity: 100,
                    })
            } else if (depth > 50 && depth <= 70) {
                return L.circleMarker(latlng, {
                    radius: size.mag*5,
                    color: 'black',
                    fillColor: getColor(depth),
                    fillOpacity: 100,
                    })
            } else if (depth > 70 && depth <= 90) {
                return L.circleMarker(latlng, {
                    radius: size.mag*5,
                    color: 'black',
                    fillColor: getColor(depth),
                    fillOpacity: 100,
                    })                                                             
            } else {
                return L.circleMarker(latlng, {
                    radius: size.mag*5,
                    color: 'black',
                    fillColor: getColor(depth),
                    fillOpacity: 100,
                    })                  
            }       
        },
        onEachFeature: onEachFeature
    });
    // console.log(earthquakes);
    createMap(earthquakes);
}
 
function createMap(earthquakes) {
    let streetview = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    });

    let topomap = L.tileLayer('https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png', {
        attribution: 'Map data: &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, <a href="http://viewfinderpanoramas.org">SRTM</a> | Map style: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (<a href="https://creativecommons.org/licenses/by-sa/3.0/">CC-BY-SA</a>)'
      });    
  
    let baseMaps = {
      "Street Map": streetview,
      "Topographic Map": topomap
    };
  
    let overlayMaps = {
      Earthquakes: earthquakes
    };
  
    let map = L.map("map", {
      center: [0, 150],
      zoom: 3,
    
    layers: [topomap, earthquakes]
    });

    L.control.layers(baseMaps, overlayMaps, {collapsed: false}).addTo(map);

    let legend = L.control({ position: "bottomright" });
    legend.onAdd = function() {
      let div = L.DomUtil.create("div", "info legend");
      let depths = [-10, 10, 30, 50, 70, 90];
      let labels =[];

      for (let i = 0; i<depths.length; i++) {
        div.innerHTML += '<i style="background-color:' + getColor(depths[i] + 1) + '"></i> ' + 
        depths[i] + (depths[i + 1] ? '&ndash;' + depths[i + 1] + '<br>' : '+');
      }

      return div;
    };

    legend.addTo(map);
}