import mongoose, { Schema } from 'mongoose';

const LeagueChampionSchema = new Schema({
  id: { type: String },
  key: { type: String },
  name: { type: String },
});

interface LeagueChampionInterface extends mongoose.Document {
  id: string;
  key: string;
  name: string;
}

const DotaChampionSchema = new Schema({
  id: { type: Number },
  name: { type: String },
  imageName: { type: String },
});

interface DotaChampionInterface extends mongoose.Document {
  id: number;
  name: string;
  imageName: string;
}

const OverwatchChampionSchema = new Schema({
  id: { type: String },
  name: { type: String },
  portrait: { type: String },
});

interface OverwatchChampionInterface extends mongoose.Document {
  id: string;
  name: string;
  portrait: string;
}

const OverwatchChampion = mongoose.model<OverwatchChampionInterface>(
  'overwatch-champions',
  OverwatchChampionSchema
);
const LeagueChampion = mongoose.model<LeagueChampionInterface>(
  'league-champions',
  LeagueChampionSchema
);
const DotaChampion = mongoose.model<DotaChampionInterface>('dota-champions', DotaChampionSchema);

export const championfunctions = {
  getAllChampions: async () => {
    try {
      const champions = {
        league: await LeagueChampion.find().sort('name'),
        dota: await DotaChampion.find().sort('name'),
        overwatch: await OverwatchChampion.find().sort('name'),
      };
      return champions;
    } catch (error) {
      throw Error(error);
    }
  },
  getLeagueChampions: async () => {
    try {
      const champions = await LeagueChampion.find();
      return champions;
    } catch (error) {
      throw Error(error);
    }
  },
  getDotaChampions: async () => {
    try {
      const champions = await DotaChampion.find();
      return champions;
    } catch (error) {
      throw Error(error);
    }
  },
  getOverwatchChampions: async () => {
    try {
      const champions = await OverwatchChampion.find();
      return champions;
    } catch (error) {
      throw Error(error);
    }
  },
  getOverwatchChampionById: async (id: string) => {
    try {
      const champion = await OverwatchChampion.findOne({ id: id });
      return champion;
    } catch (error) {
      throw Error(error);
    }
  },
  getLeagueChampionById: async (id: string) => {
    try {
      const champion = await LeagueChampion.findOne({ id: id });
      return champion;
    } catch (error) {
      throw Error(error);
    }
  },
  getDotaChampionById: async (id: number) => {
    try {
      const champion = await DotaChampion.findOne({ id: id });
      return champion;
    } catch (error) {
      throw Error(error);
    }
  },
};
