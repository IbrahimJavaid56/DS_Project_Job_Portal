import { User} from '../models/user.js';
import bcrypt from 'bcrypt';


//const saltRounds = 10; // Set your desired number of salt rounds

async function seedingDatabase() {
  try {
    // Check if there are existing users
    const existingAdmin = await User.findOne({
      where: {
        email: 'admin123@gmail.com'
      }
    });

    // Only seed if the admin doesn't already exist
    if (!existingAdmin) {
      //const passwordHash = await bcrypt.hash('abcd', 5);
        await User.create({
        firstName: 'admin',
        lastName: 'NULL',
        email: 'admin123@gmail.com',
        //password: passwordHash,
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
export { seedingDatabase };

