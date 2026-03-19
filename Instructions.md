
Database Design
Projects Table/Collection Fields:
● id, name, description, created_at
Tasks Table/Collection Fields:
● id, project_id, title, description, status (todo/in-progress/done), priority (low/medium/high), due_date, created_at
Required APIs
Project APIs:
● POST /projects
● GET /projects
● GET /projects/{id}
● DELETE /projects/{id}
Task APIs:
● POST /projects/{project_id}/tasks
● GET /projects/{project_id}/tasks
● PUT /tasks/{id}
● DELETE /tasks/{id}
Required Features
● - Pagination (example: GET /projects?page=1&limit=10)
● - Filtering tasks by status
● - Sorting tasks by due_date
● - Input validation
● - Proper error handling
