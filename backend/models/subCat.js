const mongoose = require('mongoose');

const subCatSchema = new mongoose.Schema({
    category: {
        type: mongoose.Schema.Types.ObjectId,  //  Must be ObjectId
        ref: 'Category',  //  Reference to the 'Category' collection
        required: true
    },
    subCat: {
        type: String,
        required: true
    },
    description:{
        type:String,
    }
});
subCatSchema.virtual('id').get(function(){
    return this._id.toHexString();
})

subCatSchema.set('toJSON',{
    virtuals:true,
})

exports.subCategory = mongoose.model('subCategory', subCatSchema);
exports.subCatSchema=subCatSchema;

