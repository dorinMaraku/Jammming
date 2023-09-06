import './App.css'
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';
import { useState } from 'react';
import Login from './Login';
import SearchBar from './SearchBar';
import SearchResults from './SearchResults';
import Playlist from './Playlist';


export default function App() {
  const [accessToken, setAccessToken] = useState('')
  const [accessUrl, setAccessUrl] = useState('')
  const [searchInput, setSearchInput] = useState('')
  const [returnedTracks, setReturnedTracks] = useState([])
  const [isListed, setIsListed] = useState(false)
  const [playlistTracks, setPlaylistTracks] = useState([])
  const [playlistNameStatus, setPlaylistNameStatus] = useState(true)
  const [playlistName, setPlaylistName] = useState('New playlist')
  const [playlistURIs, setPlaylistURIs] = useState([])
  
  // //Access Token
  const clientId = '624bcc3689ca4e4a9205e0cb5efcf422'; // Insert client ID here.
  const redirectUri = 'https://jammmingbydm.netlify.app'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
  // let accessToken;
  
  const getAccessToken = () => {
    if (accessToken) {
      return accessToken
    }

    const accessTokenMatch = window.location.href.match(/access_token=([^&]*)/); // matches the access_token from the URL and assigns it to a variable
    const expiresInMatch = window.location.href.match(/expires_in=([^&]*)/); // matches the expires_in from the URL and assing it to a variable 
  
    if (accessTokenMatch && expiresInMatch) {
      setAccessToken(accessTokenMatch[1])
      const expiresIn = Number(expiresInMatch[1])
      window.setTimeout(() => setAccessToken(''), (expiresIn - 60) * 1000);
      window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
      return accessToken;
    }
    else {
      setAccessUrl(`https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public%20playlist-modify-private%20user-read-playback-state%20user-modify-playback-state%20user-read-email%20user-read-private&redirect_uri=${redirectUri}`);
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
    // const accessToken = getAccessToken()
    // console.log('access token: ' + accessToken)
    //Get request search to get tracks/artists
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    } 
  fetch('https://api.spotify.com/v1/search?q=' + searchInput + '&type=track&market=US&limit=50', searchParameters)
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
        uri: track.uri,
        isListed: false,
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

  const savePlaylist = (playlistName, playlistURIs) => {
    
    // const accessToken = getAccessToken();
    // console.log(accessToken)
    if (!playlistName || !playlistURIs.length) return;
    const searchParameters = {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ' + accessToken
      }
    } 
    let userId;
    
    // //Get request to get the User ID
    return fetch('https://api.spotify.com/v1/me', searchParameters)
      .then(response => response.json())
      .then(data => {
        userId = data.id
        console.log(userId)
      return fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        headers: searchParameters.headers,
        method: 'POST',
        body: JSON.stringify({name: playlistName})
      }).then(response => response.json())
        .then(data => {
          const playlistID = data.id;
          console.log(playlistID);
        return fetch(`https://api.spotify.com/v1/users/${userId}/playlists/${playlistID}/tracks`, {
          headers: searchParameters.headers,
          method: 'POST',
          body: JSON.stringify({uris: playlistURIs})
        }).then(response => response.json())
          .then(data => {
            console.log(data)
          })
      })
    })
  }

  function handleAddToPlaylist (newTrack, newURI) {
    // console.log('this is the newTrackID' + newTrackID
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
       
      // setIsListed(prevStatus => !prevStatus)
    }
  }
  // console.log(playlistTracks)

  function handleIsListedToggle () {
    setIsListed(prevStatus => !prevStatus)
  }
  // console.log(isListed)

  function handlePlaylistName (event) {
    setPlaylistName(event.target.value)
  }

  function handleSavePlaylistNameToggle () {
    setPlaylistNameStatus(prevPlaylistNameStatus => !prevPlaylistNameStatus)
  }
  // console.log(playlistNameStatus)

  function handleDeleteFromPlaylist(ownTrackID, ownTrackURI) {
    // console.log('item to be deleted' + ownTrackURI)

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
    // console.log('saved and reset URIs to:' + playlistURIs +' and tracks to '+ playlistTracks ) 
    savePlaylist(playlistName, playlistURIs)
    resetPlaylist()
  }
  
  return (
    <div className="App bg-body-tertiary" style={{minHeight: '100vh'}}>
        {!accessToken ? <Login handleTokenProp={getAccessToken} accessUrlProp={accessUrl}/> : 
      <Container>
        <header>
          <h1 style={{marginInline: 'auto', paddingBlock:'30px', color: 'green'}}
            >Ja<span className='highlight' style={{color: 'grey', fontWeight: 'bold'}}>mmm</span>ing</h1>
          <p style={{marginInline: 'auto', paddingBlockEnd: '20px', color: 'grey', fontSize: '20px', marginBottom: 0}}
            >Create your customized <span style={{color: 'green', fontWeight: 'bold'}}>Spotify</span> Playlist</p>
        </header>
        <SearchBar 
          handleInputChangeProp={onInputChange} 
          handleSearchProp={handleSearch}
          />

        <Playlist 
          playlistTracksProp={playlistTracks}
          isListedProp={isListed}
          isListedToggleProp={handleIsListedToggle}
          playlistNameProp={playlistName}
          handlePlaylistNameProp={handlePlaylistName}
          handlePlaylistNameToggle={playlistNameStatus} 
          handlePlaylistNameStatusProp={handleSavePlaylistNameToggle}
          deleteFromPlaylistProp={handleDeleteFromPlaylist}
          handleSaveToSpotifyProp={handleSaveToSpotify}
          />
   
        <SearchResults 
          generatedTracksProp={returnedTracks} 
          isListedProp={isListed}
          // isListedToggleProp={handleIsListedToggle}
          addToPlaylistProp={handleAddToPlaylist}
          deleteFromPlaylistProp={handleDeleteFromPlaylist}
          />
          </Container>
        }
    </div>
  );
}