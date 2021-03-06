import React, {Component, Fragment} from 'react';
import { CHANGE_POSITION, ADD_POINTS } from '../constants/action-types';
import OptionList from '../components/OptionList';
import './Question.css'

export default class Question extends Component {

    constructor(props) {
        super(props);
        this.state = {
            question: '',
            optionSelected: '',
        }

        this.handleClick = this.handleClick.bind(this);
        this.handleSelect = this.handleSelect.bind(this);
    }

    handleClick() {        

        const position = window.store.getState().questionPosition

        // Last question or after
        if (position >= 10) {

            // Handle last question
            if (position === 10) {
                console.log('position 10');            
                this.addPointsToPlayer(this.state.optionSelected)
            }

             this.props.history.push(`/results`)

        } else {
            
            this.addPointsToPlayer(this.state.optionSelected)
            window.store.dispatch({ type: CHANGE_POSITION })           

            const newPosition = window.store.getState().questionPosition;  
            this.props.history.push(`/questions/${newPosition}`)

            // Make a new request for the new question 
            const url = `/api/v1/questions/${newPosition}`
            this.request(url) 
        }                            
    
    }

    addPointsToPlayer(answerId) {
        
        // When no answer is selected
        if (!answerId) {
            return
        } else {

            // Search the option
            let answer = this.state.question.options.find((option) => {               
                return option.id === answerId
            })

            // If it doesn't find answer returns
            if (!answer) {
                return
            }
            
            window.store.dispatch({type: ADD_POINTS, payload: answer.points})
            
        }

    }

    handleSelect(event) {
        this.setState({optionSelected: parseInt(event.target.value)})     
    }

    componentDidMount() {

        const store = window.store.getState()

        if (store.playerName === '' || store.questionPosition === 0) {
            window.location.replace('/quiz')
        }

        const position = window.store.getState().questionPosition;
        const url = `/api/v1/questions/${position}`
        this.request(url)           
        
    }

    request (url) {
        fetch(url)
            .then(response => response.json())
            .then(info => this.setState({
                question: info
            }))
    }

    
    render() {

        const state = window.store.getState()

        return(
            <Fragment>
                <p className='score'>{state.playerName}, you have scored {state.playerScore} points</p>
                <h1>{this.state.question.description}</h1>
                <OptionList options={this.state.question.options} handleSelect={this.handleSelect}/>
                <button onClick={this.handleClick}>Next</button>
            </Fragment>
        );
    }

    
}

