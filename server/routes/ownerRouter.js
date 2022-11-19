import { Router } from 'express'
import * as ownerController from '../app/controllers/ownerController.js'

const ownerRouter = (app) => {
    const router = Router()

    router.post("/add", ownerController.createOwner)

    router.get('/', ownerController.getAllOwners)

    router.get('/:email', ownerController.findOwnerByEmail)

    router.get('/:ownerId/info', ownerController.findOwnerById)

    app.use('/owners', router)
}

export default ownerRouter;