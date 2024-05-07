/**
 * Run this script to set up the base db with empty collections and their watch pipelines.
 * This is separate from mock_data_gen.py which is used to generate mock data while this is
 * for the actual initial setup of the database
 */

/* CREATE THE DB AND ALL COLLECTIONS */




/* CREATE A CHANGE STREAM FOR SENSOR READINGS 
   https://www.mongodb.com/resources/products/capabilities/change-streams
*/


/*

sensor reading is added
need to compare to limits [how??]
output alerts that are relevant plus the sensorId??
$merge into the alerts

*/
