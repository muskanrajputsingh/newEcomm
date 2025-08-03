const express = require('express');
const router = express.Router();
const {Category} = require('../models/category');

router.get('/category', async (req, res) => {
    try {
        const getAll = req.query.all === "true";

        if (getAll) {
            const categoryList = await Category.find();
            return res.status(200).json({ success: true, categoryList, totalCategories: categoryList.length });
        }

        const page = parseInt(req.query.page) || 1;
        const perPage = 4;
        const totalPosts = await Category.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        const categoryList = await Category.find()
            .skip((page - 1) * perPage)
            .limit(perPage)
            .exec();

        return res.status(200).json({
            success: true,
            categoryList,
            totalPages,
            page
        });
    } catch (error) {
        console.error("Error in fetching category data:", error.message);
        return res.status(500).json({ success: false, message: error.message });
    }
});


router.post("/category", async (req, res) => {
    const p = new Category({
        catName : req.body.catName,
        catImage : req.body.catImage,
        catDescription:req.body.catDescription,
        catColor:req.body.catColor
        })
    await p.save();
    res.send(p);
})

router.get('/category/:id',async(req,res)=>{
    const category = await Category.findById(req.params.id);

    if(!category){
       res.status(500).json({message:'The category with the given id was not found'})
    }
    return res.status(200).send(category);
})

router.delete('/category/:id',async(req,res)=>{
    const deletedUser = await Category.findByIdAndDelete(req.params.id);

    if(!deletedUser){
        res.status(404).json({
            message:'Category not found!',
            success:false
        })
    }

    res.status(200).json({
    success:true,
    message:'Category Deleted!'
   })
})

 router.put('/category/:id',async(req,res)=>{
    const category = await Category.findByIdAndUpdate(req.params.id,
        {
            catName : req.body.catName,
            catImage : req.body.catImage,
            catDescription:req.body.catDescription,
            catColor:req.body.catColor
        },
        {new:true}
    )
    if(!category){
        return res.status(500).json({
            message:'Category cannot be updated',
            success:false
        })
    }
    res.send(category);
 })



module.exports = router;