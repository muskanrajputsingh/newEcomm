const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
  name:{
    type:String,
    required:true
  },
  description:{
    type:String,
    required:true
  },
  images:[
    {
    type:String,
    required:true
    }
],
  brand:{
    type:String,
    default:''
  },
  price:{
    type:Number,
    default:0
  },
  oldPrice:{
    type:Number,
    default:0
  },
  catName:{
    type:String,
    default:''
  },
  subCatName:{
    type:String,
    default:''
  },
  category:{
    type:mongoose.Schema.Types.ObjectId,
    ref:'Category',
    required:true
  },
  subCat: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'subCategory',  
    required: true
},
  countInStock:{
    type:String,
    required:true
  },
  rating:{
    type:Number,
    default:0,
  },
  isFeatured:{
    type:Boolean,
    default:false,
  },
  isTrendy:{
    type:Boolean,
    default:false,
  },
  size:{
    type:String,
  },
  color:{
    type:String,
    required:true
  },
  discount:{
    type:Number,
    default:0
  },
  dateCreated:{
    type:Date,
    default:Date.now
  }

});

exports.Product = mongoose.model('Product',productSchema);
