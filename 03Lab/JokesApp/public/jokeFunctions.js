$(document).ready(function () {
  getOptionsForTypes();

  $("#getJokesButton").on("click", function () {
    const amount = parseInt($("#numOfJokes").val()) || 1;
    const type = $("#jokeTypeSelect").val();
    handleJokeDisplay(amount, type);
  });
});

async function getOptionsForTypes() {
  var res = await fetch('/types');
  var types = await res.json();

  var select = $('#jokeTypeSelect');

  select.append(`<option value="any">Any</option>`);

  types.forEach(type => {
    select.append(`<option value="${type}">${type.charAt(0).toUpperCase() + type.slice(1)}</option>`);
  });
}

async function handleJokeDisplay(amount, type) {

  var url = `/jokes/${type}?count=${amount}`;
  var res = await fetch(url);

  if (!res.ok) {
    $("#jokeBox").html(`<div class="alert alert-danger shadow-sm" role="alert">
      Error: ${res.status} - ${res.statusText}
    </div>`);
    return;
  }

  var jokes = await res.json();

  if (amount === 1) {
    const { setup, punchline } = jokes;
    $("#jokeBox").html(`
      <div class="p-3 mb-3" id="jokeCard">
      </div>
    `);

    $("#jokeCard").append(`<h5>${setup}</h5>`);
    setTimeout(() => {
      $("#jokeCard").append(`<p class="text-success fw-bold mt-2">${punchline}</p>`);
    }, 2000)

  } else if (amount > 1) {
    handleTableGeneration(jokes, amount);
  }
}

function handleTableGeneration(jokes, amount) {
  let tableCode = `
  <table class="table table-striped table-bordered shadow-sm">
    <thead class="table-secondary">
      <tr>
        <th>ID</th>
        <th>Type</th>
        <th>Setup</th>
        <th>Punchline</th>
      </tr>
    </thead>
    <tbody>
`;


  for (let i = 0; i < amount && i < jokes.length; i++) {
    const { id, type, setup, punchline } = jokes[i];
    tableCode += `
      <tr>
        <td>${id}</td>
        <td>${type}</td>
        <td>${setup}</td>
        <td>${punchline}</td>
      </tr>
    `;
  }

  tableCode += `</tbody></table>`;
  $("#jokeBox").html(tableCode);
}