import React from "react";
import { Container, Badge, Form, Stack, InputGroup, FormControl, Button, Col, Row, Card } from 'react-bootstrap'
import Track from "./Track";

export default function Playlist (props) {
    return (
      <Container>
        <Stack direction='horizontal' gap={2} className='mx-2 my-4'>
          {props.playlistProp.length > 0 && 
          <>
          <Col sm='3'>
            <InputGroup size='sm'>
              {props.handlePlaylistNameToggle && 
              <FormControl 
                size="sm" 
                type="input" 
                placeholder="Enter Playlist Name"  
                onChange={props.handlePlaylistNameProp}
                onKeyPress={event => {
                  if(event.key === 'Enter') {
                  props.handlePlaylistNameStatusProp()
                }}}/>}
                <Button 
                  variant={props.handlePlaylistNameToggle ? 'primary' : 'outline-secondary'}
                  onClick={props.handlePlaylistNameStatusProp}
                  onKeyPress={event => {
                    if(event.key === 'Enter') {
                    props.handlePlaylistNameStatusProp()
                  }}}
                >{props.handlePlaylistNameToggle ? 'Save' : 'Change Playlist Name'}</Button>
            </InputGroup>
            </Col>
            {!props.handlePlaylistNameToggle && 
            <> 
              <Form.Text 
                className='mx-auto'
                style={{fontWeight: '500', fontSize: '16px'}} 
              >Currently there {props.playlistProp.length > 1 ? 'are' : 'is' } {props.playlistProp.length} {props.playlistProp.length > 1 ? 'items' : 'item' } in: <Badge className='mb-1' bg='success'>{props.playlistNameProp}</Badge></Form.Text>
              <Button 
                size='sm'
                className='ms-auto'
                variant={props.playlistStatusProp ? 'outline-secondary' : 'outline-primary'}
                onClick={props.playlistStatusChangeProp}
              >{props.playlistStatusProp ? 'Close Playlist' : 'Show Playlist'}</Button>
              <Button 
                onClick={props.handleSaveToSpotifyProp}
                size='sm'
                variant='outline-success'
              >Save to Spotify</Button> 
            </>}
          </>}
        </Stack>
        <div className='mx-2'>
          {props.playlistProp.map(track => {
            if (props.playlistStatusProp){
            return (
              <div key={track.id} className='mx-auto d-flex justify-content-space-between align-items-center'>
                <Track 
                  track={track}
                />
                <Button 
                  onClick={() => {props.handleDeleteFromPlaylistProp(track.id, track.uri)}} 
                  variant='outline-danger'className='mb-2'
                  size='sm'
                >Delete</Button>
              </div>
            )}
          })} 
        </div>
        <br />
      </Container>
    )
  }