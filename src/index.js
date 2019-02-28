// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteList = document.querySelector('#quote-list')
const btn = document.querySelector('#new-quote-btn')
const form = document.querySelector('#new-quote-form')

form.addEventListener('submit', handleFetchForPost)
document.addEventListener('click', handleMainClickEvents)

function handleMainClickEvents(e){
  if (e.target.className === 'btn-danger') {
    deleteQuote(e)
  } else if (e.target.className === 'btn-success') {
    updateLikes(e)
  }
}

function updateLikes(e){
  let likes = document.querySelector('span')
  let currentLikes = ++likes.innerText
  fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      likes: currentLikes
    })
  })
  .then(response => response.json())
  .then(updatedQuote => {
    updateLikesOnDom(e, updatedQuote)
  })
}

function updateLikesOnDom(e, updatedQuote){
  if (e.target.dataset.id === updatedQuote.id) {
    likes.innerText = `${updatedQuote.likes}`
  }

}

function deleteQuote(e){
  fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
    method: "DELETE"
  })
  .then(response => response.json())
  .then(r => removeQuoteFromDom(e))
}
function removeQuoteFromDom(e){
  e.target.parentElement.parentElement.remove()
}
function handleFetchForPost(e){
  e.preventDefault()
  const newQuote = document.querySelector('#new-quote').value
  const author = document.querySelector('#author').value

  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      quote: newQuote,
      author: author,
      likes: 0
    })
  })
  .then(response => response.json())
  .then(newQuote => {
    renderSingleQuote(newQuote)})
}
function fetchQuotes(){
  quoteList.innerHTML = ""
  fetch('http://localhost:3000/quotes')
  .then(response => response.json())
  .then(quotes => renderQuotes(quotes))
}
function renderQuotes(quotes){
  quotes.forEach(quote => renderSingleQuote(quote))
}
function renderSingleQuote(quote){
  quoteList.innerHTML += `
  <li class='quote-card'>
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button data-id="${quote.id}"class='btn-success'>Likes: <span data-id="${quote.id}">${quote.likes}</span></button>
      <button data-id="${quote.id}"class='btn-danger'>Delete</button>
    </blockquote>
  </li>
  `
  const newQuote = document.querySelector('#new-quote')
  const author = document.querySelector('#author')
  newQuote.value = ""
  author.value = ""
}
fetchQuotes()
