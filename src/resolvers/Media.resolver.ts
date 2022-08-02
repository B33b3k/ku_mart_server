import { Media, MediaModel } from "../model/Media";
import {
  Arg,
  FieldResolver,
  Query,
  Resolver,
  ResolverInterface,
  Root,
} from "type-graphql";
import { Studio, StudioModel } from "../model/Studio";

@Resolver(() => Media)
export class MediaResolver implements ResolverInterface<Media> {
  @FieldResolver(() => [Studio])
  async studios(@Root() media: Media): Promise<Studio[]> {
    const studiosIds = media.studios || [];
    studiosIds.map((e) => e?.toString());

    const studios = await StudioModel.find({ _id: { $in: studiosIds } });
    return studios || [];
  }

  @Query(() => Media)
  async MediaById(@Arg("id") id: number): Promise<Media> {
    let media: Media | null;
    try {
      media = await MediaModel.findOne({ id: id });
      if (!media) {
        throw new Error("Not Found");
      }
    } catch (e) {
      throw new Error(e);
    }
    return media;
  }
}
