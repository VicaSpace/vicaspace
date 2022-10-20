import { prisma } from "@/db";
import { getHashedPasswordWithPepper, getRandomString } from "@/services/auth";
import { Request, Response } from "express";

const SALT_LENGTH = 50;

async function registerHandler(_req: Request, res: Response) {
    // TODO: middleware to check required fields and its type
    const username = _req.body.username
    // TODO: utils to return error codes
    if (username == null) return res.status(400).send({
        'error': 'username is required'
    })
    
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (user != null) return res.status(400).send({
        'error': 'username already taken'
    })

    const salt = _req.body.salt
    const hashedPassword = _req.body.hashedPassword
    if (salt == null || hashedPassword == null) return res.status(400).send({
        'error': 'salt and hashedPassword is required'
    })

    const hashedPasswordWithPepper = getHashedPasswordWithPepper(hashedPassword);
    await prisma.user.create({
        data: {
            username: username,
            salt: salt,
            hashPassword: hashedPasswordWithPepper
        }
    })
    res.send({
        'username': username,
        'salt': salt,
        'hashedPassword': hashedPassword,
        'pass': hashedPasswordWithPepper
    })
}

// Get random salt for register
async function getSaltHandler(_req: Request, res: Response) {
    const salt = getRandomString(SALT_LENGTH);
    res.send({'salt': salt});
}

export {
    getSaltHandler,
    registerHandler
}