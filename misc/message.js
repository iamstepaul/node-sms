var twilio = require('twilio')
var accountsid = 'AC0823c207a44ff440fede456a3fe6143b'
var authToken = 'b9bb95ef6dd0b88eecfaddeac6ce0a5e'

var client = twilio(accountsid, authToken)

client.messages.create({
    body: 'hello meesh',
    to: +2349034093330,
    from: +12182824252
}).then((message) => {
    console.log(message.sid)
}).catch(err => {
    console.log(err)
})
