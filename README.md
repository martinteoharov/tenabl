## First Meeting Notes
--- 

### Suggested ideas for the project:

- System for evaluating trustworthiness of articles from user votes.

### Tech stack:

- Frontend: JavaScript + TypeScript + React
- Styling: SCSS (CSS + variables + extra)
- Backend: Nodei.Js + Express + Typeorm
- Database: PostgreSQL
- Bundler: Vite
- Container: Docker

For code styling do not use prettier

### Stack Breakdown

Admin stuff: (Victor)
- AWS:
	- Production server: EC2
	- Database server: RDS

- Github:
	- Tasks
	- CircleCI

- ESLint

Frontend: js+ts, react course
- w3school for JS            
- Typescript official guide  
- React official guide       

Backend: js+ts, typeorm, express
- w3school for JS            
- Typescript official guide  
- Express / Typeorm          



## Local Dev
---
### To start the frontend dev server:

```bash
cd app
npm install
npm run start
```

Dev CRA server should be running at http://localhost:3000



### Building & Starting Docker Images Locally
```bash
docker-compose up -d
```

CRA should be running at http://localhost:80


