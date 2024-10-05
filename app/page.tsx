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
          <button onClick={() => handleNavigation('/country')} className={styles.navButton}>View Countries</button>
        </nav>
      </header>

      <div className={styles.headerBackground}>
        <h1 className={styles.title}>Uncover the Role of Greenhouse Gases in Your Neighborhood</h1>
        <p className={styles.subtitle}>
          Explore how greenhouse gases affect your local environment and learn how you can make a difference.
        </p>
      </div>

      <main className={styles.mainContent}>
        <section className={styles.descriptionSection}>
          <p className={styles.description}>
            This tool allows you to investigate the impact of greenhouse gases in your neighborhood,
            providing insights into their sources and effects.
            Join us in taking action towards a more sustainable future!
          </p>
        </section>

        <section className={styles.imageSection}>
          <img src="/images.jpg" alt="Greenhouse Gases Impact" className={styles.image} />
          <p className={styles.imageDescription}>
            This image highlights the various sources of greenhouse gases and their impact on our environment.
          </p>
        </section>

        {error && (
          <div className={styles.errorAlert}>
            <p className={styles.errorTitle}>Error</p>
            <p className={styles.errorDescription}>{error}</p>
          </div>
        )}

        {emissionsData.length > 0 && (
          <section className={styles.dataSection}>
            <h2 className={styles.dataTitle}>Emissions Data Overview</h2>
            <p className={styles.dataDescription}>
              {/* We've collected emissions data for {emissionsData.length} countries. 
              Explore detailed information by clicking the 'View Countries' button above. */}
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