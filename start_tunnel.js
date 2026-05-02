const localtunnel = require('localtunnel');
(async () => {
    try {
        const tunnel = await localtunnel({ 
            port: 3000,
            subdomain: 'friends-car-bazar-' + Math.floor(Math.random() * 1000)
        });
        const fs = require('fs');
        fs.writeFileSync('tunnel_ready.txt', tunnel.url);
        console.log('Tunnel is ready at:', tunnel.url);
        
        tunnel.on('close', () => {
            console.log('Tunnel closed');
        });
    } catch (err) {
        console.error('Tunnel error:', err);
    }
})();
