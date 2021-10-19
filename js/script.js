const quoteContainer = document.getElementById("quote-container");
const quoteTextContainer = document.getElementById("quote-text");
const quoteText = document.getElementById("quote");
const authorText = document.getElementById("author");
const twitterButton = document.getElementById("twitter-btn");
const newQuoteButton = document.getElementById("newQuote-btn");
const loadingContainer = document.getElementById("loading-container");

const quoteTextDefaultColor = quoteText.style.color;
const errorColor = "#DC143C";

const apiURL =
  "https://api.forismatic.com/api/1.0/?method=getQuote&lang=en&format=json";
const proxyAPI = "https://cors-anywhere.herokuapp.com/";

let errorCount = 0;

function showLoadingSpinner() {
  quoteContainer.hidden = true;
  loadingContainer.hidden = false;
}

function removeLoadingSpinner() {
  loadingContainer.hidden = true;
  quoteContainer.hidden = false;
}

function setQuote(quote) {
  if (quote.length > 120) {
    quoteTextContainer.classList.add("long-quote");
  } else {
    quoteTextContainer.classList.remove("long-quote");
  }

  quoteText.innerText = quote;
}

function setAuthor(author) {
  if (!author) {
    authorText.innerText = "Unknown";
  } else {
    authorText.innerText = author;
  }
}

function changeQuoteColorToDefault() {
  if (quoteText.style.color === errorColor) {
    quoteText.style.color = quoteTextDefaultColor;
  }
}

async function getQuote() {
  try {
    showLoadingSpinner();

    const response = await fetch(proxyAPI + apiURL);
    const data = await response.json();

    setAuthor(data.quoteAuthor);

    setQuote(data.quoteText);

    errorCount = 0;

    changeQuoteColorToDefault();

    removeLoadingSpinner();
  } catch (error) {
    if (errorCount <= 5) {
      errorCount++;
      getQuote();
    } else {
      removeLoadingSpinner();

      setQuote("An error occured while fetching Quotes from an API");
      setAuthor(null);
      quoteText.style.color = errorColor;
    }
  }
}

function shareQuoteOnTwitter() {
  const twitterURL = `https://twitter.com/intent/tweet?text=${quoteText.innerText} - ${authorText.innerText}`;

  window.open(twitterURL, "_blank");
}

newQuoteButton.addEventListener("click", getQuote);
twitterButton.addEventListener("click", shareQuoteOnTwitter);

getQuote();
