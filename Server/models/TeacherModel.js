const mongoose=require("mongoose")

const TeacherSchema =mongoose.Schema({
    name: {
      type: String,
      required: true
    },
    email:{
      type:String,
      required:true,
      unique: true },

    verified: {
      type: Boolean,
      default: false
    },
    password: {
      type: String,
      required: true
    },
    attachments: {
      type: [String],
      required: true
    },
    subjects: {type:[String], required:true},
    qualification: {type:String, required:true},

    availability: [ 
      {
        day: String,
        startTime: String,
        endTime: String
      }
    ],
    banned: {
      type: Boolean,
      default: false
    },
    hourlyRate: {
        type: Number,
        required: true
      },
  });

  const TeacherModel=mongoose.model("Teacher",TeacherSchema)
  module.exports={TeacherModel}
