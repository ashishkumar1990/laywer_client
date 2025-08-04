import {server as rest} from '../../rest';

const base = '/auth/';

// eslint-disable-next-line import/no-anonymous-default-export
export default {
    register: (data:any) => rest.post(base + "register", '',data),
    login: (data:any) => rest.post(base + "login", '',data),
    me: (id: string) => rest.get(base + "me", ''),
    logout: (id: string) => rest.get(base + "logout", '')
}