import React, { Component } from 'react';
import './css/custom.scss';

export class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            word: '',
            associations: null,
            languageCode: '',
            languages: [['','']]
        }
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.getAssociations = this.getAssociations.bind(this);
        this.populateLanguageDropdown = this.populateLanguageDropdown.bind(this);
        this.translateAssociatons = this.translateAssociatons.bind(this);
    }

    handleInputChange(event) {
        this.setState({
            [event.target.name]: event.target.value
        });
    }

    handleSubmit(event) {
        event.preventDefault();
        if(this.state.word === '') return;
        this.getAssociations();
    }

    componentDidMount() {
        this.populateLanguageDropdown();
    }

    getAssociations() {
        fetch('/api/associations/' + this.state.word)
          .then(response => response.json())
          .then((data) => {
            // console.log(data);
            this.setState({
                associations: data[0],
                dataArray: data[1]
            })
            this.translateAssociatons();
        })
        .catch((error) => console.log(error));
    }

    populateLanguageDropdown() {
        fetch('/api/googleTranslateLanguages/')
        .then(response => response.json())
        .then((data) => {
            // console.log(data);
            this.setState({
                languages: data
            })
        })
        .catch((error) => console.log(error));
    }

    translateAssociatons() {
        const wordMap = this.state.dataArray;
        console.log(wordMap);
        const selectedLanguage = this.state.languageCode;
        console.log(selectedLanguage);
        fetch('/api/googleTranslate/', {
            method: 'POST',
            credentials: 'same-origin',
            headers: {
                'Accept': 'application/json, text/plain, */*',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                wordMap, 
                selectedLanguage
            }),
        })
        .then(response => response.json())
        .then((data) => {
            console.log(data);
            // this.setState({
            //     translatedAssociations: data[0],
            //     newDataArray: data[1]
            // })
        });
    }
            
    // The “POST Translate” endpoint returns the translated text for a given input string that is passed to the API as input. Along with the input string, it also expects the language code of the translated language.

    // Send data[1] to Google. Take words out of their reponse, make a copy of this.state.associations & set state of this.state.translatedAssociations. Make a 3rd state for state.translated words to take words & orig. set of values - map them back together. 

    //from Google - array of all words - make sure array is same length as the object - iterate throught the translatedAssociations, for each one replace the word in this.state.associations

    //2 for loops nested 
    //google how to replace object key value - set up so I iterate through new translated words (map them in to replace one list with the other via nested loop) 
    
    //find out what format Google needs me to send them a request in (make sure data fits the format): string or array?

    render() {
        return (
            <div className='container'>
                <h1 className='title'>Word Associations Map</h1>
                <div className='app'>
                    <div className='map'>
                        <input 
                            className='create-word-map'
                            name='word'
                            type='text'
                            id='word'
                            placeholder='Enter a word'
                            value={this.state.word} 
                            onChange={this.handleInputChange} 
                        />
                        <button onClick={this.handleSubmit}>
                            Find Associations
                        </button>
                        {this.state.associations && (
                            Object.keys(this.state.associations).length === 0
                            ? <p>No results</p>
                            : <div>
                                    {Object.entries(this.state.associations).map(([association, score], index) => (
                                        <span key={index} style={{ fontSize: Math.pow(score, 2) / 200 }}>
                                            {association}
                                            {' '}
                                        </span>
                                    ))}
                                </div>
                            )}
                    </div>
                    <div className='translator'>
                        <label className= 'translate-label' htmlFor='sel'><strong>Translate to:</strong></label>
                        <select
                            className='translate-word-map'
                            name='languageCode'
                            type='select'
                            id='sel'
                            value={this.state.languageCode}
                            onChange={this.handleInputChange}
                        >
                            <option value='initial'>Select a Language</option>
                            {this.state.languages.map((each, index) => {
                                return (
                                <option key={index} value={each[0]}>{each[1]}</option>
                                )
                            })}
                        </select>
                        {this.state.translatedAssociations && (
                            Object.keys(this.state.translatedAssociations).length === 0
                            ? <p>No results</p>
                            : <div>
                                    {Object.entries(this.state.translatedAssociations).map(([association, score], index) => (
                                        <span key={index} style={{ fontSize: Math.pow(score, 2) / 200 }}>
                                            {association}
                                            {' '}
                                        </span>
                                    ))}
                                </div>
                            )}
                    </div>
                </div>
            </div>
        );
    }
}

export default App;