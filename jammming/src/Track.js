import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';
import {Row, Card, Col} from 'react-bootstrap';

export default function Track (props) {
  const smallestImage = props.track.album.images.reduce(
    (smallest, image) => (image.height < smallest.height)? image : smallest)
    
    return (
      <div key={props.track.id} className='mt-2 d-flex align-items-center'>
        <img 
          src={smallestImage.url} 
          className='m-2'
          style={{width: '64px', height: '64px'}}/>
        <div className='m-2'>
          <div>{props.track.name}</div>
          <div className='mb-2 text-muted'>Artist: {props.track.artists[0].name}</div>
        </div>
      </div>
    )
  }