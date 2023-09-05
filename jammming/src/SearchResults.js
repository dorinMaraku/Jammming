import React from 'react';
import Tracklist from './Tracklist';


export default function SearchResults (props) {

    return (
      <div className='SearchResults bg-body-tertiary'>
        {props.generatedTracksProp.length > 0 && <p className='my-4 py-2 mx-auto text-success-emphasis bg-info-subtle opacity-75 rounded-bottom fs-6' style={{maxWidth: '60%'}}>Tracks related to your search:</p>}
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