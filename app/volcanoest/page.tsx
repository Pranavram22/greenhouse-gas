"use client"
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import Head from 'next/head';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const MapContainer = dynamic(() => import('react-leaflet').then((mod) => mod.MapContainer), { ssr: false });
const TileLayer = dynamic(() => import('react-leaflet').then((mod) => mod.TileLayer), { ssr: false });
const Marker = dynamic(() => import('react-leaflet').then((mod) => mod.Marker), { ssr: false });
const Popup = dynamic(() => import('react-leaflet').then((mod) => mod.Popup), { ssr: false });

interface Volcano {
  id: string;
  name: string;
  latitude: number;
  longitude: number;
  riskLevel: number;
}

interface EONETEvent {
  id: string;
  title: string;
  geometry: Array<{
    date: string;
    type: string;
    coordinates: [number, number];
  }>;
}

const VolcanoAlertSystem: React.FC = () => {
  const [volcanoes, setVolcanoes] = useState<Volcano[]>([]);
  const [, setSelectedVolcano] = useState<Volcano | null>(null);
  const [mapCenter, setMapCenter] = useState<[number, number]>([0, 0]);
  const [date, setDate] = useState<string>(getTodayDate());
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  function getTodayDate() {
    const today = new Date();
    return today.toISOString().split('T')[0];
  }

  useEffect(() => {
    fetchVolcanoData();
    const interval = setInterval(fetchVolcanoData, 300000); // Fetch every 5 minutes
    return () => clearInterval(interval);
  }, [date]);

  async function fetchVolcanoData() {
    setLoading(true);
    setError(null);
    try {
      // Fetch NASA's MODIS Thermal Anomalies data
      const response = await axios.get(`https://eonet.gsfc.nasa.gov/api/v3/events?category=volcanoes&status=open&date=${date}`);
      
      // Process the data and create our volcano objects
      const volcanoData: Volcano[] = response.data.events.map((event: EONETEvent) => {
        if (!event.geometry || event.geometry.length === 0) {
          throw new Error(`Invalid event data: ${JSON.stringify(event)}`);
        }
        return {
          id: event.id,
          name: event.title,
          latitude: event.geometry[0].coordinates[1],
          longitude: event.geometry[0].coordinates[0],
          riskLevel: calculateRiskLevel(event),
        };
      });

      setVolcanoes(volcanoData);
      if (volcanoData.length > 0) {
        setMapCenter([volcanoData[0].latitude, volcanoData[0].longitude]);
      }
    } catch (error) {
      console.error("Error fetching volcano data:", error);
      setError("Failed to fetch volcano data. Please try again later.");
    }
    setLoading(false);
  }

  function calculateRiskLevel(event: EONETEvent): number {
    if (!event.geometry || event.geometry.length === 0) {
      return 1; // Default to lowest risk if no geometry data
    }
    const daysSinceStart = (new Date().getTime() - new Date(event.geometry[0].date).getTime()) / (1000 * 3600 * 24);
    return Math.min(Math.floor(daysSinceStart / 7) + 1, 5);
  }

  function getMarkerColor(riskLevel: number): string {
    const colors = ['green', 'yellow', 'orange', 'red', 'purple'];
    return colors[riskLevel - 1] || 'gray';
  }

  function handleAlertAuthorities(volcano: Volcano) {
    console.log(`Alert sent to authorities about ${volcano.name}`);
    alert(`Alert sent to authorities about ${volcano.name}`);
  }

  return (
    <div>
      <Head>
        <title>Advanced Volcano Alert System</title>
        <meta name="description" content="Real-time volcano monitoring and alert system" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main style={{ padding: '20px' }}>
        <h1 style={{ color: '#333', marginBottom: '20px' }}>Advanced Volcano Alert System</h1>

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

        {loading ? (
          <p>Loading volcano data...</p>
        ) : error ? (
          <p style={{ color: 'red' }}>{error}</p>
        ) : (
          <div style={{ display: 'flex', height: '70vh' }}>
            <div style={{ width: '70%', height: '100%' }}>
              <MapContainer center={mapCenter} zoom={3} style={{ height: '100%', width: '100%' }}>
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                />
                {volcanoes.map((volcano) => (
                  <Marker
                    key={volcano.id}
                    position={[volcano.latitude, volcano.longitude]}
                    eventHandlers={{
                      click: () => setSelectedVolcano(volcano),
                    }}
                    icon={L.divIcon({
                      className: 'custom-icon',
                      html: `<div style="background-color: ${getMarkerColor(volcano.riskLevel)}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white;"></div>`,
                    })}
                  >
                    <Popup>
                      <h3>{volcano.name}</h3>
                      <p>Risk Level: {volcano.riskLevel}/5</p>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            </div>
            <div style={{ width: '30%', height: '100%', overflowY: 'auto', padding: '0 20px' }}>
              <h2>Volcano List</h2>
              {volcanoes.map((volcano) => (
                <div key={volcano.id} style={{ border: '1px solid #ccc', borderRadius: '4px', padding: '10px', marginBottom: '10px' }}>
                  <h3>{volcano.name}</h3>
                  <p>Risk Level: {volcano.riskLevel}/5</p>
                  <button onClick={() => handleAlertAuthorities(volcano)} style={{ marginTop: '10px' }}>
                    Alert Authorities
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
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

export default VolcanoAlertSystem;