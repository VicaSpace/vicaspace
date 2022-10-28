import createError from 'http-errors';

import { prisma } from '@/db';

const validateRegistrationRequest = async (username: string) => {
    const user = await prisma.user.findUnique({
        where: {
            username: username,
        },
    });
    if (user != null) {
        const error = createError(
            400,
            `username existed`,
        );
        throw error;
    }
}

export { validateRegistrationRequest };