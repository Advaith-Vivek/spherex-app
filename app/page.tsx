"use client";
import { useRouter } from "next/navigation";

import React, { useState } from "react";

export default function Home() {
  return <InputCard />;
}

// Define some example presets
const PRESETS = [
  {
    label: "Barnard's Star",
    data: {
      right_ascension: "269.4520",
      declination: "4.6933",
      band: "",
      time: "",
      angle: "",
    },
  },
  {
    label: "Epsilon Indi",
    data: {
      right_ascension: "330.8404",
      declination: "-56.7861",
      band: "",
      time: "",
      angle: "",
    },
  },
  {
    label: "WISE 0855",
    data: {
      right_ascension: "133.7951",
      declination: "-7.2452",
      band: "",
      time: "",
      angle: "",
    },
  },
  {
    label: "RW Aurigae",
    data: {
      right_ascension: "76.9561",
      declination: "30.4013",
      band: "",
      time: "",
      angle: "",
    },
  },
  {
    label: "R Draconis",
    data: {
      right_ascension: "248.1667",
      declination: "66.7547",
      band: "",
      time: "",
      angle: "",
    },
  },
];

function InputCard() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formValues, setFormValues] = useState({
    right_ascension: "",
    declination: "",
    band: "",
    time: "",
    angle: "",
  });

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

    setLoading(true);

    try {
      const response = await fetch("http://localhost:8000/process_image", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formValues),
      });

      if (!response.ok) {
        throw new Error("Failed to submit search parameters");
      }
      const data = await response.json();
      console.log("Success:", data);

      if (data.job_id) {
        setFormValues({
          right_ascension: "",
          declination: "",
          band: "",
          time: "",
          angle: "",
        });
        setLoading(false);
        router.push(`/results?job_id=${data.job_id}`);
      } else {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error submitting to external port:", error);
      setLoading(false);
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
              name="right_ascension"
              value={formValues.right_ascension}
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
              name="band"
              value={formValues.band}
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
              name="time"
              value={formValues.time}
              onChange={handleChange}
              required
            >
              <option value="" disabled>
                Time Gap
              </option>
              <option value="90">3 Months</option>
              <option value="180">6 Months</option>
              <option value="365">1 Year</option>
            </select>
          </label>

          <label className="field">
            <input
              type="number"
              step="any"
              placeholder="Angle of Search (In Arcsec)"
              name="angle"
              value={formValues.angle}
              onChange={handleChange}
              required
            />
          </label>

          <button type="submit" disabled={loading}>
            {loading ? "Processing..." : "Run Search"}
          </button>
        </form>
      </section>
    </main>
  );
}
