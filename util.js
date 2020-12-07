exports.sleep = (ms) => new Promise(resolve => setTimeout(resolve, ms))

exports.test = function (value, min, max) {

    if ((typeof min === 'undefined') && (typeof max === 'undefined')) {
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