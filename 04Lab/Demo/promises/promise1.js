// Quite a lot of the time you will just use promise based functionality such as fetch. But it's not hard to write your own
// Sequence is: smallNum is declared and new Promise created. Part of creation is to call the callback immediately
// This is referred to as an executer as it is unusually executed immediately
// Resolve and Reject are typically used as parameters to the executer but they could be Bill and Bob. The first one is called 
// on success and the second on fail. In this example, success is a number less than 5. Whatever the resolve or reject pass
// as arguments, end up as parameters in .then() or .catch() respectively as these are the result property of the promise.
// Once resolve or reject is called, the promise moves from a pending state into a fulfilled or rejected state. If fulfilled,
// the registered callback from the call to then() is executed. If the promise is rejected, the function registered by catch()
// is executed. The function registered by finally() is called at the end regardless of the final state of the promise.
const smallNum = new Promise((res, rej) => {
  setTimeout(cbTimeout, 2000, res, rej)
}).then(cbThen)
  .catch(cbCatch)
  .finally(cbFinally)


function cbTimeout(resolve, reject) {
  let num = 5
  if (num < 5) 
    resolve(`${num} is good`)
  else
    reject(`${num} is too big`)
}

function cbThen(resResult) {
  console.log(resResult)
}

function cbCatch(rejResult) {
  console.log(rejResult)
}

function cbFinally() {
  console.log("Promise finally")
}

// Usually use anonymous functions but real functions better to illustrate the sequence
//     .then((result) => console.log(result))           // Has resolve arg passed to it
//     .catch((result) => console.log(result))          // Has reject arg passed to it
//     .finally(() => console.log("Promise finally")) 

console.log("Done")

