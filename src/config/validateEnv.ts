import Joi from "joi";
import dotenv from "dotenv";

dotenv.config();

const envSchema = Joi.object({
  PORT: Joi.number().default(3000),
  MONGO_URI: Joi.string().required().description("MongoDB connection URI"),
  EMAIL: Joi.string().email().required().description("Email address"),
  EMAIL_PASSWORD: Joi.string().required().description("Email password"),
  NODE_ENV: Joi.string()
    .valid("development", "production")
    .default("development"),
}).unknown();

const { error, value: envVars } = envSchema.validate(process.env, {
  abortEarly: false,
});

if (error) {
  console.error(
    "Invalid environment variables:",
    error.details.map((d) => d.message).join(", "),
  );
  process.exit(1);
}

export default envVars;
