import {
  getModelForClass,
  modelOptions,
  prop,
  Ref,
} from "@typegoose/typegoose";
import { Field, ObjectType, registerEnumType } from "type-graphql";
import { FuzzyDate } from "../structures/FuzzyDate";
import { flake } from "../utils/flake";
import { CharacterConnection } from "./Character";
import { Studio } from "./Studio";

@ObjectType()
export class MediaTitle {
  /**
   * Media title in romaji.
   * @example ```"Shingeki no Kyojin"```
   */
  @Field(() => String, { nullable: true })
  @prop()
  public romaji: string;

  /**
   * Media title in english.
   * @example ```"Attack on Titan"```
   */
  @Field(() => String, { nullable: true })
  @prop()
  public english: string;

  /**
   * Media title in native.
   * @example ```"進撃の巨人"```
   */
  @Field(() => String, { nullable: true })
  @prop()
  public native: string;

  /**
   * User preferred media title.
   * @example ```"Shingeki no Kyojin"```
   */
  @Field(() => String, { nullable: true })
  @prop()
  public userPreferred: string;
}

@ObjectType()
export class MediaCoverImage {
  @Field(() => String, { nullable: true })
  @prop()
  public large: string;

  @Field(() => String, { nullable: true })
  @prop()
  public medium: string;

  @Field(() => String, { nullable: true })
  @prop()
  public small: string;

  @Field(() => String, { nullable: true })
  @prop()
  public color: string;
}

export enum MediaSeason {
  /** Months December to February */
  WINTER = "WINTER",

  /** Months March to May */
  SPRING = "SPRING",

  /** Months June to August */
  SUMMER = "SUMMER",

  /** Months September to November */
  FALL = "FALL",
}

export enum MediaType {
  ANIME = "ANIME",
  MANGA = "MANGA",
}

export enum MediaFormat {
  /** Anime broadcast on television. */
  TV = "TV",

  /** Anime which are under 15 minutes in length and broadcast on television. */
  TV_SHORT = "TV_SHORT",

  /** Anime movies with a theatrical release. */
  MOVIE = "MOVIE",

  /** Anime movies with a theatrical release.Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc. */
  SPECIAL = "SPECIAL",

  /** (Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast. */
  OVA = "OVA",

  /** (Original Net Animation) Anime that have been originally released online or are only available through streaming services. */
  ONA = "ONA",

  /** Short anime released as a music video. */
  MUSIC = "MUSIC",

  /** Professionally published manga with more than one chapter. */
  MANGA = "MANGA",

  /** Written books released as a series of light novels. */
  NOVEL = "NOVEL",

  /** Manga with just one chapter. */
  ONE_SHOT = "ONE_SHOT",
}

export enum MediaStatus {
  /** Has completed and is no longer being released. */
  FINISHED = "FINISHED",

  /** Currently releasing. */
  RELEASING = "RELEASING",

  /** To be released at a later date. */
  NOT_YET_RELEASED = "NOT_YET_RELEASED",

  /** Ended before the work could be finished. */
  CANCELLED = "CANCELLED",

  /** Is currently paused from releasing and will resume at a later date. */
  HIATUS = "HIATUS",
}

@ObjectType()
export class MediaAiringSchedule {
  /** The time the episode airs at. (ISO Date String) */
  @Field(() => String, {
    description: "The time the episode airs at. (ISO Date String)",
    nullable: true,
  })
  public airingAt: number;

  /** Seconds until episode starts airing. */
  @Field(() => String, {
    description: "Seconds until episode starts airing.",
    nullable: true,
  })
  public timeUntilAiring: number;

  /** The airing episode number. */
  @Field(() => String, {
    description: "The airing episode number.",
    nullable: true,
  })
  public episode: number;
}

registerEnumType(MediaSeason, {
  name: "MediaSeason",
  description: "Season of the media when it was released.",
  valuesConfig: {
    WINTER: {
      description: "Months December to February",
    },
    SPRING: {
      description: "Months March to May",
    },
    SUMMER: {
      description: "Months June to August",
    },
    FALL: {
      description: "Months September to November",
    },
  },
});

registerEnumType(MediaFormat, {
  name: "MediaFormat",
  description: "The format the media was released in.",
  valuesConfig: {
    TV: {
      description: "Anime broadcast on television.",
    },
    TV_SHORT: {
      description:
        "Anime which are under 15 minutes in length and broadcast on television.",
    },
    MOVIE: {
      description: "Anime movies with a theatrical release.",
    },
    SPECIAL: {
      description:
        "Special episodes that have been included in DVD/Blu-ray releases, picture dramas, pilots, etc.",
    },
    OVA: {
      description:
        "(Original Video Animation) Anime that have been released directly on DVD/Blu-ray without originally going through a theatrical release or television broadcast.",
    },
    ONA: {
      description:
        "(Original Net Animation) Anime that have been originally released online or are only available through streaming services.",
    },
    MUSIC: {
      description: "Short anime released as a music video.",
    },
    MANGA: {
      description: "Professionally published manga with more than one chapter.",
    },
    NOVEL: {
      description: "Written books released as a series of light novels.",
    },
    ONE_SHOT: {
      description: "Manga with just one chapter.",
    },
  },
});

registerEnumType(MediaStatus, {
  name: "MediaStatus",
  description: "Status of media.",
  valuesConfig: {
    FINISHED: {
      description: "Has completed and is no longer being released.",
    },
    RELEASING: {
      description: "Currently releasing.",
    },
    NOT_YET_RELEASED: {
      description: "To be released at a later date.",
    },
    CANCELLED: {
      description: "Ended before the work could be finished.",
    },
    HIATUS: {
      description:
        "Is currently paused from releasing and will resume at a later date.",
    },
  },
});

