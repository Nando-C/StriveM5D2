import express from "express"
import listEndpoints from "express-list-endpoints"
import cors from "cors"

import authorsRouter from "./services/authors/index.js"
import postsRouter from "./services/posts/index.js"
import { badRequestMiddleware, notFoundMiddleware, catchErrorMiddleware } from "./errorMiddlewares.js"

const server = express()
const port = 3001
// ==================  MIDDLEWARES =============================
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
    console.log("Server is running on port: " + port)
})