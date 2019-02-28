let url = 'http://localhost:3000/quotes'
let allQuotes = []
let quoteList = document.querySelector("#quote-list")
let form = document.querySelector("#new-quote-form")

document.addEventListener("DOMContentLoaded", () => {
  fetchQuotes()

  document.addEventListener("click", (e) => {
    // debugger
    if (e.target.id == "createBtn") {
      e.preventDefault()
      let newQuote = document.querySelector("#new-quote").value
      let author = document.querySelector("#author").value
      createQuote(newQuote, author)
    }
    if (e.target.className == "btn-danger") {
      let quote = allQuotes.find(quote => quote.id == e.target.dataset.description)
      deleteQuote(quote)
    }
    if (e.target.className == "btn-success") {
      addLike(e.target)
    }
  })

})//DOMContentLoaded

function addLike(target) {
  let newLike = ++target.querySelector("span").innerText
  let id = target.parentElement.querySelector(".btn-success").dataset.likes
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({likes: newLike})
  })
  .then(response => response.json())
  .then(function(quote) {
  })
}

function deleteQuote(quoteName) {
  fetch(`http://localhost:3000/quotes/${quoteName.id}`, {
    method: "DELETE",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({quote: quoteName.quote})
  })
  .then(response => response.json())
  .then(function(quote) {
    let thing = document.querySelector(`#d${quoteName.id}`)
    quoteList.removeChild(thing)
  })
}

function createQuote(quote, author) {
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({quote: quote, author: author, likes: 0})
  })
  .then(response => response.json())
  .then(function(quote) {
    allQuotes.push(quote)
    quoteList.innerHTML += `
    <li id=d${quote.id} class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button data-likes=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
        <button data-description=${quote.id} class='btn-danger'>Delete</button>
      </blockquote>
    </li>
    `
  })
}

function fetchQuotes() {
  quoteList.innerHTML = ""
  fetch(url)
  .then(quotes=> quotes.json())
  .then(function(parsed) {
    allQuotes = parsed
    for (var quote in allQuotes) {
      quoteList.innerHTML += `
      <li id=d${allQuotes[quote].id} class='quote-card'>
        <blockquote class="blockquote">
          <p class="mb-0">${allQuotes[quote].quote}</p>
          <footer class="blockquote-footer">${allQuotes[quote].author}</footer>
          <br>
          <button data-likes=${allQuotes[quote].id} class='btn-success'>Likes: <span>${allQuotes[quote].likes}</span></button>
          <button data-description=${allQuotes[quote].id} class='btn-danger'>Delete</button>
        </blockquote>
    </li>
      `
    }
  })
}
