import sequelize from '../models/index.js'
import { QueryTypes } from 'sequelize'

const getAllRestaurants = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT "businessId", "businessName", stars, "numReviews" FROM "Restaurant" r\
            ORDER BY "businessId"', {
                type: QueryTypes.SELECT,
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

//by name
const getRestaurantByName = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT * FROM "Restaurant" r, "City" c, "BusinessWebsite" bw\
             WHERE c."postalCode" = r."postalCode" AND bw."businessName" = r."businessName" AND strpos(lower(r."businessName"), :name) > 0', {
                replacements: {
                    name: req.params.name.toLowerCase()
                },
                type: QueryTypes.SELECT
            }
        )
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

//by Id
const getRestaurantTypes = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT "typeName" FROM "Type" t, "RestaurantType" rt\
            WHERE rt."businessId" = :businessId AND rt."typeId" = t."typeId"', {
                type: QueryTypes.SELECT,
                replacements: {
                    businessId: req.params.businessId
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getRestaurantById = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT *\
            FROM "Restaurant" r, "City" c, "BusinessWebsite" bw\
            WHERE c."postalCode" = r."postalCode"\
            AND bw."businessName" = r."businessName"\
            AND r."businessId" = :businessId', {
                type: QueryTypes.SELECT,
                replacements: {
                    businessId: req.params.businessId
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getRestaurantPaymentsById = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT "optionName"\
            FROM "AcceptedPayment" ap, "PaymentOption" po\
            WHERE ap."businessId" = :businessId\
            AND ap."optionId" = po."optionId"', {
                type: QueryTypes.SELECT,
                replacements: {
                    businessId: req.params.businessId
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getRestaurantReviewsById = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT "firstName", "lastName", r."userId", "content", "starRating", r."reviewId",\
            "funnyVotes", "usefulVotes", "coolVotes", date\
            FROM "Review" r, "RateUser" ru\
            WHERE r."businessId" = :businessId\
            AND r."userId" = ru."userId"', {
                type: QueryTypes.SELECT,
                replacements: {
                    businessId: req.params.businessId
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const updateReviewInfo = async (req, res) => {
    try {
        const data = await sequelize.query(
            'UPDATE "Restaurant" SET "numReviews" = :numReviews, "stars" = :stars  WHERE "businessId" = :businessId', {
                replacements: {
                    businessId: req.params.businessId,
                    numReviews: req.body.numReviews,
                    stars: req.body.stars
                },
                type: QueryTypes.UPDATE
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    } 
}

const getAllRestaurantsByType = async (req, res) => {
    try {
        const data = await sequelize.query( 
        'SELECT DISTINCT r."businessId", r."businessName", r."address", r."postalCode", r."stars", r."numReviews", r."ownerId", c."city", bw."website" \
        FROM "Restaurant" r, "City" c, "BusinessWebsite" bw, "RestaurantType" rt, "Type" t\
        WHERE r."businessId" = rt."businessId" AND rt."typeId" = t."typeId"\
        AND c."postalCode" = r."postalCode" AND bw."businessName" = r."businessName"\
        AND t."typeName" = :typeName', {
            replacements: {
                typeName: req.params.typeName
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

const highestRateByType = async (req, res) => {
    try {
        const data = await sequelize.query( 
      'SELECT DISTINCT *\
      FROM "Restaurant" rs INNER JOIN "RestaurantType" rts ON rs."businessId" = rts."businessId"\
      INNER JOIN (SELECT MAX(r."stars") AS "stars", t."typeId"\
      FROM "Restaurant" r, "RestaurantType" rt, "Type" t\
      WHERE r."businessId" = rt."businessId" AND rt."typeId" = t."typeId"\
      GROUP BY t."typeId") ts ON ts."stars" = rs."stars" AND ts."typeId" = rts."typeId"', {
            type: QueryTypes.SELECT
        })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const highestRateByTypeWithName = async (req, res) => {
    try {
        const data = await sequelize.query( 
      'SELECT DISTINCT *\
      FROM "Restaurant" rs INNER JOIN "RestaurantType" rts ON rs."businessId" = rts."businessId"\
      INNER JOIN (SELECT MAX(r."stars") AS "stars", t."typeId"\
      FROM "Restaurant" r, "RestaurantType" rt, "Type" t\
      WHERE r."businessId" = rt."businessId" AND rt."typeId" = t."typeId" AND strpos(lower(r."businessName"), :name) > 0\
      GROUP BY t."typeId") ts ON ts."stars" = rs."stars" AND ts."typeId" = rts."typeId"', {
            type: QueryTypes.SELECT,
            replacements: {
                name: req.params.name.toLowerCase()
            }
        })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const lowestRateByType = async (req, res) => {
    try {
        const data = await sequelize.query( 
            'SELECT DISTINCT *\
            FROM "Restaurant" rs INNER JOIN "RestaurantType" rts ON rs."businessId" = rts."businessId"\
            INNER JOIN (SELECT MIN(r."stars") AS "stars", t."typeId"\
            FROM "Restaurant" r, "RestaurantType" rt, "Type" t\
            WHERE r."businessId" = rt."businessId" AND rt."typeId" = t."typeId"\
            GROUP BY t."typeId") ts ON ts."stars" = rs."stars" AND ts."typeId" = rts."typeId"', {
            type: QueryTypes.SELECT
        })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getHighestWithEnoughReviews = async (req, res) => {
    try {
        const data = await sequelize.query( 
      'SELECT DISTINCT *\
      FROM "Restaurant" rs INNER JOIN "RestaurantType" rts ON rs."businessId" = rts."businessId"\
      INNER JOIN (SELECT MAX(r."stars") AS "stars", t."typeId"\
      FROM "Restaurant" r, "RestaurantType" rt, "Type" t\
      WHERE r."businessId" = rt."businessId" AND rt."typeId" = t."typeId"\
      GROUP BY t."typeId" HAVING sum("numReviews") > 4) ts ON ts."stars" = rs."stars" AND ts."typeId" = rts."typeId"', {
            type: QueryTypes.SELECT, 
        })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getHighestWithEnoughReviewsWithName = async (req, res) => {
    try {
        const data = await sequelize.query( 
      'SELECT DISTINCT *\
      FROM "Restaurant" rs INNER JOIN "RestaurantType" rts ON rs."businessId" = rts."businessId"\
      INNER JOIN (SELECT MAX(r."stars") AS "stars", t."typeId"\
      FROM "Restaurant" r, "RestaurantType" rt, "Type" t\
      WHERE r."businessId" = rt."businessId" AND rt."typeId" = t."typeId" AND strpos(lower(r."businessName"), :name) > 0\
      GROUP BY t."typeId" HAVING sum("numReviews") > 4) ts ON ts."stars" = rs."stars" AND ts."typeId" = rts."typeId"', {
            type: QueryTypes.SELECT, 
            replacements: {
                name: req.params.name.toLowerCase()
            }
        })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getRestaurantsAcceptedAllPayment = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT *\
            FROM "Restaurant" rs\
            WHERE NOT EXISTS \
            (SELECT po."optionId"\
             FROM "PaymentOption" po\
             EXCEPT\
             (SELECT ap."optionId"\
             FROM "AcceptedPayment" ap\
             WHERE ap."businessId" = rs."businessId"))', {
            type: QueryTypes.SELECT
      })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getRestaurantsAcceptedAllPaymentWithName = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT *\
            FROM "Restaurant" rrr\
            JOIN (SELECT DISTINCT rs."businessId"\
            FROM "Restaurant" rs\
            WHERE NOT EXISTS \
            (SELECT po."optionId"\
             FROM "PaymentOption" po\
             EXCEPT\
             (SELECT ap."optionId"\
             FROM "AcceptedPayment" ap\
             WHERE ap."businessId" = rs."businessId"))) ht ON ht."businessId" = rrr."businessId"\
             WHERE strpos(lower(rrr."businessName"), :name) > 0', {
            replacements: {
                    name: req.params.name.toLowerCase()
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

const getFavoriteTypesOfRestaurants = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT *\
            FROM "Restaurant" rss INNER JOIN "RestaurantType" rtss ON rss."businessId" = rtss."businessId"\
            INNER JOIN (SELECT ts."typeId"\
            FROM "Restaurant" rs, "RestaurantType" rts, "Type" ts\
            WHERE rs."businessId" = rts."businessId" AND rts."typeId" = ts."typeId"\
            GROUP BY ts."typeId"\
            HAVING AVG(rs."stars") >= ALL(SELECT AVG(r."stars") AS "average stars"\
            FROM "Restaurant" r, "RestaurantType" rt, "Type" t\
            WHERE r."businessId" = rt."businessId" AND rt."typeId" = t."typeId"\
            GROUP BY t."typeId")) na ON na."typeId" = rtss."typeId"', {
            type: QueryTypes.SELECT
      })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getFavoriteTypesOfRestaurantsWithName = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT *\
            FROM "Restaurant" rss INNER JOIN "RestaurantType" rtss ON rss."businessId" = rtss."businessId"\
            INNER JOIN (SELECT ts."typeId"\
            FROM "Restaurant" rs, "RestaurantType" rts, "Type" ts\
            WHERE rs."businessId" = rts."businessId" AND rts."typeId" = ts."typeId"\
            GROUP BY ts."typeId"\
            HAVING AVG(rs."stars") >= ALL(SELECT AVG(r."stars") AS "average stars"\
            FROM "Restaurant" r, "RestaurantType" rt, "Type" t\
            WHERE r."businessId" = rt."businessId" AND rt."typeId" = t."typeId"\
            GROUP BY t."typeId")) na ON na."typeId" = rtss."typeId" AND strpos(lower(rss."businessName"), :name) > 0', {
            type: QueryTypes.SELECT,
            replacements: {
                name: req.params.name.toLowerCase()
            } 
      })
    res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}


export { getAllRestaurants, 
        getRestaurantTypes, 
        getRestaurantById, 
        getRestaurantPaymentsById,
        getRestaurantReviewsById,
        getRestaurantByName,
        updateReviewInfo,
        getAllRestaurantsByType,
        highestRateByType,
        lowestRateByType,
        getRestaurantsAcceptedAllPayment,
        highestRateByTypeWithName,
        getHighestWithEnoughReviews,
        getHighestWithEnoughReviewsWithName,
        getRestaurantsAcceptedAllPaymentWithName,
        getFavoriteTypesOfRestaurants,
        getFavoriteTypesOfRestaurantsWithName
        }