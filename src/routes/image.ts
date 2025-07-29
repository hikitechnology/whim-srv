import { Router, type Request } from "express";
import { auth } from "../middleware/auth";
import multer from "multer";
import { getImageVariants, uploadImage } from "../utils/image";
import HttpException from "../errors/HttpException";
import { closestNumber } from "../utils/mathHelpers";
import { IMAGE_OUTPUT_DIR, ROOT_DIR } from "../constants";

const imageRoutes = Router();

imageRoutes.get("/:id", async (req: Request<{ id: string }>, res) => {
  const size = req.query.size ? Number(req.query.size) : 99999;
  const imageId = req.params.id;
  const variants = await getImageVariants(imageId);
  if (variants.length === 0) {
    throw new HttpException(404);
  }
  const closestVariant = closestNumber(size, variants);
  res.sendFile(
    ROOT_DIR + IMAGE_OUTPUT_DIR + `${imageId}/${closestVariant}.webp`,
  );
});

imageRoutes.post(
  "/upload",
  auth,
  multer().array("images"),
  async (req, res) => {
    const images = req.files as Express.Multer.File[];
    if (!images) {
      throw new HttpException(400);
    }

    const fileIdPromises: Promise<string>[] = [];
    images.forEach((image) => fileIdPromises.push(uploadImage(image)));

    const fileIds = await Promise.all(fileIdPromises);
    res.send(fileIds);
  },
);

export default Router().use("/image", imageRoutes);
