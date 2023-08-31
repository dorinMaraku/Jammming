import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';

export default function SearchBar (props) {
    
    const handleKeyDown = (event) => { 
        if(event.key === 'Enter') {
            props.handleSearchProp()
        }
    }
    return (
        <div className='input-group' size='sm'> 
            <input
                className='form-control ' type='text'
                placeholder='Search for title or artist...'
                onKeyDown={handleKeyDown}
                onChange={props.handleInputChangeProp}
            />
            <button onClick={props.handleSearchProp} className='btn btn-outline-primary btn-sm'>SEARCH</button>
        </div>
    )
}