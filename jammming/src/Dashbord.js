import React from "react";
import useAuth from "./useAuth";
// import SearchResults from "./SearchResults";
// import Track from "./Track";
// import Tracklist from "./Tracklist";
// import Playlist from "./Playlist";
// import SearchBar from "./SearchBar";


export default function Dashboard({code}) {
    const accessToken = useAuth(code);


    return (
        <div>
          <div>{code.accessToken}</div>
            {/* <ThemeProvider 
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
      </ThemeProvider> */}
        </div>
    )
}