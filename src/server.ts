
import app from './app';
import { config } from './config';

const startServer = () => {
    try {
        app.listen(config.port, () => {
            console.log(`
      🚀 Server is running!
      📡 Port: ${config.port}
      🌍 Environment: ${config.nodeEnv}
      🔗 Health Check: http://localhost:${config.port}/api/health
      `);
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

startServer();
