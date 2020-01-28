import { RequestHandler } from 'express';
import fetch from 'node-fetch';

interface LolChampion {
  id: string;
  key: string;
  name: string;
}

interface DotaChampion {
  id: number;
  name: string;
}

interface OWChampion {
  id: number;
  name: string;
}

const LolChampions: Array<LolChampion> = [];
const DotaChampions: Array<DotaChampion> = [];
const OWChampions: Array<OWChampion> = [];

export const getAllLolChampions: RequestHandler = async (req, res) => {
  try {
    const data = await fetch(
      'https://ddragon.leagueoflegends.com/cdn/10.2.1/data/en_US/champion.json'
    );
    const dataJSON = await data.json();

    if (dataJSON?.data.length != LolChampions) {
      // empty array
      LolChampions.splice(0, LolChampions.length);
      for (let champ in dataJSON?.data) {
        LolChampions.push({
          id: dataJSON.data[champ].id,
          key: dataJSON.data[champ].key,
          name: dataJSON.data[champ].name,
        });
      }
    }

    return res.status(200).json(LolChampions);
  } catch (error) {
    console.log(error);
  }
};

export const getAllDotaChampions: RequestHandler = async (req, res) => {
  try {
    const data = await fetch('https://api.opendota.com/api/heroes');
    const dataJSON = await data.json();

    if (dataJSON.length != DotaChampions) {
      // empty array
      DotaChampions.splice(0, DotaChampions.length);
      for (let champ in dataJSON) {
        DotaChampions.push({
          id: dataJSON[champ].id,
          name: dataJSON[champ].localized_name,
        });
      }
    }
    return res.status(200).json(DotaChampions);
  } catch (error) {
    console.log(error);
  }
};

export const getAllOWChampions: RequestHandler = async (req, res) => {
  try {
    const data = await fetch('https://overwatch-api.net/api/v1/hero');
    const dataJSON = await data.json();

    if (dataJSON?.data.length != OWChampions) {
      // empty array
      OWChampions.splice(0, OWChampions.length);
      for (let champ in dataJSON?.data) {
        OWChampions.push({
          id: dataJSON.data[champ].id,
          name: dataJSON.data[champ].name,
        });
      }
    }
    return res.status(200).json(OWChampions);
  } catch (error) {
    console.log(error);
  }
};
