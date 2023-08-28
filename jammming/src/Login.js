import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Container } from 'react-bootstrap';

const Auth_URL = 'https://accounts.spotify.com/authorize?client_id=624bcc3689ca4e4a9205e0cb5efcf422&response_type=code&redirect_uri=http://localhost:3000&scope=playlist-modify-public%20playlist-modify-private%20user-read-playback-state%20user-modify-playback-state%20user-read-email%20user-read-private';

export default function Login () {

    return (
        <Container className='d-flex justify-content-center align-items-center' style={{minHeight: '100vh'}}>
            <a className='btn btn-success mt-4' href={Auth_URL}>Login with Spotify</a>
        </Container>
    )
}

