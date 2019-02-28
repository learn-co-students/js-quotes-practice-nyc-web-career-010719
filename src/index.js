// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.
const quoteUrl = "http://localhost:3000/quotes"
const quoteList = document.querySelector('#quote-list')
let quoteForm = document.querySelector('#new-quote-form')
let allQuotes = []
const sort = document.querySelector('#sort')

// get all quotes
fetch(quoteUrl)
  .then(res=>res.json())
  .then(function(quotes){
    allQuotes = quotes
    allQuotes.forEach(renderQuotes)
  })

// create new quote
quoteForm.addEventListener("submit", function(e){
  let newSaying = quoteForm.querySelector('#new-quote').value
  let newAuthor = quoteForm.querySelector('#author').value
  e.preventDefault()
  fetch(quoteUrl, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "quote": newSaying,
      "likes": 0,
      "author": newAuthor
    })
  })
    .then(res=>res.json())
    .then(function(newQuote){
      allQuotes.push(newQuote)
      quoteList.innerHTML = ""
      allQuotes.forEach(renderQuotes)
      quoteForm.reset()
    })
})
// delete quote or add likes or edit quote
quoteList.addEventListener("click", function(e){
  if (e.target.className === "btn-danger") {
    deleteQuote(e)
  }
  if (e.target.className === "btn-success") {
    addLikes(e)
  }
  if (e.target.className === "btn-edit"){
    createForm(e)
    editQuote()
  }
})

sort.addEventListener("click", function(e){
  e.preventDefault()
  let sortedQuotes = allQuotes.slice(0)
  sortedQuotes.sort(function(a,b){
    let x = a.author.toLowerCase()
    let y = b.author.toLowerCase()
    return x < y ? -1 : x > y ? 1 : 0
  })
  quoteList.innerHTML = ""
  sortedQuotes.forEach(renderQuotes)
})


function createForm(e){
  let id = parseInt(e.target.parentNode.dataset.id)
  let quote = allQuotes.find(quote => quote.id === id)
  quoteForm.innerHTML = `
  <form id="edit-quote" >
    <div class="form-group">
      <label for="edit-quote">Quote</label>
      <input type="text" class="form-control" id="edit-quote" value="${quote.quote}">
    </div>
    <div class="form-group">
      <label for="Author">Author</label>
      <input type="text" class="form-control" id="edit-author" value="${quote.author}">
    </div>
    <button type="submit" data-id="${id}" class="btn btn-primary">Submit</button>
    <button type="cancel" class="btn btn-primary">Cancel</button>
  </form>
  `
}
function editQuote(){
  quoteForm.addEventListener("submit", function(e){
    e.preventDefault()
    let id = parseInt(e.target.children[2].dataset.id)
    let editSaying = quoteForm.querySelector('#edit-quote').value
    let editAuthor = quoteForm.querySelector('#edit-author').value
    fetch(`${quoteUrl}/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify({
        "quote": editSaying,
        "author": editAuthor
      })
    })
    .then(res=>res.json())
    .then(function(editQuote){
      let oldQuote = allQuotes.find(quote => quote.id === id)
      let index = allQuotes.indexOf(oldQuote)
      allQuotes[index] = editQuote
      quoteList.innerHTML = ""
      allQuotes.forEach(renderQuotes)
    })

  })
}
function addLikes(e){
  let id = parseInt(e.target.parentNode.dataset.id)
  let likes = allQuotes.find(quote => quote.id === id).likes
  fetch(`${quoteUrl}/${id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      "likes": ++likes,
    })
  })
  .then(res => res.json())
  .then(function(editQuote){
    let oldQuote = allQuotes.find(quote => quote.id === id)
    let index = allQuotes.indexOf(oldQuote)
    allQuotes[index] = editQuote
    quoteList.innerHTML = ""
    allQuotes.forEach(renderQuotes)
  })
}
function deleteQuote(e){
  let id = parseInt(e.target.parentNode.dataset.id)
  fetch(`${quoteUrl}/${id}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
    }
  })
  .then(res => res.json())
  .then(function(data){
    let deleteQuote = allQuotes.find(quote => quote.id === id)
    let index = allQuotes.indexOf(deleteQuote)
    if (index > -1) {
      allQuotes.splice(index, 1);
    }
    quoteList.innerHTML = ""
    allQuotes.forEach(renderQuotes)
  })
}
function renderQuotes(quote){
  quoteList.innerHTML += `
  <li class='quote-card' >
    <blockquote class="blockquote" data-id=${quote.id}>
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success'>Likes: <span id="likes">${quote.likes}</span></button>
      <button class='btn-danger'>Delete</button>
      <button class='btn-edit'>Edit</button>
    </blockquote>
  </li>
  `
}
