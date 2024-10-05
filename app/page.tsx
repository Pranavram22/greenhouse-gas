"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import styles from './Home.module.css';
import Papa from 'papaparse';

export default function Home() {
  const [emissionsData, setEmissionsData] = useState<{ country: string }[]>([]);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    fetch('/emissions_data.csv')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then(csv => {
        Papa.parse<{ country: string }>(csv, {
          header: true,
          complete: (results) => {
            setEmissionsData(results.data);
          },
          error: (error: unknown) => {
            setError('Error parsing CSV data');
            console.error('Error parsing CSV:', error);
          },
        });
      })
      .catch(error => {
        setError('Error fetching CSV data');
        console.error('Error fetching CSV:', error);
      });
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <nav className={styles.navButtons}>
          <button onClick={() => handleNavigation('/')} className={styles.navButton}>Home</button>
          <button onClick={() => handleNavigation('/firedetection')} className={styles.navButton}>Fire Detection</button>
          <button onClick={() => handleNavigation('/country')} className={styles.navButton}>Country Footprint</button>
          <button onClick={() => handleNavigation('/plumedetection')} className={styles.navButton}>Plume Detection</button>
          <button onClick={() => handleNavigation('/volcanoest')} className={styles.navButton}>Volcano Estimation</button>
          <button onClick={() => handleNavigation('/carbonfootprint')} className={styles.navButton}>CarbonFootprint Calculator</button>
        </nav>
      </header>

      {/* Video section with overlay text */}
      <div className={styles.headerBackground}>
        <video autoPlay muted loop className={styles.videoBackground}>
          <source src="/2695085-hd_1920_1080_30fps.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className={styles.textContainer}>
          <h1 className={styles.title}>Uncover the Role of Greenhouse Gases in Your Neighborhood</h1>
          <p className={styles.subtitle}>
            Explore how greenhouse gases affect your local environment and learn how you can make a difference.
          </p>
        </div>
      </div>

      {/* Main content below the video */}
      <main className={styles.mainContent}>
        <section className={styles.buttonInfoSection}>
          <div className={styles.buttonInfo}>
            <h3>Fire Detection</h3>
            <p>This tool helps you detect and monitor fire activity in your area using satellite data.</p>
          </div>
          <div className={styles.buttonInfo}>
            <h3>Country Footprint</h3>
            <p>Analyze the greenhouse gas emissions of different countries and compare their footprints.</p>
          </div>
          <div className={styles.buttonInfo}>
            <h3>Plume Detection</h3>
            <p>Track the movement of harmful plumes of gases released during industrial activities.</p>
          </div>
          <div className={styles.buttonInfo}>
            <h3>Volcano Estimation</h3>
            <p>Estimate the emissions released by volcanic activities around the globe.</p>
          </div>
          <div className={styles.buttonInfo}>
            <h3>CarbonFootprint Calculator</h3>
            <p>Calculate your personal or business carbon footprint and explore ways to reduce it.</p>
          </div>
        </section>

        {/* Handle potential errors */}
        {error && (
          <div className={styles.errorAlert}>
            <p className={styles.errorTitle}>Error</p>
            <p className={styles.errorDescription}>{error}</p>
          </div>
        )}

        {/* Display emissions data if available */}
        {emissionsData.length > 0 && (
          <section className={styles.dataSection}>
            <h2 className={styles.dataTitle}>Emissions Data Overview</h2>
            <p className={styles.dataDescription}>
              {/* Placeholder for emissions data */}
            </p>
          </section>
        )}
      </main>

      <footer className={styles.footer}>
        <p>&copy; 2024 Greenhouse Emissions Project. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
