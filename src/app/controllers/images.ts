import axios, { AxiosResponse } from "axios";
import { Request, Response } from "express";
import fs, { WriteStream } from "fs";
import path from "path";

const imageDir: string = path.resolve(__dirname + "/../../portraits/");
const unknownImage: string = imageDir + "/unknown.JPG";

const downloadImage = async (image: string) => {
    const url: string = `https://d2eem1llsne6oh.cloudfront.net/${image}.JPG`;

    return axios({
        url,
        method: "GET",
        responseType: "stream"
    })
        .then((response) => {
            if (response.status === 200) {
                const savePath: string = path.resolve(`${imageDir}/${image}.JPG`);
                const writer: WriteStream = fs.createWriteStream(savePath);

                response.data.pipe(writer);

                return new Promise((resolve) => {
                    writer.on("finish", () => { resolve(true); });
                    writer.on("error", () => { resolve(false); });
                });
            } else {
                return new Promise((resolve) => { resolve(false); });
            }
        }).catch ((err) => {
            return new Promise((resolve) => { resolve(false); });
        });
};

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
    },
    getImage(image: string) {
        downloadImage(image);
    },
    checkImage(image: string): Promise<boolean> {
        return new Promise((resolve) => {
            fs.access(imageDir + "/" + image + ".JPG", (error) => {
                if (error) {
                    resolve(false);
                }
                resolve(true);
            });
        });
    }
};
