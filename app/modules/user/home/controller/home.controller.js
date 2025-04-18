const HomeRepo = require("../repo/home.repo")

class UserHomeController {
    async homePage(req, res) {
        try {
            const sliders = await HomeRepo.getSliders()
            const categories = await HomeRepo.getCategories()
            console.log("sliders", sliders)
            console.log("categories", categories);
            const user = req.user || null
            
            res.render("pages/user/home/home", {
                title: "Welcome to TechBlog",
                sliders,
                categories,
                user
            })
        } catch (error) {
            console.error("Error in UserHomeController -> homePage:", error)
        }
    }
}

module.exports = new UserHomeController()