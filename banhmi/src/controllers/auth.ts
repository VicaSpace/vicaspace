import { Request, Response } from "express";

async function getSaltHandler(_req: Request, res: Response) {
    res.send('salt?')
}

export default getSaltHandler;