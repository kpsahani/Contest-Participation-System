import promBundle from "express-prom-bundle";

const metricsMiddleware = promBundle({
  includeMethod: true, // Track HTTP methods
  includePath: true, // Track API paths
  promClient: {
    collectDefaultMetrics: {}
  }
});

export default metricsMiddleware;
