// pages/fire-detection.tsx
"use client";
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import styles from './firedetection.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface FireEvent {
  id: string;
  title: string;
  geometry: Array<{
    date: string;
    coordinates: [number, number];
  }>;
}

interface FireData {
  timestamp: string;
  latitude: number;
  longitude: number;
  title: string;
}

const FireDetectionPage = () => {
  const [fireData, setFireData] = useState<FireData[]>([]);
  const [selectedRegion, setSelectedRegion] = useState<string>('Global');
  const [filteredData, setFilteredData] = useState<FireData[]>([]);

  useEffect(() => {
    const fetchFireData = async () => {
      try {
        const response = await fetch('https://eonet.gsfc.nasa.gov/api/v3/events?category=wildfires&status=open');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        const formattedData: FireData[] = data.events.flatMap((event: FireEvent) =>
          event.geometry.map(geo => ({
            timestamp: geo.date,
            latitude: geo.coordinates[1],
            longitude: geo.coordinates[0],
            title: event.title,
          }))
        );
        setFireData(formattedData);
        setFilteredData(formattedData);
      } catch (error) {
        console.error('Error fetching fire data:', error);
      }
    };

    fetchFireData();
    // Fetch data every 5 minutes
    const interval = setInterval(fetchFireData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (selectedRegion === 'Global') {
      setFilteredData(fireData);
    } else {
      // This is a simple filter based on longitude. You might want to implement more sophisticated filtering.
      const filtered = fireData.filter(item => {
        switch (selectedRegion) {
          case 'North America': return item.longitude >= -170 && item.longitude <= -50;
          case 'South America': return item.longitude >= -90 && item.longitude <= -30;
          case 'Europe': return item.longitude >= -10 && item.longitude <= 40;
          case 'Africa': return item.longitude >= -20 && item.longitude <= 50;
          case 'Asia': return item.longitude >= 60 && item.longitude <= 150;
          case 'Australia': return item.longitude >= 110 && item.longitude <= 155;
          default: return true;
        }
      });
      setFilteredData(filtered);
    }
  }, [selectedRegion, fireData]);

  const handleRegionChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedRegion(event.target.value);
  };

  const notifyBaseStation = () => {
    alert(`Alert sent to base station for fires in ${selectedRegion}`);
  };

  const chartData = {
    labels: filteredData.map(item => new Date(item.timestamp).toLocaleDateString()),
    datasets: [
      {
        label: 'Number of Fire Events',
        data: filteredData.reduce((acc, item) => {
          const date = new Date(item.timestamp).toLocaleDateString();
          acc[date] = (acc[date] || 0) + 1;
          return acc;
        }, {} as {[key: string]: number}),
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Live Satellite Fire Detection System</h1>

      <select className={styles.select} value={selectedRegion} onChange={handleRegionChange}>
        <option value="Global">Global</option>
        <option value="North America">North America</option>
        <option value="South America">South America</option>
        <option value="Europe">Europe</option>
        <option value="Africa">Africa</option>
        <option value="Asia">Asia</option>
        <option value="Australia">Australia</option>
      </select>

      <button className={styles.notifyButton} onClick={notifyBaseStation}>
        Notify Base Station
      </button>

      {filteredData.length > 0 ? (
        <div className={styles.chartContainer}>
          <Line
            className={styles.chart}
            data={chartData}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              scales: {
                x: {
                  title: {
                    display: true,
                    text: 'Date',
                  },
                },
                y: {
                  title: {
                    display: true,
                    text: 'Number of Fire Events',
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      ) : (
        <p className={styles.noData}>No fire data available for the selected region.</p>
      )}

      <div className={styles.dataTable}>
        <h2>Latest Fire Data</h2>
        <table>
          <thead>
            <tr>
              <th>Date</th>
              <th>Latitude</th>
              <th>Longitude</th>
              <th>Title</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.slice(0, 10).map((item, index) => (
              <tr key={index}>
                <td>{new Date(item.timestamp).toLocaleString()}</td>
                <td>{item.latitude.toFixed(4)}</td>
                <td>{item.longitude.toFixed(4)}</td>
                <td>{item.title}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FireDetectionPage;
