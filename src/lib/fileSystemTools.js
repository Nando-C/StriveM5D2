import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'
import { createReadStream } from 'fs'

const { readJSON, writeJSON, writeFile } = fs

const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), '../data/authors.json')
const postsJSONPath = join(dirname(fileURLToPath(import.meta.url)), '../data/posts.json')
export const blogPostsPublicFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../../public/img/blogPosts')
export const authorsPublicFolderPath = join(dirname(fileURLToPath(import.meta.url)), '../../public/img/authors')

export const getAuthorsArray = () => readJSON(authorsJSONPath)
export const getPostsArray = () => readJSON(postsJSONPath)

export const writeAuthors = (content) => writeJSON(authorsJSONPath, content)
export const writePosts = (content) => writeJSON(postsJSONPath, content)

export const getCurrentFolderPath = (currentFile) => dirname(fileURLToPath(currentFile))

export const writePostsImage = (fileName, content) => writeFile(join(blogPostsPublicFolderPath, fileName), content)
export const writeAuthorsImage = (fileName, content) => writeFile(join(authorsPublicFolderPath, fileName), content)

export const getPostsReadableStream = () => createReadStream(postsJSONPath)