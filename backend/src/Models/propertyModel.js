import slugify from 'slugify';
import mongoose from 'mongoose';

const propertySchema = new mongoose.Schema({
    propertyName:{
        type:String,
        required:[true,"please enter your property name"]
    },
    description:{
        type:String,
        required:[true,"please add information about your property"]
    },

    extraInfo:{
        type:String,
        default:"checkin on time. good services."

    },
    propertyType:{
        type:String,
        enum:["House","Flat","Guest House","Hotel"],
        default:"House"
    },
    roomType:{
        type:String,
        enum:["Anytype","Room","Entire Home"],
        default:"Anytype"
    },

    maximumGuest:{
        type:Number,
        required:[true,"please give the maximum no of Guess that can occupy"]
    },

    amenities:[
        {
            name:{
                type:String,
                required:true,
                enum:[
                    "Wifi",
                    "kitchen",
                    "Ac",
                    "waching Machine",
                    "Tv",
                    "pool",
                    "Free parking"
                ]
            },
            icon:{
                type:String,
                required:true
            }
        }
    ],

    images:{
        type:[
            {
                public_id:{
                    type:String

                },
                url:{
                    type:String,
                    required:true
                }
            }
        ],
        validate:{
            validator:function(arr){
                return arr.length >=6
            },
            message:"The images must contain atleast 6 images"
        }
 },

    price:{
        type:Number,
        required:[true,"please enter the price per night value"],
        default:500
    },
    address:{
        area:String,
        city:String,
        state:String,
        pincode:Number
    },
    
    currentBookings:[

        {
            BookingId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:"Booking"
            },
            fromDate:{
                type:Date,
        },
        toDate:{
            type:Date,

        },

        userId:{
            type:mongoose.Schema.Types.ObjectId,
                ref:"User"
        }
    }

    ],

    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    },

    slug:String,
    checkInTime:{type:String,default:"11:00"},
    checkOutTime:{type:String,default:"13:00"}



})

propertySchema.pre("save",function(){
    this.slug=slugify(this.propertyName,{lower:true});

})

propertySchema.pre("save",function(){
    this.address.city=this.address.city.toLowerCase().replaceAll("","")
})
const Property =mongoose.models.Property|| mongoose.model("Property",propertySchema);
export{Property};