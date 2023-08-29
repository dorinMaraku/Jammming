import React from 'react';
import Tracklist from './Tracklist';


export default function SearchResults (props) {
    return (
      <div className='SearchResults'>
        <h2 className='mb-2' style={{fontSize: '16px', fontWeight: '500'}}>Tracks related to your search:</h2>
        <Tracklist 
          returnedTracksProp={props.returnedTracksProp}
          addToPlaylistProp={props.tracksOnPlaylistProp}  
        />
      </div>
    )
  }