const router = require("express").Router()
const FileUploader = require("../../helper/fileUploader")
const fileUploader = new FileUploader({folderName: "public/uploads/profile_picture/admin", supportedFiles: ["image/jpg", "image/jpeg", "image/png", "image/gif"], fileSize: 1024*1024*10})
const blogImageUploader = new FileUploader({folderName: "public/uploads/blog_image", supportedFiles: ["image/jpg", "image/jpeg", "image/png", "image/gif"], fileSize: 1024*1024*10})
const authentication = require("../../middlewares/authentication")()
const UserHomeController = require("../../modules/user/home/controller/home.controller")
const UserAuthController = require("../../modules/user/auth/controller/auth.controller")
const UserBlogsController = require("../../modules/user/blogs/controller/user.blog.controller")
const UserLikesController = require("../../modules/user/likes/controller/user.likes.controller")

//========== Auth routes ==========
router.get("/", UserHomeController.homePage)
router.get("/registerPage", UserAuthController.registerPage)
router.post("/register", fileUploader.upload.single("image"), UserAuthController.register)
router.get("/verifyEmailPage/:email", UserAuthController.verifyEmailPage)
router.post("/verifyEmail/:email", UserAuthController.verifyEmail)
router.get("/loginPage", UserAuthController.loginPage)
router.post("/login", UserAuthController.login)
router.post("/loginUsingOTP", UserAuthController.loginUsingOTP)
router.get("/forgotPasswordPage", UserAuthController.forgotPasswordPage)
router.post("/forgotPasswordOTPPage", UserAuthController.forgotPasswordOTPPage)
router.post("/forgotPasswordOTPVerifyPage", UserAuthController.forgotPasswordOTPVerification)
router.get("/changePasswordUsingOTPPage/:email/:otp", UserAuthController.changePasswordUsingOTPPage)
router.post("/changePasswordUsingOTP", UserAuthController.changePasswordUsingOTP)
router.get("/changePasswordUsingPasswordPage", authentication.authenticate, UserAuthController.changePasswordUsingPasswordPage)
router.post("/changePasswordUsingPassword", authentication.authenticate, UserAuthController.changePasswordUsingPassword)
router.get("/verifyEmailToUpdateDetailsPage", authentication.authenticate, UserAuthController.verifyEmailToUpdateDetailsPage)
router.post("/verifyEmailToUpdateDetails", authentication.authenticate, UserAuthController.verifyEmailToUpdateDetails)
router.get("/logout", authentication.authenticate, UserAuthController.logout)

//========== Dashboard and Pages other than Auth ==========
router.get("/dashboard", authentication.authenticate, UserBlogsController.dashboard)
router.get("/settings", authentication.authenticate, UserAuthController.redirectToAccountSettingsPage)
router.get("/settings/account", authentication.authenticate, UserAuthController.accountSettingsPage)
router.get("/changeImagePage", authentication.authenticate, UserAuthController.changeImagePage)
router.post("/changeImage", fileUploader.upload.single("image"), authentication.authenticate, UserAuthController.changeImage)
router.get("/updateDetailsPage", authentication.authenticate, UserAuthController.updateDetailsPage)
router.post("/updateDetails", authentication.authenticate, UserAuthController.updateDetails)
router.get("/settings/site", authentication.authenticate, UserAuthController.siteSettingsPage)
router.post("/updateSiteDetails", authentication.authenticate, UserAuthController.updateSiteDetails)

// ========== Blogs ==========
router.get("/createBlogPage", authentication.authenticate, UserBlogsController.createBlogPage)
router.post("/createBlog", blogImageUploader.upload.single("image"), authentication.authenticate, UserBlogsController.createBlog)
router.get("/deleteBlog/:id", authentication.authenticate, UserBlogsController.deleteBlogById)
router.get("/blogDetails/:id", authentication.authenticate, UserBlogsController.signleBlog)

// ========== Likes ==========
router.get("/likeBlog/:id", authentication.authenticate, UserLikesController.createLike)
router.get("/withdrawLikeBlog/:id", authentication.authenticate, UserLikesController.withdrawLike)
router.get("/dislikeBlog/:id", authentication.authenticate, UserLikesController.createDislike)
router.get("/withdrawDislikeBlog/:id", authentication.authenticate, UserLikesController.withdrawDislike)


module.exports = router