import './css/styles.css';
import Notiflix from 'notiflix';
import { fetchCountries } from './fetchCountries';
var debounce = require('lodash.debounce');

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');
list.style.padding = '0';

input.addEventListener('input', debounce(seachCountry, DEBOUNCE_DELAY));

function clearData(output) {
  output.innerHTML = '';
}

function seachCountry(evt) {
  const name = evt.target.value.trim();
  if (name === '') {
    return;
  }

  fetchCountries(name)
    .then(data => {
      createMarkup(data);
    })
    .catch(error => {
      if (name !== '') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearData(list);
        clearData(info);
      }
      if (name === '') {
        Notiflix.Notify.failure('Oops, there is no country with that name');
        clearData(list);
        clearData(info);
      }
    });
  evt.preventDefault();
}

function createMarkup(array) {
  if (array.length > 10) {
    clearData(list);
    clearData(info);

    Notiflix.Notify.info(
      'Too many matches found. Please enter a more specific name.'
    );
  } else if (array.length > 1 && array.length <= 10) {
    clearData(list);
    clearData(info);

    const createListMarkupStart = array
      .map(
        ({ name, flags }) =>
          `<li style="display: flex; gap: 10px; align-items: center;">
    <img src="${flags.svg}" alt="${name.official}" width="60" height="30">
    <p>${name.official}</p>
    </li>`
      )
      .join('');

    list.insertAdjacentHTML('beforeend', createListMarkupStart);
  } else {
    clearData(list);
    clearData(info);

    const createListMarkupEnd = array
      .map(
        ({ name, flags, capital, population, languages }) =>
          `
    <div>
            <img 
                src="${flags.svg}" 
                alt="${name.official}" 
                width="60"
                height="30">
        <div>    
            <h2>${name.official}</h2>
            <p><b>Capital:&nbsp</b>${capital}</p>
            <p><b>Population:&nbsp</b>${population}</p>  
            <p><b>languages:&nbsp</b>${Object.values(languages)}</p>
    </div>
    </div>`
      )
      .join('');

    list.insertAdjacentHTML('beforeend', createListMarkupEnd);
  }
}