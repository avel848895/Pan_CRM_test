const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');

const app = express();
const port = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'panagro.db');

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'crm-dashboard')));

const db = new sqlite3.Database(DB_PATH);

// Helper to run queries with promises
const query = (sql, params = []) => new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => err ? reject(err) : resolve(rows));
});

const run = (sql, params = []) => new Promise((resolve, reject) => {
    db.run(sql, params, function(err) {
        err ? reject(err) : resolve({ id: this.lastID, changes: this.changes });
    });
});

// --- Automated Activity Status Logic ---
async function refreshActivityStatus() {
    // Step 1: Compute each client's last order date
    // Step 2: Update activity_status based on 30/90 day thresholds
    // Clients with a manual lost_reason are NOT overridden
    const sql = `
        UPDATE clients SET
            activity_status = CASE
                WHEN lost_reason IS NOT NULL THEN 'Perdido'
                WHEN (
                    SELECT MAX(o.order_date) FROM orders o WHERE o.client_id = clients.client_id
                ) >= date('now', '-30 days') THEN 'Activo'
                WHEN (
                    SELECT MAX(o.order_date) FROM orders o WHERE o.client_id = clients.client_id
                ) >= date('now', '-90 days') THEN 'Inactivo'
                WHEN (
                    SELECT MAX(o.order_date) FROM orders o WHERE o.client_id = clients.client_id
                ) IS NULL THEN 'Inactivo'
                ELSE 'Perdido'
            END,
            inactive_date = CASE
                WHEN lost_reason IS NOT NULL THEN inactive_date
                WHEN (
                    SELECT MAX(o.order_date) FROM orders o WHERE o.client_id = clients.client_id
                ) < date('now', '-30 days') AND inactive_date IS NULL THEN date('now')
                WHEN (
                    SELECT MAX(o.order_date) FROM orders o WHERE o.client_id = clients.client_id
                ) >= date('now', '-30 days') THEN NULL
                ELSE inactive_date
            END
        WHERE lost_reason IS NULL;
    `;
    await run(sql);
}

// API Endpoints
app.get('/api/data', async (req, res) => {
    try {
        // Refresh activity statuses before returning data
        await refreshActivityStatus();

        const tables = ['clients', 'products', 'opportunities', 'orders', 'order_details', 'interactions', 'payments', 'decision_makers'];
        const data = {};
        
        for (const table of tables) {
            let rows = await query(`SELECT * FROM ${table}`);
            
            // Fix corrupted field names from DB if any
            data[table] = rows.map(row => {
                const fixedRow = {};
                for (let key in row) {
                    let fixedKey = key.replace(/_TEXT/g, '_date').replace(/upTEXTd/g, 'updated');
                    fixedRow[fixedKey] = row[key];
                }
                return fixedRow;
            });
        }
        
        res.json(data);
    } catch (err) {
        console.error('API Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.post('/api/:table', async (req, res) => {
    const { table } = req.params;
    const records = req.body;
    
    // Reverse fix for DB naming if corrupted
    const dbRecords = {};
    for (let key in records) {
        // This is a temporary safety measure. Ideally DB should be clean.
        dbRecords[key] = records[key];
    }
    
    const fields = Object.keys(dbRecords);
    const placeholders = fields.map(() => '?').join(',');
    const values = Object.values(dbRecords);
    
    try {
        const sql = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${placeholders})`;
        const result = await run(sql, values);
        res.json({ success: true, id: result.id });
    } catch (err) {
        console.error('POST Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/:table/:id', async (req, res) => {
    const { table, id } = req.params;
    const records = req.body;
    const fields = Object.keys(records);
    const setClause = fields.map(f => `${f} = ?`).join(',');
    const values = [...Object.values(records), id];
    
    // Determine ID column name (basic logic)
    const idColumn = table === 'order_details' ? 'order_detail_id' : 
                   table === 'decision_makers' ? 'decision_maker_id' : 
                   table.slice(0, -1) + '_id'; 
    
    try {
        await run(`UPDATE ${table} SET ${setClause} WHERE ${idColumn} = ?`, values);
        res.json({ success: true });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Manual trigger for activity status refresh
app.post('/api/refresh-activity-status', async (req, res) => {
    try {
        await refreshActivityStatus();
        const clients = await query('SELECT client_id, doctor_name, institution_name, activity_status, inactive_date FROM clients');
        res.json({ success: true, updated: clients.length, clients });
    } catch (err) {
        console.error('Refresh Error:', err);
        res.status(500).json({ error: err.message });
    }
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
