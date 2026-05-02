const localtunnel = require('localtunnel');
const fs = require('fs');

async function start() {
    try {
        console.log('Attempting to start tunnel...');
        const tunnel = await localtunnel({ port: 3000 });
        console.log('Tunnel URL:', tunnel.url);
        fs.writeFileSync('tunnel_final.txt', tunnel.url);
        
        // Keep alive
        setInterval(() => {
            fs.appendFileSync('tunnel_keepalive.txt', 'Live at ' + new Date().toISOString() + '\n');
        }, 5000);

    } catch (err) {
        fs.writeFileSync('tunnel_error.txt', err.stack);
    }
}

start();
