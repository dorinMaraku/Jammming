import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Track (props) {
    // console.log(props.trackURI)
    return (
      <div className='mt-2 d-flex align-items-center justify-content-space-between Track' style={{width: '100%'}}>
        <div className='m-2 d-flex align-items-center TrackInfo'>
          <img 
            src={props.image}
            className='m-2'
            style={{width: '64px', height: '64px'}}
            alt='Album Cover'/>
          <div className='m-2'>
            <div>{props.name}</div>
            <div className='mb-2 text-muted'>{props.artist} | {props.album}</div>
          </div>
        </div>
        <div>
        {!props.isListedProp ? 
          <button 
          className='btn btn-outline-success btn-sm m-2 align-self-flex-end' 
          onClick={()=> {props.addToPlaylistProp(props.track, props.trackURI)}}
          // onClick={props.isListedToggleProp}
          
          >Add to Playlist</button> : 
          <button 
          className='btn btn-outline-danger btn-sm mb-2 align-self-flex-end'
          onClick={() => {props.handleDeleteFromPlaylistProp(props.track, props.trackURI)}} 
          // onClick={props.isListedToggleProp}
          >Remove</button>}
          </div>
      </div>
    )
  }