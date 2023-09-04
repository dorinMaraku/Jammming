import React from 'react' 
import 'bootstrap/dist/css/bootstrap.min.css';
import Track from './Track'

export default function Tracklist (props) {

  const mappedTracks = props.resultingTracks?.map((track) => {
    return (
      <div key={track.id} style={{marginInline: 'auto', maxWidth: '60%'}}>
        <div 
          key={track.id} 
          className='d-flex align-items-center bg-body-tertiary rounded shadow mt-1'>
          <Track 
            id={track.id} 
            image={track.image}
            artist={track.artist}
            name={track.name}
            album={track.album}
            track={track}
            trackURI={track.uri}
            isListedProp ={props.isListedProp}
            /> 
          <button 
            className='btn btn-outline-success shadow btn-sm px-3 py-0 me-3' 
            onClick={()=> {props.addToPlaylistProp(track, track.uri)}}
            >Add</button>
        </div>
        <hr className='mt-1'/>
      </div>
    )
  })

  return (
    <div className='Tracklist'>
      {mappedTracks}   
    </div>
    )
  }  