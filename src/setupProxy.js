const { createProxyMiddleware } = require("http-proxy-middleware");

const backendTarget =
  process.env.REACT_APP_BACKEND_URL || "https://salesforce-assignment.onrender.com";

module.exports = function setupProxy(app) {
  // Forward Salesforce API calls from the React dev server to the Node backend.
  app.use(
    "/api/salesforce",
    createProxyMiddleware({
      target: backendTarget,
      changeOrigin: true,
      logLevel: "warn",
      onProxyReq(proxyReq, req) {
        console.log(
          `[CRA Proxy] ${req.method} ${req.originalUrl} -> ${backendTarget}${req.originalUrl}`
        );
      },
      onError(error, req, res) {
        console.error("[CRA Proxy] Failed to reach backend", {
          url: req.originalUrl,
          message: error.message,
        });

        res.status(502).json({
          error: "React dev server could not reach the backend.",
          details: error.message,
        });
      },
    })
  );
};

