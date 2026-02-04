-- Create trigger function
CREATE OR REPLACE FUNCTION update_project_comments_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE projects
    SET comments_count = comments_count + 1
    WHERE id = NEW.project_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE projects
    SET comments_count = comments_count - 1
    WHERE id = OLD.project_id;
    RETURN OLD;
  END IF;
END;
$$ LANGUAGE plpgsql;

-- Create trigger for INSERT
CREATE TRIGGER increment_comments_count
AFTER INSERT ON comments
FOR EACH ROW
EXECUTE FUNCTION update_project_comments_count();

-- Create trigger for DELETE
CREATE TRIGGER decrement_comments_count
AFTER DELETE ON comments
FOR EACH ROW
EXECUTE FUNCTION update_project_comments_count();
