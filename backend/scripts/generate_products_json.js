const fs = require('fs');
const path = require('path');

const products = [
  // ================= BATH SALTS =================
  {
    name: "Ascension Cleansing Bath Salt",
    category: "Bath Salts",
    pricing: 499,
    stock: 50,
    images: [
      "/uploads/cleansing_bath_salt_1.jpeg",
      "/uploads/cleansing_bath_salt_2.jpeg"
    ],
    description: `Tagline: Cleanse • Release • Renew

Turn your everyday bath into a mindful ritual of energetic cleansing, relaxation and renewal with Ascension Cleansing Bath Salt.

Created as part of Ascension's holistic wellness and spiritual-care practices, this cleansing bath salt is designed to help you consciously let go of emotional heaviness, unwanted energetic residue and the stress accumulated through the day. It can be incorporated into your spiritual cleansing routine, meditation practice, energy work or simply used whenever you feel the need to pause, reset and reconnect with yourself.

A warm salt bath can also create a deeply relaxing experience, helping you slow down, unwind and create a peaceful transition from the day's activity into a calmer state of mind.

Why Use:
- Create a feeling of energetic cleansing and renewal
- Let go of the day's emotional and mental heaviness
- Feel refreshed and more grounded after a stressful day
- Prepare yourself for meditation, prayer or energy-work practices
- Turn bathing into a calming self-care ritual
- Create a peaceful bedtime routine
- Bring greater intention and mindfulness into your personal wellness practice

Ingredients:
Epsom Salt, Himalayan Rock Salt, Lemon Peels, Basil Leaves, Rose Petals (No artificial color). Essential Oils: Lemongrass Oil, Lavender Oil, Tea Tree Oil.

How to Use:
For a bath:
1. Fill your bathtub with comfortably warm water.
2. Add 2–4 tablespoons of Ascension Cleansing Bath Salt to the water.
3. Allow the salt to dissolve completely.
4. Step into the bath and relax for 15–20 minutes.
5. During the bath, take slow breaths and consciously set an intention such as: "I release what no longer serves me. I welcome peace, clarity and renewed energy."
6. When you are finished, rinse your body with clean water if desired and gently pat yourself dry.

For a cleansing foot soak:
Add 1–2 tablespoons to a basin of warm water and soak your feet for 10–15 minutes while focusing on relaxation and release.

When to Use It:
- After a long or emotionally draining day
- After being in crowded or overwhelming environments
- Before meditation, prayer or spiritual practices
- During personal energy-cleansing rituals
- Before bedtime as part of a relaxing evening routine
- Whenever you simply want to create a moment of stillness and self-care

Create Your Ritual:
For a deeper experience, dim the lights, disconnect from your phone, play soft music and spend a few minutes in silence. Instead of treating the bath as just another part of your routine, use it as intentional time for yourself.
As the salt dissolves into the water, imagine releasing stress, emotional heaviness and the energy you no longer wish to carry.
Breathe in. Release. Reset. Renew.

The Ascension Way:
At Ascension, we believe that healing begins with creating space—to pause, release, reconnect and rise.
This cleansing bath salt is an invitation to make that space for yourself.
Cleanse your energy.
Release what weighs you down.
Reconnect with yourself.
Ascend. ✨

Important Information:
For external use only. Do not ingest. Avoid contact with eyes and sensitive or irritated skin. Discontinue use if irritation occurs. Use caution when entering or leaving the bathtub, as oils or salts may make the surface slippery. If you have sensitive skin or any specific skin concerns, perform a patch test first and consult a qualified healthcare professional if needed. Ascension Cleansing Bath Salt is intended to complement your personal wellness and spiritual practices. It is not intended to diagnose, treat or cure any medical condition.`
  },
  {
    name: "Ascension Abundance Bath Salt",
    category: "Bath Salts",
    pricing: 499,
    stock: 50,
    images: [
      "/uploads/abundance_bath_salt_1.jpeg",
      "/uploads/abundance_bath_salt_2.jpeg"
    ],
    description: `Tagline: Attract • Receive • Expand

Create a sacred moment of intention, release and abundance with Ascension Abundance Bath Salt—a mindful bathing ritual designed to help you shift your focus from scarcity and limitation towards gratitude, openness and the conscious energy of abundance.

Abundance is not only about financial prosperity. It can represent an expanded sense of possibility, confidence, opportunities, love, creativity, peace and fulfilment. This bath salt is created to complement your manifestation and spiritual wellness practices by giving you a dedicated space to pause, set intentions and reconnect with the belief that you are open to receiving.

Why Use:
- Set clear intentions around financial abundance and prosperity
- Cultivate a mindset of growth and possibility
- Create a dedicated ritual for manifestation and intention-setting
- Relax and quiet the mind before visualization or meditation
- Encourage gratitude for the abundance already present in your life
- Create an intentional space to welcome new opportunities
- Support your personal spiritual and manifestation practices

Ingredients:
Epsom Salt, Himalayan Rock Salt, Basil Leaves, Cinnamon Powder (Natural Dark Green food color). Essential Oils: Frankincense Oil, Patchouli Oil, Orange Oil, Jasmine Oil.

How to Use:
For a full bath:
1. Fill your bathtub with comfortably warm water.
2. Add 2–4 tablespoons of Ascension Abundance Bath Salt.
3. Allow the salt to dissolve completely.
4. Soak for 15–20 minutes in a calm, peaceful environment.
5. Close your eyes, breathe slowly and bring your attention to what you wish to invite into your life.
6. Visualize yourself already experiencing the feeling of abundance—security, freedom, joy, opportunity or prosperity.
7. Repeat an affirmation such as: "I am open to receiving abundance in all areas of my life. I trust, I receive and I grow."
8. When finished, rinse with clean water if desired and gently dry yourself.

For a Foot Soak:
Add 1–2 tablespoons of the bath salt to a basin of warm water. Soak your feet for 10–15 minutes while practicing gratitude, visualization or abundance affirmations.

When to Use It:
- Before manifestation or visualization practices
- During a new beginning or period of personal growth
- Before working towards financial or career goals
- During your self-care routine
- Before meditation or journaling
- Whenever you feel disconnected from possibility or abundance
- As part of a regular abundance and gratitude ritual

Create Your Ritual:
For a more intentional experience, light a candle, play calming music and keep your phone away. Before entering the bath, write down 3 things you are grateful for and 3 things you are ready to receive or create.
As you soak, focus not only on what you want to attract, but on how you want to feel when you receive it.
Let go of the fear of not having enough.
Make space for possibility.
Choose gratitude.
Become open to receiving.

The Ascension Way:
At Ascension, we believe abundance begins with awareness, intention and alignment.
Our Abundance Bath Salt is an invitation to slow down, reconnect with your intentions and create a ritual around the life you are consciously choosing to build.
Release scarcity.
Embrace possibility.
Open yourself to receiving.
Step into abundance. ✨

Important Information:
For external use only. Do not ingest. Avoid contact with eyes, face and sensitive or irritated skin. Discontinue use if irritation occurs. Use caution when entering or leaving the bathtub, as the surface may become slippery. If you have sensitive skin or any specific health or skin concerns, perform a patch test and consult a qualified healthcare professional if appropriate. Ascension Abundance Bath Salt is intended to complement personal wellness, mindfulness and spiritual practices. It does not guarantee financial gain, manifestation outcomes or any specific material result.`
  },
  {
    name: "Ascension Protection Salt",
    category: "Bath Salts",
    pricing: 499,
    stock: 50,
    images: [
      "/uploads/protection_bath_salt_1.jpeg",
      "/uploads/protection_bath_salt_2.jpeg"
    ],
    description: `Tagline: Protect • Ground • Strengthen

Create a powerful ritual of energetic protection, grounding and inner strength with Ascension Protection Salt—crafted to complement your spiritual cleansing and self-care practices.

In our everyday lives, we encounter different environments, people and experiences that can leave us feeling emotionally drained, overwhelmed or energetically unsettled. A protection ritual offers a conscious opportunity to clear your space, strengthen your personal boundaries and reconnect with a sense of safety and stability.

Ascension Protection Salt can be incorporated into your spiritual routine whenever you feel the need to reset your energy, ground yourself and create a stronger sense of energetic protection.

Why Use:
- Create a ritual for energetic protection
- Feel more grounded and centred
- Clear the heaviness associated with stressful environments
- Create a sense of calm and emotional space
- Strengthen the intention of healthy personal boundaries
- Complement meditation, prayer, energy work and spiritual practices
- Create a protective ritual before or after entering energetically demanding environments

Ingredients:
Epsom Salt, Himalayan Rock Salt, Neem Leaves, Bay Leaf, Rose Petals (Natural Dark Brown food color). Essential Oils: Rose Oil, Sandalwood Oil, Frankincense Oil, Lemon Oil.

How to Use:
For a full bath:
1. Fill your bathtub with comfortably warm water.
2. Add 2–4 tablespoons of Ascension Protection Salt.
3. Allow the salt to dissolve completely.
4. Soak for 15–20 minutes while breathing slowly and consciously.
5. Close your eyes and visualize a peaceful protective light surrounding you.
6. Set your intention clearly. You may repeat: "I am grounded, protected and at peace. I release what does not belong to me and remain connected to my own energy."
7. After the bath, rinse with clean water if desired and gently dry yourself.

For a Foot Soak:
Add 1–2 tablespoons to a basin of warm water and soak your feet for 10–15 minutes. While soaking, take deep breaths and imagine releasing unwanted heaviness and reconnecting with the ground beneath you.

For a Quick Shower Ritual:
If you don't have a bathtub, you can still incorporate the salt into your ritual. Place a small amount in your palm or a bowl, set your intention and use it as directed according to the product's physical formulation. Do not apply directly to broken, irritated or sensitive skin.

When to Use It:
- After spending time in crowded environments
- After emotionally intense interactions
- Before meditation or spiritual practices
- Before entering a new environment
- After a particularly stressful day
- During periods when you feel emotionally or energetically overwhelmed
- As part of your regular spiritual cleansing routine
- Before sleep as a calming grounding ritual

Create Your Ritual:
For a deeper experience, create a quiet space before beginning your bath. Light a candle, play calming music or sit quietly for a few minutes.
Take three deep breaths and consciously imagine yourself surrounded by a strong, peaceful protective boundary.
Rather than focusing on fear or negativity, focus on what you choose to invite into your space:
Peace.
Clarity.
Grounding.
Strength.
Protection.
Allow the ritual to become a reminder that you are allowed to protect your peace and honour your personal boundaries.

The Ascension Way:
At Ascension, we believe true protection begins with awareness, grounding and conscious intention.
Ascension Protection Salt is designed to support your personal spiritual rituals and provide a meaningful moment to pause, centre yourself and reconnect with your inner strength.
Protect your peace.
Ground your energy.
Strengthen your boundaries.
Move through life with intention. ✨

Important Information:
For external use only. Do not ingest. Avoid contact with eyes, face, mucous membranes, broken or irritated skin. Discontinue use if irritation occurs. Use caution when entering or leaving the bathtub, as the surface may become slippery. If you have sensitive skin or any specific health or skin concerns, perform a patch test and consult a qualified healthcare professional if appropriate. Ascension Protection Salt is intended to complement personal wellness, mindfulness and spiritual practices. It does not guarantee protection from physical, medical or external harm.`
  },
  {
    name: "Ascension Health Salt",
    category: "Bath Salts",
    pricing: 499,
    stock: 50,
    images: [
      "/uploads/health_bath_salt_1.jpeg",
      "/uploads/health_bath_salt_2.jpeg"
    ],
    description: `Tagline: Restore • Rejuvenate • Reconnect

Create a soothing self-care ritual with Ascension Health Salt, thoughtfully designed to support relaxation, grounding and a renewed sense of wellbeing.

Our bodies and minds move through stress, fatigue and demanding routines every day. A warm salt bath can provide a simple, intentional pause—giving you an opportunity to slow down, relax your body and reconnect with yourself.

Ascension Health Salt is created to complement your wellness, self-care and spiritual routines, helping you turn an ordinary bath into a mindful ritual of restoration and renewal.

Why Use:
- Promote a feeling of physical relaxation
- Relax after a tiring or stressful day
- Create a soothing bathing experience
- Feel refreshed and rejuvenated
- Prepare the body and mind for restful evening routines
- Create a moment of calm and mental unwinding
- Complement your meditation, mindfulness and self-care practices
- Encourage a more intentional approach to personal wellbeing

Ingredients:
Epsom Salt, Himalayan Rock Salt, Basil Leaves, Marigold Flowers (Natural Light Green food color). Essential Oils: Lavender Oil, Peppermint Oil, Rosemary Oil, Sandalwood Oil.

How to Use:
For a Full Bath:
1. Fill your bathtub with comfortably warm water.
2. Add 2–4 tablespoons of Ascension Health Salt.
3. Allow the salt to dissolve completely.
4. Soak for 15–20 minutes.
5. Breathe slowly and allow yourself to relax without distractions.
6. You may use this time for meditation, prayer, positive affirmations or simply quiet reflection.
7. When finished, rinse with clean water if desired and gently pat your body dry.

For a Foot Soak:
Add 1–2 tablespoons of Health Salt to a basin of warm water. Soak your feet for 10–15 minutes while relaxing and taking slow, deep breaths. This is especially convenient when you don't have access to a bathtub but still want to create a relaxing wellness ritual.

When to Use It:
- After a long or tiring day
- After physical activity
- During your evening self-care routine
- Before meditation or mindfulness practice
- When you want to unwind and relax
- As part of a weekly wellness ritual
- Whenever you need a moment to pause and reconnect with yourself

Create Your Ritual:
For a more mindful experience, create a peaceful environment before your bath. Put your phone away, dim the lights and play calming music if you like.
As you soak, focus on your breathing and consciously let go of the tension accumulated throughout the day.
You may repeat:
"I allow my body to relax.
I release the day's tension.
I welcome balance, vitality and wellbeing."
Let the bath become more than just a routine—make it your time to restore, recharge and reconnect.

The Ascension Way:
At Ascension, we believe wellbeing is created through small, conscious practices that bring us back to ourselves.
Ascension Health Salt is an invitation to slow down, care for yourself and create a regular ritual of relaxation and renewal.
Relax your body.
Calm your mind.
Restore your energy.
Reconnect with yourself. ✨

Important Information:
For external use only. Do not ingest. Avoid contact with eyes, face, mucous membranes, broken or irritated skin. Discontinue use if irritation occurs. Use caution when entering or leaving the bathtub, as the surface may become slippery. If you have sensitive skin, are pregnant, or have a medical or skin condition, consult a qualified healthcare professional before use. Ascension Health Salt is a wellness and self-care product. It is not a medicine and is not intended to diagnose, treat, cure or prevent any disease or medical condition.`
  },
  {
    name: "Ascension Love & Peace Salt",
    category: "Bath Salts",
    pricing: 499,
    stock: 50,
    images: [
      "/uploads/love_peace_bath_salt_1.jpeg",
      "/uploads/love_peace_bath_salt_2.jpeg"
    ],
    description: `Tagline: Love • Heal • Harmonise

Create a beautiful ritual of love, peace, emotional balance and inner harmony with Ascension Love & Peace Salt.

Thoughtfully created for moments when you want to slow down, release emotional heaviness and reconnect with feelings of love, calm and compassion, this bath salt transforms your everyday bathing routine into an intentional self-care experience.

Whether you are nurturing self-love, seeking emotional calm, creating harmony in your relationships or simply looking for a peaceful way to end the day, Love & Peace Salt can become a meaningful part of your spiritual wellness and manifestation rituals.

Why Use:
- Encourage feelings of self-love and self-compassion
- Create a sense of calm and inner peace
- Release emotional heaviness and everyday tension
- Support positive intentions around love and relationships
- Create a calming space for meditation and reflection
- Encourage emotional grounding and relaxation
- Cultivate compassion, harmony and positivity
- Create a peaceful evening self-care ritual

Ingredients:
Epsom Salt, Himalayan Rock Salt, Rose Petals (Natural Pink food color). Essential Oils: Rose Oil, Jasmine Oil, Sandalwood Oil.

How to Use:
For a Full Bath:
1. Fill your bathtub with comfortably warm water.
2. Add 2–4 tablespoons of Ascension Love & Peace Salt.
3. Allow the salt to dissolve completely.
4. Soak for 15–20 minutes in a quiet and comfortable environment.
5. Take slow, deep breaths and bring your attention inward.
6. Focus on the kind of love and peace you wish to cultivate—whether it is self-love, emotional healing, harmony or deeper connection.
7. You may repeat: "I choose love. I choose peace. I release what weighs on my heart and make space for harmony."
8. When finished, rinse with clean water if desired and gently pat yourself dry.

For a Foot Soak:
Add 1–2 tablespoons of the salt to a basin of warm water and soak your feet for 10–15 minutes. Use this time to breathe deeply, relax and focus on feelings of peace, gratitude and love.

When to Use It:
- When you feel emotionally overwhelmed
- After a stressful or emotionally difficult day
- During self-love and self-care practices
- Before meditation, journaling or prayer
- When setting intentions for love and harmonious relationships
- During manifestation rituals
- Before bedtime to create a peaceful transition into rest
- Whenever you want to reconnect with yourself and your heart

Create Your Ritual:
Make your bath a sacred moment dedicated entirely to yourself.
Dim the lights, play calming music and disconnect from distractions. Before entering the bath, take a moment to identify what you are ready to release—resentment, worry, overthinking or emotional heaviness.
Then consciously choose what you want to welcome instead:
Love.
Peace.
Compassion.
Harmony.
Acceptance.
Visualise yourself surrounded by a gentle, peaceful energy. If you are working with relationship intentions, focus not only on receiving love but also on becoming a source of love, kindness and understanding.

The Ascension Way:
At Ascension, we believe that love begins within and that peace is something we consciously create.
Love & Peace Salt is an invitation to pause, soften, release and reconnect with the most nurturing parts of yourself.
Release the heaviness.
Open your heart.
Choose peace.
Make space for love. ✨

Important Information:
For external use only. Do not ingest. Avoid contact with eyes, face, mucous membranes, broken or irritated skin. Discontinue use if irritation occurs. Use caution when entering or leaving the bathtub, as the surface may become slippery. If you have sensitive skin, are pregnant, or have a medical or skin condition, consult a qualified healthcare professional before use. Ascension Love & Peace Salt is intended to complement personal wellness, mindfulness and spiritual practices. It is not intended to diagnose, treat or cure any medical condition and does not guarantee specific relationship, emotional or manifestation outcomes.`
  },

  // ================= HEALING CAMPHOR =================
  {
    name: "Ascension Cleansing Camphor",
    category: "Healing Camphor",
    pricing: 399,
    stock: 50,
    images: [
      "/uploads/cleansing_camphor_1.jpeg",
      "/uploads/cleansing_camphor_2.jpeg"
    ],
    description: `Tagline: Purify • Clear • Refresh

Bring the traditional practice of camphor cleansing into your spiritual and self-care rituals with Ascension Cleansing Camphor.

Camphor has been traditionally used in Indian spiritual practices, prayers and space-cleansing rituals for generations. Its distinctive fragrance and clean-burning nature make it a meaningful addition to rituals intended to create a feeling of freshness, clarity and purification.

Ascension Cleansing Camphor is designed to help you create a conscious ritual for clearing stagnant or heavy-feeling energy, refreshing your surroundings and preparing your space for prayer, meditation or spiritual practice.

Why Use:
- Create a sense of spiritual purification
- Refresh the atmosphere of your space
- Create a ritual for releasing unwanted or stagnant energy
- Prepare your surroundings for meditation, prayer or energy work
- Complement traditional puja and spiritual practices
- Create a fresh and uplifting ambience
- Mark the transition from a busy environment to a peaceful one

Ingredients:
Pure Camphor, Lemon Peels, Basil Leaves, Rose Petals (No artificial color).

How to Use:
For Space Cleansing:
1. Place a small amount of Cleansing Camphor in a camphor burner or suitable heat-resistant holder.
2. Light it carefully in a well-ventilated area.
3. Allow the camphor to burn completely while maintaining a safe distance.
4. As it burns, consciously set your intention for the space.
5. You may repeat: "I release all heaviness from this space and welcome peace, clarity, positivity and light."
6. Move through the room mindfully, allowing the fragrance to spread naturally.
You can use this ritual before prayer, meditation, spiritual practices or whenever you wish to refresh the energy and atmosphere of your surroundings.

When to Use It:
- Before meditation or prayer
- Before performing a puja
- After an emotionally stressful day
- After guests leave your home
- When moving into a new space
- During personal cleansing rituals
- When your surroundings feel heavy or stagnant
- As part of your regular home-spiritual practice

Create Your Ritual:
The most meaningful part of any cleansing practice is intention.
Before lighting the camphor, take a few deep breaths and consciously identify what you wish to release—stress, tension, negativity or emotional heaviness.
As the camphor burns, visualise the space becoming lighter, calmer and more peaceful.
Release.
Purify.
Refresh.
Welcome the light. ✨

The Ascension Way:
At Ascension, we honour traditional practices while encouraging conscious and intentional living.
Ascension Cleansing Camphor is more than a fragrant ritual—it is an opportunity to pause, reset your surroundings and create a sacred atmosphere for peace, prayer and inner connection.
Clear your space.
Refresh your energy.
Create room for peace.
Begin again. 🪔

Important Information:
For ritual use only. Do not ingest. Camphor is highly flammable. Always use a proper camphor burner or heat-resistant holder and keep it away from curtains, paper, clothing, children and pets. Never leave burning camphor unattended. Use only in a well-ventilated area and extinguish safely if necessary. Do not apply camphor directly to the skin unless the product is specifically formulated and labelled for topical use. Avoid inhaling concentrated fumes and discontinue use if it causes discomfort or irritation. Ascension Cleansing Camphor is intended for spiritual, traditional and ritual use. It is not intended to diagnose, treat, cure or prevent any medical condition.`
  },
  {
    name: "Ascension Abundance Camphor",
    category: "Healing Camphor",
    pricing: 399,
    stock: 50,
    images: [
      "/uploads/abundance_camphor_1.jpeg",
      "/uploads/abundance_camphor_2.jpeg"
    ],
    description: `Tagline: Attract • Align • Receive

Invite the energy of abundance, prosperity and new possibilities into your space with Ascension Abundance Camphor.

Inspired by the traditional use of camphor in Indian spiritual practices, this ritual product is created to support abundance-focused intentions, manifestation practices and prosperity rituals. Lighting camphor can become a powerful symbolic practice of releasing limiting thoughts and creating space for growth, opportunities and positive energy.

Abundance is not limited to money. It can encompass financial prosperity, career opportunities, success, relationships, creativity, health, happiness and the freedom to receive more of what supports your life.

Why Use:
- Set intentions for financial abundance and prosperity
- Create a ritual around growth, success and new opportunities
- Complement manifestation and visualization practices
- Symbolically release limiting beliefs and scarcity-focused thinking
- Create a focused and peaceful atmosphere for meditation or prayer
- Complement Lakshmi puja and other traditional prosperity practices
- Refresh your space while focusing on positive intentions
- Build a consistent personal abundance ritual

Ingredients:
Pure Camphor, Basil Leaves, Cinnamon Powder (Natural Dark Green food color).

How to Use:
For an Abundance Ritual:
1. Place a small amount of Abundance Camphor in a proper camphor burner or heat-resistant holder.
2. Sit comfortably and take a few slow, deep breaths.
3. Light the camphor carefully.
4. As it burns, bring your attention to your abundance intentions.
5. Visualise yourself moving towards the opportunities, success and prosperity you desire.
6. You may repeat: "I release scarcity and limitation. I am open to receiving abundance, prosperity and new opportunities. I trust myself to recognise and act upon the opportunities that come my way."
7. Allow the ritual to conclude naturally and take a moment to express gratitude for the abundance already present in your life.

For a Prosperity Ritual:
Use Abundance Camphor during your Lakshmi puja, manifestation practice, new business beginning, career intention-setting or financial planning ritual.
You can light it while writing down your financial or professional goals, visualising your desired future and expressing gratitude for what you already have.

When to Use It:
- During prosperity and Lakshmi puja
- Before manifestation or visualization practices
- When starting a new business or professional venture
- Before important career or financial decisions
- At the beginning of a new chapter
- During goal-setting and intention-setting
- Whenever you want to consciously reconnect with abundance and possibility

Create Your Ritual:
Find a quiet space and keep distractions away. Before lighting the camphor, write down three things you are grateful for and three things you are ready to create or receive.
As the camphor burns, imagine the feeling of already moving towards your desired goals.
Don't focus only on getting more. Focus on becoming more open to recognising opportunities, taking inspired action and appreciating what is already present.
Release limitation.
Make space for possibility.
Take aligned action.
Open yourself to abundance. ✨

The Ascension Way:
At Ascension, we believe rituals become meaningful when they are paired with intention, awareness and action.
Ascension Abundance Camphor is created as a beautiful addition to your spiritual and manifestation practices—a symbolic reminder to release scarcity, cultivate gratitude and remain open to the possibilities around you.
Release scarcity.
Invite possibility.
Align with abundance.
Step forward with intention. 🪔✨

Important Information:
For ritual use only. Do not ingest. Camphor is highly flammable. Always use a proper camphor burner or heat-resistant holder. Keep away from curtains, paper, clothing and other flammable materials. Keep out of reach of children and pets. Never leave burning camphor unattended. Use only in a well-ventilated space. Do not apply directly to the skin unless the product is specifically formulated and labelled for topical use. Avoid concentrated fumes and discontinue use if discomfort or irritation occurs. Ascension Abundance Camphor is intended to complement spiritual, traditional and manifestation practices. It does not guarantee financial gain, prosperity or specific manifestation outcomes.`
  },
  {
    name: "Ascension Protection Camphor",
    category: "Healing Camphor",
    pricing: 399,
    stock: 50,
    images: [
      "/uploads/protection_camphor_1.jpeg",
      "/uploads/protection_camphor_2.jpeg"
    ],
    description: `Tagline: Protect • Purify • Ground

Create a mindful ritual of protection, purification and grounding with Ascension Protection Camphor.

Inspired by the traditional use of camphor in Indian spiritual practices, this specially intended ritual product can be used to create a feeling of clarity, peace and energetic protection within your personal space. Burning camphor has long been incorporated into prayers, puja and cleansing rituals as a symbolic way of transforming and releasing what feels heavy or unwanted.

Ascension Protection Camphor is designed to complement your spiritual cleansing, protection and grounding practices, helping you consciously create a peaceful and protected atmosphere.

Why Use:
- Create a ritual focused on energetic protection
- Purify and refresh the atmosphere of your space
- Symbolically release unwanted or stagnant energy
- Create a peaceful environment for prayer and meditation
- Support grounding and mindful practices
- Complement traditional puja and spiritual rituals
- Create a calming ritual after emotionally intense experiences
- Prepare a space before beginning spiritual or energy-work practices

Ingredients:
Pure Camphor, Neem Leaves, Bay Leaf, Rose Petals (Natural Dark Brown color).

How to Use:
For Space Protection & Cleansing:
1. Place a small amount of Protection Camphor in a proper camphor burner or heat-resistant holder.
2. Choose a well-ventilated area and keep the burner on a stable, non-flammable surface.
3. Take a few deep breaths and set your intention for protection and peace.
4. Light the camphor carefully.
5. As it burns, consciously visualise your space surrounded by peace, clarity and protective energy.
6. You may repeat: "I am protected, grounded and at peace. I release what does not belong to me and welcome only what supports my highest good."
7. Allow the ritual to finish safely and take a few moments to sit quietly afterwards.

When to Use It:
- After returning from crowded or emotionally overwhelming environments
- After stressful interactions
- Before meditation, prayer or puja
- When moving into a new home or workspace
- Before beginning spiritual practices
- When you want to refresh the atmosphere of your surroundings
- As part of your regular home-cleansing ritual
- Whenever you wish to consciously reconnect with a feeling of protection and grounding

Create Your Ritual:
For a deeper experience, begin by opening a window or ensuring your space is well ventilated. Sit quietly for a moment and identify anything you wish to release—stress, fear, tension or emotional heaviness.
As the camphor burns, imagine these feelings dissolving and being replaced with:
Peace.
Clarity.
Strength.
Grounding.
Protection.
You can end the ritual by expressing gratitude for your home, your loved ones and the sense of safety you wish to cultivate.

The Ascension Way:
At Ascension, we believe that rituals can help us become more intentional about the energy and atmosphere we create around ourselves.
Ascension Protection Camphor is an invitation to pause, cleanse your space and reconnect with your inner sense of strength and peace.
Clear what feels heavy.
Protect your peace.
Ground your energy.
Move forward with intention. 🪔✨

Important Information:
For ritual use only. Do not ingest. Camphor is highly flammable. Always use a suitable camphor burner or heat-resistant holder on a stable, non-flammable surface. Keep away from curtains, paper, clothing and other flammable materials. Keep out of reach of children and pets. Never leave burning camphor unattended. Use only in a well-ventilated space. Avoid direct inhalation of concentrated fumes. Do not apply camphor directly to the skin unless the product is specifically formulated and labelled for topical use. Ascension Protection Camphor is intended to complement traditional, spiritual and personal wellness rituals. It does not guarantee protection from physical harm, negative events or specific spiritual outcomes.`
  },
  {
    name: "Ascension Health Camphor",
    category: "Healing Camphor",
    pricing: 399,
    stock: 50,
    images: [
      "/uploads/health_camphor_1.jpeg",
      "/uploads/health_camphor_2.jpeg"
    ],
    description: `Tagline: Refresh • Rejuvenate • Restore

Bring the traditional practice of camphor into your everyday wellness, purification and self-care rituals with Ascension Health Camphor.

Camphor has been traditionally used in Indian homes and spiritual practices for its distinctive, refreshing aroma and as part of prayer and purification rituals. Ascension Health Camphor is designed to complement these traditions while creating a fresh, uplifting atmosphere that encourages you to pause, breathe and reconnect with a sense of wellbeing.

Whether used during your morning ritual, meditation, prayer or evening wind-down, it can help transform your surroundings into a more refreshing and peaceful space.

Why Use:
- Refresh the atmosphere of your home or personal space
- Complement traditional wellness and spiritual rituals
- Create an uplifting and refreshing ambience
- Support meditation, mindfulness and relaxation practices
- Help you create a dedicated self-care ritual
- Complement prayer, puja and traditional practices
- Create a fresh atmosphere during your evening routine
- Encourage moments of pause, breathing and mindful relaxation

Ingredients:
Pure Camphor, Basil Leaves, Marigold Flowers (Natural Light Green color).

How to Use:
For a Wellness & Refreshing Ritual:
1. Place a small amount of Health Camphor in a proper camphor burner or heat-resistant holder.
2. Place it on a stable, non-flammable surface in a well-ventilated room.
3. Take a few slow, deep breaths and set an intention for wellbeing and renewal.
4. Light the camphor carefully.
5. Allow the aroma to naturally spread through the space.
6. Sit quietly for a few moments, focusing on your breathing and allowing yourself to relax.
7. Once the ritual is complete, ensure the flame has safely extinguished.

Use During Meditation or Prayer:
Health Camphor can be incorporated into your meditation, prayer, yoga or spiritual routine. Light a small amount before beginning your practice and use the ritual as a signal to transition away from everyday distractions and into a calmer, more intentional state.
You may repeat: "I welcome health, vitality, peace and balance into my life."

When to Use It:
- In the morning to create a fresh beginning
- Before meditation or yoga
- During prayer or puja
- After a long or tiring day
- When you want to refresh your surroundings
- During your evening self-care routine
- As part of your regular spiritual wellness practice

Create Your Ritual:
For a more meaningful experience, keep the environment quiet and free from distractions. Light the camphor safely, take several slow breaths and bring your awareness back to yourself.
Rather than rushing through the ritual, use these few moments to focus on rest, gratitude and wellbeing.
Visualise yourself feeling refreshed, balanced and energised.
Pause.
Breathe.
Refresh.
Renew. ✨

The Ascension Way:
At Ascension, we believe wellness is not just about the body—it is also about creating moments of peace, awareness and conscious self-care.
Ascension Health Camphor brings a traditional ritual into your modern wellness routine, creating a simple opportunity to refresh your surroundings and reconnect with yourself.
Refresh your space.
Calm your mind.
Nurture your wellbeing.
Begin again. 🪔🌿

Important Information:
For ritual use only. Do not ingest. Camphor is highly flammable. Always use a suitable camphor burner or heat-resistant holder and place it on a stable, non-flammable surface. Keep away from curtains, paper, clothing and other flammable materials. Keep out of reach of children and pets. Never leave burning camphor unattended. Use only in a well-ventilated area. Avoid direct inhalation of concentrated fumes. Do not apply camphor directly to the skin unless the product is specifically formulated and labelled for topical use. Ascension Health Camphor is intended to complement traditional, spiritual and personal wellness rituals. It is not a medicine and is not intended to diagnose, treat, cure or prevent any disease or medical condition.`
  },
  {
    name: "Ascension Love & Peace Camphor",
    category: "Healing Camphor",
    pricing: 399,
    stock: 50,
    images: [
      "/uploads/love_peace_camphor_1.jpeg",
      "/uploads/love_peace_camphor_2.jpeg"
    ],
    description: `Tagline: Love • Peace • Harmony

Invite an atmosphere of love, peace, harmony and emotional calm into your surroundings with Ascension Love & Peace Camphor.

Inspired by the traditional use of camphor in Indian spiritual practices, this ritual camphor is created to complement your love, peace, meditation, prayer and emotional-wellness rituals. Its refreshing aroma and intentional use can help you create a calm, uplifting environment where you can slow down, release the heaviness of the day and reconnect with yourself.

Love & Peace Camphor can be used for self-love rituals, relationship harmony intentions, meditation, prayer, manifestation practices and peaceful home rituals.

Why Use:
- Create a ritual focused on self-love and compassion
- Cultivate a peaceful and harmonious atmosphere
- Support emotional relaxation and mindful reflection
- Complement love and relationship manifestation practices
- Prepare your space for meditation, prayer or journaling
- Create intentions around harmony within relationships
- Complement traditional spiritual and devotional practices
- Create a calming evening ritual
- Refresh your space while focusing on positive emotions and intentions

Ingredients:
Pure Camphor, Rose Petals (Natural Pink food color).

How to Use:
For a Love & Peace Ritual:
1. Place a small amount of Love & Peace Camphor in a proper camphor burner or heat-resistant holder.
2. Keep the burner on a stable, non-flammable surface in a well-ventilated space.
3. Take a few slow breaths and consciously decide what you want to invite into your life.
4. Light the camphor carefully.
5. As it burns, focus on feelings of love, peace, gratitude and harmony.
6. Visualise yourself surrounded by a calm and loving energy.
7. You may repeat: "I release what disturbs my peace. I open my heart to love, harmony, compassion and beautiful connections."
8. Allow the ritual to conclude safely and sit quietly for a few moments afterwards.

For Self-Love & Emotional Healing:
Use Love & Peace Camphor before journaling, meditation or self-reflection. Focus on: Self-love • Acceptance • Forgiveness • Compassion • Peace • Emotional harmony.

For a Peaceful Home:
Use it as part of a mindful home ritual when you want to create an atmosphere that feels calm, welcoming and harmonious.

When to Use It:
- During self-love rituals
- Before meditation or prayer
- During relationship or harmony intentions
- Before journaling or emotional reflection
- During manifestation practices
- After a stressful or emotionally difficult day
- Before bedtime
- During traditional puja or devotional practices
- Whenever you wish to create a peaceful atmosphere

Create Your Ritual:
For a deeper ritual, create a quiet space, put away distractions and take a few deep breaths.
Before lighting the camphor, think of what you are ready to release—anger, resentment, worry, fear or emotional heaviness.
As the camphor burns, shift your attention towards what you want to welcome:
Love.
Peace.
Forgiveness.
Harmony.
Compassion.
Remember that the ritual is not about forcing a particular person or outcome. Instead, it is about creating an intention for healthy, loving and peaceful connections, beginning with the relationship you have with yourself.

The Ascension Way:
At Ascension, we believe that meaningful rituals help us pause, become intentional and reconnect with what truly matters.
Ascension Love & Peace Camphor is an invitation to create a sacred moment for your heart—to release emotional heaviness, cultivate inner peace and make space for love and harmony.
Release the heaviness.
Open your heart.
Choose peace.
Make space for love. 💗🪔

Important Information:
For ritual use only. Do not ingest. Camphor is highly flammable. Always use a suitable camphor burner or heat-resistant holder on a stable, non-flammable surface. Keep away from curtains, paper, clothing and other flammable materials. Keep out of reach of children and pets. Never leave burning camphor unattended. Use only in a well-ventilated space. Avoid direct inhalation of concentrated fumes. Do not apply camphor directly to the skin unless the product is specifically formulated and labelled for topical use. Ascension Love & Peace Camphor is intended to complement traditional, spiritual and personal wellness rituals. It does not guarantee specific emotional, relationship or manifestation outcomes and is not intended to diagnose, treat or cure any medical condition.`
  },

  // ================= HEALING OILS =================
  {
    name: "Ascension Cleansing Oil",
    category: "Healing Oils",
    pricing: 599,
    stock: 50,
    images: [
      "/uploads/cleansing_oil_1.jpeg"
    ],
    description: `Tagline: Cleanse • Release • Restore

Create a deeply intentional ritual of energetic cleansing, grounding and renewal with Ascension Cleansing Oil.

Thoughtfully created to complement your spiritual wellness and self-care practices, this cleansing oil can be incorporated into rituals when you feel emotionally heavy, energetically drained or simply in need of a fresh start.

The ritual of applying the oil encourages you to slow down, become present and consciously release what you no longer wish to carry. It can be used alongside meditation, prayer, manifestation, energy work and personal cleansing practices.

Why Use:
- Support a feeling of energetic cleansing and renewal
- Create a ritual for releasing emotional heaviness
- Promote a sense of calm and grounding
- Complement meditation, prayer and mindfulness practices
- Support personal energy-cleansing rituals
- Create a meaningful bedtime or evening ritual
- Help you consciously transition from stressful experiences into a calmer state
- Encourage intention-setting and self-awareness

Ingredients:
Base Sesame Oil, Lavender Essential Oil (10 drops), Lemongrass Essential Oil (10 drops), Tea Tree Essential Oil (10 drops).

How to Use:
For Personal Energy Cleansing:
1. Take a few drops of Ascension Cleansing Oil onto your palms.
2. Rub your palms gently together.
3. Close your eyes and take 3–5 slow, deep breaths.
4. Set your intention for the ritual—for example: "I release what no longer serves me and welcome peace, clarity and renewed energy."
5. Gently apply the oil only as directed on the product label, such as to pulse points or other intended areas.
6. Sit quietly for a few moments and visualise yourself releasing emotional and energetic heaviness.
7. Finish by taking a few deep breaths and returning your attention to the present moment.

When to Use It:
- After a stressful or emotionally intense day
- After spending time in crowded environments
- Before meditation or prayer
- Before or after energy-work practices
- During personal cleansing rituals
- Before beginning a new chapter or intention
- Before bedtime
- Whenever you feel the need to reset and reconnect with yourself

Create Your Ritual:
For a deeper experience, find a quiet space and disconnect from distractions.
Take a moment to identify what you are ready to release—stress, worry, emotional heaviness, overthinking or experiences that no longer serve you.
Apply the oil mindfully while focusing on your intention.
Visualise yourself becoming lighter with every breath.
Release.
Clear.
Ground.
Renew. ✨

The Ascension Way:
At Ascension, we believe cleansing is not about fear—it is about creating space for what you consciously choose to welcome into your life.
Ascension Cleansing Oil is an invitation to pause, reconnect with yourself and turn a simple act of self-care into an intentional ritual of release and renewal.
Release what weighs you down.
Clear your energy.
Reconnect with yourself.
Begin again. 🌿

Important Information:
For external use only. Do not ingest. Use only as directed on the product packaging. Avoid contact with eyes and mucous membranes. Do not apply to broken, irritated or damaged skin. Patch test before first use, particularly if you have sensitive skin. Discontinue use if irritation occurs. If the formulation contains essential oils or other concentrated ingredients, follow the specific dilution and usage instructions provided with the product. Keep away from children and pets. Ascension Cleansing Oil is intended to complement personal wellness, mindfulness and spiritual practices. It is not intended to diagnose, treat, cure or prevent any medical condition.`
  },
  {
    name: "Ascension Abundance Oil",
    category: "Healing Oils",
    pricing: 599,
    stock: 50,
    images: [
      "/uploads/abundance_oil_1.jpeg"
    ],
    description: `Tagline: Attract • Align • Receive

Invite greater abundance, prosperity, opportunity and growth into your life with Ascension Abundance Oil.

Created as an intentional ritual oil for manifestation and spiritual wellness, Ascension Abundance Oil is designed to complement practices focused on financial prosperity, career growth, success, confidence and an abundant mindset.

Abundance is not limited to money. It can mean being open to receiving new opportunities, meaningful relationships, creativity, recognition, growth, peace and financial wellbeing. This oil provides a tangible way to turn those intentions into a consistent personal ritual.

Why Use:
- Set intentions for financial abundance and prosperity
- Encourage a mindset of growth and possibility
- Complement manifestation and visualization practices
- Support intentions around career and business success
- Create a focused ritual before meditation or journaling
- Cultivate gratitude and openness to receiving
- Complement spiritual and abundance-focused practices
- Create a regular reminder to pair intention with purposeful action

Ingredients:
Base Sesame Oil, Frankincense Essential Oil (10 drops), Sweet Orange Essential Oil (10 drops), Patchouli Essential Oil (10 drops), Cinnamon Essential Oil (10 drops).

How to Use:
For a Personal Abundance Ritual:
1. Take a few drops of Ascension Abundance Oil onto your palms or use it as directed on the product label.
2. Gently rub your palms together.
3. Close your eyes and take 3–5 slow breaths.
4. Clearly state your abundance intention.
5. Apply the oil to the recommended areas mentioned on the product packaging, such as pulse points, if suitable for the formulation.
6. Visualise yourself moving confidently towards your desired goals.
7. Repeat an affirmation such as: "I am open to receiving abundance. I recognise opportunities, take aligned action and allow prosperity to grow in my life."
8. Sit quietly for a few moments and allow yourself to connect with the feeling of abundance and possibility.

For Financial & Career Intentions:
Use Abundance Oil before goal-setting, financial planning, important professional meetings, business activities or manifestation practices.
Write down a specific goal and spend a few minutes visualising yourself taking the practical steps required to achieve it.

When to Use It:
- Before manifestation or visualization
- During meditation or journaling
- Before starting an important workday
- During financial or career goal-setting
- Before business or professional activities
- At the beginning of a new venture or chapter
- During prosperity-focused spiritual rituals
- Whenever you want to reconnect with an abundant mindset

Create Your Ritual:
Find a quiet space and write down:
3 things you are grateful for
3 things you wish to create
1 action you will take today
Apply the oil mindfully while visualising your desired outcome.
Instead of focusing only on receiving, focus on becoming open to recognising opportunities, building confidence, taking action and appreciating the abundance already present in your life.
Release limitation.
Cultivate possibility.
Take inspired action.
Open yourself to abundance. ✨

The Ascension Way:
At Ascension, we believe manifestation becomes more powerful when intention, awareness and action come together.
Ascension Abundance Oil is created to support your personal prosperity rituals—a tangible reminder to shift your focus towards possibility, gratitude and growth.
Set your intention.
Align your energy.
Take inspired action.
Make space for abundance. 🌿✨

Important Information:
For external use only. Do not ingest. Use only as directed on the product packaging. Avoid contact with eyes, face and mucous membranes. Do not apply to broken, irritated or damaged skin. Patch test before first use, especially if you have sensitive skin. Discontinue use if irritation occurs. If the formulation contains essential oils or other concentrated ingredients, follow the specific dilution and application instructions provided with the product. Keep away from children and pets. Ascension Abundance Oil is intended to complement personal wellness, mindfulness and spiritual practices. It does not guarantee financial gain, prosperity, manifestation outcomes or specific life events, and it is not intended to diagnose, treat, cure or prevent any medical condition.`
  },
  {
    name: "Ascension Protection Oil",
    category: "Healing Oils",
    pricing: 599,
    stock: 50,
    images: [
      "/uploads/protection_oil_1.jpeg"
    ],
    description: `Tagline: Protect • Ground • Strengthen

Create a mindful ritual of protection, grounding and energetic balance with Ascension Protection Oil.

Thoughtfully created for spiritual and personal wellness practices, Ascension Protection Oil can be incorporated into rituals intended to help you feel grounded, centred and protected in your everyday life.

Our environments, interactions and experiences can sometimes leave us feeling emotionally drained or unsettled. A conscious protection ritual provides a moment to pause, reconnect with yourself and establish an intentional sense of personal boundaries and inner strength.

Why Use:
- Create an intentional energetic protection ritual
- Support feelings of grounding and stability
- Complement spiritual cleansing and protection practices
- Prepare yourself for meditation, prayer or energy work
- Create a sense of calm after emotionally demanding experiences
- Support personal spiritual and manifestation rituals
- Establish a grounding ritual before sleep
- Encourage awareness of healthy personal boundaries

Ingredients:
Base Sesame Oil, Rose Essential Oil (10 drops), Frankincense Essential Oil (10 drops), Sandalwood Essential Oil (10 drops), Lemon Essential Oil (10 drops).

How to Use:
For a Personal Protection Ritual:
1. Take a few drops of Ascension Protection Oil onto your palms or use it as directed on the product label.
2. Gently rub your palms together.
3. Close your eyes and take 3–5 slow, deep breaths.
4. Set a clear intention for protection and grounding.
5. Apply the oil to the recommended areas indicated on the product packaging, such as pulse points, if suitable for the formulation.
6. Visualise yourself surrounded by a calm, peaceful and protective light.
7. Repeat: "I am grounded, protected and at peace. I release what does not belong to me and remain connected to my own energy."
8. Sit quietly for a few moments and allow yourself to feel centred before continuing with your day.

Before Entering a Crowded or Challenging Environment:
Protection Oil can be used as part of a short grounding ritual before entering environments that you anticipate may feel overwhelming.
Take a few breaths, apply the oil as directed and set the intention: "I remain grounded in myself. I honour my boundaries and carry my peace with me."

When to Use It:
- Before meditation or prayer
- Before spiritual or energy-work practices
- Before entering crowded environments
- After emotionally intense interactions
- After a stressful day
- During personal cleansing rituals
- Before bedtime
- When beginning a new phase or undertaking
- Whenever you want to reconnect with feelings of grounding and protection

Create Your Ritual:
Find a quiet space and take a few moments to centre yourself.
Ask yourself:
What am I ready to release?
What boundaries do I need to honour?
How do I want to feel moving forward?
Apply the oil mindfully while visualising a peaceful protective boundary around yourself.
Focus on what you choose to carry, rather than what you fear.
Ground yourself.
Protect your peace.
Strengthen your boundaries.
Move forward with intention. ✨

The Ascension Way:
At Ascension, we believe true protection begins with self-awareness, grounding and conscious boundaries.
Ascension Protection Oil is an invitation to create a meaningful ritual around your personal space and wellbeing—a reminder that protecting your peace is an important part of caring for yourself.
Ground your energy.
Honour your boundaries.
Protect your peace.
Walk with intention. 🛡️✨

Important Information:
For external use only. Do not ingest. Use only as directed on the product packaging. Avoid contact with eyes, face and mucous membranes. Do not apply to broken, irritated or damaged skin. Patch test before first use, particularly if you have sensitive skin. Discontinue use if irritation occurs. If the formulation contains essential oils or other concentrated ingredients, follow the specific dilution and application instructions provided with the product. Keep away from children and pets. Ascension Protection Oil is intended to complement personal wellness, mindfulness and spiritual practices. It does not guarantee protection from physical harm, negative events or specific spiritual outcomes and is not intended to diagnose, treat, cure or prevent any medical condition.`
  },
  {
    name: "Ascension Health Oil",
    category: "Healing Oils",
    pricing: 599,
    stock: 50,
    images: [
      "/uploads/health_oil_1.jpeg"
    ],
    description: `Tagline: Nourish • Restore • Rejuvenate

Create a mindful ritual of wellness, relaxation and renewal with Ascension Health Oil.

Thoughtfully created to complement your personal wellness and spiritual practices, Ascension Health Oil is designed for moments when you want to slow down, reconnect with your body and create an intentional space for restoration and self-care.

Whether incorporated into a daily self-care ritual, meditation, prayer or a relaxing massage, this oil can help make your routine feel more conscious and nurturing.

Why Use:
- Support a feeling of relaxation and wellbeing
- Complement a soothing self-massage ritual
- Help create a calming self-care experience
- Support mindfulness, meditation and relaxation practices
- Encourage a regular practice of conscious self-care
- Create a peaceful evening wind-down ritual
- Help you reconnect with your body through mindful touch
- Complement your holistic wellness routine

Ingredients:
Base Sesame Oil, Lavender Essential Oil (10 drops), Sandalwood Essential Oil (10 drops), Peppermint Essential Oil (10 drops), Rosemary Essential Oil.

How to Use:
For a Relaxing Massage:
1. Take a small amount of Ascension Health Oil into your palms.
2. Gently rub your palms together to warm the oil.
3. Apply it to the desired area of the body as directed on the product packaging.
4. Massage gently using slow, comfortable movements.
5. Take deep breaths and allow yourself to relax.
6. Continue for 5–10 minutes, or as comfortable.
7. Allow the oil to absorb or wipe away any excess as required.

For a Mindful Wellness Ritual:
Apply a small amount as directed, then sit quietly for a few minutes. Focus on your breathing and consciously set an intention for health, balance, vitality and wellbeing.
You may repeat: "I honour my body, nurture my wellbeing and welcome balance, vitality and peace into my life."

When to Use It:
- In the morning as part of a mindful start to the day
- After physical activity
- After a long or tiring day
- During your evening relaxation routine
- Before meditation or prayer
- During a self-massage ritual
- Before bedtime
- Whenever you need a moment to slow down and reconnect with yourself

Create Your Ritual:
Make your oil application more intentional by creating a calm environment. Put away distractions, take a few deep breaths and focus on how your body feels.
Instead of rushing through the process, allow yourself to be fully present.
Breathe deeply.
Relax completely.
Nurture yourself.
Reconnect with your wellbeing. ✨

The Ascension Way:
At Ascension, we believe wellness begins with conscious care of the body, mind and inner self.
Ascension Health Oil is an invitation to transform a simple self-care practice into a meaningful ritual of nourishment, relaxation and renewal.
Nurture your body.
Calm your mind.
Honour your wellbeing.
Rise renewed. 🌿✨

Important Information:
For external use only. Do not ingest. Use only as directed on the product packaging. Avoid contact with eyes, face and mucous membranes. Do not apply to broken, irritated or damaged skin. Patch test before first use, especially if you have sensitive skin. Discontinue use if irritation occurs. If the formulation contains essential oils or other concentrated ingredients, follow the specific dilution and application instructions provided with the product. Keep away from children and pets. Ascension Health Oil is a wellness and self-care product intended to complement personal wellbeing practices. It is not a medicine and is not intended to diagnose, treat, cure or prevent any disease or medical condition.`
  },
  {
    name: "Ascension Love & Peace Oil",
    category: "Healing Oils",
    pricing: 599,
    stock: 50,
    images: [
      "/uploads/love_peace_oil_1.jpeg"
    ],
    description: `Tagline: Love • Harmony • Calm

Create a beautiful ritual of love, peace and emotional harmony with Ascension Love & Peace Oil.

Thoughtfully created to complement your self-care and spiritual practices, this ritual oil is designed for moments when you wish to cultivate self-love, emotional calm, compassion and harmonious relationships. It can become a meaningful part of your meditation, manifestation, prayer or everyday wellness routine.

Whether you are focusing on healing your relationship with yourself, inviting more harmony into your relationships or simply creating a peaceful moment at the end of the day, Love & Peace Oil helps turn your intention into a conscious ritual.

Why Use:
- Encourage self-love and self-compassion
- Cultivate a feeling of peace and emotional calm
- Support intentions around love and harmonious relationships
- Complement manifestation and visualization practices
- Create a calming ritual before meditation or prayer
- Encourage forgiveness, acceptance and emotional balance
- Support a peaceful evening or bedtime routine
- Make self-care more intentional and meaningful

Ingredients:
Base Sesame Oil, Rose Essential Oil (10 drops), Sandalwood Essential Oil (10 drops), Jasmine Essential Oil (10 drops).

How to Use:
For a Personal Love & Peace Ritual:
1. Take a few drops of Love & Peace Oil onto your palms or use it as directed on the product label.
2. Gently rub your palms together.
3. Close your eyes and take 3–5 slow, deep breaths.
4. Set an intention for what you wish to cultivate—love, peace, forgiveness, harmony or self-acceptance.
5. Apply the oil to the recommended areas mentioned on the product packaging, such as pulse points, if suitable for the formulation.
6. Sit quietly for a few moments and focus on the feeling you wish to invite into your life.
7. Repeat an affirmation such as: "I choose love. I choose peace. I release what weighs on my heart and make space for harmony."

For Self-Love:
Use the oil before journaling, meditation or quiet reflection. Focus on: Self-love • Acceptance • Forgiveness • Compassion • Peace.

For Relationship Harmony:
Love & Peace Oil can also be incorporated into rituals focused on creating healthier and more harmonious relationships. You may affirm: "I welcome healthy, loving and peaceful connections into my life. I give and receive love with openness and respect."

When to Use It:
- During self-love rituals
- Before meditation or prayer
- During manifestation practices
- Before journaling or emotional reflection
- When seeking greater harmony in relationships
- After a stressful or emotionally difficult day
- Before bedtime
- During personal spiritual practices
- Whenever you need to reconnect with peace and love

Create Your Ritual:
Create a quiet space, put away distractions and take a few deep breaths.
Ask yourself:
What am I ready to release?
What am I ready to forgive?
What kind of love and peace do I want to cultivate?
Apply the oil mindfully while visualising yourself surrounded by a calm, loving energy.
Allow yourself to move away from emotional heaviness and towards the qualities you consciously choose:
Love.
Peace.
Compassion.
Harmony.
Acceptance. 💗

The Ascension Way:
At Ascension, we believe that love begins within and that peace is something we consciously cultivate.
Ascension Love & Peace Oil is an invitation to slow down, reconnect with your heart and create a meaningful ritual around self-love, emotional harmony and peaceful connections.
Release the heaviness.
Open your heart.
Choose peace.
Make space for love. ✨

Important Information:
For external use only. Do not ingest. Use only as directed on the product packaging. Avoid contact with eyes, face and mucous membranes. Do not apply to broken, irritated or damaged skin. Patch test before first use, especially if you have sensitive skin. Discontinue use if irritation occurs. If the formulation contains essential oils or other concentrated ingredients, follow the specific dilution and application instructions provided with the product. Keep away from children and pets. Ascension Love & Peace Oil is intended to complement personal wellness, mindfulness and spiritual practices. It does not guarantee specific emotional, relationship or manifestation outcomes and is not intended to diagnose, treat, cure or prevent any medical condition.`
  },

  // ================= CANDLES =================
  {
    name: "Ascension Abundance Candle",
    category: "Candles",
    pricing: 699,
    stock: 50,
    images: [
      "/uploads/abundance_candle_1.jpeg",
      "/uploads/abundance_candle_2.jpeg"
    ],
    description: `Tagline: Attract • Align • Manifest

Create an intentional ritual for abundance, prosperity, success and new opportunities with the Ascension Abundance Candle.

Designed to complement manifestation, meditation and spiritual wellness practices, this candle creates a dedicated space to focus your thoughts and intentions on the abundance you wish to cultivate. Whether your intention is financial prosperity, career growth, business success, creativity, recognition or greater opportunities, lighting the candle can become a powerful reminder to stay open to receiving while taking conscious action towards your goals.

Why Use:
- Set intentions for financial prosperity and abundance
- Support manifestation and visualization practices
- Cultivate a mindset of growth and possibility
- Focus on career, business and professional goals
- Create a calm atmosphere for journaling and goal-setting
- Complement meditation, prayer and spiritual practices
- Encourage gratitude for the abundance already present in your life
- Create a regular ritual around receiving, growth and opportunity

Ingredients:
Natural Wax, Essential Oils (Frankincense, Orange, Patchouli), Sacred Herbs (Cinnamon Sticks, Black Pepper, Basil Leaves), Charged Abundance Crystal.

How to Use:
1. Place the candle on a stable, heat-resistant and non-flammable surface.
2. Before lighting it, take a few deep breaths and clearly identify your intention.
3. Light the candle mindfully.
4. Sit comfortably and focus on your desired outcome.
5. Visualise yourself moving towards your goals and experiencing the feelings associated with abundance—confidence, freedom, security, gratitude and fulfilment.
6. Repeat an affirmation such as: "I am open to abundance in all areas of my life. I recognise opportunities, take inspired action and allow prosperity to grow."
7. Spend 10–15 minutes in meditation, visualization or journaling.
8. Extinguish the candle safely when your ritual is complete.

For Financial & Career Abundance:
Write down a specific financial, career or business goal before lighting the candle. As the candle burns, visualise the steps required to reach that goal. Use the ritual as a reminder that manifestation works best when intention is combined with practical action.

When to Use It:
- During manifestation rituals
- Before meditation or visualization
- During financial goal-setting
- Before starting a new business or project
- At the beginning of a new chapter
- During prosperity-focused spiritual practices
- While journaling about your goals
- Whenever you want to reconnect with an abundant mindset

Create Your Ritual:
For a more powerful and consistent practice, use the candle at the same time each day or on a chosen day of the week.
Before lighting it, write:
3 things I am grateful for
3 things I am ready to receive
1 action I will take towards my goal
Light the candle and spend a few moments visualising your desired future.
Rather than focusing only on having more, focus on becoming more open to recognising opportunities, taking purposeful action and appreciating what you already have.
Release scarcity.
Cultivate possibility.
Take aligned action.
Welcome abundance. ✨

The Ascension Way:
At Ascension, we believe that meaningful rituals bring together intention, awareness and action.
The Ascension Abundance Candle is created to be a beautiful physical reminder of the life you are consciously working towards—a moment each day to pause, focus and reconnect with your vision.
Set your intention.
Focus your energy.
Take inspired action.
Make space for abundance. 🕯️✨

Important Information:
For ritual and ambience use only. Never leave a burning candle unattended. Keep away from children, pets, curtains, paper and all flammable materials. Place on a stable, heat-resistant surface and keep the candle away from drafts. Do not move the candle while it is burning or while the wax is liquid. Keep the wick trimmed according to the candle manufacturer's instructions. Extinguish the candle completely after use and allow the wax to cool before handling. The Ascension Abundance Candle is intended to complement personal wellness, mindfulness, spiritual and manifestation practices. It does not guarantee financial gain, prosperity or specific manifestation outcomes.`
  },
  {
    name: "Ascension Protection Candle",
    category: "Candles",
    pricing: 699,
    stock: 50,
    images: [
      "/uploads/protection_candle_1.jpeg",
      "/uploads/protection_candle_2.jpeg"
    ],
    description: `Tagline: Protect • Ground • Strengthen

Create a calming ritual of protection, grounding and inner strength with the Ascension Protection Candle.

Designed to complement spiritual wellness, meditation and personal protection practices, this candle provides a dedicated space to consciously release fear, stress and emotional heaviness while strengthening your intention to protect your peace and personal energy.

Protection is not about fear or negativity. It is about creating awareness around your boundaries, grounding yourself and intentionally choosing the energy and atmosphere you wish to cultivate around you.

Why Use:
- Create an intentional protection ritual
- Encourage feelings of grounding and stability
- Support rituals focused on clearing emotional heaviness
- Create a peaceful and secure-feeling atmosphere
- Complement meditation, prayer and spiritual practices
- Support personal energy and boundary-setting rituals
- Create a grounding ritual before sleep
- Help you consciously reconnect with your inner strength and peace

Ingredients:
Natural Wax, Essential Oils (Rose, Sandalwood, Frankincense, Lemon Oil), Sacred Herbs (Neem Leaves, Bay Leaf, Clove, Rosemary), Charged Protection Crystal.

How to Use:
1. Place the candle on a stable, heat-resistant and non-flammable surface.
2. Sit comfortably and take 3–5 slow, deep breaths.
3. Before lighting the candle, identify what you wish to release—stress, fear, emotional heaviness or unwanted thoughts.
4. Light the candle mindfully.
5. Focus your attention on the flame and visualise yourself surrounded by a calm, peaceful and protective light.
6. Set your intention by repeating: "I am grounded, protected and at peace. I release what does not belong to me and remain connected to my own energy."
7. Spend 10–15 minutes in quiet reflection, meditation or prayer.
8. When your ritual is complete, extinguish the candle safely.

For Personal Protection:
Before entering a crowded, stressful or emotionally demanding environment, you can use the candle as part of a grounding ritual.
Sit quietly, light the candle and affirm: "I honour my boundaries. I remain grounded in myself. I carry my peace with me wherever I go."

For Space Protection:
The Protection Candle can also be used as part of a home or workspace ritual. Light it while setting an intention for your surroundings to feel: Peaceful • Safe • Clear • Grounded • Harmonious.

When to Use It:
- Before meditation or prayer
- During spiritual cleansing rituals
- After emotionally intense experiences
- After a stressful day
- Before entering a new environment
- When beginning a new chapter or undertaking
- During personal boundary-setting practices
- Before bedtime
- Whenever you wish to reconnect with feelings of safety, grounding and inner strength

Create Your Ritual:
For a deeper experience, create a quiet space without distractions.
Before lighting the candle, write down:
What am I ready to release?
What boundaries do I need to honour?
What do I want to protect in my life?
Light the candle and spend a few minutes visualising a peaceful protective boundary around yourself.
Focus not on fear, but on what you choose to cultivate:
Peace.
Strength.
Clarity.
Grounding.
Protection.

The Ascension Way:
At Ascension, we believe that true protection begins with awareness, grounding and conscious boundaries.
The Ascension Protection Candle is an invitation to pause, reconnect with your inner strength and create an intentional ritual around protecting your peace.
Release the fear.
Strengthen your boundaries.
Ground yourself.
Protect your peace. 🛡️🕯️

Important Information:
For ritual and ambience use only. Never leave a burning candle unattended. Keep away from children, pets, curtains, paper and all other flammable materials. Place on a stable, heat-resistant surface and keep away from drafts. Do not move the candle while it is burning or while the wax is liquid. Keep the wick trimmed according to the candle manufacturer's instructions. Extinguish completely after use and allow the wax to cool before handling. The Ascension Protection Candle is intended to complement personal wellness, mindfulness and spiritual practices. It does not guarantee protection from physical harm, negative events or specific spiritual outcomes.`
  },
  {
    name: "Ascension Cleansing Candle",
    category: "Candles",
    pricing: 699,
    stock: 50,
    images: [
      "/uploads/cleansing_candle_1.jpeg",
      "/uploads/cleansing_candle_2.jpeg"
    ],
    description: `Tagline: Cleanse • Release • Renew

Create a sacred ritual of cleansing, release and renewal with the Ascension Cleansing Candle.

Thoughtfully created to complement spiritual wellness, meditation and self-care practices, this candle is designed to help you create an intentional moment to clear emotional heaviness, release what no longer serves you and refresh the energy and atmosphere of your surroundings.

Lighting a candle can become a powerful symbolic practice—a conscious transition from what you are ready to let go of towards the peace, clarity and freshness you wish to invite into your life.

Why Use:
- Create an intentional cleansing and renewal ritual
- Symbolically release stress, emotional heaviness and unwanted thoughts
- Create a calm and peaceful atmosphere
- Support meditation, prayer and mindfulness practices
- Complement spiritual cleansing and energy-work rituals
- Refresh the feeling of your home or personal space
- Create a meaningful evening reset ritual
- Help you consciously transition into a lighter, calmer state of mind

Ingredients:
Natural Wax, Essential Oils (Lavender, Lemongrass, Tea Tree Oil), Sacred Herbs (Basil Leaves, Lemon Peels), Charged Cleansing Crystal.

How to Use:
1. Place the candle on a stable, heat-resistant and non-flammable surface.
2. Take a few slow, deep breaths and settle yourself.
3. Before lighting the candle, identify what you wish to release—stress, worry, emotional heaviness, limiting thoughts or anything that no longer serves you.
4. Light the candle mindfully.
5. Gently focus on the flame and imagine the heaviness leaving your mind and space.
6. Set your intention by repeating: "I release what no longer serves me. I clear what feels heavy and make space for peace, clarity, light and renewal."
7. Spend 10–15 minutes in quiet reflection, meditation, prayer or journaling.
8. When your ritual is complete, extinguish the candle safely.

For Space Cleansing:
The Cleansing Candle can also be used as part of a mindful home or workspace cleansing ritual. Light the candle in the room you wish to refresh and allow yourself to sit quietly for a few moments.
Visualise the space becoming: Lighter • Calmer • Clearer • More Peaceful.

When to Use It:
- After a stressful or emotionally intense day
- After difficult conversations or experiences
- When moving into a new home or workspace
- Before meditation or prayer
- Before beginning a new chapter
- During personal cleansing rituals
- When your surroundings feel heavy or unsettled
- Before starting manifestation or spiritual practices
- As part of your weekly self-care routine

Create Your Ritual:
For a deeper experience, create a quiet space and remove distractions.
Before lighting the candle, write down what you are ready to release.
Then light the candle and spend a few minutes visualising yourself letting go.
You can imagine the flame transforming:
Stress into calm.
Confusion into clarity.
Heaviness into lightness.
Old energy into renewal.
Take a deep breath and consciously welcome what you want to carry forward.
Release.
Clear.
Renew.
Begin again. ✨

The Ascension Way:
At Ascension, we believe cleansing is an opportunity to pause, release and create space for something better.
The Ascension Cleansing Candle is a simple yet meaningful ritual tool—a reminder that you can consciously choose what you carry forward and what you are ready to leave behind.
Clear your space.
Release what weighs you down.
Welcome clarity.
Make space for new beginnings. 🕯️🌿

Important Information:
For ritual and ambience use only. Never leave a burning candle unattended. Keep away from children, pets, curtains, paper and all other flammable materials. Place on a stable, heat-resistant surface and keep away from drafts. Do not move the candle while it is burning or while the wax is liquid. Keep the wick trimmed according to the candle manufacturer's instructions. Extinguish completely after use and allow the wax to cool before handling. The Ascension Cleansing Candle is intended to complement personal wellness, mindfulness and spiritual practices. It does not guarantee removal of negative energy or specific spiritual outcomes and is not intended to diagnose, treat or cure any medical condition.`
  },
  {
    name: "Ascension Health Candle",
    category: "Candles",
    pricing: 699,
    stock: 50,
    images: [
      "/uploads/health_candle_1.jpeg",
      "/uploads/health_candle_2.jpeg"
    ],
    description: `Tagline: Restore • Rejuvenate • Renew

Create a calming ritual of wellness, relaxation and renewal with the Ascension Health Candle.

Thoughtfully created to complement your personal wellness and spiritual practices, this candle is designed to help you create a peaceful environment where you can slow down, quiet the mind and reconnect with your intention for health, vitality and overall wellbeing.

Whether used during meditation, prayer, yoga, self-care or your evening wind-down, the Health Candle transforms an ordinary moment into an intentional ritual dedicated to nurturing yourself.

Why Use:
- Create a calming and restorative atmosphere
- Support relaxation and mindfulness practices
- Set intentions around health, vitality and wellbeing
- Complement meditation, yoga and breathwork
- Create a peaceful space for prayer and reflection
- Support an intentional evening wind-down routine
- Encourage regular moments of rest and self-care
- Help you reconnect with yourself and your wellness goals

Ingredients:
Natural Wax, Essential Oils (Lavender, Sandalwood, Rosemary), Sacred Herbs (Basil Leaves, Marigold Flower), Charged Healing Crystal.

How to Use:
1. Place the candle on a stable, heat-resistant and non-flammable surface.
2. Take a few slow, deep breaths before lighting it.
3. Set an intention for your wellbeing—for example, balance, vitality, strength or inner peace.
4. Light the candle mindfully.
5. Sit comfortably and focus on the flame while allowing yourself to relax.
6. Spend 10–15 minutes in meditation, prayer, breathwork, journaling or quiet reflection.
7. You may repeat: "I honour my body, nurture my wellbeing and welcome balance, vitality and peace into my life."
8. When your ritual is complete, extinguish the candle safely.

For Meditation & Wellness:
The Health Candle can become an anchor for your daily wellness practice. Light it before meditation, yoga, breathwork or gentle stretching. Allow the flame to signal the beginning of your "me time"—a period where you consciously step away from distractions and focus on yourself.
Use this time to check in with your body and ask:
What does my body need today?
Where can I slow down?
What can I do to support my wellbeing?

When to Use It:
- In the morning as part of a mindful start
- Before meditation or yoga
- During breathwork or relaxation
- During prayer or spiritual practices
- After a tiring or stressful day
- During your evening self-care routine
- Before journaling or reflection
- Whenever you need a peaceful moment to reconnect with yourself

Create Your Ritual:
For a deeper experience, create a peaceful environment. Put your phone away, dim the lights and take a few deep breaths.
As the candle burns, focus on restoration rather than rushing.
Visualise yourself feeling balanced, energised and well.
Let the flame remind you that caring for yourself is not a luxury—it is a practice.
Pause.
Breathe.
Nurture.
Renew. ✨

The Ascension Way:
At Ascension, we believe wellbeing begins with conscious care of the body, mind and inner self.
The Ascension Health Candle is an invitation to create a regular ritual of mindfulness and self-care—a quiet space where you can reconnect with your intentions and make your wellbeing a priority.
Nurture your body.
Calm your mind.
Honour your wellbeing.
Rise renewed. 🌿🕯️

Important Information:
For ritual and ambience use only. Never leave a burning candle unattended. Keep away from children, pets, curtains, paper and all other flammable materials. Place on a stable, heat-resistant surface and keep away from drafts. Do not move the candle while it is burning or while the wax is liquid. Keep the wick trimmed according to the candle manufacturer's instructions. Extinguish completely after use and allow the wax to cool before handling. The Ascension Health Candle is intended to complement personal wellness, mindfulness and spiritual practices. It is not a medicine and does not diagnose, treat, cure or prevent any disease or medical condition.`
  },
  {
    name: "Ascension Love & Peace Candle",
    category: "Candles",
    pricing: 699,
    stock: 50,
    images: [
      "/uploads/love_peace_candle_1.jpeg",
      "/uploads/love_peace_candle_2.jpeg"
    ],
    description: `Tagline: Love • Peace • Harmony

Create a beautiful ritual of love, peace, emotional harmony and inner calm with the Ascension Love & Peace Candle.

Thoughtfully created to complement your spiritual wellness and self-care practices, this candle is designed to help you create a peaceful environment where you can slow down, release emotional heaviness and consciously invite more love, compassion, harmony and positivity into your life.

Whether you are nurturing self-love, working through emotional heaviness, setting intentions for harmonious relationships or simply creating a peaceful moment for yourself, the Love & Peace Candle can become a meaningful part of your daily ritual.

Why Use:
- Cultivate self-love and self-compassion
- Create a peaceful and harmonious atmosphere
- Encourage emotional calm and mindful reflection
- Support intentions around love and healthy relationships
- Complement meditation, prayer and mindfulness
- Create a ritual for forgiveness, acceptance and emotional release
- Support a peaceful evening or bedtime routine
- Complement manifestation and intention-setting practices

Ingredients:
Natural Wax, Pure Rose Essential Oil, Sacred Herbs (Rose Petals), Charged Rose Quartz Crystal.

How to Use:
1. Place the candle on a stable, heat-resistant and non-flammable surface.
2. Take a few slow, deep breaths and allow yourself to become present.
3. Before lighting the candle, decide what you wish to cultivate—love, peace, forgiveness, harmony or self-acceptance.
4. Light the candle mindfully.
5. Sit comfortably and gently focus on the flame.
6. Visualise yourself surrounded by a peaceful, loving energy.
7. Repeat an affirmation such as: "I choose love. I choose peace. I release what weighs on my heart and make space for harmony."
8. Spend 10–15 minutes in meditation, prayer, journaling or quiet reflection.
9. When finished, extinguish the candle safely.

For Self-Love & Emotional Healing:
Use the candle during moments dedicated to yourself. Write down something you are ready to release and something you wish to cultivate. As the candle burns, allow yourself to move from self-criticism towards acceptance, compassion and love.
Focus on: Self-Love • Acceptance • Forgiveness • Compassion • Inner Peace.

For Relationship Harmony:
The Love & Peace Candle can also be used when setting intentions for healthy and harmonious relationships. You may affirm: "I welcome healthy, loving and peaceful connections into my life. I give and receive love with openness, respect and understanding."

When to Use It:
- During self-love rituals
- Before meditation or prayer
- During journaling and reflection
- Before bedtime
- During manifestation practices
- After an emotionally difficult day
- When setting intentions for relationship harmony
- During personal spiritual practices
- Whenever you want to create a calm and loving atmosphere

Create Your Ritual:
For a deeper experience, create a quiet space and put away distractions.
Before lighting the candle, ask yourself:
What am I ready to release?
What am I ready to forgive?
What kind of love and peace do I want to cultivate?
Light the candle and spend a few moments focusing on the qualities you want to welcome.
Imagine the flame gently transforming:
Tension into peace.
Fear into trust.
Resentment into forgiveness.
Loneliness into connection.
Heaviness into lightness.
Allow the ritual to remind you that love and peace begin with the way you choose to care for yourself.

The Ascension Way:
At Ascension, we believe that love begins within and that peace is something we consciously cultivate.
The Ascension Love & Peace Candle is an invitation to slow down, reconnect with your heart and create a meaningful ritual around self-love, emotional harmony and peaceful connections.
Release the heaviness.
Open your heart.
Choose peace.
Make space for love. 💗🕯️

Important Information:
For ritual and ambience use only. Never leave a burning candle unattended. Keep away from children, pets, curtains, paper and all other flammable materials. Place on a stable, heat-resistant surface and keep away from drafts. Do not move the candle while it is burning or while the wax is liquid. Keep the wick trimmed according to the candle manufacturer's instructions. Extinguish completely after use and allow the wax to cool before handling. The Ascension Love & Peace Candle is intended to complement personal wellness, mindfulness and spiritual practices. It does not guarantee specific emotional, relationship or manifestation outcomes and is not intended to diagnose, treat or cure any medical condition.`
  }
];

const outputPath = path.join(__dirname, 'extracted_products.json');
fs.writeFileSync(outputPath, JSON.stringify(products, null, 2), 'utf-8');
console.log(`Successfully written ${products.length} products with ingredients to ${outputPath}`);
