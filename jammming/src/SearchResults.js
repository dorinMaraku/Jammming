import React from 'react';
import Tracklist from './Tracklist';


export default function SearchResults (props) {

    return (
      <div className='SearchResults'>
        {props.generatedTracksProp.length > 0 && <h2 className='mb-2' style={{fontSize: '16px', fontWeight: '500', color: 'grey'}}>Tracks related to your search:</h2>}
        <Tracklist 
          resultingTracks={props.generatedTracksProp}
          isListedProp={props.isListedProp}
          // isListedToggleProp={props.isListedToggleProp}
          addToPlaylistProp={props.tracksOnPlaylistProp}  
          handleDeleteFromPlaylistProp={props.handleDeleteFromPlaylistProp}
        />
      </div>
    )
  }