registerEnumType(MediaType, {
  name: "MediaType",
  valuesConfig: {
    ANIME: {
      description: "Japanese cartoon",
    },
    MANGA: {
      description: "Japanese comic",
    },
  },
});

/**
 * @class
 * @classdesc Media TypeGraphQL ObjectType and Typegoose Class.
 */
@ObjectType({ description: "Anime or Manga" })
@modelOptions({
  schemaOptions: { collection: "medias" },
  options: { allowMixed: 0 },
})
export class Media {
  /**
   * MongoDB Provided identification string.
   */
  @Field(() => String)
  public _id: string;

  /**
   * Media custom identification number.
   */
  @Field(() => Number)
  @prop({ unique: true, default: () => parseInt(flake.gen().toString()) })
  public id: number;

  /**
   * Media Title Object.
   */
  @Field(() => MediaTitle, {
    description: "Title of the media.",
  })
  @prop()
  public title: MediaTitle;

  /**
   * Cover image object.
   */
  @Field(() => MediaCoverImage, {
    description: "Cover Image of the Media.",
    nullable: true,
  })
  @prop()
  public coverImages: MediaCoverImage;

  /**
   * Media start date.
   */
  @Field(() => FuzzyDate, {
    description: "The first official release date of the media.",
    nullable: true,
  })
  @prop()
  public startDate: FuzzyDate;

  /**
   * Media end date.
   */
  @Field(() => FuzzyDate, {
    description: "The last official release date of the media.",
    nullable: true,
  })
  @prop()
  public endDate: FuzzyDate;

  /**
   * Media Banner image url.
   */
  @Field(() => String, {
    description: "The banner image of the media.",
    nullable: true,
  })
  @prop()
  public bannerImage: string;

  /**
   * Media season.
   * ``` "WINTER" | "SPRING" | "SUMMER" | "FALL" ```
   */
  @Field(() => MediaSeason, {
    description: "The season the media was initially released in.",
    nullable: true,
  })
  @prop()
  public season: MediaSeason;

  /** Media season year. */
  @Field(() => Number, {
    description: "The season year the media was initially released in.",
    nullable: true,
  })
  @prop()
  public seasonYear: number;

  /** Media description or synopsis. */
  @Field(() => String, {
    description: "Short description of the media's story and characters.",
    nullable: true,
  })
  @prop()
  public description: string;

  /** Media type.
   * ``` "ANIME" | "MANGA" ```
   */
  @Field(() => MediaType, {
    description: "The type of the media; anime or manga.",
  })
  @prop()
  public type: MediaType;

  /** Media Format Type.
   * ``` "TV" | "TV_SHORT" | "MOVIE" | "SPECIAL" | "OVA" | "ONA" | "MUSIC" | "MANGA" | "NOVEL" | "ONE_SHOT" ```
   */
  @Field(() => MediaFormat, {
    description: "The format the media was released in.",
    nullable: true,
  })
  @prop()
  public format: MediaFormat;

  /** Media status.
   * ``` "FINISHED" | "RELEASING" | "NOT_YET_RELEASED" | "CANCELLED" | "HIATUS" ```
   */
  @Field(() => MediaStatus, {
    description: "The current releasing status of the media.",
  })
  @prop()
  public status: MediaStatus;

  /** The amount of episodes the anime has when complete. ```null``` if type is ```"MANGA"```  */
  @Field(() => Number, {
    description: "The amount of episodes the anime has when complete.",
    nullable: true,
  })
  @prop()
  public episodes: number;

  /** The general length of each anime episode in minutes. */
  @Field(() => Number, {
    description: "The general length of each anime episode in minutes.",
    nullable: true,
  })
  @prop()
  public duration: number;

  /** The amount of chapters the manga has when complete. ```null``` if type is ```"ANIME"``` */
  @Field(() => Number, { nullable: true })
  @prop({ default: null })
  public chapters: number;

  /** The amount of volumes the manga has when complete. ```null``` if type is ```ANIME``` */
  @Field(() => Number, { nullable: true })
  @prop({ default: null })
  public volumes: number;

  /** The genres of the media. */
  @Field(() => [String], { nullable: true, defaultValue: [] })
  @prop({ default: () => [] })
  public genresList: string[];

  /** If the media is intended only for 18+ adult audiences. */
  @Field(() => Boolean, { defaultValue: false })
  @prop()
  public isAdult: boolean;

  /** A weighted average score of all the user's scores of the media. */
  @Field(() => Number, { nullable: true })
  @prop()
  public averageScore: number;

  /** The number of users with the media on their list.  */
  @Field(() => Number, { nullable: true })
  @prop()
  public popularity: number;

  /** The media's next episode airing schedule. */
  @Field(() => MediaAiringSchedule, { nullable: true })
  @prop()
  public nextAiringEpisode: MediaAiringSchedule;

  /** The characters in the media */
  @Field(() => [CharacterConnection], { nullable: true })
  @prop()
  public characters: [CharacterConnection];

  /** The staffs involved in the media. */
  @Field(() => [String], { nullable: true })
  @prop()
  public staff: string[];

  /** The studios involved in the media. */
  @Field(() => [Studio])
  @prop({
    ref: () => Studio,
    foreignField: "media",
    localField: "_id",
    justOne: false,
  })
  public studios: Ref<Studio>[];

  /** Anime Number (Auto Increment)
   * @deprecated Will be removed later
   */
  @prop()
  public animeNumber: string;
}

export const MediaModel = getModelForClass<typeof Media>(Media);
