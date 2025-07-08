SELECT classification.classification_name, inventory.inv_model 
FROM classification,inventory 
WHERE inventory.classification_id = classification.classification_id
AND classification_name = 'Sport';

SELECT classification.classification_name, inventory.inv_model
FROM inventory
INNER JOIN classification
ON inventory.classification_id = classification.classification_id
WHERE classification.classification_name = 'Sport';