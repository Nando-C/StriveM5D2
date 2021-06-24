// import { body } from 'express-validator'
import { checkSchema, validationResult } from "express-validator"

// export const postValidation = [
//     body("category").exists().withMessage("Category is a mandatory field"),
//     body("title").exists().withMessage("Title is a mandatory field"),
//     body("cover").exists().withMessage("Cover is a mandatory field"),
//     body("readTime").exists().withMessage("Read time is a mandatory field"),
//     body("author.name").exists().withMessage("Author name is a mandatory field"),
//     body("content").exists().withMessage("Content is a mandatory field"),
// ]

const schema = {
    category: {
        in: ["body"],
        isString: { 
            errorMessage: "category validation failed, type must be string",
        }
    },
    title: {
        in: ["body"],
        isString: { 
            errorMessage: "title validation failed, type must be string",
        }
    },
    cover: {
        in: ["body"],
        isString: { 
            errorMessage: "cover validation failed, type must be string",
        }
    },
    "readTime.value": {
        in: ["body"],
        isNumeric: { 
            errorMessage: "readTime.value validation failed, type must be number",
        }
    },
    "readTime.unit": {
        in: ["body"],
        isString: { 
            errorMessage: "readTime.unit validation failed, type must be string",
        }
    },
    "author.name": {
        in: ["body"],
        isString: { 
            errorMessage: "author.name validation failed, type must be string",
        }
    },
    "author.avatar":{
        in: ["body"],
        isString: { 
            errorMessage: "author.avatar validation failed, type must be string",
        }
    },
    content: {
        in: ["body"],
        isString: { 
            errorMessage: "content validation failed, type must be string",
        }
    },
}

export const checkBlogPostSchema = checkSchema(schema)

