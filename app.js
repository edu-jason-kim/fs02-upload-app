const express = require('express')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3')
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner')
const cors = require('cors')

const app = express()
app.use(cors())
app.use(express.json())

const port = 3000

const s3Client = new S3Client({
  region: 'ap-northeast-2',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID,
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  }
})

app.post('/get-upload-url', async (req, res) => {
  const { fileName, fileType } = req.body

  const command = new PutObjectCommand({
    Bucket: process.env.AWS_BUCKET_NAME,
    Key: `${Date.now()}_${fileName}`,
    ContentType: fileType,
  })

  const uploadURL = await getSignedUrl(s3Client, command, { expiresIn: 300 })

  res.json({ uploadURL })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
