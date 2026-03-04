// src/config/swagger.js
const swaggerJsDoc = require("swagger-jsdoc");

const options = {
  definition: {
    openapi: "3.0.0",
    info: {
      title: "FinTeen API",
      version: "1.0.0",
      description: "API documentation for FinTeen project",
    },
    servers: [
      { url: "http://localhost:9000/api" } // base URL server kamu
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: "http",
          scheme: "bearer",
          bearerFormat: "JWT",
        },
      },
    },
  },
  apis: ["./src/routes/*.js"], // Scan semua file 
};

const specs = swaggerJsDoc(options);

module.exports = specs;