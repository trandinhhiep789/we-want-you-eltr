
var router = global.router;

const bodyParser = require('body-parser')

const mongoose = require("mongoose");

let Post = require("../models/PostModel");


//get all post /tuyen dung
router.get("/tuyendung/getall_post", (req, res, next) => {
  Post.find({})
    .limit(100)
    .sort({ tieuDe: 1 })
    .select({
      tieuDe: 1,
      noiDung: 1,
      create_date: 1,
      danhSachUngCuVien: 1,
      diaChi: 1,
      luong: 1,
      userId: 1,
      categoryId: 1,
      imagePost: 1,
    })
    .exec((err, post) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: post,
          count: post.length,
          message: `Successfully`,
        });
      }
    });
});

//get post by id /tuyen dung
router.get("/tuyendung/get_post_by_id", (req, res, next) => {
  console.log(mongoose.Types.ObjectId(req.query.post_id));

  Post.findById(mongoose.Types.ObjectId(req.query.post_id), (err, post) => {
    if (err) {
      res.json({
        result: "failed",
        data: {},
        message: `Error is: ${err}`,
      });
    } else {
      res.json({
        result: "ok",
        data: post,
        message: `Successfully`,
      });
    }
  });
});

// get post by tieuDe /tuyendung
router.get("/tuyendung/get_post_with_tieuDe", (req, res, next) => {
  // criteria tiêu chuẩn
  let criteria = {
    tieuDe: new RegExp(req.query.tieuDe, "i"), // <=> giống %abc% trong sql
  };
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 100;

  Post.find(criteria)
    .limit(limit)
    .sort({ tieuDe: 1 })
    .select({
      tieuDe: 1,
      noiDung: 1,
      create_date: 1,
      danhSachUngCuVien: 1,
      luong: 1,
      diaChi: 1,
      userId: 1,
      categoryId: 1,
      imagePost: 1,
    })
    .exec((err, post) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: post,
          count: post.length,
          message: `Successfully`,
        });
      }
    });
});

//get post by category_id
router.get("/tuyendung/get_post_with_category_id", (req, res, next) => {
  var condition = {
    categoryId: mongoose.Types.ObjectId(req.query.category_id),
  };

  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 100;
  console.log(condition.categoryId);
  console.log(req.query.category_id);

  Post.find(condition)
    .limit(limit)
    .sort({ tenSanPham: 1 })
    .select({
      tieuDe: 1,
      noiDung: 1,
      create_date: 1,
      danhSachUngCuVien: 1,
      luong: 1,
      diaChi: 1,
      userId: 1,
      categoryId: 1,
      imagePost: 1,
    })
    .exec((err, post) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: post,
          count: post.length,
          message: `Successfully`,
        });
      }
    });
});

//get post by user_id
router.get("/tuyendung/get_post_with_user_id", (req, res, next) => {
  var condition = {
    userId: mongoose.Types.ObjectId(req.query.user_id),
  };

  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 100;
  console.log(condition.userId);
  console.log(req.query.user_id);

  Post.find(condition)
    .limit(limit)
    .sort({ tenSanPham: 1 })
    .select({
      tieuDe: 1,
      noiDung: 1,
      create_date: 1,
      luong: 1,
      diaChi: 1,
      danhSachUngCuVien: 1,
      userId: 1,
      imagePost: 1,
      categoryId: 1,
    })
    .exec((err, post) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: post,
          count: post.length,
          message: `Successfully`,
        });
      }
    });
});

// post
router.post("/tuyendung/insert_new_post", (req, res, next) => {
  const newPost = new Post({
    tieuDe: req.body.tieuDe,
    noiDung: req.body.noiDung,
    luong: req.body.luong,
    diaChi: req.body.diaChi,
    imagePost: req.body.imagePost,
    userId: mongoose.Types.ObjectId(req.body.userId),
    categoryId: mongoose.Types.ObjectId(req.body.categoryId),
  });

  console.log(req.body.tieuDe);
  console.log(req.body.noiDung);
  newPost.save((err) => {
    if (err) {
      res.json({
        result: "failed",
        data: {},
        message: `Error is: ${err}`,
      });
    } else {
      res.json({
        result: "ok",
        data: {
          tieuDe: req.body.tieuDe,
          noiDung: req.body.noiDung,
          userId: mongoose.Types.ObjectId(req.body.userId),
          categoryId: mongoose.Types.ObjectId(req.body.categoryId),
          message: `Insert new post succcessfuly`,
        },
      });
    }
  });
});

// update post
router.put("/tuyendung/update_post", (req, res, next) => {
  let condition = {};
  if (mongoose.Types.ObjectId.isValid(req.body.post_id) == true) {
    condition._id = mongoose.Types.ObjectId(req.body.post_id);
  } else {
    res.json({
      result: "failed",
      data: {},
      message: `Ban chua dien id post`,
    });
  }

  let newValues = {};

  // ten dai hon 2 ky tu moi cap nhat
  if (req.body.tieuDe && req.body.tieuDe.length > 2) {
    newValues.tieuDe = req.body.tieuDe;
  }

  if (req.body.noiDung && req.body.noiDung.length > 2) {
    newValues.noiDung = req.body.noiDung;
  }

  if (req.body.luong && req.body.luong.length > 2) {
    newValues.luong = req.body.luong;
  }

  if (req.body.diaChi && req.body.diaChi.length > 2) {
    newValues.diaChi = req.body.diaChi;
  }

  // userId không có chức năng sửa

  if (mongoose.Types.ObjectId.isValid(req.body.post_id) == true) {
    newValues.categoryId = mongoose.Types.ObjectId(req.body.categoryId);
  }
 

  if (req.body.imagePost && req.body.imagePost.length > 2) {
    newValues.imagePost = req.body.imagePost;
  }

  const options = {
    new: true,
    multi: true,
  };

  Post.findOneAndUpdate(
    condition,
    {
      $set: newValues,
    },
    options,
    (err, updatePost) => {
      if (err) {
        res.json({
          result: "failed",
          data: {},
          message: `cannot update: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: updatePost,
          message: `update post Successfully`,
        });
      }
    }
  );
});

// xoa post
router.delete("/tuyendung/delete_post/:id", async (req, res, next) => {
  try {
    const post = await Post.findById(req.params.id);
    await post.remove();
    res.send({ data: "Xóa thành công" });
  } catch {
    res.status(404).send({ error: "Post not found!" });
  }
});

// nộp CV (theo tác đẩy cái user_id của user(ko phải business) 
// vào thuộc tính mảng danhSachUngCuVien[] của PostModel)
router.put("/tuyendung/update_post/nopcv", (req, res, next) => {
    let condition = {};
    if (mongoose.Types.ObjectId.isValid(req.body.post_id) == true) {
      condition._id = mongoose.Types.ObjectId(req.body.post_id);
    } else {
      res.json({
        result: "failed",
        data: {},
        message: `Ban chua dien id post`,
      });
    }
  
  
    Post.findOneAndUpdate(
      condition,
      {
        $addToSet: { danhSachUngCuVien: req.body.user_id },
      },
      (err, updateUser) => {
        if (err) {
          res.json({
            result: "failed",
            data: {},
            message: `cannot update: ${err}`,
          });
        } else {
          res.json({
            result: "ok",
            data: updateUser,
            message: `update user Successfully`,
          });
        }
      }
    );
  });

module.exports = router;
