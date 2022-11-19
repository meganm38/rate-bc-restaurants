import axios from "axios";
import { baseurl } from './common-http.js'

export default {
    async getPhotosByReviewId(data) {
        return await axios.get(baseurl + 'reviews/' + data.reviewId + '/photos')
    },

    async postNewReview(data) {
        return await axios.post(baseurl + 'reviews/add', {
            content: data.content,
            starRating: data.starRating,
            date: data.date,
            userId: data.userId,
            businessId: data.businessId
        })
    },

    async createNewPhotoForReview(data) {
        return await axios.post(baseurl + 'reviews/' + data.reviewId + '/photos/add', {
            url: data.url,
            reviewId: data.reviewId
        })
    },

    async deleteReviewById(data) {
        return await axios.delete(baseurl + 'reviews/' + data.reviewId + '/delete')
    },

    async updateVotesByReviewId(data) {
        return await axios.put(baseurl + 'reviews/' + data.reviewId + '/update/votes', data)
    }
}