import multer from 'multer'

// Usamos memória para pegar o buffer e enviar para o Cloudinary
const storage = multer.memoryStorage()

const upload = multer({ storage })

export default upload
