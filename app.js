require('dotenv').config()
require("express-async-errors")
const PORT = process.env.PORT || 3000

// async error
const notFoundMiddleware = require("./middleware/not-found")
const errorMiddleware = require("./middleware/error-handler")

//

const express = require("express")
const app = express()
const productRouter = require("./routes/products")

const connectDB = require('./db/connect')
// midlleware
app.use(express.json())

// routes
app.get('/', (req,res)=>{
    res.send("API STORE")
})
//products routes // the home page
app.use('/api/v1/products', productRouter)
//
app.use(notFoundMiddleware)
app.use(errorMiddleware)

const start = async() => {
    try {
        // connect db
        await connectDB(process.env.MONGO_URI)
        app.listen(PORT, ()=>{
            console.log(`App is listening on port ${PORT}`)
        })
    } catch (error) {
        console.log(error)
    }
}
start()