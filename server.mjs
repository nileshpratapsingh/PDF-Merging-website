import http from "http";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const server = http.createServer((request, response) => {
    if (request.url === "/" || request.url === "/index.html") {
        fs.readFile(path.join(__dirname, "index.html"), (err, data) => {
            if (err) {
                response.writeHead(500, { "Content-Type": "text/plain" });
                response.end("Internal Server Error");
            } else {
                response.writeHead(200, { "Content-Type": "text/html" });
                response.end(data);
            }
        });
    } else {
        response.writeHead(404, { "Content-Type": "text/plain" });
        response.end("Not Found");
    }
});

server.listen(3000, () => {
    console.clear();
    console.log("Server running successfully at http://localhost:3000");
});
