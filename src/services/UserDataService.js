import axios from "axios";
import {baseurl} from './common-http.js'

export default {
    async createUser (data) {
          await axios({
            method: 'post',
            url: baseurl + 'users/add',
            headers: { 
              'Content-Type': 'application/json'
            },
            data : data
          })
    },

    async findUserByEmail(data) {
        return await axios.get(baseurl + 'users/' + data.email)
    },

    async findUserById(data) {
      return await axios.get(baseurl + 'users/' + data.userId + '/info')
    },

    async getReviewsByUserId(data) {
      return await axios.get(baseurl + 'users/' + data.userId + "/reviews")
    },

    async updateUserNumRatings(data) {
      return await axios.put(baseurl + 'users/' + data.email + '/reviews/update', {numReviews: data.numReviews})
    },

    async updateUserInfo(data) {
      return await axios.put(baseurl + 'users/input/change/userInfo', data)
    }
}