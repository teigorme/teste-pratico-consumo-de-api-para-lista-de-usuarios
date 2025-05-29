import { Request, Response, Router } from "express";
import { AuthService } from "./auth.service";
import { Id } from "../@types/id";
import { Auth } from "../@types/auth";
import { User } from "../@types/user";

const router = Router();

router.post(
  "/login",
  async (request: Request<{}, {}, Auth>, response: Response) => {
    try {
      const data = await new AuthService().login(request.body);
      return response.status(201).json(data);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
);
router.post(
  "/register",
  async (request: Request<{}, {}, User>, response: Response) => {
    try {
      const data = await new AuthService().register(request.body);
      return response.status(201).json(data);
    } catch (error) {
      response.status(400).json({ error: error.message });
    }
  }
);
router.get("/profile", async (request: Request, response: Response) => {
  try {
    const data = await new AuthService().profile(request.user);
    return response.status(200).json(data);
  } catch (error) {
    response.status(400).json({ error: error.message });
  }
});
export default router;
