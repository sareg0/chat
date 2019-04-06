const formEl = document.querySelector('form#message-form')
formEl.onsubmit = createMessage
const messagesList = document.querySelector("section.messages")

const messageRequest = new Request(`https://chatty.kubernetes.doodle-test.com/api/chatty/v1.0?token=${TOKEN}`)

let lastMessageTime;

function getAllMessages () {
  fetch(messageRequest)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Could not retrieve messages")
    })
    .then((myJson) => {
      print(myJson)
      updateLastMessageTimeStamp(myJson)
    })
    .catch((error) => {
      console.log('There was a problem with the network')
    })
}

function updateLastMessageTimeStamp(x) {
  lastMessageTime = x[x.length - 1];
  console.log("lastMessageTime", lastMessageTime)
}

function print(messages) {
  //TODO differentiate between message I have sent v. those from other Authors
  messages.forEach((message) => {
    console.log(message)
    let messageEl = document.createElement('div')
    let nameEl = document.createElement('p')
    let textEl = document.createElement('p')
    let dateTimeEl = document.createElement('p')
    nameEl.classList.add('light-text')
    dateTimeEl.classList.add('light-text')
    nameEl.textContent = message["author"]
    dateTimeEl.textContent = message["timestamp"]
    messageEl.classList.add('message')
    textEl.textContent = message["message"]
    messageEl.append(textEl, nameEl, dateTimeEl)
    messagesList.append(messageEl)
  })
}

function getNewMessagesSince(lastMessage) {
  fetch(`${messageRequest.url}&since=${lastMessage.timestamp}`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Could not retrieve messages")
    })
    .then((myJson) => {
      print(myJson)
      updateLastMessageTimeStamp(myJson)
    })
    .catch((error) => {
      console.log('There was a problem with the network')
    })
}

function createMessage(event) {
  event.preventDefault()
  const message = { message: event.target[0].value, author: author }
  console.log(message)
  return fetch(messageRequest, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
    .then(response => {
      getNewMessagesSince(lastMessageTime)
    })
    .catch((error) => {
      console.log(error)
      console.log('There was a problem with the network')
    })
}

getAllMessages()
