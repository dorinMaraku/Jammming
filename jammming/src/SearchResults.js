import React from 'react';
import Tracklist from './Tracklist';


export default function SearchResults (props) {

    return (
      <div className='SearchResults bg-body-tertiary'>
        {props.generatedTracksProp.length > 0 && <p className='my-2 fs-5'>Tracks related to your search:</p>}
        <Tracklist 
          resultingTracks={props.generatedTracksProp}
          isListedProp={props.isListedProp}
          isListedToggleProp={props.isListedToggleProp}
          addToPlaylistProp={props.addToPlaylistProp}  
          deleteFromPlaylistProp={props.deleteFromPlaylistProp}
        />
      </div>
    )
  }