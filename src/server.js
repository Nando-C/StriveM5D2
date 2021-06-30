import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"
import { join } from "path"

import authorsRouter from "./services/authors/index.js"
import postsRouter from "./services/posts/index.js"
import { badRequestMiddleware, notFoundMiddleware, catchErrorMiddleware } from "./errorMiddlewares.js"
import { getCurrentFolderPath } from "./lib/fileSystemTools.js"

const server = express()
const port = process.env.PORT || 3001
const publicFolderPath = join(getCurrentFolderPath(import.meta.url), "../public")
// ==================  MIDDLEWARES =============================
server.use(express.static(publicFolderPath))
server.use(cors())
server.use(express.json())


// ==================  ENDPOINTS ================================

server.use("/authors", authorsRouter)
server.use("/blogPosts", postsRouter)


// ==================  ERROR MIDDLEWARES  =======================

server.use(badRequestMiddleware)
server.use(notFoundMiddleware)
server.use(catchErrorMiddleware)

// ==============================================================
console.table(listEndpoints(server))

server.listen(port, () => {
    console.log(" ✅  Server is running on port: " + port)
})