// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
document.addEventListener('DOMContentLoaded', e => {
  const quoteForm = document.querySelector('#new-quote-form')
  const quoteList = document.querySelector('#quote-list')
  const editForm = document.querySelector('#edit-quote-form')
  const authorToggleBtn = document.querySelector('#btn-toggle')
  const allQuotes = []
  let editToggle = false
  let authorToggle = false

  fetchQuotes()

  authorToggleBtn.addEventListener('click', e => {
    authorToggle = !authorToggle
    if (authorToggle) {
      const sortedQuotes = sortAllQuotes()
      renderAllQuotes(sortedQuotes)
    } else {
      fetchQuotes()
      renderAllQuotes(allQuotes)
    }
  })
  quoteForm.addEventListener('submit', e => {
    e.preventDefault()
    const quoteInput = document.querySelector('#new-quote').value
    const authorInput = document.querySelector('#author').value
    const data = {
      quote: quoteInput,
      author: authorInput,
      likes: 0
    }
    createQuotes(data)
  })
  editForm.addEventListener('submit', e => {
    e.preventDefault()
    editId = e.target.querySelector('#id-author').value
    const quoteInput = document.querySelector('#edit-quote').value
    const authorInput = document.querySelector('#edit-author').value
    const data = {
      quote: quoteInput,
      author: authorInput,
    }
    editQuote(editId,data)
  })
  quoteList.addEventListener('click', e => {
    if (e.target.className === 'btn-danger') {
      deleteQuote(e)
    } else if (e.target.className === 'btn-success') {
      likeQuote(e)
    } else if (e.target.className === 'btn-edit') {
      editToggle = !editToggle
      toggleEditForm(e,editToggle)
    }
  })

})

function sortAllQuotes() {
  let sortedQuotes = allQuotes.sort((a,b) => {
    return a.author.localeCompare(b.author)
  })
  return sortedQuotes
}
function toggleEditForm(e,editToggle) {
  const editForm = document.querySelector('#edit-quote-form')
  if (editToggle) {
    editForm.style.display = 'block'
    let quote = allQuotes.find(quote => quote.id === parseInt(e.target.dataset.id))
    document.querySelector('#edit-quote').value = quote.quote
    document.querySelector('#edit-author').value = quote.author
    document.querySelector('#id-author').value = quote.id
  } else {
    editForm.style.display = 'none'
    editForm.reset()
  }
}
function editQuote(editId,data) {
  fetch(`http://localhost:3000/quotes/${editId}`, {
    method: "PATCH",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(r => {
    updateLocalQuoteStorage(r)
    debugger
    renderAllQuotes(allQuotes)
  })
}
function likeQuote(e) {
  let quote = allQuotes.find(quote => quote.id === parseInt(e.target.dataset.id))
  let likes = ++quote.likes
  updateQuoteLikesFromDOM(e)
  fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body: JSON.stringify({likes:`${likes}`})
  })
  .then(r => r.json())
  .then(r => {
    updateLocalQuoteStorage(r)
  })
}
function updateQuoteLikesFromDOM(e) {
  e.target.querySelector('span').innerHTML++
}
function updateLocalQuoteStorage(r) {
  allQuotes = allQuotes.map(quote => {
    if (quote.id === r.id) {
      return r
    } else {
      return quote
    }
  })
}
function deleteQuote(e) {
  fetch(`http://localhost:3000/quotes/${e.target.dataset.id}`, {
    method: "DELETE",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body: JSON.stringify({id:`${e.target.dataset.id}`})
  })
  .then(r => r.json())
  .then(r => removeQuoteFromDOM(e))
}
function removeQuoteFromDOM(e) {
  e.target.parentElement.parentElement.remove()
}
function createQuotes(data) {
  fetch('http://localhost:3000/quotes', {
    method: "POST",
    headers: {
      "Content-Type":"application/json",
      "Accept":"application/json"
    },
    body: JSON.stringify(data)
  })
  .then(r => r.json())
  .then(r => renderSingleQuote(r))
}
function fetchQuotes() {
  fetch('http://localhost:3000/quotes')
  .then (r => r.json())
  .then(r => {
    allQuotes = r
    renderAllQuotes(r)
  })
}
function renderAllQuotes(quotes) {
  const quoteList = document.querySelector('#quote-list')
  quoteList.innerHTML = ''
  quotes.forEach(quote => renderSingleQuote(quote))
}
function renderSingleQuote(quote) {
  const quoteList = document.querySelector('#quote-list')
  quoteList.innerHTML += `
  <li class='quote-card'>
  <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
    <button class='btn-edit' data-id=${quote.id}>Edit</button>
    <button class='btn-danger' data-id=${quote.id}>Delete</button>
  </blockquote>
</li>
  `
}
