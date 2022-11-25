import { Router } from 'express'
import * as userController from '../app/controllers/userController.js'

const userRouter = (app) => {
    const router = Router()

    router.post("/add", userController.createUser)

    router.get('/', userController.getAllUsers)

    router.get('/:email', userController.findUserByEmail)

    router.get('/:userId/info', userController.findUserById)

    router.put('/:email/reviews/update', userController.updateUserReview)

    router.get('/:userId/reviews', userController.getReviewsByUserId)

    router.put('/input/change/userInfo', userController.updateUserInfo)

    app.use('/users', router)
}

export default userRouter;