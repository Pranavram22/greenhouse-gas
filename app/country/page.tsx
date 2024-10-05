// app/country/page.tsx
"use client";
"use client";
import { useEffect, useState } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend } from 'chart.js';
import { Bar } from 'react-chartjs-2';
import Papa from 'papaparse';
import styles from './country.module.css'; // Adjust path if necessary

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

interface EmissionsData {
  country: string;
  year: string;
  co2: string; // CO2 emissions data
  methane?: string; // Optional methane emissions data
  population?: string; // Population data
  perCapitaPollution?: string; // Per capita pollution data
  [key: string]: string | undefined; // Allows additional data points
}

const CountryPage = () => {
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
            setEmissionsData(results.data);
            // Filter data for the default country
            const countryData = results.data.filter((item) => item.country === selectedCountry);
            setFilteredData(countryData);
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
      {
        label: 'Methane Emissions',
        data: filteredData.map(item => parseFloat(item.methane ?? '0') || 0),
        backgroundColor: 'rgba(255, 99, 132, 0.6)',
      },
      {
        label: 'Population',
        data: filteredData.map(item => parseFloat(item.population ?? '0') || 0),
        backgroundColor: 'rgba(255, 206, 86, 0.6)',
      },
      {
        label: 'Per Capita Pollution',
        data: filteredData.map(item => parseFloat(item.perCapitaPollution ?? '0') || 0),
        backgroundColor: 'rgba(153, 102, 255, 0.6)',
      },
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

      {filteredData.length > 0 ? (
        <div className={styles.chartContainer}>
          <Bar
            className={styles.chart}
            data={chartData}
            options={{
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
                    text: 'Emissions / Population',
                  },
                  beginAtZero: true,
                },
              },
            }}
          />
        </div>
      ) : (
        <p className={styles.noData}>No data available for the selected country.</p>
      )}
    </div>
  );
};

export default CountryPage;
