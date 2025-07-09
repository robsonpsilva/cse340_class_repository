
-- Tony Stark Insert
INSERT INTO account(account_firstname, account_lastname, account_email, account_password) 
VALUES('Tony', 'Stark', 'tony@starkent.com', 'Iam1ronM@n');
-- Tony Stark update - changing the account type from Client to Admin
UPDATE account SET account_type = 'Admin' WHERE account_id = 1;
-- Delete the account
DELETE FROM account WHERE account_id = 1;
