import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { promises as fs } from "fs";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  await fs.mkdir("./public/uploads", { recursive: true });

  const form = formidable({ multiples: false, uploadDir: "./public/uploads", keepExtensions: true });

  form.parse(req, (err, fields, files) => {
    if (err) {
      res.status(500).json({ error: "Upload failed" });
      return;
    }
    const media = files.media;
    const file = Array.isArray(media) ? media[0] : media;
    const caption = Array.isArray(fields.caption)
      ? fields.caption[0]
      : fields.caption ?? "";

    if (!file) {
      res.status(400).json({ error: "No file uploaded" });
      return;
    }

    res.status(200).json({ message: "Uploaded", filename: file.newFilename, caption });
  });
}