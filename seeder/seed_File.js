import { sequelize } from '../config/connect_Db.js';
import { User} from '../models/user.js';
import bcrypt from 'bcrypt';


async function seedingDatabase() {
  try {
    await sequelize.sync({force: true})
    console.log ("connected")
    // Check if there are existing users
    const existingAdmin = await User.findOne({
      where: {
        email: 'admin123@gmail.com'
      }
    });

    // Only seed if the admin doesn't already exist
    if (!existingAdmin) {
        const salt = await bcrypt.genSalt(10);
        console.log(salt);
        const passwordHash = await bcrypt.hash('admin@123',salt);
        await User.create({
        firstName: 'admin',
        lastName: 'NULL',
        email: 'admin123@gmail.com',
        password: passwordHash,
        rememberToken: 'NULL',
        isAdmin: true,
        isVerified: true
      });
    console.log('Default admin user seeded successfully.');
    } else {
    console.log('Default admin user already exists. Skipping seeding.');
    }
  } catch (error) {
    console.error('Error seeding database:', error);
  }
}
seedingDatabase();
// export { seedingDatabase };

