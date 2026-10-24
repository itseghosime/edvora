-- A teacher's empty assignment set must always mean no class access.
-- Prevent SQL three-valued logic from turning a NULL array/element into a bypass.
UPDATE public.staff_profiles
SET assigned_class_ids=array_remove(coalesce(assigned_class_ids,'{}'::uuid[]),NULL)
WHERE assigned_class_ids IS NULL OR array_position(assigned_class_ids,NULL) IS NOT NULL;
ALTER TABLE public.staff_profiles ALTER COLUMN assigned_class_ids SET NOT NULL;
ALTER TABLE public.staff_profiles ADD CONSTRAINT staff_class_ids_have_no_nulls CHECK (array_position(assigned_class_ids,NULL) IS NULL);
