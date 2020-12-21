exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

exports.test = function (value, min, max) {

    if (Number.isNaN(value)) {

        return false
    }

    else if ((typeof min === 'undefined') && (typeof max === 'undefined')) {
        return true
    }

    else if ((typeof min !== 'undefined')) {

        if (typeof max !== 'undefined') {

            return value < min ? false : (value <= max ? true : false)

        }
        else { // max === 'undefined'

            return value < min ? false : true
        }

    }

    else { // min  === 'undefined'
        return value <= max ? true : false

    }
}


exports.findTopic = function (arr, topic) {

    return arr.findIndex(value => value.url === topic)

}