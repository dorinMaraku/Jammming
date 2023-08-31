import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { useCallback, useEffect, useState } from 'react';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import Playlist from './Playlist';


// const access_token = new URLSearchParams(window.location.search).get('access_token');

export default function App() {

  const [searchInput, setSearchInput] = useState('')
  const [returnedTracks, setReturnedTracks] = useState([])
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [playlistStatus, setPlaylistStatus] = useState(false)
  const [playlistNameStatus, setPlaylistNameStatus] = useState(true)
  const [playlistName, setPlaylistName] = useState('New playlist')
  const [playlistURIs, setPlaylistURIs] = useState([])


  //Access Token
  const clientId = '624bcc3689ca4e4a9205e0cb5efcf422'; // Insert client ID here.
  const redirectUri = 'http://localhost:3000'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
  let accessToken;

  const getAccessToken = () => {
    if (accessToken) {
      return accessToken
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/); // matches the access_token from the URL and assigns it to a variable
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/); // matches the expires_in from the URL and assing it to a variable 
  
    if(accessTokenMatch && expiresInMatch) {
      accessToken = accessTokenMatch[1]
      const expiresIn = Number(expiresInMatch[1])
      window.setTimeout(() => accessToken = '', expiresIn * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    }
    else {
      const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public%20playlist-modify-private%20user-read-playback-state%20user-modify-playback-state%20user-read-email%20user-read-private&redirect_uri=${redirectUri}`;
      window.location = accessUrl
    }
  } 

  
  //Search 
  //Set search query string
  const onInputChange = (event) => {
    setSearchInput(event.target.value)
  }
  // console.log(searchInput)
  //serach the input value from query string
  const search = () => {
    // console.log('search for ' + searchInput) 
    const accessToken = getAccessToken()
    // console.log('access token: ' + accessToken)
    //Get request search to get tracks/artists
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    } 
  fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track&market=US&limit=5', searchParameters)
    .then (promise => promise.json())
    .then(data => {
      if (!data.tracks) {
        console.log('no tracks')
        return []
      };
      // console.log(data.tracks.items)
      setReturnedTracks(data.tracks.items.map((track) => ({
        id: track.id,
        name: track.name,
        album: track.album.name,
        artist: track.artists[0].name,
        image: track.album.images.reduce((smallest, image) => (image.height < smallest.height) ? image : smallest).url,
        uri: track.uri
      })));
    }).catch((error) => console.log(error))
  }

  //handle the search
  function handleSearch() {
    if (!searchInput) {
      alert('Please provide a title or artist to query...')
    }
    else {
      search()
  }}
  
  const savePlaylist = (playlistName, trackUris) => {
    
    if (!playlistName || !playlistURIs.length) return;

    const accessToken = getAccessToken();
    const headers = {Authorization: `Bearer ${accessToken}`}
    let userId;

    //Get request to get the User ID
    return fetch('https://api.spotify.com/v1/me', {headers: headers})
      .then(response => response.json())
      .then(data => {
        userId = data.id
        console.log(userId)
      return fetch(`https://api.spotify.com/v1/users/users/${userId}/playlists`, {
        headers: headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      }).then(response => response.json())
        .then(data => {
          const playlistID = data.id;
          console.log(playlistID);
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
          headers: headers,
          method: 'POST',
          body: JSON.stringify({uris: trackUris})
        }).then(response => response.json())
          .then(data => {
            console.log(data)
          })
      })
    })
  }
  function handleAddToPlaylist (newTrack, newURI) {
    // console.log('this is the newTrackID' + newTrackID)
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
      setPlaylistStatus(prevStatus => !prevStatus)
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
    savePlaylist()
    resetPlaylist()
  }
  
  return (
    <div className="App">

        {/* {acccessToken ? <Dashboard code={code}/> : <Login />}  */}
        <header>
          <h1 style={{marginInline: 'auto', paddingBlock:'20px', color: 'green'}}>Ja<span className='highlight'>mmm</span>ing</h1>
          <p style={{marginInline: 'auto', marginBlockEnd: '20px', color: 'grey', fontSize: '20px'}}>Create your customized <span style={{color: 'green', fontWeight: 'bold'}}>Spotify</span> Playlist</p>
        </header>
        <SearchBar 
          handleInputChangeProp={onInputChange} 
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
          generatedTracksProp={returnedTracks} 
          tracksOnPlaylistProp={handleAddToPlaylist}
          playlistStatusProp={playlistStatus}
          handleDeleteFromPlaylistProp={deleteFromPlaylist}
        />
    </div>
  );
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
