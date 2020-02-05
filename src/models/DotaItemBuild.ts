import mongoose, { Schema } from 'mongoose';

const DotaBuildSchema = new Schema({
  creator: { type: mongoose.Types.ObjectId, ref: 'users' },
  items: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'dota-items' }],
    maxlength: 6,
  },
  champion: { type: mongoose.Types.ObjectId, ref: 'dota-champions' },
  private: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
});

interface DotaBuildInterface extends mongoose.Document {
  creator: string;
  items: Array<string>;
  champion: string;
  private: boolean;
  createdAt: Date;
}

const DotaItemBuild = mongoose.model<DotaBuildInterface>('dota-builds', DotaBuildSchema);

export const DotaBuildFunctions = {
  getAllBuilds: async () => {
    try {
      const allBuilds = await DotaItemBuild.find({ private: false })
        .populate('items')
        .populate('champion')
        .populate('creator');
      return allBuilds;
    } catch (error) {
      throw Error(error);
    }
  },
  getBuilds: async (limit?: number) => {
    try {
      const allBuilds = await DotaItemBuild.find()
        .limit(limit)
        .populate('items')
        .populate('champion')
        .populate('creator');
      return allBuilds;
    } catch (error) {
      throw Error(error);
    }
  },
  getAllUserBuilds: async (userId: string) => {
    try {
      const userBuilds = await DotaItemBuild.find({ creator: userId })
        .populate('items')
        .populate('champion')
        .populate('creator');

      return userBuilds;
    } catch (error) {
      throw Error(error);
    }
  },
  getPublicUserBuilds: async (userId: string) => {
    try {
      const publicBuilds = await DotaItemBuild.find({ creator: userId, private: false })
        .populate('items')
        .populate('champion')
        .populate('creator');
      return publicBuilds;
    } catch (error) {
      throw Error(error);
    }
  },
  // assume user exists and is authorized
  createBuild: async (
    userId: string,
    items: Array<string>,
    isPrivate: boolean,
    championId: string
  ) => {
    try {
      const newBuildStatus = await DotaItemBuild.create({
        creator: userId,
        items: items.slice(0, 6),
        private: isPrivate,
        champion: championId,
      });
      const populated = await newBuildStatus
        .populate('items')
        .populate('champion')
        .populate('creator')
        .execPopulate();
      return populated;
    } catch (error) {
      throw Error(error);
    }
  },
  addBuildItems: async (buildId: string, items: Array<string>) => {
    try {
      const prevBuild = await DotaItemBuild.findById(buildId);
      if (prevBuild) {
        const itemsToAdd = prevBuild.items;
        itemsToAdd.push(...items);
        const build = await DotaItemBuild.findByIdAndUpdate(buildId, {
          items: itemsToAdd.slice(0, 6),
        });
        return build;
      }
      return null;
    } catch (error) {
      throw Error(error);
    }
  },
  removeBuildItems: async (buildId: string, itemsToRemove: Array<string>) => {
    try {
      const prevBuild = await DotaItemBuild.findById(buildId);
      if (prevBuild) {
        const newItems = prevBuild.items.filter(
          item => itemsToRemove.findIndex(val => val === item) >= 0
        );
        const update = await prevBuild.updateOne({ items: newItems.slice(0, 6) });
        await prevBuild.save();
        return update;
      }
      return null;
    } catch (error) {
      throw Error(error);
    }
  },
  setBuildPrivacy: async (buildId: string, newPrivacy: boolean) => {
    try {
      const build = await DotaItemBuild.findById(buildId);
      if (build) {
        await build.updateOne({
          private: newPrivacy,
        });
        await build.save();
        return true;
      }
      return false;
    } catch (error) {
      throw Error(error);
    }
  },
  deleteBuild: async (buildId: string) => {
    try {
      const deleteStatus = await DotaItemBuild.deleteOne({ _id: buildId });
      return deleteStatus;
    } catch (error) {
      throw Error(error);
    }
  },
};
