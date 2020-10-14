const express = require('express');
const path = require('path');
const app = express();
const server = require('http').createServer(app);

app.use(express.static(path.join(__dirname, '')));

const io = require('socket.io')(server);

io.on('connect', socket => {

    socket.emit('serverMessage', 'message from server connection to socket');
    
    socket.on('chat message', payload => {
        io.emit('server message', `${payload.user}: ${payload.content}`);
        socket.broadcast.emit('other user typing', { ...payload, finalSubmission: true });
    });

    socket.on('user connected', user => {
        console.log(`${user} signed on.`)
        socket.broadcast.emit('banner message', `${user} signed on.`);
    });

    socket.on('user type detection', payload => {
        socket.broadcast.emit('other user typing', payload);
    });
    
    socket.on('user not typing', user => {
        socket.broadcast.emit('other user typing', user);
    });


    socket.on('user disconnect', user => {
        console.log((`${user} signed off.`));
        socket.broadcast.emit('banner message', `${user} signed off.`);
    });

});

server.listen(3000, () => {
    console.log('go to http://localhost:3000');
})