// Initial Mock Data for Rajvilas Heritage Palace & Resort (Indian Heritage Luxury Edition)
// Udaipur, Rajasthan • GSTIN: 08AAACL7891F1Z2

export const STAFF_ACCOUNTS = [
  {
    username: 'admin',
    password: 'admin123',
    name: 'Vikram Rathore',
    role: 'admin',
    designation: 'General Manager',
    avatar: 'VR',
    email: 'gm.rathore@rajvilaspalace.in',
    phone: '+91 98201 11222'
  },
  {
    username: 'reception',
    password: 'reception123',
    name: 'Sneha Kulkarni',
    role: 'reception',
    designation: 'Front Office Manager',
    avatar: 'SK',
    email: 'frontdesk@rajvilaspalace.in',
    phone: '+91 98450 33444'
  },
  {
    username: 'housekeeping',
    password: 'clean123',
    name: 'Ramesh Yadav',
    role: 'housekeeping',
    designation: 'Executive Housekeeper',
    avatar: 'RY',
    email: 'housekeeping@rajvilaspalace.in',
    phone: '+91 98110 55666'
  }
];

export const formatINR = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0';
  return '₹' + Math.round(amount).toLocaleString('en-IN');
};

export const formatINRCurrency = (amount) => {
  if (amount === undefined || amount === null || isNaN(amount)) return '₹0.00';
  return '₹' + Number(amount).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
};

export const POPULAR_EXTRA_CHARGES = [
  { id: 'thali', name: 'Rajasthani Royal Thali Dinner', category: 'In-Room Dining', price: 1200 },
  { id: 'dalbaati', name: 'Dal Baati Churma Platter', category: 'In-Room Dining', price: 850 },
  { id: 'paneer', name: 'Paneer Tikka & Naan Basket', category: 'In-Room Dining', price: 650 },
  { id: 'chai', name: 'Masala Chai & Pakora Platter', category: 'Beverages', price: 350 },
  { id: 'spa', name: 'Ayurvedic Abhyanga Spa Therapy (60m)', category: 'Palace Spa', price: 3500 },
  { id: 'chauffeur', name: 'Airport Luxury Chauffeur Transfer', category: 'Concierge', price: 1800 },
  { id: 'laundry', name: 'Silk & Khadi Laundry Dry Clean', category: 'Housekeeping', price: 750 },
  { id: 'boat', name: 'Lake Pichola Sunset Boat Charter', category: 'Experiences', price: 4500 }
];

