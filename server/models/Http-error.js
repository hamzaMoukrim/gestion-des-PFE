class HttpError extends Error{

    constructor(msg,errorCode){
        super(msg)
        this.code=errorCode
    }
}
//cc

module.exports = HttpError;