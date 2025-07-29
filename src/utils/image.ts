import { nanoid } from "nanoid";
import sharp, { type OutputInfo } from "sharp";
import fs from "node:fs/promises";
import { IMAGE_OUTPUT_DIR } from "../constants";

export async function uploadImage(image: Express.Multer.File) {
  const imageId = nanoid();

  await fs.mkdir(IMAGE_OUTPUT_DIR + imageId, { recursive: true });

  const instance = sharp(image.buffer);
  const metadata = await instance.metadata();
  const maxDimension = Math.max(metadata.width, metadata.height);
  const sizes = [32, 64, 128, 256, 512, 1024, 2048].filter(
    (size) => size <= maxDimension,
  );

  const savePromises: Promise<OutputInfo>[] = [];

  sizes.forEach((size) =>
    savePromises.push(
      instance
        .resize(size, size, { fit: "inside" })
        .autoOrient()
        .webp()
        .toFile(IMAGE_OUTPUT_DIR + `${imageId}/${size}.webp`),
    ),
  );

  await Promise.all(savePromises);
  return imageId;
}

export async function getImageVariants(id: string) {
  if (!(await fs.exists(IMAGE_OUTPUT_DIR + id))) {
    return [];
  }

  const variants = (await fs.readdir(IMAGE_OUTPUT_DIR + id)).map((item) =>
    Number(item.split(".")[0]),
  );
  return variants;
}
