const urlParams = new URLSearchParams(window.location.search);
const msgerForm = get(".msger-inputarea");
const msgerInput = get(".msger-input");
const msgerChat = get(".msger-chat"); 

window.person = localStorage.getItem("username");
if (!window.person){
   window.person = urlParams.get('username') || prompt("Please enter your name", "");
   localStorage.setItem("username", window.person);
}

// Random Icons based on Username
const PERSON_IMG = "https://api.dicebear.com/9.x/pixel-art/svg?seed=";
const PERSON_NAME = urlParams.get('username') || window.person;
const ROOM = urlParams.get('room') || "ntfydemochatroom";
const SERVICE = "https://ntfy.sh/" + ROOM;
// Change Room Title
document.getElementById("title").innerHTML =  urlParams.get('title') || "NTFY Chat";

msgerForm.addEventListener("submit", event => {
  event.preventDefault();

  const msgText = msgerInput.value;
  if (!msgText) return;
  
  fetch(SERVICE, {
    method: 'POST', // PUT works too
    body: JSON.stringify({ message: msgText, user: PERSON_NAME })
  })
  msgerInput.value = "";
});

const eventSource = new EventSource(SERVICE+'/sse');
eventSource.onmessage = (e) => {
  let data = JSON.parse(JSON.parse(e.data).message);
  //console.log(e.data);
  appendMessage(data.user == PERSON_NAME ? window.person : data.user, PERSON_IMG + PERSON_NAME, data.user == PERSON_NAME ? "right" : "left", data.message, Date.now());
};

function appendMessage(name, img, side, text, time) {
  //   Simple solution for small apps
  const msgHTML = `
    <div class="msg ${side}-msg">
      <div class="msg-img" style="background-image: url(${img})"></div>
      <div class="msg-bubble">
        <div class="msg-info">
          <div class="msg-info-name">${name}</div>
          <div class="msg-info-time">${formatDate(new Date(time * 1000))}</div>
        </div>
        <div class="msg-text">${text}</div>
      </div>
    </div>
  `;

  msgerChat.insertAdjacentHTML("beforeend", msgHTML);
  msgerChat.scrollTop += 500;
}

// Utils
function get(selector, root = document) {
  return root.querySelector(selector);
}

function formatDate(date) {
  const h = "0" + date.getHours();
  const m = "0" + date.getMinutes();

  return `${h.slice(-2)}:${m.slice(-2)}`;
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}

async function subscribe() {
  let response = await fetch(SERVICE+"/json?since=10m&poll=1");
  if (response.status == 502) {
    await subscribe();
  } else if (response.status != 200) {
    // An error - let's show it
    console.log('err', response.statusText);
    // Reconnect in one second
    // await new Promise(resolve =>      setTimeout(resolve, 1000));
    // await subscribe();
  } else { 
    // Get and show the message
    let message = await response.text();
    var messages = message.split(/\r?\n/);
    console.log(messages)
    messages.forEach((xmessage) => {
      try {
        xmessage = JSON.parse(xmessage);
        // console.log('processing', xmessage);
        let data = JSON.parse(xmessage.message);
        appendMessage(data.user == PERSON_NAME ? window.person : data.user, PERSON_IMG + (data.user == PERSON_NAME ? PERSON_NAME : data.user), data.user == PERSON_NAME ? "right" : "left", data.message, xmessage.time);
      } catch(e) {
        console.log(e)
      }
    });
   
    // Call subscribe() for more messages
    // await subscribe();
  }
}

subscribe();
