import { RequestHandler } from 'express';
import { championfunctions } from '../models';
import fetch from 'node-fetch';

/*
https://developer.riotgames.com/docs/lol
///// CHAMPIONS /////
https://ddragon.leagueoflegends.com/cdn/10.2.1/data/en_US/champion.json
///// ITEMS /////
https://ddragon.leagueoflegends.com/cdn/10.2.1/data/en_US/item.json

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
  /* await populateDotaChampions();
  await populateLolChampions();
  await populateOWChampions(); */
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
  try {
    const leagueChampions = await championfunctions.getLeagueChampions();
    return res.status(200).json(leagueChampions);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getAllDotaChampions: RequestHandler = async (req, res) => {
  try {
    const dotaChampions = await championfunctions.getDotaChampions();
    return res.status(200).json(dotaChampions);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getAllOWChampions: RequestHandler = async (req, res) => {
  try {
    const overwatchChampions = await championfunctions.getOverwatchChampions();
    return res.status(200).json(overwatchChampions);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getAllChamps: RequestHandler = async (req, res) => {
  try {
    const allChamps = await championfunctions.getAllChampions();
    return res.status(200).json(allChamps);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getChampionById = async (game: string, championId: number | string) => {
  try {
    let champion;
    switch (game) {
      case 'league':
        champion = championfunctions.getLeagueChampionById(championId as string);
        break;
      case 'overwatch':
        champion = championfunctions.getOverwatchChampionById(championId as string);
        break;
      case 'dota':
        champion = championfunctions.getDotaChampionById(championId as number);
        break;
    }
    return champion;
  } catch (error) {
    console.log(error);
    return null;
  }
};
