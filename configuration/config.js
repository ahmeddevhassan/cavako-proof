let config = {};
let env = process.env.NODE_ENV;
const googleMapApi = "AIzaSyAEi3MZFUDO_cGX0-1kOWtz1oqIr4IJ6W0";
if (!env) {
  env = 'staging';
}
switch (env) {
  case "development":
    const port = 5000;
    config = {
      appUrl: `http://localhost:${port}`,
      userServiceUrl: `http://localhost:${"3000"}`,
      port: port,
      db: "mongodb://localhost:27017/cavako_campaigns",
      googleMapApi
    };
    break;

  case "staging":
    config = {
      appUrl: `https://stage-app.cavako.com`,
      userServiceUrl: `https://stage-app.cavako.com`,
      port: 5000,
      db: "mongodb://localhost:27017/cavako_campaigns",
      googleMapApi
    };
    break;

  case "production":
    config = {
      appUrl: `https://app.cavako.com`,
      userServiceUrl: `https://app.cavako.com`,
      port: 5000,
      db: "mongodb://localhost:27017/cavako_campaigns",
      googleMapApi
    };
}

module.exports = config;
