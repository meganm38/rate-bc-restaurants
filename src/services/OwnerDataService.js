import axios from "axios";
import {baseurl} from './common-http.js'

export default {
    async createOwner (data) {
        return  await axios.post(baseurl + '/owners/add', data)
    },

    async findOwnerByEmail(data) {
        return await axios.get(baseurl + 'owners/' + data.email)
    },

    async findOwnerById(data) {
      return await axios.get(baseurl + 'owners/' + data.userId + '/info')
    },

}