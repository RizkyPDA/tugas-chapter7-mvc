const router = require("express").Router();
const { Home, createPortfolio, createPortfolioFunction, EditPortfolio, EditPortfolioFunction, DeletePortfolio } = require("../controller");

//middleware untuk upload image
const uploadImage = require("../utils/uploadImage");

// untuk render halaman home page
router.get("/", Home);
// untuk render halaman create portfolio
router.get("/create", createPortfolio);
// untuk post data ke database
router.post("/create", uploadImage.array("image", 3), createPortfolioFunction);

router.get("/edit/:id", EditPortfolio);

router.post("/edit/:id", uploadImage.array("image", 3), EditPortfolioFunction);

router.post("/delete/:id", DeletePortfolio);

module.exports = router;
