/* eslint-disable no-multi-spaces */
'use strict';

const VOTING_ROUNDS = 25; // ultimately this will be 25, testing with 3 for now

let products = load();

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

function Product (name, src, timesClicked = 0, timesSeen = 0) {
  this.name = name;
  this.src = src;
  this.timesClicked = timesClicked;
  this.timesSeen = timesSeen;
}

function generateRandomNumber (){
  return Math.floor(Math.random() * products.length);
}

function displayProducts() {
  let randomIndex1 = generateRandomNumber();
  let randomIndex2 = generateRandomNumber();
  let randomIndex3 = generateRandomNumber();

  while (randomIndex2 === randomIndex1) {
    randomIndex2 = generateRandomNumber();
  }

  while (randomIndex3 === randomIndex1 || randomIndex3 === randomIndex2) {
    randomIndex3 = generateRandomNumber();
  }

  // Here's how we check if we've used images previously
  if (previouslyUsedIndexes.length) {         // i.e. if this exists it's not our first time through this loop
    while (previouslyUsedIndexes.includes(randomIndex1)) {
      randomIndex1 = generateRandomNumber();
    }

    while (previouslyUsedIndexes.includes(randomIndex2) && randomIndex2 === randomIndex1) {
      randomIndex2 = generateRandomNumber();
    }

    while (previouslyUsedIndexes.includes(randomIndex3) && randomIndex3 === randomIndex1 && randomIndex3 === randomIndex2) {
      randomIndex3 = generateRandomNumber();
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
  if (b.timesClicked === a.timesClicked) {
    // If timesClicked is equal, sort by timesSeen in descending order
    return b.timesSeen - a.timesSeen;
  }
  // Sort by timesClicked in descending order
  return b.timesClicked - a.timesClicked;
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
      productTimesClicked.push(currentProduct.timesClicked);
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
          suggestedMax: 5,
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
    if (currentProduct.timesClicked || currentProduct.timesSeen) {
      sideText += `${currentProduct.name} had ${currentProduct.timesClicked} votes, and was seen ${currentProduct.timesSeen} times.<br>`;
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
        products[i].timesClicked++;
        displayProducts();
        save();
        break;
      }
    }
  }
}

function save(){
  let valuesToStore = JSON.stringify(products);
  localStorage.setItem('productData', valuesToStore);
}

function load() {
  let rawData = localStorage.getItem('productData');
  let productData = JSON.parse(rawData);

  if (!productData){
    return [
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
      new Product('tauntaun', './img/else auntaun.jpg'), 
      new Product('unicorn', './img/unicorn.jpg'), 
      new Product('water-can', './img/water-can.jpg'), 
      new Product('wine-glass', './img/wine-glass.jpg'), 
    ];
  } else {
    let arrayOfPreviousProducts = [];;
    for (let i = 0; i < productData.length; i++){
      let currProduct = productData[i];
      arrayOfPreviousProducts.push(new Product(currProduct.name, currProduct.src, currProduct.timesClicked, currProduct.timesSeen));
    }
    return arrayOfPreviousProducts;
  }
}

productContainer.addEventListener('click', handleProductClicks);

displayProducts();
