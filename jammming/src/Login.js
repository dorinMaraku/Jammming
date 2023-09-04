import {useState} from 'react';
import { Container } from 'react-bootstrap';

// const Auth_URL = 'https://accounts.spotify.com/authorize?client_id=624bcc3689ca4e4a9205e0cb5efcf422&response_type=code&redirect_uri=http://localhost:3000&scope=playlist-modify-public%20playlist-modify-private%20user-read-playback-state%20user-modify-playback-state%20user-read-email%20user-read-private';

export default function Login () {
    const [accessToken, setAccessToken] = useState('')
    //Access Token
    const clientId = '624bcc3689ca4e4a9205e0cb5efcf422'; // Insert client ID here.
    const redirectUri = 'http://localhost:3000'; // Have to add this to your accepted Spotify redirect URIs on the Spotify API.
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
            window.setTimeout(() => accessToken = '', (expiresIn - 60) * 1000);
            window.history.pushState('Access Token', null, '/'); // This clears the parameters, allowing us to grab a new access token when it expires.
            return accessToken;
        }
        else {
            const accessUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=token&scope=playlist-modify-public%20playlist-modify-private%20user-read-playback-state%20user-modify-playback-state%20user-read-email%20user-read-private&redirect_uri=${redirectUri}`;
            window.location = accessUrl
        }
    } 
    // href={accessUrl}
    return (
        <Container className='d-flex justify-content-center align-items-center' style={{minHeight: '100vh'}}>
            <a className='btn btn-success mt-4' 
                onClick={getAccessToken}>Login with Spotify</a>
        </Container>
    )
}

