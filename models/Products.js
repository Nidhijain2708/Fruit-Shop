const mongoose=require('mongoose');
const {Schema}=mongoose;

const productSchema=new Schema({
    name: {
        type: String
    },
    price: {
        type: Number
    },
    description: {
        type: String
    },
    imageUrl: {
        type: String
    },
    userId: {
        type: Schema.Types.ObjectId,
        ref: 'Users'
    }
});

module.exports=mongoose.model('Product',productSchema);