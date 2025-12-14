-- Seed Project Types
-- Run this SQL to populate the projectTypes table with default values

INSERT INTO "projectTypes" (name, description, icon, active, "order", "createdAt", "updatedAt")
VALUES
  ('Web Application', 'Full-stack web applications with modern frameworks', 'Globe', true, 1, NOW(), NOW()),
  ('Mobile Application', 'Native or cross-platform mobile apps', 'Smartphone', true, 2, NOW(), NOW()),
  ('DevOps & Infrastructure', 'CI/CD pipelines, cloud infrastructure, and automation', 'Server', true, 3, NOW(), NOW()),
  ('E-commerce Platform', 'Online stores and marketplace solutions', 'ShoppingCart', true, 4, NOW(), NOW()),
  ('API Development', 'RESTful or GraphQL API services', 'Code', true, 5, NOW(), NOW()),
  ('Cloud Migration', 'Migrate existing systems to cloud platforms', 'Cloud', true, 6, NOW(), NOW()),
  ('Consulting & Strategy', 'Technical consulting and architecture planning', 'Lightbulb', true, 7, NOW(), NOW()),
  ('Maintenance & Support', 'Ongoing maintenance and technical support', 'Wrench', true, 8, NOW(), NOW())
ON CONFLICT (name) DO NOTHING;

