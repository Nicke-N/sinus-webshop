const router = require("express").Router();
const productController = require("../controllers/productController");
const auth = require('../middlewares/authorization');

router.post("/", auth.admin, productController.create);

router.get("/", productController.getAll);
router.get("/:id", productController.get);

router.patch("/:id", auth.admin, productController.update);

router.delete("/:id", auth.admin, productController.delete);
router.delete("/", auth.admin, productController.deleteAll);


module.exports = router;
