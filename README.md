## Development Environment
---

### Setting up Docker

For ease of use, when developing locally it is advised to run everything through docker.

The first time you set up docker you will need to build the images. This can be done by executing the following commands. 

```bash
# go to root of project
bin/build
```

You need to build the images only once, after that you can just run:


```bash
# go to root of project
bin/debug
```

Now you will have CRA (Create React App) running on port 80. From your browser navigate to http://localhost:80 to see the result.

The API should also be running.

Both of the applications are set to hot reload after a change occurs, so you can just develop without having to manually run commands.

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


