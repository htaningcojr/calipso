var mongoose = require('mongoose'),
    Schema = mongoose.Schema,
    router = require('../../lib/router').Router(),
    Step = require('step'),
    ejs = require('ejs'),
    ObjectId = Schema.ObjectId;      

exports = module.exports;
exports.load = load;

/**
 * Base news module
 * 
 * @param req      request object
 * @param menu     menu response object
 * @param blocks   blocks response object
 * @param db       database reference
 */
function load(req,res,app,next) {      
      
      /** 
       * Menu items
       */
      // res.menu.primary.push({name:'News',url:'/news',regexp:/news/});
      res.menu.secondary.push({name:'News',parentUrl:'/admin',url:'/admin/news'});         
  
      /**
       * Routes
       */      
      Step(
          function addRoutes() {
            if(!router.configured) {
              router.addRoute(/.*/,breakingNews,{end:false, templatePath:__dirname + '/templates/breaking.html'},this.parallel());            
            }
            initialiseModule(this.parallel());
          },
          function done() {              
            router.configured = true;  
            router.route(req,res,next);
          }
      );                                                                                   
      
};

function initialiseModule(next,counter) {
    
    next();          
};

function breakingNews(req,res,next,template) {      
  
    // Create a new news block
    res.blocks.news = [];
    var Content = mongoose.model('Content');
    
    Content.find({tags:'breaking'})
      .sort('created', -1)
      .skip(0).limit(5)          
      .find(function (err, contents) {
            contents.forEach(function(c) {              
              var item = {id:c._id,type:'content',meta:c.toObject()};                
              res.blocks.news.push(item);                                            
            });
            if(template) {
              res.renderedBlocks.right.push(ejs.render(template,{locals:{news:res.blocks.news}}));
            }
            next();
    });
      
};