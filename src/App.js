import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, Row, Card, Form, Col, Stack, ThemeProvider, Badge} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Login from './Login'
import Dashboard from './Dashbord';


const CLIENT_ID = '624bcc3689ca4e4a9205e0cb5efcf422';
const CLIENT_SECRET = '28b59a7ace7844d7bb374f44dacb3f6e';
const USER_ID = '8qmzwe9ip443vyjt3dwweovtf' 

const code = new URLSearchParams(window.location.search).get('code');

function App() {
  const [searchInput, setSearchInput] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [albums, setAlbums] = useState([])
  const [tracks, setTracks] = useState([])
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [playlistStatus, setPlaylistStatus] = useState(false)
  const [playlistNameStatus, setPlaylistNameStatus] = useState(true)
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

  // const createPlaylistBody = {
  //   name: 'My Playlist',
  //   description: 'new playlist',
  //   public: false
  // }
  
  // const createPlaylistParameters = {
  //   method: 'POST',
  //   headers: {
  //     'Content-Type': 'application/json',
  //     'Authorization': 'Bearer ' + accessToken
  //   },
  //   body: JSON.stringify(createPlaylistBody) 
  // }
  
  // const createPlaylist = fetch(`https://api.spotify.com/v1/users/${USER_ID}/playlists`, createPlaylistParameters)
  //   .then(promise => promise.json())
  //   .then(data => console.log(data))
 
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
        {code ? <Dashboard code={code}/> : <Login />} 
        <header>
          <h1 style={{marginInline: 'auto', paddingBlock:'20px', color: 'green'}}>Jammming</h1>
          <p style={{marginInline: 'auto', marginBlockEnd: '20px', color: 'grey', fontSize: '20px'}}>Create your customized Spotify Playlist</p>
        </header>
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
      <InputGroup className='mx-auto' size='sm' style={{width: '60%'}}>
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
      <Form.Text className='mb-2' style={{fontSize: '16px', fontWeight: '500'}}>Items related to your search:</Form.Text>
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
      <Row className='mx-2 row row-cols-3' > 
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
    <Card key={props.track.id} className='mt-2' style={{display: 'flex', overflow: 'hidden'}}>
      <Row className='row row-cols-2' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', height: '20vh'}}> 
        <Col sm='4' style={{width: '34%'}}> 
          <Card.Img src={props.track.album.images[0].url} className='m-2'/>
        </Col>
        <Col className='mb-2' sm='8' style={{width: '66%', flexShrink: '3'}}> 
          <Card.Body className='mb-2'>
            <Card.Title style={{fontWeight: '400', fontSize: '18px'}}>{props.track.name}</Card.Title>
            <Card.Subtitle className='mb-2 text-muted' style={{fontWeight: '400',fontSize: '16px'}}>Artist: {props.track.artists[0].name}</Card.Subtitle>
            <Card.Subtitle className='text-muted' style={{fontWeight: '400', fontSize: '16px'}}>Album: {props.track.album.name}</Card.Subtitle>
          </Card.Body>
        </Col>
      </Row> 
    </Card>
  )
}
