let myLibrary;
let currentSerial = 0;

function Book(title, author, pages, read, color) { // Auto-generate Serial
  this.title = title;
  this.author = author;
  this.pages = pages;
  this.read = read;
  this.serial = myLibrary.length;
  this.color = color;
  currentSerial = myLibrary.length;
}

Book.prototype.info = function () {
  let readText = (this.read) ? 'already read' : 'not read yet';
  return `${this.title} by ${this.author}, ${this.pages} pages, ${readText}`;
};

Book.prototype.toggleRead = function () {
  this.read = !this.read;
}

Book.prototype.test = function ()
{
  console.log("Test prototype");
}

/* Select random pastel color

https://stackoverflow.com/questions/43193341/how-to-generate-random-pastel-or-brighter-color-in-javascript

*/

function getColor() {
  return "hsl(" + 360 * Math.random() + ',' +      // range 0-360
    (25 + 50 * Math.random()) + '%,' +    // range 25-75
    (85 + 10 * Math.random()) + '%)'      // range 85-95 
}


function addBookToLibrary(e) {

  e.preventDefault();  // Stop form from sending request to server

  const mName = form.elements['fBname'].value;
  const mAuthor = form.elements['fAname'].value;
  const mPage = form.elements['fTname'].value;
  const mStatus = form.elements['fStatus'].checked;

  if (mName == '' || mAuthor == '' || mPage == 0) { // Do nothing

  } else {

    let bColor = getColor();

    const book = new Book(mName, mAuthor, mPage, mStatus, bColor);

    console.log('new book');
    console.log(book);

    myLibrary.push(book);

    createCard(mName, mAuthor, mPage, mStatus, currentSerial, bColor);

    console.table(myLibrary);
  }
}


function createCard(mName, mAuthor, mPage, mStatus, mSerial, mColor) {

  let cRow, cfRow;
  const cContainer = document.querySelector(".mRight-body");

  let cCard = document.createElement('div');
  cCard.setAttribute("class", "mCard mSerial" + mSerial);
  cCard.setAttribute("style", `background:${mColor}`);
  cCard.setAttribute("val", mSerial);

  cRow = document.createElement('h2');
  cRow.textContent = mName;
  cCard.appendChild(cRow);

  cRow = document.createElement('h4');
  cRow.textContent = `by ${mAuthor}`;
  cCard.appendChild(cRow);

  cRow = document.createElement('p');
  cRow.textContent = `Total : ${mPage} Pages`;
  cCard.appendChild(cRow);

  cRow = document.createElement('p');
  cRow.setAttribute("class", "pc" + mSerial);

  if (mStatus) cRow.textContent = `Read : Yes`;
  else cRow.textContent = `Read : No`;
  cCard.appendChild(cRow);

  cRow = document.createElement('button');
  cRow.setAttribute("class", "inFormTog");
  cRow.setAttribute("val", mSerial);
  cRow.textContent = `Toggle Read`;
  cCard.appendChild(cRow);

  cRow = document.createElement('button');
  cRow.setAttribute("class", "inFormDel");
  cRow.setAttribute("val", mSerial);
  cRow.textContent = `Delete`;
  cCard.appendChild(cRow);

  //cContainer.appendChild(cCard); // Add at Last position

  cContainer.prepend(cCard); // Add at First position

  /*
                  <div class="mCard">
                    <h2>The GHost </h2>
                    <h4>by J.K Rolling at London</h4>
                    <p>Total : 125 Pages</p>
                    <p>Read : Yes</p>
                    <button class="inForm" val="toggle1">Toggle Read</button>
                    <button class="inForm" val="delete1">Delete</button>
                </div>

  */

  const gTog = Array.from(document.querySelectorAll('.inFormTog'));     // Refresh card list listener
  gTog.forEach(key => key.addEventListener('click', toggleRead));

  const gDel = Array.from(document.querySelectorAll('.inFormDel'));
  gDel.forEach(key => key.addEventListener('click', deleteBookFromLibrary));

  // Saving localStorage
  localStorage.setItem("myBooks", JSON.stringify(myLibrary));
}


function toggleRead(e) {

  let tTog = Number(e.target.getAttribute('val'));
  const rRead = document.querySelector(".pc" + tTog);

  myLibrary[tTog].toggleRead();

  rRead.textContent = (myLibrary[tTog].read) ? `Read : Yes`:`Read : No`;

  // Saving localStorage
  localStorage.setItem("myBooks", JSON.stringify(myLibrary));
}

function deleteBookFromLibrary(e) {

  let dSerial = Number(e.target.getAttribute('val'));
  const rRead = document.querySelector(".mSerial" + dSerial);


  delete myLibrary[dSerial];
  rRead.remove();     // Intentionally left hole to maintain serial continuety

  console.table(myLibrary);
  // Saving localStorage
  localStorage.setItem("myBooks", JSON.stringify(myLibrary));

  const gTog = Array.from(document.querySelectorAll('.inFormTog'));     // Refresh card list listener
  gTog.forEach(key => key.addEventListener('click', toggleRead));

  const gDel = Array.from(document.querySelectorAll('.inFormDel'));
  gDel.forEach(key => key.addEventListener('click', deleteBookFromLibrary));
}

function initBook() {

  myLibrary = JSON.parse(localStorage.getItem("myBooks") || "[]"); // Loading only Object parameter, not function

  /* Refer to how to use localStorage
  
  https://stackoverflow.com/questions/43762363/how-to-store-an-array-of-objects-in-local-storage
  
  */

  console.table(myLibrary);

  for (let i = 0; i < myLibrary.length; i++) {
    if (myLibrary[i] != null) {
      createCard(myLibrary[i].title,
        myLibrary[i].author,
        myLibrary[i].pages,
        myLibrary[i].read,
        myLibrary[i].serial,
        myLibrary[i].color);


     // Set prototype to Book manually
     Object.setPrototypeOf(myLibrary[i], Object.create(Book.prototype))   
    }
  }
}

const form = document.getElementById('addbook');
form.addEventListener('submit', addBookToLibrary);

initBook();

//refer form using to : https://www.javascripttutorial.net/javascript-dom/javascript-form/
