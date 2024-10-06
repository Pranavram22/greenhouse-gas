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
        <div className={styles.logo}>WHITE AURA</div><img src='/WhatsApp Image 2024-10-06 at 10.10.14_c7a9cd29'></img>
        <nav className={styles.navButtons}>
          <button onClick={() => handleNavigation('/')} className={styles.navButton}>Home</button>
          <button onClick={() => handleNavigation('/firedetection')} className={styles.navButton}>Fire Detection</button>
          <button onClick={() => handleNavigation('/country')} className={styles.navButton}>Country Footprint</button>
          <button onClick={() => handleNavigation('/plumedetection')} className={styles.navButton}>Plume Detection</button>
          <button onClick={() => handleNavigation('/volcanoest')} className={styles.navButton}>Volcano Estimation</button>
          <button onClick={() => handleNavigation('/carbonfootprint')} className={styles.navButton}>Carbon Footprint Calculator</button>
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

      {/* Image Section with Captions */}
      <main className={styles.mainContent}>
        <section className={styles.imageSection}>
          <div className={styles.imageWrapper}>
            <img src="/Screenshot 2024-10-06 051130.png" alt="Fire Detection" className={styles.image} />
            <p className={styles.caption}>Fire Detection</p>
          </div>
          <div className={styles.imageWrapper}>
            <img src="/Screenshot 2024-10-06 051037.png" alt="Country Footprint" className={styles.image} />
            <p className={styles.caption}>Country Footprint</p>
          </div>
          <div className={styles.imageWrapper}>
            <img src="/Screenshot 2024-10-06 050822.png" alt="Plume Detection" className={styles.image} />
            <p className={styles.caption}>Plume Detection</p>
          </div>
          <div className={styles.imageWrapper}>
            <img src="/Screenshot 2024-10-06 050948.png" alt="Volcano Estimation" className={styles.image} />
            <p className={styles.caption}>Volcano Estimation</p>
          </div>
          <div className={styles.imageWrapper}>
            <img src="/Screenshot 2024-10-06 052416.png" alt="Carbon Footprint Calculator" className={styles.image} />
            <p className={styles.caption}>Carbon Footprint Calculator</p>
          </div>
        </section>

        {/* New Section for Related Text and Images */}
        <section className={styles.relatedSection}>
          <h2 className={styles.relatedTitle}>Explore Related Topics</h2>
          <div className={styles.relatedGrid}>
            <div className={styles.relatedCard}>
              <img src="/download.jpeg" alt="Climate Change Effects" className={styles.relatedImage} />
              <h3 className={styles.cardTitle}>Climate Change Effects</h3>
              <p className={styles.cardDescription}>
                Learn about the effects of climate change on ecosystems and biodiversity.
              </p>
            </div>
            <div className={styles.relatedCard}>
              <img src="/download (1).jpeg" alt="Sustainable Practices" className={styles.relatedImage} />
              <h3 className={styles.cardTitle}>Sustainable Practices</h3>
              <p className={styles.cardDescription}>
                Discover sustainable practices to mitigate climate change and protect the environment.
              </p>
            </div>
            <div className={styles.relatedCard}>
              <img src="/renewable-energy-sources-for-a-sustainable-future.jpg" alt="Renewable Energy" className={styles.relatedImage} />
              <h3 className={styles.cardTitle}>Renewable Energy</h3>
              <p className={styles.cardDescription}>
                Explore renewable energy sources and their role in reducing greenhouse gas emissions.
              </p>
            </div>
          </div>
        </section>

        {/* Handle potential errors */}
        {error && (
          <div className={styles.errorAlert}>
            <p className={styles.errorTitle}>Error</p>
            <p className={styles.errorDescription}>{error}</p>
          </div>
        )}

        {/* Fire Detection Section */}
        <section className={styles.fireDetectionSection}>
    
          <img
            src="/FIRMS_24hrs[@47.0,27.8,3.0z].jpg"
            alt="Fire Detection"
            className={styles.fireImage}
          />
        </section>
      </main>

      <footer className="footer">
        <div className="footer-content">
          <div className="footer-section logo-section">
            <p>© 2024 EarthVision, Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
