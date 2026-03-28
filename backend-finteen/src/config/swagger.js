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
      { url: "http://localhost:9000" } 
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
  apis: ["./src/routes/*.js"],  
};

const specs = swaggerJsDoc(options);

module.exports = specs;