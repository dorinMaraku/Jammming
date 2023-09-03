import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Track (props) {
    // console.log(props.trackURI)
    return (
      <div className='mt-2 Track' style={{width: '100%'}}>
        <div className='m-2 d-flex align-items-center justify-content-flex-start TrackInfo'>
          <img 
            src={props.image}
            className='m-2'
            style={{width: '64px', height: '64px'}}
            alt='Album Cover'/>
          <div className='m-2 flex-start'>
            <div className="Song Name flex-start">{props.name}</div>
            <div className='Artist : Album flex-start  text-muted'>{props.artist} | {props.album}</div>
          </div>
        </div>
      </div>
    )
  }