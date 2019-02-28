const quoteURL = "http://localhost:3000/quotes"
const quoteUL = document.querySelector("#quote-list")
const newQuoteForm = document.querySelector("#new-quote-form")
const newQuote = document.querySelector("#new-quote")
const newAuthor = document.querySelector("#author")
let quoteLI = document.getElementsByTagName("li")

//DOM CONTENT LOADED============================================================
document.addEventListener('DOMContentLoaded', (e)=>{
  getQuotes(quoteURL)
  newQuoteForm.addEventListener("submit",(e)=>{
    postNewQuote(quoteURL)
  })
  quotesEventListener()
})

//FUNCTIONS=====================================================================
function getQuotes(url){
  fetch(url)
  .then(response => response.json())
  .then(parsedJSON => {
    // console.log(parsedJSON)
    renderAllQuotes(parsedJSON)
  })
}
function renderQuote(quote){
  quoteUL.innerHTML += `
  <li data-id=${quote.id} class='quote-card'>
  <blockquote class="blockquote">
  <p class="mb-0">${quote.quote}</p>
  <footer class="blockquote-footer">${quote.author}</footer>
  <br>
  <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
  <button data-id=${quote.id} class='btn-danger'>Delete</button>
  </blockquote>
  </li>
  `
}
function renderAllQuotes(quotes){
  quotes.forEach(quote => {
    renderQuote(quote)
  })
}
function postNewQuote(url){
  fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify({
      quote: newQuote.value,
      likes: 0,
      author: author.value
    })
  })
}
function quotesEventListener(){
  quoteUL.addEventListener('click', (e)=>{
    if(e.target.className === "btn-success"){
      let likeCount = e.target.innerText.split(" ")[1]
      fetch(quoteURL + '/'+ e.target.dataset.id,{
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json"
        },
        body: JSON.stringify({
          likes: ++likeCount
        })
      })
      e.target.innerText = `Likes: ${likeCount++}`
    }
    if(e.target.className === "btn-danger"){
      fetch(quoteURL + '/' + e.target.dataset.id,{
        method: "DELETE",
      })
      .then(res => {
        quoteUL.innerHTML = ``
        this.getQuotes(quoteURL)
      })

    }
  })
}
