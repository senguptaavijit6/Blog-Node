const CategoryRepo = require("../../../admin/category/repository/category.repo");
const TagsRepo = require("../../../admin/tags/repository/tags.repo");
const BlogsRepo = require("../../../blogs/repo/blog.repo")
const mongoose = require("mongoose");
const likeRepo = require("../../../likes/repo/like.repo");

class UserBlogsController {
    convertToUserCurrentTime = (userTimezone) => {
        console.log("userTimezone from convertToUserTime:", userTimezone);
    
        
        const gmt = userTimezone.match(/\(GMT([+-]\d{2}:\d{2})\)/)[1];
        console.log("Extracted GMT from convertToUserTime:", gmt);
    
        // Current UTC time
        const nowUTC = new Date();
    
        // GMT offset into milliseconds
        const [hours, minutes] = gmt.split(":").map(time => Number(time));
        const userOffsetMilliseconds = (hours * 60 + minutes) * 60000;
    
        // user's local time
        const userCurrentTime = new Date(nowUTC.getTime() + userOffsetMilliseconds);
        console.log("Final userTime from convertToUserCurrentTime:", userCurrentTime);
    
        return userCurrentTime;
    }

    // for mongodb
    convertPublishATLocalToUTCTime = (publishAt, userTimezone) => {

        const localISODateTime = `${publishAt[0]}T${publishAt[1]}`;
        console.log("localISODateTime from convertPublishATLocalToUTCTime:", localISODateTime);
        console.log("userTimezone from convertPublishATLocalToUTCTime:", userTimezone);
    
        // Parse GMT offset
        const gmt = userTimezone.match(/\(GMT([+-]\d{2}:\d{2})\)/)[1];
        console.log("Extracted GMT from convertPublishATLocalToUTCTime:", gmt);
        const offsetSign = gmt.startsWith('-') ? -1 : 1;
        const [hours, minutes] = gmt.slice(1).split(':').map(Number);
        console.log("hours and minutes from convertPublishATLocalToUTCTime:", hours, minutes);        
        const offsetInMinutes = offsetSign * (hours * 60 + minutes);
    
        // Date object from the local ISO string
        const localDateObj = new Date(localISODateTime);
        console.log("localDateObj from convertPublishATLocalToUTCTime:", localDateObj);
    
        // Converting to UTC
        const utcTime = new Date(localDateObj.getTime() - offsetInMinutes * 60000 - localDateObj.getTimezoneOffset() * 60000);
    
        console.log("UTC time from convertPublishATLocalToUTCTime:", utcTime);
        
        return utcTime;
    };

    // for comparison with the current time (NO LONGER NEEDED) 
    convertUTCTimeToLocal = (UTCTime, userGMT) => {
        const offsetSign = userGMT.startsWith('-') ? -1 : 1;
        const [hours, minutes] = userGMT.slice(1).split(':').map(Number);
        const offsetInMinutes = offsetSign * (hours * 60 + minutes);
    
        // Convert offset to milliseconds and adjust UTC time
        const localTime = new Date(UTCTime.getTime() + offsetInMinutes * 60000);
        console.log("localTime from convertUTCTimeToLocal:", localTime);
        
        return localTime;
    };

    // for comparison with the current time
    getCurrentUTCTime = () => {
        const currentUTC = new Date().toISOString();    
        return currentUTC;
    }
    

    createBlogPage = async (req, res) => {
        try {
            const user = req.user;
            if (!user) {
                req.flash("error", "Unauthorized access, please login")
                return res.redirect("/loginPage")
            }
            console.log("user from createBlogPage", user);
            
            const userTime = this.convertToUserCurrentTime(user.timezone)
            console.log("userTime from createBlogPage", userTime);           

            const categories = await CategoryRepo.retrieveAllCategories()
            const tags = await TagsRepo.retrieveAllTags()

            return res.render("pages/user/blog/createBlogPage", {
                title: "Create Blog",
                user,
                categories,
                tags,
                userTime,
            })
        } catch (error) {
            console.error("Error in UserBlogsController -> createBlogPage: ", error);
            res.status(500).json({ message: "Internal Server Error" });

        }
    }

