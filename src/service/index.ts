import axios from 'axios'
import {parseCookies} from 'nookies'


export const getApiClient = (ctx?: any) => {
    const {'token-arkema' : token} = parseCookies(ctx)

    const axiosRequest = axios.create({
        baseURL: 'http://localhost:3333'
    })

    if(token){
        axiosRequest.defaults.headers.common['Authorization'] = `Bearer ${token}`
    }

    return axiosRequest
}

export const api = getApiClient()