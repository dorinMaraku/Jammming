// require('dotenv').config()
import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup, FormControl, Button, ThemeProvider} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import Login from './Login'
import Dashboard from './Dashbord';
import SearchResults from './SearchResults';
import Playlist from './Playlist';
import axios from 'axios';

const CLIENT_ID = process.env.REACT_APP_CLIENT_ID;
const CLIENT_SECRET = process.env.REACT_APP_CLIENT_SECRET;
const USER_ID = process.env.REACT_APP_USER_ID; 
console.log(process.env.USER_ID)

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
    .then(data => 
      setAccessToken(data.access_token))
  }, [])
  
  // console.log(accessToken)
  
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
    .then(data => {
      return data.artists.items[0].id
    })
    
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
 
  useEffect(() => {
    const authParameters = {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      },
      body: {
        "name": playlistName,
        "description": "New playlist description",
        "public": false
      }
    }

    axios
      .post(`https://api.spotify.com/v1/users/${USER_ID}/playlists`, authParameters)
      .then(res => console.log(res.data))

}, [])


  return (
    <div className="App">
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


// function Playlist (props) {
//   return (
//     <Container>
//       <Stack direction='horizontal' gap={2} className='mx-2 my-4'>
//         {props.playlistProp.length > 0 && 
//         <>
//         <Col sm='3'>
//           <InputGroup size='sm'>
//             {props.handlePlaylistNameToggle && 
//             <FormControl 
//               size="sm" 
//               type="input" 
//               placeholder="Enter Playlist Name"  
//               onChange={props.handlePlaylistNameProp}
//               onKeyPress={event => {
//                 if(event.key === 'Enter') {
//                 props.handlePlaylistNameStatusProp()
//               }}}/>}
//               <Button 
//                 variant={props.handlePlaylistNameToggle ? 'primary' : 'outline-secondary'}
//                 onClick={props.handlePlaylistNameStatusProp}
//                 onKeyPress={event => {
//                   if(event.key === 'Enter') {
//                   props.handlePlaylistNameStatusProp()
//                 }}}
//               >{props.handlePlaylistNameToggle ? 'Save' : 'Change Playlist Name'}</Button>
//           </InputGroup>
//           </Col>
//           {!props.handlePlaylistNameToggle && 
//           <> 
//             <Form.Text 
//               className='mx-auto'
//               style={{fontWeight: '500', fontSize: '16px'}} 
//             >Currently there {props.playlistProp.length > 1 ? 'are' : 'is' } {props.playlistProp.length} {props.playlistProp.length > 1 ? 'items' : 'item' } in: <Badge className='mb-1' bg='success'>{props.playlistNameProp}</Badge></Form.Text>
//             <Button 
//               size='sm'
//               className='ms-auto'
//               variant={props.playlistStatusProp ? 'outline-secondary' : 'outline-primary'}
//               onClick={props.playlistStatusChangeProp}
//             >{props.playlistStatusProp ? 'Close Playlist' : 'Show Playlist'}</Button>
//             <Button 
//               onClick={props.handleSaveToSpotifyProp}
//               size='sm'
//               variant='outline-success'
//             >Save to Spotify</Button> 
//           </>}
//         </>}
//       </Stack>
//       <Row className='mx-2 row row-cols-3'>
//         {props.playlistProp.map(track => {
//           if (props.playlistStatusProp){
//           return (
//             <Card key={track.id} className='mb-2'>
//               <Track 
//                 track={track}
//               />
//               <Button 
//                 onClick={() => {props.handleDeleteFromPlaylistProp(track.id, track.uri)}} 
//                 variant='outline-danger'className='mb-2'
//                 size='sm'
//               >Delete</Button>
//             </Card>
//           )}
//         })} 
//       </Row>
//       <br />
//     </Container>
//   )
// }


