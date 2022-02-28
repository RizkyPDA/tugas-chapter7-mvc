const router = require("express").Router();
const {
	Home,
	createPortfolio,
	createPortfolioFunction,
	DetailPortfolio,
	EditPortfolio,
	EditPortfolioFunction,
	DeletePortfolioFunction,
} = require("../controller");

// untuk render halaman home page
router.get("/", Home);
// untuk render halaman create portfolio
router.get("/create", createPortfolio);
// untuk post data ke database
router.post("/create", createPortfolioFunction);

router.get("/detail/:id", DetailPortfolio);

// untuk render halaman edit portfolio
router.get("/edit/:id", EditPortfolio);

// untuk update portfolio
router.post("/edit/:id", EditPortfolioFunction);

// untuk delete portfolio
router.post("/delete/:id", DeletePortfolioFunction);

module.exports = router;
