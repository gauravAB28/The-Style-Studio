// Special Limited Privilege Offers
const OFFERS_DATA = [
  {
    id: "offer-royal40",
    code: "ROYAL40",
    badge: "40% OFF",
    title: "Keratin Revival & Scalp Detox",
    originalPrice: 4999,
    price: 2999,
    services: ["Royal Keratin Smoothening", "Scalp Detox Pre-Wash", "Ionic Blowout"]
  },
  {
    id: "offer-bride35",
    code: "BRIDE35",
    badge: "35% OFF",
    title: "Signature HD Bridal Package",
    originalPrice: 15999,
    price: 10399,
    services: ["HD Bridal Makeup", "Pre-Bridal Glow Prep", "Bridal Hair & Draping"]
  },
  {
    id: "offer-glam30",
    code: "GLAM30",
    badge: "30% OFF",
    title: "Gel Nail Extensions + Custom Art",
    originalPrice: 2499,
    price: 1749,
    services: ["Full Set Gel Extensions", "French Chrome Art", "Cuticle Revival Spa"]
  },
  {
    id: "offer-glow25",
    code: "GLOW25",
    badge: "25% OFF",
    title: "Clinical Hydra Facial Glow",
    originalPrice: 3499,
    price: 2624,
    services: ["7-Step Clinical Hydra Facial", "Hyaluronic Acid Serum Wash", "LED Phototherapy"]
  },
  {
    id: "offer-spa30",
    code: "SPA30",
    badge: "30% WELLNESS PRIVILEGE",
    title: "Spa & Wellness — 30% Privilege",
    originalPrice: null,
    price: null,
    services: [
      "Turkish Hammam",
      "Balinese Massage",
      "Swedish Restorative Massage",
      "Deep Tissue Recovery",
      "Aromatherapy Massage"
    ]
  }
];

module.exports = { OFFERS_DATA, OFFERS: OFFERS_DATA };

