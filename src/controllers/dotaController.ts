import { RequestHandler } from 'express';
import { DotaItemsFunctions } from '../models';

export const getAllDotaItems: RequestHandler = async (req, res) => {
  try {
    const allItems = await DotaItemsFunctions.getAll();
    if (allItems) {
      res.statusMessage = 'Items found';
      return res.status(200).json(allItems);
    }
    res.statusMessage = 'No items found';
    return res.sendStatus(404);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const getDotaItem: RequestHandler = async (req, res) => {
  try {
    const { id } = req.params;
    const strId = +id;
    if (strId) {
      const item = await DotaItemsFunctions.getById(strId);
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
