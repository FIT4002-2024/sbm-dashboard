import { Request, Response } from "express";


/**
 * Implements a server-sent event where it constantly streams the current minutes sensor readings
 * from the persistence store and returns them to the client so as long as the client wants to
 * connect and read this
 *
 * @param req
 * @param res
 */
export const streamImmediate = async (req: Request, res: Response) => {

    // use server-sent-events https://stackoverflow.com/questions/34657222/how-to-use-server-sent-events-in-express-js
    // https://medium.com/@jsameer/real-time-askbot-with-react-express-chatgpt-8bb465352a77

    // open stream

    // call persistence within it

    // close stream when connections ends

}
