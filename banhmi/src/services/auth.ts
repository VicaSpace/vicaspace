import { prisma } from "@/db";
import { sha256 } from "js-sha256";
import jwt from 'jsonwebtoken';

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const ACCESS_TOKEN_EXPIRES_TIME = '3d';
const REFRESH_TOKEN_EXPIRES_TIME = '30d';

function getRandomString(length: number) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getHashedPasswordWithPepper(hashedPassword: string) {
    return sha256(hashedPassword + process.env.PEPPER);
}

async function validatePassword(hashedPassword: string, username: string) {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (user == null) return false;
    const hashedPasswordWithPepper = getHashedPasswordWithPepper(hashedPassword);
    if (user.hashPassword != hashedPasswordWithPepper) return false;
    else return true;
}

async function createAccessToken(username: string) {
    const user = await prisma.user.findUnique({
        where: {
            username: username
        }
    })
    if (user == null) return null;

    let token = await prisma.authToken.findFirst({
        where: {
            user: user
        },
        select: {
            id: true,
            userId: true,
            accessToken: true,
            refreshToken: true,
            expiredTime: true
        }
    })

    const accessToken = jwt.sign({'user': user.username}, process.env.JWT_PRIVATEKEY, {expiresIn: ACCESS_TOKEN_EXPIRES_TIME})
    const refreshToken = jwt.sign({'user': user.username, accessToken: accessToken}, process.env.JWT_PRIVATEKEY, {expiresIn: REFRESH_TOKEN_EXPIRES_TIME})
    const expiredTime = Math.floor(Date.now()/1000) + 3 * 24 * 60 * 60;

    if (token != null) {
        token = await updateAuthToken(user, accessToken, refreshToken, expiredTime);
    } else {
        // create new token
        token = await createAuthTokenObject(user, accessToken, refreshToken, expiredTime);
    } 
    
    return token;
}

async function updateAuthToken(user, accessToken, refreshToken, expiredTime) {
    return await prisma.authToken.update({
        where: {
            userId: user.id
        },
        data: {
            accessToken: accessToken,
            refreshToken: refreshToken,
            expiredTime: new Date(expiredTime)
        }
    })
}

async function createAuthTokenObject(user, accessToken, refreshToken, expiredTime) {
    return await prisma.authToken.create({
        data: {
            expiredTime: new Date(expiredTime),
            accessToken: accessToken,
            refreshToken: refreshToken,
            user: {connect: {id: user.id}}
        }
    })
}

export {
    getRandomString,
    getHashedPasswordWithPepper,
    validatePassword,
    createAccessToken
}