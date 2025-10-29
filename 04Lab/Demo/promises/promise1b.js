// Quite a lot of the time you will just use promise based functionality such as fetch. But it's not hard to write your own
// Sequence is: smallNum is declared so new Promise created. Part of creation is to call the callback immediately
// This is referred to as an executer as it is unusually executed immediately
// Resolve and Reject are typically used as parameters to the executer but they could be Bill and Bob. The first one is called 
// on success and the second on fail. In this example, success is a number less than 5. Whatever the resolve or reject pass
// as arguments, end up as parameters in .then or .catch respectively
// Once resolve or reject are called, the promise moves from a pending state into a fulfilled or rejected state

const smallNum = new Promise((resolve, reject) => {
	setTimeout(cbTimeout, 2000, resolve, reject)
}).then((result) => console.log(result))           // Has resolve arg passed to it
  .catch((result) => console.log(result))          // Has reject arg passed to it
  .finally(() => console.log("Promise finally")) 


  function cbTimeout(resolve, reject) {
    let num = 6
    if (num <= 6) resolve(`${num} is good`)
    else
      reject(`${num} is too big`)
  }


console.log("Done")



