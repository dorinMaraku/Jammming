import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Track (props) {
    // console.log(props.trackURI)
    return (
      <div className='Track' style={{width: '100%'}}>
        <div className='d-flex align-items-center justify-content-flex-start'>
          <img 
            src={props.image}
            className='p-2'
            style={{width: '64px', height: '64px'}}
            alt='Album Cover'/>
          <div className='px-2 text-start'>
            <p className="Song Name fs-5 my-0 text-muted">{props.name}</p>
            <p className='Artist | Album fs-6 my-0 text-muted'>{props.artist} | {props.album}</p>
          </div>
        </div>
      </div>
    )
  }