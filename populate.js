require("dotenv").config()

const connectDB = require('./db/connect')

const product = require('./models/product')

const jsonProducts = require("./products.json")

const start = async ()=> {
    try{
        await connectDB(process.env.MONGO_URI)
        await product.deleteMany()
        await product.create(jsonProducts)
        console.log("Done....")
        process.exit(0)
    }catch(err){
        console.log(err)
        process.exit(1)
    }
}
start()