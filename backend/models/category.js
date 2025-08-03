const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    catName:{
        type:String,
        required:true,
    },
    catImage:{
        type:String,
        required:true,
    },
    catDescription:{
       type:String,
    },
    catColor:{
        type:String,
    }
})

categorySchema.virtual('id').get(function(){
    return this._id.toHexString();
})

categorySchema.set('toJSON',{
    virtuals:true,
})
exports.Category = mongoose.model('Category',categorySchema);
exports.categorySchema=categorySchema;