const express = require("express");
const os = require("os");

const app = express();
const PORT = process.env.PORT || 3000;

const APP_NAME = process.env.APP_NAME || "Platform Engineering Lab";
const APP_ENV = process.env.APP_ENV || "local";
const VERSION = process.env.APP_VERSION || "v1.0.0";


/**
 * Home page (minimal UI)
 */
app.get("/", (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
      <title>${APP_NAME}</title>
      <style>
        body {
          margin: 0;
          padding: 0;
          font-family: system-ui, -apple-system, BlinkMacSystemFont, sans-serif;
          background: #0f172a;
          color: #e5e7eb;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100vh;
        }
        .card {
          background: #020617;
          border: 1px solid #1e293b;
          border-radius: 12px;
          padding: 24px 28px;
          width: 360px;
          box-shadow: 0 10px 30px rgba(0,0,0,0.4);
        }
        h1 {
          font-size: 20px;
          margin-bottom: 12px;
          color: #38bdf8;
        }
        .item {
          margin: 6px 0;
          font-size: 14px;
          display: flex;
          justify-content: space-between;
        }
        .label {
          color: #94a3b8;
        }
        .value {
          font-weight: 500;
        }
        footer {
          margin-top: 16px;
          font-size: 12px;
          color: #64748b;
          text-align: center;
        }
      </style>
    </head>
    <body>
      <div class="card">
        <h1>${APP_NAME}</h1>

        <div class="item">
          <span class="label">Status</span>
          <span class="value">Healthy</span>
        </div>

        <div class="item">
          <span class="label">Version</span>
          <span class="value">${VERSION}</span>
        </div>

        <div class="item">
          <span class="label">Environment</span>
          <span class="value">${APP_ENV}</span>
        </div>

        <div class="item">
          <span class="label">Pod</span>
          <span class="value">${os.hostname()}</span>
        </div>

        <footer>
          Kubernetes · HPA · Probes · CI/CD Ready
        </footer>
      </div>
    </body>
    </html>
  `);
});

/**
 * Health endpoint for Kubernetes probes
 */
app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

/**
 * Load endpoint for HPA testing
 */
app.get("/load", (req, res) => {
  const start = Date.now();
  while (Date.now() - start < 500) {
    Math.random() * Math.random();
  }
  res.json({ message: "CPU load generated" });
});

/**
 * Graceful shutdown
 */
process.on("SIGTERM", () => {
  console.log("SIGTERM received. Shutting down gracefully.");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("SIGINT received. Shutting down gracefully.");
  process.exit(0);
});

app.listen(PORT, () => {
  console.log(`${APP_NAME} running on port ${PORT}`);
});
