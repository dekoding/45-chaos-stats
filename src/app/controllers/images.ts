import { Request, Response } from "express";
import fs from "fs";
import path from "path";

const imageDir: string = path.resolve(__dirname + "/../public/assets/images/");
const unknownImage: string = imageDir + "unknown.JPG";

export const ImageController = {
    sendImage(req: Request, res: Response) {
        const imagePath: string = imageDir + "/" + req.params.id + ".JPG";
        fs.access(imagePath, (error) => {
            if (error) {
                res.sendFile(unknownImage);
            } else {
                res.sendFile(imagePath);
            }
        });
    }
};
