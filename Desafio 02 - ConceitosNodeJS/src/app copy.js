const express = require("express");
const cors = require("cors");
const { v4: uuid, validate } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

function validateRepositoryId(request, response, next) {

  const { id } = request.params;
  
  if(!validate(id)) {
    return response.status(400).json({ error: 'Invalid repository ID.'});
  }

  return next();

}

const repositories = [];

app.get("/repositories", (request, response) => {

  return response.json(repositories);

});

app.post("/repositories", validateRepositoryId, (request, response) => {

  const { title, url, techs } = request.body;

  const repository = { id: uuid(), title, url, techs, likes: 0, };

  repositories.push(repository);

  return response.json({repository});

});

app.put("/repositories/:id", validateRepositoryId, (request, response) => {

  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!"});
  };

  const repository = {
    id,
    title,
    url,
    techs,
    likes: repositories[repositoryIndex].likes
  };

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", validateRepositoryId, (request, response) => {
  
  const { id } = request.params;

  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!"});
  };

  repositories.splice(repositoryIndex, 1);

  return response.status(204).send();

});

app.post("/repositories/:id/like", validateRepositoryId, (request, response) => {

  const { id } = request.params;
  
  const repositoryIndex = repositories.findIndex(repository => repository.id == id);

  if(repositoryIndex < 0) {
    return response.status(400).json({ error: "Repository not found!"});
  };

  // repositories[repositoryIndex].likes = repositories[repositoryIndex].likes + 1

  const repository = {
    id,
    likes: repositories[repositoryIndex].likes + 1,
  }

  repositories[repositoryIndex] = repository;

  return response.json(repository);

});

module.exports = app;
