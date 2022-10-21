import { prisma } from "@/db";
import { createAccessToken, getHashedPasswordWithPepper, getRandomString, refreshAccessToken, validatePassword } from "@/services/auth";
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

async function getUserSaltHandler(_req: Request, res: Response) {
    const username = _req.params.username;
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (user == null) return res.status(404).send({
        'error': 'username is not exists'
    })

    res.send({
        'username': username,
        'salt': user.salt
    })
}

async function loginHandler(_req: Request, res: Response) {
    const username = _req.body.username;
    const hashedPassword = _req.body.hashedPassword;
    const isPasswordValid = await validatePassword(hashedPassword, username);

    if (isPasswordValid) {
        const token = await createAccessToken(username);
        if (token == null) return res.status(400).send({'error': 'Invalid username or password'});
        res.send(token)
    } else {
        res.status(403).send({'error': 'Invalid username or password'})
    }
}

async function refreshAccessTokenHandler(_req: Request, res: Response) {
    const username = _req.body.username;
    const refreshToken = _req.body.refreshToken;

    const newToken = await refreshAccessToken(username, refreshToken);

    if (newToken == null) return res.status(400).send({'error': 'Invalid refreshToken'});
    return res.send(newToken);
}

export {
    getSaltHandler,
    registerHandler,
    getUserSaltHandler,
    loginHandler,
    refreshAccessTokenHandler
}