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

authorsRouter.get("/", (req, res) => {

    const authorsJSONContent = fs.readFileSync(authorsJSONPath)
    // console.log(JSON.parse(authorsJSONContent))

    res.send(JSON.parse(authorsJSONContent))
})

authorsRouter.get("/:id", (req, res) => {
    
})

authorsRouter.post("/", (req, res) => {
    const newAuthor = {...req.body, _id: uniqid(), createAt: new Date()}

    const authors = JSON.parse(fs.readFileSync(authorsJSONPath))

    authors.push(newAuthor)

    fs.writeFileSync(authorsJSONPath,JSON.stringify(authors))

    res.status(201).send({_id: newAuthor._id})

})

authorsRouter.put("/:id", (req, res) => {
    res.send("you got to the authors PUT endpoint")
})
authorsRouter.delete("/:id", (req, res) => {
    res.send("you got to the authors DELETE endpoint")
})

export default authorsRouter