/*eslint-disable*/
import mapboxgl from 'mapbox-gl';

mapboxgl.accessToken =
  'pk.eyJ1Ijoic2h1YmhhbS1zYWh1IiwiYSI6ImNtYzcya3N4czBndWgybXIyZ215YXpiY2EifQ.lMkwRTCKz9lkkgszINji_g';

export const displayMap = locations => {
  const map = new mapboxgl.Map({
    container: 'map',
    style: 'mapbox://styles/shubham-sahu/cmc72rajk02dr01qw5osa3fcs',
    scrollZoom: false
  });

  const bounds = new mapboxgl.LngLatBounds();

  locations.forEach(loc => {
    const el = document.createElement('div');
    el.className = 'marker';

    new mapboxgl.Marker({ element: el, anchor: 'bottom' })
      .setLngLat(loc.coordinates)
      .addTo(map);

    new mapboxgl.Popup({ offset: 30 })
      .setLngLat(loc.coordinates)
      .setHTML(`<p>Day ${loc.day}: ${loc.description}</p>`)
      .addTo(map);

    bounds.extend(loc.coordinates);
  });

  map.fitBounds(bounds, {
    padding: { top: 200, bottom: 150, left: 100, right: 100 }
  });
};
