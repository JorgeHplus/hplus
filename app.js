const express = require("express");
const app = express();
const cors = require("cors");
require("dotenv").config();

const categoriaRoutes = require("./routes/category.routes");
const problemaRoutes = require("./routes/problem.routes");
const solucionRoutes = require("./routes/solution.routes");
const tagRoutes = require("./routes/tag.routes");

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
app.use("/api/categorias", categoriaRoutes);
app.use("/api/problemas", problemaRoutes);
app.use("/api/soluciones", solucionRoutes);
app.use("/api/tags", tagRoutes);
app.use("/uploads", express.static("uploads"));
// Puerto
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
