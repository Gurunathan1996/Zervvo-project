import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { AppDataSource } from '../config/data-source'; 
import { User } from '../entities/User';
import dotenv from 'dotenv';
import { RegisterUserDto, LoginUserDto } from '../dtos/auth.dto';
import { ApplicationError } from '../error/invalid-request-exception';
import { UnhandledException } from '../error/unhandled-exception';

dotenv.config();

/**
 * Service function to register a new user.
 * @param reqBody DTO containing user registration data.
 * @returns The newly created user object (without password).
 */
export const registerUser = async (
  reqBody: RegisterUserDto
): Promise<Partial<User>> => {
  try {
    const userRepository = AppDataSource.getRepository(User);

    const existingUser = await userRepository.findOne({
      where: [{ email: reqBody.email }, { username: reqBody.username }]
    });

    if (existingUser) {
      throw new ApplicationError(
        'User with that email or username already exists',
        400,
        'AUTH_USER_EXISTS'
      );
    }

    // Hash the password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(reqBody.password, salt);

    // Create and save a new User instance
    const newUser = userRepository.create({
      username: reqBody.username,
      email: reqBody.email,
      password: hashedPassword,
      role: 'user',
    });

    await userRepository.save(newUser);

    const { password: _, ...userWithoutPassword } = newUser;

    return userWithoutPassword;

  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new UnhandledException(error);
  }
};

/**
 * Service function to authenticate a user and generate a JWT token.
 * @param reqBody DTO containing user login credentials.
 * @returns An object containing the JWT token and the user object (without password).
 */
export const loginUser = async (
  reqBody: LoginUserDto
): Promise<{ token: string; user: Partial<User> }> => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({ where: { email: reqBody.email } });

    if (!user) {
      throw new ApplicationError(
        'Invalid credentials: User not found',
        400,
        'AUTH_INVALID_CREDENTIALS'
      );
    }

    const isMatch = await bcrypt.compare(reqBody.password, user.password);

    if (!isMatch) {
      throw new ApplicationError(
        'Invalid credentials: Password does not match',
        400,
        'AUTH_INVALID_CREDENTIALS'
      );
    }

    // Create JWT token payload
    const payload = {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    const jwtExpirationTime = process.env.JWT_EXPIRATION_TIME;
    let expiresInValue: jwt.SignOptions['expiresIn'];

    if (jwtExpirationTime) {
      const parsedTime = parseInt(jwtExpirationTime);
      if (!isNaN(parsedTime)) {
        expiresInValue = `${parsedTime * 60}s`;
      } else {
        expiresInValue = '1h';
      }
    } else {
      expiresInValue = '1h';
    }
    const token = jwt.sign(
      payload,
      process.env.JWT_SECRET as string,
      { expiresIn: expiresInValue }
    );

    const { password: _, ...userWithoutPassword } = user;

    return { token, user: userWithoutPassword };
  } catch (error: any) {
    if (error instanceof ApplicationError) {
      throw error;
    }
    throw new UnhandledException(error);
  }
};
