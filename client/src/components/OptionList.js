import React from 'react'

const OptionList = ({options, handleSelect}) => {

    if (!options) {
        return null
    }

    const list = options.map((option, index) => {
        return(
        <div key={'option' + index}>
            <input type="radio" name='answer' key={'answer' + option.id} id={option.id} value={option.id} onChange={handleSelect}/>
            <label key={option.id}>{option.answer}</label>
        </div>
        )       
    })
  
    return(
        <div>{list}</div>
             
        
    )
}

export default OptionList;