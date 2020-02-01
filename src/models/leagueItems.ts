import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;

const LeagueItemSchema = new Schema({
  id: { type: String },
  name: { type: String },
  description: { type: String },
  plaintext: { type: String },
  gold: { type: Number },
  image: { type: String },
  into: { type: [String] },
  from: { type: [String] },
});

interface LeagueItemInterface extends mongoose.Document {
  id: string;
  name: string;
  description: string;
  plaintext: string;
  gold: number;
  image: string;
  into: [string];
  from: [string];
}

const LeagueItem = mongoose.model<LeagueItemInterface>('league-items', LeagueItemSchema);

export const LeagueItemFunctions = {
  getAll: async () => {
    try {
      const allItems = await LeagueItem.find();
      return allItems;
    } catch (error) {
      throw Error(error);
    }
  },
  getById: async (id: string) => {
    try {
      const itemOfId = await LeagueItem.findOne({ id: id });
      return itemOfId;
    } catch (error) {
      throw Error(error);
    }
  },
  getLastBuild: async () => {
    try {
      const lastItems = await LeagueItem.find({
        $or: [{ into: [] }, { into: undefined }],
      });
      return lastItems;
    } catch (error) {
      throw Error(error);
    }
  },
};
