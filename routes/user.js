var router = global.router;

let User = require("../models/UserModel");
const mongoose = require("mongoose");

// password handle
const bcrypt = require("bcrypt");

//get all user /tuyen dung
router.get("/tuyendung/getall_user", function (req, res, next) {
  User.find({})
    .limit(100)
    .sort({ tenUser: 1 })
    .select({
      tenUser: 1,
      hoVaTen: 1,
      moTa: 1,
      loaiUser: 1,
      email: 1,
      passWord: 1,
      create_date: 1,
      diaChi: 1,
      diaChi: 1,
      mucTieuNgheNghiep: 1,
      soNamKinhNghiem: 1,
      tenTruong: 1,
      tinhTrang: 1,
      imageUrl: 1,
      imageUrlCover: 1,
      soDienThoai: 1,
      kinhNghiemLamViec: 1,
      cacKiNang: 1,
      soThich: 1,
      hoatDong: 1,
      nguoiThamChieu: 1,
      mauCvChinh: 1,
    })
    .exec((err, user) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: user,
          count: user.length,
          message: `Successfully`,
        });
      }
    });
});

//get user by id /tuyen dung
router.get("/tuyendung/get_user_by_id", function (req, res, next) {
  console.log(mongoose.Types.ObjectId(req.query.user_id));

  User.findById(mongoose.Types.ObjectId(req.query.user_id), (err, user) => {
    if (err) {
      res.json({
        result: "failed",
        data: {},
        message: `Error is: ${err}`,
      });
    } else {
      res.json({
        result: "ok",
        data: user,
        message: `Successfully`,
      });
    }
  });
});

// get user by tenUser /tuyendung
router.get("/tuyendung/get_user_with_tenUser", function (req, res, next) {
  // criteria tiêu chuẩn
  let criteria = {
    tenUser: new RegExp(req.query.tenUser, "i"), // <=> giống %abc% trong sql
  };
  const limit = parseInt(req.query.limit) > 0 ? parseInt(req.query.limit) : 100;

  User.find(criteria)
    .limit(limit)
    .sort({ tenUser: 1 })
    .select({
      mauCvChinh:1,
      tenUser: 1,
      hoVaTen: 1,
      moTa: 1,
      loaiUser: 1,
      email: 1,
      passWord: 1,
      create_date: 1,
      diaChi: 1,
      diaChi: 1,
      mucTieuNgheNghiep: 1,
      soNamKinhNghiem: 1,
      tenTruong: 1,
      tinhTrang: 1,
      imageUrl: 1,
      imageUrlCover: 1,
      soDienThoai: 1,
      kinhNghiemLamViec: 1,
      cacKiNang: 1,
      soThich: 1,
      hoatDong: 1,
      nguoiThamChieu: 1,
    })
    .exec((err, user) => {
      if (err) {
        res.json({
          result: "failed",
          data: [],
          message: `Error is: ${err}`,
        });
      } else {
        res.json({
          result: "ok",
          data: user,
          count: user.length,
          message: `Successfully`,
        });
      }
    });
});

// sign up
router.post("/tuyendung/signup", (req, res) => {
  let { tenUser, email, passWord, loaiUser } = req.body;
  tenUser.trim();
  email.trim();
  passWord.trim();

  if (tenUser == "" || email == "" || passWord == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields",
    });
  }
  // else if (!/^[a-zA-Z ]*$/.test(tenUser)){
  //     res.json({
  //         status: "FAILED",
  //         message: "Ten khong chua ki tu so"
  //     })
  // }
  else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "email Err",
    });
  } else if (passWord.length < 3) {
    res.json({
      status: "FAILED",
      message: "passWord it nhat 3 kí tự",
    });
  } else {
    // kt xem user có tồn tại chưa
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.json({
            status: "FAILED",
            message: "account đã tồn tại",
          });
        } else {
          // thu tao account moi

          // password handling
          const saltRounds = 10;
          bcrypt.hash(passWord, saltRounds).then((hashedPassword) => {
            const newUser = new User({
              tenUser,
              email,
              passWord: hashedPassword,
              loaiUser,
            });

            newUser
              .save()
              .then((result) => {
                res.json({
                  status: "SUCCESS",
                  message: "Signup successful",
                  data: result,
                });
              })
              .catch((err) => {
                {
                  res.json({
                    status: "FAILED",
                    message: `có lỗi xay ra trong khi tao user! err: ${err}`,
                  });
                }
              });
          });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "có lỗi xay ra trong khi kiem tra ton tai user!",
        });
      });
  }
});

