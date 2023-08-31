import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Track (props) {
    // const smallestImage = props.track.album.images.reduce((smallest, image) => smallest.height > image.height ? image : smallest).url

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
        {!props.playlistStatusProp ? 
          // props.playlistStatusChangeProp
          <button 
            className='btn btn-outline-success btn-sm m-2 align-self-flex-end' 
            onClick={()=> {props.addToPlaylistProp(props.track, props.trackURI)}}
            >Add to Playlist</button> : 
          <button 
            onClick={() => {props.handleDeleteFromPlaylistProp(props.track, props.trackURI)}} 
            variant='btn btn-outline-danger btn-sm m-2 align-self-flex-end'className='mb-2'
            size='sm'
          >Delete</button>}
      </div>
    )
  }