export const packages = ["Veg", "Non-Veg", "Mixed", "Premium"];
export const days = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export const packageMenu = {
  Veg: {
    Mon: [{ id: 'v1', name: 'Paneer Curry' }, { id: 'v2', name: 'Mixed Veg' }],
    Tue: [{ id: 'v3', name: 'Chole Masala' }, { id: 'v4', name: 'Aloo Gobi' }],
    Wed: [{ id: 'v5', name: 'Dal Tadka' }, { id: 'v6', name: 'Jeera Rice' }],
    Thu: [{ id: 'v7', name: 'Palak Paneer' }, { id: 'v8', name: 'Roti' }],
    Fri: [{ id: 'v9', name: 'Veg Biryani' }, { id: 'v10', name: 'Raita' }],
    Sat: [{ id: 'v11', name: 'Methi Malai' }, { id: 'v12', name: 'Paratha' }],
    Sun: [{ id: 'v13', name: 'Navratan Korma' }, { id: 'v14', name: 'Naan' }],
  },
  "Non-Veg": {
    Mon: [{ id: 'n1', name: 'Chicken Curry' }, { id: 'n2', name: 'Egg Fry' }],
    Tue: [{ id: 'n3', name: 'Mutton Curry' }, { id: 'n4', name: 'Fried Fish' }],
    Wed: [{ id: 'n5', name: 'Kadai Chicken' }, { id: 'n6', name: 'Egg Bhurji' }],
    Thu: [{ id: 'n7', name: 'Fish Curry' }, { id: 'n8', name: 'Tandoori Chicken' }],
    Fri: [{ id: 'n9', name: 'Prawn Masala' }, { id: 'n10', name: 'Rice' }],
    Sat: [{ id: 'n11', name: 'Chicken Biryani' }, { id: 'n12', name: 'Salad' }],
    Sun: [{ id: 'n13', name: 'Mixed Grill' }, { id: 'n14', name: 'Naan' }],
  },
  Mixed: {
    Mon: [{ id: 'm1', name: 'Veg + Egg' }, { id: 'm2', name: 'Salad' }],
    Tue: [{ id: 'm3', name: 'Chicken + Veg' }, { id: 'm4', name: 'Roti' }],
    Wed: [{ id: 'm5', name: 'Dal + Fish' }, { id: 'm6', name: 'Rice' }],
    Thu: [{ id: 'm7', name: 'Paneer + Chicken' }, { id: 'm8', name: 'Naan' }],
    Fri: [{ id: 'm9', name: 'Biryani (Mixed)' }, { id: 'm10', name: 'Raita' }],
    Sat: [{ id: 'm11', name: 'Grill + Veg' }, { id: 'm12', name: 'Paratha' }],
    Sun: [{ id: 'm13', name: 'Special Mixed' }, { id: 'm14', name: 'Dessert' }],
  },
  Premium: {
    Mon: [{ id: 'p1', name: 'Chef Special Chicken' }, { id: 'p2', name: 'Gourmet Salad' }],
    Tue: [{ id: 'p3', name: 'Lamb Shank' }, { id: 'p4', name: 'Exotic Rice' }],
    Wed: [{ id: 'p5', name: 'Seafood Platter' }, { id: 'p6', name: 'Steamed Veg' }],
    Thu: [{ id: 'p7', name: 'Duck Confit' }, { id: 'p8', name: 'Gourmet Bread' }],
    Fri: [{ id: 'p9', name: 'Lobster' }, { id: 'p10', name: 'Saffron Rice' }],
    Sat: [{ id: 'p11', name: 'Chef Thali' }, { id: 'p12', name: 'Premium Dessert' }],
    Sun: [{ id: 'p13', name: 'Sunday Roast' }, { id: 'p14', name: 'Sides' }],
  },
};
