// src/services/s3.service.js
import crypto from "crypto";
import { PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { s3 } from "../aws/s3.js";

const BUCKET = (process.env.S3_BUCKET || "").trim();
const PREFIX = (process.env.S3_PREFIX || "products/").trim();
const PUBLIC_READ = process.env.S3_PUBLIC_READ === "1";

// CloudFront domain của bạn
const CLOUDFRONT_DOMAIN = (process.env.CLOUDFRONT_DOMAIN || "").trim();

export async function uploadProductImage(file) {
  if (!file) return { image_key: null, url_image: null };

  const allowed = ["image/jpeg", "image/png", "image/webp"];
  if (!allowed.includes(file.mimetype)) throw new Error("Only JPG/PNG/WEBP allowed");

  const ext =
    file.mimetype === "image/png" ? "png" :
    file.mimetype === "image/webp" ? "webp" : "jpg";

  const image_key = `${PREFIX}${crypto.randomUUID()}.${ext}`;

  await s3.send(new PutObjectCommand({
    Bucket: BUCKET,
    Key: image_key,
    Body: file.buffer,
    ContentType: file.mimetype,
    // KHÔNG ACL
  }));

  // ✅ Nếu bạn dùng CloudFront để hiển thị ảnh
  if (PUBLIC_READ) {
    const url_image = CLOUDFRONT_DOMAIN
      ? `https://${CLOUDFRONT_DOMAIN}/${image_key}`
      : `https://${BUCKET}.s3.${process.env.AWS_REGION}.amazonaws.com/${image_key}`;
    return { image_key, url_image };
  }

  // Private presigned (không qua CloudFront)
  const url_image = await getSignedUrl(
    s3,
    new GetObjectCommand({ Bucket: BUCKET, Key: image_key }),
    { expiresIn: 900 }
  );
  return { image_key, url_image };
}

export async function deleteProductImage(image_key) {
  if (!image_key) return;
  await s3.send(new DeleteObjectCommand({ Bucket: BUCKET, Key: image_key }));
}
