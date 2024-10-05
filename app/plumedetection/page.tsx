"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import 'leaflet/dist/leaflet.css';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const LayersControl = dynamic(() => import('react-leaflet').then((mod) => mod.LayersControl), { ssr: false });
const BaseLayer = dynamic(() => import('react-leaflet').then((mod) => mod.LayersControl.BaseLayer), { ssr: false });
const Overlay = dynamic(() => import('react-leaflet').then((mod) => mod.LayersControl.Overlay), { ssr: false });

const NASAAerosolMap: React.FC = () => {
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [date, setDate] = useState<string>(getTodayDate());

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  useEffect(() => {
    // Get user's location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter([position.coords.latitude, position.coords.longitude]);
        },
        () => {
          console.log("Unable to retrieve your location");
        }
      );
    }
  }, []);

  return (
    <div>
      <Head>
        <title>NASA Aerosol Mapping Tool</title>
        <meta name="description" content="Real-time NASA aerosol mapping tool" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>NASA Aerosol Optical Depth Map</h1>

        <div style={{ marginBottom: '20px' }}>
          <label htmlFor="date-select">Select Date: </label>
          <input
            id="date-select"
            type="date"
            value={date}
            max={getTodayDate()}
            onChange={(e) => setDate(e.target.value)}
            style={{ marginLeft: '10px' }}
          />
        </div>

        <div style={{ height: '70vh', width: '100%' }}>
          <MapContainer center={mapCenter} zoom={3} style={{ height: '100%', width: '100%' }}>
            <LayersControl position="topright">
              <BaseLayer checked name="OpenStreetMap">
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
              </BaseLayer>
              <Overlay checked name="Aerosol Optical Depth">
                <TileLayer
                  url={`https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/MODIS_Terra_Aerosol/default/${date}/GoogleMapsCompatible_Level6/{z}/{y}/{x}.png`}
                  attribution="NASA Global Imagery Browse Services"
                />
              </Overlay>
            </LayersControl>
          </MapContainer>
        </div>
      </main>

      <style jsx global>{`
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 0;
          background-color: #f0f0f0;
        }
      `}</style>
    </div>
  );
};

export default NASAAerosolMap;