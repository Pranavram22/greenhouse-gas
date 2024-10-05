"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Import useRouter
import styles from './Home.module.css';
import Papa from 'papaparse';

export default function Home() {
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
    router.push('/country'); // Redirect to the Country page
  };

  const handleFireDetectionRedirect = () => {
    router.push('/firedetection'); // Redirect to the Fire Detection page
  };

  const handleHomeRedirect = () => {
    router.push('/'); // Redirect to Home page
  };

  return (
    <div className={styles.container}>
      {/* Team Name on Left Top */}
      <div className={styles.teamName}>White Aura</div>
      
      {/* Navigation Buttons on Top Right */}
      <div className={styles.navButtons}>
        <button onClick={handleHomeRedirect} className={styles.navButton}>
          Home
        </button>
        <button onClick={handleFireDetectionRedirect} className={styles.navButton}>
          Fire Detection
        </button>
        <button onClick={handleCountryRedirect} className={styles.navButton}>
          View Countries
        </button>
      </div>

      {/* Header Section with Background Image */}
      <header className={styles.header}>
        <div className={styles.headerBackground}>
          <h1 className={styles.title}>Uncover the Role of Greenhouse Gases in Your Neighborhood</h1>
          <p className={styles.subtitle}>
            Explore how greenhouse gases affect your local environment and learn how you can make a difference.
          </p>
        </div>
      </header>

      {/* Additional Description Below Title */}
      <section className={styles.descriptionSection}>
        <p className={styles.description}>
          This tool allows you to investigate the impact of greenhouse gases in your neighborhood, 
          providing insights into their sources and effects. 
          Join us in taking action towards a more sustainable future!
        </p>
      </section>

      {/* Image Section */}
      <section className={styles.imageSection}>
        <img src="/images.jpg" alt="Greenhouse Gases Impact" className={styles.image} />
        <p className={styles.imageDescription}>
          This image highlights the various sources of greenhouse gases and their impact on our environment.
        </p>
      </section>

      <footer className={styles.footer}>
        <p>&copy; 2024 Greenhouse Emissions Project. All Rights Reserved.</p>
      </footer>
    </div>
  );
}
