const userId = Math.floor(Math.random() * Math.floor(1000)); // random digit between 1 and 10
const $title = document.getElementById('title');
$title.innerHTML = `Hello ${userId}`;

const $messages = document.getElementById('messages');
const $onlineUsers = document.getElementById('online-users');
const $banner = document.getElementById('banner');

const newItem = (content) => {
    const item = document.createElement('li');
    item.setAttribute('id', `list-item-${content}`);
    item.innerText = content;
    return item;
}

const socket = io();

// built in emitted event from socket.io 
// only triggers on load/refresh
socket.on('connect', () => {
    socket.emit('user connected', userId);
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

socket.on('other user typing', (otherUsersTyping) => {
    let currentUsersTyping = '';
    otherUsersTyping
    .filter(otherUser => otherUser.user !== userId)
    .forEach(otherUser => {
        currentUsersTyping = currentUsersTyping + otherUser.user + ", ";
    });
    const otherUserTypingContainer = document.getElementById('user-type-detection-container');
    otherUserTypingContainer.textContent = currentUsersTyping ? `${currentUsersTyping.substring(0, currentUsersTyping.length - 2)} is typing ...` : '';
})

document.getElementById('myForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const message = document.getElementById('message').value;
    socket.emit('chat message', { content: message, user: userId} );
    document.getElementById('myForm').reset();
});

// observe user input - still kind of buggy - user typing needs to be able to store everyone that is currently typing
const $userInput = document.querySelector('input');
$userInput.addEventListener('input', (event) => {
    socket.emit('user type detection', { content: event.target.value, user: userId });
});

// todo - see who's online 