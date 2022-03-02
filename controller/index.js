const { Portfolio, File } = require("../models");
const fs = require("fs");

// controller untuk render home page
const Home = async (req, res) => {
  const projectList = await Portfolio.findAll({
    include: ["image"],
  });
  res.render("home", {
    data: projectList,
  });
};

// controller untuk render halaman create portfolio
const createPortfolio = (req, res) => {
  res.render("CreatePortfolio");
};

// untuk function create new portfolio
const createPortfolioFunction = async (req, res) => {
  console.log(req.files);
  const { project_name, client, category, release_date } = req.body;

  Portfolio.create({
    project_name,
    client,
    category,
    release_date,
  })
    .then(async (data) => {
      if (req.files.length > 0) {
        for (const item of req.files) {
          await File.create({
            file_url: `/images/${item.filename}`,
            file_name: item.filename,
            file_size: item.size,
            original_filename: item.originalname,
            owner_uuid: data.uuid,
          });
        }
      }
      res.redirect("/");
    })
    .catch((error) => {
      console.log("====================================");
      console.log(error);
      console.log("====================================");
      res.redirect("/");
    });
};

// const DetailPortfolio = async (req, res) => {
//   const detailPortfolio = await Portfolio.findOne({
//     where: {
//       uuid: req.params.id,
//     },
//   });

//   res.render("detailPortfolio", {
//     data: detailPortfolio,
//   });
// };

const EditPortfolio = async (req, res, next) => {
  try {
    const editPortfolio = await Portfolio.findOne({
      where: {
        uuid: req.params.id,
      },
    });

    if (editPortfolio) {
      res.render("editPortfolio", {
        data: editPortfolio,
      });
    } else {
      next();
    }
  } catch (error) {
    next();
  }
};

// untuk Edit book
const EditPortfolioFunction = async (req, res) => {
  const { project_name, client, category, release_date } = req.body;
  // console.log(req.body);
  try {
    const portfolioToUpdate = await Portfolio.findOne({
      where: {
        uuid: req.params.id,
      },
      include: ["image"],
    });
    console.log("====================================");
    // console.log(req.files);
    console.log("====================================");

    // kalau user upload gambar baru
    if (req.files.length > 0) {
      // buat gambar baru di table file
      for (const item of req.files) {
        await File.create({
          file_url: `/images/${item.filename}`,
          file_name: item.filename,
          file_size: item.size,
          original_filename: item.originalname,
          owner_uuid: portfolioToUpdate.uuid,
        });
      }
      // check apakah buku punya gambar sebelumnya
      if (portfolioToUpdate.image.length > 0) {
        // lakukan proses delete gambar kalau ada gambarnya
        for (const oldImage of bookToUpdate.image) {
          // delete entry gambar di table file yang digunakan untuk mencatat kepemilikan gambar
          await File.destroy({
            where: {
              uuid: oldImage.uuid,
            },
          });
          // delete gambar yang ada di folder public
          fs.rmSync(__dirname + "/../public" + oldImage.file_url);
        }
      }
    }
    const portfolioUpdated = await portfolioToUpdate.update({
      project_name,
      client,
      category,
      release_date,
    });

    if (portfolioUpdated) {
      res.redirect("/");
    }
  } catch (error) {
    console.log("====================================");
    console.log(error);
    console.log("====================================");
    res.redirect("/");
  }
};
//untuk delete portfolio
const DeletePortfolio = async (req, res) => {
  try {
    const portfolioToDelete = await Portfolio.destroy({
      where: {
        uuid: req.params.id,
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

module.exports = {
  Home,
  createPortfolio,
  createPortfolioFunction,
  EditPortfolio,
  EditPortfolioFunction,
  DeletePortfolio,
};
