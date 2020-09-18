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
                associations: data[0],  // {"words": scores}
                dataArray: data[1]      // ["words"]
            })
            this.translateAssociatons();
        })
        .catch((error) => console.log(error));
    }

    populateLanguageDropdown() {
        fetch('/api/lingvanexTranslateLanguages')
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
        // console.log(wordMap);
        const selectedLanguage = this.state.languageCode;
        // console.log(selectedLanguage);
        fetch('/api/lingvanexTranslate/', {
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
            const scoresArray = Object.values(this.state.associations);
            let translatedData = []
            for (let i = 0; i < data.length; i++) {
                translatedData.push([data[i], scoresArray[i]]);
            }
            // console.log(translatedData);  // [["translated word", score]]
            this.setState({
                translatedAssociations: translatedData  
            })
        });
    }

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
                            <div>
                                {this.state.translatedAssociations.map(([association, score], index) => (
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