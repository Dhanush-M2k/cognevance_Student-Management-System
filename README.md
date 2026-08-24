# cognevance_Student-Management-System
Student Management System is a full-stack, single-artifact web application designed to handle student data management and academic records. Built with Java 17 and Spring Boot 3.3.2, the application serves both RESTful API endpoints and a static frontend without needing a separate frontend build pipeline or server.
🎓 Student Management System
A basic full-stack Student Management application built entirely with Spring Boot — the same application serves both the REST API and the frontend, so there is no separate frontend server or build step.

Backend: Java 17, Spring Boot 3, Spring Web, Spring Data JPA
Frontend: HTML, CSS, vanilla JavaScript (served as static resources by Spring Boot)
Database: MySQL
Architecture: Controller → Service → Repository → MySQL, with a static frontend calling the REST API via fetch
1. Project Structure
student-management-system/
├── pom.xml
├── Dockerfile
├── database/
│   └── schema.sql                  # DB + table creation + sample data
├── src/main/java/com/example/sms/
│   ├── StudentManagementSystemApplication.java
│   ├── model/Student.java          # JPA entity
│   ├── repository/StudentRepository.java
│   ├── service/StudentService.java
│   ├── controller/StudentController.java   # REST endpoints
│   └── exception/                  # Custom exceptions + global handler
├── src/main/resources/
│   ├── application.properties      # local/dev DB config
│   ├── application-prod.properties # deployment config (env vars)
│   └── static/                     # <-- the frontend
│       ├── index.html
│       ├── css/style.css
│       └── js/script.js
└── screenshots/                    # put your screenshots here (see section 6)
2. Features (CRUD)
| Operation | UI action | REST endpoint | |-----------|-------------------------------------|------------------------------------| | Create | "Add Student" form | POST /api/students | | Read all | Students table (loads on page load) | GET /api/students | | Read one | (used internally for edit) | GET /api/students/{id} | | Update | "Edit" button pre-fills the form | PUT /api/students/{id} | | Delete | "Delete" button (with confirm) | DELETE /api/students/{id} | | Search | Search box | GET /api/students/search?q=... | | Filter | — | GET /api/students/course/{course}|

Each student record has: first name, last name, email (unique), phone, course, date of birth, year of study (1–5), and GPA (0–10). Both the backend (@NotBlank, @Email, @Past, etc. via Bean Validation) and the frontend (HTML5 form validation + inline error messages) validate input.

3. Prerequisites
Java 17+
Maven 3.6+ (or use the included wrapper if you generate one with mvn -N wrapper:wrapper)
MySQL 8+ running locally (or a remote MySQL instance)
4. Running Locally
Step 1 — Create the database
Either let Hibernate auto-create it (default config already has createDatabaseIfNotExist=true), or run the provided script manually:

mysql -u root -p < database/schema.sql
Step 2 — Configure credentials
Edit src/main/resources/application.properties if your MySQL username/password differ from the defaults (root / root):

spring.datasource.username=root
spring.datasource.password=root
Step 3 — Run the app
mvn spring-boot:run
Step 4 — Open it
Go to http://localhost:8080 — the frontend and API are on the same origin, so there's nothing else to configure.

The REST API alone can be tested directly at http://localhost:8080/api/students.

5. Deployment
The app is a single self-contained Spring Boot jar, so any Java hosting platform works. An application-prod.properties profile is included, which reads DB credentials from environment variables instead of hard-coding them.

Option A — Build and run the jar directly
mvn clean package -DskipTests
java -jar target/student-management-system-1.0.0.jar \
     --spring.profiles.active=prod
Set these environment variables first: DB_URL, DB_USERNAME, DB_PASSWORD, and optionally PORT (defaults to 8080).

Example DB_URL for a managed MySQL instance: ` jdbc:mysql://:3306/?useSSL=true&serverTimezone=UTC `

Option B — Docker
A Dockerfile is included: `bash docker build -t student-management-system . docker run -p 8080:8080 \ -e DB_URL="jdbc:mysql://:3306/" \ -e DB_USERNAME="" \ -e DB_PASSWORD="" \ student-management-system `

Option C — Platforms that build from Git (Render / Railway / etc.)
Push this project to a GitHub repo.
Create a new Web Service from the repo (these platforms detect the pom.xml and build a Java/Maven app automatically, or use the included Dockerfile).
Add a MySQL database add-on (or point at any managed MySQL instance) and set DB_URL, DB_USERNAME, DB_PASSWORD as environment variables.
Set the start command to: java -jar target/student-management-system-1.0.0.jar --spring.profiles.active=prod (unnecessary if using the Dockerfile, which already sets this).
Deploy — the platform gives you a public URL serving both the API and frontend.
6. Screenshots
Add screenshots of the running app here for your submission, e.g.:

screenshots/01-student-list.png — the main page with the student table
screenshots/02-add-student.png — the add-student form filled in
screenshots/03-edit-student.png — editing an existing student
screenshots/04-validation-errors.png — form showing validation errors
screenshots/05-api-response.png — GET /api/students viewed directly in the browser or Postman
A screenshots/ folder is already included in the project — just drop your .png/.jpg files in there and reference them in your submitted report, e.g.:

![Student list](screenshots/01-student-list.png)
7. Testing the API directly (optional)
Example curl commands:

# Create
curl -X POST http://localhost:8080/api/students \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Aarav","lastName":"Sharma","email":"aarav@example.com","course":"B.Tech CSE","dateOfBirth":"2004-03-15","yearOfStudy":2,"gpa":8.7}'

# Read all
curl http://localhost:8080/api/students

# Update
curl -X PUT http://localhost:8080/api/students/1 \
  -H "Content-Type: application/json" \
  -d '{"firstName":"Aarav","lastName":"Sharma","email":"aarav@example.com","course":"B.Tech CSE","dateOfBirth":"2004-03-15","yearOfStudy":3,"gpa":9.0}'

# Delete
curl -X DELETE http://localhost:8080/api/students/1
8. Tech Summary
| Layer | Technology | |--------------|-------------------------------------------| | Frontend | HTML5, CSS3, vanilla JavaScript (fetch API) | | Backend | Spring Boot 3 (Web, Validation) | | Persistence | Spring Data JPA + Hibernate | | Database | MySQL 8 | | Build tool | Maven | | Deployment | Executable jar / Docker |
