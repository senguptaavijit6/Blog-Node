const router = require("express").Router()
const FileUploader = require("../../helper/fileUploader")
const fileUploader = new FileUploader({folderName: "public/uploads/profile_picture/admin", supportedFiles: ["image/jpg", "image/jpeg", "image/png", "image/gif"], fileSize: 1024*1024*10})
const clientImageUploader = new FileUploader({folderName: "public/uploads/testimonials", supportedFiles: ["image/jpg", "image/jpeg", "image/png", "image/gif"], fileSize: 1024*1024*10})
const aboutUsUploader = new FileUploader({folderName: "public/uploads/cms/aboutUs", supportedFiles: ["image/jpg", "image/jpeg", "image/png", "image/gif"], fileSize: 1024*1024*10})
const homeSliderUploader = new FileUploader({folderName: "public/uploads/cms/home/slider", supportedFiles: ["image/jpg", "image/jpeg", "image/png", "image/gif"], fileSize: 1024*1024*10})
const authentication = require("../../middlewares/authentication")()
const ensureAdmin = require("../../middlewares/ensureAdmin")
const AdminAuthController = require("../../modules/admin/auth/controller/auth.controller")
const FAQController = require("../../modules/admin/FAQ/controller/faq.controller")
const TestimonialController = require("../../modules/admin/testimonials/controller/testimonial.controller")
const CategoryController = require("../../modules/admin/category/controller/category.controller")
const TagsController = require("../../modules/admin/tags/controller/tags.controller")
const AboutUsCMSController = require("../../modules/admin/cms/aboutUs/controller/aboutUsCMS.controller")
const HomepageCMSController = require("../../modules/admin/cms/homepage/controller/homepageCMS.controller")

//========== Auth routes ==========
router.get("/registerPage", AdminAuthController.registerPage)
router.post("/register", fileUploader.upload.single("image"), AdminAuthController.register)
router.get("/verifyEmailPage/:email", AdminAuthController.verifyEmailPage)
router.post("/verifyEmail/:email", AdminAuthController.verifyEmail)
router.get("/loginPage", AdminAuthController.loginPage)
router.post("/login", AdminAuthController.login)
router.post("/loginUsingOTP", AdminAuthController.loginUsingOTP)
router.get("/forgotPasswordPage", AdminAuthController.forgotPasswordPage)
router.post("/forgotPasswordOTPPage", AdminAuthController.forgotPasswordOTPPage)
router.post("/forgotPasswordOTPVerifyPage", AdminAuthController.forgotPasswordOTPVerification)
router.get("/changePasswordUsingOTPPage/:email/:otp", AdminAuthController.changePasswordUsingOTPPage)
router.post("/changePasswordUsingOTP", AdminAuthController.changePasswordUsingOTP)
router.get("/changePasswordUsingPasswordPage", authentication.authenticate, ensureAdmin, AdminAuthController.changePasswordUsingPasswordPage)
router.post("/changePasswordUsingPassword", authentication.authenticate, ensureAdmin, AdminAuthController.changePasswordUsingPassword)
router.get("/verifyEmailToUpdateDetailsPage", authentication.authenticate, ensureAdmin, AdminAuthController.verifyEmailToUpdateDetailsPage)
router.post("/verifyEmailToUpdateDetails", authentication.authenticate, ensureAdmin, AdminAuthController.verifyEmailToUpdateDetails)
router.get("/logout", authentication.authenticate, AdminAuthController.logout)

//========== Dashboard and Pages other than Auth ==========
router.get("/", authentication.authenticate, ensureAdmin, AdminAuthController.dashboard)
router.get("/settings", authentication.authenticate, ensureAdmin, AdminAuthController.redirectToAccountSettingsPage)
router.get("/settings/account", authentication.authenticate, ensureAdmin, AdminAuthController.accountSettingsPage)
router.get("/changeImagePage", authentication.authenticate, ensureAdmin, AdminAuthController.changeImagePage)
router.post("/changeImage", fileUploader.upload.single("image"), authentication.authenticate, ensureAdmin, AdminAuthController.changeImage)
router.get("/updateDetailsPage", authentication.authenticate, ensureAdmin, AdminAuthController.updateDetailsPage)
router.post("/updateDetails", authentication.authenticate, ensureAdmin, AdminAuthController.updateDetails)
router.get("/settings/site", authentication.authenticate, ensureAdmin, AdminAuthController.siteSettingsPage)
router.post("/updateSiteDetails", authentication.authenticate, ensureAdmin, AdminAuthController.updateSiteDetails)

