import mongoose, { Schema } from 'mongoose';

mongoose.Promise = global.Promise;

const DotaItemSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  cost: { type: Number },
  secret_shop: { type: Number },
  side_shop: { type: Number },
  recipe: { type: Number },
  localized_name: { type: String },
});

interface DotaItemInterface extends mongoose.Document {
  id: number;
  name: string;
  cost: number;
  secret_shop: number;
  side_shop: number;
  recipe: number;
  localized_name: string;
}

const DotaItem = mongoose.model<DotaItemInterface>('dota-items', DotaItemSchema);

export const DotaItemsFunctions = {
  getAll: async () => {
    try {
      const allItems = await DotaItem.find();
      return allItems;
    } catch (error) {
      throw Error(error);
    }
  },
  getById: async (id: number) => {
    try {
      const item = await DotaItem.findOne({ id: id });
      return item;
    } catch (error) {
      throw Error(error);
    }
  },
};
