const mongoose = require("mongoose");

const internetPlanSchema = new mongoose.Schema({
    speed:{
        type:String,
        required:true
    },
    duration:{
        type:String,
        enum : ["Monthly", "Quarterly","Half-Yearly", "Yearly"],
        default: "Monthly",
        required:true
    },
    provider:{
        type:String,
        required:true
    },
    basePrice:{
        type:Number,
        required:true
    },
    installationFee:{
        type:Number,
        required:true,
        default: 0
    },
    discountPercent:{
        type:Number,
        default: 0
    },
    planType:{
      type: String,
      enum: ["internet","internet+ott","internet+tv","internet+tv+ott"],
      default: "internet"
    },
    ottTier:{
      type:String,
      default: "None"
    },
    ottList:{
       type: [String],
       default: []
    },
    ottCharge:{
      type:Number,
      default : 0
    },
    tvChannels:{
      type : String,
      default: "None"
    },
    tvCharge:{
      type:Number,
      default : 0
    },
    router:{
      type: String,
      default: "None"
    },
    androidBox:{
      type: Boolean,
      default: false
    },
    advancePayment:{
      type : Number,
      default: 0
    }
}, { timestamps: true });

module.exports= mongoose.model("InternetPlan", internetPlanSchema);
