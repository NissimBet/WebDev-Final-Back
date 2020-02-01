import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;

const LeagueItemBuildSchema = new Schema({
  creator: { type: mongoose.Types.ObjectId, ref: 'users' },
  items: {
    type: [{ type: mongoose.Types.ObjectId, ref: 'league-items' }],
    maxlength: 6,
  },
  private: { type: Boolean },
  createdAt: { type: Date, default: Date.now },
});

interface LeagueItemBuildInterface extends mongoose.Document {
  creator: string;
  items: Array<string>;
  private: boolean;
  createdAt: Date;
}

const LeagueItemBuild = mongoose.model<LeagueItemBuildInterface>(
  'league-builds',
  LeagueItemBuildSchema
);

export const LeagueBuildFunctions = {
  getAllBuilds: async () => {
    try {
      const allBuilds = await LeagueItemBuild.find()
        .populate('items')
        .populate('creator');
      return allBuilds;
    } catch (error) {
      throw Error(error);
    }
  },
  getBuilds: async (limit?: number) => {
    try {
      const allBuilds = await LeagueItemBuild.find()
        .limit(limit)
        .populate('items')
        .populate('creator');
      return allBuilds;
    } catch (error) {
      throw Error(error);
    }
  },
  getAllUserBuilds: async (userId: string) => {
    try {
      const userBuilds = await LeagueItemBuild.find({ creator: userId })
        .populate('items')
        .populate('creator');

      return userBuilds;
    } catch (error) {
      throw Error(error);
    }
  },
  getPublicUserBuilds: async (userId: string) => {
    try {
      const publicBuilds = await LeagueItemBuild.find({ creator: userId, private: false })
        .populate('items')
        .populate('creator');
      return publicBuilds;
    } catch (error) {
      throw Error(error);
    }
  },
  // assume user exists and is authorized
  createBuild: async (userId: string, items: Array<string>, isPrivate: boolean) => {
    try {
      const newBuildStatus = await LeagueItemBuild.create({
        creator: userId,
        items: items.slice(0, 6),
        private: isPrivate,
      });
      return newBuildStatus;
    } catch (error) {
      throw Error(error);
    }
  },
  addBuildItems: async (buildId: string, items: Array<string>) => {
    try {
      const prevBuild = await LeagueItemBuild.findById(buildId);
      if (prevBuild) {
        const itemsToAdd = prevBuild.items;
        itemsToAdd.push(...items);
        const build = await LeagueItemBuild.findByIdAndUpdate(buildId, {
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
      const prevBuild = await LeagueItemBuild.findById(buildId);
      if (prevBuild) {
        const newItems = prevBuild.items.filter(
          item => itemsToRemove.findIndex(val => val === item) >= 0
        );
        const update = prevBuild.update({ items: newItems.slice(0, 6) });
        return update;
      }
      return null;
    } catch (error) {
      throw Error(error);
    }
  },
  toggleBuildPrivacy: async (buildId: string) => {
    try {
      const build = await LeagueItemBuild.findById(buildId);
      if (build) {
        const privateStatus = build.private;
        build.update({
          private: !privateStatus,
        });
        return privateStatus;
      }
      return null;
    } catch (error) {
      throw Error(error);
    }
  },
};

/* const newBuild = new LeagueItemBuild({
  creator: '5e3495ca58e2d71b68d6a6e5',
  items: [
    '5e34bf028bd2d11da9751826',
    '5e34bf028bd2d11da9751827'
  ],
  private: false
})
newBuild.save() */
