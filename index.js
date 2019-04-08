// const TOKEN = put token for API here :)
// const author = put author name here :)
const TOKEN = 'XM4jwxS3mvbU'
const author = 'Sara'

const messagesList = document.querySelector('section.messages')
const formEl = document.querySelector('form#message-form')
formEl.onsubmit = createMessage

const messageRequest = new Request(`https://chatty.kubernetes.doodle-test.com/api/chatty/v1.0?token=${TOKEN}`)

let lastMessageTime

function getAllMessages () {
  fetch(messageRequest)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error('Could not retrieve messages')
    })
    .then((response) => {
      print(response)
      updateLastMessageTimeStamp(response)
    })
    .catch((error) => {
      console.log('There was a problem with the network')
    })
}

function updateLastMessageTimeStamp(messages) {
  lastMessageTime = messages[messages.length - 1]
}

function print(messages) {
  messages.forEach((message) => {
    const date = new Date(message['timestamp']).toUTCString()
    let dateTimeEl = document.createElement('p')
    dateTimeEl.classList.add('message__text-small')
    dateTimeEl.textContent = date

    let messageEl = document.createElement('div')
    messageEl.classList.add('message')

    let textEl = document.createElement('p')
    // for messages we use innerHTML because messages contain HTML encoding
    textEl.innerHTML = message['message']

    if (message.token != TOKEN) {
      let nameEl = document.createElement('p')
      nameEl.textContent = message['author']
      nameEl.classList.add('message__text-small')
      messageEl.append(nameEl, textEl, dateTimeEl)
      messageEl.classList.add('interlocutor')
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
      throw new Error('Could not retrieve messages')
    })
    .then((response) => {
      print(response)
      updateLastMessageTimeStamp(response)
    })
    .catch((error) => {
      console.log('There was a problem with the network')
      // TODO: something better than console.log ;)
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
      formEl.reset()
    })
    .catch((error) => {
      console.log(error)
      console.log('There was a problem with the network')
      // TODO: something better than console.log ;)
    })
}

getAllMessages()
