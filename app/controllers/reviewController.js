import sequelize from '../models/index.js'
import { QueryTypes } from 'sequelize'

const createReview = async (req, res) => {
    const review = {
        content: req.body.content,
        starRating: req.body.starRating,
        date: req.body.date,
        userId: req.body.userId,
        businessId: req.body.businessId,
    }

    try {
        const data = await sequelize.query(
            'INSERT INTO "Review" (content,"starRating", date,"userId", "businessId")\
            VALUES (:content, :starRating, :date, :userId, :businessId) RETURNING "reviewId";', {
                type:  QueryTypes.INSERT,
                replacements: {
                    content: review.content,
                    starRating: review.starRating,
                    date: review.date,
                    userId: review.userId,
                    businessId: review.businessId
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const createPhotoForReview = async (req, res) => {
    try {
        const data = await sequelize.query(
            'INSERT INTO "Photo" (url, "reviewId")\
            VALUES (:url, :reviewId);', {
                type:  QueryTypes.INSERT,
                replacements: {
                    url: req.body.url,
                    reviewId: req.body.reviewId
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const getPhotosByReviewId = async (req, res) => {
    try {
        const data = await sequelize.query(
            'SELECT DISTINCT "photoId", url, caption\
            FROM "Photo" p\
            WHERE p."reviewId" = :reviewId', {
                type: QueryTypes.SELECT,
                replacements: {
                    reviewId: req.params.reviewId
                }
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const deleteReviewByID = async (req, res) => {
    try {
        const data = await sequelize.query(
            'DELETE FROM "Review" re\
            WHERE re."reviewId" = :reviewId', {
                replacements: {
                    reviewId: req.params.reviewId
                },
                type: QueryTypes.DELETE
            })
        res.send(data)
    } catch (err) {
        res.status(500).send({
            message: err.message
        })
    }
}

const updateReviewVotes = async (req, res) => {
    try {
        const data = await sequelize.query(
            'UPDATE "Review"\
            SET "funnyVotes" = :funnyVotes, "usefulVotes" = :usefulVotes, "coolVotes" = :coolVotes\
            WHERE "reviewId" = :reviewId', {
                replacements: {
                    reviewId: req.params.reviewId,
                    funnyVotes: req.body.funnyVotes,
                    usefulVotes: req.body.usefulVotes,
                    coolVotes: req.body.coolVotes
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

export {
    getPhotosByReviewId,
    createReview,
    createPhotoForReview,
    deleteReviewByID,
    updateReviewVotes
}