const multer =require("multer");
const storage = multer.diskStorage({
    destination : function(req,file,cb){
        cb(null , "./public/temp")
    },
    filename : function(req,file,cb){
        cb(null , file.originalname)
    }
})

const upload = multer({storage})
module.exports = {upload}


//Think of multer as a "file receiver" at the door. When a user uploads a file (like a video or image), multer catches it and temporarily saves it to your local public/temp folder before anything else happens. It keeps the original filename as-is.