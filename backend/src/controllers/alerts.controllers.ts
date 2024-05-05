import { Request, Response } from "express";

/**
 * Implements a server-sent event (SSE endpoint) where it constantly streams any alerts from 
 * sensors on a minutely basis.
 * 
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const watchAllAlerts = async (req: Request, res: Response) => {


};

/**
 * Implements a server-sent event (SSE endpoint) where it constantly streams alerts from 
 * sensors on a minutely basis for a specific sensor.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const watchSensorAlerts = async (req: Request, res: Response) => {


};

/**
 * Fetches all alert defintions for a sensor for the view to display to the user.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const getSensorAlertConfigurations = async (req: Request, res: Response) => {


};

/**
 * Adds the definition of an alert to a sensor so that the system can now track and log
 * events that trigger an allert as per this definition.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const addSensorAlertConfiguration = async (req: Request, res: Response) => {


};

/**
 * Updates the definition of an alert to a sensor. 
 * Refer to docs for addSensorAlertConfiguration(req, res) for more details on alerts.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const changeSensorAlertConfiguration = async (req: Request, res: Response) => {


};

/**
 * Deletes the definition of an alert to a sensor. 
 * Refer to docs for addSensorAlertConfiguration(req, res) for more details on alerts.
 *
 * @param req - The HTTP request object.
 * @param res - The HTTP response object used to send SSE.
 */
export const deleteSensorAlertConfiguration = async (req: Request, res: Response) => {


};
