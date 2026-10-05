const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const app = express();
const PORT = 3000;

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// Initialize SQLite Database
const db = new sqlite3.Database('./inventory.db', (err) => {
    if (err) {
        console.error("Error opening database " + err.message);
    } else {
        console.log("Connected to the SQLite database.");
        db.run(`CREATE TABLE IF NOT EXISTS inventory (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            uuid TEXT UNIQUE,
            productSKU TEXT,
            productName TEXT,
            dprice REAL,
            wprice REAL,
            price REAL,
            stocks INTEGER,
            expDate TEXT,
            category TEXT,
            brand TEXT,
            sizeVariant TEXT,
            shelfLocation TEXT,
            reorderLevel INTEGER,
            notes TEXT,
            batchNumber TEXT,
            dateToday TEXT
        )`, (err) => {
            if (err) console.error("Error creating table " + err.message);
        });
    }
});

// API Routes
app.post('/api/inventory', (req, res) => {
    const data = req.body;

    const query = `INSERT INTO inventory (
        uuid, productSKU, productName, dprice, wprice, price, stocks, expDate, 
        category, brand, sizeVariant, shelfLocation, reorderLevel, notes, batchNumber, dateToday
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        data.uuid, data.productSKU, data.productName, data.dprice, data.wprice, data.price, data.stocks, data.expDate,
        data.category, data.brand, data.sizeVariant, data.shelfLocation, data.reorderLevel, data.notes, data.batchNumber, data.dateToday
    ];

    db.run(query, params, function(err) {
        if (err) {
            if (err.message.includes('UNIQUE constraint failed')) {
                // Idempotency: Ignore duplicate UUIDs
                return res.json({ result: 'success', message: 'Duplicate prevented' });
            }
            return res.status(500).json({ result: 'error', error: err.message });
        }
        res.json({ result: 'success', id: this.lastID });
    });
});

app.get('/api/inventory', (req, res) => {
    db.all(`SELECT * FROM inventory ORDER BY id DESC`, [], (err, rows) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(rows);
    });
});

app.get('/api/inventory/export', (req, res) => {
    db.all(`SELECT * FROM inventory ORDER BY id ASC`, [], (err, rows) => {
        if (err) return res.status(500).send(err.message);
        if (rows.length === 0) return res.send("No data to export");

        const headers = Object.keys(rows[0]).join(',');
        const csvRows = rows.map(row => {
            return Object.values(row).map(value => {
                const escaped = ('' + (value || '')).replace(/"/g, '""');
                return `"${escaped}"`;
            }).join(',');
        });

        const csvString = [headers, ...csvRows].join('\n');
        
        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename="inventory_data.csv"');
        res.send(csvString);
    });
});

app.listen(PORT, () => {
    console.log(`\n=================================================`);
    console.log(`🚀 Inventory Server running at http://localhost:${PORT}`);
    console.log(`=================================================`);
    console.log(`👉 Open http://localhost:${PORT}/ in your browser to ADD data.`);
    console.log(`👉 Open http://localhost:${PORT}/view.html to VIEW data & Export to Excel.\n`);
});
