// serverecom.js
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const multer = require('multer');
const path = require('path');
// const upload = multer({ dest: 'uploads/' });
const app = express();
app.use(cors());
app.use('/uploads', express.static('uploads'));

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage });

// MySQL connection setup
const db = mysql.createConnection({
    host: '127.0.0.1',  // địa chỉ localhost của mysql
    port: 3306,          // MySQL port
    user: 'root',        // username của mysql
    password: '123456789',  // password của mysql
    database: 'ecommerce'   // database
});

db.connect((err) => {
    if (err) throw err;
    console.log('MySQL Connected...');
});

// API lấy danh mục từ `categoriesofhome`
app.get("/api/ecommerce/home", (req, res) => {
  const query = "SELECT * FROM categoriesofhome";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn categoriesofhome: ", err);
      res.status(500).json({ error: "Lỗi máy chủ" });
      return;
    }
    res.status(200).json(results);
  });
});

app.get("/api/ecommerce/deals", (req, res) => {
    const query = "SELECT * FROM deals";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn deals: ", err);
        res.status(500).json({ error: "Lỗi máy chủ" });
        return;
      }
      res.status(200).json(results);
    });
  });

// API lấy danh mục từ `recommendations`
app.get("/api/ecommerce/recommendations", (req, res) => {
  const query = "SELECT * FROM recommendations";
  db.query(query, (err, results) => {
    if (err) {
      console.error("Lỗi khi truy vấn recommendations: ", err);
      res.status(500).json({ error: "Lỗi máy chủ" });
      return;
    }
    res.status(200).json(results);
  });
});

app.get("/api/ecommerce/categoriesofelectronic", (req, res) => {
    const query = "SELECT * FROM categoriesofelectronic";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn categoriesofelectronic: ", err);
        res.status(500).json({ error: "Lỗi máy chủ" });
        return;
      }
      res.status(200).json(results);
    });
});

app.get("/api/ecommerce/productsofelectronics", (req, res) => {
    const query = "SELECT * FROM productsofelectronics";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn productsofelectronics: ", err);
        res.status(500).json({ error: "Lỗi máy chủ" });
        return;
      }
      res.status(200).json(results);
    });
});

app.get("/api/ecommerce/productsoffresh", (req, res) => {
    const query = "SELECT * FROM productsoffresh";
    db.query(query, (err, results) => {
      if (err) {
        console.error("Lỗi khi truy vấn productsoffresh: ", err);
        res.status(500).json({ error: "Lỗi máy chủ" });
        return;
      }
      res.status(200).json(results);
    });
});

app.get("/api/ecommerce/paymentmethods", (req, res) => {
    const accountID = req.query.accountID; // Lấy accountID từ query params
    const query = "SELECT * FROM paymentmethods WHERE accountID = ?";
    db.query(query, [accountID], (err, results) => {
        if (err) {
            console.error("Lỗi khi truy vấn paymentmethods: ", err);
            res.status(500).json({ error: "Lỗi máy chủ" });
            return;
        }
        res.status(200).json(results);
    });
});

// Lấy danh sách từ bảng brandpayment
app.get('/api/ecommerce/brandpayment', (req, res) => {
    const query = 'SELECT * FROM brandpayment';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Lỗi khi truy vấn brandpayment:', err);
            res.status(500).json({ error: 'Lỗi máy chủ' });
            return;
        }
        res.status(200).json(results);
    });
});

// Lưu thông tin thanh toán vào paymentmethods
// app.post('/api/ecommerce/add-paymentmethods', express.json(), (req, res) => {
//     const { type, number, email, brand, accountID, brandID } = req.body;

