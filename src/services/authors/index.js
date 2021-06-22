// The backend should include the following routes:

// GET /authors => returns the list of authors
// GET /authors/123 => returns a single author
// POST /authors => create a new author
// PUT /authors/123 => edit the author with the given id
// DELETE /authors/123 => delete the author with the given id

import express from "express"
import fs from "fs"
import { fileURLToPath } from "url"
import { dirname, join } from "path"
import uniqid from "uniqid"


const authorsRouter = express.Router()

const currentFilePath = fileURLToPath(import.meta.url)
const currentFolderPath = dirname(currentFilePath)
const authorsJSONPath = join(currentFolderPath, "authors.json")

// GET /authors => returns the list of authors ============================
authorsRouter.get("/", (req, res) => {

    const authorsJSONContent = fs.readFileSync(authorsJSONPath)

    res.send(JSON.parse(authorsJSONContent))
})

// GET /authors/123 => returns a single author ============================
authorsRouter.get("/:id", (req, res) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const author = authors.find(auth => auth._id === req.params.id)

    res.send(author)
})

// POST /authors => create a new author ===================================
authorsRouter.post("/", (req, res) => {
    const objModel = {
        name: "",
        surname: "",
        email: "",
        dateOfBirth: "",
    }
    const newAvatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
    const newAuthor = {...objModel, ...req.body, _id: uniqid(), avatar:newAvatar, createAt: new Date()}

    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))

    authors.push(newAuthor)

    fs.writeFileSync(authorsJSONPath,JSON.stringify(authors))

    res.status(201).send({_id: newAuthor._id})

})

// PUT /authors/123 => edit the author with the given id ==================
authorsRouter.put("/:id", (req, res) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))

    const author = authors.find(auth => auth._id === req.params.id)

    const remainingAuthors = authors.filter(auth => auth._id !== req.params.id)

    const modifiedAuthor = {
        ...author,
        ...req.body,
        _id: req.params.id, 
        avatar: (req.body.name && req.body.surname) 
        ? `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}` 
        :  req.body.name 
            ? `https://ui-avatars.com/api/?name=${req.body.name}+${author.surname}`
            : req.body.surname
                ? `https://ui-avatars.com/api/?name=${author.name}+${req.body.surname}`
                : `https://ui-avatars.com/api/?name=${author.name}+${author.surname}`
    }

    remainingAuthors.push(modifiedAuthor)

    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))

    res.send(modifiedAuthor)
})

// DELETE /authors/123 => delete the author with the given id =============
authorsRouter.delete("/:id", (req, res) => {
    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))
    const remainingAuthors = authors.filter(auth => auth._id !== req.params.id)

    fs.writeFileSync(authorsJSONPath, JSON.stringify(remainingAuthors))

    res.status(204).send()
   
})

export default authorsRouter