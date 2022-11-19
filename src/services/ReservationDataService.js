import axios from "axios";
import { baseurl } from './common-http.js'

export default {
    async findTables(data) {
        return await axios.get(baseurl + `reservations/${data.businessId}/freetables/${data.date}/${data.time}`)
    },

    async createNewReservation(data) {
        await axios.post(baseurl + 'reservations/add', data)
    }
}