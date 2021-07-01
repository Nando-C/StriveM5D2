import express from "express"
import uniqid from "uniqid"
import createError from 'http-errors'
import { join } from "path"

import { getAuthorsArray, writeAuthors, writeAuthorsImage, getAuthorsReadableStream } from '../../lib/fileSystemTools.js'
import multer from 'multer'
import { authorsPublicFolderPath } from '../../lib/fileSystemTools.js'

import { v2 as cloudinary } from 'cloudinary'
import { CloudinaryStorage  } from 'multer-storage-cloudinary'

import { Transform } from "json2csv"
import { pipeline } from "stream"

const authorAvatarStorage = new CloudinaryStorage({
    cloudinary, 
    params: {
        folder: "authors",
    },
})

const uploadOnCloudinary = multer({ storage: authorAvatarStorage })

const authorsRouter = express.Router()

// GET /authors => returns the list of authors ============================
authorsRouter.get("/", async (req, res, next) => {
    try {
        const authors = await getAuthorsArray()
        res.send(authors)
        
    } catch (error) {
        next(error)
    }
})

// GET /authors/123 => returns a single author ============================
authorsRouter.get("/:id", async (req, res, next) => {
    
    try {
        const authors = await getAuthorsArray()
        const author = authors.find(auth => auth._id === req.params.id)
       
        if(author) {
            res.send(author)
        } else {
            next(createError(404, `Author with id ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// POST /authors => creates a new author ===================================
authorsRouter.post("/", async (req, res, next) => {
    const objModel = {
        name: "",
        surname: "",
        email: "",
        dateOfBirth: "",
    }
    try {
        const newAvatar = `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}`
        const newAuthor = {_id: uniqid(), ...objModel, ...req.body, avatar:newAvatar, createdAt: new Date()}
    
        const authors = await getAuthorsArray()
    
        authors.push(newAuthor)
    
        await writeAuthors(authors)
    
        res.status(201).send({_id: newAuthor._id})

    } catch (error) {
        next(error)
    }
})

// PUT /authors/123 => edits the author with the given id ==================
authorsRouter.put("/:id", async (req, res, next) => {
    try {
        const authors = await getAuthorsArray()
        const author = authors.find(auth => auth._id === req.params.id)
    
        const remainingAuthors = authors.filter(auth => auth._id !== req.params.id)
    
        const modifiedAuthor = {
            _id: req.params.id, 
            ...author,
            ...req.body,
            // avatar: (req.body.name && req.body.surname) 
            // ? `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}` 
            // :  req.body.name 
            //     ? `https://ui-avatars.com/api/?name=${req.body.name}+${author.surname}`
            //     : req.body.surname
            //         ? `https://ui-avatars.com/api/?name=${author.name}+${req.body.surname}`
            //         : `https://ui-avatars.com/api/?name=${author.name}+${author.surname}`
        }
    
        remainingAuthors.push(modifiedAuthor)
    
        await writeAuthors(remainingAuthors)
    
        res.send(modifiedAuthor)
        
    } catch (error) {
        next(error)
    }
})

// DELETE /authors/123 => deletes the author with the given id =============
authorsRouter.delete("/:id", async (req, res, next) => {
    try {
        const authors = await getAuthorsArray()
        const author = authors.find(auth => auth._id === req.params.id)

        if(author) {
            const remainingAuthors = authors.filter(auth => auth._id !== req.params.id)
        
            await writeAuthors(remainingAuthors)
        
            res.status(204).send()
        } else {
            next(createError(404, `Author with id ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// ==================== files upload ===============================

// POST /authors/:id/uploadAvatar, uploads a picture (save as idOfTheAuthor.jpg in the public/img/authors folder) for the author specified by the id. Store the newly created URL into the corresponding author in authors.json
authorsRouter.post("/:id/uploadAvatar", uploadOnCloudinary.single('avatar'), async (req, res, next) => {
    try {
        const authors = await getAuthorsArray()
        const author = authors.find(auth => auth._id === req.params.id)

        if(author) {
            // await writeAuthorsImage((`${req.params.id}.jpg`), req.file.buffer)
            
            const remainingAuthors = authors.filter(auth => auth._id !== req.params.id)
            const modifiedAuthor = {
                _id: req.params.id, 
                ...author,
                // avatar: `http://localhost:3001/img/authors/${req.params.id}.jpg`
                avatar: req.file.path
            }
            remainingAuthors.push(modifiedAuthor)
            await writeAuthors(remainingAuthors)
            
            res.status(201).send(modifiedAuthor)
        } else {
            next(createError(404, `Author with id ${req.params.id} not found!`))
        }
    } catch (error) {
        next(error)
    }
})

// ============================== CVS Download =================================

authorsRouter.get("/Download/CSV" , async (req, res, next) => {
    const source = getAuthorsReadableStream()
    const fields = ["_id", "name", "surname", "dateOfBirth", "email"]
    const options = { fields }
    const transform = new Transform(options)

    res.setHeader("Content-Disposition", "attachement; filename=Authors_List.csv")
    const destination = res

    pipeline(source, transform, destination, err => {
        if(err) next(err)
    })
})

export default authorsRouter