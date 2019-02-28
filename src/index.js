// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

let quoteContainer = document.querySelector('#quote-list')
let newQuoteForm = document.querySelector('#new-quote-form')
let editQuoteForm = document.querySelector('#edit-quote-form')
let quoteList = document.querySelector('#quote-list')
let sortButton = document.querySelector('#sort')

newQuoteForm.addEventListener('submit', newQuote)
editQuoteForm.addEventListener('submit', editQuote)
quoteList.addEventListener('click', masterListener)
sortButton.addEventListener('click', sortQuotes)

let showEdit = false;


document.addEventListener("DOMContentLoaded", function(event) {
  fetchQuotes()
}); // end of DOM CONTENT LOADED

function fetchQuotes(){
  fetch('http://localhost:3000/quotes')
  .then(function(response) {
    return response.json();
  })
  .then(function(myJson) {
    // console.log(JSON.stringify(myJson));
    myQuotes = myJson
    console.log(myQuotes)
    displayQuotes(myQuotes)
  }); // end of 2nd then
} // end of fetch

function newQuote(e){
  e.preventDefault()
  let quote = newQuoteForm.querySelector('#new-quote').value
  let author = newQuoteForm.querySelector('#author').value
  let likes = 0
  let data ={
    quote: quote,
    author: author,
    likes: likes
  }
  fetch (`http://localhost:3000/quotes`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    }, // end headers
    body: JSON.stringify(data),
  }) // end fetch
  .then(function(response) {
    return response.json();
  }) //parses to JSON
  .then(function(myJson) {
      console.log(myJson)
      myQuotes.push(myJson)
      displayQuotes(myQuotes)
  })//end then
} // end function

function displaySingleQuote(quote){
  quoteContainer.innerHTML += `<li class='quote-card'>
  <blockquote class="blockquote">
    <p class="mb-0">${quote.quote}.</p>
    <footer class="blockquote-footer">${quote.author}</footer>
    <br>
    <button data-id=${quote.id} class='btn-success'>Likes: <span>${quote.likes}</span></button>
    <button data-id=${quote.id} class='btn-danger'>Delete</button>
    <button data-id=${quote.id} class='btn-info'>Edit</button>
  </blockquote></li>`
}// end of displaySingleQuote

function displayQuotes(quotes){
  quoteContainer.innerHTML = ""
  quotes.forEach(function(e) {
    displaySingleQuote(e)
  }) // end for Each
} // end of displayQuotes

function masterListener(e){
  e.preventDefault()
  if (e.target.classList.value == "btn-danger"){
    deleteQuote(e)
  } else if (e.target.classList.value == "btn-success"){
    likeQuote(e)
  } else if (e.target.classList.value == "btn-info"){
    displayEditForm(e)
  }
} // end master func

function likeQuote(e){
  quote = myQuotes.find(quote => quote.id == e.target.dataset.id)
  let likes = quote.likes + 1
  data = {
    likes: likes
  }
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data),
    }) // end fetch
    .then(function(response) {
      return response.json();
    }) //parses to JSON
    .then(function(myJson) {
      myquote = myQuotes.find(quote => quote.id == e.target.dataset.id)
      myquote.likes = myJson.likes
      displayQuotes(myQuotes)
    })
}

function deleteQuote(e){
  quote = myQuotes.find(quote => quote.id == e.target.dataset.id)
  fetch(`http://localhost:3000/quotes/${quote.id}`, {
    method: "DELETE"
  })
  for( var i = 0; i < myQuotes.length; i++){
   if (myQuotes[i] == quote) {
     myQuotes.splice(i, 1);
   }
 }
  displayQuotes(myQuotes)
}

function displayEditForm(e){
  editForm = document.querySelector('#edit-quote-form')
  quote = myQuotes.find(quote => quote.id == e.target.dataset.id)
  showEdit = !showEdit
  if (showEdit === true){
    editForm.innerHTML = `
        <div class="form-group" data-id="${quote.id}">
          <label for="edit-quote">New Quote</label>
          <input type="text" class="form-control" id="edit-quote" value=${quote.quote}>
        </div>
        <div class="form-group">
          <label for="Author">Author</label>
          <input type="text" class="form-control" id="edit-author" value="${quote.author}">
        </div>
        <button type="submit" class="btn btn-primary">Submit</button>`
      }
  if (showEdit === false){
    editForm.innerHTML = ""
    }
  }

function editQuote(e){
  e.preventDefault()
  quoteID = editForm.querySelector('.form-group').dataset.id
  myquote = myQuotes.find(quote => quote.id == quoteID)
  let quote = document.querySelector('#edit-quote').value
  let author = document.querySelector('#edit-author').value

  let data = {
    quote: quote,
    author: author
  }
  fetch(`http://localhost:3000/quotes/${myquote.id}`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      "Accept": "application/json"
    },
    body: JSON.stringify(data),
    }) // end fetch
    .then(function(response) {
      return response.json();
    }) //parses to JSON
    .then(function(myJson) {
      let quote = myQuotes.find(quote => quote.id == quoteID)
      quote.quote = myJson.quote
      quote.author = myJson.author
      displayQuotes(myQuotes)
    })
}

function sortQuotes(e){
  if (document.querySelector('#sort').innerText.includes("OFF")){
    document.querySelector('#sort').innerText = "SORT ON"
    renderSortedQuotes(myQuotes)
  }
  else if (document.querySelector('#sort').innerText.includes("ON")){
    document.querySelector('#sort').innerText = "SORT OFF"
    displayQuotes(myQuotes)
  }
}


// function renderSortedQuotes(arr){
//   const ordered = {};
//   Object.keys(arr).sort().forEach(function(key) {
//   ordered[key] = arr[author];
//   debugger
//   displayQuotes(ordered)
// });


  // sortedArr = []
  // for (let i=0; i<myQuotes.length; i++){
  //   for(let j=0;j<arr.length - i - 1;j++){
  //     if(arr[j].author>arr[j+1].author){
  //       let lesser = arr[j+1].author
  //       arr[j+1].author = arr[j].author
  //       arr[j].author = lesser
  //     }
  //   }
  // }
  displayQuotes(arr)
}
