// seed/facilitiesData.js
// Static dataset: one major govt hospital / district HQ hospital per district-town,
// spread across Indian states & UTs, for the "Nearest PHC/Hospital" demo feature.
// Coordinates are city/town-center approximations (accurate enough for a "nearest facility" demo).

module.exports = [
  // Madhya Pradesh
  { name: "District Hospital Dewas", type: "District Hospital", state: "Madhya Pradesh", district: "Dewas", lat: 22.9676, lng: 76.0534 },
  { name: "Hamidia Hospital, Bhopal", type: "Govt Hospital", state: "Madhya Pradesh", district: "Bhopal", lat: 23.2599, lng: 77.4126 },
  { name: "District Hospital Indore", type: "District Hospital", state: "Madhya Pradesh", district: "Indore", lat: 22.7196, lng: 75.8577 },
  { name: "District Hospital Ujjain", type: "District Hospital", state: "Madhya Pradesh", district: "Ujjain", lat: 23.1765, lng: 75.7885 },
  { name: "District Hospital Gwalior", type: "District Hospital", state: "Madhya Pradesh", district: "Gwalior", lat: 26.2183, lng: 78.1828 },
  { name: "District Hospital Jabalpur", type: "District Hospital", state: "Madhya Pradesh", district: "Jabalpur", lat: 23.1815, lng: 79.9864 },

  // Uttar Pradesh
  { name: "District Hospital Lucknow", type: "District Hospital", state: "Uttar Pradesh", district: "Lucknow", lat: 26.8467, lng: 80.9462 },
  { name: "District Hospital Kanpur", type: "District Hospital", state: "Uttar Pradesh", district: "Kanpur", lat: 26.4499, lng: 80.3319 },
  { name: "District Hospital Varanasi", type: "District Hospital", state: "Uttar Pradesh", district: "Varanasi", lat: 25.3176, lng: 82.9739 },
  { name: "District Hospital Agra", type: "District Hospital", state: "Uttar Pradesh", district: "Agra", lat: 27.1767, lng: 78.0081 },
  { name: "District Hospital Prayagraj", type: "District Hospital", state: "Uttar Pradesh", district: "Prayagraj", lat: 25.4358, lng: 81.8463 },
  { name: "District Hospital Gorakhpur", type: "District Hospital", state: "Uttar Pradesh", district: "Gorakhpur", lat: 26.7606, lng: 83.3732 },
  { name: "District Hospital Meerut", type: "District Hospital", state: "Uttar Pradesh", district: "Meerut", lat: 28.9845, lng: 77.7064 },

  // Bihar
  { name: "Patna Medical College Hospital", type: "Govt Hospital", state: "Bihar", district: "Patna", lat: 25.6127, lng: 85.1414 },
  { name: "District Hospital Gaya", type: "District Hospital", state: "Bihar", district: "Gaya", lat: 24.7955, lng: 85.0002 },
  { name: "District Hospital Muzaffarpur", type: "District Hospital", state: "Bihar", district: "Muzaffarpur", lat: 26.1225, lng: 85.3906 },
  { name: "District Hospital Bhagalpur", type: "District Hospital", state: "Bihar", district: "Bhagalpur", lat: 25.2445, lng: 86.9718 },

  // Rajasthan
  { name: "Sawai Man Singh Hospital, Jaipur", type: "Govt Hospital", state: "Rajasthan", district: "Jaipur", lat: 26.9124, lng: 75.7873 },
  { name: "District Hospital Jodhpur", type: "District Hospital", state: "Rajasthan", district: "Jodhpur", lat: 26.2389, lng: 73.0243 },
  { name: "District Hospital Udaipur", type: "District Hospital", state: "Rajasthan", district: "Udaipur", lat: 24.5854, lng: 73.7125 },
  { name: "District Hospital Kota", type: "District Hospital", state: "Rajasthan", district: "Kota", lat: 25.2138, lng: 75.8648 },
  { name: "District Hospital Bikaner", type: "District Hospital", state: "Rajasthan", district: "Bikaner", lat: 28.0229, lng: 73.3119 },

  // Maharashtra
  { name: "Sion Hospital, Mumbai", type: "Govt Hospital", state: "Maharashtra", district: "Mumbai", lat: 19.0398, lng: 72.8619 },
  { name: "Sassoon General Hospital, Pune", type: "Govt Hospital", state: "Maharashtra", district: "Pune", lat: 18.5195, lng: 73.8553 },
  { name: "District Hospital Nagpur", type: "District Hospital", state: "Maharashtra", district: "Nagpur", lat: 21.1458, lng: 79.0882 },
  { name: "District Hospital Nashik", type: "District Hospital", state: "Maharashtra", district: "Nashik", lat: 19.9975, lng: 73.7898 },
  { name: "District Hospital Aurangabad", type: "District Hospital", state: "Maharashtra", district: "Aurangabad", lat: 19.8762, lng: 75.3433 },

  // Gujarat
  { name: "Civil Hospital Ahmedabad", type: "Govt Hospital", state: "Gujarat", district: "Ahmedabad", lat: 23.0479, lng: 72.5814 },
  { name: "District Hospital Surat", type: "District Hospital", state: "Gujarat", district: "Surat", lat: 21.1702, lng: 72.8311 },
  { name: "District Hospital Vadodara", type: "District Hospital", state: "Gujarat", district: "Vadodara", lat: 22.3072, lng: 73.1812 },
  { name: "District Hospital Rajkot", type: "District Hospital", state: "Gujarat", district: "Rajkot", lat: 22.3039, lng: 70.8022 },

  // Karnataka
  { name: "Victoria Hospital, Bengaluru", type: "Govt Hospital", state: "Karnataka", district: "Bengaluru", lat: 12.9634, lng: 77.5730 },
  { name: "District Hospital Mysuru", type: "District Hospital", state: "Karnataka", district: "Mysuru", lat: 12.2958, lng: 76.6394 },
  { name: "District Hospital Hubballi", type: "District Hospital", state: "Karnataka", district: "Hubballi-Dharwad", lat: 15.3647, lng: 75.1240 },
  { name: "District Hospital Mangaluru", type: "District Hospital", state: "Karnataka", district: "Dakshina Kannada", lat: 12.9141, lng: 74.8560 },
  { name: "District Hospital Belagavi", type: "District Hospital", state: "Karnataka", district: "Belagavi", lat: 15.8497, lng: 74.4977 },

  // Tamil Nadu
  { name: "Rajiv Gandhi Govt General Hospital, Chennai", type: "Govt Hospital", state: "Tamil Nadu", district: "Chennai", lat: 13.0827, lng: 80.2707 },
  { name: "District Hospital Coimbatore", type: "District Hospital", state: "Tamil Nadu", district: "Coimbatore", lat: 11.0168, lng: 76.9558 },
  { name: "District Hospital Madurai", type: "District Hospital", state: "Tamil Nadu", district: "Madurai", lat: 9.9252, lng: 78.1198 },
  { name: "District Hospital Tiruchirappalli", type: "District Hospital", state: "Tamil Nadu", district: "Tiruchirappalli", lat: 10.7905, lng: 78.7047 },
  { name: "District Hospital Salem", type: "District Hospital", state: "Tamil Nadu", district: "Salem", lat: 11.6643, lng: 78.1460 },

  // Andhra Pradesh & Telangana
  { name: "Osmania General Hospital, Hyderabad", type: "Govt Hospital", state: "Telangana", district: "Hyderabad", lat: 17.3850, lng: 78.4867 },
  { name: "District Hospital Warangal", type: "District Hospital", state: "Telangana", district: "Warangal", lat: 17.9689, lng: 79.5941 },
  { name: "District Hospital Visakhapatnam", type: "District Hospital", state: "Andhra Pradesh", district: "Visakhapatnam", lat: 17.6868, lng: 83.2185 },
  { name: "District Hospital Vijayawada", type: "District Hospital", state: "Andhra Pradesh", district: "Vijayawada", lat: 16.5062, lng: 80.6480 },
  { name: "District Hospital Tirupati", type: "District Hospital", state: "Andhra Pradesh", district: "Tirupati", lat: 13.6288, lng: 79.4192 },

  // Kerala
  { name: "Government Medical College Hospital, Thiruvananthapuram", type: "Govt Hospital", state: "Kerala", district: "Thiruvananthapuram", lat: 8.5241, lng: 76.9366 },
  { name: "District Hospital Kochi", type: "District Hospital", state: "Kerala", district: "Ernakulam", lat: 9.9312, lng: 76.2673 },
  { name: "District Hospital Kozhikode", type: "District Hospital", state: "Kerala", district: "Kozhikode", lat: 11.2588, lng: 75.7804 },
  { name: "District Hospital Thrissur", type: "District Hospital", state: "Kerala", district: "Thrissur", lat: 10.5276, lng: 76.2144 },

  // West Bengal
  { name: "SSKM Hospital, Kolkata", type: "Govt Hospital", state: "West Bengal", district: "Kolkata", lat: 22.5382, lng: 88.3433 },
  { name: "District Hospital Asansol", type: "District Hospital", state: "West Bengal", district: "Asansol", lat: 23.6739, lng: 86.9524 },
  { name: "District Hospital Siliguri", type: "District Hospital", state: "West Bengal", district: "Siliguri", lat: 26.7271, lng: 88.3953 },
  { name: "District Hospital Durgapur", type: "District Hospital", state: "West Bengal", district: "Durgapur", lat: 23.5204, lng: 87.3119 },

  // Odisha
  { name: "SCB Medical College Hospital, Cuttack", type: "Govt Hospital", state: "Odisha", district: "Cuttack", lat: 20.4625, lng: 85.8828 },
  { name: "District Hospital Bhubaneswar", type: "District Hospital", state: "Odisha", district: "Khordha", lat: 20.2961, lng: 85.8245 },
  { name: "District Hospital Rourkela", type: "District Hospital", state: "Odisha", district: "Sundargarh", lat: 22.2604, lng: 84.8536 },

  // Punjab
  { name: "Government Medical College Hospital, Patiala", type: "Govt Hospital", state: "Punjab", district: "Patiala", lat: 30.3398, lng: 76.3869 },
  { name: "District Hospital Amritsar", type: "District Hospital", state: "Punjab", district: "Amritsar", lat: 31.6340, lng: 74.8723 },
  { name: "District Hospital Ludhiana", type: "District Hospital", state: "Punjab", district: "Ludhiana", lat: 30.9010, lng: 75.8573 },
  { name: "District Hospital Jalandhar", type: "District Hospital", state: "Punjab", district: "Jalandhar", lat: 31.3260, lng: 75.5762 },

  // Haryana
  { name: "District Hospital Gurugram", type: "District Hospital", state: "Haryana", district: "Gurugram", lat: 28.4595, lng: 77.0266 },
  { name: "District Hospital Faridabad", type: "District Hospital", state: "Haryana", district: "Faridabad", lat: 28.4089, lng: 77.3178 },
  { name: "District Hospital Karnal", type: "District Hospital", state: "Haryana", district: "Karnal", lat: 29.6857, lng: 76.9905 },
  { name: "District Hospital Panipat", type: "District Hospital", state: "Haryana", district: "Panipat", lat: 29.3909, lng: 76.9635 },

  // Delhi NCT
  { name: "Lok Nayak Hospital, Delhi", type: "Govt Hospital", state: "Delhi", district: "Central Delhi", lat: 28.6394, lng: 77.2385 },
  { name: "Safdarjung Hospital, Delhi", type: "Govt Hospital", state: "Delhi", district: "South Delhi", lat: 28.5687, lng: 77.2065 },

  // Assam & North East
  { name: "Gauhati Medical College Hospital, Guwahati", type: "Govt Hospital", state: "Assam", district: "Kamrup Metropolitan", lat: 26.1445, lng: 91.7362 },
  { name: "District Hospital Dibrugarh", type: "District Hospital", state: "Assam", district: "Dibrugarh", lat: 27.4728, lng: 94.9120 },
  { name: "District Hospital Silchar", type: "District Hospital", state: "Assam", district: "Cachar", lat: 24.8333, lng: 92.7789 },
  { name: "District Hospital Imphal", type: "District Hospital", state: "Manipur", district: "Imphal West", lat: 24.8170, lng: 93.9368 },
  { name: "District Hospital Shillong", type: "District Hospital", state: "Meghalaya", district: "East Khasi Hills", lat: 25.5788, lng: 91.8933 },
  { name: "District Hospital Agartala", type: "District Hospital", state: "Tripura", district: "West Tripura", lat: 23.8315, lng: 91.2868 },
  { name: "District Hospital Aizawl", type: "District Hospital", state: "Mizoram", district: "Aizawl", lat: 23.7271, lng: 92.7176 },
  { name: "District Hospital Kohima", type: "District Hospital", state: "Nagaland", district: "Kohima", lat: 25.6751, lng: 94.1086 },
  { name: "District Hospital Itanagar", type: "District Hospital", state: "Arunachal Pradesh", district: "Papum Pare", lat: 27.0844, lng: 93.6053 },
  { name: "District Hospital Gangtok", type: "District Hospital", state: "Sikkim", district: "East Sikkim", lat: 27.3389, lng: 88.6065 },

  // Jharkhand
  { name: "Rajendra Institute of Medical Sciences, Ranchi", type: "Govt Hospital", state: "Jharkhand", district: "Ranchi", lat: 23.3441, lng: 85.3096 },
  { name: "District Hospital Jamshedpur", type: "District Hospital", state: "Jharkhand", district: "East Singhbhum", lat: 22.8046, lng: 86.2029 },
  { name: "District Hospital Dhanbad", type: "District Hospital", state: "Jharkhand", district: "Dhanbad", lat: 23.7957, lng: 86.4304 },

  // Chhattisgarh
  { name: "Dr. Bhimrao Ambedkar Memorial Hospital, Raipur", type: "Govt Hospital", state: "Chhattisgarh", district: "Raipur", lat: 21.2514, lng: 81.6296 },
  { name: "District Hospital Bilaspur", type: "District Hospital", state: "Chhattisgarh", district: "Bilaspur", lat: 22.0797, lng: 82.1409 },
  { name: "District Hospital Durg", type: "District Hospital", state: "Chhattisgarh", district: "Durg", lat: 21.1904, lng: 81.2849 },

  // Uttarakhand
  { name: "District Hospital Dehradun", type: "District Hospital", state: "Uttarakhand", district: "Dehradun", lat: 30.3165, lng: 78.0322 },
  { name: "District Hospital Haridwar", type: "District Hospital", state: "Uttarakhand", district: "Haridwar", lat: 29.9457, lng: 78.1642 },
  { name: "District Hospital Nainital", type: "District Hospital", state: "Uttarakhand", district: "Nainital", lat: 29.3803, lng: 79.4636 },

  // Himachal Pradesh
  { name: "Indira Gandhi Medical College Hospital, Shimla", type: "Govt Hospital", state: "Himachal Pradesh", district: "Shimla", lat: 31.1048, lng: 77.1734 },
  { name: "District Hospital Dharamshala", type: "District Hospital", state: "Himachal Pradesh", district: "Kangra", lat: 32.2190, lng: 76.3234 },

  // Jammu & Kashmir / Ladakh
  { name: "Shri Maharaja Hari Singh Hospital, Srinagar", type: "Govt Hospital", state: "Jammu and Kashmir", district: "Srinagar", lat: 34.0837, lng: 74.7973 },
  { name: "Government Medical College Hospital, Jammu", type: "Govt Hospital", state: "Jammu and Kashmir", district: "Jammu", lat: 32.7266, lng: 74.8570 },
  { name: "District Hospital Leh", type: "District Hospital", state: "Ladakh", district: "Leh", lat: 34.1526, lng: 77.5771 },

  // Goa
  { name: "Goa Medical College Hospital, Panaji", type: "Govt Hospital", state: "Goa", district: "North Goa", lat: 15.4909, lng: 73.8278 },

  // Union Territories (others)
  { name: "Jawaharlal Institute of Postgraduate Medical Education & Research, Puducherry", type: "Govt Hospital", state: "Puducherry", district: "Puducherry", lat: 11.9416, lng: 79.8083 },
  { name: "GB Pant Hospital, Port Blair", type: "Govt Hospital", state: "Andaman and Nicobar Islands", district: "South Andaman", lat: 11.6234, lng: 92.7265 },
  { name: "District Hospital Chandigarh", type: "District Hospital", state: "Chandigarh", district: "Chandigarh", lat: 30.7333, lng: 76.7794 },

  // Madhya Pradesh - additional PHC-level entries near Dewas region (for local demo accuracy)
  { name: "Community Health Centre Sonkatch", type: "CHC", state: "Madhya Pradesh", district: "Dewas", lat: 22.9530, lng: 76.2990 },
  { name: "Primary Health Centre Kannod", type: "PHC", state: "Madhya Pradesh", district: "Dewas", lat: 22.6580, lng: 76.7370 },
  { name: "Primary Health Centre Bagli", type: "PHC", state: "Madhya Pradesh", district: "Dewas", lat: 22.6650, lng: 76.3720 },
];