export const INITIAL_ROOMS = [
  { id: 1, number: 101, floor: 1, type: 'Deluxe Heritage Room', category: 'Single', status: 'occupied', price: 6500, beds: '1 King Bed', size: '38 m²', amenities: ['High-speed WiFi', 'Palace Courtyard View', 'Smart 4K TV', 'Masala Chai & Espresso Bar', 'Rain Shower'] },
  { id: 2, number: 102, floor: 1, type: 'Deluxe Heritage Room', category: 'Single', status: 'occupied', price: 6500, beds: '1 King Bed', size: '38 m²', amenities: ['High-speed WiFi', 'Palace Courtyard View', 'Smart 4K TV', 'Masala Chai & Espresso Bar'] },
  { id: 3, number: 103, floor: 1, type: 'Classic Standard Room', category: 'Single', status: 'available', price: 4500, beds: '1 Queen Bed', size: '32 m²', amenities: ['High-speed WiFi', 'Smart TV', 'Solid Sheesham Work Desk'] },
  { id: 4, number: 104, floor: 1, type: 'Classic Standard Room', category: 'Single', status: 'cleaning', price: 4500, beds: '1 Queen Bed', size: '32 m²', amenities: ['High-speed WiFi', 'Smart TV', 'Solid Sheesham Work Desk'] },
  { id: 5, number: 105, floor: 1, type: 'Royal Twin Queen Room', category: 'Double', status: 'occupied', price: 8500, beds: '2 Queen Beds', size: '46 m²', amenities: ['Mughal Garden View', 'Minibar', 'Double Marble Vanity', 'Smart TV', 'Private Jharokha Balcony'] },
  { id: 6, number: 106, floor: 1, type: 'Royal Twin Queen Room', category: 'Double', status: 'available', price: 8500, beds: '2 Queen Beds', size: '46 m²', amenities: ['Mughal Garden View', 'Minibar', 'Double Marble Vanity', 'Smart TV'] },
  { id: 7, number: 107, floor: 1, type: 'Royal Twin Queen Room', category: 'Double', status: 'available', price: 8500, beds: '2 Queen Beds', size: '46 m²', amenities: ['Mughal Garden View', 'Minibar', 'Double Marble Vanity', 'Smart TV'] },
  { id: 8, number: 108, floor: 1, type: 'Royal Twin Queen Room', category: 'Double', status: 'cleaning', price: 8500, beds: '2 Queen Beds', size: '46 m²', amenities: ['Mughal Garden View', 'Minibar', 'Double Marble Vanity', 'Smart TV'] },
  { id: 9, number: 109, floor: 1, type: 'Rajputana Executive Suite', category: 'Suite', status: 'available', price: 18500, beds: '1 King Bed + Royal Lounge', size: '64 m²', amenities: ['Lake Pichola Panorama', 'Private Jacuzzi', 'Royal Baithak Lounge', 'Personal Butler Service', 'Wine & Chaat Bar'] },
  { id: 10, number: 110, floor: 1, type: 'Rajputana Executive Suite', category: 'Suite', status: 'available', price: 18500, beds: '1 King Bed + Royal Lounge', size: '64 m²', amenities: ['Lake Pichola Panorama', 'Private Jacuzzi', 'Royal Baithak Lounge', 'Butler Service'] },
  { id: 11, number: 201, floor: 2, type: 'Deluxe Heritage Room', category: 'Single', status: 'available', price: 6800, beds: '1 King Bed', size: '40 m²', amenities: ['High-speed WiFi', 'Aravalli Hill View', 'Smart TV', 'Coffee Bar'] },
  { id: 12, number: 202, floor: 2, type: 'Royal Twin Queen Room', category: 'Double', status: 'available', price: 9000, beds: '2 Queen Beds', size: '48 m²', amenities: ['Carved Balcony', 'Minibar', 'Smart TV', 'Brass Bath Fittings'] },
  { id: 13, number: 203, floor: 2, type: 'Royal Twin Queen Room', category: 'Double', status: 'available', price: 9000, beds: '2 Queen Beds', size: '48 m²', amenities: ['Carved Balcony', 'Minibar', 'Smart TV'] },
  { id: 14, number: 204, floor: 2, type: 'Rajputana Executive Suite', category: 'Suite', status: 'occupied', price: 19500, beds: '1 King Bed + Living Room', size: '68 m²', amenities: ['Lake View', 'Private Jacuzzi', 'Dual Balconies', '24/7 Butler Service'] },
  { id: 15, number: 205, floor: 2, type: 'Classic Standard Room', category: 'Single', status: 'maintenance', price: 4800, beds: '1 Queen Bed', size: '32 m²', amenities: ['High-speed WiFi', 'Work Desk'] },
  { id: 16, number: 206, floor: 2, type: 'Luxury Grand Double', category: 'Double', status: 'available', price: 10500, beds: '2 Queen Beds', size: '52 m²', amenities: ['Palace Pool View', 'Minibar', 'Smart TV'] },
  { id: 17, number: 207, floor: 2, type: 'Rajputana Executive Suite', category: 'Suite', status: 'available', price: 19500, beds: '1 King Bed + Lounge', size: '68 m²', amenities: ['Lake View', 'Jacuzzi', 'Traditional Fireplace'] },
  { id: 18, number: 208, floor: 2, type: 'Rajputana Executive Suite', category: 'Suite', status: 'available', price: 19500, beds: '1 King Bed + Lounge', size: '68 m²', amenities: ['Lake View', 'Jacuzzi', 'Fireplace'] },
  { id: 19, number: 209, floor: 2, type: 'Rajputana Executive Suite', category: 'Suite', status: 'occupied', price: 19500, beds: '1 King Bed + Lounge', size: '68 m²', amenities: ['Lake View', 'Jacuzzi'] },
  { id: 20, number: 210, floor: 2, type: 'Royal Twin Queen Room', category: 'Double', status: 'available', price: 9000, beds: '2 Queen Beds', size: '48 m²', amenities: ['Garden View', 'Minibar'] },
  { id: 21, number: 301, floor: 3, type: 'Maharajah Presidential Penthouse', category: 'Suite', status: 'occupied', price: 45000, beds: '2 Master King Suites', size: '135 m²', amenities: ['360° Rooftop Terrace', 'Private Plunge Pool', 'Personal Chef & Royal Kitchen', '24/7 Dedicated Chauffeur & Butler', 'Grand Sitar & Sangeet Pavilion'] },
  { id: 22, number: 302, floor: 3, type: 'Deluxe Heritage Room', category: 'Single', status: 'occupied', price: 7200, beds: '1 King Bed', size: '42 m²', amenities: ['Top Floor Terrace View', 'Smart TV', 'Makrana Marble Bath'] },
  { id: 23, number: 303, floor: 3, type: 'Rajputana Executive Suite', category: 'Suite', status: 'available', price: 21000, beds: '1 King Bed + Lounge', size: '70 m²', amenities: ['Lake Front', 'Jacuzzi', 'Sandalwood Inlay Decor'] },
  { id: 24, number: 304, floor: 3, type: 'Luxury Grand Double', category: 'Double', status: 'available', price: 11000, beds: '2 King Beds', size: '56 m²', amenities: ['Panoramic View', 'Minibar', 'Filter Coffee Machine'] },
  { id: 25, number: 305, floor: 3, type: 'Luxury Grand Double', category: 'Double', status: 'available', price: 11000, beds: '2 King Beds', size: '56 m²', amenities: ['Panoramic View', 'Minibar'] },
  { id: 26, number: 306, floor: 3, type: 'Rajputana Executive Suite', category: 'Suite', status: 'occupied', price: 21000, beds: '1 King Bed + Lounge', size: '70 m²', amenities: ['Lake Front', 'Jacuzzi'] },
  { id: 27, number: 307, floor: 3, type: 'Deluxe Heritage Room', category: 'Single', status: 'available', price: 7200, beds: '1 King Bed', size: '42 m²', amenities: ['Fort Panorama', 'Smart TV'] },
  { id: 28, number: 308, floor: 3, type: 'Luxury Grand Double', category: 'Double', status: 'occupied', price: 11000, beds: '2 King Beds', size: '56 m²', amenities: ['Panoramic View', 'Minibar'] },
  { id: 29, number: 309, floor: 3, type: 'Rajputana Executive Suite', category: 'Suite', status: 'cleaning', price: 21000, beds: '1 King Bed + Lounge', size: '70 m²', amenities: ['Lake Front', 'Jacuzzi'] },
  { id: 30, number: 310, floor: 3, type: 'Deluxe Heritage Room', category: 'Single', status: 'available', price: 7200, beds: '1 King Bed', size: '42 m²', amenities: ['Fort Panorama', 'Smart TV'] }
];

