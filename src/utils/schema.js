import mongoose from "mongoose";

const image = new mongoose.Schema({
    imgUrl:{
        type:String,
required:true
    },
    width:{
        type:String,
        required:true
    },
    height:{
        type:String,
        required:true
    },
    croppedImageUrl:{
        type:String,
    },
    color:{
        type:String,
    },
    material:{
        type:String,
    },
    model:{
        type:String,
    },
    finish:{
        type:String,
    },Order: [{
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Order',
        required: false,
      }],
})

const imageSchema= mongoose.models?.image || mongoose.model("image",image)

export default imageSchema