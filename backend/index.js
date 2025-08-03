const express = require('express');
const cors = require('cors');
require('dotenv/config');
require('./conn/db');

const categoryRoute = require('./routers/category');
const productRoute = require('./routers/product');
const subCategoryRoute = require('./routers/subCategory');
const cartRoute = require("./routers/cart")

const PORT = process.env.PORT || 14000;

const app = express();

app.use(express.json());
app.use(cors());

app.use('/api',categoryRoute);
app.use('/api',productRoute);
app.use('/api',subCategoryRoute);
app.use('/api/cart',cartRoute);

app.listen(PORT,()=>{
    console.log(`server running at PORT ${PORT} `)
})