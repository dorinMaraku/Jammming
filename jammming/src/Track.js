import React from "react";
import 'bootstrap/dist/css/bootstrap.min.css';


export default function Track (props) {
    const smallestImage = props.track.album.images.reduce((smallest, image) => smallest.height > image.height ? image : smallest).url

    return (
      <div key={props.track.id} className='mt-2 d-flex align-items-center'>
        <img 
          src={smallestImage}
          className='m-2'
          style={{width: '64px', height: '64px'}}
          alt=''/>
        <div className='m-2'>
          <div>{props.track.name}</div>
          <div className='mb-2 text-muted'>{props.track.artist} | {props.track.album}</div>
        </div>
      </div>
    )
  }