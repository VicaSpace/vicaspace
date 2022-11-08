import createHttpError from 'http-errors';
import Joi from 'joi';

const checkUpdateUserRequest = async (req, _res, next) => {
  try {
    const updateUserRequestSchema = Joi.object({
      socketId: Joi.string(),
      spaceId: Joi.number().integer().allow(null)
    });
    await updateUserRequestSchema.validateAsync(req.body);
    next();
  } catch (err) {
    const error = createHttpError(400, (err as any).details[0].message);
    next(error);
  }
};

export default checkUpdateUserRequest;
