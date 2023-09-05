import React from "react";
import Track from "./Track";

export default function Playlist (props) {
    return (
      <div className='playlist' style={{marginInline: 'auto', maxWidth: '60%'}}>
          {props.playlistTracksProp.length > 0 && 
          <div className="align-items-center mb-4">
            <div className='playlist-name input-group input-group-sm mb-2'>
              <p className='fs-6 text-muted align-self-center pe-3 mb-0 me-auto'>
                Currently there {props.playlistTracksProp.length > 1 ? 'are' : 'is' } {props.playlistTracksProp.length} {props.playlistTracksProp.length > 1 ? 'items' : 'item' } in: <span  className="fw-bold" style={{color: 'green'}}>{props.playlistNameProp}</span>
              </p>
              {props.handlePlaylistNameToggle && 
              <input 
                className='form-control '
                type="text" 
                placeholder="Enter playlist name..."  
                id='playlist-name'
                onChange={props.handlePlaylistNameProp}
                onKeyDown={event => {
                  if(event.key === 'Enter') {
                  props.handlePlaylistNameStatusProp()
                }}}/> 
                }
                <button 
                  className={`btn rounded-end-1 btn-${props.handlePlaylistNameToggle ? 'primary' : 'outline-secondary'}`}
                  onClick={props.handlePlaylistNameStatusProp}
                  onKeyDown={event => {
                    if(event.key === 'Enter') {
                    props.handlePlaylistNameStatusProp()
                  }}}
                >{props.handlePlaylistNameToggle ? 'Save' : 'Edit Name'}</button>
                {!props.handlePlaylistNameToggle && 
                <button 
                  className={`ms-2 rounded-1 btn btn-sm btn-${props.isListedProp ? 'outline-secondary' : 'outline-primary'}`}
                  onClick={props.isListedToggleProp}
                >{props.isListedProp ? 'Close Playlist' : 'Show Playlist'}</button>}
            </div>

            {!props.handlePlaylistNameToggle && 
              <button 
                className='my-3 shadow btn btn-success'
                onClick={props.handleSaveToSpotifyProp}
              >Save to Spotify</button>}
          </div>
          }
          {props.isListedProp &&
          <div className='playlist-tracks mx-auto mb-4'>
            <p className='my-4 py-2 mx-auto text-success-emphasis bg-success-subtle opacity-75 rounded-bottom fs-6'>Tracks on playlist:</p>
              {props.playlistTracksProp.map(track => {
                return (
                  <div key={track.id}>
                  <div className='d-flex align-items-center bg-body-tertiary rounded shadow mt-1'>
                    <Track 
                      id={track.id} 
                      image={track.image}
                      artist={track.artist}
                      name={track.name}
                      album={track.album}
                      track={track}
                      trackURI={track.uri}
                    />
                    <button 
                      className='btn btn-outline-danger btn-sm shadow px-3 py-0 me-3'
                      onClick={() => {props.deleteFromPlaylistProp(track.id, track.uri)}} 
                    > Remove </button>
                  </div>
                  <hr className='mt-1'/>
                </div>
                )}
              )} 
          {props.playlistTracksProp.length > 5 &&         
          <button 
            className='my-3 shadow btn btn-success'
            onClick={props.handleSaveToSpotifyProp}
          >Save to Spotify</button> }
          </div>}

      </div>
    )
  }