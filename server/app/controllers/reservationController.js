import sequelize from '../models/index.js'
import { QueryTypes } from 'sequelize'

const createReservation = async (req, res) => {
    const reservation = {
        date: req.body.date,
        time: req.body.time,
        numPeople: req.body.numPeople,
        userId: req.body.userId,
        tableId: req.body.tableId,
        businessId: req.body.businessId
    }

    try {
        const data = await sequelize.query(
            'INSERT INTO "Reservation" ("date", "time", "numPeople", "userId", "tableId", "businessId")\
            VALUES (:date, :time, :numPeople, :userId, :tableId, :businessId);', {
                type: QueryTypes.INSERT,
                replacements: {
                    date: reservation.date,
                    time: reservation.time,
                    numPeople: reservation.numPeople,
                    userId: reservation.userId,
                    tableId: reservation.tableId,
                    businessId: reservation.businessId
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getFreeTable = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT rt."tableId"\
            FROM "RestaurantTable" rt\
            WHERE rt."businessId" = :businessId\
            EXCEPT \
            SELECT DISTINCT rt."tableId"\
            FROM "Reservation" re, "RestaurantTable" rt\
            WHERE re."tableId" = rt."tableId" AND re."date" = :date AND re."time" = :time\
            AND rt."businessId" = :businessId AND rt."businessId" = re."businessId"', {
                replacements: {
                    date: req.params.date,
                    time: req.params.time,
                    businessId: req.params.businessId
                },
                type: QueryTypes.SELECT
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

export {createReservation,
        getFreeTable}