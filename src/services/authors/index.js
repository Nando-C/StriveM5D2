import express from "express"
import uniqid from "uniqid"
import createError from 'http-errors'

import { getAuthorsArray, writeAuthors, writeAuthorsImage } from '../../lib/fileSystemTools.js'
import multer from 'multer'

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
            avatar: (req.body.name && req.body.surname) 
            ? `https://ui-avatars.com/api/?name=${req.body.name}+${req.body.surname}` 
            :  req.body.name 
                ? `https://ui-avatars.com/api/?name=${req.body.name}+${author.surname}`
                : req.body.surname
                    ? `https://ui-avatars.com/api/?name=${author.name}+${req.body.surname}`
                    : `https://ui-avatars.com/api/?name=${author.name}+${author.surname}`
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

export default authorsRouter