const fs = require('fs')
const process = require('process')

fs.readFile('./index.js', { encoding: 'utf-8' }, (err, data) => {
  if (err) {
    console.log("3")
    throw err
  }
  console.log('4')
})

setImmediate(() => { console.log('2') })

setTimeout(() => {
  console.log("1")
}, 0)

Promise.resolve().then(() => { console.log('5') })
process.nextTick(() => {
  console.log("7")
})
console.log('6')
