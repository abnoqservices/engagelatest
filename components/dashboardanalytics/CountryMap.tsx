'use client';  // Must be at the very top

import React, { useEffect, useRef } from 'react';
import dynamic from 'next/dynamic';

// Optional: lazy-load the heavy map logic
const CountryMap = dynamic(
  () => Promise.resolve().then(() => {
    // Import inside dynamic to avoid any SSR touch
    const jsVectorMap = require('jsvectormap').default;
    require('jsvectormap/dist/maps/world');  // world map data

    return function InnerCountryMap({ mapColor = '#D0D5DD' }: { mapColor?: string }) {
      const mapRef = useRef<HTMLDivElement>(null);
      const mapInstance = useRef<any>(null);

      useEffect(() => {
        if (!mapRef.current) return;

        // Destroy previous instance (important for re-renders/hot reload)
        if (mapInstance.current) {
          mapInstance.current.destroy();
        }

        mapInstance.current = new jsVectorMap({
          container: mapRef.current,
          map: 'world',
          backgroundColor: 'transparent',
          zoomOnScroll: false,
          zoomMax: 12,
          zoomMin: 1,
          zoomAnimate: true,
          zoomStep: 1.5,
          regionStyle: {
            initial: {
              fill: mapColor,
              fillOpacity: 1,
              stroke: 'none',
              strokeWidth: 0,
              strokeOpacity: 0,
            },
            hover: {
              fillOpacity: 0.7,
              cursor: 'pointer',
              fill: '#465fff',
              stroke: 'none',
            },
            selected: {
              fill: '#465FFF',
            },
          },
          markerStyle: {
            initial: {
              fill: '#465FFF',
              r: 4,
            },
          },
          markers: [
            { name: 'United States', coords: [37.2580397, -104.657039] },
            { name: 'India', coords: [20.7504374, 73.7276105] },
            { name: 'United Kingdom', coords: [53.613, -11.6368] },
            { name: 'Sweden', coords: [-25.0304388, 115.2092761] },
          ],
          // Add tooltips, labels, events if needed
        });

        return () => {
          if (mapInstance.current) mapInstance.current.destroy();
        };
      }, [mapColor]);

      return <div ref={mapRef} style={{ width: '100%', height: '500px' }} />;
    };
  }),
  { ssr: false, loading: () => <div style={{ height: '500px' }}>Loading map...</div> }
);

export default CountryMap;