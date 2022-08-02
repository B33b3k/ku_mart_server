import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { Field, ObjectType } from "type-graphql";
import { flake } from "../utils/flake";
import { Media } from "./Media";

@ObjectType()
@modelOptions({ schemaOptions: { collection: "studios" } })
export class Studio {
  @Field(() => String)
  public _id: string;

  @Field(() => String)
  @prop({ unique: true, default: () => parseInt(flake.gen().toString()) })
  public id: number;

  @Field(() => String)
  @prop()
  public name: string;

  @Field(() => Boolean)
  @prop()
  public isAnimationStudio: boolean;

  @Field(() => Number)
  @prop()
  public favorites: number;

  @Field(() => [Media])
  @prop({
    ref: "Media",
    foreignField: "studios",
    localField: "_id",
    justOne: false,
  })
  public media: Ref<Media>[];
}

export const StudioModel = getModelForClass<typeof Studio>(Studio);
