let url = 'http://localhost:3000/quotes'
let allQuotes = []
let quoteList = document.querySelector('#quote-list')
let submitForm = document.querySelector('#new-quote-form')
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
document.addEventListener("DOMContentLoaded", function(event) {


  function editAuthor(author){

    let quote = document.querySelector(`#author-${author.id}-quote`).innerText
    let authorName = document.querySelector(`#author-${author.id}-name`).innerText
    fetch(`${url}/${author.id}`,
    {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        quote: quote,
        author: authorName,
      })
    })
  }
  function incrementLikesOnPage(r){
    document.querySelector(`#like-author-${r.id}`).innerText = `Likes: ${r.likes}`
  }
  function likeAuthor(author){
    fetch(`${url}/${author.id}`,{
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        likes: author.likes += 1
      })
    })
    .then(r => r.json())
    .then(r => incrementLikesOnPage(r))
  }
  function removeAuthorFromPage(author){
    a = document.querySelector(`#delete-author-${author.id}`).parentElement.parentElement
    a.style.display = 'none'
  }
  function deleteAuthor(author){
    fetch(`${url}/${author.id}`, {
      method: "DELETE"
    })
    .then(r => r.json())
    .then(removeAuthorFromPage(author))
  }
  function findAuthorToChange(e){
    e.preventDefault()

    if (e.target.dataset.id === 'delete'){
      let authorName = e.target.previousElementSibling.previousElementSibling.previousElementSibling.innerText;
      myAuthor = allQuotes.find(author => {
        return author.author == authorName
      })
      deleteAuthor(myAuthor)
    }

    else if (e.target.dataset.id === 'like') {
      let authorName = e.target.previousElementSibling.previousElementSibling.innerText;
      myAuthor = allQuotes.find(author => {
        return author.author == authorName
      })
      likeAuthor(myAuthor)
    }

    else if (e.target.dataset.id === 'edit') {
      
      let authorName = e.target.parentElement.id
        myAuthor = allQuotes.find(author => {
        return author.id == authorName
      })
      editAuthor(myAuthor)
    }
  }
  function postNewQuote(){
    let quoteValue = document.querySelector('#new-quote').value
    let authorValue = document.querySelector('#author').value

    fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify({
        quote: quoteValue,
        likes: 0,
        author: authorValue
      })
    })
    .then(r => r.json())
    .then(r => {
      allQuotes.push(r)
      addSingleQuoteToPage(r)
    })
  }
  function addSingleQuoteToPage(quote){
    quoteList.innerHTML += `
    <li  class='quote-card'>
      <blockquote id=${quote.id} class="blockquote">
        <p id=author-${quote.id}-quote CONTENTEDITABLE class="mb-0">${quote.quote}</p>
        <footer id=author-${quote.id}-name CONTENTEDITABLE class="blockquote-footer">${quote.author}</footer>
        <br>
        <button id=like-author-${quote.id} data-id="like" class='btn-success'>Likes: <span>${quote.likes}</span></button>
        <button id=delete-author-${quote.id} data-id="delete" class='btn-danger'>Delete</button>
        <button id=edit-author-${quote.id} data-id="edit" class='btn-warning'>Edit</button>
      </blockquote>
    </li> `
  }
  function loopThroughQuotes(quotes){
    quotes.forEach(quote => {
      addSingleQuoteToPage(quote)
    })
  }
  function fetchData(){
    fetch(url)
    .then(r => r.json())
    .then(r => {
      allQuotes = r
      loopThroughQuotes(allQuotes)
    })
    }
  quoteList.addEventListener('click', findAuthorToChange)
  submitForm.addEventListener('submit', postNewQuote)
  fetchData()
})
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//document.querySelector('#edit-author-1').parentElement.innerText
