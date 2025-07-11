// Script to bulk-insert amenities from amenitiesList (as in Amenities.jsx) into RoomAmenities collection
const mongoose = require('mongoose');
const RoomAmenities = require('../models/RoomAmenities.js');

const amenitiesList = [
  { label: 'Restaurant', iconKey: 'Utensils' },
  { label: 'Bed', iconKey: 'Bed' },
  { label: 'Room Phone', iconKey: 'Phone' },
  { label: 'Parking', iconKey: 'ParkingCircle' },
  { label: 'Shower', iconKey: 'ShowerHead' },
  { label: 'Towel In Room', iconKey: 'Towel' },
  { label: 'Wi-Fi', iconKey: 'Wifi' },
  { label: 'Telivision', iconKey: 'Tv' },
  { label: 'Bath Tub', iconKey: 'Bath' },
  { label: 'Elevator', iconKey: 'Elevator' },
  { label: 'Laggage', iconKey: 'Luggage' },
  { label: 'Team Maker', iconKey: 'Coffee' },
  { label: 'Room AC', iconKey: 'Snowflake' },
];

async function main() {
  await mongoose.connect('mongodb+srv://himalayanwellnessretreats:OeyQXOCXMNZiMISB@cluster0.nwwo4hd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0');
  for (const amenity of amenitiesList) {
    await RoomAmenities.updateOne(
      { label: amenity.label },
      { $set: amenity },
      { upsert: true }
    );
    console.log(`Inserted/updated: ${amenity.label}`);
  }
  await mongoose.disconnect();
  console.log('Done!');
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
