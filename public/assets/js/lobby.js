const myUserId = 'GUEST' + new Date().getMilliseconds();
var chatDisplay = document.getElementById('chat-display');

var socket = io();
socket.emit('userconnected', myUserId);

const postChat = (event) => {
  event.preventDefault();
  var chatInput = document.getElementById('chat-input');
  sendChat(chatInput.value);
  clearChatInput(chatInput);
}

const clearChatInput = (element) => {
  element.value = '';
};

const sendChat = (text) => {
  // default values
  var userId = "anonymous";
  if (myUserId){
      userId = myUserId;
  }
  var msg = {
      text,
      userId,
  };
  socket.emit("chatmessage", msg);
};

const displayChat = (msg) => {
  var chatMessage = document.createElement('p');
  var receivedAtTime = new Date();
  chatMessage.innerText = `${msg.userId}: ${msg.text}`;
  chatDisplay.appendChild(chatMessage);
  chatDisplay.scrollTop = chatDisplay.scrollHeight;
};

// http request to get and load chat history
const httpRequest = new XMLHttpRequest;
httpRequest.onreadystatechange = postChatHistory;
httpRequest.open('GET', '/chat', true);
httpRequest.send();

function postChatHistory() {
  if (httpRequest.readyState === XMLHttpRequest.DONE) {
    if (httpRequest.status === 200) {
      const messages = JSON.parse(httpRequest.response);
      for (let i = messages.length - 1; i >= 0; i--){
        console.log(messages[i]);
        displayChat(messages[i]);
      }
    } else {
      console.log(new Error('There was a problem with loading chat history.'));
    }
  }
}

// display incoming chats
socket.on("chatmessage", function(msg){
  displayChat(msg);
});

