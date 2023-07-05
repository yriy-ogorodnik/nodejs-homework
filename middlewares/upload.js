const multer = require("multer")
const path = require("path")

// тимчасова  папка
const tempDir = path.join(__dirname, "../", "temp")


// налаштування і міделвара
// все зберігає в папку темп. та можемо перейменувати за доп. файлнейм
// а потім контролер вже як і під яким імям зберегти

const multerConfig = multer.diskStorage({
   destination: tempDir,
   filename: (req, file, cb) => {
      cb (null, file.originalname)
   }
})


const upload = multer({
   storage: multerConfig
})



module.exports = upload;