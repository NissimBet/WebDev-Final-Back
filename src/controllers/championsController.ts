import { RequestHandler } from 'express';
import fetch from 'node-fetch';

/*
https://developer.riotgames.com/docs/lol
https://ddragon.leagueoflegends.com/cdn/10.2.1/data/en_US/champion.json

https://docs.opendota.com/
http://sharonkuo.me/dota2/heroes.html

https://overwatch-api.net/docs/v1 
  ||
https://overwatch-api.tekrop.fr/heroes
(https://github.com/TeKrop/overwatch-api)

*/

interface LolChampion {
  id: string;
  key: string;
  name: string;
}

interface DotaChampion {
  id: number;
  name: string;
  imageName: string;
}

interface OWChampion {
  id: string;
  name: string;
  portrait: string;
}

const LolChampions: Array<LolChampion> = [];
const DotaChampions: Array<DotaChampion> = [];
const OWChampions: Array<OWChampion> = [];

export const populateChampions = async () => {
  await populateDotaChampions();
  await populateLolChampions();
  await populateOWChampions();
};
const populateLolChampions = async () => {
  try {
    const data = await fetch(
      'https://ddragon.leagueoflegends.com/cdn/10.2.1/data/en_US/champion.json'
    );
    const dataJSON = await data.json();

    // empty array
    LolChampions.splice(0, LolChampions.length);
    for (let champ in dataJSON?.data) {
      LolChampions.push({
        id: dataJSON.data[champ].id,
        key: dataJSON.data[champ].key,
        name: dataJSON.data[champ].name,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const populateDotaChampions = async () => {
  try {
    const data = await fetch('https://api.opendota.com/api/heroes');
    const dataJSON = await data.json();

    // empty array
    DotaChampions.splice(0, DotaChampions.length);
    for (let champ in dataJSON) {
      DotaChampions.push({
        id: dataJSON[champ].id,
        name: dataJSON[champ].localized_name,
        imageName: dataJSON[champ].name.replace('npc_dota_hero_', ''),
      });
    }
  } catch (error) {
    console.log(error);
  }
};
const populateOWChampions = async () => {
  try {
    const data = await fetch('https://overwatch-api.tekrop.fr/heroes');
    const dataJSON = await data.json();

    // empty array
    OWChampions.splice(0, OWChampions.length);
    for (let champ in dataJSON) {
      OWChampions.push({
        id: dataJSON[champ].key,
        name: dataJSON[champ].name,
        portrait: dataJSON[champ].portrait,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

export const getAllLolChampions: RequestHandler = async (req, res) => {
  return res.status(200).json(LolChampions);
};

export const getAllDotaChampions: RequestHandler = async (req, res) => {
  return res.status(200).json(DotaChampions);
};

export const getAllOWChampions: RequestHandler = async (req, res) => {
  return res.status(200).json(OWChampions);
};
