import axios from "axios";
import { baseurl } from './common-http.js'

export default {
    async getAllRestaurants() {
        return await axios.get(baseurl + 'restaurants/')
    },

    async getRestaurantInfoById(data) {
        return await axios.get(baseurl + 'restaurants/' + data.businessId)
    },

    async getRestaurantTypesById(data) {
        return await axios.get(baseurl + 'restaurants/' + data.businessId + '/types')
    },

    async getRestaruantPaymentsById(data) {
        return await axios.get(baseurl + 'restaurants/' + data.businessId + '/payments')
    },

    async getRestaurantReviewsById(data) {
        return await axios.get(baseurl + 'restaurants/' + data.businessId + '/reviews')
    },

    async updateRestaurantReviewInfo(data) {
        return await axios.put(baseurl + 'restaurants/' + data.businessId + '/reviews/update', data)
    },

    async getResturantsByName(data) {
        return await axios.get(baseurl + 'restaurants/find/' + data.name)
    },

    async getRestaurantsByType(data) {
        return await axios.get(baseurl + 'restaurants/find/type/' + data.typeName)
    },

    async getHighestRatedPerTpye() {
        return await axios.get(baseurl + 'restaurants/find/byRating/highest')
    },

    async getLowestRatedPerTpye() {
        return await axios.get(baseurl + 'restaurants/find/byRating/lowest')
    },

    async getHighestRatedPerTpyeWithName(data) {
        return axios.get(baseurl  + 'restaurants/find/byRating/highest/' + data.name)
    },

    async getAllPaymentsAccepted() {
        return axios.get(baseurl + 'restaurants/find/paymentoptions/acceptedall')
    },

    async getAllPaymentsAcceptedWithName(data) {
        return axios.get(baseurl + 'restaurants/find/paymentoptions/acceptedall/' + data.name)
    },

    async getHighestRatedWithEnoughReviews() {
        return axios.get(baseurl + 'restaurants/find/byNumReviews/highestRated')
    },

    async getHighestRatedWithEnoughReviewsWithName(data) {
        return axios.get(baseurl + 'restaurants/find/byNumReviews/highestRated/' + data.name)
    },

    async getPopular() {
        return axios.get(baseurl + 'restaurants/find/favorite/type')
    },

    async getPopularWithName(data) {
        return axios.get(baseurl + 'restaurants/find/favorite/type/' + data.name)
    },

    async createNewRestaurant(data) {
        return axios.post(baseurl + 'restaurants/add', data)
    },

    async createRestaurantType(data) {
        return axios.post(baseurl + 'restaurants/' + data.businessId + '/addType', data)
    }
}