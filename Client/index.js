const connectBtn = document.getElementById('connectBtn');
const sendBtn = document.getElementById('sendBtn');
const messageInput = document.getElementById('messageInput');
const responseDiv = document.getElementById('response');
const startBtn = document.getElementById('start');
const main = document.querySelector('.main');
const nameInput = document.getElementById('nameInput');
const dialogue_box = document.querySelector('.dialogue_box');
let socket;
let username = '';


startBtn.addEventListener('click', () => {
    username = nameInput.value.trim();
    if(username.length === 0) {
        alert('Please enter your name!');
        return; 
    }

    dialogue_box.style.display = 'none';
    main.style.display = 'block';
});


connectBtn.addEventListener('click', () => {
    socket = new WebSocket('ws://192.168.100.6:4040');
    socket.onopen = () => {
        console.log('Connected to server');
        connectBtn.disabled = true;
        sendBtn.disabled = false;
        socket.send(JSON.stringify({ type: 'name', name: username }));
    };


    socket.onmessage = (event) => {
        const serverMessage = event.data
        const messageElement = document.createElement('div');
        const paragraph = document.createElement('p');
        paragraph.textContent = serverMessage; 
        messageElement.appendChild(paragraph);
        responseDiv.appendChild(messageElement);
    };

 
    socket.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

   
    socket.onclose = () => {
        console.log('Disconnected from server');
        connectBtn.disabled = false;
        sendBtn.disabled = true;
    };
});


sendBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message && socket.readyState === WebSocket.OPEN) {
        socket.send(JSON.stringify({message, type:"message"}));
        messageInput.value = ''; 
    }
});