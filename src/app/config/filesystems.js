const multer = require('multer');

const filesystems =
{
    upload: () =>
    {
        const storage = multer.diskStorage(
        {
            destination: function (request, file, cb)
            {
                cb(null, './public/storage/uploads');
            },
            filename: function (request, file, cb)
            {
                const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);

                cb(null, uniqueSuffix + '-' + file.originalname);
            }
        });

        const upload = multer({ storage: storage });

        return upload;
    }
}

module.exports = filesystems;
