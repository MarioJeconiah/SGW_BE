import { Sequelize, DataTypes } from "sequelize";
import dotenv from "dotenv";

import userModel from "./user.js";
import characterModel from "./character.js";
import weaponModel from "./weapon.js";
import postModel from "./post.js";
import commentModel from "./comment.js";

dotenv.config();

// ==========================
//   CONNECT DATABASE NEON
// ==========================
export const sequelize = new Sequelize(
  process.env.PG_DATABASE,   // e.g. neondb
  process.env.PG_USER,       // e.g. neondb_owner
  process.env.PG_PASSWORD,   // pg password
  {
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    dialect: "postgres",
    logging: false,

    // 🔥 WAJIB UNTUK NEON (SSL ENABLE)
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false  // mengatasi CA certificate error
      }
    }
  }
);

// ==========================
//    REGISTER MODELS
// ==========================
export const User = userModel(sequelize, DataTypes);
export const Character = characterModel(sequelize, DataTypes);
export const Weapon = weaponModel(sequelize, DataTypes);
export const Post = postModel(sequelize, DataTypes);
export const Comment = commentModel(sequelize, DataTypes);

// ==========================
//    RELATIONS / ASSOCIATIONS
// ==========================

// User ↔ Post
User.hasMany(Post, { foreignKey: "user_id" });
Post.belongsTo(User, { foreignKey: "user_id" });

// User ↔ Comment
User.hasMany(Comment, { foreignKey: "user_id" });
Comment.belongsTo(User, { foreignKey: "user_id" });

// Post ↔ Comment
Post.hasMany(Comment, {
  foreignKey: "post_id",
  onDelete: "CASCADE"
});
Comment.belongsTo(Post, { foreignKey: "post_id" });

// Export all models
export default {
  sequelize,
  User,
  Character,
  Weapon,
  Post,
  Comment,
};
