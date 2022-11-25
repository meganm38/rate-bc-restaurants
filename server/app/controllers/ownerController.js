import sequelize from '../models/index.js'
import { QueryTypes } from 'sequelize'

const createOwner = async (req, res) => {
    const user = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        email: req.body.email,
        hashedPassword: req.body.hashedPassword,
    }

    try {
        const data = await sequelize.query(
            'INSERT INTO "BusinessOwner" ("firstName","lastName","email","hashedPassword")\
            VALUES (:firstName, :lastName, :email, :hashedPassword) RETURNING "ownerId"', {
                type:  QueryTypes.INSERT,
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

const findOwnerByEmail = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT * FROM "BusinessOwner" WHERE "email" = :email', {
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

const findOwnerById = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT * FROM "BusinessOwner" WHERE "ownerId" = :ownerId', {
                type: QueryTypes.SELECT,
                replacements: {
                    ownerId: req.params.ownerId
                }
            })
        res.json(data[0])
    } catch (err) {
        res.status(404).send({
            message: err.message
        })
    }
}

const getAllOwners = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT * FROM "BusinessOwner"', {
                type: QueryTypes.SELECT,
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getUserSelection = async (req, res) => {
    let query = 'SELECT DISTINCT '
    req.query.attributes.forEach((attribute) => {
        query += attribute + ", "
    })
    query = query.slice(0, -2)
    query += ` FROM ${req.query.table}`
    query += ` WHERE "businessId" = ${req.query.businessId}`

    try {
        const data = await sequelize.query(
            query, {
            type: QueryTypes.SELECT,
      })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}



const getRestaurantByOwnerId = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT *\
            FROM "Restaurant" r, "City" c, "BusinessWebsite" bw\
            WHERE c."postalCode" = r."postalCode"\
            AND bw."businessName" = r."businessName"\
            AND r."ownerId" = :ownerId', {
                type: QueryTypes.SELECT,
                replacements: {
                    ownerId: req.params.ownerId
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getFreeSearch = async (req, res) => {
    let query = 'SELECT DISTINCT *'
    query += ` FROM ${req.query.table}`
    query += 'WHERE '
    req.query.selections.forEach((selection) => {
        query += selection + " AND "
    })
    query = query.slice(0, -5)
    try {
        const data = await sequelize.query(
            query, {
            type: QueryTypes.SELECT,
      })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}



export { createOwner, 
    findOwnerByEmail,
    findOwnerById,
    getAllOwners,
    getUserSelection,
    getRestaurantByOwnerId,
    getFreeSearch
    }
