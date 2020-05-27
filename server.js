var admins  = new Set();
var clients = 0;

const io = require('socket.io')();
io.on('connection', client => {
    console.log(`Client connected (ID: ${client.id}`);
    clients++;

    client.on('auth', data => {
        var user = process.env.USERNAME;
        var pass = process.env.PASSWORD;
        if (data.username == user && data.password == pass) {
            admins.add(client.id);
        }
        console.log(`Client authenticated (ID: ${client.id}`);
        client.send('Authenticated');
    });
    client.on('raffle', data => {
        if (admins.has(client.id)) {
            client.send("Beginning raffle");
            io.emit('raffle', data);
        }
        else {
            client.send('Not authenticated')
        }
    });
    client.on('reset', data => {
        if (admins.has(client.id)) {
            client.send("Resetting raffle");
            io.emit('reset');
        }
        else {
            client.send('Not authenticated')
        }
    });
    client.on('clients', data => {
        client.send(`${clients} client(s) currently connected`);
    });
    client.on('message', data => {
        console.log(`Message (from ${client.id}): ${data}`);
    });
    client.on('disconnect', () => {
        console.log(`Client disconnected (ID: ${client.id}`);
        clients--;
    });
});
io.listen(4000);