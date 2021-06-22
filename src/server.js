import express from "express"
// import listEndpoints from "express-list-endpoints"
// import cors from "cors"

const server = express()
const port = 3001

server.listen(port, () => {
    console.log("Server is running on port: " + port)
})