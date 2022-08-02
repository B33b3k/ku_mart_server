import {
  DocumentType,
  getModelForClass,
  pre,
  prop,
} from "@typegoose/typegoose";
import * as argon2 from "argon2";
import md5 from "md5";
import { flake } from "../utils/flake";
import { Field, Int, ObjectType } from "type-graphql";

@ObjectType()
export class Profile {
  @Field(() => String)
  @prop({
    type: () => String,
    default: function (profile: DocumentType<Profile>) {
      const user = profile.$parent() as DocumentType<User>;
      return `https://robohash.org/${md5(user.username)}?set=set4`;
    },
  })
  public avatar?: string;

  @Field(() => Date)
  @prop({ required: true, type: () => Date })
  public birthday: string;

  @Field(() => String)
  @prop({ type: () => String, default: () => "" })
  public bio: string;
}

@ObjectType()
export class Authority {
  @Field(() => Int)
  @prop({ default: () => 0, type: () => Number, required: true })
  public level!: number;

  @prop({ default: () => null, type: () => String })
  public adminToken!: string;
}

@ObjectType()
@pre<User>("save", async function (next) {
  this.updatedAt = Date.now();
  if (!this.isModified("password")) {
    next();
  }
  this.password = await argon2.hash(this.password, { type: argon2.argon2id });
})
export class User {
  @Field(() => String, { nullable: true })
  public _id: string;

  @Field(() => Number, { nullable: true })
  @prop({
    unique: true,
    default: () => parseInt(flake.gen().toString()),
  })
  public id: number;

  @Field(() => String)
  @prop({
    required: true,
    unique: true,
  })
  public username!: string;

  @Field(() => String)
  @prop({ required: true, unique: true, lowercase: true })
  public email!: string;

  @prop({ required: true })
  public password!: string;

  @Field(() => Date)
  @prop({ type: () => Date, default: () => Date.now() })
  public createdAt?: number;

  @Field(() => Date)
  @prop({ type: () => Date, default: () => Date.now() })
  public updatedAt?: number;

  @Field(() => Boolean)
  @prop({ type: () => Boolean, default: () => false })
  public isEmailVerified?: boolean;

  @Field(() => Profile)
  @prop({ type: () => Profile, required: true, _id: false })
  public profile!: Profile;

  @Field(() => Authority)
  @prop({
    type: () => Authority,
    default: () => {
      const authority = new Authority();
      return authority;
    },
    _id: false,
  })
  public authority!: Authority;

  /**
   * Checks if the plain entered password matches with hashed password.
   * @param password Enter plain password, that is to be compared with hashed password.
   * @returns {Promise<boolean>} ```true```  if the password matches and ```false``` if not.
   */
  public async verifyPassword(
    this: DocumentType<User>,
    password: string
  ): Promise<boolean> {
    return await argon2.verify(this.password, password);
  }
}

export const UserModel = getModelForClass<typeof User>(User);
