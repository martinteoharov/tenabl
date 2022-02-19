## Development Environment
---

### Setting up Docker

For ease of use, when developing locally it is advised to run everything through docker. The project can be started simply by running

```bash
# go to root of project
bin/debug
```

From your browser navigate to http://localhost to see the result. Point your REST client to http://localhost:4080 or http://localhost/api to make API calls directly.

Both of the applications are set to hot reload after a change occurs, so you can just develop without having to manually run commands.
