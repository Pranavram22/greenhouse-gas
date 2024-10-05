"use client";

import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';
import Papa from 'papaparse';
import styles from './country.module.css';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

interface EmissionsData {
  country: string;
  year: string;
  population: string;
  gdp: string;
  co2: string;
  methane: string;
  nitrous_oxide: string;
  [key: string]: string;
}

const CountryPage = () => {
  const [emissionsData, setEmissionsData] = useState<EmissionsData[]>([]);
  const [selectedCountry, setSelectedCountry] = useState<string>('United States');
  const [filteredData, setFilteredData] = useState<EmissionsData[]>([]);
  const [latestData, setLatestData] = useState<EmissionsData | null>(null);

  useEffect(() => {
    fetch('/emissions_data.csv')
      .then(response => response.text())
      .then(csv => {
        Papa.parse<EmissionsData>(csv, {
          header: true,
          complete: (results) => {
            setEmissionsData(results.data);
            updateFilteredData(results.data, selectedCountry);
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
    updateFilteredData(emissionsData, selectedCountry);
  }, [selectedCountry, emissionsData]);

  const updateFilteredData = (data: EmissionsData[], country: string) => {
    const countryData = data.filter((item) => item.country === country);
    setFilteredData(countryData);
    setLatestData(countryData[countryData.length - 1] || null);
  };

  const handleCountryChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedCountry(event.target.value);
  };

  const chartData = {
    labels: filteredData.map(item => item.year),
    datasets: [
      {
        label: 'CO2 Emissions',
        data: filteredData.map(item => parseFloat(item.co2) || 0),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
      },
      {
        label: 'Methane Emissions',
        data: filteredData.map(item => parseFloat(item.methane) || 0),
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 0.2)',
      },
      {
        label: 'Nitrous Oxide Emissions',
        data: filteredData.map(item => parseFloat(item.nitrous_oxide) || 0),
        borderColor: 'rgba(255, 206, 86, 1)',
        backgroundColor: 'rgba(255, 206, 86, 0.2)',
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        title: {
          display: true,
          text: 'Year',
        },
      },
      y: {
        title: {
          display: true,
          text: 'Emissions',
        },
        beginAtZero: true,
      },
    },
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

      <div className={styles.contentContainer}>
        {filteredData.length > 0 && latestData ? (
          <>
            <div className={styles.chartContainer}>
              <Line data={chartData} options={chartOptions} />
            </div>
            <div className={styles.infoContainer}>
              <h2>{selectedCountry}</h2>
              <div className={styles.infoGrid}>
              <div className={styles.infoItem}>
            <h3>Population</h3>
            <p>{parseInt(latestData.population).toLocaleString()}</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>GDP</h3>
            <p>${(parseFloat(latestData.gdp) / 1e9).toLocaleString()} billion</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>Share of temperature change from GHG</h3>
            <p>{parseFloat(latestData.share_of_temperature_change_from_ghg).toFixed(2)} °C</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>Coal Emissions</h3>
            <p>{parseFloat(latestData.coal_co2).toLocaleString()} million tonnes</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>Total Greenhouse Gases</h3>
            <p>{parseFloat(latestData.total_ghg).toLocaleString()} million tonnes CO2eq</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>CO2 Emissions</h3>
            <p>{parseFloat(latestData.co2).toLocaleString()} million tonnes</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>Share of Global Emissions</h3>
            <p>{parseFloat(latestData.share_global_co2).toFixed(2)}%</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>CO2 Consumption</h3>
            <p>{parseFloat(latestData.consumption_co2).toLocaleString()} million tonnes</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>CO2 Per Capita</h3>
            <p>{parseFloat(latestData.co2_per_capita).toFixed(2)} tonnes</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>Methane Emissions</h3>
            <p>{parseFloat(latestData.methane).toLocaleString()} million tonnes CO2eq</p>
          </div>
          
          <div className={styles.infoItem}>
            <h3>Nitrous Oxide Emissions</h3>
            <p>{parseFloat(latestData.nitrous_oxide).toLocaleString()} million tonnes CO2eq</p>
          </div>
              </div>
            </div>
          </>
        ) : (
          <p className={styles.noData}>No data available for the selected country.</p>
        )}
      </div>
    </div>
  );
};

export default CountryPage;