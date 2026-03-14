const fs = require('fs');
const path = require('path');

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

const sample = `
CREATE TABLE orders (
    order_id SERIAL PRIMARY KEY,
    order_date DATE NOT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX idx_orders_date ON orders(order_date);
`;

console.log('Original:\n', sample);
console.log('Adapted:\n', adaptSql(sample));
