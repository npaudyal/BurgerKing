import axios from 'axios'


const instance = axios.create({
    baseURL: 'https://react-my-burger-8859a.firebaseio.com/'
})

export default instance