import axios from 'axios';
import _ from 'lodash';
import styles from '../css/styles.css';

const searchBar = document.querySelector('[data-text-box]');
const searchButton = document.querySelector('[data-button]');
const summaryElem = document.querySelector('[data-summary]');
const totalScoreElem = document.querySelector('[data-teleport-city-score]');
const inputError = document.querySelector('[data-input-error]');
const hiddenElem = document.querySelector('.hidden');

function setScores(cityData, citySummary, cityScore, city){
    for (let i = 0; i < cityData.length; i++) {
        const score = _.get(cityData, `${i}.score_out_of_10`, []);
        document.querySelector(`[data-scores-percent-${i}]`).innerText = `${Math.round(score)}/10`;
    };
    
    summaryElem.innerText = citySummary
                                    .replace(/(<([^>]+)>)/gi, '')
                                    .replace(/\s\s+/g, ' ')
                                    .trim();
    totalScoreElem.innerText = `${Math.round(cityScore / 10)}/10`;

    document.querySelector('[data-more-info]').setAttribute('href', `https://teleport.org/cities/${city}/`);
};


async function fetchCity(){
    try {
        let city = document.querySelector('[data-text-box]').value;
        city = city
            .toLowerCase()
            .replace(/\s+/g, ' ')
            .trim()
            .replace(' ', '-');
        inputError.style.display = 'none';
        const response = await axios.get(`https://api.teleport.org/api/urban_areas/slug:${city}/scores/`);
        const cityData = _.get(response, 'data.categories', []);
        const citySummary = _.get(response, 'data.summary', []);
        const cityScore = _.get(response, 'data.teleport_city_score', []);
        setScores(cityData, citySummary, cityScore, city);

    } catch (error) {
        if (error.response.status === 404) {
            console.log('City not found');
            inputError.style.display = 'block';
        } else {
            console.log(error.response.data);
            console.log(error.response.status);
            console.log('Error', error.message);
            inputError.style.display = 'block';
            inputError.innerText = `Error ${error.response.status}. Something went wrong. Please try again.`
        } 
    }
};


searchBar.addEventListener('keyup', event => {
    if(event.keyCode === 13){
        event.preventDefault();
        searchButton.click();
    };
});
searchButton.addEventListener('click', fetchCity);