import { Router } from 'express'
import * as reviewController from '../app/controllers/reviewController.js'

const reviewRouter = (app) => {
    const router = Router()

    router.post('/add', reviewController.createReview)

    router.get('/:reviewId/photos', reviewController.getPhotosByReviewId)

    router.post('/:reviewId/photos/add', reviewController.createPhotoForReview)

    router.delete('/:reviewId/delete', reviewController.deleteReviewByID)

    router.put('/:reviewId/update/votes', reviewController.updateReviewVotes)

    app.use('/reviews', router)
}

export default reviewRouter;