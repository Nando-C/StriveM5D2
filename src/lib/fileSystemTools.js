import fs from 'fs-extra'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const { readJSON, writeJSON, writeFile } = fs

const authorsJSONPath = join(dirname(fileURLToPath(import.meta.url)), '../data/authors.json')
const postsJSONPath = join(dirname(fileURLToPath(import.meta.url)), '../data/posts.json')

export const getAuthorsArray = () => readJSON(authorsJSONPath)
export const getPostsArray = () => readJSON(postsJSONPath)

export const writeAuthors = (content) => writeJSON(authorsJSONPath, content)
export const writePosts = (content) => writeJSON(postsJSONPath, content)

export const getCurrentFolderPath = (currentFile) => dirname(fileURLToPath(currentFile))