    createBlog = async (req, res) => {
        try {
            const user = req.user;
            if (!user) {
                req.flash("error", "Unauthorized access, please login")
                return res.redirect("/loginPage")
            }

            req.body.GMT = user.timezone.match(/\(GMT([+-]\d{2}:\d{2})\)/)[1]
            

            console.log("req.body: ", req.body);
            console.log("req.file: ", req.file);

            if (!req.file) {
                req.flash("error", "Blog image is required")
                return res.redirect("/user/createBlogPage")
            }

            req.body.image = req.file.filename

            if (!req.body.title) {
                req.flash("error", "Blog title is required")
                return res.redirect("/user/createBlogPage")
            }

            if (!req.body.content) {
                req.flash("error", "Blog content is required")
                return res.redirect("/user/createBlogPage")
            }

            if (!req.body.author) {
                req.flash("error", "unauthorized access, please login to create blog")
                return res.redirect("/user/createBlogPage")
            }

            if (!req.body.authorRole) {
                req.flash("error", "unauthorized access, please login to create blog")
                return res.redirect("/user/createBlogPage")
            }

            if (!req.body.category) {
                req.flash("error", "Blog category is required")
                return res.redirect("/user/createBlogPage")
            }

            if (!req.body.tags) {
                req.flash("error", "Blog tags is required")
                return res.redirect("/user/createBlogPage")
            }

            // convert the published at input into a valid date object
            if (req.body.isFuturePublish) {
                const UTCTime = this.convertPublishATLocalToUTCTime(req.body.publishAt, req.user.timezone)
                console.log("publishAt", UTCTime);
                
                req.body.publishAt = UTCTime
            }

            // const userTime = this.convertToUserCurrentTime(user.timezone)
            const currentUTCTime = this.getCurrentUTCTime()

            console.log("everything is ok", req.body);
            console.log("===========================================", req.body.category)

            if (Array.isArray(req.body.category)) {
                req.body.category = req.body.category.map(id => new mongoose.Types.ObjectId(id))
            }

            if (Array.isArray(req.body.tags)) {
                req.body.tags = req.body.tags.map(id => new mongoose.Types.ObjectId(id))
            }

            console.log("request body after parsing", req.body, "publish time and user's current time", req.body.publishAt, new Date(currentUTCTime));

            if (req.body.publishAt > new Date(currentUTCTime)) {
                console.log("future blog creation")
                req.body.isPublished = false
                const blog = await BlogsRepo.createFutureBlog(req.body, user.timezone)
                if (blog) {
                    req.flash("success", "Blog for future created successfully")
                    return res.redirect("/dashboard")
                } else {
                    req.flash("error", "Failed to create blog for future")
                    return res.redirect("/createBlogPage")
                }
            } else {
                console.log("normal blog creation")
                req.body.isPublished = true
                const blog = await BlogsRepo.createBlog(req.body)
                if (blog) {
                    req.flash("success", "Blog created successfully")
                    return res.redirect("/dashboard")
                } else {
                    req.flash("error", "Failed to create blog")
                    return res.redirect("/createBlogPage")
                }
            }
        } catch (error) {
            console.error("Error in UserBlogsController -> createBlog: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    dashboard = async (req, res) => {
        try {
            const user = req.user
            console.log("user from dashboard", user)
            if (!user) {
                req.flash("error", "Unauthorized access, please login")
                return res.redirect("/loginPage")

            }

            const userTime = this.convertToUserCurrentTime(user.timezone)
            
            const blogsData = await BlogsRepo.getAllBlogsByUser(user._id, user.timezone)
            console.log("=======getAllBlogsByUser=======\n", blogsData, "\n", JSON.stringify(blogsData, null, 2), "\n===================================");

            const likes = await BlogsRepo.getLikesPerBlogByUser(user._id)
            console.log("likes", likes, JSON.stringify(likes, null, 4));
            
            // return res.send({
            //     blogsData
            // })
            
            return res.render("pages/user/dashboard", { title: "User Dashboard", user, userTime, blogsData, likes })

        } catch (error) {
            console.error("Error in UserBlogsController -> getAllBlogsByUser: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async deleteBlogById(req, res) {
        try {
            const user = req.user;
            if (!user) {
                req.flash("error", "Unauthorized access, please login")
                return res.redirect("/loginPage")
            }
            const isBlogAvaiable = await BlogsRepo.getBlogById(req.params.id)
            if (!isBlogAvaiable) {
                req.flash("error", "Invalid blog details, Blog may be deleted")
                return res.redirect("/getAllBlogsByUserPage")
            }
            const deleteBlogResponse = await BlogsRepo.deleteBlog(req.params.id, user._id)
            if (!deleteBlogResponse) {
                req.flash("error", "Blog couldn't be deleted, try again")
                return res.redirect("/getAllBlogsByUserPage")
            }
            req.flash("success", "Blog deleted successfully")
            return res.redirect("/getAllBlogsByUserPage")
        } catch (error) {
            console.error("Error in UserBlogsController -> deleteBlogById: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }

    async signleBlog(req, res) {
        try {
            const user = req.user;
            if (!user) {
                req.flash("error", "Unauthorized access, please login")
                return res.redirect("/loginPage")
            }

            console.log("req.params.id for singleBlog", req.params.id);
            
            let id = req.params.id

            id = new mongoose.Types.ObjectId(id)

            const blogResponse = await BlogsRepo.getBlogById(id)
            if (!blogResponse) {
                req.flash("error", "Blog not found, may be deleted by admin")
                return res.redirect("/dashboard")
            }

            console.log("blogResponse from signleBlog", blogResponse);

            const isLikedByThisUser = blogResponse.totalLikes.find(like => like.userId.toString() === user._id.toString() && like.likeType === "like")
            console.log("isLikedByThisUser", isLikedByThisUser);
            const isDislikedByThisUser = blogResponse.totalDislikes.find(dislike => dislike.userId.toString() === user._id.toString() && dislike.likeType === "dislike")
            console.log("isDislikedByThisUser", isDislikedByThisUser);

            // const likes = await likeRepo.getLikesByPostId(id)
            // console.log("likes", likes);

            // return res.send({
            //     blogResponse
            // })
            
            return res.render("pages/user/blog/singleBlogPage", { title: "Blog Details", user, blogResponse, isLikedByThisUser, isDislikedByThisUser })

        } catch (error) {
            console.error("Error in UserBlogsController -> signleBlog: ", error);
            res.status(500).json({ message: "Internal Server Error" });
        }
    }
}

module.exports = new UserBlogsController