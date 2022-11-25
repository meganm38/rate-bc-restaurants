import sequelize from '../models/index.js'
import { QueryTypes } from 'sequelize'

const createUser = async (req, res) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        hashedPassword: req.body.hashedPassword,
    }

    try {
        const data = await sequelize.query(
            'INSERT INTO "RateUser" ("firstName","lastName","email","hashedPassword")\
            VALUES (:firstName, :lastName, :email, :hashedPassword) RETURNING "userId";', {
                type: QueryTypes.INSERT,
                replacements: {
                    firstName: user.firstName,
                    lastName: user.lastName,
                    email: user.email,
                    hashedPassword: user.hashedPassword
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const findUserByEmail = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT * FROM "RateUser" WHERE "email" = :email', {
                type: QueryTypes.SELECT,
                replacements: {
                    email: req.params.email
                }
            })
        res.json(data[0])
    } catch (err) {
        res.status(404).send({
            message: err.message
        })
    }
}

const findUserById = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT * FROM "RateUser" WHERE "userId" = :userId', {
                type: QueryTypes.SELECT,
                replacements: {
                    userId: req.params.userId
                }
            })
        res.json(data[0])
    } catch (err) {
        res.status(404).send({
            message: err.message
        })
    }
}

const getAllUsers = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT * FROM "RateUser"', {
                type: QueryTypes.SELECT,
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const updateUserReview = async (req, res) => {
    try {
        const data = await sequelize.query(
            'UPDATE "RateUser" SET "numReviews" = :numReviews WHERE "email" = :email', {
                type: QueryTypes.UPDATE,
                replacements: {
                    email: req.params.email,
                    numReviews: req.body.numReviews,
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getReviewsByUserId = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT "reviewId", "content", "starRating", date, r."businessId", "businessName", city\
            FROM "Review" r, "Restaurant" re, "City" c\
            WHERE r."userId" = :userId AND r."businessId" = re."businessId" AND re."postalCode" = c."postalCode"', {
                replacements: {
                    userId: req.params.userId
                },
            })
        res.json(data[0])
    } catch (err) {
        res.status(404).send({
            message: err.message
        })
    }
}

const updateUserInfo = async (req, res) => {
    let query = 'UPDATE "RateUser" SET '
    req.body.attributes.forEach((attribute) => {
        query += attribute + ", "
    })
    query = query.slice(0, -2)
    query += ` WHERE "userId" = ${req.body.userId}`
    try {
        const data = await sequelize.query(
            query, {
                type: QueryTypes.UPDATE,
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export { createUser, 
         findUserByEmail, 
         getAllUsers, 
         getReviewsByUserId, 
         updateUserReview,
         findUserById,
         updateUserInfo
    }
