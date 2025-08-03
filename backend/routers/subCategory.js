const express = require('express');
const router = express.Router();
const {subCategory} = require('../models/subCat');

// router.get('/subcategory', async (req, res) => {
//     const subCategoryList = await subCategory.find().populate('category'); 

//     if (!subCategoryList) {
//         return res.status(500).json({ success: false });
//     }
//     res.send(subCategoryList);
// });


router.get('/subcategory', async (req, res) => {
    try {
        const getAll = req.query.all === "true"; // If ?all=true, fetch all

        if (getAll) {
            const subCategoryList = await subCategory.find().populate("category");
            return res.status(200).json({ success: true, subCategoryList, totalCategories: subCategoryList.length });
        }

        // Pagination logic
        const page = parseInt(req.query.page) || 1;
        const perPage = 5;
        const totalPosts = await subCategory.countDocuments();
        const totalPages = Math.ceil(totalPosts / perPage);

        if (page > totalPages) {
            return res.status(404).json({ message: "Page not found" });
        }

        const subCategoryList = await subCategory.find().populate("category")
        .skip((page - 1) * perPage)
        .limit(perPage)
        .exec();


        return res.status(200).json({
            success: true,
            subCategoryList,
            totalPages,
            page
        });
    } catch (error) {
        console.log("Error in fetching category data:", error);
        return res.status(500).json({ success: false, message: "Server error" });
    }
});


router.get("/subcategory/:id", async (req, res) => {
    const subCat = await subCategory.findById(req.params.id).populate("category");
    if(!subCat){
        res.status(500).json({message:'The category with given id is not found'})
    }
    return res.status(200).send(subCat);
});

router.put("/subcategory/:id", async (req, res) => {
    const id = req.params.id;
    const data = req.body;
    const p = await subCategory.updateOne({ "_id": id }, data);
    res.send(p);
})


router.delete("/subcategory/:id", async (req, res) => {
    const id = req.params.id;
    const p = await subCategory.findOne({ "_id": id })
    const d = await subCategory.deleteOne(p)
    res.send(d);
})
router.post("/subcategory", async (req, res) => {
    const p = new subCategory({
        category : req.body.category,
        subCat: req.body.subCat,
        description: req.body.description
        })
    await p.save();
    res.send(p);
})

module.exports=router;
