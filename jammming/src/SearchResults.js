import React from 'react';
import {Form} from 'react-bootstrap';
import Tracklist from './Tracklist';


export default function SearchResults (props) {
    return (
      <>
        <Form.Text className='mb-2' style={{fontSize: '16px', fontWeight: '500'}}>Items related to your search:</Form.Text>
        <Tracklist 
          tracksProp={props.generatedTracksProp}
          addToPlaylistProp={props.tracksOnPlaylistProp}  
        />
      </>
    )
  }