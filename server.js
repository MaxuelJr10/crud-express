const express = require("express");

const app = express();
const port = 8080;

app.use(express.json());

app.use(express.static("public"));

const produtosRoutes = require("./routes/produtos");
app.use("/produtos", produtosRoutes);

app.listen(port, () => {
    console.log(`Servidor em https://maxueljr10.github.io/crud-express:${port}`);
});
