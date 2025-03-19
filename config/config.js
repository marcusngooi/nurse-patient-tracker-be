import dotenv from "dotenv";
dotenv.config();

const config = {
  development: {
    port: process.env.PORT || 4000,
    corsOrigin: "http://localhost:3000",
    nodeEnv: "development",
  },
  production: {
    port: process.env.PORT,
    corsOrigin: process.env.FRONTEND_URL,
    nodeEnv: "production",
  },
};

const env = process.env.NODE_ENV || "development";
export default config[env];
