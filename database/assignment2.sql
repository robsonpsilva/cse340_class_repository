
-- Tony Stark Insert
INSERT INTO account(account_firstname, account_lastname, account_email, account_password) 
VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');

-- Tony Stark update - changing the account type from Client to Admin
UPDATE account SET account_type = 'Admin' WHERE account_id = 1;

-- Delete the account
DELETE FROM account WHERE account_id = 1;

--Updating only part of the data present in the description field using the REPLACE function.
UPDATE inventory 
SET inv_description = Replace(inv_description, 'small interiors', 'huge interior')
WHERE inv_id = 10;

--Using an inner join to select the make and model fields from the inventory table and the 
--classification name field from the classification table for inventory items that belong
-- to the "Sport" category.
SELECT classification.classification_name, inventory.inv_model
FROM inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';

--Updating all records in the inventory table to add "/vehicles" to the middle of the file
--path in the inv_image and inv_thumbnail columns using a single query.
UPDATE inventory 
SET inv_image = REPLACE(inv_image,'/images','/images/vehicles' ),
inv_thumbnail = REPLACE(inv_thumbnail,'/images','/images/vehicles' );



