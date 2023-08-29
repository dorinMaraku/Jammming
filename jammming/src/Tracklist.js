import React from 'react' 
import 'bootstrap/dist/css/bootstrap.min.css';
import Track from './Track'

export default function Tracklist (props) {
  
  return (
    <div className='d-flex align-items-center justify-contents-space-between'>
      {props.returnedTracksProp.map(track => {
        console.log(track)
        return (
          <>
            <Track 
              track={track}
              key={track.id}
              />
            <button 
              className='btn btn-outline-success btn-sm m-2' 
              onClick={()=> {props.addToPlaylistProp(props.track, props.track.uri)}}
              >Add to Playlist</button>
          </>
        )})} 
    </div>
    )
  }
        {/* working code for generating albums from api, should be connected with respective props
          {props.generatedAlbumsProp.map((album, i) => {
            // console.log(album)
            return (
           <Card>
            <Card.Img src={album.images[0].url}/>
            <Card.Body>
              <Card.Title>{album.name}</Card.Title>
            </Card.Body>
          </Card>
            )
          })} */}
    
  
  
  