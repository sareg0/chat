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
  lastMessageTime = x[x.length - 1]
}

function print(messages) {
  messages.forEach((message) => {
    const date = new Date(message['timestamp']).toUTCString()
    let dateTimeEl = document.createElement('p')
    dateTimeEl.classList.add('light-text')
    dateTimeEl.textContent = date

    let messageEl = document.createElement('div')
    messageEl.classList.add('message')

    let textEl = document.createElement('p')
    textEl.textContent = message['message']

    if (message.token != TOKEN) {
      let nameEl = document.createElement('p')
      nameEl.textContent = message['author']
      nameEl.classList.add('light-text')
      messageEl.append(nameEl, textEl, dateTimeEl)
    } else {
      dateTimeEl.classList.add('ta-r')
      messageEl.append(textEl, dateTimeEl)
      messageEl.classList.add('author')
    }

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
