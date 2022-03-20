const express = require('express')
const res = require('express/lib/response')
const app = express()
const path = require('path')
const mongoose = require('mongoose')
const methodOverride = require('method-override')
app.use(methodOverride('_method'))


const Product = require('./models/product')

mongoose.connect('mongodb://127.0.0.1:27017/farm4', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => {
        console.log("MONGO CONNECTION OPEN!!!")
    })
    .catch(err => {
        console.log("OH NO MONGO CONNECTION ERROR!!!!")
        console.log(err)
    })




app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: true }));


app.listen(3000, ()=>{
    console.log("APP is listening on port 3000")
})

app.get("/products/new", async (req, res)=>{
res.render("products/new")
    // res.send(`new product`)
})

app.post("/products", async (req, res)=>{
    const newProduct = new Product(req.body)
    await newProduct.save()
    res.redirect(`/products/${newProduct._id}`)
})

app.get("/products", async (req, res)=>{
    const products = await Product.find({})
    res.render("products/index", {products})
    // res.send(`all products ${products}`)
})

app.get("/products/:id", async(req, res)=>{
   const {id} = req.params
const product = await Product.findById(id)
res.render("products/show", {product})
// res.send(`the selected item is: ${product.name}`)
})

app.put("/products/:id", async(req, res)=>{
    const {id} = req.params
 const product = await Product.findByIdAndUpdate(id, req.body, {runValidators:true, new:true})
res.redirect("/products")
 // res.send(`the selected item is: ${product.name}`)
 })
 

 app.delete("/products/:id", async(req, res)=>{
    const {id} = req.params
 const product = await Product.findByIdAndDelete(id)
res.redirect("/products")
 // res.send(`the selected item is: ${product.name}`)
 })

app.get("/products/:id/edit", async(req, res)=>{
    const {id} = req.params
 const product = await Product.findByIdAndUpdate(id)
 res.render("products/edit", {product})
 // res.send(`the selected item is: ${product.name}`)
 })