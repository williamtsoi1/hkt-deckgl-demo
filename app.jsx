import React, {useState} from 'react';
import {createRoot} from 'react-dom/client';
import {Map} from 'react-map-gl';
import maplibregl from 'maplibre-gl';
import DeckGL from '@deck.gl/react';
import {ScatterplotLayer} from '@deck.gl/layers';

const DATA_URL = './data/large_demo.json'; // eslint-disable-line

const INITIAL_VIEW_STATE = {
  longitude: 114.183334,
  latitude: 22.302711,
  zoom: 14,
  maxZoom: 20,
  pitch: 0,
  bearing: 0
};

const MAP_STYLE = 'https://basemaps.cartocdn.com/gl/dark-matter-nolabels-gl-style/style.json';

export default function App({
  data = DATA_URL,
  radiusPixels = 1,
  mapStyle = MAP_STYLE
}) {
  const [hoverInfo, setHoverInfo] = useState(0);
  const layers = [
    new ScatterplotLayer({
      id: 'scatter-plot',
      data,
      pickable: true,
      radiusScale: radiusPixels,
      radiusMinPixels: 5,
      radiusMaxPixels: 1000,
      getPosition: d => [ d['Demo Longitude'], d['Demo Latitude'] ],
      getRadius: d => Math.sqrt(d["Demo Number of Units"]),
      getFillColor: d => [(255 * (1 - (d["Demo Bank1 Opportunity"]/100))), (255 * (d["Demo Bank1 Opportunity"]/100)),0, 128],
      onHover: info => setHoverInfo(info)
    })
  ];

  return (
    <DeckGL initialViewState={INITIAL_VIEW_STATE} controller={true} layers={layers}>
      <Map reuseMaps mapLib={maplibregl} mapStyle={mapStyle} preventStyleDiffing={true} />
      {hoverInfo.object && (
        <div style={{position: 'absolute', zIndex: 1, pointerEvents: 'none', left: hoverInfo.x, top: hoverInfo.y, color: '#FFFFFF', backgroundColor: '#000000', padding: '10px 10px 10px 10px'}}>
          <p>Address: {hoverInfo.object["Demo Address"]}</p>
          <p>Number of households: {hoverInfo.object["Demo Number of Units"]}</p>
          <p>Imputed PVI: {hoverInfo.object["Demo Imputed Pvi"]}</p>
          <p>Bank1 Opportunity: {hoverInfo.object["Demo Bank1 Opportunity"].toFixed(2)}</p>
          <p>Bank1 Penetration: {hoverInfo.object["Demo Bank1 Penetration"].toFixed(2)}</p>
          <p>Industry Penetration: {hoverInfo.object["Demo Industry Penetration"].toFixed(2)}</p>
        </div>
      )}
    </DeckGL>
  );
}

export function renderToDOM(container) {
  createRoot(container).render(<App />);
}
