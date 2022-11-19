import { Router } from 'express'
import * as reservationController from '../app/controllers/reservationController.js'

const reservationRouter = (app) => {
    const router = Router()

    router.post("/add", reservationController.createReservation)

    router.get('/:businessId/freetables/:date/:time', reservationController.getFreeTable)

    app.use('/reservations', router)
}

export default reservationRouter;