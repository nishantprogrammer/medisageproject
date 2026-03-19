import mongoose from 'mongoose'
export const connectDb=async ()=>
{
    try{
      const conn = await  mongoose.connect(process.env.MONGO_URI)
      if(conn)
      {
        console.log("MongoDb COnnected Sucessfully")
      }

    }
    catch(error)
    {
        console.log(error)

    }
}