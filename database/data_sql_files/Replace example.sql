UPDATE inventory 
SET inv_image = REPLACE(inv_image,'/images','/images/vehicles' ),
inv_thumbnail = REPLACE(inv_thumbnail,'/images','/images/vehicles' );