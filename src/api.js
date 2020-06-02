import {default as axios} from 'axios';

export default axios.create({
    baseURL: 'https://testerbackend.herokuapp.com',
});