//========== faq routes ==========
router.get("/createFAQPage", authentication.authenticate, ensureAdmin, FAQController.createFAQPage)
router.post("/createFAQ", authentication.authenticate, ensureAdmin, FAQController.createFAQ)
router.get("/allFAQsPage", authentication.authenticate, ensureAdmin, FAQController.retrieveAllFAQsPage)
router.get("/singleFAQPage/:id", authentication.authenticate, ensureAdmin, FAQController.retrieveSingleFAQ)
router.get("/deleteFAQ/:id", authentication.authenticate, ensureAdmin, FAQController.deleteFAQ)
router.get("/updateFAQPage/:id", authentication.authenticate, ensureAdmin, FAQController.updateFAQPage)
router.post("/updateFAQ/:id", authentication.authenticate, ensureAdmin, FAQController.updateFAQ)

//========== testimonials routes ==========
router.get("/createTestimonialPage", authentication.authenticate, ensureAdmin, TestimonialController.createTestimonialPage)
router.post("/createTestimonial", clientImageUploader.upload.single("clientImage"), authentication.authenticate, ensureAdmin, TestimonialController.createTestimonial)
router.get("/allTestimonialsPage", authentication.authenticate, ensureAdmin, TestimonialController.retrieveAllTestimonialsPage)
router.get("/singleTestimonialPage/:id", authentication.authenticate, ensureAdmin, TestimonialController.retrieveSingleTestimonial)
router.get("/deleteTestimonial/:id", authentication.authenticate, ensureAdmin, TestimonialController.deleteTestimonial)
router.get("/updateTestimonialPage/:id", authentication.authenticate, ensureAdmin, TestimonialController.updateTestimonialPage)
router.post("/updateTestimonial/:id", clientImageUploader.upload.single("clientImage"), authentication.authenticate, ensureAdmin, TestimonialController.updateTestimonial) // not working and throwing error

//========== category routes ==========
router.get("/createCategoryPage", authentication.authenticate, ensureAdmin, CategoryController.createCategoryPage)
router.post("/createCategory", authentication.authenticate, ensureAdmin, CategoryController.createCategory)
router.get("/allCategoriesPage", authentication.authenticate, ensureAdmin, CategoryController.retrieveAllCategoriesPage)
router.get("/singleCategoryPage/:id", authentication.authenticate, ensureAdmin, CategoryController.retrieveSingleCategory)
router.get("/deleteCategory/:id", authentication.authenticate, ensureAdmin, CategoryController.deleteCategory)
router.get("/updateCategoryPage/:id", authentication.authenticate, ensureAdmin, CategoryController.updateCategoryPage)
router.post("/updateCategory/:id", authentication.authenticate, ensureAdmin, CategoryController.updateCategory)

//========== cms page ==========
// About US
router.get("/cms/aboutUsCMSPage", authentication.authenticate, ensureAdmin, AboutUsCMSController.createOrUpdateAboutUsCMSPage)
router.post("/cms/aboutUsCMS", aboutUsUploader.upload.single("section1Image"), authentication.authenticate, ensureAdmin, AboutUsCMSController.createOrUpdateAboutUsCMS)
router.post("/cms/deleteAboutUs/:id", authentication.authenticate, ensureAdmin, AboutUsCMSController.deleteAboutUs)

// Home Page
router.get("/cms/homeCMSPage", authentication.authenticate, ensureAdmin, HomepageCMSController.createOrUpdatePage)
router.post("/cms/homeCMS", authentication.authenticate, ensureAdmin, HomepageCMSController.createOrUpdate)
router.get("/cms/homeSliderPage", authentication.authenticate, ensureAdmin, HomepageCMSController.retrieveHomeSliderPage)
router.get("/cms/singleHomeSliderPage/:id", authentication.authenticate, ensureAdmin, HomepageCMSController.retrieveHomeSingleSliderPage)
router.get("/cms/createHomeSliderPage", authentication.authenticate, ensureAdmin, HomepageCMSController.createHomeSliderPage)
router.post("/cms/createHomeSlider", homeSliderUploader.upload.single("sliderImage"), authentication.authenticate, ensureAdmin, HomepageCMSController.createHomeSlider)
router.get("/cms/updateHomeSliderPage/:id", authentication.authenticate, ensureAdmin, HomepageCMSController.updateHomeSliderPage)

//========== Tags ==========
router.get("/createTagPage", authentication.authenticate, ensureAdmin, TagsController.createTagPage)
router.post("/createTag", authentication.authenticate, ensureAdmin, TagsController.createTag)
router.get("/allTagsPage", authentication.authenticate, ensureAdmin, TagsController.retrieveAllTagsPage)
router.get("/singleTagPage/:id", authentication.authenticate, ensureAdmin, TagsController.retrieveSingleTag)
router.get("/deleteTag/:id", authentication.authenticate, ensureAdmin, TagsController.deleteTag)
router.get("/updateTagPage/:id", authentication.authenticate, ensureAdmin, TagsController.updateTagPage)
router.post("/updateTag/:id", authentication.authenticate, ensureAdmin, TagsController.updateTag)




module.exports = router