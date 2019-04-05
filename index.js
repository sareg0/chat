function getAllMessages () {
  fetch(`https://chatty.kubernetes.doodle-test.com/api/chatty/v1.0?token=${TOKEN}`)
    .then((response) => {
      return response.json()
    })
    .then((myJson) => {
      console.log(JSON.stringify(myJson));
    })
}

function getSomeMessages() {
  fetch(`https://chatty.kubernetes.doodle-test.com/api/chatty/v1.0?token=${TOKEN}&limit=1`)
    .then((response) => {
      return response.json()
    })
    .then((myJson) => {
      console.log(JSON.stringify(myJson));
    })
}

function createMessage(message) {
  return fetch(`https://chatty.kubernetes.doodle-test.com/api/chatty/v1.0?token=${TOKEN}`, {
    method: 'POST',
    mode: 'cors',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(message)
  })
  .then(response => response.json())
}

// // createMessage({ 'message': 'And again!!', 'author': 'Sara' })
// getAllMessages()
