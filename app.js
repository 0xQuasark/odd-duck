'use strict';

let testy = [];
const VOTING_ROUNDS = 5; // ultimately this will be 25, testing with 3 for now

const image1Element = document.getElementById('image1');
const image2Element = document.getElementById('image2');
const image3Element = document.getElementById('image3');
const productContainer = document.getElementById('productContainer');
const statusContent = document.getElementById('status-box');      // setting the Voting/No Voting status
const sidePanelText = document.getElementById('side-panel-text');


let roundsVoted = 0;

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
  new Product('pet-sweet', './img/pet-sweep.jpg'), 
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


function displayResults() {
  let sideText = '';
  let i = 0;
  // let nonZeroResults = true;

  products.sort(compareTimesClicked);
  console.log(products);

  for (const currentProduct of products) {
    if (currentProduct.timeClicked || currentProduct.timesSeen) {
      console.log(currentProduct.name);
      sideText += `${currentProduct.name} had ${currentProduct.timeClicked} votes, and was seen ${currentProduct.timesSeen} times.<br>`;
      testy.push(currentProduct.name);
      i++;
    } else {
      console.log('im outta here');
    }
  }
  // for (const currentProduct of products) {
  //   if (products[i].timeClicked || products[i].timesSeen) {
  //     console.log(products[i].name);
  //     sideText += `${currentProduct.name} had ${currentProduct.timeClicked} votes, and was seen ${currentProduct.timesSeen} times.<br>`;
  //     testy.push(currentProduct.name);
  //   } else {
  //     console.log('im outta here');
  //   }
  //   i++;
  // }

  let remainingProducts = products.length - i;
  console.log(remainingProducts);
  if (remainingProducts) {
    console.log('remainingProducts: ' + remainingProducts);
    sideText += `<p><p><p><p><p>There were ${remainingProducts} products that never seen. They are:<p>`;

    while (i < products.length) {
      sideText += `${products[i].name}<br>`;
      testy.push(products[i].name);
      i++;
    }
  }
  console.log(`i: ${i} vs products.length: ${products.length}`);
  sidePanelText.innerHTML = sideText;
  console.log(testy);
}

function votingOver() {
  // alert('Exceeded maximum votes');
  productContainer.removeEventListener('click', handleProductClicks);
  statusContent.classList.add('grey');
  statusContent.textContent = 'Voting Over, Click Here to View Results';
  // console.log(statusContent.textContent);

  statusContent.addEventListener('click', displayResults);

  console.log(products);
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
      }
    }
    // console.log(`roundsVoted: ${roundsVoted}, VOTING_ROUNDS:${VOTING_ROUNDS}`);
    // console.log(products);
  }
}

productContainer.addEventListener('click', handleProductClicks);

// console.log(products);
displayProducts();
