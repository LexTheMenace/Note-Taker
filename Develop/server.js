var express = require("express");
var path = require("path")
var fs = require("fs");
var app = express();
var PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static('public'));

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
        noteJSON = JSON.parse(notes); // array of objects (?)  

        //REcieve note
        newNote = req.body // OBJECT
        // console.log("new note:" + newNote + typeof(newNote)); 
        noteJSON.push(newNote) // OBJECT
        noteJSON.forEach(newNote => {
            i = 0
            newNote.id = i;
            console.log((newNote.id));
            i++;
            
        });
        noteStr = JSON.stringify(noteJSON) // STRING

        // add to db.json
        fs.writeFile("db/db.json", (noteStr), function (err) {
            if (err) throw (err)
        })
    })
    console.log("Note SAved!");

});

//Delete 
app.post("/api/notes/:id", function (req, res) {
    notes.splice(this.data)
    console.log(this.data);

    fs.writeFile("db/db.json", ("[" + notes + "]"), function (err) {
        if (err) throw (err)
    })

})

// Start our server
app.listen(PORT, function () {
    console.log("App listening on PORT " + PORT);
});