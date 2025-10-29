
// Quite a lot of the time you will just use promise based functionality such as fetch. But it's not hard to write your own
// Sequence is: getSmallNum is declared so new Promise created. Part of creation is to call the callback immediately
// This is referred to as an executer as it is unusually executed immediately
// Resolve and Reject are typically used as parameters to the executer but they could be Bill and Bob. The first one is called 
// on success and the second on fail. In this example, success is a number less than 5. Whatever the resolve or reject getSmallNum
// returns an unresolved promise object to the called and waiting getSmallNum function where it will wait until it resolves
// Once resolved, moves from a pending state into a fulfilled or rejected state, the waiting promise assigns the resolve or reject
// argument to the variable "num"
function getSmallNum(num) {
  const prom = new Promise((res, rej) => {
    setTimeout(() => {
      if (num < 5) 
        res(`${num} is good`)
      else 
        rej(`${num} is too big`)
    }, 2000)
  })
  return prom
}


// Needs to be an async function to be able to wait. Call any function that returns a promise
// and just await. It won't carry on until the promise is satisfied but does not block the main thread
// Uses the more traditional try / catch
async function checkSmallNum(num) {
  try {
    let result = await getSmallNum(num)
    console.log(`${result}`) // Here it is intuitive to add more async calls. If first fails so does second
    result = await getSmallNum(num)
   console.log(`${result}`)
  } catch (err) {
    console.log(`${err}`)
  } finally { 
    console.log(`Promise Finally`) 
  }
}

checkSmallNum(5)
console.log("Done")


