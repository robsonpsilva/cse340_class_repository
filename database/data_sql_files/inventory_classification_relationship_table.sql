ALTER TABLE IF EXISTS public.inventory
	ADD CONSTRAINT fk_classification
	FOREIGN KEY (classification_id)
	references public.classification (classification_id)
	MATCH SIMPLE
	ON UPDATE CASCADE
	ON DELETE NO ACTION