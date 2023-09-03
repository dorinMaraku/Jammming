import React from 'react' 
import 'bootstrap/dist/css/bootstrap.min.css';
import Track from './Track'

export default function Tracklist (props) {

  const mappedTracks = props.resultingTracks?.map((track) => {
    return (
      <div key={track.id} className='d-flex align-items-center justify-content-space-between'>

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
        <div>
          <button 
          className='btn btn-outline-success btn-sm m-2 ' 
          onClick={()=> {props.addToPlaylistProp(track, track.uri)}}
          // onClick={props.isListedToggleProp}
          >Add to Playlist</button>
          </div>
      </div>
    )
  })

  return (
    <div className='Tracklist'>
      {mappedTracks}   
    </div>
    )
  }  