import {server as rest} from "../../rest";
const base = './workTracker';

export default {
    list: () => rest.get(base+"/" , ''),
    getCount: () => rest.get(base + "/count", ''),
    create: (data:any) => rest.post(base + "/", '',data),
    get: (id: string) => rest.get(base + "/{{id}}", {id}),
    update: (id: string,data:any) => rest.put(base + "/{{id}}", {id},data),
    delete: (id: string) => rest.del(base + "/{{id}}", {id})
}
