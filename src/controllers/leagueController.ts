import { RequestHandler } from 'express';
import { LeagueItemFunctions } from '../models';

export const getAllLeagueItems: RequestHandler = async (req, res) => {
  try {
    const allLeagueItems = await LeagueItemFunctions.getAll();
    if (allLeagueItems) {
      res.statusMessage = 'items found';
      return res.status(200).json(allLeagueItems);
    }
    res.statusMessage = 'no items found';
    return res.sendStatus(404);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getLeagueItem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    if (id) {
      const item = await LeagueItemFunctions.getById(id);
      if (item) {
        res.statusMessage = 'Item retreived';
        return res.status(200).json(item);
      }
      res.statusMessage = 'Item not found';
      return res.sendStatus(404);
    }
    res.statusMessage = 'missing parameters';
    return res.sendStatus(406);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

// items that are recipes to none others
export const getLastItemBuild: RequestHandler = async (req, res) => {
  try {
    const lastItems = await LeagueItemFunctions.getLastBuild();
    if (lastItems) {
      res.statusMessage = 'Items found';
      return res.status(200).json(lastItems);
    }
    res.statusMessage = 'No items found';
    return res.sendStatus(404);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};
