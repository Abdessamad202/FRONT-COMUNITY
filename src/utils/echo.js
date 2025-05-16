import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { getToken } from './localStorage';

window.Pusher = Pusher;

const echo = new Echo({
    broadcaster: 'pusher',
    key: 'fb4f78300444a170ad34',
    cluster: 'mt1',
    encrypted: true,
    authEndpoint: 'http://backend_comunity_app.test/broadcasting/auth',
    auth: {

        headers: {
            Authorization: `Bearer ${getToken() }`,
            Accept: 'application/json',
            "Content-Type": "application/json",
        }
    }
});
console.log("token", getToken());

export default echo;