export const INITIAL_RESERVATIONS = [
  { 
    id: 1, 
    guest: 'Rajesh & Sunita Sharma', 
    email: 'rajesh.sharma@tata.com', 
    phone: '+91 98201 44556', 
    room: 101, 
    checkin: '2026-10-22', 
    checkout: '2026-10-26', 
    status: 'checked-in', 
    guestsCount: 2, 
    totalAmount: 26000, 
    idType: 'Aadhaar Card', 
    idNumber: '4455 8899 1234', 
    idVerified: true, 
    notes: 'Requires pure Jain vegetarian meals & non-alcoholic saffron welcome drink' 
  },
  { 
    id: 2, 
    guest: 'Vikramaditya Singhania', 
    email: 'v.singhania@singhania-group.in', 
    phone: '+91 98100 88776', 
    room: 102, 
    checkin: '2026-10-23', 
    checkout: '2026-10-27', 
    status: 'checked-in', 
    guestsCount: 1, 
    totalAmount: 26000, 
    idType: 'Passport', 
    idNumber: 'Z8901234', 
    idVerified: true, 
    notes: 'Late checkout at 3:00 PM requested for evening Vistara flight to Delhi' 
  },
  { 
    id: 3, 
    guest: 'Priya Patel', 
    email: 'priya.patel@ahmedabad-design.in', 
    phone: '+91 94260 12345', 
    room: 105, 
    checkin: '2026-10-20', 
    checkout: '2026-10-25', 
    status: 'checked-in', 
    guestsCount: 2, 
    totalAmount: 42500, 
    idType: 'Aadhaar Card', 
    idNumber: '7812 3456 9012', 
    idVerified: true, 
    notes: '25th Wedding Anniversary; requested Marigold & Mogra floral suite decoration' 
  },
  { 
    id: 4, 
    guest: 'Col. Arvind Malhotra', 
    email: 'arvind.malhotra@retd-army.gov.in', 
    phone: '+91 99880 77665', 
    room: 204, 
    checkin: '2026-10-24', 
    checkout: '2026-10-29', 
    status: 'checked-in', 
    guestsCount: 2, 
    totalAmount: 97500, 
    idType: 'Driving License', 
    idNumber: 'DL-042011005678', 
    idVerified: true, 
    notes: 'Luxury airport pickup from Udaipur Airport arranged' 
  },
  { 
    id: 5, 
    guest: 'Aarav & Meera Kapoor', 
    email: 'aarav.kapoor@venture-capital.in', 
    phone: '+91 98450 99887', 
    room: 301, 
    checkin: '2026-10-22', 
    checkout: '2026-10-30', 
    status: 'checked-in', 
    guestsCount: 3, 
    totalAmount: 360000, 
    idType: 'Passport', 
    idNumber: 'K4512349', 
    idVerified: true, 
    notes: 'VIP Maharajah Penthouse: Private royal thali dinner & Lake Pichola sunset boat charter' 
  },
  { 
    id: 6, 
    guest: 'Dr. K. Radhakrishnan', 
    email: 'k.radhakrishnan@isro-alumni.org.in', 
    phone: '+91 94440 22334', 
    room: 103, 
    checkin: '2026-10-25', 
    checkout: '2026-10-28', 
    status: 'confirmed', 
    guestsCount: 1, 
    totalAmount: 13500, 
    idType: 'Aadhaar Card', 
    idNumber: '9012 3344 7788', 
    idVerified: false, 
    notes: 'Authentic South Indian brass filter coffee kit in room' 
  },
  { 
    id: 7, 
    guest: 'Ananya Iyer', 
    email: 'ananya.iyer@hcltech.com', 
    phone: '+91 98401 55667', 
    room: 106, 
    checkin: '2026-10-26', 
    checkout: '2026-10-31', 
    status: 'confirmed', 
    guestsCount: 2, 
    totalAmount: 42500, 
    idType: 'Aadhaar Card', 
    idNumber: '5566 7788 9900', 
    idVerified: true, 
    notes: 'Early check-in at 8:00 AM requested for family wedding mahurat' 
  },
  { 
    id: 8, 
    guest: 'Rohan & Tanvi Verma', 
    email: 'rohan.verma@zomato-partners.in', 
    phone: '+91 98290 66554', 
    room: 109, 
    checkin: '2026-10-27', 
    checkout: '2026-11-02', 
    status: 'confirmed', 
    guestsCount: 2, 
    totalAmount: 111000, 
    idType: 'Passport', 
    idNumber: 'N7894561', 
    idVerified: true, 
    notes: 'Honeymoon couple: Royal Ayurvedic spa booking for two' 
  },
  { 
    id: 9, 
    guest: 'Siddharth Deshmukh', 
    email: 'siddharth@mahindra-auto.in', 
    phone: '+91 98220 33221', 
    room: 202, 
    checkin: '2026-10-28', 
    checkout: '2026-11-01', 
    status: 'pending', 
    guestsCount: 2, 
    totalAmount: 36000, 
    idType: 'Aadhaar Card', 
    idNumber: '2233 4455 6677', 
    idVerified: false, 
    notes: 'Corporate business folio with GSTIN 27AAACM1234F1Z5' 
  },
  { 
    id: 10, 
    guest: 'Zoya Akhtar & Family', 
    email: 'zoya.akhtar@redchillies.in', 
    phone: '+91 98200 11990', 
    room: 303, 
    checkin: '2026-10-29', 
    checkout: '2026-11-04', 
    status: 'confirmed', 
    guestsCount: 3, 
    totalAmount: 126000, 
    idType: 'Passport', 
    idNumber: 'P3321456', 
    idVerified: true, 
    notes: 'High floor suite with quiet lake view for film scriptwriting' 
  },
  { 
    id: 11, 
    guest: 'Harpreet Singh Sandhu', 
    email: 'harpreet@amritsar-agri.in', 
    phone: '+91 98140 44332', 
    room: 110, 
    checkin: '2026-10-23', 
    checkout: '2026-10-26', 
    status: 'confirmed', 
    guestsCount: 2, 
    totalAmount: 55500, 
    idType: 'Aadhaar Card', 
    idNumber: '6677 8899 0011', 
    idVerified: true, 
    notes: 'Pure Punjabi breakfast (Aloo Paratha & White Butter) preference' 
  },
  { 
    id: 12, 
    guest: 'Meenakshi Sundaram', 
    email: 'meenakshi@chennai-silk.in', 
    phone: '+91 94441 55667', 
    room: 104, 
    checkin: '2026-10-20', 
    checkout: '2026-10-23', 
    status: 'checked-out', 
    guestsCount: 2, 
    totalAmount: 13500, 
    idType: 'Aadhaar Card', 
    idNumber: '1122 3344 5566', 
    idVerified: true, 
    notes: 'Checked out cleanly at 11:00 AM; bill settled via GPay' 
  },
  { 
    id: 13, 
    guest: 'Kavita & Aditya Joshi', 
    email: 'aditya.joshi@pune-tech.in', 
    phone: '+91 98221 77889', 
    room: 104, 
    checkin: '2026-10-24', 
    checkout: '2026-10-28', 
    status: 'confirmed', 
    guestsCount: 2, 
    totalAmount: 18000, 
    idType: 'Aadhaar Card', 
    idNumber: '7788 9900 1122', 
    idVerified: true, 
    notes: 'Next guest booked into Room 104 immediately following checkout' 
  },
  { 
    id: 14, 
    guest: 'Devendra Shekhawat', 
    email: 'devendra@jaipur-gems.in', 
    phone: '+91 98291 33445', 
    room: 108, 
    checkin: '2026-10-21', 
    checkout: '2026-10-24', 
    status: 'checked-out', 
    guestsCount: 2, 
    totalAmount: 25500, 
    idType: 'Aadhaar Card', 
    idNumber: '3344 5566 7788', 
    idVerified: true, 
    notes: 'Turnover in progress by housekeeping; room re-booked for next weekend' 
  },
  { 
    id: 15, 
    guest: 'Pradeep Goel', 
    email: 'pradeep.goel@delhi-exports.in', 
    phone: '+91 98101 22334', 
    room: 108, 
    checkin: '2026-10-26', 
    checkout: '2026-10-30', 
    status: 'confirmed', 
    guestsCount: 2, 
    totalAmount: 34000, 
    idType: 'Driving License', 
    idNumber: 'DL-112015009876', 
    idVerified: true, 
    notes: 'Advance Diwali vacation booking for Room 108' 
  }
];

