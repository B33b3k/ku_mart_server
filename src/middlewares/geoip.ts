// eslint-disable-next-line @typescript-eslint/no-var-requires
const fetch = require("node-fetch");
import * as express from "express";
import { IGeo } from "../structures/IGeo";

/**
 * Sets the ``req.geo`` property into the Request instance which can be used later in the application.
 * @param req {Request}
 * @param _ {Response}
 * @param next {NextFunction}
 */
export const geoapi = async (
  req: express.Request & { ip: string },
  _: express.Response,
  next: express.NextFunction
) => {
  const ip = req.ip;
  try {
    const response = await fetch(`http://ip-api.com/json/${ip}?fields=1106201`);
    const geo = (await response.json()) as IGeo;

    // If the server is hosted on local machine, set all the property to "localhost"
    if (geo.message === "reserved range") {
      geo.continent = "localhost";
      geo.country = "localhost";
      geo.regionName = "localhost";
      geo.city = "localhost";
      geo.timezone = "localhost";
      geo.query = "127.0.0.1";
      geo.message = "localhost";
      geo.status = "success";
    }

    Object.defineProperty(req, "geo", {
      value: geo,
      writable: false,
      enumerable: true,
    });
    next();
  } catch (e) {
    next(e);
  }
};