//     const query = `
//         INSERT INTO paymentmethods (type, number, email, brand, accountID, brandID)
//         VALUES (?, ?, ?, ?, ?, ?)
//     `;
//     db.query(query, [type, number || null, email || null, brand, accountID, brandID], (err, result) => {
//         if (err) {
//             console.error('Lỗi khi thêm phương thức thanh toán:', err);
//             res.status(500).json({ error: 'Lỗi máy chủ' });
//             return;
//         }
//         // Trả về phương thức thanh toán mới được thêm
//         const newPaymentMethod = {
//             id: result.insertId, // Lấy id của bản ghi mới được thêm
//             type,
//             number,
//             email,
//             brand,
//             accountID,
//             brandID
//         };
//         res.status(200).json(newPaymentMethod);
//     });
// });
app.post('/api/ecommerce/add-paymentmethods', express.json(), (req, res) => {
    const { type, number, email, brand, accountID, brandID } = req.body;

    // Lấy MAX(id) hiện tại từ bảng paymentmethods
    const getMaxIdQuery = 'SELECT MAX(id) AS maxId FROM paymentmethods';
    db.query(getMaxIdQuery, (err, result) => {
        if (err) {
            console.error('Lỗi khi lấy MAX(id):', err);
            res.status(500).json({ error: 'Lỗi máy chủ' });
            return;
        }

        const maxId = result[0].maxId || 0; // Nếu bảng rỗng, maxId là 0
        const newId = maxId + 1;

        // Thêm dữ liệu vào bảng paymentmethods với id mới
        const insertQuery = `
            INSERT INTO paymentmethods (id, type, number, email, brand, accountID, brandID)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [newId, type, number || null, email || null, brand, accountID, brandID], (err, result) => {
            if (err) {
                console.error('Lỗi khi thêm phương thức thanh toán:', err);
                res.status(500).json({ error: 'Lỗi máy chủ' });
                return;
            }

            // Trả về phương thức thanh toán mới được thêm
            const newPaymentMethod = {
                id: newId, // ID đã được tạo thủ công
                type,
                number,
                email,
                brand,
                accountID,
                brandID,
            };
            res.status(200).json(newPaymentMethod);
        });
    });
});

app.post('/api/ecommerce/bill', express.json(), (req, res) => {
    const { address, phone, accountID, paymentID } = req.body;

    const query = 'INSERT INTO bill (address, phone, accountID, paymentID) VALUES (?, ?, ?, ?)';
    db.query(query, [address, phone, accountID, paymentID], (err, result) => {
        if (err) {
            console.error('Lỗi khi lưu hóa đơn: ', err);
            res.status(500).json({ error: 'Lỗi máy chủ' });
        } else {
            res.status(200).json({ message: 'Hóa đơn đã được lưu thành công' });
        }
    });
});

app.get('/bills', (req, res) => {
    const query = `
        SELECT 
            bill.billID, 
            bill.address, 
            bill.phone, 
            account.name, 
            account.id,
            paymentmethods.brand
        FROM 
            bill
        INNER JOIN account ON bill.accountID = account.id
        INNER JOIN paymentmethods ON bill.paymentID = paymentmethods.id
        ORDER BY bill.billID ASC
    `;
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Endpoint to fetch all accounts
app.get('/accounts', (req, res) => {
    const query = 'SELECT * FROM account';
    db.query(query, (err, result) => {
        if (err) throw err;
        res.json(result);
    });
});

// Endpoint để đăng nhập
app.post('/login', express.json(), (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Account WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }
        if (result.length > 0) {
            // Check the user's role and send it in the response
            res.json({ 
                message: 'Login successful', 
                user: result[0], 
                role: result[0].role // Send role information
            });
        } else {
            res.status(401).json({ message: 'Invalid username or password' });
        }
    });
});

// Endpoint để lưu phản hồi vào cơ sở dữ liệu
app.post('/submit-feedback', upload.single('image'), (req, res) => {
    const { comment, accountID } = req.body; // Nhận thêm accountID từ client
    const days = new Date().toISOString().split('T')[0];
    const image = req.file ? req.file.filename : null; // Gán null nếu không có ảnh

    // Lấy MAX(idfb) hiện tại từ bảng feedback
    const getMaxIdQuery = 'SELECT MAX(idfb) AS maxId FROM feedback';
    db.query(getMaxIdQuery, (err, result) => {
        if (err) {
            console.error('Lỗi khi lấy MAX(idfb):', err);
            return res.status(500).json({ error: 'Lỗi máy chủ.' });
        }

        const maxId = result[0].maxId || 0; // Nếu bảng rỗng, maxId là 0
        const newId = maxId + 1;

        // Thêm phản hồi mới vào bảng feedback với idfb mới
        const insertQuery = `
            INSERT INTO feedback (idfb, comment, days, image, accountID)
            VALUES (?, ?, ?, ?, ?)
        `;
        const values = [newId, comment, days, image, accountID];

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Lỗi khi thêm phản hồi vào cơ sở dữ liệu:', err);
                return res.status(500).json({ error: 'Lỗi máy chủ.' });
            }

            res.status(201).json({ message: 'Phản hồi đã được lưu thành công.', feedbackId: newId });
        });
    });
});

app.get("/api/ecommerce/feedback", (req, res) => {
    const query = `
        SELECT 
            feedback.idfb AS id,
            feedback.comment,
            feedback.days,
            feedback.image,
            account.name,
            account.avatar
        FROM feedback
        JOIN account ON feedback.accountID = account.id
        ORDER BY feedback.idfb ASC
    `;
    db.query(query, (err, results) => {
        if (err) {
            console.error("Lỗi khi truy vấn feedback: ", err);
            res.status(500).json({ error: "Lỗi máy chủ" });
            return;
        }
        res.status(200).json(results);
    });
});

// API thêm sản phẩm electronics mới
app.post('/api/add-productelectronics', upload.single('image'), (req, res) => {
    const { name, price, rating, description, status, category } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !price || !rating || !category || !req.file) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin và tải lên ảnh.' });
    }

    const imagePath = `http://localhost:3000/uploads/${req.file.filename}`;

    // Lấy MAX(id) hiện tại trong bảng productsofelectronics
    const getMaxIdQuery = 'SELECT MAX(id) AS maxId FROM productsofelectronics';
    db.query(getMaxIdQuery, (err, result) => {
        if (err) {
            console.error('Lỗi khi lấy MAX(id):', err);
            return res.status(500).json({ error: 'Lỗi máy chủ.' });
        }

        const maxId = result[0].maxId || 0; // Nếu bảng rỗng, maxId là 0
        const newId = maxId + 1;

        // Thêm sản phẩm mới với id mới
        const insertQuery = `
            INSERT INTO productsofelectronics (id, name, price, rating, image, description, status, category)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [newId, name, price, rating, imagePath, description, status, category];

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Lỗi khi thêm sản phẩm:', err);
                return res.status(500).json({ error: 'Lỗi máy chủ.' });
            }

            res.status(201).json({ message: 'Thêm sản phẩm thành công.', productId: newId });
        });
    });
});

// API thêm sản phẩm fresh mới
app.post('/api/add-productfresh', upload.single('image'), (req, res) => {
    const { name, price, rating, description, category } = req.body;

    // Kiểm tra dữ liệu đầu vào
    if (!name || !price || !rating || !category || !req.file) {
        return res.status(400).json({ error: 'Vui lòng điền đầy đủ thông tin và tải lên ảnh.' });
    }

    const imagePath = `http://localhost:3000/uploads/${req.file.filename}`;

    // Lấy MAX(id) hiện tại trong bảng productsoffresh
    const getMaxIdQuery = 'SELECT MAX(id) AS maxId FROM productsoffresh';
    db.query(getMaxIdQuery, (err, result) => {
        if (err) {
            console.error('Lỗi khi lấy MAX(id):', err);
            return res.status(500).json({ error: 'Lỗi máy chủ.' });
        }

        const maxId = result[0].maxId || 0; // Nếu bảng rỗng, maxId là 0
        const newId = maxId + 1;

        // Thêm sản phẩm mới với id mới
        const insertQuery = `
            INSERT INTO productsoffresh (id, name, price, rating, image, description, category)
            VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [newId, name, price, rating, imagePath, description, category];

        db.query(insertQuery, values, (err, result) => {
            if (err) {
                console.error('Lỗi khi thêm sản phẩm:', err);
                return res.status(500).json({ error: 'Lỗi máy chủ.' });
            }

            res.status(201).json({ message: 'Thêm sản phẩm thành công.', productId: newId });
        });
    });
});

// Endpoint để đăng ký tài khoản
app.post('/register', upload.single('avatar'), (req, res) => {
    const { username, password, name, email } = req.body;
    const avatar = req.file ? req.file.filename : null;
    const dateAdded = new Date();
    const lastActive = dateAdded;
    const role = 'User'; // Set the role to 'User' by default

    const checkQuery = 'SELECT * FROM account WHERE username = ? OR email = ?';
    db.query(checkQuery, [username, email], (err, result) => {
        if (err) {
            return res.status(500).send({ error: 'Database error' });
        }
        if (result.length > 0) {
            return res.status(409).send({ error: 'Username or email already exists' });
        }

        const insertQuery = `
            INSERT INTO account (username, password, name, email, role, avatar, dateAdded, lastActive)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        db.query(insertQuery, [username, password, name, email, role, avatar, dateAdded, lastActive], (err, result) => {
            if (err) {
                return res.status(500).send({ error: 'Database error' });
            }
            // res.status(201).send({ message: 'User registered successfully' });
            const fetchNewUserQuery = 'SELECT * FROM account WHERE id = ?';
            db.query(fetchNewUserQuery, [result.insertId], (err, newUser) => {
                if (err) {
                    return res.status(500).send({ error: 'Database error' });
                }
                res.status(201).send({ message: 'User registered successfully', user: newUser[0] });
            });
        });
    });
});

// Endpoint để đổi mật khẩu
app.put('/reset-password', express.json(), (req, res) => {
    const { username, password } = req.body;

    // Kiểm tra xem username có tồn tại trong cơ sở dữ liệu không
    const checkQuery = 'SELECT * FROM Account WHERE username = ?';
    db.query(checkQuery, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        // Nếu username không tồn tại
        if (result.length === 0) {
            return res.status(404).json({ message: 'Username does not exist' });
        }

        // Cập nhật mật khẩu mới
        const updateQuery = 'UPDATE Account SET password = ? WHERE username = ?';
        db.query(updateQuery, [password, username], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Password reset successful' });
        });
    });
});

// Endpoint để xóa tài khoản
app.delete('/delete-account', express.json(), (req, res) => {
    const { username } = req.body;

    // Kiểm tra xem username có tồn tại không
    const checkQuery = 'SELECT * FROM Account WHERE username = ?';
    db.query(checkQuery, [username], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Database error' });
        }

        // Nếu không tìm thấy tài khoản
        if (result.length === 0) {
            return res.status(404).json({ message: 'Username does not exist' });
        }

        // Xóa tài khoản
        const deleteQuery = 'DELETE FROM Account WHERE username = ?';
        db.query(deleteQuery, [username], (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Database error' });
            }
            res.json({ message: 'Account deleted successfully' });
        });
    });
});

