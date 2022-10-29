import createError from 'http-errors';
import Joi from 'joi';

const validateRegisterRequest = async (req, _res, next) => {
  try {
    await validateSchema(req.body);
    next();
  } catch (err) {
    const error = createError(400, (err as any).details);
    next(error);
  }
};

const validateSchema = async (reqBody) => {
  const registrationSchema = Joi.object({
    salt: Joi.string().required(),
    username: Joi.string().required(),
    hashedPassword: Joi.string().required(),
  });
  await registrationSchema.validateAsync(reqBody);
}

export default validateRegisterRequest;
