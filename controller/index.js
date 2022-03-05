const { Portfolio, File } = require("../models");
const { Op } = require("sequelize");
const fs = require("fs");

// controller untuk render home page
const Home = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1
    const itemPerPage = 6
    const { project_name, client, category, release_date_from, release_date_to } = req.query

    const where = {}

    if (project_name) {
      where["project_name"] = { [Op.iLike]: `%${project_name}%`};
    }

    if (client) {
      where["client"] = { [Op.iLike]: `%${client}%`};
    }

    if (category) {
      where["category"] = { [Op.like]: `${category}`};
    }

    if (release_date_from && release_date_to) {
      where["release_date"] = { [Op.between]: [release_date_from, release_date_to] };
    } else if (release_date_from) {
      where["release_date"] = { [Op.gte]: release_date_from };
    } else if (release_date_to) {
      where["release_date"] = { [Op.lte]: release_date_to };
    }

    const categoryList = await Portfolio.findAll({
      attributes: ["category"],
      group: "category",
      order: [["category", "ASC"]]
    })

    // console.log(categoryList);

    const projectList = await Portfolio.findAndCountAll({
      distinct: true,
      where: where,
      include: ["image"],
      order: [["release_date", "DESC"]],
      limit: itemPerPage,
      offset: (page - 1) * itemPerPage
    });

    // console.log(projectList.rows);

    res.render("home", {
      data: projectList.rows,
      currentPage: page,
      totalPage: Math.ceil(projectList.count / itemPerPage),
      nextPage: page + 1,
      prevPage: (page - 1) == 0 ? 1 : page - 1,
      query: req.query,
      categoryList
    }); 
  } catch (error) {
    console.log(error);
  }
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
    const portfolioToDelete = await Portfolio.findOne({
      where: {
        uuid: req.params.id,
      },
      include: ["image"]
    });

    if (portfolioToDelete.image.length > 0) {
      for (const imageToDelete of portfolioToDelete.image) {
        await File.destroy({
          where: {
            uuid: imageToDelete.uuid
          }
        })

        fs.rmSync(__dirname + '/../public' + imageToDelete.file_url)
      }
    }

    console.log(portfolioToDelete);

    await portfolioToDelete.destroy()

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
