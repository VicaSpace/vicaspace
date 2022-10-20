import Joi from "joi";
import createError from 'http-errors';


const checkFriendRequest = async (req, _res, next) => {
    try {
        const friendRequestSchema = Joi.object({
            sender_id: Joi.number().integer(),
            receiver_id: Joi.number().integer(),
        });

        await friendRequestSchema.validateAsync(req.body);
        next()
    } catch (err) {
        const error = createError(400, (err as any).details);
        next(error);
    }
}

export default checkFriendRequest;