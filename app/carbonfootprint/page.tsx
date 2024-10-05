"use client";
import { useState } from 'react';
import styles from './CarbonFootprint.module.css';  // Assuming you have a CSS module for styling

export default function CarbonFootprintCalculator() {
  const [energyUsage, setEnergyUsage] = useState(0);
  const [vehicleMiles, setVehicleMiles] = useState(0);
  const [airTravel, setAirTravel] = useState(0);
  const [diet, setDiet] = useState('omnivore');
  const [waste, setWaste] = useState(0);

  const calculateCarbonFootprint = () => {
    const homeFootprint = energyUsage * 0.233; // Example conversion factor
    const transportFootprint = vehicleMiles * 0.404 + airTravel * 0.253;
    const foodFootprint = diet === 'omnivore' ? 1.8 : diet === 'vegetarian' ? 1.2 : 0.9;
    const wasteFootprint = waste * 0.44;

    return homeFootprint + transportFootprint + foodFootprint + wasteFootprint;
  };

  return (
    <div className={styles.calculator}>
      <h1>Advanced Carbon Footprint Calculator</h1>
      
      <div className={styles.section}>
        <label htmlFor="energyUsage">Home Energy Usage (kWh/month):</label>
        <input
          type="number"
          id="energyUsage"
          value={energyUsage}
          onChange={(e) => setEnergyUsage(parseFloat(e.target.value))}
        />
      </div>
      
      <div className={styles.section}>
        <label htmlFor="vehicleMiles">Vehicle Miles Driven (per week):</label>
        <input
          type="number"
          id="vehicleMiles"
          value={vehicleMiles}
          onChange={(e) => setVehicleMiles(parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.section}>
        <label htmlFor="airTravel">Air Travel (miles per year):</label>
        <input
          type="number"
          id="airTravel"
          value={airTravel}
          onChange={(e) => setAirTravel(parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.section}>
        <label htmlFor="diet">Diet Type:</label>
        <select id="diet" value={diet} onChange={(e) => setDiet(e.target.value)}>
          <option value="omnivore">Omnivore</option>
          <option value="vegetarian">Vegetarian</option>
          <option value="vegan">Vegan</option>
        </select>
      </div>

      <div className={styles.section}>
        <label htmlFor="waste">Waste Produced (lbs/month):</label>
        <input
          type="number"
          id="waste"
          value={waste}
          onChange={(e) => setWaste(parseFloat(e.target.value))}
        />
      </div>

      <div className={styles.section}>
        <button onClick={() => alert(`Your total carbon footprint is ${calculateCarbonFootprint()} tons/year`)}>
          Calculate
        </button>
      </div>
    </div>
  );
}
