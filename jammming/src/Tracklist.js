import React from 'react' 
import 'bootstrap/dist/css/bootstrap.min.css';
import Track from './Track'

export default function Tracklist (props) {
  // console.log(props.resultingTracks)
  const trackMapping = props.resultingTracks.map((track) => {
            <>
              <Track 
                track={track}
                key={track.id}
                >
                  {console.log(track)}
              <button 
                className='btn btn-outline-success btn-sm m-2' 
                onClick={()=> {props.addToPlaylistProp(track, track.uri)}}
                >Add to Playlist</button>
              </Track> 
            </>
          }) 
  return (
    <div className='d-flex align-items-center justify-contents-space-between'>
      {trackMapping}
    </div>
    )
  }  