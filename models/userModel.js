const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    username: String,
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: false,
      match: [/^\S+@\S+\.\S+$/, "Please enter a valid email address"],
    },
    password: { type: String, require: true, minlength: 6 },
    // password: {
    //   type: String,
    //   required: true,
    //   minlength: 12,
    //   match: [
    //     /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_\-+=\[{\]};:'",<.>/?\\|`~]).{12,}$/,
    //     "Password must be at least 12 characters long and include at least one uppercase letter, one lowercase letter, one number, and one special character.",
    //   ],
    // },
    role: { type: String, enum: ["client", "admin", "moderateur", "prof"] },
    image_User: { type: String, default: "client.png" },
    cv_User: { type: String },
    age: Number,

    //client
    //.
    //.

    //prof
    //*
    //*
    statu: { type: Boolean, default: false },
    isDeleted: { type: Boolean, default: false },
    isBloked: { type: Boolean, default: false },

    car:{type : mongoose.Schema.Types.ObjectId ,ref:"Car"},
    cars:[{type : mongoose.Schema.Types.ObjectId ,ref:"Car"}],
    notification:[{type : mongoose.Schema.Types.ObjectId, ref:"Notification"}]
  },
  { timestamps: true }
);

userSchema.pre("save", async function (next) {
  try {
    const salt = await bcrypt.genSalt();
    const User = this;
    User.password = await bcrypt.hash(User.password, salt);
    // User.statu = false
    next();
  } catch (error) {
    next(error);
  }
});

userSchema.statics.login = async function (email,password) {
  try {
    const user = await this.findOne({email})
    if(user){
      const auth = await bcrypt.compare(password,user.password)
      if(auth){
        // if(user.etat == false){
        //   throw new Error("compte desactive");          
        // }
        // if(user.ban == false){
        //   throw new Error("compte banned");          
        // }
        return user
      }
      throw new Error("incorrect password");      
    }
    throw new Error("incorrect email");
    
  } catch (error) {
    throw new Error("probleme login");    
  }
}

const User = mongoose.model("User", userSchema);
module.exports = User;
