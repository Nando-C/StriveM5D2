import express from 'express'
import uniqid from 'uniqid'
import createError from 'http-errors'
import { checkBlogPostSchema } from './validation.js'
import { validationResult } from 'express-validator'
import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage  } from 'multer-storage-cloudinary'

import { getPostsArray, writePosts, writePostsImage, getPostsReadableStream, getAuthorsArray } from '../../lib/fileSystemTools.js'
import multer from 'multer'
import { generatePDFReadableStream } from '../../lib/pdf/index.js'
import { pipeline } from 'stream'

const blogCoverStorage = new CloudinaryStorage({
    cloudinary, 
    params: {
        folder: "posts",
    },
})

const uploadOnCloudinary = multer({ storage: blogCoverStorage })

const postsRouter = express.Router()

// GET /blogPosts => returns the list of blogposts ============================
postsRouter.get("/", async(req, res, next) => {
    try {
        const posts = await getPostsArray()
        res.send(posts)
        
    } catch (error) {
        next(error)
    }
})

// GET /blogPosts /123 => returns a single blogpost ============================
postsRouter.get("/:id", async(req, res, next) => {
    try {
        const posts = await getPostsArray()
        const post= posts.find(post => post._id === req.params.id)
        if (post) {
            res.send(post)
        } else {
            next(createError(404, `Post with id ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }

})

// POST /blogPosts => create a new blogpost ===================================
postsRouter.post("/", checkBlogPostSchema, async(req, res, next) => {
    try {
        const errors = validationResult(req)

        if(errors.isEmpty()) {
            // const objModel = {
            //     "_id": "SERVER GENERATED ID",
            //     "category": "ARTICLE CATEGORY",
            //     "title": "ARTICLE TITLE",
            //     "cover":"ARTICLE COVER (IMAGE LINK)",
            //     "readTime": {
            //       "value": 2,
            //       "unit": "minute"
            //     },
            //     "author": {
            //       "name": "AUTHOR AVATAR NAME",
            //       "avatar":"AUTHOR AVATAR LINK"
            //     },
            //     "content": "HTML",
            //     "comments": [],
            //     "createdAt": "NEW DATE"
            //   }
            
            const posts = await getPostsArray()
            // const authors = await getAuthorsArray()
            // const author = authors.find(auth => auth.name === req.params.author.name)
            
            // if(author) {
                const newPost = {_id: uniqid(), ...req.body, comments: [], createdAt: new Date()}
                posts.push(newPost)
            
                await writePosts(posts)
            
                res.status(201).send({_id: newPost._id})

            // }
        } else {
            next(createError(400, { errorsList: errors }))
        }
    } catch (error) {
        next(error)
    }
})

// PUT /blogPosts /123 => edit the blogpost with the given id ==================
postsRouter.put("/:id", async(req, res, next) => {
    try {
        const posts = await getPostsArray()
        const post = posts.find(post => post._id === req.params.id)

        if (post) {
            const remainingPosts = posts.filter(post => post._id !== req.params.id)
        
            const modifiedPost = {
                _id: req.params.id, 
                ...post,
                ...req.body,
            }
        
            remainingPosts.push(modifiedPost)
        
            await writePosts(remainingPosts)
        
            res.send(modifiedPost)

        } else {
            next(createError(404, `Post with id ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// DELETE /blogPosts /123 => delete the blogpost with the given id =============
postsRouter.delete("/:id", async(req, res, next) => {
    try {
        const posts = await getPostsArray()
        const post = posts.find(post => post._id === req.params.id)

        if (post) {
            const remainingPosts = posts.filter(post => post._id !== req.params.id)
        
            await writePosts(remainingPosts)
        
            res.status(204).send()
            
        } else {
            next(createError(404, `Post with id ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// ==================== Blog Post Comments =========================

// GET /blogPosts/:id/comments, get all the comments for a specific post
postsRouter.get("/:id/comments", async (req, res, next) => {
    try {
        const posts = await getPostsArray()
        const post = posts.find(post => post._id === req.params.id)
        if(post) {
            res.send(post.comments)
        } else {
            next(createError(404, `Post with id ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// POST /blogPosts/:id/comments, add a new comment to the specific post
postsRouter.post("/:id/comments", async(req, res, next) => {
    try {
        const posts = await getPostsArray()
        const post = posts.find(post => post._id === req.params.id)
        if(post) {
            const remainingPosts = posts.filter(post => post._id !== req.params.id)
            const modifiedPost = {
                ...post,
                comments : [...post.comments, req.body]
            }
            remainingPosts.push(modifiedPost)
            await writePosts(remainingPosts)
            console.log(req.body)

            res.send(modifiedPost)
        } else {
            next(createError(404, `Post with id ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// ==================== Files Upload ===============================

// POST /blogPosts/:id/uploadCover, uploads a picture (save as idOfTheBlogPost.jpg in the public/img/blogPosts folder) for the blog post specified by the id. Store the newly created URL into the corresponding post in blogPosts.json
postsRouter.post("/:id/uploadCover", uploadOnCloudinary.single('cover'), async(req, res, next) => {
    try {
        const posts = await getPostsArray()
        const post = posts.find(post => post._id === req.params.id)

        if (post) {
            // await writePostsImage((`${req.params.id}.jpg`), req.file.buffer)
            
            
            const remainingPosts = posts.filter(post => post._id !== req.params.id)
        
            const modifiedPost = {
                _id: req.params.id, 
                ...post,
                // cover : `http://localhost:3001/img/blogPosts/${req.params.id}.jpg`
                cover : req.file.path
            }
            remainingPosts.push(modifiedPost)
            await writePosts(remainingPosts)

            res.send(modifiedPost)
        } else {
            next(createError(404, `Post with id ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// =============================== PDF Stream Download =======================================

postsRouter.get("/:id/PDFDownload", async (req, res, next) => {
    try {
        const posts = await getPostsArray()
        const post = posts.find(post => post._id === req.params.id)
        console.log(post)
        res.setHeader("Content-Disposition", "attachment; filename=posts.pdf")
        const source = await generatePDFReadableStream(post)
        const destination = res

        pipeline(source, destination, err => {
            if (err) next(err)
        })
    } catch (error) {
        console.log(error)
        next(error)
    }
})

export default postsRouter