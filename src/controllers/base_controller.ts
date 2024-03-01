import { Request, Response } from "express";
import { Model } from "mongoose";

export class BaseController<ModelType> {
  model: Model<ModelType>;
  constructor(model: Model<ModelType>) {
    this.model = model;
  }

  async get(req: Request, res: Response) {
    try {
      const objects = await this.model.find();
      if (objects.length === 0) {
        res.send([]); // Return an empty array if no objects are found
      } else {
        res.send(objects);
      }
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }

  async getById(req: Request, res: Response) {
    try {
      const obj = await this.model.findById(req.params.id);
      res.send(obj);
    } catch (err) {
      res.status(500).json({ message: err.message });
    } 
  }

  async post(req: Request, res: Response) {
    try {
      const obj = await this.model.create(req.body);
      res.status(201).send(obj);
    } catch (err) {
      console.log(err);
      res.status(406).send("fail: " + err.message);
    }
  }

  async putById(req: Request, res: Response) {
    try {
      const obj = await this.model.findByIdAndUpdate(req.params.id, req.body);
      res.status(200).send(obj);
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
  }
    async deleteById(req: Request, res: Response) {
      try {
          const obj = await this.model.findByIdAndDelete(req.params.id);
          if (!obj) {
              // If the object with the given ID is not found
              return res.status(404).json({ message: "Object not found" });
          }
          // If the object is successfully deleted
          res.status(200).send(obj);
      } catch (err) {
          res.status(500).json({ message: err.message });
      }
    }
    

}



const createController = <ModelType>(model: Model<ModelType>) => {
  return new BaseController<ModelType>(model);
};

export default createController;