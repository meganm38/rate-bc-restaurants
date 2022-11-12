import { Router } from 'express'
import * as restaurantController from '../app/controllers/restaurantController.js'

const restaurantRouter = (app) => {
    const router = Router()

    router.get('/', restaurantController.getAllRestaurants)

    router.get('/:businessId/types', restaurantController.getRestaurantTypes)

    router.get('/:businessId', restaurantController.getRestaurantById)

    router.get('/:businessId/payments', restaurantController.getRestaurantPaymentsById)

    router.get('/:businessId/reviews', restaurantController.getRestaurantReviewsById)

    router.get('/find/:name', restaurantController.getRestaurantByName)

    router.put('/:businessId/reviews/update', restaurantController.updateReviewInfo)

    router.get('/find/type/:typeName', restaurantController.getAllRestaurantsByType)

    router.get('/find/byRating/highest', restaurantController.highestRateByType)

    router.get('/find/byRating/lowest', restaurantController.lowestRateByType)

    router.get('/find/byRating/highest/:name', restaurantController.highestRateByTypeWithName)

    router.get('/find/paymentoptions/acceptedall', restaurantController.getRestaurantsAcceptedAllPayment)

    router.get('/find/paymentoptions/acceptedall/:name', restaurantController.getRestaurantsAcceptedAllPaymentWithName)

    router.get('/find/byNumReviews/highestRated', restaurantController.getHighestWithEnoughReviews)

    router.get('/find/byNumReviews/highestRated/:name', restaurantController.getHighestWithEnoughReviewsWithName)

    router.get('/find/favorite/type', restaurantController.getFavoriteTypesOfRestaurants)

    router.get('/find/favorite/type/:name', restaurantController.getFavoriteTypesOfRestaurantsWithName)

    app.use('/restaurants', router)
}

export default restaurantRouter;