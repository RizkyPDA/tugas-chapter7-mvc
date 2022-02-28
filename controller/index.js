const { Portfolio } = require("../models");
const { Message } = require("../models");

// controller untuk render home page
const Home = async (req, res) => {
  const { status } = req.query
  const projectList = await Portfolio.findAll();
  res.render("home", {
    data: projectList,
    status,
  });
};

// controller untuk render halaman create portfolio
const createPortfolio = (req, res) => {
  res.render("createPortfolio");
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

//untuk delete portfolio
const DeletePortfolio = async (req, res) => {
  try {
    const portfolioToDelete = await Portfolio.destroy({
      where: {
        uuid: req.params.uuid,
      },
    });

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

const createMessage = async(req, res) => {
  const { name, email, phone, message } = req.body;
  try {
    const newMessage = await Message.create({
      name,
      email,
      phone,
      message,
    })
  
      if (newMessage) {
        res.redirect("/?status=messagesentsuccessfully");
      }
    } catch (error) {
      console.log('====================================');
      console.log(error);
      console.log('====================================');
      res.redirect("/?status=messagesentfailed");
    }
  
//     .then((message_data) => {
//       res.redirect("/?status=messagesentsuccessfully");
//     })
//     .catch((error) => {
//       console.log(error);
//       res.redirect("/?status=messagesentfailed");
//     });
};

module.exports = {
  Home,
  createPortfolio,
  createPortfolioFunction,
  DetailPortfolio,
  EditPortfolio,
  DeletePortfolio,
  createMessage
};
