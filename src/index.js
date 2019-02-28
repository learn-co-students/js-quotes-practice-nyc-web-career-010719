let url = 'http://localhost:3000/quotes'
let allQuotes = []
let quoteList = document.querySelector("#quote-list")
let form = document.querySelector("#new-quote-form")

document.addEventListener("DOMContentLoaded", () => {
  fetchQuotes()

  document.addEventListener("click", (e) => {
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
    if (e.target.className == "btn-edit") {
      eQuote = allQuotes.find(quote => quote.id == e.target.dataset.description)
      e.target.parentElement.innerHTML += `
      <form data-id=${eQuote.id} id='quote-form' class="padding margin border-round border-grey">
        <input id="quote" type="quote" name="quote" placeholder="quote" value="${eQuote.quote}">
        <input id="author" type="author" name="author" placeholder="author" value="${eQuote.author}">
        <button id="editSubmit"> Submit </button>
      </form>
      `
    }
    if (e.target.id == "editSubmit") {
      e.target.parentElement = ""
      // let editSubmit = document.querySelector("#editSubmit")
      editQuote(e.target.parentElement)
      // editSubmit.addEventListener("click", editQuote(e.target.parentElement))
    }
    if (e.target.id == "btn-sort") {
      // debugger
      // quoteList.innerHTML = ""

      if (e.target.innerText === "Sort by Author Name Off") {
        let sorted = allQuotes.slice().sort((a, b) => a.author.localeCompare(b.author))
        e.target.innerText = "Sort by Author Name On"
        renderQuotes(sorted)
      } else {
        // debugger
        quoteList.innerHTML = ""
        e.target.innerText = "Sort by Author Name Off"
        // debugger
        renderQuotes(allQuotes)
      }

    }
  })

})//DOMContentLoaded

function editQuote(quote) {
  let eQuote = quote.querySelector("#quote").value
  let eAuthor = quote.querySelector("#author").value
  let id = quote.dataset.id
  fetch(`http://localhost:3000/quotes/${id}`, {
    method: "PATCH",
    mode: "cors",
    cache: "no-cache",
    credentials: "same-origin",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json",
    },
    body: JSON.stringify({quote: eQuote, author: eAuthor})
  })
  .then(r => r.json())
  .then(function(quote) {
    // renderQuote(quote)
  })

}

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
        <button data-description=${quote.id} class='btn-edit'>Edit</button>
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
    renderQuotes(parsed)
  })
}

function renderQuotes(quotes) {
  quoteList.innerHTML = ""
  for (var quote in quotes) {
    renderQuote(quotes[quote])
  }
}

function renderQuote(quote) {
  quoteList.innerHTML += `
  <li id=d${quote.id} class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-likes=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
      <button data-description=${quote.id} class='btn-danger'>Delete</button>
      <button data-description=${quote.id} class='btn-edit'>Edit</button>
    </blockquote>
</li>
  `
}
