const affirmationAssignments = [
  {
    day: 1,
    title: "Affirmations to Release Anger",
    description: "Welcome to Day 1. Listen to today's daily affirmations session to release pent-up anger, soothe your spirit, and bring emotional release.\n\nYouTube Link: https://www.youtube.com/watch?v=c97Tg9DfPNA",
    action: "Listen to the 30-minute affirmations session silently, repeat the assertions in your mind, and click below to mark the day as complete."
  },
  {
    day: 2,
    title: "Affirmations for Healing Anxiety",
    description: "Welcome to Day 2. Listen to today's healing affirmations to center yourself, release anxiety, and invite calmness into your day.\n\nYouTube Link: https://www.youtube.com/watch?v=LO8UcGVh1Xg",
    action: "Listen to the affirmations session, breathe deeply, and mark the day as complete once done."
  },
  {
    day: 3,
    title: "Affirmations For Inner Peace",
    description: "Welcome to Day 3. Connect with your core self and find lasting peace in today's calming meditation session.\n\nYouTube Link: https://www.youtube.com/watch?v=OqzpGoghKn8",
    action: "Listen to the session, feel the presence of peace within you, and mark this day as complete."
  },
  {
    day: 4,
    title: "Affirmations for Success",
    description: "Welcome to Day 4. Align your energy with abundance, confidence, and victory by listening to today's success affirmations.\n\nYouTube Link: https://www.youtube.com/watch?v=SVk4KOg5Pgg",
    action: "Listen to the success affirmations, absorb the positive vibrations, and mark this day as complete."
  },
  {
    day: 5,
    title: "Affirmations for Healthy Relationships",
    description: "Welcome to Day 5. Focus on cultivating love, mutual respect, and healthy boundaries in your relationships.\n\nYouTube Link: https://www.youtube.com/watch?v=4JDaRF25t5o",
    action: "Listen to the affirmations session, visualize healthy connections in your life, and mark the day as complete."
  },
  {
    day: 6,
    title: "Affirmations for Releasing Blame",
    description: "Welcome to Day 6. Take complete ownership of your experiences and let go of blame, finding freedom in responsibility.\n\nYouTube Link: https://www.youtube.com/watch?v=pFhzW2Nsqp8",
    action: "Listen to today's affirmations, release the need to blame others or yourself, and mark the day as complete."
  },
  {
    day: 7,
    title: "Affirmations For Healthy Body and Mind",
    description: "Welcome to Day 7. Affirm physical wellness, mental strength, and the perfect harmony of your body and mind.\n\nYouTube Link: https://www.youtube.com/watch?v=JsHYizRuQD0",
    action: "Listen to the wellness affirmations, feel your body and mind vibrating with health, and mark the day as complete."
  },
  {
    day: 8,
    title: "Affirmations For Releasing Fear",
    description: "Welcome to Day 8. Stand in your true power by releasing worries, doubts, and fears that hold you back.\n\nYouTube Link: https://www.youtube.com/watch?v=kLX7y4pTIYw",
    action: "Listen to today's session, breathe away your fears, and mark this day as complete."
  },
  {
    day: 9,
    title: "Affirmations for Forgiveness",
    description: "Welcome to Day 9. Heal old wounds and cultivate forgiveness for yourself and others through today's session.\n\nYouTube Link: https://www.youtube.com/watch?v=F1JTRwmMOJM",
    action: "Listen to the forgiveness affirmations, let go of past grievances, and mark the day as complete."
  },
  {
    day: 10,
    title: "Affirmations for Gratitude",
    description: "Welcome to Day 10. Open your heart to the infinite gifts of the universe by practicing deep gratitude.\n\nYouTube Link: https://www.youtube.com/watch?v=r3Ea9KK_3xg",
    action: "Listen to the gratitude session, feel thankful for all the blessings in your life, and mark the day as complete."
  },
  {
    day: 11,
    title: "Affirmations for Money and Finance",
    description: "Welcome to Day 11. Restructure your money mindset and attract financial freedom and abundance.\n\nYouTube Link: https://www.youtube.com/watch?v=-x36KIxOSIM",
    action: "Listen to today's abundance affirmations, welcome financial flow, and mark this day as complete."
  },
  {
    day: 12,
    title: "Affirmations for Self Love",
    description: "Welcome to Day 12. Celebrate who you are, honor your worth, and cultivate unconditional self-love.\n\nYouTube Link: https://www.youtube.com/watch?v=35D8xvjbwLw",
    action: "Listen to the self-love affirmations, embrace your uniqueness, and mark this day as complete."
  },
  {
    day: 13,
    title: "Affirmations to Release Bad Habits",
    description: "Welcome to Day 13. Reclaim control over your choices and dissolve limiting habits or behaviors.\n\nYouTube Link: https://www.youtube.com/watch?v=OLNDUtiBZYE",
    action: "Listen to today's session, reaffirm your willpower, and mark the day as complete."
  },
  {
    day: 14,
    title: "Affirmations On Guilt",
    description: "Welcome to Day 14. Forgive yourself for past mistakes, let go of heavy guilt, and step into self-acceptance.\n\nYouTube Link: https://www.youtube.com/watch?v=mKbdlekSoto",
    action: "Listen to the affirmations session, breathe out all feelings of guilt, and mark this day as complete."
  },
  {
    day: 15,
    title: "Affirmations for Self Esteem and Confidence",
    description: "Welcome to Day 15. Empower your voice, honor your boundaries, and build unshakeable confidence.\n\nYouTube Link: https://www.youtube.com/watch?v=KlhhcpQoh3c",
    action: "Listen to today's confidence session, stand tall in your value, and mark this day as complete."
  },
  {
    day: 16,
    title: "Affirmations For Will Power",
    description: "Welcome to Day 16. Re-align with your inner drive, persistence, and focus to achieve your high goals.\n\nYouTube Link: https://www.youtube.com/watch?v=3RmvQABzDao",
    action: "Listen to the willpower affirmations, feel your determination rising, and mark this day as complete."
  },
  {
    day: 17,
    title: "Affirmations for Manifesting Abundance",
    description: "Welcome to Day 17. Tap into the infinite abundance of the universe and align with wealth and prosperity.\n\nYouTube Link: https://www.youtube.com/watch?v=ggVwLsl0nSo",
    action: "Listen to today's manifesting session, believe in your unlimited wealth, and mark this day as complete."
  },
  {
    day: 18,
    title: "Affirmations For Chakras",
    description: "Welcome to Day 18. Balance, cleanse, and align all your major energy centers (chakras) to feel grounded and vitalized.\n\nYouTube Link: https://www.youtube.com/watch?v=V1jZ_yaMfao",
    action: "Listen to the chakra balancing session, visualize energy flowing freely through you, and mark this day as complete."
  },
  {
    day: 19,
    title: "Affirmations on Guilt",
    description: "Welcome to Day 19. Continue your release of past regrets and anchor yourself firmly in the present moment.\n\nYouTube Link: https://www.youtube.com/watch?v=g-IqXXGNLzE",
    action: "Listen to today's session, release any lingering shadows of self-doubt, and mark the day as complete."
  },
  {
    day: 20,
    title: "Daily Affirmation Practice",
    description: "Welcome to Day 20. Reflect on the shifts you've experienced over the last 19 days. Focus on breathing deeply and repeating your favorite affirmations from this program.\n\nYouTube Link: https://www.youtube.com/watch?v=g-IqXXGNLzE",
    action: "Practice silent affirmations today, note down your positive shifts in your journal, and click below to complete the day."
  },
  {
    day: 21,
    title: "Final Affirmation Integration",
    description: "Welcome to Day 21. Celebrate your dedication and complete this beautiful journey. Stand firmly in your power as the creator of your reality.\n\nYouTube Link: https://www.youtube.com/watch?v=g-IqXXGNLzE",
    action: "Listen to the integration session, celebrate your commitment to growth, and mark the final day as complete!"
  }
];

export default affirmationAssignments;
