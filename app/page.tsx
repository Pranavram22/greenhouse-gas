// app/page.tsx
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import styles from './Home.module.css';
import Papa from 'papaparse';

export default function Home() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [emissionsData, setEmissionsData] = useState<{ country: string }[]>([]);
  const router = useRouter(); // Initialize useRouter

  useEffect(() => {
    fetch('/emissions_data.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(csv => {
        // Parse CSV data and set emissionsData
        Papa.parse<{ country: string }>(csv, {
          header: true,
          complete: (results) => {
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

  const handleCountryRedirect = () => {
    // Redirect to the Country page
    router.push('/country');
  };

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Welcome to the Emissions Tool</h1>

      <button onClick={handleCountryRedirect} className={styles.button}>
        View Country-Specific Emissions
      </button>

      <div className={styles.additionalLinks}>
        {/* Placeholder for other links or features */}
        <h2>Other Tools</h2>
        <ul>
          <li><a href="/some-other-tool">Other Tool 1</a></li>
          <li><a href="/another-tool">Other Tool 2</a></li>
        </ul>
      </div>
    </div>
  );
}
