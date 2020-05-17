/* eslint-disable*/

export const displayMap = (locations) => {
  mapboxgl.accessToken =
    'pk.eyJ1IjoidmFydW5ndXR0aWtvbmRhIiwiYSI6ImNrOW4xY3oxajAwNjAzaG80cWQ4MnQ3cXkifQ.yC_ZDbxLDCpuSX6OgpmWlA';
  var map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/varunguttikonda/ck9n1pibk2bfd1is8xjqejxst',
    scrollZoom: false,
    // center: [-118.113491, 31.111745],
    // zoom: 9,
    // interactive: false,
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach((location) => {
    //Create Marker
    const el = document.createElement('div');
    el.className = 'marker';

    //Add Marker
    new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(location.coordinates)
      .addTo(map);

    //Add Popup
    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(location.coordinates)
      .setHTML(`<p>Day ${location.day}: ${location.description}</p>`)
      .addTo(map);

    //Pan the map for all marker view
    bounds.extend(location.coordinates);
  });

  map.fitBounds(bounds, {
    padding: {
      top: 200,
      bottom: 150,
      left: 100,
      right: 100,
    },
  });
};
