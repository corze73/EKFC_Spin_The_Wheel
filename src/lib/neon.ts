import { neon } from '@neondatabase/serverless';

const databaseUrl = import.meta.env.VITE_NEON_DATABASE_URL;

let sql: any = null;

if (databaseUrl && databaseUrl !== 'your_neon_database_connection_string_here') {
  try {
    sql = neon(databaseUrl);
  } catch (error) {
    console.warn('Failed to initialize Neon database connection:', error);
    sql = null;
  }
} else {
  console.warn('Neon database URL not configured. Using localStorage fallback.');
  sql = null;
}

export { sql };