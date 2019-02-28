// It might be a good idea to add event listener to make sure this file
// only runs after the DOM has finshed loading.

document.addEventListener("DOMContentLoaded", () => {


  // -----------  VARIABLES ------------

  let quoteList = document.querySelector("#quote-list")
  let newQuoteForm = document.querySelector("#new-quote-form")
  let allQuotes = []
  let sort = false

  // -----------  EVENT LISTENERS ------------


  newQuoteForm.addEventListener("submit", (e) => {
      e.preventDefault()
      addNewQuote()
  })

  document.addEventListener("click", (e) => {
    if (e.target.className === "btn-danger") {
      deleteQuote(e.target.dataset.id)
    }
    else if (e.target.className === "btn-success") {
      likeQuote(e.target)
    }
    else if (e.target.className === "btn-edit") {
      toggleEditForm(e.target.dataset.id)
    }
    else if (e.target.id === "sort") {
      sort = !sort
      sortByAuthor()
    }

  })

  // ----------- FUNCTIONS ------------


  function sortByAuthor() {
    if (sort) {
      let sorted = allQuotes.sort((a, b) => {
        return a.author.localeCompare(b.author)
      })
      allQuotes = sorted
      renderAllQuotes(allQuotes)
    }
    else {
      let sorted = allQuotes.sort((a, b) => {
        return a.id - b.id
      })
      allQuotes = sorted
      renderAllQuotes(allQuotes)
    }
  }

  function editQuote(editForm) {
    console.log(editForm)
    // collect input values
    let quote = editForm.querySelector("#edit-quote").value
    let author = editForm.querySelector("#edit-author").value
    let quoteId = editForm.querySelector("button").dataset.id
    let data = {
      quote: quote,
      author: author
    }
    // update db
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(quote => {
      let quoteList = allQuotes.map(q => {
        if (q.id === quote.id) {
          return quote
        }
        else {
          return q
        }
      })

      allQuotes = quoteList
      renderAllQuotes(allQuotes)
      console.log(allQuotes)
    })

  }

  function toggleEditForm(quoteId) {
    let editForm = document.querySelector(`#edit-quote-form-${quoteId}`)

    if (editForm.style.display === "block") {
      editForm.style = "display: none"
    }
    else if (editForm.style.display === "none") {
      editForm.style = "display: block"

      editForm.addEventListener("submit", (e) => {
        e.preventDefault()
        editQuote(e.target)
      })
    }
  }

  function likeQuote(likeButton) {
    likes = likeButton.querySelector("span").innerText
    ++likes
    quoteId = likeButton.dataset.id
    // optimistically update DOM
    likeButton.querySelector("span").innerText = likes

    // update db
    data = {
      "likes": likes
    }

    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(updatedQuote => {
      // update the allQuotes variable pessimistically
      let list = allQuotes.map(quote => {
        if (quote.id === parseInt(quoteId)) {
          return updatedQuote
        }
        else {
          return quote
        }
      })

      allQuotes = list
      console.log(allQuotes)
    })

  }

  function deleteQuote(quoteId) {
    fetch(`http://localhost:3000/quotes/${quoteId}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      }
    })
    .then(resp => {
      let li = document.querySelector(`#quote-${quoteId}`)
      li.remove()

      // remove from variable
      let newList = allQuotes.filter(quote => {
        return quote.id !== parseInt(quoteId)
      })
      allQuotes = newList
    })
  }

  function addNewQuote() {
    // collect data from form fields
    let newQuote = document.querySelector("#new-quote").value
    let newAuthor = document.querySelector("#author").value
    data = {
      "quote": newQuote,
      "likes": 0,
      "author": newAuthor
    }
    // make a post to the db with new data
    fetch("http://localhost:3000/quotes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Accept": "application/json"
      },
      body: JSON.stringify(data)
    })
    .then(resp => resp.json())
    .then(quote => {
      renderSingleQuote(quote)
      allQuotes.push(quote)
    })

  }

  function fetchQuotes() {
    quoteList.innerHTML = ""
    fetch("http://localhost:3000/quotes")
    .then(resp => resp.json())
    .then(quotes => {
      renderAllQuotes(quotes)
      allQuotes = quotes
    })
  }

  function renderAllQuotes(quotes) {
    quoteList.innerHTML = ""
    quotes.forEach(quote => {
    renderSingleQuote(quote)
    })
  }

  function renderSingleQuote(quote) {
    quoteList.innerHTML += `<li class='quote-card' id="quote-${quote.id}">
    <blockquote class="blockquote">
      <p class="mb-0">${quote.quote}</p>
      <footer class="blockquote-footer">${quote.author}</footer>
      <br>
      <button class='btn-success' data-id=${quote.id}>Likes: <span>${quote.likes}</span></button>
      <button class='btn-edit' data-id=${quote.id}>Edit</button>
      <button class='btn-danger' data-id=${quote.id}>Delete</button>
    </blockquote>

    <form id="edit-quote-form-${quote.id}" style="">
      <div class="form-group">
        <label for="new-quote">Edit Quote</label>
        <input type="text" class="form-control" id="edit-quote" value="${quote.quote}">
      </div>
      <div class="form-group">
        <label for="Author">Edit Author</label>
        <input type="text" class="form-control" id="edit-author" value="${quote.author}">
      </div>
      <button type="submit" class="btn btn-primary" id="submit-edit" data-id="${quote.id}">Submit</button>
    </form>
  </li>`

  let editForm = document.querySelector(`#edit-quote-form-${quote.id}`)

  editForm.style = "display: none"
  }



  fetchQuotes()


}) //end of DOM content loaded
