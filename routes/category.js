

var router = global.router;
let Category = require("../models/CategoryModel");
const mongoose = require("mongoose");

router.get("/tuyendung/getall-category", function (req, res, next) {
  Category.find({})
    .limit(100)
    .sort({ tenSanPham: 1 })
    .select({
      tenLinhVuc: 1,
      description: 1,
      create_date: 1,
    })
    .exec((err, category) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: category,
          count: category.length,
          message: `Successfully`,
        });
      }
    });
});

//get category by id
router.get("/tuyendung/get_category_by_id", function (req, res, next) {
  console.log(mongoose.Types.ObjectId(req.query.category_id));

  Category.findById(
    mongoose.Types.ObjectId(req.query.category_id),
    (err, category) => {
      if (err) {
        res.json({
          result: "failed",
          data: {},
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: category,
          message: `Successfully`,
        });
      }
    }
  );
});

router.post("/tuyendung/insert_new_category", (req, res, next) => {
  const criteria = {
    tenLinhVuc: new RegExp("^" + req.body.tenLinhVuc.trim() + "$", "i"),
  };
  Category.find(criteria)
    .limit(1)
    .exec((err, categories) => {
      // ton tai, khong cho them
      if (err) {
        res.json({
            result: "failed",
            data: [],
            message: `Error is: ${err}`,
          });
      } else {
        if (categories.length > 0) {
            res.json({
                result: "failed",
                data: [],
                message: `Loai san pham da ton tai!`,
              });
        } else {
          const newCategory = new Category({
            tenLinhVuc: req.body.tenLinhVuc,
            description: req.body.description,
          });

          newCategory.save((err, addCategory) => {
            if (err) {
              res.json({
                result: "failed",
                data: {},
                message: `Error is: ${err}`,
              });
            } else {
              res.json({
                result: "ok",
                data: addCategory,
                message: `Insert new category succcessfuly`,
              });
            }
          });
        }
      }
    });
});

router.delete("/tuyendung/delete_category/:id", async (req, res, next) => {
  try{
      const category = await Category.findById(req.params.id);
      await category.remove();
      res.send({data: "Xóa thành công"})
  }catch{
      res.status(404).send({error: "User not found!"})
  }

});

module.exports = router;