export const INITIAL_BILLS = [
  { 
    id: 1001, 
    resId: 1, 
    guest: 'Rajesh & Sunita Sharma', 
    room: 101, 
    roomCharges: 26000, 
    extraCharges: 3200, 
    taxes: 3504, 
    total: 32704, 
    status: 'paid', 
    paymentMethod: 'HDFC Regalia Gold (Credit Card)', 
    date: '2026-10-23',
    items: [
      { id: 1, description: 'Room Tariff (Deluxe Heritage - 4 Nights)', amount: 26000, date: '2026-10-22' },
      { id: 2, description: 'Rajasthani Royal Thali Dinner (2 pax)', amount: 2400, date: '2026-10-23' },
      { id: 3, description: 'Dal Baati Churma Lunch', amount: 800, date: '2026-10-23' }
    ]
  },
  { 
    id: 1002, 
    resId: 2, 
    guest: 'Vikramaditya Singhania', 
    room: 102, 
    roomCharges: 26000, 
    extraCharges: 1850, 
    taxes: 3342, 
    total: 31192, 
    status: 'pending', 
    paymentMethod: 'UPI (Google Pay)', 
    date: '2026-10-23',
    items: [
      { id: 1, description: 'Room Tariff (Deluxe Heritage - 4 Nights)', amount: 26000, date: '2026-10-23' },
      { id: 2, description: 'Udaipur Airport Luxury Chauffeur Transfer', amount: 1850, date: '2026-10-23' }
    ]
  },
  { 
    id: 1003, 
    resId: 3, 
    guest: 'Priya Patel', 
    room: 105, 
    roomCharges: 42500, 
    extraCharges: 6400, 
    taxes: 5868, 
    total: 54768, 
    status: 'paid', 
    paymentMethod: 'ICICI Sapphiro Card', 
    date: '2026-10-22',
    items: [
      { id: 1, description: 'Room Tariff (Royal Twin Queen - 5 Nights)', amount: 42500, date: '2026-10-20' },
      { id: 2, description: 'Ayurvedic Abhyanga Couple Spa (60m)', amount: 5000, date: '2026-10-21' },
      { id: 3, description: 'Anniversary Saffron Kesar Sherbet & Cake', amount: 1400, date: '2026-10-22' }
    ]
  },
  { 
    id: 1004, 
    resId: 4, 
    guest: 'Col. Arvind Malhotra', 
    room: 204, 
    roomCharges: 97500, 
    extraCharges: 4500, 
    taxes: 12240, 
    total: 114240, 
    status: 'paid', 
    paymentMethod: 'SBI Aurum Card', 
    date: '2026-10-22',
    items: [
      { id: 1, description: 'Suite Tariff (Rajputana Executive - 5 Nights)', amount: 97500, date: '2026-10-24' },
      { id: 2, description: 'Lake Pichola Sunset Boat Charter', amount: 4500, date: '2026-10-24' }
    ]
  },
  { 
    id: 1005, 
    resId: 5, 
    guest: 'Aarav & Meera Kapoor', 
    room: 301, 
    roomCharges: 360000, 
    extraCharges: 45000, 
    taxes: 48600, 
    total: 453600, 
    status: 'paid', 
    paymentMethod: 'Axis Burgundy Private Wire', 
    date: '2026-10-23',
    items: [
      { id: 1, description: 'Penthouse Tariff (Maharajah Penthouse - 8 Nights)', amount: 360000, date: '2026-10-22' },
      { id: 2, description: 'Royal Palace Banquet & Dedicated Chef Service', amount: 35000, date: '2026-10-23' },
      { id: 3, description: 'Vintage Rolls Royce Excursion to Kumbhalgarh', amount: 10000, date: '2026-10-24' }
    ]
  },
  { 
    id: 1006, 
    resId: 6, 
    guest: 'Dr. K. Radhakrishnan', 
    room: 103, 
    roomCharges: 13500, 
    extraCharges: 0, 
    taxes: 1620, 
    total: 15120, 
    status: 'pending', 
    paymentMethod: 'Corporate NEFT Transfer', 
    date: '2026-10-24',
    items: [
      { id: 1, description: 'Room Tariff (Classic Standard - 3 Nights)', amount: 13500, date: '2026-10-25' }
    ]
  },
  { 
    id: 1007, 
    resId: 7, 
    guest: 'Ananya Iyer', 
    room: 106, 
    roomCharges: 42500, 
    extraCharges: 2200, 
    taxes: 5364, 
    total: 50064, 
    status: 'pending', 
    paymentMethod: 'PhonePe UPI', 
    date: '2026-10-24',
    items: [
      { id: 1, description: 'Room Tariff (Royal Twin Queen - 5 Nights)', amount: 42500, date: '2026-10-26' },
      { id: 2, description: 'Wedding Attire Express Ironing & Steaming', amount: 2200, date: '2026-10-26' }
    ]
  },
  { 
    id: 1012, 
    resId: 12, 
    guest: 'Meenakshi Sundaram', 
    room: 104, 
    roomCharges: 13500, 
    extraCharges: 1200, 
    taxes: 1764, 
    total: 16464, 
    status: 'paid', 
    paymentMethod: 'UPI (GPay)', 
    date: '2026-10-23',
    items: [
      { id: 1, description: 'Room Tariff (Classic Standard - 3 Nights)', amount: 13500, date: '2026-10-20' },
      { id: 2, description: 'Mini Bar Saffron Sherbet & Cashews', amount: 1200, date: '2026-10-22' }
    ]
  }
];

