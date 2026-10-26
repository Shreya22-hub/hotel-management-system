import { User } from './models/User.js';
import { Room } from './models/Room.js';
import { Reservation } from './models/Reservation.js';
import { Bill } from './models/Bill.js';
import { Inventory } from './models/Inventory.js';
import { Log } from './models/Log.js';
import { hashPassword } from './utils/cryptoSecurity.js';
import {
  STAFF_ACCOUNTS,
  INITIAL_ROOMS,
  INITIAL_RESERVATIONS,
  INITIAL_BILLS,
  INITIAL_INVENTORY,
  INITIAL_LOGS
} from './seedData.js';

export const seedDatabase = async (force = false) => {
  try {
    const roomCount = await Room.countDocuments();
    if (roomCount > 0 && !force) {
      console.log('📦 Database already populated with records. Skipping initial seeding.');
      return;
    }

    console.log('🌱 Populating MongoDB with Rajvilas Heritage Palace master dataset...');

    if (force) {
      await Promise.all([
        User.deleteMany({}),
        Room.deleteMany({}),
        Reservation.deleteMany({}),
        Bill.deleteMany({}),
        Inventory.deleteMany({}),
        Log.deleteMany({})
      ]);
      console.log('🧹 Purged existing MongoDB collections for factory reset.');
    }

    // Insert staff accounts with ID and salted cryptographic password hashes
    const usersWithIds = STAFF_ACCOUNTS.map((u, idx) => ({ 
      id: idx + 1, 
      ...u,
      password: hashPassword(u.password)
    }));
    await User.insertMany(usersWithIds);

    // Insert Rooms
    await Room.insertMany(INITIAL_ROOMS);

    // Insert Reservations
    await Reservation.insertMany(INITIAL_RESERVATIONS);

    // Insert Bills
    await Bill.insertMany(INITIAL_BILLS);

    // Insert Inventory
    await Inventory.insertMany(INITIAL_INVENTORY);

    // Insert Logs
    await Log.insertMany(INITIAL_LOGS);

    console.log('✨ MongoDB Seeding Complete: 30 Rooms, Master Bookings, GST Folios, and Staff Accounts loaded.');
  } catch (error) {
    console.error('❌ Database seeding error:', error.message);
  }
};
