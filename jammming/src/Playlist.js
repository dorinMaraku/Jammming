import React from "react";
import { Container, Badge, Form, Stack, InputGroup, FormControl, Button} from 'react-bootstrap'
import Tracklist from "./Tracklist";

export default function Playlist (props) {
    return (
      <Container>
        <Stack direction='horizontal' gap={2} className='mx-2 my-4'>
          {props.playlistTracksProp.length && 
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
              >{props.playlistStatusProp ? 'Close Playlist' : 'Show Playlist'}</Button>
              <Button 
                onClick={props.handleSaveToSpotifyProp}
                size='sm'
                variant='outline-success'
              >Save to Spotify</Button> 
            </>}
          </>
          }
        </Stack>
          <div className='mx-auto d-flex justify-content-space-between align-items-center'>

              <Tracklist 
                resultingTracks={props.generatedTracksProp}
                addToPlaylistProp={props.tracksOnPlaylistProp}  
                isListedProp={props.isListedProp}
                isListedToggleProp={props.isListedToggleProp}
                handleDeleteFromPlaylistProp={props.handleDeleteFromPlaylistProp}
              />
            
          </div>
      </Container>
    )
  }