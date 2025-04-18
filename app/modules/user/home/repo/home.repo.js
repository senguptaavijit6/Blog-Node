const HomeSliderModel = require("../../../admin/cms/homepage/model/homeSlider.model")
const CategoryModel = require("../../../admin/category/model/category.model")
const mongoose = require("mongoose")

class HomeRepo {
    async getSliders() {
        try {
            const sliders = await HomeSliderModel.find({ isDeleted: false, status: "active" }).sort({ createdAt: -1})
            return sliders
        } catch (error) {
            console.error("Error in HomeRepo -> getSlider:", error);
        }
    }

    async getCategories() {
        try {
            const categories = await CategoryModel.find({ isDeleted: false, status: "active" }).sort({ createdAt: -1 })
            return categories
        } catch (error) {
            console.error("Error in HomeRepo -> getCategories:", error);
        }
    }
}

module.exports = new HomeRepo()