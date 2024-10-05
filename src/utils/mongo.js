import mongoose from "mongoose";

const connection={}
const connectDb=async()=>{
  
    try {
        if(connection.isConnected)
        {
            return;
        }
     
      const db= await mongoose.connect("mongodb+srv://uditya951:rishi95122@cluster0.axngq.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
      connection.isConnected=db.connections[0].readyState
    } catch (error) {
        console.log(error)
        throw new Error(error)
    }
}

export default connectDb