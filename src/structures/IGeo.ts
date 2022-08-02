export interface IGeo {
  /**
   * User continent name.
   * @example
   * ```ts
   *  req.geo.continent; // returns "North America"
   */
  continent: string;

  /**
   * User country name.
   * @example
   * ```ts
   *  req.geo.country; // returns "Canada"
   */
  country: string;

  /**
   * User region name.
   * @example
   * ```ts
   *  req.geo.regionName; // returns "Ontario"
   * ```
   */
  regionName: string;

  /**
   * User city.
   * @example
   * ```ts
   *  req.geo.city; // returns "Toronto"
   * ```
   */
  city: string;

  /**
   * Time zone of the user.
   * @example
   * ```ts
   * req.geo.timezone; // returns "America/Toronto"
   * ```
   */
  timezone: string;

  /**
   * This field is not show important. It is just a user's IP Address.
   * Which can also be accessed by ``req.ip``
   */
  query: string;

  /**
   * Returns message of the response if something went wrong.
   */
  message?: string;

  /**
   * Returns the status of the response
   */
  status?: string;
  [key: string]: string | boolean | undefined;
}
