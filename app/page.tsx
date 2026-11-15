"use client";

import React, { useState } from "react";

export default function Home() {
  return <InputCard />;
}

// Define some example presets
const PRESETS = [
  {
    label: "Barnard's Star",
    data: {
      rightAscension: "269.4520",
      declination: "4.6933",
      infraredBand: "",
      timeGap: "",
      angleSearch: "",
    },
  },
  {
    label: "Epsilon Indi",
    data: {
      rightAscension: "330.8404",
      declination: "-56.7861",
      infraredBand: "",
      timeGap: "",
      angleSearch: "",
    },
  },
  {
    label: "WISE 0855",
    data: {
      rightAscension: "133.7951",
      declination: "-7.2452",
      infraredBand: "",
      timeGap: "",
      angleSearch: "",
    },
  },
  {
    label: "RW Aurigae",
    data: {
      rightAscension: "76.9561",
      declination: "30.4013",
      infraredBand: "",
      timeGap: "",
      angleSearch: "",
    },
  },
  {
    label: "R Draconis",
    data: {
      rightAscension: "248.1667",
      declination: "66.7547",
      infraredBand: "",
      timeGap: "",
      angleSearch: "",
    },
  },
];

function InputCard() {
  // State to hold the form values
  const [formValues, setFormValues] = useState({
    rightAscension: "",
    declination: "",
    infraredBand: "",
    timeGap: "",
    angleSearch: "",
  });

  // Handle changes for regular typing
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormValues((prev) => ({ ...prev, [name]: value }));
  };

  // Handle preset button clicks
  const applyPreset = (presetData: typeof formValues) => {
    setFormValues(presetData);
  };

  const SubHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "http://localhost:YOUR_PORT_HERE/api/search",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(formValues),
        },
      );

      if (!response.ok) {
        throw new Error("Failed to submit search parameters");
      }

      const result = await response.json();
      console.log("Success:", result);
    } catch (error) {
      console.error("Error submitting to external port:", error);
    }
  };

  return (
    <main className="page-shell">
      <section className="preset-panel" aria-labelledby="preset-heading">
        <h2 id="preset-heading" className="preset-heading">
          Presets
        </h2>
        <div className="preset-buttons">
          {PRESETS.map((preset) => (
            <button
              className="preset-button"
              key={preset.label}
              type="button"
              onClick={() => applyPreset(preset.data)}
            >
              {preset.label}
            </button>
          ))}
        </div>
      </section>

      <section
        className="glass-panel"
        style={{
          backdropFilter: "blur(5px) saturate(100%)",
          WebkitBackdropFilter: "blur(5px) saturate(100%)",
        }}
      >
        <div className="panel-header">
          <p className="eyebrow">Observation Input</p>
          <h1>SEARCH PARAMETERS</h1>
        </div>

        <form className="search-form" onSubmit={SubHandler}>
          <label className="field">
            <input
              type="number"
              step="any"
              placeholder="Right Ascension"
              name="rightAscension"
              value={formValues.rightAscension}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <input
              type="number"
              step="any"
              placeholder="Declination"
              name="declination"
              value={formValues.declination}
              onChange={handleChange}
              required
            />
          </label>

          <label className="field">
            <select
              aria-label="Infrared Band"
              name="infraredBand"
              value={formValues.infraredBand}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Infrared Band
              </option>
              {[1, 2, 3, 4, 5, 6].map((band) => (
                <option key={band} value={band}>
                  Band {band}
                </option>
              ))}
            </select>
          </label>

          <label className="field">
            <select
              aria-label="Time Gap"
              name="timeGap"
              value={formValues.timeGap}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Time Gap
              </option>
              <option value="3-months">3 Months</option>
              <option value="6-months">6 Months</option>
              <option value="1-year">1 Year</option>
            </select>
          </label>

          <label className="field">
            <input
              type="number"
              step="any"
              placeholder="Angle of Search (In Arcsec)"
              name="angleSearch"
              value={formValues.angleSearch}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit">Run Search</button>
        </form>
      </section>
    </main>
  );
}
