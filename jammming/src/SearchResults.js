import React from 'react';
import Tracklist from './Tracklist';


export default function SearchResults (props) {

    return (
      <div className='SearchResults'>
        {props.generatedTracksProp.length > 0 && <h2 className='mb-2' style={{fontSize: '16px', fontWeight: '500', color: 'grey'}}>Tracks related to your search:</h2>}
        <Tracklist 
          resultingTracks={props.generatedTracksProp}
          addToPlaylistProp={props.tracksOnPlaylistProp}  
          playlistStatusProp={props.playlistStatusProp}
          playlistStatusChangeProp={props.playlistStatusChangeProp}
          handleDeleteFromPlaylistProp={props.handleDeleteFromPlaylistProp}
        />
      </div>
    )
  }