import { useEffect, useState } from 'react'
import { GaugeComponent } from "react-gauge-component"

import io from "socket.io-client";

const socket = io("http://localhost:5000");

function App() {
  const [datos, setDatos] = useState({ temperatura: 0, humedad: 0 })

  const p = "jijfi";

  useEffect(() => {
    const handleData = (data) => {
      setDatos(data);
      console.log("Datos recibidos:", data); 
    };

    socket.on('mqtt-data', handleData);

    return () => {
      socket.off('mqtt-data', handleData);
    };
  }, [])

return (
    <div style={{ textAlign: 'center', padding: '20px', fontFamily: 'Arial' }}>
      <h1>Tarea 1 - Mosquitto MQTT</h1>
      
      <div style={{ display: 'flex', justifyContent: 'center', gap: '50px', marginTop: '30px' }}>
        
        {/* Indicador de Temperatura */}
        <div>
          <h3>Temperatura (°C)</h3>
          <GaugeComponent
            value={datos.temperatura}
            type="semicircle"
            minValue={10}
            maxValue={50}
            arc={{
                width: 0.2,
                padding: 0.015,
                cornerRadius: 2,
                subArcs: [
                  {
                    limit: 18,
                    color: "#00bcd4",
                    showTick: true,
                    tooltip: { text: "Cold" }
                  },
                  {
                    limit: 25,
                    color: "#4caf50",
                    showTick: true,
                    tooltip: { text: "Optimal" }
                  },
                  {
                    limit: 35,
                    color: "#ff9800",
                    showTick: true,
                    tooltip: { text: "Warm" }
                  },
                  { color: "#f44336", tooltip: { text: "Critical!" } }
                ]
              }}
            pointer={{
                type: "needle",
                color: "#e0e0e0",
                length: 0.7,
                width: 8,
                maxFps: 30
              }}
            labels={{
                valueLabel: {
                  formatTextValue: e=>"".concat(e.toFixed(1),"\xb0C"),
                  style: {
                    fontSize: "20px",
                    fill: "#e0e0e0",
                    fontWeight: "bold"
                  }
                },
                tickLabels: {
                  type: "outer",
                  defaultTickValueConfig: {
                    formatTextValue: e=>"".concat(e,"\xb0"),
                    style: { fontSize: "9px", fill: "#aaa" }
                  },
                  defaultTickLineConfig: { color: "#666", length: 4, width: 1 }
                }
              }}
          />
        </div>

        {/* Indicador de Humedad */}
        <div>
          <h3>Humedad (%)</h3>
          <GaugeComponent
            value={datos.humedad}
            type="grafana"
            arc={{
                width: 0.25,
                padding: 0.01,
                subArcs: [
                  { limit: 33, color: "#e0f7fa" },
                  { limit: 66, color: "#80deea" },
                  { color: "#00bcd4" }
                ],
                effects: { glow: true, glowBlur: 15, glowSpread: 0.5 }
              }}
            pointer={{
                type: "needle",
                color: "#fff",
                length: 0.8,
                width: 6,
                maxFps: 30
              }}
            labels={{
                valueLabel: {
                  style: {
                    fontSize: "26px",
                    fill: "#e0f7fa",
                    fontWeight: "300"
                  }
                },
                tickLabels: { hideMinMax: true }
              }}
          />
        </div>

      </div>
    </div>
  );
}

export default App
