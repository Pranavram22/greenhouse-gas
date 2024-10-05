"use client";
import { useState } from 'react';
import styles from './CarbonFootprint.module.css';  // CSS module for styling

export default function CarbonFootprintCalculator() {
  const [energyUsage, setEnergyUsage] = useState(0); // kWh
  const [milesDriven, setMilesDriven] = useState(0); // miles driven by car
  const [flights, setFlights] = useState(0); // number of flights
  const [meatConsumption, setMeatConsumption] = useState(0); // kg of meat consumed
  const [waste, setWaste] = useState(0); // kg of waste produced
  const [totalFootprint, setTotalFootprint] = useState(0);
  const [feedback, setFeedback] = useState("");

  const calculateFootprint = () => {
    // Example conversion factors (in kg CO2)
    const energyFactor = 0.5; // 0.5 kg CO2 per kWh
    const carFactor = 0.411; // 0.411 kg CO2 per mile
    const flightFactor = 0.2; // 0.2 kg CO2 per flight
    const meatFactor = 7.5; // 7.5 kg CO2 per kg of meat
    const wasteFactor = 0.1; // 0.1 kg CO2 per kg of waste

    // Calculate total carbon footprint
    const footprint = (energyUsage * energyFactor) +
                      (milesDriven * carFactor) +
                      (flights * flightFactor) +
                      (meatConsumption * meatFactor) +
                      (waste * wasteFactor);
                      
    setTotalFootprint(footprint);

    // Provide feedback based on footprint
    if (footprint < 100) {
      setFeedback("Great job! Your carbon footprint is below average.");
    } else if (footprint < 300) {
      setFeedback("You're doing okay, but there are ways to improve.");
    } else {
      setFeedback("Consider making changes to reduce your carbon footprint!");
    }
  };

  return (
    <div className={styles.calculator}>
      <h1>Carbon Footprint Calculator</h1>

      <div className={styles.section}>
        <label>Energy Usage (kWh per month)</label>
        <input 
          type="number" 
          value={energyUsage} 
          onChange={(e) => setEnergyUsage(Number(e.target.value))} 
        />
      </div>

      <div className={styles.section}>
        <label>Miles Driven per Month</label>
        <input 
          type="number" 
          value={milesDriven} 
          onChange={(e) => setMilesDriven(Number(e.target.value))} 
        />
      </div>

      <div className={styles.section}>
        <label>Number of Flights per Year</label>
        <input 
          type="number" 
          value={flights} 
          onChange={(e) => setFlights(Number(e.target.value))} 
        />
      </div>

      <div className={styles.section}>
        <label>Meat Consumption (kg per month)</label>
        <input 
          type="number" 
          value={meatConsumption} 
          onChange={(e) => setMeatConsumption(Number(e.target.value))} 
        />
      </div>

      <div className={styles.section}>
        <label>Waste Produced (kg per month)</label>
        <input 
          type="number" 
          value={waste} 
          onChange={(e) => setWaste(Number(e.target.value))} 
        />
      </div>

      <button onClick={calculateFootprint}>Calculate</button>

      {totalFootprint > 0 && (
        <div className={styles.feedback}>
          <h3>Total Carbon Footprint: {totalFootprint.toFixed(2)} kg CO2</h3>
          <p>{feedback}</p>
        </div>
      )}
    </div>
  );
}
