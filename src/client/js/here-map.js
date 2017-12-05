(function(){
  "use strict";

  /**
   * [platform description - setting up th eplatform fo rthe here map with the app id and app code]
   * @type {H}
   */
  var platform = new H.service.Platform({
        'app_id': 'y8Vqiy3zNGyUHE5Y1bey',
        'app_code': 'vXulv6kbe74kZAWKhpdpxA',
        useCIT: true,
        useHTTPS: true
      }),mapView = {};

  // Obtain the default map types from the platform object:
  var defaultLayers = platform.createDefaultLayers();

  //Variables required for custom drawing
  var isDrawingModeEnabled = false; // flag to denote whether to draw a polyline or not
  var fense = new H.geo.LineString(); // hold the lat and lng of the service area

  /**
   * [Event listener (  button click ) description - Event listener for updating the drawing mode.]
   * @method onclick
   */
  document.getElementById("button").onclick = function(ev) {
    isDrawingModeEnabled = !isDrawingModeEnabled;
    document.getElementById("button").innerHTML = isDrawingModeEnabled ? 'Disable Drawing Mode' : 'Enable Drawing Mode';
  }

  /**
   * [onload description - gets triggered once the dom is loaded.]
   * @method onload
   * @return {[type]} [description]
   */
  window.onload = function() {
    initializeMap();
    addBehavioursToMap('en-US');
    constructMarkers(mapView.map, {lat: 13.13658, lng: 80.20605}, 'pencil');
    moveMapToCoordinate(mapView.map, 14, {lat: 13.13658, lng: 80.20605}); //params map/zoomlevel/coordinates
    addEventListener(mapView.map, 'tap');
    addEventListener(mapView.map, 'dbltap');
    addEventListener(mapView.map, 'dragstart');
    addEventListener(mapView.map, 'dragend');
    addEventListener(mapView.map, 'drag');
    changeBaseLayer(mapView.map, defaultLayers.satellite.traffic); //defaultLayers.satellite.traffic
  };

  /**
   * [initializeMap description - creates the map]
   * @method initializeMap
   */
  function initializeMap() {
    mapView.map = new H.Map(
      document.getElementById('mapContainer'),
      defaultLayers.normal.map,
    );
  }

  /**
   * [addEventListener description - Used to add event listeners and handle the events when triggered.]
   * @method addEventListener
   * @param  {[here map object]}         map      [description - actual here map]
   * @param  {[string]}         listener [description - can be 'click', 'drag', 'dbltap', 'dragEnd', 'dragstart', etc.,.]
   */
  function addEventListener(map, listener) {
    map.addEventListener(listener, function(evt) {
      console.log(evt.type);
      var target = evt.target,
          pointer = evt.currentPointer;

       //If the event is triggered by the marker and the event is 'dragstart' then
       //disable the map's drag behaviour. So that the marker can be dragged.
       if (target instanceof mapsjs.map.Marker && evt.type == 'dragstart') {
           mapView.behavior.disable();
       }

       //If the event is triggered by the marker and the event is 'dragend' then
       //enable the map's drag behaviour. So that the map can be dragged.
       if (target instanceof mapsjs.map.Marker && evt.type == 'dragend') {
           mapView.behavior.enable();
       }

       //If the event is triggered by the marker and the event is drag then
       //trigger the method to save the geolocation and draw the polyline.
       if (target instanceof mapsjs.map.Marker && evt.type == 'drag') {
         if(isDrawingModeEnabled) {
           generateAndSaveServiceArea(evt, mapView.map);
         }
         target.setPosition(mapView.map.screenToGeo(pointer.viewportX, pointer.viewportY));
       }
    });
  }

  /**
   * [generateAndSaveServiceArea description - Gets the markers latitude and longitude and draws a polyline.]
   * @method generateAndSaveServiceArea
   * @param  {[event]}    layer [description - event object]
   * @param  {[here map object]}          map   [description - actual here map]
   */
  function generateAndSaveServiceArea(event, map) {
    var position = map.markers.getPosition();
    console.log(position.lat);
    fense.pushPoint({
      lat: position.lat,
      lng: position.lng
    });
    var polyline = new H.map.Polyline(fense, { style: { lineWidth: 5, strokeColor: 'red', fillColor: 'rgba(0,0,0,0)' }});
    mapView.map.addObject(polyline);
  }

  /**
   * [changeBaseLayer description - Used for changing the map's layer like changing traffic view to satellite view or terrain view.]
   * @method changeBaseLayer
   * @param  {[here map object]}          map   [description - actual here map]
   * @param  {[here map layer object]}    layer [description - actual here layer]
   */
  function changeBaseLayer(map, layer) {
    map.setBaseLayer(layer);
  }

  /**
   * [addBehavioursToMap description - Used to enable adding the event listeners for  click, drag and other events.Its done using the ' H.mapevents.MapEvents'
   *                                    'H.mapevents.Behavior' is used to enable the actual draggable and other events to the map itself.
   *                                    'createDefault' is used to enable the default UI components of the here map.]
   * @method addBehavioursToMap
   * @param  {[string]}           language [can be
   *    en-US – English (United States)
   *    de-DE – German                pl-PL – Polish
   *    pt-BR – Portuguese (Brazil)   pt-PT – Portuguese (Portugal)
   *    ru-RU – Russian               tr-TR – Turkish
   *    zh-CN – Chinese (China)]      es-ES – Spanish
   *    fi-FI – Finnish               fr-FR – French
   *    it-IT – Italian               nl-NL – Dutch
   *
   */
  function addBehavioursToMap(language) {
    mapView.mapEvents = new H.mapevents.MapEvents(mapView.map);
    // Instantiate the default behavior, providing the mapEvents object:
    mapView.behavior = new H.mapevents.Behavior(mapView.mapEvents);
    // Instantiate the default UI components for the map, providing the ui object:
    mapView.ui = H.ui.UI.createDefault(mapView.map, defaultLayers, language);
  }

  /**
   * [enableOrDisableControl description - Used to enable or disable the default controls of the here map]
   * @method enableOrDisableControl
   * @param  {[string]}               control [ can be the following "mapsettings", "zoom", "scalebar", "panaroma"]
   * @param  {[Boolean]}               status  [can be true or false]
   */
  function enableOrDisableControl(control, status) {
    mapView.ui.getControl(control).setEnabled(status);
  }

  /**
   * [setAlignmentForMapControls description -SEts the alignment for the maps default controls/ components.]
   * @method setAlignmentForMapControls
   * @param  {[type]}                   control   [can be the following "mapsettings", "zoom", "scalebar", "panaroma"]
   * @param  {[type]}                   alignment [side of placing the components (i.e. top-left, top-right etc)]
   */
  function setAlignmentForMapControls(control, alignment) {
    mapView.ui.getControl(control).setAlignment(alignment);
  }

  /**
   * [constructMarkers description - Used to create marker using a custom image and add it to the map]
   * @method constructMarkers
   * @param  {[here map object]}         map [actual map]
   */
  function constructMarkers(map, coords, iconName) {
    var icon = new H.map.Icon(icons[iconName]);

    // Add the marker to the map:
    map.markers = new H.map.Marker(coords,{icon: icon});
    map.markers.draggable = true;
    map.addObject(map.markers);
  }

  /**
   * [moveMapToCoordinate description - Moves the view port to the given coordinate and sets the zoom level to the given number]
   * @method moveMapToCoordinate
   * @param  {[here Map object]}        map [Actual map]
   * @param  {[integer]}                zoomlevel [level of zoom]
   * @param  {[object]}                 coordinates [description]
   */
  function moveMapToCoordinate(map, zoomlevel, coordinates){
    map.setCenter({
      lat: coordinates.lat,
      lng: coordinates.lng
    });
    map.setZoom(zoomlevel);
  }

  /**
   * [showInfoBubble description - show an info in the given coordinates.]
   * @method showInfoBubble
   * @param  {[type]}       coordinates [description -  latitude and logitue coordinates]
   * @param  {[type]}       htmlContent [description - actual html content]
   */
  function showInfoBubble(coordinates, htmlContent) {
    var bubble = new H.ui.InfoBubble(coordinates, {
        content: htmlContent
       });

    // Add info bubble to the UI:
    ui.addBubble(bubble);
  }

  /**
   * [getGeoCodeFromAddress description - used to get the geo coordinates fromt he address]
   * @method getGeoCodeFromAddress
   * @param  {[string]}              address [description - address]
   */
  function getGeoCodeFromAddress(address) {
    var geocodingParams = {
      searchText: address
    },
    geocoder = platform.getGeocodingService();
    geocoder.geocode(geocodingParams, function(result){
      var locations = result.Response.View[0].Result,
          position,
          marker;
      // Add a marker for each location found
      for (i = 0;  i < locations.length; i++) {
      position = {
        lat: locations[i].Location.DisplayPosition.Latitude,
        lng: locations[i].Location.DisplayPosition.Longitude
      };
      constructMarkers(mapView.map, position, 'pencil');
      }
    }, function(e) {
      console.log("error" , e);
    });
  }

  /**
   * [getAddressFromGeoCode description - Used to get the address from the geo code]
   * @method getAddressFromGeoCode
   * @param  {[type]}              prox       [description]
   * @param  {[type]}              mode       [description]
   * @param  {[type]}              maxResults [description]
   * @return {[type]}                         [description]
   */
  function getAddressFromGeoCode(prox, mode, maxResults) {
    // var reverseGeocodingParameters = {
    //     prox: '52.5309,13.3847,150',
    //     mode: 'retrieveAddresses',
    //     maxresults: 1
    //   };
    var geocoder = platform.getGeocodingService();
    geocoder.reverseGeocode(
      reverseGeocodingParameters,
      function(result) {
        var location = result.Response.View[0].Result[0],
            coordinates =  {
               lat: location.Location.DisplayPosition.Latitude,
               lng: location.Location.DisplayPosition.Longitude
            },
            content = { content: location.Location.Address.Label };
        showInfoBubble(coordinates, content);
      },
      function(e) {
        console.log("error ... ", e);
     });
  }

  /**
   * [getLandMark description - Used to get the landmark for the given place]
   * @method getLandMark
   * @param  {[string]}    landmarkSearchParameters [description - place]
   */
  function getLandMark(landmarkSearchParameters) {
    // var landmarkSearchParameters = {
    //   searchText: 'ORD'
    // };
    var geocoder = platform.getGeocodingService();
    geocoder.search(
      reverseGeocodingParameters,
      function(result) {
        var location =  result.Response.View[0].Result[0].Place.Locations[0],
            coordinates =  {
               lat: location.DisplayPosition.Latitude,
               lng: location.DisplayPosition.Longitude
            },
            content = { content: location.Name };
        showInfoBubble(coordinates, content);
      },
      function(e) {
        console.log("error ... ", e);
     });
  }
})();
