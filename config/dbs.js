
const env = require('./env.js');
const Sequelize = require('sequelize');
const model = require('../models/model.js');

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
 
  pool: {
    connectionLimit: 100,
    max: env.max,
    min: env.pool.min,
    acquire: env.pool.acquire,
    idle: env.pool.idle
  }
});
 
const db = {};
 
db.sequelize = sequelize;
// require('../models/profileModel.js')(sequelize, Sequelize);
// require('../models/bookInfoQuery.js')(sequelize, Sequelize);
// require('../models/bookRawQuery.js')(sequelize, Sequelize);
// require('../models/bookUpload.js')(sequelize, Sequelize);
// require('../models/modelFetchImgPost.js')(sequelize, Sequelize);

db.profileImage = model.Modelprofile(sequelize, Sequelize);
db.bookInfo = model.ModelBookInfoQuery(sequelize, Sequelize); 
db.bookRawFile = model.modelBookRawQuery(sequelize, Sequelize); 
db.uploadBook = model.modelBookUpload(sequelize, Sequelize);
db.fetchImgPost = model.modelFetchImgPost(sequelize, Sequelize); 

module.exports = db;