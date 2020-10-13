const content = require('fs').readFileSync(__dirname + '/index.html', 'utf8');

const httpServer = require('http').createServer((req, res) => {
    res.setHeader('Content-Type', 'text/html');
    res.setHeader('Content-Length', Buffer.byteLength(content));
    res.end(content);
});

const io = require('socket.io')(httpServer);

io.on('connect', socket => {

    socket.emit('serverMessage', 'message from server connection to socket');
    
    socket.on('chat message', message => {
        console.log(message);
        io.emit('server message', message);
    });

    socket.on('user connected', user => {
        console.log(`${user} signed on.`)
        socket.broadcast.emit('banner message', `${user} signed on.`);
    });

    socket.on('user disconnect', user => {
        console.log((`${user} signed off.`));
        socket.broadcast.emit('banner message', `${user} signed off.`);
    });

});

httpServer.listen(3000, () => {
    console.log('go to http://localhost:3000');
});