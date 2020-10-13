const randomUserId = Math.floor(Math.random() * Math.floor(1000)); // random digit between 1 and 10
const $title = document.getElementById('title');
$title.innerHTML = `Hello ${randomUserId}`;

const $messages = document.getElementById('messages');
const $banner = document.getElementById('banner');

const newItem = (content) => {
    const item = document.createElement('li');
    item.innerText = content;
    return item;
}

const socket = io();

// built in emitted event from socket.io 
// only triggers on load/refresh
socket.on('connect', () => {
    socket.emit('user connected', randomUserId);
});

// is it possible to show a live read on the online users

socket.on('server message', (myMessage) => {
    $messages.appendChild(newItem(myMessage));
});

socket.on('banner message', (bannerMessage) => {
    $banner.innerHTML = bannerMessage;
    setTimeout(() => {
        $banner.innerHTML = '';
    }, 2500);
})

document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const message = document.getElementById('message').value;
    socket.emit('chat message', `${randomUserId}: ${message}`);
    document.getElementById('myForm').reset();
});