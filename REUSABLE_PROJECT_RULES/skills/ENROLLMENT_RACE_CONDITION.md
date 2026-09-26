# 🏎️ Skill: Xử lý Race Condition khi Ghi danh Khóa học

---

## 🎯 Vấn đề

Khi nhiều học viên cùng ghi danh vào **suất cuối** của khóa học đồng thời:

```text
Thời điểm T:  capacity = 30, enrolledCount = 29 (còn 1 chỗ)

Student A ─── đọc enrolledCount = 29 ✅ còn chỗ ─── tạo enrollment ─── update count = 30
Student B ─── đọc enrolledCount = 29 ✅ còn chỗ ─── tạo enrollment ─── update count = 31 ❌ VƯỢT CAPACITY!
```

**Hậu quả**: `enrolledCount > capacity` → dữ liệu không nhất quán.

---

## ✅ Giải pháp 1: MongoDB Atomic Update (Khuyến nghị)

Dùng `findOneAndUpdate` với điều kiện `$lt` để đảm bảo tính nguyên tử:

```javascript
// controllers/client/enrollments.controller.js

const enroll = async (req, res, next) => {
  try {
    const { courseId } = req.body;
    const userId = req.user.id; // Lấy từ JWT, KHÔNG từ body

    // 1. Kiểm tra đã ghi danh chưa
    const existingEnrollment = await Enrollment.findOne({ userId, courseId });
    if (existingEnrollment) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đăng ký khóa học này rồi'
      });
    }

    // 2. ATOMIC UPDATE — Tăng enrolledCount CHỈ KHI enrolledCount < capacity
    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        status: 'active',
        $expr: { $lt: ['$enrolledCount', '$capacity'] }
      },
      { $inc: { enrolledCount: 1 } },
      { new: true, runValidators: true }
    );

    // 3. Nếu null → khóa học hết chỗ hoặc không tồn tại
    if (!course) {
      return res.status(400).json({
        success: false,
        message: 'Khóa học đã hết chỗ hoặc không tồn tại'
      });
    }

    // 4. Tạo Enrollment (CHỈ SAU KHI atomic update thành công)
    const enrollment = await Enrollment.create({
      userId,
      courseId,
      enrolledAt: new Date()
    });

    return res.status(201).json({
      success: true,
      message: 'Ghi danh thành công',
      data: enrollment
    });

  } catch (error) {
    // Xử lý duplicate key (compound unique index)
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đăng ký khóa học này rồi'
      });
    }
    next(error);
  }
};
```

### Tại sao an toàn?
- `findOneAndUpdate` là **atomic operation** — MongoDB đảm bảo chỉ 1 request thay đổi document tại 1 thời điểm
- Điều kiện `$expr: { $lt: ['$enrolledCount', '$capacity'] }` chỉ match khi còn chỗ
- Nếu 2 request đến đồng thời, request đầu tiên tăng count → request thứ 2 không match điều kiện → trả null

---

## ✅ Giải pháp 2: MongoDB Transaction (Nâng cao)

Dùng khi cần đảm bảo consistency cao hơn (rollback nếu tạo enrollment thất bại):

```javascript
const mongoose = require('mongoose');

const enrollWithTransaction = async (req, res, next) => {
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const { courseId } = req.body;
    const userId = req.user.id;

    // 1. Lock và kiểm tra capacity (trong session)
    const course = await Course.findOneAndUpdate(
      {
        _id: courseId,
        status: 'active',
        $expr: { $lt: ['$enrolledCount', '$capacity'] }
      },
      { $inc: { enrolledCount: 1 } },
      { new: true, session }
    );

    if (!course) {
      await session.abortTransaction();
      return res.status(400).json({
        success: false,
        message: 'Khóa học đã hết chỗ'
      });
    }

    // 2. Tạo enrollment (trong session)
    const [enrollment] = await Enrollment.create(
      [{ userId, courseId, enrolledAt: new Date() }],
      { session }
    );

    // 3. Commit nếu tất cả thành công
    await session.commitTransaction();

    return res.status(201).json({
      success: true,
      message: 'Ghi danh thành công',
      data: enrollment
    });

  } catch (error) {
    await session.abortTransaction();

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Bạn đã đăng ký khóa học này rồi'
      });
    }
    next(error);

  } finally {
    session.endSession();
  }
};
```

### Lưu ý Transaction:
- MongoDB Transaction yêu cầu **Replica Set** (MongoDB Atlas hỗ trợ sẵn)
- Nếu dùng local MongoDB standalone, cần chuyển sang Replica Set
- Transaction chậm hơn Atomic Update → chỉ dùng khi cần rollback

---

## 🛡️ Lớp bảo vệ bổ sung: Compound Unique Index

```javascript
// models/enrollments.model.js
enrollmentSchema.index({ userId: 1, courseId: 1 }, { unique: true });
```

Dù code logic có bug, **database tự động reject** ghi danh trùng → bảo vệ thêm tầng database.

---

## 📊 So sánh giải pháp

| Tiêu chí | Atomic Update | Transaction |
|----------|---------------|-------------|
| Độ phức tạp | ⭐ Đơn giản | ⭐⭐⭐ Phức tạp |
| Performance | ⚡ Nhanh | 🐌 Chậm hơn |
| Rollback | ❌ Không tự động | ✅ Tự động |
| Yêu cầu DB | Standalone OK | Cần Replica Set |
| **Khuyến nghị** | ✅ Dùng cho bài test | Dùng khi cần nâng cao |

---

*Xử lý Race Condition là điểm nâng cao trong thang điểm — demo được sẽ gây ấn tượng mạnh.*
