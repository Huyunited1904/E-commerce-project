import { loginService } from "../services/loginService.js";
export const loginController = async (req,res,next) => {
   try {
            const result = await loginService(req.body);
            return res.status(200).json({
                success:true,
                message:"Login successful",
                data:result,

            });

   } 
   catch(error) {
        next(error);
   }

}