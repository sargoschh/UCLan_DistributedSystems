$(document).ready(function () {
    $("#getJokesButton").on("click", function () {
        const amount = parseInt($("#numOfJokes").val());
        handleJokeDisplay(amount);
    });
});

function handleJokeDisplay(amount) {
    $("#jokeBox").empty();

    if (isNaN(amount) || amount === 0) {
        $("#jokeBox").html(`
      <div class="alert alert-warning" role="alert">
        😅 Please enter a number greater than 0 or smaller than 51!
      </div>
    `);
        return;
    }

    if (amount > 50) {
        $("#jokeBox").html(`
      <div class="alert alert-warning" role="alert">
        😂 Error 413: Too many jokes. Please request fewer than 51.
      </div>
    `);
        return;
    }

    if (amount === 1) {
        const randomIndex = Math.floor(Math.random() * jokes.length);
        const { setup, punchline } = jokes[randomIndex];
        $("#jokeBox").html(`
      <div class="card shadow p-3 mb-3">
        <h5>${setup}</h5>
        <p class="text-success fw-bold mt-2">${punchline}</p>
      </div>
    `);
    } else if (amount > 1) {
        handleTableGeneration(amount);
    }
}

function handleTableGeneration(amount) {
    let tableCode = `
  <table class="table table-striped table-bordered shadow-sm">
    <thead class="table-secondary">
      <tr>
        <th>Setup</th>
        <th>Punchline</th>
      </tr>
    </thead>
    <tbody>
`;


    for (let i = 0; i < amount && i < jokes.length; i++) {
        const { setup, punchline } = jokes[i];
        tableCode += `
      <tr>
        <td>${setup}</td>
        <td>${punchline}</td>
      </tr>
    `;
    }

    tableCode += `</tbody></table>`;
    $("#jokeBox").html(tableCode);
}

const jokes = [
    {
        setup: "Why did the edge server go bankrupt?",
        punchline: "Because it ran out of cache."
    },
    {
        setup: "Why do programmers prefer dark mode?",
        punchline: "Because light attracts bugs."
    },
    {
        setup: "Why did the computer show up at work late?",
        punchline: "It had a hard drive."
    },
    {
        setup: "Why did the developer go broke?",
        punchline: "Because he used up all his cache."
    },
    {
        setup: "Why do Java developers wear glasses?",
        punchline: "Because they don’t C#."
    },
    {
        setup: "Why was the JavaScript developer sad?",
        punchline: "Because he didn’t know how to ‘null’ his feelings."
    },
    {
        setup: "What do you call a group of 8 Hobbits?",
        punchline: "A hobbyte."
    },
    {
        setup: "Why don’t bachelors like Git?",
        punchline: "Because they are afraid to commit."
    },
    {
        setup: "How many programmers does it take to change a light bulb?",
        punchline: "None, that’s a hardware problem."
    },
    {
        setup: "Why was the function always so calm?",
        punchline: "Because it had a lot of closure."
    },
    {
        setup: "Why do Python programmers have low self-esteem?",
        punchline: "Because they constantly compare themselves to others."
    },
    {
        setup: "Why was the math book sad?",
        punchline: "Because it had too many problems."
    },
    {
        setup: "Why don’t scientists trust atoms?",
        punchline: "Because they make up everything."
    },
    {
        setup: "Why did the scarecrow win an award?",
        punchline: "Because he was outstanding in his field."
    },
    {
        setup: "Why do cows wear bells?",
        punchline: "Because their horns don’t work."
    },
    {
        setup: "Why did the computer go to the doctor?",
        punchline: "Because it caught a virus."
    },
    {
        setup: "Why was the JavaScript array so sad?",
        punchline: "Because it was full of null values."
    },
    {
        setup: "Why do programmers hate nature?",
        punchline: "It has too many bugs."
    },
    {
        setup: "Why was the database administrator broke?",
        punchline: "Because he lost his keys."
    },
    {
        setup: "Why don’t oysters share their pearls?",
        punchline: "Because they’re shellfish."
    },
    {
        setup: "Why did the web developer stay broke?",
        punchline: "Because he kept working for ‘exposure’."
    },
    {
        setup: "Why do Java programmers have to wear glasses?",
        punchline: "Because they don’t see sharp."
    },
    {
        setup: "Why was the belt arrested?",
        punchline: "Because it held up a pair of pants."
    },
    {
        setup: "Why did the PowerPoint presentation cross the road?",
        punchline: "To get to the other slide."
    },
    {
        setup: "Why did the chicken join a band?",
        punchline: "Because it had the drumsticks."
    },
    {
        setup: "Why did the software developer break up with his girlfriend?",
        punchline: "Because she had too many arguments."
    },
    {
        setup: "Why did the robot go on a diet?",
        punchline: "Because it had too many bytes."
    },
    {
        setup: "Why do functions always break up?",
        punchline: "Because they have too many arguments."
    },
    {
        setup: "Why was the computer so cold?",
        punchline: "Because it forgot to close Windows."
    },
    {
        setup: "Why was the JavaScript developer broke?",
        punchline: "Because he kept working for promises."
    },
    {
        setup: "Why was the equal sign so humble?",
        punchline: "Because it knew it wasn’t less than or greater than anyone else."
    },
    {
        setup: "Why do skeletons never fight?",
        punchline: "Because they don’t have the guts."
    },
    {
        setup: "Why did the integer drown?",
        punchline: "Because it couldn’t float."
    },
    {
        setup: "Why did the computer get mad at the printer?",
        punchline: "Because it didn’t like its toner voice."
    },
    {
        setup: "Why did the string break up with the array?",
        punchline: "Because it found someone more dynamic."
    },
    {
        setup: "Why did the UI designer break up with the UX designer?",
        punchline: "Because they weren’t on the same page."
    },
    {
        setup: "Why do bees have sticky hair?",
        punchline: "Because they use honeycombs."
    },
    {
        setup: "Why did the web page go to therapy?",
        punchline: "Because it had too many unresolved issues."
    },
    {
        setup: "Why did the programmer quit his job?",
        punchline: "Because he didn’t get arrays."
    },
    {
        setup: "Why did the Boolean break up with the integer?",
        punchline: "Because it couldn’t handle the truth."
    },
    {
        setup: "Why do fathers take an extra pair of socks when they go golfing?",
        punchline: "In case they get a hole in one."
    },
    {
        setup: "Why don’t parallel lines ever get married?",
        punchline: "Because they never meet."
    },
    {
        setup: "Why do pirates not know the alphabet?",
        punchline: "Because they keep getting lost at C."
    },
    {
        setup: "Why do fish live in salt water?",
        punchline: "Because pepper makes them sneeze."
    },
    {
        setup: "Why did the photo go to jail?",
        punchline: "Because it was framed."
    },
    {
        setup: "Why did the smartphone go to school?",
        punchline: "Because it wanted to be smarter."
    },
    {
        setup: "Why did the bicycle fall over?",
        punchline: "Because it was two-tired."
    },
    {
        setup: "Why don’t eggs tell jokes?",
        punchline: "Because they might crack up."
    },
    {
        setup: "Why was the JavaScript code feeling lonely?",
        punchline: "Because it didn’t know how to callback."
    }
];
