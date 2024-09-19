const express = require('express');
const { resolve } = require('path');

const app = express();
const port = 3010;

app.use(express.static('static'));
app.use(express.json())

//data
let theatres = [
  { theatreId: 1, name: 'Regal Cinemas', location: 'Downtown' },
  { theatreId: 2, name: 'AMC Theatres', location: 'Midtown' },
  { theatreId: 3, name: 'Cinemark', location: 'Uptown' },
];

let shows = [
  { showId: 1, title: 'The Lion King', theatreId: 1, time: '7:00 PM' },
  { showId: 2, title: 'Hamilton', theatreId: 2, time: '8:00 PM' },
  { showId: 3, title: 'Wicked', theatreId: 3, time: '9:00 PM' },
  { showId: 4, title: 'Les Misérables', theatreId: 1, time: '6:00 PM' },
];

//functions
function getAllShows(){
  return shows;
}

function getShowById(id){
  return shows.find(show => show.showId === id)
}

function addShow(newShow){
  let showData = {showId : shows.length +1, ...newShow};
  shows.push(showData)
  return showData;
}

function validateShow(show){
  if(!show.title || typeof show.title !== 'string'){
    return 'Title is required and should be a string'
  }

  if(!show.theatreId || typeof show.theatreId !== 'number'){
    return 'Theatre id is required and should be a number'
  }

  if(!show.time || typeof show.time !== 'string'){
    return 'Time id is required and should be a string'
  }
}
//endpoints

app.get('/', (req, res) => {
  res.sendFile(resolve(__dirname, 'pages/index.html'));
});

app.get("/shows", (req, res) => {
  try {
    let result = getAllShows();
    if(result.length === 0){
      return res.status(404).json({message : "No shows found"})
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({error : 'Internal server error'})
  }
})

app.get("/shows/:id", (req, res) => {
  try {
    let id = parseInt(req.params.id);
    let result = getShowById(id);
    if(!result){
      return res.status(404).json({message : "Show not found"})
    }
    return res.status(200).json(result)
  } catch (error) {
    res.status(500).json({error : 'Internal server error'})
  }
})

app.post("/shows", (req, res) =>{
  try {
    let error = validateShow(req.body);
    if(error) res.status(400).send(error)
    let result = addShow(req.body);
    if(!result){
      return res.status(404).json({message : "Could  not add show"})
    }
    return res.status(201).json(result)
  } catch (error) {
    res.status(500).json({error : 'Internal server error'})
  }
})

module.exports = { app , getAllShows, getShowById, addShow }
