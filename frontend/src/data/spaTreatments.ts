export interface SpaAromatherapyBlend {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  scentNotes: string;
  mood: string;
  colorAccent: string;
}

export interface SpaTreatment {
  id: string;
  slug: string;
  name: string;
  tagline: string;
  description: string;
  benefits: string[];
  bestFor: string;
  durationRange: string;
  image: string;
  category: 'massage' | 'ritual' | 'aromatherapy';
  number: string;
  aromatherapyBlends?: SpaAromatherapyBlend[];
}

export const SPA_TREATMENTS: SpaTreatment[] = [
  {
    id: 'spa-hammam',
    slug: 'turkish-hammam',
    name: 'Turkish Hammam',
    tagline: 'Steam, foam and centuries of purifying bathing heritage.',
    description:
      'Rooted in centuries of Mediterranean bathing culture, our Hammam journey begins with an enveloping thermal steam phase that opens the pores and softens the skin. A therapist uses a traditional kese mitt to gently exfoliate the entire body, lifting away dullness to reveal luminous, polished skin beneath. A rich cloud of aromatic foam cleanse follows before a calming finish.',
    benefits: [
      'Deep thermal steam to purify and open pores',
      'Gentle full-body exfoliation for satin-smooth texture',
      'Enhances circulation and healthy skin luminosity',
      'Leaves the whole body feeling refreshed and deeply rested',
    ],
    bestFor: 'Dull skin, muscle stiffness, gentle detox and pre-celebration renewal',
    durationRange: '75 / 90 min',
    image: '/images/spa/hammam.jpg',
    category: 'ritual',
    number: '01',
  },
  {
    id: 'spa-balinese',
    slug: 'balinese-massage',
    name: 'Balinese Massage',
    tagline: "Long rhythmic strokes, deep breath and the island's gift of wholeness.",
    description:
      'Drawing on authentic healing traditions from Bali, this holistic therapy weaves together continuous effleurage, targeted palm pressure along energy lines, skin rolling, and gentle restorative stretching. Warm botanical oils infuse the skin, releasing physical fatigue and settling a busy mind into calm stillness.',
    benefits: [
      'Eases muscle stiffness and restores natural flexibility',
      'Acupressure work along meridians to balance energy',
      'Nourishing warm oil infusion for radiant, supple skin',
      'Induces profound mental stillness and emotional ease',
    ],
    bestFor: 'Physical exhaustion, tight shoulders, travel fatigue and deep relaxation',
    durationRange: '60 / 90 min',
    image: '/images/spa/balinese.jpg',
    category: 'massage',
    number: '02',
  },
  {
    id: 'spa-swedish',
    slug: 'swedish-massage',
    name: 'Swedish Restorative Massage',
    tagline: 'Flowing rhythm designed to gently melt tension away.',
    description:
      'The classic European massage art. Using light-to-medium pressure, long gliding strokes, gentle kneading, and rhythmic friction, your therapist encourages total body decompression. Designed to dissolve everyday stress without soreness, leaving you weightless and revitalised.',
    benefits: [
      'Relieves surface muscle knots and daily postural fatigue',
      'Encourages healthy venous return and oxygen flow',
      'Soothes the nervous system for improved sleep quality',
      'Gentle, restorative touch suitable for any comfort level',
    ],
    bestFor: 'First-time spa guests, mild tension, stress management and gentle relaxation',
    durationRange: '60 / 90 min',
    image: '/images/spa/swedish.jpg',
    category: 'massage',
    number: '03',
  },
  {
    id: 'spa-deep-tissue',
    slug: 'deep-tissue-massage',
    name: 'Deep Tissue Recovery',
    tagline: 'Slow, purposeful pressure to liberate deep-seated muscle tension.',
    description:
      'A focused, therapeutic treatment designed for chronic muscular tightness. Through deliberate, slow compression and cross-fibre friction, your practitioner works into the deeper layers of muscle and connective fascia, unravelling stubborn knots and restoring full postural freedom.',
    benefits: [
      'Releases deep chronic tightness in upper back, neck and lower back',
      'Breaks down stubborn adhesions and postural restrictions',
      'Supports active recovery after workouts or prolonged sitting',
      'Increases range of motion and overall physical ease',
    ],
    bestFor: 'Desk workers, athletes, chronic neck/back stiffness and stubborn knots',
    durationRange: '60 / 90 min',
    image: '/images/spa/deep-tissue.jpg',
    category: 'massage',
    number: '04',
  },
  {
    id: 'spa-aromatherapy',
    slug: 'aromatherapy-collection',
    name: 'Artisan Aromatherapy Collection',
    tagline: 'Pure botanical essences tailored to your mood and body.',
    description:
      'A bespoke full-body relaxation massage combined with pure therapeutic-grade essential oil blends. Before beginning, you sample seven signature botanical aromas to select the specific scent notes your body craves today.',
    benefits: [
      'Calms sensory overstimulation and centers the mind',
      'Nourishes dry skin with cold-pressed botanical carrier oils',
      'Enhances natural breathing and mental clarity',
      'Customised blend formulated to match your individual state',
    ],
    bestFor: 'Sensory overload, mental fatigue, mood enhancement and silky skin',
    durationRange: '60 / 90 min',
    image: '/images/spa/aromatherapy.jpg',
    category: 'aromatherapy',
    number: '05',
    aromatherapyBlends: [
      {
        id: 'blend-lavender',
        slug: 'lavender-calm',
        name: 'Lavender Calm',
        tagline: 'French high-altitude lavender & Roman chamomile.',
        scentNotes: 'Wild Lavender · Blue Chamomile · Clary Sage',
        mood: 'Stillness · Rest · Deeper Sleep',
        colorAccent: '#8a7db3',
      },
      {
        id: 'blend-rose',
        slug: 'rose-glow',
        name: 'Rose & Geranium Glow',
        tagline: 'Velvety Damask petals and soft geranium.',
        scentNotes: 'Damask Rose · Egyptian Geranium · Frankincense',
        mood: 'Heart Opening · Radiance · Emotional Warmth',
        colorAccent: '#c76b7e',
      },
      {
        id: 'blend-sandalwood',
        slug: 'sandalwood-serenity',
        name: 'Sandalwood Serenity',
        tagline: 'Sacred Mysore sandalwood and amber woods.',
        scentNotes: 'Aged Sandalwood · Cedar · Vetiver',
        mood: 'Grounding · Quiet Presence · Focus',
        colorAccent: '#9c6f44',
      },
      {
        id: 'blend-eucalyptus',
        slug: 'eucalyptus-revive',
        name: 'Eucalyptus & Peppermint Revive',
        tagline: 'Crisp alpine air and clarifying botanical mint.',
        scentNotes: 'Blue Gum Eucalyptus · Crisp Mint · Rosemary',
        mood: 'Mental Clarity · Free Breathing · Energy',
        colorAccent: '#3b8670',
      },
      {
        id: 'blend-ylang',
        slug: 'ylang-sensual',
        name: 'Ylang Ylang & Vanilla',
        tagline: 'Exotic twilight blossoms and Madagascar vanilla.',
        scentNotes: 'Ylang Ylang · Warm Vanilla · Bergamot',
        mood: 'Harmonising · Soft Luxury · Inner Peace',
        colorAccent: '#c29b38',
      },
      {
        id: 'blend-citrus',
        slug: 'citrus-energy',
        name: 'Citrus Sun Energy',
        tagline: 'Cold-pressed Sicilian mandarin and bergamot.',
        scentNotes: 'Sweet Orange · Bergamot · Lemon Blossom',
        mood: 'Optimism · Vibrancy · Uplifting Light',
        colorAccent: '#e8832a',
      },
      {
        id: 'blend-jasmine',
        slug: 'jasmine-bliss',
        name: 'Jasmine Bliss',
        tagline: 'Night-blooming Indian jasmine and ambered cardamom.',
        scentNotes: 'Sambac Jasmine · Cardamom · White Musk',
        mood: 'Bliss · Soft Grace · Serenity',
        colorAccent: '#869d6a',
      },
    ],
  },
];

export const SPA_RITUAL_STEPS = [
  {
    id: 'step-arrive',
    step: 1,
    title: 'Arrive & Settle',
    description: 'Leave shoes and the outside world behind. Slip into fresh cotton robes and sip chilled herbal water.',
    icon: '✦',
  },
  {
    id: 'step-consult',
    step: 2,
    title: 'Aroma Consultation',
    description: 'Your therapist personalises pressure preference, areas of tension, and your chosen oil blend.',
    icon: '◈',
  },
  {
    id: 'step-treat',
    step: 3,
    title: 'The Therapy',
    description: '60 to 90 minutes of continuous, uninterrupted expert touch on heated treatment beds.',
    icon: '❋',
  },
  {
    id: 'step-restore',
    step: 4,
    title: 'Rest & Tea',
    description: 'Take your time in our recovery lounge with fresh warm spiced chamomile and lotus tea.',
    icon: '◎',
  },
];
