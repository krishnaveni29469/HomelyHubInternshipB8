//which property??
//which use?
//which price
//dates
//quests
//paid

import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        Property:{
            type:mongoose.Schema.ObjectId,
            ref:"Property",
            required:[true,"Booking must belong to a property"]
        },

        user:{
            type: mongoose.Schema.ObjectId,
            ref:"User",
            required:[true,"Booking must belong to a User"]

        },
        price:{
            type:Number,
            required:[true,"Booking must have price"]
        },
        createAt:{
            type:Date,
            default:Date.now()
        },
        paid:{
            type:Boolean,
            default:true
        },
        fromDate:{
            type:Date,
        },
        toDate:{
            type:Date,

        },

        guests:{
            type:Number
        },
        NumberOfnights:{
            type:Number
        }
    },

    {timestamps:true}
);

bookingSchema.pre(/^find/, function(){
    this.populate("user");
    
        this.populate ({
        path:"Property",
        select:"maximumGuest images propertyName address "

    });

})

const Booking = mongoose.model("Booking",bookingSchema);

export {Booking};
