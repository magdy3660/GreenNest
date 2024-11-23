const { S3Client } = require('@aws-sdk/client-s3');
const { Storage } = require('@google-cloud/storage');
const admin = require('firebase-admin');

class StorageService {
  constructor(provider = process.env.STORAGE_PROVIDER) {
    this.provider = provider;
    this.client = this.initializeClient();
  }

  initializeClient() {
    switch (this.provider) {
      case 'aws':
        return new S3Client({
          region: process.env.AWS_REGION,
          credentials: {
            accessKeyId: process.env.AWS_ACCESS_KEY_ID,
            secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY
          }
        });

      case 'google':
        return new Storage({
          projectId: process.env.GOOGLE_CLOUD_PROJECT_ID,
          keyFilename: process.env.GOOGLE_CLOUD_KEYFILE
        });

      case 'firebase':
        if (!admin.apps.length) {
          admin.initializeApp({
            credential: admin.credential.cert({
              projectId: process.env.FIREBASE_PROJECT_ID,
              clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
              privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n')
            }),
            storageBucket: process.env.FIREBASE_STORAGE_BUCKET
          });
        }
        return admin.storage();

      default:
        throw new Error(`Unsupported storage provider: ${this.provider}`);
    }
  }

  async uploadFile(file, path) {
    try {
      switch (this.provider) {
        case 'aws':
          return await this.uploadToS3(file, path);
        case 'google':
          return await this.uploadToGCS(file, path);
        case 'firebase':
          return await this.uploadToFirebase(file, path);
        default:
          throw new Error(`Unsupported storage provider: ${this.provider}`);
      }
    } catch (error) {
      console.error(`Error uploading file to ${this.provider}:`, error);
      throw error;
    }
  }

  async uploadToS3(file, path) {
    const { PutObjectCommand } = require('@aws-sdk/client-s3');
    const command = new PutObjectCommand({
      Bucket: process.env.AWS_BUCKET_NAME,
      Key: path,
      Body: file.buffer,
      ContentType: file.mimetype
    });

    await this.client.send(command);
    return `https://${process.env.AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${path}`;
  }

  async uploadToGCS(file, path) {
    const bucket = this.client.bucket(process.env.GOOGLE_CLOUD_BUCKET);
    const blob = bucket.file(path);
    
    await blob.save(file.buffer, {
      contentType: file.mimetype,
      public: true
    });

    return `https://storage.googleapis.com/${process.env.GOOGLE_CLOUD_BUCKET}/${path}`;
  }

  async uploadToFirebase(file, path) {
    const bucket = this.client.bucket(process.env.FIREBASE_STORAGE_BUCKET);
    const blob = bucket.file(path);

    await blob.save(file.buffer, {
      contentType: file.mimetype,
      public: true
    });

    return `https://storage.googleapis.com/${process.env.FIREBASE_STORAGE_BUCKET}/${path}`;
  }
}

module.exports = StorageService;