export const INITIAL_INVENTORY = [
  { id: 1, name: 'Forest Essentials Sandalwood Bath Kit', category: 'Toiletries', quantity: 180, min: 60, unit: 'sets', costPerUnit: 650, icon: 'Droplets' },
  { id: 2, name: 'Mulberry Silk & Pure Malmal Pillow Covers', category: 'Linens', quantity: 95, min: 40, unit: 'pairs', costPerUnit: 1250, icon: 'BedDouble' },
  { id: 3, name: 'Handwoven Khadi Cotton Spa Robes', category: 'Guest Amenities', quantity: 58, min: 30, unit: 'robes', costPerUnit: 2400, icon: 'Shirt' },
  { id: 4, name: 'Belgian & Jaipur Block Print Duvets', category: 'Linens', quantity: 65, min: 30, unit: 'pcs', costPerUnit: 3800, icon: 'Bed' },
  { id: 5, name: 'Organic Darjeeling & Assam Tea Wooden Caddies', category: 'Minibar', quantity: 240, min: 80, unit: 'tins', costPerUnit: 480, icon: 'Coffee' },
  { id: 6, name: 'Carved Brass Palace Wooden RFID Keycards', category: 'Front Desk', quantity: 42, min: 50, unit: 'cards', costPerUnit: 350, icon: 'KeyRound' },
  { id: 7, name: 'Pure Brass Copper Water Bottles & Tumblers', category: 'Guest Amenities', quantity: 110, min: 40, unit: 'sets', costPerUnit: 850, icon: 'Sparkles' },
  { id: 8, name: 'Royal Jutti Velour Slippers', category: 'Guest Amenities', quantity: 120, min: 50, unit: 'pairs', costPerUnit: 420, icon: 'Footprints' },
  { id: 9, name: 'Cold-Pressed Virgin Coconut & Almond Hair Oils', category: 'Toiletries', quantity: 140, min: 50, unit: 'bottles', costPerUnit: 390, icon: 'Droplets' },
  { id: 10, name: 'Artisan Saffron & Kesar Sherbet Bottles', category: 'Minibar', quantity: 190, min: 70, unit: 'bottles', costPerUnit: 260, icon: 'Wine' },
  { id: 11, name: 'Ayurvedic Camphor & Neem Floor Sanitizer', category: 'Housekeeping', quantity: 34, min: 15, unit: 'cans', costPerUnit: 1100, icon: 'SprayCan' },
  { id: 12, name: 'HEPA PM2.5 Air Purifier Filters', category: 'Maintenance', quantity: 18, min: 10, unit: 'filters', costPerUnit: 1850, icon: 'Wind' }
];

