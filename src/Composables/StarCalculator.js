const formatAsPercentage = x => `${Math.round(x * 100)}%`

const getStar = (totalStars, numReviews) => {
    return formatAsPercentage(totalStars / numReviews / 5 )
}

export default getStar