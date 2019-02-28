document.addEventListener("DOMContentLoaded", function(event) {

quoteList = document.querySelector("#quote-list")
quoteForm = document.querySelector("#new-quote-form")

function fetchQuotes() {
  fetch('http://localhost:3000/quotes')
    .then(resp => resp.json())
    .then(quotes => renderQuotes(quotes))
    .then(console.log)
}
function renderQuotes(quotes) {
  quotes.forEach(renderSingleQuote)
}
function renderSingleQuote(quote) {
quoteList.innerHTML += `
<li class='quote-card'>
  <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
    <button class='btn-danger'data-id=${quote.id}>Delete</button>
  </blockquote>
</li>
`
}

quoteForm.addEventListener("submit", e =>{
  let author = e.target.author.value
  let quote = e.target.newquote.value
  let data = {
    "quote": quote,
    "likes": 0,
    "author": author
  }
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data)
    }).then(r => r.json())
    quoteList.innerHTML += `
    <li class='quote-card'>
      <blockquote class="blockquote">
        <p class="mb-0">${quote.quote}</p>
        <footer class="blockquote-footer">${quote.author}</footer>
        <br>
        <button class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
        <button class='btn-danger'data-id=${quote.id}>Delete</button>
      </blockquote>
    </li>
    `
  })

quoteList.addEventListener("click", e=>{
    // debugger
    if (e.target.className === "btn-success"){
    let currentLikes = parseInt(e.target.querySelector('span').innerHTML)
    let newLikes = currentLikes + 1
    e.target.querySelector('span').innerHTML = newLikes
    fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        likes: newLikes
        })
      })
    }
    if (e.target.className === "btn-danger") {
      fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        }
      })
     e.target.parentElement.parentElement.remove()
    }
  })

fetchQuotes()


  console.log("DOM fully loaded and parsed");
});
