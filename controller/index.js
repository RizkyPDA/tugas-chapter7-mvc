const { Portfolio } = require("../models");

// controller untuk render home page
const Home = async (req, res) => {
	const projectList = await Portfolio.findAll();
	res.render("home", {
		data: projectList,
	});
};

// controller untuk render halaman create portfolio
const createPortfolio = (req, res) => {
	res.render("CreatePortfolio");
};

// untuk function create new portfolio
const createPortfolioFunction = (req, res) => {
	const { project_name, client, category, release_date } = req.body;

	Portfolio.create({
		project_name,
		client,
		category,
		release_date,
	})
		.then((data) => {
			res.redirect("/");
		})
		.catch((error) => {
			console.log(error);
			res.redirect("/");
		});
};

const DetailPortfolio = async (req, res) => {
	const detailPortfolio = await Portfolio.findOne({
		where: {
			uuid: req.params.id,
		},
	});

	res.render("detailPortfolio", {
		data: detailPortfolio,
	});
};

const EditPortfolio = async (req, res) => {
	const editPortfolio = await Portfolio.findOne({
		where: {
			uuid: req.params.id,
		},
	});

	res.render("editPortfolio", {
		data: editPortfolio,
	});
};

const EditPortfolioFunction = async (req, res) => {
	const { project_name, client, category, release_date } = req.body;

	try {
		const portfolioToEdit = await Portfolio.findOne({
			where: {
				uuid: req.params.id,
			},
		});

		const portfolioEdited = await portfolioToEdit.update({
			project_name,
			client,
			category,
			release_date,
		});

		if (portfolioEdited) {
			res.redirect("/");
		}
	} catch (error) {
		console.log(error);
		res.redirect("/");
	}
};

//untuk delete portfolio
const DeletePortfolioFunction = async (req, res) => {
	try {
		const portfolioToDelete = await Portfolio.findOne({
			where: {
				uuid: req.params.id,
			},
		});

		await portfolioToDelete.destroy();

		if (portfolioToDelete) {
			res.redirect("/");
		}
	} catch (error) {
		console.log("====================================");
		console.log(error);
		console.log("====================================");
		res.redirect("/");
	}
};

module.exports = {
	Home,
	createPortfolio,
	createPortfolioFunction,
	DetailPortfolio,
	EditPortfolio,
	EditPortfolioFunction,
	DeletePortfolioFunction,
};
