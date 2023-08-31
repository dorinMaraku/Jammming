import React from 'react' 
import 'bootstrap/dist/css/bootstrap.min.css';
import Track from './Track'

export default function Tracklist (props) {

  const mappedTracks = props.resultingTracks.map((track) => {
    return (
      <div key={track.id}>
        <Track 
          id={track.id} 
          image={track.image}
          artist={track.artist}
          name={track.name}
          album={track.album}
          track={track}
          trackURI={track.uri}
          addToPlaylistProp={props.addToPlaylistProp}
          playlistStatusProp={props.playlistStatusProp}
          playlistStatusChangeProp={props.playlistStatusChangeProp}
          handleDeleteFromPlaylistProp={props.handleDeleteFromPlaylistProp}
        />
      </div>
    )
  })

  return (
    <div className='Tracklist'>
      {mappedTracks}   
    </div>
    )
  }  