export const INITIAL_LOGS = [
  { id: 1, author: 'Vikram Rathore (GM)', time: '08:15 AM', category: 'Executive', message: 'Morning Briefing: All VIP wedding party arrivals from Mumbai welcomed with marigold garlands and saffron sherbet. Royal Penthouse butler stationed.' },
  { id: 2, author: 'Ramesh Yadav (Housekeeping)', time: '10:45 AM', category: 'Maintenance', message: 'Room 205 Daikin AC refrigerant servicing logged with engineering team. ETA completion by 3:30 PM.' },
  { id: 3, author: 'Sneha Kulkarni (Front Desk)', time: '12:30 PM', category: 'Front Desk', message: 'RFID Brass Keycard inventory is under 50 units (currently 42). Auto-reorder queued with Jaipur artisan workshop.' },
  { id: 4, author: 'Sneha Kulkarni (Front Desk)', time: '01:15 PM', category: 'Front Desk', message: 'Room 104 checked out by Meenakshi Sundaram. Housekeeping notified for turnover. Room 104 re-booked for Aditya Joshi arriving this evening.' },
  { id: 5, author: 'Chef Sanjeev (Culinary)', time: '02:00 PM', category: 'Culinary', message: 'Special 7-Course Rajasthani Royal Thali & Dal Baati Churma tasting dinner confirmed for Room 301 at 8:00 PM.' },
  { id: 6, author: 'Arjun Nair (Concierge)', time: '03:45 PM', category: 'Concierge', message: 'Private vintage car city tour and Lake Pichola sunset boat cruise confirmed for Suite 204 guests.' }
];
