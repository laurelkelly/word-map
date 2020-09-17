const express = require('express');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('dist'));
app.use(express.static('public'));

require('dotenv').config();

app.get('/api/associations/:text', (req, res) => {
    // console.log(req.params.word);
    // console.log(process.env.REACT_APP_API_KEY);

    axios({
        "method":"GET",
        "url":"https://twinword-word-associations-v1.p.rapidapi.com/associations/",
        "headers":{
            "content-type":"application/octet-stream",
            "x-rapidapi-host":"twinword-word-associations-v1.p.rapidapi.com",
            "x-rapidapi-key":process.env.REACT_APP_API_KEY,
            "useQueryString":true
        },
        "params":{
            "entry": req.params.text  //could be called req.params.word
        }
    })
    .then((response)=>{
        // console.log(response.data);
        res.json([response.data.associations_scored, response.data.associations_array] || {});
    })
    .catch((error)=>{
        console.log(error)
    })

});

app.get('/api/googleTranslateLanguages/', (req, res) => {
    // console.log(process.env.REACT_APP_API_KEY);
    axios({
        "method":"GET",
        "url":"https://google-translate1.p.rapidapi.com/language/translate/v2/languages",
        "headers":{
        "content-type":"application/octet-stream",
        "x-rapidapi-host":"google-translate1.p.rapidapi.com",
        "x-rapidapi-key":process.env.REACT_APP_API_KEY,
        "accept-encoding":"application/gzip",
        "useQueryString":true
        },
        "params":{
            "target": 'en'
        }
    })
    .then((response) => {
        const rawData = response.data.data.languages;
        // console.log(rawData);
        let formattedData = [];
        for(let i = 0; i < rawData.length; i++) {
            formattedData.push([rawData[i].language, rawData[i].name]);
        }
        // for(let i = 0; i < formattedData.length; i++) {
        //     let newArr = [formattedData[i], rawData[i].name];
        //     formattedData.splice(i, 1, newArr);
        // }
        // console.log(formattedData);
        res.send(formattedData);
    })
    .catch((error) => {
        console.error(error);
        res.send('An error occured.');
    })
});

app.post('/api/googleTranslate/', (req, res) => {
    console.log(req.body);
    // axios({
    //     "method":"POST",
    //     "url":"https://google-translate1.p.rapidapi.com/language/translate/v2",
    //     "headers":{
    //     "content-type":"application/x-www-form-urlencoded",
    //     "x-rapidapi-host":"google-translate1.p.rapidapi.com",
    //     "x-rapidapi-key":process.env.REACT_APP_API_KEY,
    //     "accept-encoding":"application/gzip",
    //     "useQueryString":true
    //     },
    //     "data":{
    //         "source": 'en',
    //         "q": req.params.dataArray,
    //         "target": req.params.languageDefault
    //     }
    // })
    // .then((response)=>{
    //     // let translatedText = response.data.translations.translatedText;
    //     console.log(response);
    //     // res.send(translatedText);
    // })
    // .catch((error)=>{
    //     console.log(error);
    //     res.send('An error occured.');
    // })
});

module.exports = app;

