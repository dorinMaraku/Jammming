import React, { useState, useEffect } from "react";
import axios from "axios";


export default function useAuth (cose) {
    cosnt [accessToken, setAccessToken] = useState()
    cosnt [refreshToken, setRefreshToken] = useState()
    cosnt [expiresIn, setExpiresIn] = useState()
    
    useEffect(() => {
        axios.post('http://localhost:3001/login', {
            code,
        })
        .then(res => {
            console.log(res.data)
            window.history.pushState({}, null, '/')
        })
        .catch(() => {
            window.location = "/"
        })
    }, [code])

}