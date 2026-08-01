config → Holds environment variables and database connection logic.
Example: db.ts would connect to MongoDB/Postgres, so your product data isn’t just fetched from an external API but stored in your own DB.

controllers → Business logic for each route.
Example: productController.ts contains the function getProducts that fetches products and sends them back to the client. It’s where you decide what happens when /products is called.

models → Data structure definitions.
Example: productModel.ts defines what a Product looks like (id, name, price, etc.). If you use a database, this file maps your Product schema.

routes → Defines endpoints and connects them to controllers.
Example: productRoutes.ts says: when someone hits /products, run getProducts from the controller.

middleware → Functions that run before controllers.
Example: authMiddleware.ts checks if the request has a valid JWT before allowing access to /products.

utils → Helper functions.
Example: jwtHelper.ts could generate and verify JWT tokens, so your controllers don’t repeat that logic.

app.ts → Central Express setup.
Example: Registers routes (/auth, /products) and applies middleware like express.json().

server.ts → Entry point.
Example: Starts the server on port 4000 and logs “Server running”.
