
window.onload = function(){
// Create a Platform object:
var platform = new H.service.Platform({
  'app_id': 'y8Vqiy3zNGyUHE5Y1bey',
  'app_code': 'vXulv6kbe74kZAWKhpdpxA',
      useCIT: true,
      useHTTPS: true
    });

// Configure panorama with platform credentials:
platform.configure(H.map.render.panorama.RenderEngine)

// Instantiate a map, giving the constructor the engine type to use:
map = new mapsjs.Map('#panaroma', platform.createDefaultLayers().satellite.traffic, {
  center: {lat: 48.8733641244471, lng: 2.294754032045603},
  zoom: 19,
  engineType: H.Map.EngineType.PANORAMA
});
}
