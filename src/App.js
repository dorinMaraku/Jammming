import './App.css';
import { eventWrapper } from '@testing-library/user-event/dist/utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card, Form, Col, Stack, ThemeProvider} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getAllByTestId } from '@testing-library/react';

const CLIENT_ID = '624bcc3689ca4e4a9205e0cb5efcf422';
const CLIENT_SECRET = '6468faf416154649857cf0fc1d7ae07e';
const USER_ID = '8qmzwe9ip443vyjt3dwweovtf' 


function App() {
  const [searchInput, setSearchInput] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [albums, setAlbums] = useState([])
  const [tracks, setTracks] = useState([])
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [playlistStatus, setPlaylistStatus] = useState(false)
  const [playlistNameStatus, setPlaylistNameStatus] = useState(false)
  const [playlistName, setPlaylistName] = useState('')
  const [playlistURIs, setPlaylistURIs] = useState([])

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
    // console.log(tracks.map(track => track.id))
  }

  function onChangeEvent (event) {
      setSearchInput(event.target.value)
  }

  function handleSearch() {
    if (searchInput === '') {
      alert('Please provide a title...')
    }
    else {
      search()
  }}

  function handleAddToPlaylist (newTrack, newURI) {
    // console.log('this is the needed value' + newTrackID)
    if (playlistTracks.includes(newTrack)) {
      return playlistTracks
    }
    else {
      setPlaylistTracks(prevPlaylistTracks => ([
        ...prevPlaylistTracks,
        newTrack
      ]))
      setPlaylistURIs(prevPlaylistURIs => ([
        ...prevPlaylistURIs,
        newURI]))
    }
  }
  // console.log(playlistTracks)

  function handlePlaylistStatusChange () {
    setPlaylistStatus(prevStatus => !prevStatus)
  }
  // console.log(playlistStatus)

  function handlePlaylistName (event) {
    setPlaylistName(event.target.value)
  }

  function handleSavePlaylistNameToggle () {
    setPlaylistNameStatus(prevPlaylistNameStatus => !prevPlaylistNameStatus)
  }
  // console.log(playlistNameStatus)

  function deleteFromPlaylist(ownTrackID, ownTrackURI) {
    // console.log('item to be deleted' + ownTrack)
    setPlaylistTracks(prevPlaylistTracks => 
      prevPlaylistTracks.filter(track => 
        track.id !== ownTrackID
      ))
    setPlaylistURIs(prevPlaylistURIs=> 
      prevPlaylistURIs.filter(itemURI => 
        itemURI !== ownTrackURI
      ))
  }

  function resetPlaylist () {
    setPlaylistTracks(([]))
    setPlaylistURIs(([]))
  }

  function handleSaveToSpotify () {
    console.log('saved and reset URIs to:' + playlistURIs +' and tracks to '+ playlistTracks ) 
    // postToSpotify()
    resetPlaylist()
  }

  const createPlaylistBody = {
    name: 'My Playlist',
    description: 'new playlist',
    public: false
  }
  
  const createPlaylistParameters = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + accessToken
    },
    body: JSON.stringify(createPlaylistBody) 
  }
  
  const createPlaylist = fetch(`https://api.spotify.com/v1/users/${USER_ID}/playlists`, createPlaylistParameters)
    .then(promise => promise.json())
    .then(data => console.log(data))
 
  // async function postToSpotify () {
    // const dataToPost = {
    //   name: playlistName,
    //   description: 'New Playlist',
    //   public: false
    // }

    // const postPlaylistParameters = {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //     'Authorization': 'Bearer ' + accessToken
    //   },
    //   body: JSON.stringify(dataToPost) 
    // }

    // const playlistToPost= await fetch('https://api.spotify.com/v1/users/' + USER_ID + '/playlists', postPlaylistParameters)
  // }

  return (
    <div className="App">
      <ThemeProvider 
        breakpoints={['xxxl', 'xxl', 'xl', 'lg', 'md', 'sm', 'xs', 'xxs']}
        minBreakpoint="xxs"> 

        <h1 style={{paddingBlock:'20px'}}>Jammming</h1>

        <SearchBar 
          handleEventChangeProp={onChangeEvent} 
          searchInputProp={searchInput}
          handleSearchProp={handleSearch}
          />

        <Playlist 
          playlistProp={playlistTracks}
          playlistStatusProp={playlistStatus}
          playlistStatusChangeProp={handlePlaylistStatusChange}
          playlistNameProp={playlistName}
          handlePlaylistNameProp={handlePlaylistName}
          handlePlaylistNameToggle={playlistNameStatus}
          handlePlaylistNameStatusProp={handleSavePlaylistNameToggle}
          handleDeleteFromPlaylistProp={deleteFromPlaylist}
          handleSaveToSpotifyProp={handleSaveToSpotify}
          />

        <SearchResults 
          generatedAlbumsProp={albums} 
          generatedTracksProp={tracks} 
          tracksOnPlaylistProp={handleAddToPlaylist}
          />
      </ThemeProvider>
    </div>
  );
}

