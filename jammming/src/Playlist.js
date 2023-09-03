import React from "react";
import { Container, Badge, Form, Stack, InputGroup, FormControl, Button} from 'react-bootstrap'
import Track from "./Track";

export default function Playlist (props) {
    return (
      <Container>
          {props.playlistTracksProp.length > 0 && 
          <>
            <InputGroup size='sm'>
              {props.handlePlaylistNameToggle && 
              <FormControl 
                size="sm" 
                type="input" 
                placeholder="Enter Playlist Name"  
                onChange={props.handlePlaylistNameProp}
                onKeyDown={event => {
                  if(event.key === 'Enter') {
                  props.handlePlaylistNameStatusProp()
                }}}/>
                }
                <Button 
                  variant={props.handlePlaylistNameToggle ? 'primary' : 'outline-secondary'}
                  onClick={props.handlePlaylistNameStatusProp}
                  onKeyDown={event => {
                    if(event.key === 'Enter') {
                    props.handlePlaylistNameStatusProp()
                  }}}
                >{props.handlePlaylistNameToggle ? 'Save' : 'Change Playlist Name'}</Button>
            </InputGroup>

            {!props.handlePlaylistNameToggle && 
            <> 
              <Form.Text 
                className='mx-auto'
                style={{fontWeight: '500', fontSize: '16px'}} 
              >Currently there {props.playlistTracksProp.length > 1 ? 'are' : 'is' } {props.playlistTracksProp.length} {props.playlistTracksProp.length > 1 ? 'items' : 'item' } in: <Badge className='mb-1' bg='success'>{props.playlistNameProp}</Badge></Form.Text>
              <Button 
                size='sm'
                className='ms-auto'
                variant={props.isListedProp ? 'outline-secondary' : 'outline-primary'}
                onClick={props.isListedToggleProp}
              >{props.isListedProp ? 'Close Playlist' : 'Show Playlist'}</Button>
              <Button 
                onClick={props.handleSaveToSpotifyProp}
                size='sm'
                variant='outline-success'
              >Save to Spotify</Button> 
            </>}
          </>
          }
          {props.isListedProp &&
          <div className='mx-auto'>
            {/* <div className='Playlist-items mx-2'> */}
              {props.playlistTracksProp.map(track => {
                return (
                  <div key={track.id} className='mb-2 d-flex align-items-center justify-content-space-between'>
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
                      className='mb-2 btn btn-outline-danger btn-sm mb-2 align-self-flex-end'
                      onClick={() => {props.deleteFromPlaylistProp(track.id, track.uri)}} 
                    >Remove</button>
                    <hr/>
                  </div>
                )}
              )} 
            {/* </div> */}
          </div>}
      </Container>
    )
  }