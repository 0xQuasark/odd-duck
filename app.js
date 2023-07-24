'use strict';

const VOTING_ROUNDS = 3; // ultimately this will be 25, testing with 3 for now
const image1Element = document.getElementById('image1');
const image2Element = document.getElementById('image2');
const image3Element = document.getElementById('image3');
const imageContainer = document.getElementsByClassName('productImage');


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

}

console.log(products);
displayProducts();