// signin
router.post("/tuyendung/signin", (req, res) => {
  let { email, passWord } = req.body;
  email = email.trim();
  passWord = passWord.trim();

  if (email == "" || passWord == "") {
    res.json({
      status: "FAILED",
      message: "Empty input fields",
    });
  } else {
    // kiem tra xem có tồn tại
    User.find({ email })
      .then((data) => {
        if (data.length) {
          // User tồn tại

          const hashedPassword = data[0].passWord;
          bcrypt
            .compare(passWord, hashedPassword)
            .then((result) => {
              if (result) {
                // trùng password
                res.json({
                  status: "SUCCESS",
                  message: "Signin Successful",
                  data: data,
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "mat khau khong hop le!",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "Có lõi xảy ra trong quá trình so sánh password",
              });
            });
        } else {
          res.json({
            status: "FAILED",
            message: "Thong tin dang nhap khong lệ",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "Có lỗi xảy ra trong quá trình kiểm tra sự tồn tại của user",
        });
      });
  }
});

// update user
// update user sẽ không cần phải update tenTruong và tình trạng
router.put("/tuyendung/update_user", function (req, res, next) {
  let condition = {};
  if (mongoose.Types.ObjectId.isValid(req.body.user_id) == true) {
    condition._id = mongoose.Types.ObjectId(req.body.user_id);
  } else {
    res.json({
      result: "failed",
      data: {},
      message: `Ban chua dien id user`,
    });
  }

  let newValues = {};

  // ten dai hon 2 ky tu moi cap nhat
  if (req.body.tenUser && req.body.tenUser.length > 2) {
    newValues.tenUser = req.body.tenUser;
  }

  if (req.body.cacKiNang && req.body.cacKiNang.length > 2) {
    newValues.cacKiNang = req.body.cacKiNang;
  }

  if (req.body.soThich && req.body.soThich.length > 2) {
    newValues.soThich = req.body.soThich;
  }

  if (req.body.hoVaTen && req.body.hoVaTen.length > 2) {
    newValues.hoVaTen = req.body.hoVaTen;
  }

  if (req.body.hoatDong && req.body.hoatDong.length > 2) {
    newValues.hoatDong = req.body.hoatDong;
  }

  if (req.body.nguoiThamChieu && req.body.nguoiThamChieu.length > 2) {
    newValues.nguoiThamChieu = req.body.nguoiThamChieu;
  }

  // không được cập nhật email!

  // Update Images
  if (req.body.imageName && req.body.imageName.length > 0) {
    newValues.imageUrl = req.body.imageName;
  }

  // Update Images Cover
  if (req.body.imageNameCover && req.body.imageNameCover.length > 0) {
    newValues.imageUrlCover = req.body.imageNameCover;
  }

  // update loai user
  if (req.body.loaiUser) {
    newValues.loaiUser = req.body.loaiUser;
  }

  // dia chi
  if (req.body.diaChi && req.body.diaChi.length > 0) {
    newValues.diaChi = req.body.diaChi;
  }

  // muc tieu nghe nghiep
  if (req.body.mucTieuNgheNghiep && req.body.mucTieuNgheNghiep.length > 0) {
    newValues.mucTieuNgheNghiep = req.body.mucTieuNgheNghiep;
  }

  if (req.body.kinhNghiemLamViec && req.body.kinhNghiemLamViec.length > 0) {
    newValues.kinhNghiemLamViec = req.body.kinhNghiemLamViec;
  }

  if (req.body.tenTruong && req.body.tenTruong.length > 0) {
    newValues.tenTruong = req.body.tenTruong;
  }

  if (req.body.tinhTrang && req.body.tinhTrang.length > 0) {
    newValues.tinhTrang = req.body.tinhTrang;
  }

  if (req.body.moTa && req.body.moTa.length > 0) {
    newValues.moTa = req.body.moTa;
  }
  if (req.body.soDienThoai) {
    newValues.soDienThoai = req.body.soDienThoai;
  }

  if (req.body.mauCvChinh) {
    newValues.mauCvChinh = req.body.mauCvChinh;
  }

  if (req.body.soNamKinhNghiem) {
    newValues.soNamKinhNghiem = req.body.soNamKinhNghiem;
  }

  if (mongoose.Types.ObjectId.isValid(req.body.user_id) == true) {
    newValues.categoryId = mongoose.Types.ObjectId(req.body.categoryId);
  }

  const options = {
    new: true,
    multi: true,
  };

  User.findOneAndUpdate(
    condition,
    {
      $set: newValues,
    },
    options,
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

// xoa user
router.delete("/tuyendung/delete_user/:id", async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);
    await user.remove();
    res.send({ data: "Xóa thành công" });
  } catch {
    res.status(404).send({ error: "User not found!" });
  }
});

module.exports = router;
