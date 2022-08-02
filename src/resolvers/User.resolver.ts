import { validate } from "class-validator";
import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { User, UserModel } from "../model/User";
import { UserResolverError } from "../structures/ErrorTypes";
import { GraphQLContext } from "../structures/GraphQLContext";
import { ISession } from "../structures/ISession";
import { MeQueryResponse } from "../structures/MeQuery";
import { UserLoginResponse } from "../structures/UserLoginMutation";
import {
  UserRegisterInput,
  UserRegisterResponse,
} from "../structures/UserRegisterMutation";
import { sendEmailVerificationMail } from "../utils/sendEmailVerificationMail";

@Resolver(User)
export class UserResolver {
  @Query(() => MeQueryResponse)
  async me(@Ctx() { req }: GraphQLContext): Promise<MeQueryResponse> {
    if (!req.session.data) {
      // The provided session doesnot exist, or there is no session cookie set.
      throw new UserResolverError("Session is invalid", "INVALID_SESSION_ID", [
        { message: "Session is invalid.", field: "session_id" },
      ]);
    }

    const user = await UserModel.findOne({ id: req.session.data.id });
    console.log(user);
    if (!user) {
      // The user with that session id doesnot exist. Maybe user was deleted.
      throw new UserResolverError(
        "The user with that session id doesnot exist.",
        "USER_DOESNOT_EXIST",
        [{ message: "User session id doesnot exist.", field: "session id" }]
      );
    }

    return { user };
  }

  @Mutation(() => UserRegisterResponse)
  async register(
    @Arg("options") options: UserRegisterInput,
    @Ctx() { redis }: GraphQLContext
  ): Promise<UserRegisterResponse> {
    const result = await validate(options, {
      validationError: {
        target: false,
        value: false,
      },
    });
    if (result.length !== 0) {
      throw new UserResolverError("Validaiton Failed", "VALIDATION_ERROR", {
        errors: result,
      });
    }
    const user = new UserModel(options);
    try {
      await user.save();
    } catch (e) {
      // Error Handling Logic
      // TODO Refactor this Error Handler
      if (e.message.includes("duplicate key")) {
        const field = Object.keys(e.keyPattern)[0];
        throw new UserResolverError(
          "User Aleady Exists",
          "USER_ALREADY_EXISTS",
          { errors: [{ field }] }
        );
      }
    }

    // TODO Send (Email Verification Mail) or (Verification Code)
    await sendEmailVerificationMail(user, redis);
    return {
      user,
    };
  }

  @Mutation(() => UserLoginResponse)
  async login(
    @Arg("username") username: string,
    @Arg("password") password: string,
    @Ctx() { req }: GraphQLContext
  ): Promise<UserLoginResponse> {
    const user = await UserModel.findOne({ username });

    if (!user)
      throw new UserResolverError("Login Failed!", "LOGIN_FAILED", {
        errors: [
          { field: "login", message: "Username and Password doesnot match." },
        ],
      });

    if (!(await user.verifyPassword(password)))
      throw new UserResolverError("Login Failed!", "LOGIN_FAILED", {
        errors: [
          { field: "login", message: "Username and Password doesnot match." },
        ],
      });
    if (!user.isEmailVerified) {
      throw new UserResolverError(
        "Email adderess is not verified.",
        "EMAIL_NOT_VERIFIED",
        [
          {
            field: "email",
            message: "Email addresss is not verified.",
            user: {
              id: user.id,
              username: user.username,
              email: user.email,
            },
          },
        ]
      );
    }

    // Set the session
    const usr = (({ id, username, email, authority }) => ({
      id,
      username,
      email,
      authority,
    }))(user);
    const session_data: ISession = {
      userAgent: req.headers["user-agent"],
      ip: req.ip as string,
      ...usr,
    };
    req.session.data = session_data;
    return { user };
  }
}
