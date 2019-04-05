const formEl = document.querySelector('form#message-form')
formEl.onsubmit = createMessage

const messageRequest = new Request(`https://chatty.kubernetes.doodle-test.com/api/chatty/v1.0?token=${TOKEN}`)

function getAllMessages () {
  fetch(messageRequest)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Could not retrieve messages")
    })
    .then((myJson) => {
      console.log(JSON.stringify(myJson));
    })
    .catch((error) => {
      console.log('There was a problem with the network')
    })
}

function getSomeMessages() {
  fetch(`${messageRequest}&limit=1`)
    .then((response) => {
      if (response.ok) {
        return response.json()
      }
      throw new Error("Could not retrieve messages")
    })
    .then((myJson) => {
      console.log(JSON.stringify(myJson));
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
  .then(response => response.json())
  .catch((error) => {
    console.log(error)
    console.log('There was a problem with the network')
  })
}
