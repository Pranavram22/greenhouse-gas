// app/page.tsx
"use client"
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import styles from './Home.module.css';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EmissionsData {
  country: string;
  year: string;
  co2: string; // CO2 emissions data
  methane: string; // Optional: use this if you want to display methane data too
}

export default function Home() {
  const [emissionsData, setEmissionsData] = useState<EmissionsData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('United States');
  const [filteredData, setFilteredData] = useState<EmissionsData[]>([]);

  useEffect(() => {
    fetch('/emissions_data.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(csv => {
        Papa.parse<EmissionsData>(csv, {
          header: true,
          complete: (results) => {
            console.log('Parsed Data:', results.data);
            setEmissionsData(results.data);
          },
          error: (error: unknown) => {
            console.error('Error parsing CSV:', error);
          },
        });
      })
      .catch(error => {
        console.error('Error fetching CSV:', error);
      });
  }, []);

  useEffect(() => {
    if (emissionsData.length > 0) {
      const countryData = emissionsData.filter((item) => item.country === selectedCountry);
      setFilteredData(countryData);
    }
  }, [selectedCountry, emissionsData]);

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const chartData = {
    labels: filteredData.map(item => item.year),
    datasets: [
      {
        label: 'CO2 Emissions',
        data: filteredData.map(item => parseFloat(item.co2) || 0),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
      },
      // Add more datasets for methane or other metrics as needed
    ],
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Country-Specific Emissions Tool</h1>

      <select className={styles.select} value={selectedCountry} onChange={handleCountryChange}>
        {Array.from(new Set(emissionsData.map((item) => item.country))).map((country) => (
          <option key={country} value={country}>
            {country}
          </option>
        ))}
      </select>

      {filteredData.length > 0 && (
        <div className={styles.chartContainer}>
          <Bar className={styles.chart} data={chartData} />
        </div>
      )}
    </div>
  );
}
