//jshint esversion:6

const express = require("express");
const bodyParser = require("body-parser");
const ejs = require("ejs");
const _ = require("lodash");
const mongoose = require("mongoose");
require('dotenv').config();


const mongouri = process.env.MONGO_URI;
mongoose.connect(mongouri);

const postSchema = new mongoose.Schema({
  title: String,
  postBody: String
})

const Post = mongoose.model("Post", postSchema);


const homeStartingContent = "Welcome to Daily Journal, your digital sanctuary for personal reflection. Capture your thoughts and experiences with our intuitive text-based platform. Embrace the power of daily writing to foster self-discovery and growth. Our secure system ensures your private musings remain protected. Whether you're seeking clarity, tracking goals, or documenting life's journey, Daily Journal provides the perfect space. Cultivate mindfulness through regular entries. Explore your inner world and gain valuable insights. Start your journaling habit today and witness the transformative effects of consistent reflection. Let your words flow freely, uncover patterns, and chart your personal evolution. Daily Journal: where every entry is a step towards greater self-awareness and fulfillment. ";
const aboutContent = "Daily Journal was born from a passion for self-reflection and personal growth. Our mission is to provide a simple, accessible platform for individuals to engage in daily journaling. We believe in the transformative power of regular writing and introspection. Our team of developers and mindfulness enthusiasts have crafted this digital space to foster self-awareness and emotional intelligence. With Daily Journal, users can establish a consistent writing habit, track their thoughts over time, and gain valuable insights into their personal patterns and progress. We prioritize user privacy and data security, ensuring your personal reflections remain confidential. Whether you're a seasoned journal keeper or new to the practice, Daily Journal adapts to your needs. Join our community of introspective individuals and embark on a journey of self-discovery. ";
const contactContent = "We value your feedback and are here to assist you with Daily Journal. For questions, suggestions, or support, please email us at yonatan09@gmail.com. Visit our GitHub repository at github.com/Yonatanhaile/ for updates and to contribute to our project. We appreciate your input as it helps us improve Daily Journal. Thank you for choosing us as your journaling companion. ";

const app = express();  





app.set('view engine', 'ejs');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", function(req, res){
  Post.find()
    .then(docs =>{
      console.log("Succesfuly Post found");
      res.render("home", {startingContent: homeStartingContent, sendPosts: docs})
    })
    .catch(err =>{
      console.log("Failed to search posts" + err);
    })

  
})

app.get("/about", function(req, res){
  res.render("about", {about: aboutContent});
})

app.get("/contact", function(req, res){
  res.render("contact", {contact: contactContent});
})

app.get("/compose", function(req, res){
  res.render("compose");  
})

app.post("/compose", function(req, res){

const newPost = new Post({
  title: req.body.title,
  postBody: req.body.post
})

newPost.save()
  .then(()=>{
    console.log("Post Succesfuly Saved");
    res.redirect("/")
  })
  .catch(err=>{
    console.log("Error Saving Post" + err);
    res.redirect("/")
  })

})

app.get("/posts/:value", function(req, res){
  const requestedTitle = _.lowerCase(req.params.value);

  Post.find()
    .then(docs=>{
      docs.forEach(element => {
        const storedTitle = _.lowerCase(element.title);
        if(storedTitle === requestedTitle){
          res.render("post", {title: element.title, content: element.postBody});
        }
      });
    })
    .catch(err=>{
      console.log("Error finding posts" + err);
    })
})

app.get("/delete", function(req, res){
  Post.find()
    .then(docs =>{
      res.render("delete", {posts: docs})
    })
    .catch(err =>{
      console.log("Error findign the posts" + err);
    })
})

app.post("/delete/:id", function(req, res){
  const postIdToDelete = req.params.id;

  Post.findByIdAndDelete(postIdToDelete)
    .then(()=>{
      console.log("Post Succesfuly deleted");
      res.redirect("/delete");
    })
    .catch(err=>{
      console.log("Error deleting Post" + err);
    })
})








const Port = process.env.PORT || 3000;
app.listen(Port, function() {
  console.log(`Server is running on port ${Port}`);
});
