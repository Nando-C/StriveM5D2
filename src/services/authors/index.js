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


const authorsRouter = express.Router()

authorsRouter.get("/", (req, res) => {
    const currentFilePath = fileURLToPath(import.meta.url)
    const currentFolderPath = dirname(currentFilePath)
    const authorsJSONPath = join(currentFolderPath, "authors.json")
    const authorsJSONContent = fs.readFileSync(authorsJSONPath)
    // console.log(JSON.parse(authorsJSONContent))

    res.send(JSON.parse(authorsJSONContent))
})

authorsRouter.get("/:id", (req, res) => {
    res.send("you got to the single author GET endpoint")
})
authorsRouter.post("/", (req, res) => {
    res.send("you got to the authors POST endpoint")
})
authorsRouter.put("/:id", (req, res) => {
    res.send("you got to the authors PUT endpoint")
})
authorsRouter.delete("/:id", (req, res) => {
    res.send("you got to the authors DELETE endpoint")
})

export default authorsRouter