export default App;

function SearchBar(props) {
  return (
    <Container>
      <InputGroup className='m-2' size='sm'>
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
      <Form.Text style={{fontSize: '16px', fontWeight: 'bold'}}>Items related to your search:</Form.Text>
      <Tracklist 
        tracksProp={props.generatedTracksProp}
        addToPlaylistProp={props.tracksOnPlaylistProp}  
      />
    </>
  )
}

function Playlist (props) {
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
              onChange={props.handlePlaylistNameProp}/>}
              <Button 
                variant={props.handlePlaylistNameToggle ? 'primary' : 'outline-secondary'}
                onClick={props.handlePlaylistNameStatusProp}
              >{props.handlePlaylistNameToggle ? 'Save' : 'Change Playlist Name'}</Button>
          </InputGroup>
          </Col>
          <Form.Text 
            className='mx-auto'
            style={{fontWeight: 'bold', fontSize: '16px'}} 
          >Currently there {props.playlistProp.length > 1 ? 'are' : 'is' } {props.playlistProp.length} {props.playlistProp.length > 1 ? 'items' : 'item' } in: {props.playlistNameProp}</Form.Text>
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
      </Stack>
      <Row className='mx-2 row row-cols-3'>
        {props.playlistProp.map(track => {
          if (props.playlistStatusProp){
          return (
            <Card key={track.id} className='mb-2'>
              <Track 
                track={track}
              />
              <Button 
                onClick={() => {props.handleDeleteFromPlaylistProp(track.id, track.uri)}} 
                variant='outline-danger'className='mb-2'
                size='sm'
              >Delete</Button>
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
    <Container >
      <Row className='mx-2 mt-3 row row-cols-3' > 
        {props.tracksProp.map((track) => {
          // console.log(track)
          return (
            <Card key={track.id}>
              <Track 
                track={track}
              />
              <Button 
                size='sm'
                variant='outline-success' 
                className='mb-2' 
                onClick={()=> {props.addToPlaylistProp(track, track.uri)}}
              >Add to Playlist</Button>
            </Card>
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
    <Card key={props.track.id} className='mt-2'>
      <Row className='row row-cols-2'> 
        <Col sm='4'> 
          <Card.Img src={props.track.album.images[0].url} className='m-2'/>
        </Col>
        <Col sm='8'> 
          <Card.Body>
            <Card.Title>{props.track.name}</Card.Title>
            <Card.Subtitle className='mb-2 text-muted'>Artist: {props.track.artists[0].name}</Card.Subtitle>
            <Card.Subtitle className='text-muted'>Album: {props.track.album.name}</Card.Subtitle>
          </Card.Body>
        </Col>
      </Row> 
    </Card>
  )
}
