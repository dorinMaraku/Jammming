import logo from './logo.svg';
import './App.css';
import { eventWrapper } from '@testing-library/user-event/dist/utils';
import 'bootstrap/dist/css/bootstrap.min.css';
import {Container, InputGroup,FormControl, Button, Row, Card} from 'react-bootstrap';
import { useEffect, useState } from 'react';
import { getAllByTestId } from '@testing-library/react';

const CLIENT_ID = '624bcc3689ca4e4a9205e0cb5efcf422';
const CLIENT_SECRET = '6468faf416154649857cf0fc1d7ae07e';


function App() {
  const [searchInput, setSearchInput] = useState('')
  const [accessToken, setAccessToken] = useState('')
  const [albums, setAlbums] = useState([])
  const [tracks, setTracks] = useState([])
  

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

    // console.log(tracks)

  }

  function onChangeEvent (event) {
    setSearchInput(event.target.value)
  }

  function handleSearch() {
    search()
  }

  return (
    <div className="App">
      <h1>Jammming</h1>
      <SearchBar handleEventChangeProp={onChangeEvent} handleSearchProp={handleSearch}/>
      <SearchResults generatedAlbums={albums}/>
    </div>
  );
}

export default App;

function SearchBar(props) {
  return (
    <Container>
      <InputGroup className='mb-3' size='large'>
        <FormControl
          placeholder='Search for artist'
          type='input'
          onKeyPress={event => {
            if(event.key == 'Enter') {
            props.handleSearchProp()
          }}}
          onChange={props.handleEventChangeProp}
        />
        <Button onClick={props.handleSearchProp}>Search</Button>
      </InputGroup>
    </Container>
  )
}

function SearchResults (props) {

  return (
    <Container>
      <Row className='mx-2 row row-cols-4'> 
        {props.generatedAlbums.map((album, i) => {
          // console.log(album)
          return (
         <Card>
          <Card.Img src={album.images[0].url}/>
          <Card.Body>
            <Card.Title>{album.name}</Card.Title>
          </Card.Body>
        </Card>
          )
        })}
      </Row>
    </Container>
  )
}
function Playlist () {
  return (
    <div>
      Playlist
    </div>
  )
}
function Tracklist () {
  return (
    <div>
      Tracklist
    </div>
  )
}
function Track () {
  return (
    <div>
      Track
    </div>
  )
}