// Endpoint to update user
// app.put('/update-user', express.json(), (req, res) => {
//     const { id, name, password, avatar } = req.body;
//     const dateUpdated = new Date();  // Set current date for dateAdded and lastActive
//     const query = `
//         UPDATE Account 
//         SET 
//             name = ?, 
//             password = ?, 
//             avatar = ?, 
//             dateAdded = ?, 
//             lastActive = ? 
//         WHERE id = ?
//     `;
    
//     db.query(query, [name, password, avatar, dateUpdated, dateUpdated, id], (err, result) => {
//         if (err) {
//             return res.status(500).json({ error: 'Database error' });
//         }
//         res.json({ message: 'User updated successfully' });
//     });
// });
app.put('/update-user', upload.single('avatar'), (req, res) => {
    const { id, name, password } = req.body;
    const avatar = req.file ? req.file.filename : null;
  
    const query = `
        UPDATE account 
        SET name = ?, password = ?, avatar = ?
        WHERE id = ?
    `;
    db.query(query, [name, password, avatar, id], (err, result) => {
      if (err) return res.status(500).json({ error: 'Database error' });
      res.json({ message: 'User updated successfully', user: { id, name, password, avatar } });
    });
});

app.listen(3000, () => {
    console.log('Server running on port 3000');
});