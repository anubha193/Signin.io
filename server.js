const http = require('http');
const mysql = require('mysql2');
const url = require('url');
const fs = require('fs');

// Database connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root', // replace with your DB username
    password: 'Anubha88@@#', // replace with your DB password
    database: 'users' // replace with your database name
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database');
});

const port = 3000;
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);

    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*'); // Allow requests from any origin
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS'); // Allow specific methods
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type'); // Allow specific headers

    if (req.method === 'OPTIONS') {
        res.writeHead(204); // No content response for OPTIONS preflight requests
        res.end();
        return;
    }

    if (req.method === 'POST' && parsedUrl.pathname === '/signup') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { fname, sname, email, password } = JSON.parse(body);

            // Check if the user already exists
            const checkUserQuery = 'SELECT * FROM users WHERE email = ?';
            connection.query(checkUserQuery, [email], (err, results) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Database error' }));
                    return;
                }

                if (results.length > 0) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'User already exists' }));
                } else {
                    // Insert the new user into the database
                    const insertUserQuery = 'INSERT INTO users (fname, sname, email, password) VALUES (?, ?, ?, ?)';
                    connection.query(insertUserQuery, [fname, sname, email, password], (err, result) => {
                        if (err) {
                            res.writeHead(500, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ error: 'Signup failed' }));
                        } else {
                            res.writeHead(200, { 'Content-Type': 'application/json' });
                            res.end(JSON.stringify({ message: 'Signup successful!' }));
                        }
                    });
                }
            });
        });

    } else if (req.method === 'POST' && parsedUrl.pathname === '/login') {
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const { email, password } = JSON.parse(body);

            // Check the user's credentials
            const query = 'SELECT * FROM users WHERE email = ? AND BINARY password = ?';
            connection.query(query, [email, password], (err, results) => {
                if (err) {
                    res.writeHead(500, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Database error' }));
                } else if (results.length > 0) {
                    res.writeHead(200, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Login successful!', user: results[0] }));
                } else {
                    res.writeHead(401, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ error: 'Invalid email or password' }));
                }
            });
            
        });

    } else {
        // Serve static files like HTML, JS, and CSS
        fs.readFile(`.${parsedUrl.pathname}`, (err, data) => {
            if (err) {
                res.writeHead(404);
                res.end();
            } else {
                res.writeHead(200, { 'Content-Type': getContentType(parsedUrl.pathname) });
                res.end(data);
            }
        });
    }
});

server.listen(port, () => {
    console.log(`Server running at http://127.0.0.1:${port}/`);
});

function getContentType(pathname) {
    if (pathname.endsWith('.html')) return 'text/html';
    if (pathname.endsWith('.js')) return 'application/javascript';
    if (pathname.endsWith('.css')) return 'text/css';
    return 'application/octet-stream';
}

