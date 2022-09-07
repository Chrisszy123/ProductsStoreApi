const Products = require("../models/product")

const getAllProductsStatic = async (req,res) => {
    // throw new Error("There was an error")
    const search = 'a'
    const product = await Products.find({price: {$gt: 30}})
    res.status(200).json({product, nbHits: product.lenght})
}
const getAllProducts = async (req,res) => {
    // destructure the req.query object 
    // req.query is an empty object, when you destructure and pass in variable, you create new properties with the var name
    const { featured, company, name, sort, fields, numericFilters } = req.query
    // create a new object to hold the values of the filtered items 
    const queryObject = {}

    if(featured) {
        //assign a value to the featured property of the new queryObject
        queryObject.featured = featured === "true" ? true : false
    }
    if(company) {
        queryObject.company = company
    }
    if(name){
        queryObject.name = {$regex: name, $options: 'i'}
    }

    let result =  Products.find(queryObject)

    if(sort){
        const sortList = sort.split(',').join(" ")
        result = result.sort(sortList)
    } else{
        // default sorting condition
        result = result.sort("createdAt")
    }
    if(fields){
        const fieldsList = fields.split(',').join(" ")
        result = result.select(fieldsList)
    }
    if(numericFilters){
        const operatorMap = {
            ">": "$gt",
            ">=": "$gte",
            "=": "$eq",
            "<": "$lt",
            "<=": "$lte",
        }
        const regEx = /\b(<|>|<=|>=|)\b/g
        let filters = numericFilters.replace(
            regEx, 
            (match) => `-${operatorMap[match]}-`
            )
            console.log(filters)
        const options = ['price', 'rating']
        filters = filters.split(",").forEach( item => {
            const [field, operator, value] = item.split("-")
            if(options.includes(field)){
                queryObject[field] = {[operator]: Number(value)}
            }
        });
    }
    const page = Number(req.query.page) || 1
    const limit = Number(req.query.limit) || 10
    const skip = (page - 1) * limit
    
    result = result.skip(skip).limit(limit)

    const product = await result
    res.status(200).json({product, nbHits: product.lenght})
}

module.exports = {
    getAllProductsStatic,
    getAllProducts
}