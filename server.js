var express = require("express");
var path = require("path")
var fs = require("fs");
var app = express();
var PORT = process.env.PORT || 3100;
//Body Parse
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

//Display Static Files
app.use(express.static('public'));

//Log FUll URL Hit
const logger = (req, res, next) => {
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
console.log(fullUrl);
    next();
}
app.use(logger)

// Routes
app.get("/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "public/notes.html"));
});
app.get("/", function (req, res) {
    res.sendFile(path.join(__dirname, "public/index.html"));
});
app.get("/api/notes", function (req, res) {
    res.sendFile(path.join(__dirname, "db/db.json"));
});

//Post
app.post("/api/notes", function (req, res) {
   fs.readFile("db/db.json", "utf8", function (err, data) {
        if (err) throw (err);
        var notes = data // STRING
        if (notes.length > 0) {
            noteJSON = JSON.parse(notes); // array of objects (?)     
        } else {
            noteJSON = []
        }

        //Recieve note
        newNote = req.body // OBJECT
        // console.log("new note:" + newNote + typeof(newNote)); 
        noteJSON.push(newNote) // OBJECT
        i = 1
        noteJSON.forEach(newNote => {
            newNote.id = i;
            i++;
        });
        noteStr = JSON.stringify(noteJSON) // STRING

        // add to db.json
        fs.writeFile("db/db.json", (noteStr), function (err) {
            if (err) throw (err)
        })
    })
    res.redirect("/notes")
});

//Delete 
app.delete("/api/notes/:id", function (req, res) {
    id = parseInt(req.params.id)
    console.log(id);
    var fullUrl = req.protocol + '://' + req.get('host') + req.originalUrl;
console.log(fullUrl);

    fs.readFile("db/db.json", "utf8", function (err, data) {
        if (err) throw (err);

        var notes = data // STRING
        noteJSON = JSON.parse(notes); // array of objects (?)  

        const found = noteJSON.some(note => note.id === id)

        if (found) {
            noteJSO = noteJSON.filter(note => note.id !== id);
            noteStr = JSON.stringify(noteJSO);
            
            // add to db.json
            fs.writeFile("db/db.json", noteStr, function (err) {
                if (err) throw (err)
                console.log("sucess");
                
            })        
        }}) 
        res.send("/notes");
});

// Init server
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});