import { Request, Response, Router } from "express";
import { UserService } from "./users.service";
import { User } from "../@types/user";
import { Id } from "../@types/id";

const router = Router();

router.post("/", async (request: Request<{}, {}, User>, response: Response) => {
  try {
    const data = await new UserService().create(request.body);
  return  response.status(201).json(data);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});

router.get("/", async (request: Request, response: Response) => {
  const data = await new UserService().findAll();
  return response.status(200).json(data);
});

router.get("/:id", async (request: Request<Id>, response: Response) => {
  try {
    const data = await new UserService().findOne(request.params.id);
    return response.status(200).json(data);
  } catch (error) {
    response.status(404).json({ error: error.message });
  }
});

router.patch(
  "/:id",
  async (request: Request<Id, {}, User>, response: Response) => {
    try {
      const data = await new UserService().update(
        request.params.id,
        request.body
      );
      return response.status(200).json(data);
    } catch (error) {
      response.status(404).json({ message: error.message });
    }
  }
);

router.delete("/:id", async (request: Request<Id>, response: Response) => {
  try {
    const data = await new UserService().remove(request.params.id);
    return response.status(200).json(data);
  } catch (error) {
    response.status(404).json({ message: error.message });
  }
});

export default router;
