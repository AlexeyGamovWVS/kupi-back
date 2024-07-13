export default () => ({
  server: {
    port: parseInt(process.env.PORT, 10) || 3001,
  },
  database: {
    port: parseInt(process.env.POSTGRES_PORT, 10) || 5432,
    host: process.env.POSTGRES_HOST || 'localhost',
    user: process.env.POSTGRES_USER || 'student',
    password: process.env.POSTGRES_PASSWORD || 'student',
    name: process.env.POSTGRES_DB || 'kupipodariday',
    synchronize: process.env.SYNCHRONIZE || true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || 'super_jwt_secret',
    ttl: process.env.JWT_TTL || '30000s',
  },
});
