#!/usr/bin/env node

/**
 * Development Server
 *
 * Simple HTTP server for previewing generated invitation sites locally.
 *
 * Usage:
 *   node scripts/serve.js [port]
 *   npm run serve
 *
 * Default port: 3000 (or as configured in config.js)
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const config = require('./config');

// Paths
const ROOT_DIR = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(ROOT_DIR, 'public');

// MIME types
const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.ico': 'image/x-icon',
  '.woff': 'font/woff',
  '.woff2': 'font/woff2',
  '.ttf': 'font/ttf'
};

/**
 * Get MIME type for file extension
 */
function getMimeType(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  return MIME_TYPES[ext] || 'application/octet-stream';
}

/**
 * Generate directory listing HTML
 */
function generateDirectoryListing(dirPath, urlPath) {
  const entries = fs.readdirSync(dirPath, { withFileTypes: true });

  const items = entries.map(entry => {
    const isDir = entry.isDirectory();
    const name = entry.name + (isDir ? '/' : '');
    const href = path.join(urlPath, entry.name) + (isDir ? '/' : '');
    const icon = isDir ? '📁' : '📄';
    return `<li>${icon} <a href="${href}">${name}</a></li>`;
  }).join('\n');

  return `
<!DOCTYPE html>
<html lang="sr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Index of ${urlPath}</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      max-width: 800px;
      margin: 2rem auto;
      padding: 0 1rem;
      background: #f5f5f5;
    }
    h1 { color: #333; font-weight: 500; }
    ul { list-style: none; padding: 0; }
    li {
      padding: 0.5rem 1rem;
      background: white;
      margin: 0.25rem 0;
      border-radius: 4px;
    }
    a { color: #2563eb; text-decoration: none; }
    a:hover { text-decoration: underline; }
    .back { margin-bottom: 1rem; }
  </style>
</head>
<body>
  <h1>Index of ${urlPath}</h1>
  ${urlPath !== '/' ? '<p class="back"><a href="../">⬆️ Parent Directory</a></p>' : ''}
  <ul>
    ${items}
  </ul>
</body>
</html>
  `;
}

/**
 * Handle HTTP requests
 */
function handleRequest(req, res) {
  // Parse URL
  let urlPath = decodeURIComponent(req.url.split('?')[0]);

  // Security: prevent directory traversal
  if (urlPath.includes('..')) {
    res.writeHead(403);
    res.end('Forbidden');
    return;
  }

  // Map URL to file path
  let filePath = path.join(PUBLIC_DIR, urlPath);

  // Check if path exists, try adding .html extension if not
  if (!fs.existsSync(filePath)) {
    const htmlPath = filePath + '.html';
    if (fs.existsSync(htmlPath)) {
      filePath = htmlPath;
    } else {
      res.writeHead(404);
      res.end('Not Found');
      console.log(`  404 ${req.method} ${urlPath}`);
      return;
    }
  }

  // Get file stats
  const stats = fs.statSync(filePath);

  // If directory, look for index.html or show listing
  if (stats.isDirectory()) {
    const indexPath = path.join(filePath, 'index.html');

    if (fs.existsSync(indexPath)) {
      filePath = indexPath;
    } else {
      // Generate directory listing
      const listing = generateDirectoryListing(filePath, urlPath);
      res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
      res.end(listing);
      console.log(`  200 ${req.method} ${urlPath} (directory listing)`);
      return;
    }
  }

  // Read and serve file
  try {
    const content = fs.readFileSync(filePath);
    const mimeType = getMimeType(filePath);

    res.writeHead(200, {
      'Content-Type': mimeType,
      'Cache-Control': 'no-cache'
    });
    res.end(content);
    console.log(`  200 ${req.method} ${urlPath}`);
  } catch (err) {
    res.writeHead(500);
    res.end('Internal Server Error');
    console.error(`  500 ${req.method} ${urlPath}`, err.message);
  }
}

/**
 * Start the server
 */
function startServer(port) {
  const server = http.createServer(handleRequest);

  server.listen(port, () => {
    console.log(`\n🚀 Development server running!\n`);
    console.log(`   Local:   http://localhost:${port}/`);
    console.log(`   Preview: http://localhost:${port}/preview/`);
    console.log(`   Sites:   http://localhost:${port}/site/`);
    console.log(`\n   Press Ctrl+C to stop.\n`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`\n❌ Port ${port} is already in use.`);
      console.error(`   Try a different port: node scripts/serve.js ${port + 1}\n`);
      process.exit(1);
    }
    throw err;
  });
}

// CLI handling
if (require.main === module) {
  const args = process.argv.slice(2);
  const port = parseInt(args[0]) || config.DEV_SERVER_PORT || 3000;

  // Ensure public directory exists
  if (!fs.existsSync(PUBLIC_DIR)) {
    fs.mkdirSync(PUBLIC_DIR, { recursive: true });
    fs.mkdirSync(path.join(PUBLIC_DIR, 'preview'), { recursive: true });
    fs.mkdirSync(path.join(PUBLIC_DIR, 'site'), { recursive: true });
  }

  startServer(port);
}

module.exports = { startServer };
