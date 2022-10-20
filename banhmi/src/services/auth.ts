import { sha256 } from "js-sha256";

const characters ='ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
const PEPPER = "te06p2p7vMJKbvDJQ5d9dTtVvuWEHTz4zWFl3PZc5uDKOiRXZJ";

function getRandomString(length: number) {
    let result = ' ';
    const charactersLength = characters.length;
    for ( let i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return result;
}

function getHashedPasswordWithPepper(hashedPassword: string) {
    return sha256(hashedPassword + PEPPER);
}

export {
    getRandomString,
    getHashedPasswordWithPepper
}