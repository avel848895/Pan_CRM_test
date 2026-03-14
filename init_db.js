const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'panagro.db');
const SCHEMA_PATH = path.join(__dirname, 'database', 'schema.sql');
const DATA_PATH = path.join(__dirname, 'database', 'sample_data.sql');

console.log('--- Database Initialization Script ---');

function adaptSql(sql) {
    return sql
        .replace(/\bSERIAL PRIMARY KEY\b/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/\bDECIMAL\(\d+,\d+\)\b/gi, 'NUMERIC')
        .replace(/\bTIMESTAMP DEFAULT CURRENT_TIMESTAMP\b/gi, 'TEXT DEFAULT CURRENT_TIMESTAMP')
        .replace(/\bDATE\b/gi, 'TEXT')
        .replace(/\bSERIAL\b/gi, 'INTEGER')
        .replace(/::DECIMAL/gi, '')
        .replace(/gross_margin\s+NUMERIC\s+GENERATED ALWAYS AS\s*\(.*?\)\s*STORED,/gi, '')
        .replace(/total_price\s+NUMERIC\s+GENERATED ALWAYS AS\s*\(.*?\)\s*STORED,/gi, '')
        .replace(/CREATE OR REPLACE VIEW/gi, 'CREATE VIEW')
        .replace(/DATE_TRUNC\('month',\s*(.*?)\)/gi, "strftime('%Y-%m-01', $1)")
        .replace(/_TEXT/g, '_date')
        .replace(/upTEXTd/g, 'updated');
}

// Ensure the DB file is closed and removed if possible
try {
    if (fs.existsSync(DB_PATH)) {
        fs.unlinkSync(DB_PATH);
        console.log('Removed existing database.');
    }
} catch (e) {
    console.warn('Warning: Could not delete existing database file. It might be locked.');
}

const db = new sqlite3.Database(DB_PATH);

db.serialize(() => {
    console.log('--- Initializing Schema ---');
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    const adaptedSchema = adaptSql(schemaSql);
    const schemaStatements = adaptedSchema.split(';').filter(s => s.trim());

    for (const sql of schemaStatements) {
        db.run(sql + ';', (err) => {
            if (err) {
                // Views may fail if they depend on Postgres-specific date functions we haven't adapted 100%
                if (!sql.toLowerCase().includes('create view')) {
                    console.error('Error in schema statement:', err.message);
                    console.error('Statement:', sql.substring(0, 100) + '...');
                }
            }
        });
    }

    console.log('--- Seeding Data ---');
    if (fs.existsSync(DATA_PATH)) {
        const dataSql = fs.readFileSync(DATA_PATH, 'utf8');
        const adaptedData = adaptSql(dataSql);
        const dataStatements = adaptedData.split(';').filter(s => s.trim());

        for (const sql of dataStatements) {
            db.run(sql + ';', (err) => {
                if (err) {
                    console.error('Error in seed statement:', err.message);
                }
            });
        }
    } else {
        console.warn('Sample data file not found at:', DATA_PATH);
    }
});

db.close((err) => {
    if (err) {
        console.error('Error closing database:', err.message);
    } else {
        console.log('--- Database Initialized Successfully ---');
    }
});
