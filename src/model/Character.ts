// import { FuzzyDate } from "../structures/FuzzyDate";
// import { Media } from "./Media";

import { Field, ObjectType } from "type-graphql";
import { FuzzyDate } from "../structures/FuzzyDate";

@ObjectType()
export class CharacterName {
  @Field(() => String)
  public first: string;

  @Field(() => String)
  public middle: string;

  @Field(() => String)
  public last: string;

  @Field(() => String)
  public full: string;

  @Field(() => String)
  public native: string;

  @Field(() => String)
  public usePreferred: string;
}

@ObjectType()
export class CharacterImage {
  @Field(() => String)
  public large: string;

  @Field(() => String)
  public medium: string;
}

// export class Character {
//   public _id: string;
//   public id: number;
//   public name: CharacterName;
//   public image: string;
//   public description: string;
//   public gender: string;
//   public dateOfBirth: FuzzyDate;
//   public age: string;
//   public bloodType: string;
//   public favourites: string;
//   public medias: [Media];
// }
@ObjectType()
export class Character {
  @Field(() => Number)
  public id: number;

  @Field(() => CharacterName)
  public name: CharacterName;

  @Field(() => CharacterImage)
  public image: CharacterImage;

  @Field(() => String)
  public bloodType: string;

  @Field(() => FuzzyDate)
  public dateOfBirth: FuzzyDate;

  @Field(() => String)
  public age: string;

  @Field(() => String)
  public description: string;

  @Field(() => String)
  public gender: string;
}

@ObjectType()
export class CharacterConnection {
  @Field(() => Number)
  public id: number;

  @Field(() => String)
  public role: string;

  @Field(() => Character)
  public node: Character;

  @Field(() => [String])
  public voiceActors: string[];
}
