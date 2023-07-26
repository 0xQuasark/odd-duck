/* eslint-disable no-multi-spaces */
'use strict';

const VOTING_ROUNDS = 5; // ultimately this will be 25, testing with 3 for now

const image1Element = document.getElementById('image1');
const image2Element = document.getElementById('image2');
const image3Element = document.getElementById('image3');
const productContainer = document.getElementById('products-container');
const statusContent = document.getElementById('status-box');      // setting the Voting/No Voting status
const sidePanelText = document.getElementById('results-feedback');
const chartCanvas = document.getElementById('myChart');

let previouslyUsedIndexes = [];
let roundsVoted = 0;
let viewResultsString = 'View Results';
let chartObj = null;

function Product (name, src) {
  this.name = name;
  this.src = src;
  this.timeClicked = 0;
  this.timesSeen = 0;
}

const products = [
  new Product('bag', './img/bag.jpg'), 
  new Product('banana', './img/banana.jpg'), 
  new Product('bathroom', './img/bathroom.jpg'), 
  new Product('boots', './img/boots.jpg'), 
  new Product('breakfast', './img/breakfast.jpg'), 
  new Product('bubblegum', './img/bubblegum.jpg'), 
  new Product('chair', './img/chair.jpg'), 
  new Product('cthulhu', './img/cthulhu.jpg'), 
  new Product('dog-duck', './img/dog-duck.jpg'), 
  new Product('dragon', './img/dragon.jpg'), 
  new Product('pen', './img/pen.jpg'), 
  new Product('pet-sweep', './img/pet-sweep.jpg'), 
  new Product('scissors', './img/scissors.jpg'), 
  new Product('shark', './img/shark.jpg'), 
  new Product('sweep', './img/sweep.png'), 
  new Product('tauntaun', './img/tauntaun.jpg'), 
  new Product('unicorn', './img/unicorn.jpg'), 
  new Product('water-can', './img/water-can.jpg'), 
  new Product('wine-glass', './img/wine-glass.jpg'), 
];

function displayProducts() {
  let randomIndex1 = Math.floor(Math.random() * products.length);
  let randomIndex2 = Math.floor(Math.random() * products.length);
  let randomIndex3 = Math.floor(Math.random() * products.length);

  while (randomIndex2 === randomIndex1) {
    randomIndex2 = Math.floor(Math.random() * products.length);
  }

  while (randomIndex3 === randomIndex1 || randomIndex3 === randomIndex2) {
    randomIndex3 = Math.floor(Math.random() * products.length);
  }

  // Here's how we check if we've used images previously
  if (previouslyUsedIndexes.length) {         // i.e. if this exists it's not our first time through this loop
    while (previouslyUsedIndexes.includes(randomIndex1)) {
      randomIndex1 = Math.floor(Math.random() * products.length);
    }

    while (previouslyUsedIndexes.includes(randomIndex2) && randomIndex2 === randomIndex1) {
      randomIndex2 = Math.floor(Math.random() * products.length);
    }

    while (previouslyUsedIndexes.includes(randomIndex3) && randomIndex3 === randomIndex1 && randomIndex3 === randomIndex2) {
      randomIndex3 = Math.floor(Math.random() * products.length);
    }
  }

  previouslyUsedIndexes = [];
  previouslyUsedIndexes.push(randomIndex1);
  previouslyUsedIndexes.push(randomIndex2);
  previouslyUsedIndexes.push(randomIndex3);

  image1Element.src = products[randomIndex1].src;
  image2Element.src = products[randomIndex2].src;
  image3Element.src = products[randomIndex3].src;

  image1Element.alt = products[randomIndex1].name;
  image2Element.alt = products[randomIndex2].name;
  image3Element.alt = products[randomIndex3].name;

  products[randomIndex1].timesSeen++;
  products[randomIndex2].timesSeen++;
  products[randomIndex3].timesSeen++;

  statusContent.textContent = `Votes remaining: ${VOTING_ROUNDS-roundsVoted}`;
  // console.log(previouslyUsedIndexes);
}

function compareTimesClicked(a, b) {
  // This function courtesy of ChatGPT
  if (b.timeClicked === a.timeClicked) {
    // If timeClicked is equal, sort by timesSeen in descending order
    return b.timesSeen - a.timesSeen;
  }
  // Sort by timeClicked in descending order
  return b.timeClicked - a.timeClicked;
}

function displayChart() {
  const productNames = [];
  const productTimesSeen = [];
  const productTimesClicked = [];

  for (let i = 0; i < products.length; i++) {
    let currentProduct = products[i];
    if (currentProduct.timesSeen > 0) {
      productNames.push(currentProduct.name);
      productTimesSeen.push(currentProduct.timesSeen);
      productTimesClicked.push(currentProduct.timeClicked);
    }
  }

  if (chartObj) {
    // If the object already exists, then we destroy it
    chartObj.clear();
    chartObj.destroy();
  }

  // eslint-disable-next-line no-undef
  chartObj = new Chart(chartCanvas, {
    type: 'bar',
    data: {
      // labels: ['Red', 'Blue', 'Yellow', 'Green', 'Purple', 'Orange'],
      labels: productNames,
      datasets: [{
        label: '# of Times Seen',
        data: productTimesSeen,
        borderWidth: 1,
        backgroundColor: 'rgba(0, 0, 255, 0.5)',
      }, {
        label: '# of Times Clicked',
        data: productTimesClicked,
        borderWidth: 1,
        backgroundColor: 'rgba(0, 128, 0, 0.5)',
      }]
    },
    options: {
      scales: {
        y: {
          beginAtZero: true,
          suggestedMax: 1,
        }
      }
    }
  });

}


function displayResults(event) {
  if (event.target.textContent === viewResultsString) {
    displayReport();    // This shows the text results in the left hand div. runs once
  }
  event.target.textContent = 'Update Chart';
  displayChart();      // This generates a chart
}

function displayReport() {
  let sideText = '';
  let i = 0;

  products.sort(compareTimesClicked);

  for (const currentProduct of products) {
    if (currentProduct.timeClicked || currentProduct.timesSeen) {
      sideText += `${currentProduct.name} had ${currentProduct.timeClicked} votes, and was seen ${currentProduct.timesSeen} times.<br>`;
      i++;
    }
  }

  let remainingProducts = products.length - i;

  if (remainingProducts) {
    sideText += `<br>There were <strong>${remainingProducts} products</strong> that are never seen. They are:<p>`;

    while (i < products.length) {
      sideText += `${products[i].name}<br>`;
      i++;
    }
  }
  sidePanelText.innerHTML = sideText;
}

function votingOver() {
  // alert('Exceeded maximum votes');
  productContainer.removeEventListener('click', handleProductClicks);
  statusContent.classList.add('grey');
  // statusContent.textContent = 'View Results';
  statusContent.textContent = viewResultsString;

  statusContent.addEventListener('click', displayResults);
}

function handleProductClicks(event) {
  roundsVoted++;
  if (roundsVoted >= VOTING_ROUNDS) {
    votingOver();
  } else {
    for (let i = 0; i < products.length; i++) {
      if (products[i].name === event.target.alt) {
        products[i].timeClicked++;
        displayProducts();
        break;
      }
    }
  }
}

productContainer.addEventListener('click', handleProductClicks);

displayProducts();
