const router = require("express").Router();
const { Home, createPortfolio, createPortfolioFunction, DetailPortfolio, EditPortfolio, DeletePortfolio, createMessage } = require("../controller");

// untuk render halaman home page
router.get("/", Home);
// untuk render halaman create portfolio
router.get("/create", createPortfolio);
// untuk post data ke database
router.post("/create", createPortfolioFunction);

router.get("/detail/:id", DetailPortfolio);

router.get("/Edit/:id", EditPortfolio);

router.post("delete/:id", DeletePortfolio);

router.post("/message", createMessage);

module.exports = router;
