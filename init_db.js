const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');
const path = require('path');

const DB_PATH = path.join(__dirname, 'panagro.db');
const SCHEMA_PATH = path.join(__dirname, 'database', 'schema.sql');
const DATA_PATH = path.join(__dirname, 'database', 'sample_data.sql');

// Delete existing database if it exists to start fresh
if (fs.existsSync(DB_PATH)) {
    fs.unlinkSync(DB_PATH);
}

const db = new sqlite3.Database(DB_PATH);

function adaptSql(sql) {
    return sql
        .replace(/SERIAL PRIMARY KEY/gi, 'INTEGER PRIMARY KEY AUTOINCREMENT')
        .replace(/DECIMAL\(\d+,\d+\)/gi, 'NUMERIC')
        .replace(/TIMESTAMP DEFAULT CURRENT_TIMESTAMP/gi, 'TEXT DEFAULT CURRENT_TIMESTAMP')
        .replace(/DATE/gi, 'TEXT')
        .replace(/SERIAL/gi, 'INTEGER')
        .replace(/::DECIMAL/gi, '')
        .replace(/GENERATED ALWAYS AS \(.*\) STORED/gi, '') // Simplified for SQLite if version is old, but let's try keeping it first 
        // Actually, let's remove generated columns and handle logic in JS if needed, or just let SQLite try.
        // Let's remove them to be safe on compatibility.
        .replace(/gross_margin        NUMERIC GENERATED ALWAYS AS \(.*\) STORED,/gi, '')
        .replace(/total_price         NUMERIC GENERATED ALWAYS AS \(.*\) STORED,/gi, '')
        .replace(/CREATE OR REPLACE VIEW/gi, 'CREATE VIEW')
        .replace(/DATE_TRUNC\('month', (.*?)\)/gi, "strftime('%Y-%m-01', $1)");
}

db.serialize(() => {
    console.log('--- Initializing Database ---');

    // Load and adapt schema
    const schemaSql = fs.readFileSync(SCHEMA_PATH, 'utf8');
    const adaptedSchema = adaptSql(schemaSql);
    
    // Split into individual statements - very basic splitter
    const schemaStatements = adaptedSchema.split(';').filter(s => s.trim().length > 0);
    
    schemaStatements.forEach(stmt => {
        if (stmt.toLowerCase().includes('create view')) {
            // Views might need more complex adaptation, skipping for now to focus on tables
            return;
        }
        db.run(stmt + ';', (err) => {
            if (err) console.error('Error executing schema statement:', err.message, '\nStatement:', stmt.substring(0, 50) + '...');
        });
    });

    console.log('--- Seeding Data ---');
    const dataSql = fs.readFileSync(DATA_PATH, 'utf8');
    const adaptedData = adaptSql(dataSql);
    const dataStatements = adaptedData.split(';').filter(s => s.trim().length > 0);

    dataStatements.forEach(stmt => {
        db.run(stmt + ';', (err) => {
            if (err) console.error('Error executing seed statement:', err.message);
        });
    });

    console.log('--- Database Initialized! ---');
});

db.close();
