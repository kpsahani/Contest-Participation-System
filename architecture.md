# 🏆 Contest System - High-Level Design (HLD)

```mermaid
graph TD;
    A[Frontend - React] -->|API Calls| B[Backend - Express]
    
    subgraph Backend Services
        B -->|Data| C[MongoDB - Mongoose]
        B -->|Cache| D[Redis - Caching]
        B -->|Logs| E[Winston Logger]
        B -->|Rate Limit| F[express-rate-limit]
        B -->|Error Handling| G[Error Middleware]
        B -->|Schedule Jobs| H[node-cron]
    end

    subgraph Background Tasks
        H -->|Process Contests| C
        H -->|Distribute Prizes| C
    end

    subgraph External Integrations
        B -->|Authentication| I[JWT & bcrypt]
        B -->|Security| J[Helmet.js, CORS]
    end
