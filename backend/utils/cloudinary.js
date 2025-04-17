import cloudinaryModule from "cloudinary"
import config from "../config/config.js"

const cloudinary = cloudinaryModule.v2

cloudinary.config({
 cloud_name: config.cloudinary.cloudName,
 api_key: config.cloudinary.apiKey,
 api_secret: config.cloudinary.apiSecret,
 secure: true,
})

export default cloudinary
