// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import connectToDb from "../../../middleware/connectToDb";
import SwitchStatus from "../../../models/SwitchStatus";
import NextCors from 'nextjs-cors';
connectToDb();
export default async function handler(req, res) {
  if(req.method!='POST'){
    return res.status(405).json({success:false, msg: req.method+ " method not allowed"});
  }
  await NextCors(req, res, {
    methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
    origin: '*',
    optionsSuccessStatus: 200, // some legacy browsers (IE11, various SmartTVs) choke on 204
 });
  const data = req.body;
  console.log(data);
  if(data.admin!=process.env.admin){
    return res.status(401).json({success:false, msg:"Unauthorized"});
  }
  const newStatus = await SwitchStatus.findByIdAndUpdate("65c90d6ae4add1d98f0bb461", {
    status:data.status
  })
  if(!newStatus){
    return res.status(500).json({success:false, msg:"Status not updated"});
  }
  return res.status(200).json({success:true, msg:"Status updated"});
}
