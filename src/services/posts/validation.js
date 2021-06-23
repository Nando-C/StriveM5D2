import { body } from 'express-validator'

export const postValidation = [
    body("category").exists().withMessage("Category is a mandatory field"),
    body("title").exists().withMessage("Title is a mandatory field"),
    body("cover").exists().withMessage("Cover is a mandatory field"),
    body("readTime").exists().withMessage("Read time is a mandatory field"),
    body("author.name").exists().withMessage("Author name is a mandatory field"),
    body("content").exists().withMessage("Content is a mandatory field"),
]