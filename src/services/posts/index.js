import express from 'express'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import fs from 'fs'
import uniqid from 'uniqid'


const postsRouter = express.Router()

const postsJSONPath = join(dirname(fileURLToPath(import.meta.url)), "posts.json")

const getPostsArray = () => {
    const content = fs.readFileSync(postsJSONPath)
    return JSON.parse(content)
}

const writePosts = content => fs.writeFileSync(postsJSONPath, JSON.stringify(content))


// GET /blogPosts => returns the list of blogposts ============================
postsRouter.get("/", (req, res) => {

    const posts = getPostsArray()

    res.send(posts)
})

// GET /blogPosts /123 => returns a single blogpost ============================
postsRouter.get("/:id", (req, res) => {
    const posts = getPostsArray()
    const post= posts.find(post => post._id === req.params.id)

    res.send(post)
})

// POST /blogPosts => create a new blogpost ===================================
postsRouter.post("/", (req, res) => {
    // const objModel = 
    //  {
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
	//     "createdAt": "NEW DATE"
	//   }
    const newPost = {...req.body, _id: uniqid(), createdAt: new Date()}

    const posts = getPostsArray()

    posts.push(newPost)

    writePosts(posts)

    res.status(201).send({_id: newPost._id})
})

// PUT /blogPosts /123 => edit the blogpost with the given id ==================
postsRouter.put("/:id", (req, res) => {
    const posts = getPostsArray()

    const post = posts.find(post => post._id === req.params.id)

    const remainingPosts = posts.filter(post => post._id !== req.params.id)

    const modifiedPost = {
        ...post,
        ...req.body,
        _id: req.params.id, 
    }

    remainingPosts.push(modifiedPost)

    writePosts(remainingPosts)

    res.send(modifiedPost)
})

// DELETE /blogPosts /123 => delete the blogpost with the given id =============
postsRouter.delete("/:id", (req, res) => {
    const posts = getPostsArray()
    const remainingPosts = posts.filter(post => post._id !== req.params.id)

    writePosts(remainingPosts)

    res.status(204).send()
})

export default postsRouter