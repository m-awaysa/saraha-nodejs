const { userModel } = require("../../../DB/model/user.model");
let bcrypt = require('bcryptjs');
const  cloudinary  = require("../../../services/cloudinary");

const updatePassword = async (req, res) => {
    try {
        const { oldPassword, newPassword } = req.body;

        const user = await userModel.findById(req.userId);
        const match = await bcrypt.compare(oldPassword, user.password);
        if (match) {

            const hash = await bcrypt.hash(newPassword, parseInt(process.env.SaltRound));
            const updatedUser = await userModel.findByIdAndUpdate(req.userId, { password: hash });
            if (updatedUser) {

                res.json({ message: "success", updatedUser });

            } else {
                res.json({ message: "new password invalid" });
            }

        } else {
            res.json({ message: "old password invalid" });
        }
    } catch (error) {
        res.status(400).json({ message: 'catch error', error })
    }
}
const uploadProfilePic = async (req, res) => {
   
    try {
     
        if (!req.file) {
            res.status(400).json({ message: 'plz upload image' })
        } else {
          
             //upload on cloud
            const {secure_url} = await cloudinary.uploader.upload(req.file.path,{
                folder:`user/profile/${req.userId}`
            });
            await userModel.findOneAndUpdate({ _id: req.userId }, { profilePic: secure_url });
            res.status(200).json({ message: 'success',secure_url })

            //for saving images on server file
            // const imageUrl = req.file.destination + '/' + req.file.filename;
            // await userModel.findOneAndUpdate({ _id: req.userId }, { profilePic: imageUrl });
            // res.status(200).json({ message: imageUrl })
        }
    } catch (error) {
        res.status(400).json({ message: 'catch error in pic', error })
    }

}

module.exports = { updatePassword, uploadProfilePic };