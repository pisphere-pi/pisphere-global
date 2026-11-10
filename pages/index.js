@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --bg-dark: #0B0410;
  --card-bg: #1A0B2E;
  --primary-yellow: #FFD700;
  --text-light: #FFFFFF;
}

body {
  background-color: var(--bg-dark);
  color: var(--text-light);
  font-family: system-ui, -apple-system, sans-serif;
  margin: 0;
  padding: 0;
  overflow-x: hidden;
}

/* सॉफ्ट शैडो कार्ड */
.soft-card {
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.4), 0 1px 3px rgba(255, 255, 255, 0.05);
  transition: transform 0.2s ease;
}

.soft-card:active {
  transform: scale(0.98);
}

/* येलो बटन (ब्लैक टेक्स्ट) */
.btn-yellow {
  background-color: var(--primary-yellow);
  color: #000000;
  font-weight: 700;
  padding: 12px 24px;
  border-radius: 12px;
  border: none;
  box-shadow: 0 4px 15px rgba(255, 215, 0, 0.3);
  cursor: pointer;
  width: 100%;
  text-align: center;
}
