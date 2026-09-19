//property details
//create a slice name
//Request starts
//property data received
//error occurs
//export Actions
//export slice

import { createSlice } from "@reduxjs/toolkit";
//import { Loader } from "lucide-react";
//import { getProperties } from "../../../../backend/src/controllers/propertyController";

const propertDetailsSlice = createSlice ({
    name:"propertyDetails",
    initialState:{
        propertydetails:null,
        loading:false,
        console:null
        
    },
    reducers:{
        getListRequest(state){
            state.loading=true
        },
        getPropertyDetails(state,action){
            state.propertydetails = action.payload;
            state.loading=false
        },
        getErrors(state,action){
            state.error = action.payload;
            state.loading=false
        }
    }
})

export const propertyDetailsAction = propertDetailsSlice.actions
export default propertDetailsSlice;