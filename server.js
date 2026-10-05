// Zero-dependency static server for ./app
const http = require('http'), fs = require('fs'), path = require('path');
const port = process.env.PORT || 3000;
http.createServer((req, res) => {
  const f = path.join(__dirname, 'app', req.url === '/' ? 'index.html' : req.url.split('?')[0]);
  fs.readFile(f, (e, d) => { if (e) { res.writeHead(404); return res.end('Not found'); }
    res.writeHead(200, { 'Content-Type': f.endsWith('.js') ? 'text/javascript' : f.endsWith('.css') ? 'text/css' : 'text/html' }); res.end(d); });
}).listen(port, () => console.log('WealthRamp on http://localhost:' + port));
