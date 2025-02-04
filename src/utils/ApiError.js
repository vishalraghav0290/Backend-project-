class ApiError extends Error{
    constructor(
        statusCode,
        message= "something went wrong",
        errors =[],
        statck =""
    ){
        super(message)// super is keyword use to overwrite the thing in class constructor
        this.statusCode= statusCode
        this.data= null // to do what data fields of error class holds can go with documention
        this.message=message
        this.success = false
        this.errors= errors
        if(statck){
            this.statck =statck
        }else{
            Error.captureStackTrace(this , this.constructor)
        }

    }
}

export { ApiError};