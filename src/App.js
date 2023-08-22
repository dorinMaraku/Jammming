import './App.css';
import { eventWrapper } from '@testing-library/user-event/dist/utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card, Form, Col, FormGroup} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getAllByTestId } from '@testing-library/react';

const CLIENT_ID = '624bcc3689ca4e4a9205e0cb5efcf422';
const CLIENT_SECRET = '6468faf416154649857cf0fc1d7ae07e';


function App() {
  const [searchInput, setSearchInput] = useState(null)
  const [accessToken, setAccessToken] = useState('')
  const [albums, setAlbums] = useState([])
  const [tracks, setTracks] = useState([])
  const [playlistTracksID, setPlaylistTracksID] = useState([])
  const [playlistStatus, setPlaylistStatus] = useState(false)
  const [playlistName, setPlaylistName] = useState('')

  useEffect(() => {
    //API Access Token
    var authParameters = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET
    }
    fetch('https://accounts.spotify.com/api/token', authParameters)
    .then(promise => promise.json())
    .then(data => setAccessToken(data.access_token))
  }, [])
  
  //Search 

  async function search () {
    // console.log('search for ' + searchInput) 

    //Get request search to get the Artist ID
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    }
    const artistID = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=artist', searchParameters)
    .then(response => response.json())
    .then(data => {return data.artists.items[0].id})
    
    // console.log('Aritist ID is ' + artistID)
    //Get request with Artist ID grab all albums fro the artist

    const returnedAlbums = await fetch('https://api.spotify.com/v1/artists/' + artistID + '/albums' + '?include_groups=album&market=US&limit=50', searchParameters)
    .then(promise => promise.json())
    .then(data => {
      setAlbums(data.items)
    })
    // console.log(albums)
    //Display those albums to the user

    const returnedTracks = await fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track', searchParameters)
    .then(response => response.json())
    .then(data => {
      setTracks(data.tracks.items)
    })

    // console.log(tracks.map((track, i) => track.id))

  }

  function onChangeEvent (event) {
    setSearchInput(event.target.value)
  }

  function handleSearch() {
    search()
  }

  function handleAddToPlaylist (newTrackID) {
    // console.log('this is the needed value' + newTrackID)
    if (playlistTracksID.includes(newTrackID)) {
      return playlistTracksID
    }
    else {
    setPlaylistTracksID(prevPlaylistTracksID => ([
      ...prevPlaylistTracksID,
      newTrackID
    ]))
    }
  }
  // console.log(playlistTracksID)

  function handlePlaylistStatusChange () {
    setPlaylistStatus(prevStatus => !prevStatus)
  }
  // console.log(playlistStatus)

  function handlePlaylistName (event) {
    setPlaylistName(event.target.value)
  }
  function deleteFromPlaylist(ownTrackID) {
    // console.log('item to be deleted' + ownTrack)
    setPlaylistTracksID(prevPlaylistTracksID => 
      prevPlaylistTracksID.filter(track => 
        track.id!== ownTrackID
      )
    )
  }
  
  return (
    <div className="App">
      <h1>Jammming</h1>
      <SearchBar 
        handleEventChangeProp={onChangeEvent} 
        searchInputProp={searchInput}
        handleSearchProp={handleSearch}
      />
      <Playlist 
        playlistProp={playlistTracksID}
        playlistStatusProp={playlistStatus}
        playlistStatusChangeProp={handlePlaylistStatusChange}
        playlistNameProp={playlistName}
        handlePlaylistNameProp={handlePlaylistName}
        handleDeleteFromPlaylistProp={deleteFromPlaylist}
      />
      <SearchResults 
        generatedAlbumsProp={albums} 
        generatedTracksProp={tracks} 
        tracksOnPlaylistProp={handleAddToPlaylist}
      />
    </div>
  );
}

export default App;

function SearchBar(props) {
  return (
    <Container>
      <InputGroup className='m-2' size='large'>
        <FormControl
          placeholder='Search for title'
          type='input'
          onKeyPress={event => {
            if(event.key === 'Enter') {
            props.handleSearchProp()
          }}}
          onChange={props.handleEventChangeProp}
        />
        <Button onClick={props.handleSearchProp} className='outline-primary'>Search</Button>
      </InputGroup>
    </Container>
  )
}

function SearchResults (props) {
  return (
    <>
      <Form.Text>Items related to your search:</Form.Text>
      {props.searchInputProp !== null && 
      <Tracklist 
        tracksProp={props.generatedTracksProp}
        addToPlaylistProp={props.tracksOnPlaylistProp}  
      />}
    </>
  )
}

function Playlist (props) {
  return (
    <Container>
      <Row className='m-2 row'>
        {props.playlistProp.length > 0 && 
        <FormGroup as={Row} gap={3} >
          <Col sm='3'>
            <Form.Control size="sm" type="text/input" placeholder="Enter Playlist name" className='col row-cols-4' onChange={props.handlePlaylistNameProp}/>
          </Col>
          <Col sm='6'>
            <Form.Text className='mt-2' size='large'>Currently there are {props.playlistProp.length} items in: {props.playlistNameProp}</Form.Text>
          </Col>
          <Col sm='3'>
            <Button 
              variant={props.playlistStatusProp ? 'outline-danger' : 'outline-success'}
              onClick={props.playlistStatusChangeProp}
              className='row-cols-4'>{props.playlistStatusProp ? 'Close Playlist' : 'Open Playlist'}</Button>
          </Col>
        </FormGroup>
        }
      </Row>
      <Row className='mx-2 row row-cols-4'>
        {props.playlistProp.map(track => {
          if (props.playlistStatusProp){
          return (
            <Card key={track.id} className='mb-2'>
              <Card.Img src={track.album.images[0].url} className='mt-2'/>
              <Card.Body>
                <Card.Title>Track: {track.name}</Card.Title>
                <Card.Subtitle className='mb-2 text-muted'>Artist: {track.artists[0].name}</Card.Subtitle>
                <Card.Subtitle className='text-muted'>Album: {track.album.name}</Card.Subtitle>
              </Card.Body>
              <Button onClick={() => {props.handleDeleteFromPlaylistProp(track.id)}} variant='outline-danger'className='mb-2'>Delete</Button>
            </Card>
          )}
        })} 
      </Row>
      <br />
    </Container>
  )
}

function Tracklist (props) {
  return (
    <Container>
      <Row className='mx-2 row row-cols-4'> 
        {props.tracksProp.map((track) => {
          // console.log(track)
          return (
            <Track 
              track={track}
              addToPlaylist={props.addToPlaylistProp}
            />
          )
        })}
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
      </Row>
    </Container>
  )
}
function Track (props) {

  return (
    <Card key={props.track.id} className='mb-2'>
      <Card.Img src={props.track.album.images[0].url} className='mt-2'/>
      <Card.Body>
        <Card.Title>{props.track.name}</Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>Artist: {props.track.artists[0].name}</Card.Subtitle>
        <Card.Subtitle className='text-muted'>Album: {props.track.album.name}</Card.Subtitle>
      </Card.Body>
      <Button 
        variant='outline-success' 
        className='mb-2' 
        onClick={()=> {props.addToPlaylist(props.track)}}>Add to Playlist</Button>
    </Card>
  )
}
