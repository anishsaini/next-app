
import type { NextApiRequest, NextApiResponse } from "next";
import formidable from "formidable";
import { promises as fs } from "fs";
import path from "path";

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }


  const uploadDir = path.join(process.cwd(), "/public/uploads");
  await fs.mkdir(uploadDir, { recursive: true });

  const form = formidable({
    uploadDir,
    keepExtensions: true, 
    multiples: true,
  });

  form.parse(req, async (err, fields, files) => {
    if (err) {
      return res.status(500).json({ error: "Upload failed" });
    }

    const file = Array.isArray(files.media) ? files.media[0] : files.media;

    if (!file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const originalName = file.originalFilename || "uploaded_file";
    const newPath = path.join(uploadDir, originalName);

   
    await fs.rename(file.filepath, newPath);


    const fileUrl = `/uploads/${originalName}`;

    return res.status(200).json({
      message: "File uploaded successfully",
      filename: originalName,
      url: fileUrl,
    });
  });
}
