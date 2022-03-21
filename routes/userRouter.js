const express = require('express');
const multer = require('multer');
const fs = require('fs');
const userCtrl = require('../controllers/userCtrl');
const tokenAuth = require('../middlewares/tokenAuth');
const authorize = require('../middlewares/authorize');
const router = express.Router();


const dir = './uploads';
if (!fs.existsSync(dir)) fs.mkdirSync(dir);

const storage = multer.diskStorage({
    destination: './uploads',
    filename: function (req, file, cb) {
        const uniqueToken = Date.now() + '-' + Math.round(Math.random() * 1E9);
        const fileName = uniqueToken + '-' + file.originalname;
        req.resume = fileName;
        cb(null, fileName);
    }
});

const upload = multer({ storage: storage });

// public
router.post('/signup', userCtrl.register);
router.post('/signin', userCtrl.signin);

// candidate
router.put('/:email', tokenAuth, upload.single('resume'), userCtrl.update);

// recruiter
router.get('/page/:page/size/:size', tokenAuth, authorize.authorizeRecruiter, userCtrl.getUsers);
router.get('/', tokenAuth, authorize.authorizeRecruiter, userCtrl.getUsers);
router.get('/:email', tokenAuth, userCtrl.getUserByEmail);

// admin
router.post('/recruiter/signup', tokenAuth, authorize.authorizeAdmin, userCtrl.addRecruiter);
// http://localhost:3000/api/users/page/10/size/100

module.exports = router;
